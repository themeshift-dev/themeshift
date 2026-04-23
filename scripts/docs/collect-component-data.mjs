import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';

import { apiReferenceOverrides } from './collect-component-data.config.mjs';
import { syncUiComponentBadges } from '../update-ui-component-badge.shared.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const componentsDir = path.join(rootDir, 'packages/ui/src/components');
const outputPath = path.join(
  rootDir,
  'apps/ui-app/src/apiReference/generated/components.ts'
);
const packageJsonPath = path.join(rootDir, 'packages/ui/package.json');
const tsConfigPath = path.join(rootDir, 'packages/ui/tsconfig.build.json');
const sourceCodeUrlBase =
  'https://github.com/themeshift-dev/themeshift/tree/develop/packages/ui/src/components';

const skippedNativeTypeReferences = new Set([
  'Awaited',
  'ComponentProps',
  'ComponentPropsWithoutRef',
  'Exclude',
  'Extract',
  'NonNullable',
  'Omit',
  'Parameters',
  'Partial',
  'Pick',
  'Record',
  'Readonly',
  'Required',
  'ReturnType',
]);
const keywordTypeNames = new Set([
  'any',
  'bigint',
  'boolean',
  'never',
  'null',
  'number',
  'object',
  'string',
  'symbol',
  'undefined',
  'unknown',
  'void',
]);
const standardTypeReferences = new Set([
  'Array',
  'Date',
  'Error',
  'Map',
  'Promise',
  'ReadonlyArray',
  'Set',
]);

function normalizePath(filePath) {
  return path.normalize(filePath);
}

async function hasIndexFile(componentName) {
  try {
    const indexPath = path.join(componentsDir, componentName, 'index.tsx');
    const indexStat = await stat(indexPath);

    return indexStat.isFile();
  } catch {
    return false;
  }
}

async function getComponentNames() {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const packageExports = new Set(Object.keys(packageJson.exports ?? {}));
  const entries = await readdir(componentsDir, { withFileTypes: true });
  const componentDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const componentChecks = await Promise.all(
    componentDirectories.map(async (componentName) => ({
      componentName,
      hasIndexFile: await hasIndexFile(componentName),
      isExported: packageExports.has(`./components/${componentName}`),
    }))
  );

  return componentChecks
    .filter(({ hasIndexFile, isExported }) => hasIndexFile && isExported)
    .map(({ componentName }) => componentName)
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
  const typeChecker = program.getTypeChecker();
  const sourceFiles = program
    .getSourceFiles()
    .filter((sourceFile) =>
      normalizePath(sourceFile.fileName).startsWith(
        normalizePath(componentsDir)
      )
    );

  return {
    collectApiReference(componentName) {
      const componentSourceFiles = sourceFiles.filter((sourceFile) =>
        normalizePath(sourceFile.fileName).startsWith(
          normalizePath(path.join(componentsDir, componentName))
        )
      );
      const targets = getApiReferenceTargets(
        componentName,
        componentSourceFiles
      );
      const declarations = getLocalTypeDeclarations(componentSourceFiles);
      const defaults = getComponentDefaults(
        componentSourceFiles,
        targets,
        typeChecker
      );
      const typesReferenceMap = new Map();
      const items = targets.flatMap((target) => {
        const propsTypeName = resolveTargetPropsTypeName({
          componentName,
          declarations,
          displayName: target.displayName,
          propsTypeName: target.propsTypeName,
        });

        return collectTargetProps({
          declarations,
          defaults: defaults.get(target.implementationName) ?? new Map(),
          displayName: target.displayName,
          propsTypeName,
          typeChecker,
          typesReferenceMap,
        });
      });

      return {
        items,
        typesReference: [...typesReferenceMap.values()],
      };
    },
  };
}

function getApiReferenceTargets(componentName, sourceFiles) {
  const compoundTargets = getCompoundApiReferenceTargets(
    componentName,
    sourceFiles
  );

  if (compoundTargets) {
    return compoundTargets;
  }

  return [
    {
      displayName: componentName,
      implementationName: componentName,
      propsTypeName: `${componentName}Props`,
    },
  ];
}

function getCompoundApiReferenceTargets(componentName, sourceFiles) {
  for (const sourceFile of sourceFiles) {
    const targets = getCompoundTargetsFromSourceFile(componentName, sourceFile);

    if (targets) {
      return targets;
    }
  }

  return null;
}

