import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { pathToCssVarName } from './cssVar';
import type { AuditTokensOptions, AuditTokensResult } from './types';

const JS_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const CSS_EXTENSIONS = new Set(['.css', '.scss', '.sass']);
const JSON_EXTENSIONS = new Set(['.json']);

const TOKEN_CALL_REGEX =
  /\b(?:themeShift\.)?token\(\s*(['"])([^'"\\]*(?:\\.[^'"\\]*)*)\1/g;
const CSS_VAR_REGEX = /var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:[,)])/g;
const JSON_REFERENCE_REGEX = /\{([a-zA-Z0-9._-]+)\}/g;

function normalizeTargetInput(target: string) {
  return target.trim().replace(/\/+$/g, '');
}

function getWorkspaceTargets(root: string) {
  const roots = ['apps', 'packages'];
  const targets: string[] = [];

  for (const rootSegment of roots) {
    const rootPath = path.join(root, rootSegment);
    if (!fs.existsSync(rootPath)) {
      continue;
    }

    const entries = fs.readdirSync(rootPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      targets.push(`${rootSegment}/${entry.name}`);
    }
  }

  return targets.sort((left, right) => left.localeCompare(right));
}

function getSelectedTargets(targetInput: string, validTargets: string[]) {
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

function extractExportConstValue(filePath: string, constName: string) {
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

function collectRelevantFiles(root: string, targets: string[]) {
  const files: string[] = [];

  for (const target of targets) {
    const absoluteTargetPath = path.join(root, target);

    if (!fs.existsSync(absoluteTargetPath)) {
      continue;
    }

    const stack = [absoluteTargetPath];

    while (stack.length > 0) {
      const currentPath = stack.pop();
      if (!currentPath) {
        continue;
      }

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

function decodeQuotedContent(value: string) {
  return value.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

type UsageCounter = {
  css: number;
  js: number;
  json: number;
};

function incrementUsage(
  usageMap: Map<string, UsageCounter>,
  tokenPath: string,
  bucket: keyof UsageCounter
) {
  const usage = usageMap.get(tokenPath);
  if (!usage) {
    return;
  }

  usage[bucket] += 1;
}

function scanTokenCalls(
  content: string,
  usageMap: Map<string, UsageCounter>,
  tokenPathSet: Set<string>,
  bucket: keyof UsageCounter
) {
  let match: RegExpExecArray | null;

  while ((match = TOKEN_CALL_REGEX.exec(content)) !== null) {
    const tokenPath = decodeQuotedContent(match[2]);
    if (tokenPathSet.has(tokenPath)) {
      incrementUsage(usageMap, tokenPath, bucket);
    }
  }
}

function scanCssVars(
  content: string,
  usageMap: Map<string, UsageCounter>,
  cssVarToTokenPath: Map<string, string>
) {
  let match: RegExpExecArray | null;

  while ((match = CSS_VAR_REGEX.exec(content)) !== null) {
    const tokenPath = cssVarToTokenPath.get(match[1]);
    if (tokenPath) {
      incrementUsage(usageMap, tokenPath, 'css');
    }
  }
}

function scanJsonReferences(
  content: string,
  usageMap: Map<string, UsageCounter>,
  tokenPathSet: Set<string>
) {
  let match: RegExpExecArray | null;

  while ((match = JSON_REFERENCE_REGEX.exec(content)) !== null) {
    const tokenPath = match[1];
    if (tokenPathSet.has(tokenPath)) {
      incrementUsage(usageMap, tokenPath, 'json');
    }
  }
}

function escapeCsvCell(value: unknown) {
  const raw = value == null ? '' : String(value);
  if (!/[",\n]/.test(raw)) {
    return raw;
  }

  return `"${raw.replace(/"/g, '""')}"`;
}

function toCsvValue(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (value == null) {
    return '';
  }

  return JSON.stringify(value);
}

function writeCsvFile(outputPath: string, csvContent: string) {
  const tempPath = `${outputPath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tempPath, csvContent, 'utf8');
  fs.renameSync(tempPath, outputPath);
}

export async function auditTokens(
  options: AuditTokensOptions = {}
): Promise<AuditTokensResult> {
  const root = options.root ?? process.cwd();
  const target = normalizeTargetInput(options.target ?? 'all');
  const cssVarPrefix = options.cssVarPrefix ?? 'themeshift';
  const outputFile = options.outputFile ?? 'token-audit.csv';
  const tokenPathsFile =
    options.tokenPathsFile ?? 'packages/ui/src/design-tokens/token-paths.ts';
  const tokenValuesFile =
    options.tokenValuesFile ?? 'packages/ui/src/design-tokens/token-values.ts';

  const validTargets = options.scanRoots ?? getWorkspaceTargets(root);
  const selectedTargets = getSelectedTargets(target, validTargets);

  const tokenPaths = extractExportConstValue(
    path.join(root, tokenPathsFile),
    'tokenPaths'
  ) as string[];

  const tokenValues = extractExportConstValue(
    path.join(root, tokenValuesFile),
    'tokenValues'
  ) as Record<string, unknown>;

  const usageMap = new Map(
    tokenPaths.map((tokenPath) => [tokenPath, { js: 0, css: 0, json: 0 }])
  );
  const tokenPathSet = new Set(tokenPaths);
  const cssVarToTokenPath = new Map(
    tokenPaths.map((tokenPath) => [
      `--${pathToCssVarName(tokenPath, cssVarPrefix)}`,
      tokenPath,
    ])
  );

  const files = collectRelevantFiles(root, selectedTargets);

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

    if (!usage) {
      continue;
    }

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

  const absoluteOutputPath = path.join(root, outputFile);
  writeCsvFile(absoluteOutputPath, `${rows.join('\n')}\n`);

  return {
    outputFile: absoluteOutputPath,
    scannedTargets: selectedTargets,
    tokenCount: sortedTokenPaths.length,
  };
}
