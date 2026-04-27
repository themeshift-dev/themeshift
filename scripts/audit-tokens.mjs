import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const JS_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const CSS_EXTENSIONS = new Set(['.css', '.scss', '.sass']);
const JSON_EXTENSIONS = new Set(['.json']);

const TOKEN_CALL_REGEX =
  /\b(?:themeShift\.)?token\(\s*(['"])([^'"\\]*(?:\\.[^'"\\]*)*)\1/g;
const CSS_VAR_REGEX = /var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:[,)])/g;
const JSON_REFERENCE_REGEX = /\{([a-zA-Z0-9._-]+)\}/g;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--target') {
      parsed.target = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--cssVarPrefix') {
      parsed.cssVarPrefix = argv[index + 1];
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function normalizeTargetInput(target) {
  return target.trim().replace(/\/+$/g, '');
}

function normalizeCssVarPrefix(prefix) {
  const normalized = prefix
    ?.trim()
    .replace(/^-+|-+$/g, '')
    .replace(/_/g, '-');
  return normalized ? normalized : undefined;
}

function pathToCssVarName(tokenPath, prefix) {
  const normalizedPath = tokenPath
    .replace(/\./g, '-')
    .replace(/_/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
  const normalizedPrefix = normalizeCssVarPrefix(prefix);
  return [normalizedPrefix, normalizedPath].filter(Boolean).join('-');
}

function getWorkspaceTargets() {
  const roots = ['apps', 'packages'];
  const targets = [];

  for (const root of roots) {
    const rootPath = path.join(repoRoot, root);
    if (!fs.existsSync(rootPath)) {
      continue;
    }

    const entries = fs.readdirSync(rootPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      targets.push(`${root}/${entry.name}`);
    }
  }

  return targets.sort((left, right) => left.localeCompare(right));
}

function getSelectedTargets(targetInput, validTargets) {
  if (targetInput === 'all') {
    return validTargets;
  }

  if (!validTargets.includes(targetInput)) {
    throw new Error(
      `Invalid target "${targetInput}". Use one of: ${validTargets.join(', ')}, all`
    );
  }

  return [targetInput];
}

function extractExportConstValue(filePath, constName) {
  const source = fs.readFileSync(filePath, 'utf8');
  const declaration = `export const ${constName} =`;
  const declarationIndex = source.indexOf(declaration);

  if (declarationIndex === -1) {
    throw new Error(`Could not find "${constName}" in ${filePath}`);
  }

  const afterDeclaration = source.slice(declarationIndex + declaration.length);
  const endIndex = afterDeclaration.indexOf('as const;');

  if (endIndex === -1) {
    throw new Error(`Could not parse "${constName}" in ${filePath}`);
  }

  const literal = afterDeclaration.slice(0, endIndex).trim();
  return vm.runInNewContext(`(${literal})`, Object.create(null), {
    filename: filePath,
  });
}

function collectRelevantFiles(targets) {
  const files = [];

  for (const target of targets) {
    const absoluteTargetPath = path.join(repoRoot, target);
    const stack = [absoluteTargetPath];

    while (stack.length > 0) {
      const currentPath = stack.pop();
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const absoluteEntryPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          stack.push(absoluteEntryPath);
          continue;
        }

        if (!entry.isFile()) {
          continue;
        }

        const extension = path.extname(entry.name).toLowerCase();
        const isRelevant =
          JS_EXTENSIONS.has(extension) ||
          CSS_EXTENSIONS.has(extension) ||
          JSON_EXTENSIONS.has(extension);

        if (isRelevant) {
          files.push(absoluteEntryPath);
        }
      }
    }
  }

  return files;
}