function resolveTargetPropsTypeName({
  componentName,
  declarations,
  displayName,
  propsTypeName,
}) {
  if (declarations.has(propsTypeName)) {
    return propsTypeName;
  }

  const rootPropsTypeName = `${componentName}Props`;

  if (displayName === componentName && declarations.has(rootPropsTypeName)) {
    return rootPropsTypeName;
  }

  return propsTypeName;
}

function getCompoundTargetsFromSourceFile(componentName, sourceFile) {
  let targets = null;

  ts.forEachChild(sourceFile, function visit(node) {
    if (targets) {
      return;
    }

    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
      )
    ) {
      for (const declaration of node.declarationList.declarations) {
        if (
          !ts.isIdentifier(declaration.name) ||
          declaration.name.text !== componentName ||
          !declaration.initializer
        ) {
          continue;
        }

        const objectAssignCall = getObjectAssignCall(declaration.initializer);

        if (!objectAssignCall || objectAssignCall.arguments.length < 2) {
          continue;
        }

        const rootImplementationName = getIdentifierText(
          objectAssignCall.arguments[0]
        );
        const membersArgument = objectAssignCall.arguments[1];

        if (
          !rootImplementationName ||
          !membersArgument ||
          !ts.isObjectLiteralExpression(membersArgument)
        ) {
          continue;
        }

        const nextTargets = [
          {
            displayName: componentName,
            implementationName: rootImplementationName,
            propsTypeName: `${rootImplementationName}Props`,
          },
        ];

        for (const property of membersArgument.properties) {
          if (!ts.isPropertyAssignment(property)) {
            continue;
          }

          const memberName = getPropertyName(property.name);
          const implementationName = getIdentifierText(property.initializer);

          if (!memberName || !implementationName) {
            continue;
          }

          nextTargets.push({
            displayName: `${componentName}.${memberName}`,
            implementationName,
            propsTypeName: `${implementationName}Props`,
          });
        }

        if (nextTargets.length > 1) {
          targets = nextTargets;
          return;
        }
      }
    }

    ts.forEachChild(node, visit);
  });

  return targets;
}

function getObjectAssignCall(expression) {
  const unwrappedExpression = unwrapExpression(expression);

  if (
    !ts.isCallExpression(unwrappedExpression) ||
    !ts.isPropertyAccessExpression(unwrappedExpression.expression)
  ) {
    return null;
  }

  const callTarget = unwrappedExpression.expression;

  if (
    !ts.isIdentifier(callTarget.expression) ||
    callTarget.expression.text !== 'Object' ||
    callTarget.name.text !== 'assign'
  ) {
    return null;
  }

  return unwrappedExpression;
}

function getIdentifierText(expression) {
  const unwrappedExpression = unwrapExpression(expression);

  if (ts.isIdentifier(unwrappedExpression)) {
    return unwrappedExpression.text;
  }

  return null;
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

function getComponentDefaults(sourceFiles, targets, typeChecker) {
  const defaultsByImplementation = new Map();

  for (const target of targets) {
    defaultsByImplementation.set(target.implementationName, new Map());
  }

  for (const sourceFile of sourceFiles) {
    ts.forEachChild(sourceFile, function visit(node) {
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        defaultsByImplementation.has(node.name.text) &&
        node.initializer
      ) {
        const arrowFunction = getArrowFunctionInitializer(node.initializer);

        if (arrowFunction) {
          defaultsByImplementation.set(
            node.name.text,
            collectDefaultValues(arrowFunction, typeChecker)
          );
        }
      }

      ts.forEachChild(node, visit);
    });
  }

  return defaultsByImplementation;
}

function getArrowFunctionInitializer(initializer) {
  if (ts.isArrowFunction(initializer)) {
    return initializer;
  }

  if (
    ts.isAsExpression(initializer) ||
    ts.isSatisfiesExpression(initializer) ||
    ts.isParenthesizedExpression(initializer)
  ) {
    return getArrowFunctionInitializer(initializer.expression);
  }

  return null;
}

