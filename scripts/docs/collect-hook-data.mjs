import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const hooksDir = path.join(rootDir, 'packages/ui/src/hooks');
const outputPath = path.join(
  rootDir,
  'apps/ui-app/src/apiReference/generated/hooks.ts'
);
const packageJsonPath = path.join(rootDir, 'packages/ui/package.json');
const tsConfigPath = path.join(rootDir, 'packages/ui/tsconfig.build.json');
const sourceCodeUrlBase =
  'https://github.com/themeshift-dev/themeshift/tree/develop/packages/ui/src/hooks';

function normalizePath(filePath) {
  return path.normalize(filePath);
}

async function hasIndexFile(hookName) {
  try {
    const indexPath = path.join(hooksDir, hookName, 'index.ts');
    const indexStat = await stat(indexPath);

    return indexStat.isFile();
  } catch {
    return false;
  }
}

async function getHookNames() {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const exportKeys = Object.keys(packageJson.exports ?? {});
  const exportedHookNames = exportKeys
    .filter((key) => key.startsWith('./hooks/'))
    .map((key) => key.replace('./hooks/', ''))
    .filter((hookName) => hookName.length > 0 && !hookName.includes('/'));
  const uniqueExportedHookNames = [...new Set(exportedHookNames)];
  const entries = await readdir(hooksDir, { withFileTypes: true });
  const hookDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const hookNamesToCheck = hookDirectories.filter((hookName) =>
    uniqueExportedHookNames.includes(hookName)
  );
  const hookChecks = await Promise.all(
    hookNamesToCheck.map(async (hookName) => ({
      hookName,
      hasIndexFile: await hasIndexFile(hookName),
      isExported: uniqueExportedHookNames.includes(hookName),
    }))
  );

  return hookChecks
    .filter(({ hasIndexFile, isExported }) => hasIndexFile && isExported)
    .map(({ hookName }) => hookName)
    .sort((first, second) => first.localeCompare(second));
}

function createProgram() {
  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);

  if (configFile.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n')
    );
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsConfigPath)
  );

  return ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
}

function createAnalyzer(program) {
  const sourceFiles = program
    .getSourceFiles()
    .filter((sourceFile) =>
      normalizePath(sourceFile.fileName).startsWith(normalizePath(hooksDir))
    );

  return {
    collectApiReference(hookName) {
      const hookSourceFiles = sourceFiles.filter((sourceFile) =>
        normalizePath(sourceFile.fileName).startsWith(
          normalizePath(path.join(hooksDir, hookName))
        )
      );

      const declarations = getLocalTypeDeclarations(hookSourceFiles);
      const hookFunction = findExportedHookFunction(hookName, hookSourceFiles);

      if (!hookFunction) {
        return [];
      }

      const defaults = collectHookDefaults(hookFunction);
      const optionsTypeName = getHookOptionsTypeName(hookFunction);

      if (!optionsTypeName) {
        return [];
      }

      return collectTargetOptions({
        declarations,
        defaults,
        displayName: hookName,
        optionsTypeName,
      });
    },
    collectReturnReference(hookName) {
      const hookSourceFiles = sourceFiles.filter((sourceFile) =>
        normalizePath(sourceFile.fileName).startsWith(
          normalizePath(path.join(hooksDir, hookName))
        )
      );
      const declarations = getLocalTypeDeclarations(hookSourceFiles);
      const hookFunction = findExportedHookFunction(hookName, hookSourceFiles);

      if (!hookFunction?.type) {
        return [];
      }

      return collectHookReturnReference({
        declarations,
        hookName,
        returnTypeNode: hookFunction.type,
      });
    },
  };
}

function findExportedHookFunction(hookName, sourceFiles) {
  for (const sourceFile of sourceFiles) {
    let found = null;

    ts.forEachChild(sourceFile, (node) => {
      if (found) {
        return;
      }

      if (
        ts.isFunctionDeclaration(node) &&
        node.name &&
        ts.isIdentifier(node.name) &&
        node.name.text === hookName &&
        node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
        )
      ) {
        found = node;
      }
    });

    if (found) {
      return found;
    }
  }

  return null;
}