function decodeQuotedContent(value) {
  return value.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function incrementUsage(usageMap, tokenPath, bucket) {
  const usage = usageMap.get(tokenPath);
  if (!usage) {
    return;
  }

  usage[bucket] += 1;
}

function scanTokenCalls(content, usageMap, tokenPathSet, bucket) {
  let match;
  while ((match = TOKEN_CALL_REGEX.exec(content)) !== null) {
    const tokenPath = decodeQuotedContent(match[2]);
    if (tokenPathSet.has(tokenPath)) {
      incrementUsage(usageMap, tokenPath, bucket);
    }
  }
}

function scanCssVars(content, usageMap, cssVarToTokenPath) {
  let match;
  while ((match = CSS_VAR_REGEX.exec(content)) !== null) {
    const tokenPath = cssVarToTokenPath.get(match[1]);
    if (tokenPath) {
      incrementUsage(usageMap, tokenPath, 'css');
    }
  }
}

function scanJsonReferences(content, usageMap, tokenPathSet) {
  let match;
  while ((match = JSON_REFERENCE_REGEX.exec(content)) !== null) {
    const tokenPath = match[1];
    if (tokenPathSet.has(tokenPath)) {
      incrementUsage(usageMap, tokenPath, 'json');
    }
  }
}

function escapeCsvCell(value) {
  const raw = value == null ? '' : String(value);
  if (!/[",\n]/.test(raw)) {
    return raw;
  }

  return `"${raw.replace(/"/g, '""')}"`;
}

function toCsvValue(value) {
  if (typeof value === 'string') {
    return value;
  }

  if (value == null) {
    return '';
  }

  return JSON.stringify(value);
}

function writeCsvFile(outputPath, csvContent) {
  const tempPath = `${outputPath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tempPath, csvContent, 'utf8');
  fs.renameSync(tempPath, outputPath);
}

function main() {
  try {
    const { target, cssVarPrefix = 'themeshift' } = parseArgs(
      process.argv.slice(2)
    );
    if (!target) {
      throw new Error('Missing required --target argument.');
    }

    const normalizedTarget = normalizeTargetInput(target);
    if (!normalizedTarget) {
      throw new Error('Missing required --target argument.');
    }

    const validTargets = getWorkspaceTargets();
    const selectedTargets = getSelectedTargets(normalizedTarget, validTargets);

    const tokenPaths = extractExportConstValue(
      path.join(repoRoot, 'packages/ui/src/design-tokens/token-paths.ts'),
      'tokenPaths'
    );
    const tokenValues = extractExportConstValue(
      path.join(repoRoot, 'packages/ui/src/design-tokens/token-values.ts'),
      'tokenValues'
    );

    const usageMap = new Map(
      tokenPaths.map((tokenPath) => [tokenPath, { js: 0, css: 0, json: 0 }])
    );
    const tokenPathSet = new Set(tokenPaths);
    const normalizedPrefix = normalizeCssVarPrefix(cssVarPrefix);
    const cssVarToTokenPath = new Map(
      tokenPaths.map((tokenPath) => [
        `--${pathToCssVarName(tokenPath, normalizedPrefix)}`,
        tokenPath,
      ])
    );

    const files = collectRelevantFiles(selectedTargets);
    for (const filePath of files) {
      const extension = path.extname(filePath).toLowerCase();
      const content = fs.readFileSync(filePath, 'utf8');

      TOKEN_CALL_REGEX.lastIndex = 0;
      CSS_VAR_REGEX.lastIndex = 0;
      JSON_REFERENCE_REGEX.lastIndex = 0;

      if (JS_EXTENSIONS.has(extension)) {
        scanTokenCalls(content, usageMap, tokenPathSet, 'js');
        continue;
      }

      if (CSS_EXTENSIONS.has(extension)) {
        scanTokenCalls(content, usageMap, tokenPathSet, 'css');
        scanCssVars(content, usageMap, cssVarToTokenPath);
        continue;
      }

      if (JSON_EXTENSIONS.has(extension)) {
        scanJsonReferences(content, usageMap, tokenPathSet);
      }
    }

    const sortedTokenPaths = [...tokenPaths].sort((left, right) =>
      left.localeCompare(right)
    );
    const rows = [
      'tokenPath,value,usageCountJS,usageCountCSS,usageInJson,usageCountTotal',
    ];

    for (const tokenPath of sortedTokenPaths) {
      const usage = usageMap.get(tokenPath);
      const value = toCsvValue(tokenValues[tokenPath]);
      const usageCountTotal = usage.js + usage.css + usage.json;

      rows.push(
        [
          escapeCsvCell(tokenPath),
          escapeCsvCell(value),
          usage.js,
          usage.css,
          usage.json,
          usageCountTotal,
        ].join(',')
      );
    }

    const outputPath = path.join(repoRoot, 'token-audit.csv');
    writeCsvFile(outputPath, `${rows.join('\n')}\n`);

    console.log(
      `Wrote ${path.relative(repoRoot, outputPath)} for target(s): ${selectedTargets.join(', ')}`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}

main();