function collectDefaultValues(arrowFunction, typeChecker) {
  const defaults = new Map();
  const propsParameter = arrowFunction.parameters[0];

  if (!propsParameter || !ts.isObjectBindingPattern(propsParameter.name)) {
    return defaults;
  }

  for (const element of propsParameter.name.elements) {
    const propName = getBindingElementName(element);

    if (propName && element.initializer) {
      defaults.set(
        propName,
        formatDefaultValue(element.initializer, typeChecker, new Set())
      );
    }
  }

  return defaults;
}

function getBindingElementName(element) {
  const name = element.propertyName ?? element.name;

  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return null;
}

function formatDefaultValue(expression, typeChecker, visitedSymbols) {
  const unwrappedExpression = unwrapExpression(expression);

  if (ts.isIdentifier(unwrappedExpression)) {
    const resolvedValue = resolveIdentifierDefaultValue(
      unwrappedExpression,
      typeChecker,
      visitedSymbols
    );

    if (resolvedValue !== null) {
      return resolvedValue;
    }
  }

  if (
    ts.isStringLiteral(unwrappedExpression) ||
    ts.isNoSubstitutionTemplateLiteral(unwrappedExpression)
  ) {
    return unwrappedExpression.text;
  }

  if (ts.isNumericLiteral(unwrappedExpression)) {
    return Number(unwrappedExpression.text);
  }

  if (unwrappedExpression.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (unwrappedExpression.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (
    ts.isArrayLiteralExpression(unwrappedExpression) ||
    ts.isArrowFunction(unwrappedExpression) ||
    ts.isCallExpression(unwrappedExpression) ||
    ts.isFunctionExpression(unwrappedExpression) ||
    ts.isNewExpression(unwrappedExpression) ||
    ts.isObjectLiteralExpression(unwrappedExpression)
  ) {
    return 'object';
  }

  if (
    ts.isPrefixUnaryExpression(unwrappedExpression) &&
    ts.isNumericLiteral(unwrappedExpression.operand)
  ) {
    return unwrappedExpression.operator === ts.SyntaxKind.MinusToken
      ? -Number(unwrappedExpression.operand.text)
      : Number(unwrappedExpression.operand.text);
  }

  return null;
}

function resolveIdentifierDefaultValue(
  expression,
  typeChecker,
  visitedSymbols
) {
  let symbol = typeChecker.getSymbolAtLocation(expression);

  if (!symbol) {
    return null;
  }

  if (symbol.flags & ts.SymbolFlags.Alias) {
    symbol = typeChecker.getAliasedSymbol(symbol);
  }

  if (!symbol || visitedSymbols.has(symbol)) {
    return null;
  }

  visitedSymbols.add(symbol);

  for (const declaration of symbol.declarations ?? []) {
    if (
      !ts.isVariableDeclaration(declaration) ||
      !declaration.initializer ||
      !isConstVariableDeclaration(declaration)
    ) {
      continue;
    }

    const value = formatDefaultValue(
      declaration.initializer,
      typeChecker,
      visitedSymbols
    );

    if (value !== null) {
      return value;
    }
  }

  return null;
}

function isConstVariableDeclaration(declaration) {
  const declarationList = declaration.parent;

  if (!ts.isVariableDeclarationList(declarationList)) {
    return false;
  }

  return (declarationList.flags & ts.NodeFlags.Const) !== 0;
}

function collectTargetProps({
  declarations,
  defaults,
  displayName,
  propsTypeName,
  typeChecker,
  typesReferenceMap,
}) {
  const propMap = new Map();

  collectTypeName({
    declarations,
    displayName,
    propMap,
    typeName: propsTypeName,
    typeParameterMap: new Map(),
    typeChecker,
    typesReferenceMap,
    visited: new Set(),
  });

  for (const item of propMap.values()) {
    item.defaultValue = defaults.get(item.propName) ?? null;
    applyApiReferenceOverrides(item);
  }

  return [...propMap.values()].sort((first, second) =>
    first.propName.localeCompare(second.propName)
  );
}

function collectTypeName({
  declarations,
  displayName,
  propMap,
  typeName,
  typeParameterMap,
  typeChecker,
  typesReferenceMap,
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
      propMap,
      typeParameterMap,
      typeChecker,
      typesReferenceMap,
      visited,
    });
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    collectTypeNode({
      declarations,
      displayName,
      propMap,
      typeNode: declaration.type,
      typeParameterMap: createTypeParameterMap(
        declaration.typeParameters,
        undefined,
        typeParameterMap
      ),
      typeChecker,
      typesReferenceMap,
      visited,
    });
  }

  visited.delete(typeName);
}