function getHookOptionsTypeName(hookFunction) {
  const optionsParameter = hookFunction.parameters[0];

  if (!optionsParameter?.type) {
    return null;
  }

  if (ts.isTypeReferenceNode(optionsParameter.type)) {
    return getEntityNameText(optionsParameter.type.typeName);
  }

  return null;
}

function getEntityNameText(name) {
  if (ts.isIdentifier(name)) {
    return name.text;
  }

  if (ts.isQualifiedName(name)) {
    return `${getEntityNameText(name.left)}.${name.right.text}`;
  }

  return '';
}

function getLocalTypeDeclarations(sourceFiles) {
  const declarations = new Map();

  for (const sourceFile of sourceFiles) {
    ts.forEachChild(sourceFile, function visit(node) {
      if (
        (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) &&
        ts.isIdentifier(node.name)
      ) {
        declarations.set(node.name.text, node);
      }

      ts.forEachChild(node, visit);
    });
  }

  return declarations;
}

function collectHookDefaults(hookFunction) {
  const defaults = new Map();
  const optionsParameter = hookFunction.parameters[0];

  if (!optionsParameter?.name) {
    return defaults;
  }

  if (!ts.isObjectBindingPattern(optionsParameter.name)) {
    const fallbackDefaults = collectHookFallbackDefaults(hookFunction);

    for (const [key, value] of fallbackDefaults.entries()) {
      defaults.set(key, value);
    }

    return defaults;
  }

  for (const element of optionsParameter.name.elements) {
    const propName = getBindingElementName(element);

    if (propName && element.initializer) {
      defaults.set(propName, formatDefaultValue(element.initializer));
    }
  }

  return defaults;
}