function collectTypeNode({
  declarations,
  displayName,
  propMap,
  typeNode,
  typeParameterMap,
  typeChecker,
  typesReferenceMap,
  visited,
}) {
  if (!typeNode) {
    return;
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    collectTypeNode({
      declarations,
      displayName,
      propMap,
      typeNode: typeNode.type,
      typeParameterMap,
      typeChecker,
      typesReferenceMap,
      visited,
    });
    return;
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    collectMembers({
      declarations,
      displayName,
      members: typeNode.members,
      propMap,
      typeParameterMap,
      typeChecker,
      typesReferenceMap,
      visited,
    });
    return;
  }

  if (ts.isIntersectionTypeNode(typeNode) || ts.isUnionTypeNode(typeNode)) {
    for (const childTypeNode of typeNode.types) {
      collectTypeNode({
        declarations,
        displayName,
        propMap,
        typeNode: childTypeNode,
        typeParameterMap,
        typeChecker,
        typesReferenceMap,
        visited,
      });
    }
    return;
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    collectTypeReference({
      declarations,
      displayName,
      propMap,
      typeNode,
      typeParameterMap,
      typeChecker,
      typesReferenceMap,
      visited,
    });
  }
}

function collectTypeReference({
  declarations,
  displayName,
  propMap,
  typeNode,
  typeParameterMap,
  typeChecker,
  typesReferenceMap,
  visited,
}) {
  const typeName = getEntityNameText(typeNode.typeName);
  const localTypeName = typeName.split('.').at(-1);

  if (!localTypeName) {
    return;
  }

  const collectTypeArguments = () => {
    for (const typeArgument of typeNode.typeArguments ?? []) {
      collectTypeNode({
        declarations,
        displayName,
        propMap,
        typeNode: typeArgument,
        typeParameterMap,
        typeChecker,
        typesReferenceMap,
        visited,
      });
    }
  };

  if (typeParameterMap.has(localTypeName)) {
    const mappedTypeNode = typeParameterMap.get(localTypeName);

    if (getNodeText(mappedTypeNode) === localTypeName) {
      return;
    }

    collectTypeNode({
      declarations,
      displayName,
      propMap,
      typeNode: mappedTypeNode,
      typeParameterMap,
      typeChecker,
      typesReferenceMap,
      visited,
    });
    return;
  }

  if (skippedNativeTypeReferences.has(localTypeName)) {
    collectTypeArguments();
    return;
  }

  const declaration = declarations.get(localTypeName);

  if (!declaration || visited.has(localTypeName)) {
    collectTypeArguments();
    return;
  }

  const nextTypeParameterMap = createTypeParameterMap(
    declaration.typeParameters,
    typeNode.typeArguments,
    typeParameterMap
  );

  collectTypeName({
    declarations,
    displayName,
    propMap,
    typeName: localTypeName,
    typeParameterMap: nextTypeParameterMap,
    typeChecker,
    typesReferenceMap,
    visited,
  });
}

function collectMembers({
  declarations,
  displayName,
  members,
  propMap,
  typeParameterMap,
  typeChecker,
  typesReferenceMap,
  visited,
}) {
  for (const member of members) {
    if (!ts.isPropertySignature(member)) {
      continue;
    }

    const propName = getPropertyName(member.name);

    if (!propName) {
      continue;
    }

    const key = `${displayName}::${propName}`;
    const nextItem = {
      comments: getComment(member),
      defaultValue: null,
      displayName,
      propName,
      type: formatType(member.type, typeParameterMap),
      values: getLiteralValues(member.type, declarations, typeParameterMap),
    };

    collectTypeReferenceItems({
      declarations,
      typeChecker,
      typeNode: member.type,
      typeParameterMap,
      typeReferenceMap: typesReferenceMap,
      visited: new Set(),
    });

    const currentItem = propMap.get(key);

    propMap.set(key, mergeApiReferenceItems(currentItem, nextItem));
  }
}

function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return null;
}

function createTypeParameterMap(typeParameters, typeArguments, parentMap) {
  const typeParameterMap = new Map(parentMap);

  if (!typeParameters) {
    return typeParameterMap;
  }

  typeParameters.forEach((typeParameter, index) => {
    const typeParameterName = typeParameter.name.text;
    const typeArgument = typeArguments?.[index];

    if (typeArgument) {
      const typeArgumentText = getNodeText(typeArgument);

      typeParameterMap.set(
        typeParameterName,
        parentMap.get(typeArgumentText) ?? typeArgument
      );
      return;
    }

    if (!parentMap.has(typeParameterName) && typeParameter.constraint) {
      typeParameterMap.set(typeParameterName, typeParameter.constraint);
    }
  });

  return typeParameterMap;
}

function collectTypeReferenceItems({
  declarations,
  typeChecker,
  typeNode,
  typeParameterMap,
  typeReferenceMap,
  visited,
}) {
  if (!typeNode) {
    return;
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    collectTypeReferenceItems({
      declarations,
      typeChecker,
      typeNode: typeNode.type,
      typeParameterMap,
      typeReferenceMap,
      visited,
    });
    return;
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    collectTypeReferenceNodeItem({
      declarations,
      typeChecker,
      typeNode,
      typeParameterMap,
      typeReferenceMap,
      visited,
    });
    return;
  }

  if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
    for (const childTypeNode of typeNode.types) {
      collectTypeReferenceItems({
        declarations,
        typeChecker,
        typeNode: childTypeNode,
        typeParameterMap,
        typeReferenceMap,
        visited,
      });
    }
    return;
  }

  if (ts.isArrayTypeNode(typeNode)) {
    collectTypeReferenceItems({
      declarations,
      typeChecker,
      typeNode: typeNode.elementType,
      typeParameterMap,
      typeReferenceMap,
      visited,
    });
    return;
  }

  if (ts.isIndexedAccessTypeNode(typeNode)) {
    collectTypeReferenceItems({
      declarations,
      typeChecker,
      typeNode: typeNode.objectType,
      typeParameterMap,
      typeReferenceMap,
      visited,
    });
    collectTypeReferenceItems({
      declarations,
      typeChecker,
      typeNode: typeNode.indexType,
      typeParameterMap,
      typeReferenceMap,
      visited,
    });
    return;
  }

  if (ts.isTypeOperatorNode(typeNode)) {
    collectTypeReferenceItems({
      declarations,
      typeChecker,
      typeNode: typeNode.type,
      typeParameterMap,
      typeReferenceMap,
      visited,
    });
  }
}

function collectTypeReferenceNodeItem({
  declarations,
  typeChecker,
  typeNode,
  typeParameterMap,
  typeReferenceMap,
  visited,
}) {
  const typeName = getEntityNameText(typeNode.typeName);
  const localTypeName = typeName.split('.').at(-1);
  const mappedTypeNode =
    typeParameterMap.get(typeName) ??
    (localTypeName ? typeParameterMap.get(localTypeName) : undefined);

  if (
    mappedTypeNode &&
    getNodeText(mappedTypeNode) !== typeName &&
    (!localTypeName || getNodeText(mappedTypeNode) !== localTypeName)
  ) {
    collectTypeReferenceItems({
      declarations,
      typeChecker,
      typeNode: mappedTypeNode,
      typeParameterMap,
      typeReferenceMap,
      visited,
    });
    return;
  }

  for (const typeArgument of typeNode.typeArguments ?? []) {
    collectTypeReferenceItems({
      declarations,
      typeChecker,
      typeNode: typeArgument,
      typeParameterMap,
      typeReferenceMap,
      visited,
    });
  }

  if (!localTypeName || isStandardTypeReference(typeChecker, typeNode)) {
    return;
  }

  if (typeReferenceMap.has(localTypeName)) {
    return;
  }

  const declaration =
    resolveTypeReferenceDeclaration(typeChecker, typeNode) ??
    declarations.get(localTypeName) ??
    null;

  if (visited.has(localTypeName)) {
    return;
  }

  visited.add(localTypeName);

  typeReferenceMap.set(localTypeName, {
    comments: declaration ? getComment(declaration) : '',
    defaultValue: null,
    typeName: localTypeName,
    values: declaration
      ? declaration.typeParameters?.length
        ? []
        : getLooseLiteralValues(
            getDeclarationTypeNode(declaration),
            typeChecker,
            createTypeParameterMap(
              declaration.typeParameters,
              typeNode.typeArguments,
              typeParameterMap
            ),
            new Set()
          )
      : [],
  });

  visited.delete(localTypeName);
}