function collectHookFallbackDefaults(hookFunction) {
  const defaults = new Map();
  const optionsParameter = hookFunction.parameters[0];

  if (!hookFunction.body || !optionsParameter?.name) {
    return defaults;
  }

  if (!ts.isIdentifier(optionsParameter.name)) {
    return defaults;
  }

  const optionsName = optionsParameter.name.text;

  ts.forEachChild(hookFunction.body, function visit(node) {
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
    ) {
      const left = unwrapExpression(node.left);
      const rightDefault = formatDefaultValue(node.right);

      if (
        left &&
        (ts.isPropertyAccessExpression(left) || ts.isPropertyAccessChain(left))
      ) {
        const target = left.expression;

        if (
          ts.isIdentifier(target) &&
          target.text === optionsName &&
          ts.isIdentifier(left.name)
        ) {
          const propName = left.name.text;

          if (
            typeof rightDefault === 'string' ||
            typeof rightDefault === 'number' ||
            typeof rightDefault === 'boolean'
          ) {
            if (rightDefault !== 'object') {
              defaults.set(propName, rightDefault);
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  });

  return defaults;
}

function getBindingElementName(element) {
  const name = element.propertyName ?? element.name;

  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return null;
}

function formatDefaultValue(expression) {
  const unwrapped = unwrapExpression(expression);

  if (
    ts.isStringLiteral(unwrapped) ||
    ts.isNoSubstitutionTemplateLiteral(unwrapped)
  ) {
    return unwrapped.text;
  }

  if (ts.isNumericLiteral(unwrapped)) {
    return Number(unwrapped.text);
  }

  if (unwrapped.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (unwrapped.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (
    ts.isArrayLiteralExpression(unwrapped) ||
    ts.isArrowFunction(unwrapped) ||
    ts.isCallExpression(unwrapped) ||
    ts.isFunctionExpression(unwrapped) ||
    ts.isNewExpression(unwrapped) ||
    ts.isObjectLiteralExpression(unwrapped)
  ) {
    return 'object';
  }

  if (
    ts.isPrefixUnaryExpression(unwrapped) &&
    ts.isNumericLiteral(unwrapped.operand)
  ) {
    return unwrapped.operator === ts.SyntaxKind.MinusToken
      ? -Number(unwrapped.operand.text)
      : Number(unwrapped.operand.text);
  }

  return null;
}

function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return null;
}

function getJsDocText(node) {
  const docs = node.jsDoc;

  if (!docs || docs.length === 0) {
    return '';
  }

  const parts = [];

  for (const doc of docs) {
    if (!doc.comment) {
      continue;
    }

    if (typeof doc.comment === 'string') {
      parts.push(doc.comment);
      continue;
    }

    parts.push(
      doc.comment
        .map((part) => ('text' in part ? part.text : ''))
        .join('')
        .trim()
    );
  }

  return parts.join('\n\n').trim();
}

function getLiteralUnionValues(typeNode) {
  if (!typeNode || !ts.isUnionTypeNode(typeNode)) {
    return [];
  }

  const values = [];

  for (const unionMember of typeNode.types) {
    if (!ts.isLiteralTypeNode(unionMember)) {
      continue;
    }

    const literal = unionMember.literal;

    if (ts.isStringLiteral(literal)) {
      values.push(literal.text);
    } else if (ts.isNumericLiteral(literal)) {
      values.push(Number(literal.text));
    } else if (literal.kind === ts.SyntaxKind.TrueKeyword) {
      values.push(true);
    } else if (literal.kind === ts.SyntaxKind.FalseKeyword) {
      values.push(false);
    }
  }

  return values;
}

function getKeywordTypeText(kind) {
  const keywordTypes = {
    [ts.SyntaxKind.AnyKeyword]: 'any',
    [ts.SyntaxKind.BigIntKeyword]: 'bigint',
    [ts.SyntaxKind.BooleanKeyword]: 'boolean',
    [ts.SyntaxKind.NeverKeyword]: 'never',
    [ts.SyntaxKind.NullKeyword]: 'null',
    [ts.SyntaxKind.NumberKeyword]: 'number',
    [ts.SyntaxKind.ObjectKeyword]: 'object',
    [ts.SyntaxKind.StringKeyword]: 'string',
    [ts.SyntaxKind.SymbolKeyword]: 'symbol',
    [ts.SyntaxKind.UndefinedKeyword]: 'undefined',
    [ts.SyntaxKind.UnknownKeyword]: 'unknown',
    [ts.SyntaxKind.VoidKeyword]: 'void',
  };

  return keywordTypes[kind] ?? '';
}

function formatLiteralType(literal) {
  if (ts.isStringLiteral(literal)) {
    return JSON.stringify(literal.text);
  }

  if (ts.isNumericLiteral(literal)) {
    return literal.text;
  }

  if (literal.kind === ts.SyntaxKind.TrueKeyword) {
    return 'true';
  }

  if (literal.kind === ts.SyntaxKind.FalseKeyword) {
    return 'false';
  }

  if (
    ts.isPrefixUnaryExpression(literal) &&
    ts.isNumericLiteral(literal.operand)
  ) {
    return literal.operator === ts.SyntaxKind.MinusToken
      ? `-${literal.operand.text}`
      : literal.operand.text;
  }

  return '';
}

function getNodeText(node) {
  if (ts.isIdentifier(node)) {
    return node.text;
  }

  if (ts.isTypeReferenceNode(node)) {
    const typeArguments = node.typeArguments
      ? `<${node.typeArguments.map(getNodeText).join(', ')}>`
      : '';

    return `${getEntityNameText(node.typeName)}${typeArguments}`;
  }

  if (ts.isIndexedAccessTypeNode(node)) {
    return `${getNodeText(node.objectType)}[${getNodeText(node.indexType)}]`;
  }

  if (ts.isLiteralTypeNode(node)) {
    return formatLiteralType(node.literal);
  }

  if (ts.isUnionTypeNode(node) || ts.isIntersectionTypeNode(node)) {
    const separator = ts.isUnionTypeNode(node) ? ' | ' : ' & ';

    return node.types.map(getNodeText).join(separator);
  }

  if (ts.isTypeLiteralNode(node)) {
    return 'object';
  }

  if (ts.isArrayTypeNode(node)) {
    return `${getNodeText(node.elementType)}[]`;
  }

  if (ts.isTypeOperatorNode(node)) {
    return `${ts.tokenToString(node.operator) ?? ''} ${getNodeText(node.type)}`.trim();
  }

  if (ts.isFunctionTypeNode(node) || ts.isConstructorTypeNode(node)) {
    return safeGetNodeText(node) || formatFunctionType(node) || 'function';
  }

  return safeGetNodeText(node) || getKeywordTypeText(node.kind);
}

function formatFunctionType(node) {
  const typeParametersText = node.typeParameters?.length
    ? `<${node.typeParameters.map(formatTypeParameter).join(', ')}>`
    : '';
  const parametersText = node.parameters
    .map(formatFunctionParameter)
    .join(', ');
  const returnTypeText = node.type ? getTypeText(node.type) : 'void';
  const prefix = ts.isConstructorTypeNode(node) ? 'new ' : '';

  return `${prefix}${typeParametersText}(${parametersText}) => ${returnTypeText}`;
}

function formatFunctionParameter(parameter) {
  const restText = parameter.dotDotDotToken ? '...' : '';
  const nameText = getFunctionParameterName(parameter.name);
  const optionalText = parameter.questionToken ? '?' : '';
  const typeText = parameter.type ? getTypeText(parameter.type) : 'unknown';

  return `${restText}${nameText}${optionalText}: ${typeText}`;
}

function formatTypeParameter(parameter) {
  const nameText = parameter.name.text;
  const constraintText = parameter.constraint
    ? ` extends ${getTypeText(parameter.constraint)}`
    : '';
  const defaultText = parameter.default
    ? ` = ${getTypeText(parameter.default)}`
    : '';

  return `${nameText}${constraintText}${defaultText}`;
}

function getFunctionParameterName(nameNode) {
  if (ts.isIdentifier(nameNode)) {
    return nameNode.text;
  }

  if (
    ts.isObjectBindingPattern(nameNode) ||
    ts.isArrayBindingPattern(nameNode)
  ) {
    return safeGetNodeText(nameNode) || 'arg';
  }

  return safeGetNodeText(nameNode) || 'arg';
}

function safeGetNodeText(node) {
  const sourceFile = node.getSourceFile?.();

  if (sourceFile) {
    try {
      return node.getText(sourceFile).trim();
    } catch {
      // fall through
    }
  }

  try {
    return node.getText().trim();
  } catch {
    if (!sourceFile) {
      return '';
    }

    try {
      return ts
        .createPrinter({ removeComments: true })
        .printNode(ts.EmitHint.Unspecified, node, sourceFile)
        .trim();
    } catch {
      if (
        typeof node.pos === 'number' &&
        typeof node.end === 'number' &&
        node.pos >= 0 &&
        node.end > node.pos
      ) {
        return sourceFile.text.slice(node.pos, node.end).trim();
      }

      return '';
    }
  }
}

function getTypeText(typeNode) {
  if (!typeNode) {
    return 'unknown';
  }

  const keyword = getKeywordTypeText(typeNode.kind);

  if (keyword) {
    return keyword;
  }

  return getNodeText(typeNode) || 'unknown';
}

function collectTargetOptions({
  declarations,
  defaults,
  displayName,
  optionsTypeName,
}) {
  const optionMap = new Map();

  collectTypeName({
    declarations,
    displayName,
    optionMap,
    typeName: optionsTypeName,
    visited: new Set(),
  });

  for (const item of optionMap.values()) {
    item.defaultValue = defaults.get(item.propName) ?? null;
  }

  return [...optionMap.values()].sort((first, second) =>
    first.propName.localeCompare(second.propName)
  );
}

function collectTypeName({
  declarations,
  displayName,
  optionMap,
  typeName,
  visited,
}) {
  const declaration = declarations.get(typeName);

  if (!declaration || visited.has(typeName)) {
    return;
  }

  visited.add(typeName);

  if (ts.isInterfaceDeclaration(declaration)) {
    collectMembers({
      declarations,
      displayName,
      members: declaration.members,
      optionMap,
      visited,
    });
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    collectTypeNode({
      declarations,
      displayName,
      optionMap,
      typeNode: declaration.type,
      visited,
    });
  }

  visited.delete(typeName);
}

function collectTypeNode({
  declarations,
  displayName,
  optionMap,
  typeNode,
  visited,
}) {
  if (!typeNode) {
    return;
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    collectTypeNode({
      declarations,
      displayName,
      optionMap,
      typeNode: typeNode.type,
      visited,
    });
    return;
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    collectMembers({
      declarations,
      displayName,
      members: typeNode.members,
      optionMap,
      visited,
    });
    return;
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    for (const part of typeNode.types) {
      collectTypeNode({
        declarations,
        displayName,
        optionMap,
        typeNode: part,
        visited,
      });
    }
    return;
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    collectTypeName({
      declarations,
      displayName,
      optionMap,
      typeName: getEntityNameText(typeNode.typeName),
      visited,
    });
  }
}

function collectMembers({
  declarations,
  displayName,
  members,
  optionMap,
  visited,
}) {
  for (const member of members) {
    if (!ts.isPropertySignature(member)) {
      continue;
    }

    const propName = member.name ? getPropertyName(member.name) : null;

    if (!propName) {
      continue;
    }

    optionMap.set(propName, {
      comments: getJsDocText(member),
      defaultValue: null,
      displayName,
      propName,
      type: getTypeText(member.type),
      values: getLiteralUnionValues(member.type),
    });
  }
}

const scalarReturnKinds = new Set([
  ts.SyntaxKind.AnyKeyword,
  ts.SyntaxKind.BigIntKeyword,
  ts.SyntaxKind.BooleanKeyword,
  ts.SyntaxKind.NeverKeyword,
  ts.SyntaxKind.NullKeyword,
  ts.SyntaxKind.NumberKeyword,
  ts.SyntaxKind.StringKeyword,
  ts.SyntaxKind.SymbolKeyword,
  ts.SyntaxKind.UndefinedKeyword,
  ts.SyntaxKind.UnknownKeyword,
  ts.SyntaxKind.VoidKeyword,
]);

function createApiReferenceItem({
  comments = '',
  displayName,
  propName,
  type,
  values = [],
}) {
  return {
    comments,
    defaultValue: null,
    displayName,
    propName,
    type,
    values,
  };
}

function collectHookReturnReference({
  declarations,
  hookName,
  returnTypeNode,
}) {
  const returnType = unwrapTypeNode(returnTypeNode);

  if (ts.isTupleTypeNode(returnType)) {
    return collectTupleReturnItems(returnType, hookName);
  }

  if (isScalarReturnType(returnType)) {
    return [
      createApiReferenceItem({
        comments: '',
        displayName: hookName,
        propName: 'value',
        type: getTypeText(returnType),
        values: getLiteralUnionValues(returnType),
      }),
    ];
  }

  if (ts.isTypeReferenceNode(returnType)) {
    const typeName = getEntityNameText(returnType.typeName);
    const topLevelItems = collectMembersFromTypeName({
      declarations,
      displayName: hookName,
      typeName,
      visited: new Set(),
    });

    if (hookName === 'useForm') {
      return expandUseFormStateItems({
        declarations,
        displayName: hookName,
        items: topLevelItems,
        visited: new Set(),
      });
    }

    return topLevelItems;
  }

  if (ts.isTypeLiteralNode(returnType)) {
    return collectTypeLiteralItems({
      displayName: hookName,
      members: returnType.members,
    });
  }

  return [];
}

function unwrapTypeNode(typeNode) {
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return unwrapTypeNode(typeNode.type);
  }

  return typeNode;
}

function isScalarReturnType(typeNode) {
  return scalarReturnKinds.has(typeNode.kind);
}

function collectMembersFromTypeName({
  declarations,
  displayName,
  typeName,
  visited,
}) {
  const declaration = declarations.get(typeName);

  if (!declaration || visited.has(typeName)) {
    return [];
  }

  visited.add(typeName);

  if (ts.isInterfaceDeclaration(declaration)) {
    return collectTypeLiteralItems({
      displayName,
      members: declaration.members,
    });
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    return collectItemsFromTypeNode({
      declarations,
      displayName,
      typeNode: declaration.type,
      visited,
    });
  }

  return [];
}

function collectItemsFromTypeNode({
  declarations,
  displayName,
  typeNode,
  visited,
}) {
  const node = unwrapTypeNode(typeNode);

  if (ts.isTypeLiteralNode(node)) {
    return collectTypeLiteralItems({
      displayName,
      members: node.members,
    });
  }

  if (ts.isIntersectionTypeNode(node)) {
    return node.types.flatMap((part) =>
      collectItemsFromTypeNode({
        declarations,
        displayName,
        typeNode: part,
        visited,
      })
    );
  }

  if (ts.isTupleTypeNode(node)) {
    return collectTupleReturnItems(node, displayName);
  }

  if (isScalarReturnType(node)) {
    return [
      createApiReferenceItem({
        comments: '',
        displayName,
        propName: 'value',
        type: getTypeText(node),
        values: getLiteralUnionValues(node),
      }),
    ];
  }

  if (ts.isTypeReferenceNode(node)) {
    return collectMembersFromTypeName({
      declarations,
      displayName,
      typeName: getEntityNameText(node.typeName),
      visited,
    });
  }

  return [];
}

function collectTypeLiteralItems({ displayName, members }) {
  const items = [];

  for (const member of members) {
    if (!ts.isPropertySignature(member)) {
      continue;
    }

    const propName = member.name ? getPropertyName(member.name) : null;

    if (!propName) {
      continue;
    }

    items.push(
      createApiReferenceItem({
        comments: getJsDocText(member),
        displayName,
        propName,
        type: getTypeText(member.type),
        values: getLiteralUnionValues(member.type),
      })
    );
  }

  return items.sort((first, second) =>
    first.propName.localeCompare(second.propName)
  );
}

function collectTupleReturnItems(tupleTypeNode, hookName) {
  return tupleTypeNode.elements.map((element, index) => {
    const elementType = ts.isNamedTupleMember(element) ? element.type : element;
    const label = ts.isNamedTupleMember(element)
      ? getPropertyName(element.name)
      : null;
    const propName = label ?? String(index);
    const comments = ts.isNamedTupleMember(element)
      ? getJsDocText(element)
      : '';

    return createApiReferenceItem({
      comments,
      displayName: hookName,
      propName,
      type: getTypeText(elementType),
      values: getLiteralUnionValues(elementType),
    });
  });
}

function expandUseFormStateItems({
  declarations,
  displayName,
  items,
  visited,
}) {
  const expanded = [];
  const formStateItems = collectNestedPropertyItemsFromTypeName({
    declarations,
    displayName,
    propertyName: 'formState',
    typeName: 'FormApi',
    visited: new Set(visited),
  });

  for (const item of items) {
    expanded.push(item);

    if (item.propName !== 'formState') {
      continue;
    }

    for (const formStateItem of formStateItems) {
      expanded.push({
        ...formStateItem,
        propName: `formState.${formStateItem.propName}`,
      });
    }
  }

  return expanded.sort((first, second) =>
    first.propName.localeCompare(second.propName)
  );
}

function collectNestedPropertyItemsFromTypeName({
  declarations,
  displayName,
  propertyName,
  typeName,
  visited,
}) {
  const declaration = declarations.get(typeName);

  if (!declaration || visited.has(typeName)) {
    return [];
  }

  visited.add(typeName);

  if (ts.isInterfaceDeclaration(declaration)) {
    return collectNestedPropertyItemsFromMembers({
      declarations,
      displayName,
      members: declaration.members,
      propertyName,
      visited,
    });
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    const node = unwrapTypeNode(declaration.type);

    if (ts.isTypeLiteralNode(node)) {
      return collectNestedPropertyItemsFromMembers({
        declarations,
        displayName,
        members: node.members,
        propertyName,
        visited,
      });
    }
  }

  return [];
}

function collectNestedPropertyItemsFromMembers({
  declarations,
  displayName,
  members,
  propertyName,
  visited,
}) {
  const nestedProperty = members.find(
    (member) =>
      ts.isPropertySignature(member) &&
      member.name &&
      getPropertyName(member.name) === propertyName
  );

  if (!nestedProperty || !ts.isPropertySignature(nestedProperty)) {
    return [];
  }

  if (!nestedProperty.type) {
    return [];
  }

  return collectItemsFromTypeNode({
    declarations,
    displayName,
    typeNode: nestedProperty.type,
    visited,
  });
}

async function readHookMeta(hookName) {
  const metaPath = path.join(hooksDir, hookName, `${hookName}.meta.ts`);

  try {
    const sourceText = await readFile(metaPath, 'utf8');
    const sourceFile = ts.createSourceFile(
      metaPath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

    return getMetaFromSourceFile(sourceFile);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return null;
    }

    throw error;
  }
}

function getMetaFromSourceFile(sourceFile) {
  let meta = null;

  ts.forEachChild(sourceFile, (node) => {
    if (
      !ts.isVariableStatement(node) ||
      !node.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
      )
    ) {
      return;
    }

    for (const declaration of node.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        declaration.name.text !== 'meta'
      ) {
        continue;
      }

      if (!declaration.initializer) {
        throw new Error(
          `Found exported meta in ${sourceFile.fileName}, but it has no initializer.`
        );
      }

      meta = evaluateMetaExpression(
        declaration.initializer,
        sourceFile.fileName
      );
    }
  });

  return meta;
}

function unwrapExpression(expression) {
  if (
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isParenthesizedExpression(expression)
  ) {
    return unwrapExpression(expression.expression);
  }

  return expression;
}

function evaluateMetaExpression(expression, filePath) {
  const unwrapped = unwrapExpression(expression);

  if (!ts.isObjectLiteralExpression(unwrapped)) {
    throw new Error(
      `Expected exported meta in ${filePath} to be an object literal.`
    );
  }

  return evaluateObjectLiteral(unwrapped, filePath);
}

function evaluateObjectLiteral(node, filePath) {
  const result = {};

  for (const property of node.properties) {
    if (ts.isPropertyAssignment(property)) {
      const key = getPropertyName(property.name);

      if (!key) {
        throw new Error(`Unsupported meta property name in ${filePath}.`);
      }

      result[key] = evaluateMetaValue(property.initializer, filePath);
      continue;
    }

    if (ts.isShorthandPropertyAssignment(property)) {
      throw new Error(
        `Shorthand properties are not supported in meta files: ${filePath}`
      );
    }

    throw new Error(`Unsupported property syntax in meta file: ${filePath}`);
  }

  return result;
}

function evaluateMetaValue(expression, filePath) {
  const unwrapped = unwrapExpression(expression);

  if (
    ts.isStringLiteral(unwrapped) ||
    ts.isNoSubstitutionTemplateLiteral(unwrapped)
  ) {
    return unwrapped.text;
  }

  if (ts.isNumericLiteral(unwrapped)) {
    return Number(unwrapped.text);
  }

  if (unwrapped.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (unwrapped.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (unwrapped.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (ts.isArrayLiteralExpression(unwrapped)) {
    return unwrapped.elements.map((element) =>
      evaluateMetaValue(element, filePath)
    );
  }

  if (ts.isObjectLiteralExpression(unwrapped)) {
    return evaluateObjectLiteral(unwrapped, filePath);
  }

  if (
    ts.isPrefixUnaryExpression(unwrapped) &&
    ts.isNumericLiteral(unwrapped.operand)
  ) {
    return unwrapped.operator === ts.SyntaxKind.MinusToken
      ? -Number(unwrapped.operand.text)
      : Number(unwrapped.operand.text);
  }

  throw new Error(
    `Unsupported meta value in ${filePath}: ${unwrapped.getText()}`
  );
}

async function createHookData(hookName, analyzer) {
  const importPath = `@themeshift/ui/hooks/${hookName}`;
  const meta = await readHookMeta(hookName);

  return {
    apiReference: analyzer.collectApiReference(hookName),
    returnReference: analyzer.collectReturnReference(hookName),
    name: hookName,
    exportName: hookName,
    importPath,
    importString: `import { ${hookName} } from '${importPath}';`,
    meta: meta ? { ...meta, type: 'hook' } : null,
    slug: hookName.toLowerCase(),
    routeSlug: hookName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
    sourceCodeUrl: `${sourceCodeUrlBase}/${hookName}`,
    type: 'hook',
  };
}

async function createOutput(hookData) {
  const output = `import type { ApiReferenceHook } from '../types';

export const hooks = ${JSON.stringify(hookData, null, 2)} satisfies ApiReferenceHook[];
`;

  return prettier.format(output, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'es5',
  });
}

const hookNames = await getHookNames();
const analyzer = createAnalyzer(createProgram());
const hookData = await Promise.all(
  hookNames.map((hookName) => createHookData(hookName, analyzer))
);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, await createOutput(hookData));

console.log(`Collected hook data for ${hookData.length} hooks`);