function isStandardTypeReference(typeChecker, typeNode) {
  const typeName = getEntityNameText(typeNode.typeName);
  const localTypeName = typeName.split('.').at(-1);

  if (!localTypeName) {
    return true;
  }

  if (
    keywordTypeNames.has(localTypeName) ||
    skippedNativeTypeReferences.has(localTypeName) ||
    standardTypeReferences.has(localTypeName)
  ) {
    return true;
  }

  return isReactTypeReference(typeChecker, typeNode);
}

function isReactTypeReference(typeChecker, typeNode) {
  const symbol = getResolvedSymbol(typeChecker, typeNode.typeName);

  if (!symbol) {
    return false;
  }

  return (symbol.declarations ?? []).some((declaration) =>
    normalizePath(declaration.getSourceFile().fileName).includes(
      `${path.sep}react${path.sep}`
    )
  );
}

function getResolvedSymbol(typeChecker, typeNameNode) {
  let symbol = typeChecker.getSymbolAtLocation(typeNameNode);

  if (!symbol) {
    return null;
  }

  if (symbol.flags & ts.SymbolFlags.Alias) {
    symbol = typeChecker.getAliasedSymbol(symbol);
  }

  return symbol ?? null;
}

function resolveTypeReferenceDeclaration(typeChecker, typeNode) {
  const symbol = getResolvedSymbol(typeChecker, typeNode.typeName);

  if (!symbol) {
    return null;
  }

  for (const declaration of symbol.declarations ?? []) {
    if (ts.isTypeAliasDeclaration(declaration)) {
      return declaration;
    }

    if (ts.isInterfaceDeclaration(declaration)) {
      return declaration;
    }
  }

  return null;
}

function getDeclarationTypeNode(declaration) {
  if (ts.isTypeAliasDeclaration(declaration)) {
    return declaration.type;
  }

  return null;
}

function getLooseLiteralValues(
  typeNode,
  typeChecker,
  typeParameterMap,
  visitedTypes
) {
  if (!typeNode) {
    return [];
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return getLooseLiteralValues(
      typeNode.type,
      typeChecker,
      typeParameterMap,
      visitedTypes
    );
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    const literalValue = getLiteralValue(typeNode.literal);

    return literalValue === null ? [] : [literalValue];
  }

  if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
    return [
      ...new Set(
        typeNode.types.flatMap((childTypeNode) =>
          getLooseLiteralValues(
            childTypeNode,
            typeChecker,
            typeParameterMap,
            visitedTypes
          )
        )
      ),
    ];
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = getEntityNameText(typeNode.typeName);
    const localTypeName = typeName.split('.').at(-1);
    const mappedTypeNode =
      typeParameterMap.get(typeName) ??
      (localTypeName ? typeParameterMap.get(localTypeName) : undefined);

    if (
      mappedTypeNode &&
      getNodeText(mappedTypeNode) !== typeName &&
      (!localTypeName || getNodeText(mappedTypeNode) !== localTypeName)
    ) {
      return getLooseLiteralValues(
        mappedTypeNode,
        typeChecker,
        typeParameterMap,
        visitedTypes
      );
    }

    if (!localTypeName || visitedTypes.has(localTypeName)) {
      return [];
    }

    const declaration = resolveTypeReferenceDeclaration(typeChecker, typeNode);

    if (!declaration || !ts.isTypeAliasDeclaration(declaration)) {
      return [];
    }

    visitedTypes.add(localTypeName);
    const values = getLooseLiteralValues(
      declaration.type,
      typeChecker,
      createTypeParameterMap(
        declaration.typeParameters,
        typeNode.typeArguments,
        typeParameterMap
      ),
      visitedTypes
    );
    visitedTypes.delete(localTypeName);

    return values;
  }

  return [];
}

function mergeApiReferenceItems(currentItem, nextItem) {
  if (!currentItem) {
    applyApiReferenceOverrides(nextItem);

    return nextItem;
  }

  const mergedItem = {
    ...currentItem,
    comments: currentItem.comments || nextItem.comments,
    type: mergeTypes(currentItem.type, nextItem.type),
    values: [...new Set([...currentItem.values, ...nextItem.values])],
  };

  applyApiReferenceOverrides(mergedItem);

  return mergedItem;
}

function applyApiReferenceOverrides(item) {
  for (const override of apiReferenceOverrides) {
    if (!matchesApiReferenceOverride(item, override.match)) {
      continue;
    }

    if ('comments' in override) {
      item.comments = override.comments;
    }

    if ('defaultValue' in override) {
      item.defaultValue = override.defaultValue;
    }

    if ('type' in override) {
      item.type = override.type;
    }

    if ('values' in override) {
      item.values = [...override.values];
    }
  }
}

function matchesApiReferenceOverride(item, match) {
  return Object.entries(match).every(([key, value]) => item[key] === value);
}

function mergeTypes(currentType, nextType) {
  let typeParts = [
    ...new Set(
      [...currentType.split('|'), ...nextType.split('|')]
        .map((typePart) => typePart.trim())
        .filter(Boolean)
    ),
  ];

  const nonNeverTypeParts = typeParts.filter(
    (typePart) => typePart !== 'never'
  );

  if (nonNeverTypeParts.length > 0) {
    typeParts = nonNeverTypeParts;
  }

  if (typeParts.includes('boolean')) {
    return typeParts
      .filter((typePart) => typePart !== 'true' && typePart !== 'false')
      .join(' | ');
  }

  return typeParts.join(' | ');
}

function getComment(member) {
  const jsDocs = member.jsDoc ?? [];
  const comments = jsDocs
    .map((jsDoc) => jsDoc.comment)
    .filter(Boolean)
    .map(formatJSDocComment);

  return comments.join('\n\n').trim();
}

function formatJSDocComment(comment) {
  const text = Array.isArray(comment)
    ? comment.map((part) => part.text).join('')
    : String(comment);
  const paragraphs = [];
  let paragraphLines = [];

  for (const line of text.replace(/\r\n?/g, '\n').split('\n')) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      if (paragraphLines.length > 0) {
        paragraphs.push(paragraphLines.join(' '));
        paragraphLines = [];
      }

      continue;
    }

    paragraphLines.push(trimmedLine);
  }

  if (paragraphLines.length > 0) {
    paragraphs.push(paragraphLines.join(' '));
  }

  return paragraphs.join('\n\n');
}

function formatType(typeNode, typeParameterMap) {
  if (!typeNode) {
    return 'unknown';
  }

  if (ts.isFunctionTypeNode(typeNode)) {
    const parameters = typeNode.parameters
      .map((parameter) => formatFunctionParameter(parameter, typeParameterMap))
      .join(', ');
    const returnType = typeNode.type
      ? formatType(typeNode.type, typeParameterMap)
      : 'void';

    return `(${parameters}) => ${returnType}`;
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = getEntityNameText(typeNode.typeName);
    const localTypeName = typeName.split('.').at(-1);
    const mappedTypeNode =
      typeParameterMap.get(typeName) ??
      (localTypeName ? typeParameterMap.get(localTypeName) : undefined);

    if (
      mappedTypeNode &&
      getNodeText(mappedTypeNode) !== typeName &&
      (!localTypeName || getNodeText(mappedTypeNode) !== localTypeName)
    ) {
      return formatType(mappedTypeNode, typeParameterMap);
    }

    const typeArguments = typeNode.typeArguments
      ?.map((typeArgument) => formatType(typeArgument, typeParameterMap))
      .filter(Boolean);

    if (typeArguments && typeArguments.length > 0) {
      return `${typeName}<${typeArguments.join(', ')}>`;
    }

    return typeName;
  }

  if (ts.isUnionTypeNode(typeNode)) {
    const typeParts = typeNode.types
      .map((childTypeNode) => formatType(childTypeNode, typeParameterMap))
      .filter(Boolean);
    const nonNeverTypeParts = typeParts.filter(
      (typePart) => typePart !== 'never'
    );

    if (nonNeverTypeParts.length === 0) {
      return 'never';
    }

    return nonNeverTypeParts.join(' | ');
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    return formatLiteralType(typeNode.literal);
  }

  return getNodeText(typeNode).replace(/\s+/g, ' ');
}

function formatFunctionParameter(parameter, typeParameterMap) {
  const parameterName = getNodeText(parameter.name);
  const isOptional = !!parameter.questionToken;
  const isRest = !!parameter.dotDotDotToken;
  const type = parameter.type
    ? formatType(parameter.type, typeParameterMap)
    : 'unknown';

  return `${isRest ? '...' : ''}${parameterName}${isOptional ? '?' : ''}: ${type}`;
}

function formatLiteralType(literal) {
  if (ts.isStringLiteral(literal)) {
    return `'${literal.text}'`;
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
    return `${literal.operator === ts.SyntaxKind.MinusToken ? '-' : ''}${literal.operand.text}`;
  }

  return getNodeText(literal).replace(/\s+/g, ' ');
}

function getLiteralValues(
  typeNode,
  declarations,
  typeParameterMap,
  visited = new Set()
) {
  if (!typeNode) {
    return [];
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return getLiteralValues(
      typeNode.type,
      declarations,
      typeParameterMap,
      visited
    );
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = getEntityNameText(typeNode.typeName);
    const localTypeName = typeName.split('.').at(-1);
    const mappedTypeNode = typeParameterMap.get(typeName);

    if (mappedTypeNode && getNodeText(mappedTypeNode) !== typeName) {
      return getLiteralValues(
        mappedTypeNode,
        declarations,
        typeParameterMap,
        visited
      );
    }

    if (!localTypeName || visited.has(localTypeName)) {
      return [];
    }

    const declaration = declarations.get(localTypeName);

    if (!declaration || !ts.isTypeAliasDeclaration(declaration)) {
      return [];
    }

    visited.add(localTypeName);

    const values = getLiteralValues(
      declaration.type,
      declarations,
      typeParameterMap,
      visited
    );

    visited.delete(localTypeName);

    return values;
  }

  if (ts.isUnionTypeNode(typeNode)) {
    const values = typeNode.types.flatMap((childTypeNode) =>
      getLiteralValues(childTypeNode, declarations, typeParameterMap, visited)
    );

    return values.length === typeNode.types.length ? values : [];
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    const literalValue = getLiteralValue(typeNode.literal);

    return literalValue === null ? [] : [literalValue];
  }

  return [];
}

function getLiteralValue(literal) {
  if (ts.isStringLiteral(literal)) {
    return literal.text;
  }

  if (ts.isNumericLiteral(literal)) {
    return Number(literal.text);
  }

  if (literal.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (literal.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (
    ts.isPrefixUnaryExpression(literal) &&
    ts.isNumericLiteral(literal.operand)
  ) {
    return literal.operator === ts.SyntaxKind.MinusToken
      ? -Number(literal.operand.text)
      : Number(literal.operand.text);
  }

  return null;
}

function getEntityNameText(name) {
  if (ts.isIdentifier(name)) {
    return name.text;
  }

  return `${getEntityNameText(name.left)}.${name.right.text}`;
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

  try {
    return node.getText();
  } catch {
    return getKeywordTypeText(node.kind);
  }
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

async function readComponentMeta(componentName) {
  const metaPath = path.join(
    componentsDir,
    componentName,
    `${componentName}.meta.ts`
  );

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

async function createComponentData(componentName, analyzer) {
  const importPath = `@themeshift/ui/components/${componentName}`;
  const meta = await readComponentMeta(componentName);
  const { items, typesReference } = analyzer.collectApiReference(componentName);

  return {
    apiReference: items,
    name: componentName,
    exportName: componentName,
    importPath,
    importString: `import { ${componentName} } from '${importPath}';`,
    meta: meta ? { ...meta, type: 'component' } : null,
    slug: componentName.toLowerCase(),
    routeSlug: componentName
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase(),
    sourceCodeUrl: `${sourceCodeUrlBase}/${componentName}`,
    typesReference,
    type: 'component',
  };
}

async function createOutput(componentData) {
  const output = `import type { ApiReferenceComponent } from '../types';

export const components = ${JSON.stringify(componentData, null, 2)} satisfies ApiReferenceComponent[];
`;

  return prettier.format(output, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'es5',
  });
}

const componentNames = await getComponentNames();
const analyzer = createAnalyzer(createProgram());
const componentData = await Promise.all(
  componentNames.map((componentName) =>
    createComponentData(componentName, analyzer)
  )
);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, await createOutput(componentData));
await syncUiComponentBadges({ rootDir });

console.log(`Collected component data for ${componentData.length} components`);
