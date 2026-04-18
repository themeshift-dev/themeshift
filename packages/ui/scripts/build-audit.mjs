import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const componentsDir = path.join(distDir, 'components');
const cssDir = path.join(distDir, 'css');
const hooksDir = path.join(distDir, 'hooks');
const iconsDir = path.join(distDir, 'icons');
const templatesDir = path.join(distDir, 'templates');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (
  !fs.existsSync(componentsDir) ||
  !fs.existsSync(hooksDir) ||
  !fs.existsSync(cssDir) ||
  !fs.existsSync(iconsDir) ||
  !fs.existsSync(templatesDir)
) {
  fail(`Missing build output in ${distDir}. Run "pnpm run build" first.`);
}

function getFilesize(filePath) {
  return fs.statSync(filePath).size;
}

function getGzipSize(filePath) {
  return zlib.gzipSync(fs.readFileSync(filePath), { level: 9 }).length;
}

function getBrotliSize(filePath) {
  return zlib.brotliCompressSync(fs.readFileSync(filePath), {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length;
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(2)} KB`;
}

function parseImports(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const imports = [];

  for (const match of source.matchAll(
    /import\s+(?:[^'";]+\s+from\s+)?["']([^"']+)["']/g
  )) {
    imports.push(match[1]);
  }

  return imports;
}

function resolveLocalImport(fromFilePath, specifier) {
  if (!specifier.startsWith('.')) {
    return null;
  }

  const resolvedPath = path.resolve(path.dirname(fromFilePath), specifier);
  const candidates = [
    resolvedPath,
    `${resolvedPath}.js`,
    `${resolvedPath}.css`,
    path.join(resolvedPath, 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function collectRecursiveFiles(entryFilePath) {
  const visited = new Set();
  const stack = [entryFilePath];

  while (stack.length > 0) {
    const currentPath = stack.pop();

    if (visited.has(currentPath)) {
      continue;
    }

    visited.add(currentPath);

    if (!currentPath.endsWith('.js')) {
      continue;
    }

    for (const specifier of parseImports(currentPath)) {
      const resolved = resolveLocalImport(currentPath, specifier);

      if (!resolved || !resolved.startsWith(distDir)) {
        continue;
      }

      stack.push(resolved);
    }
  }

  return [...visited].filter(
    (filePath) => filePath.endsWith('.js') || filePath.endsWith('.css')
  );
}

function sumSizes(files) {
  const jsFiles = files.filter((filePath) => filePath.endsWith('.js'));
  const cssFiles = files.filter((filePath) => filePath.endsWith('.css'));

  const jsRaw = jsFiles.reduce(
    (total, filePath) => total + getFilesize(filePath),
    0
  );
  const cssRaw = cssFiles.reduce(
    (total, filePath) => total + getFilesize(filePath),
    0
  );
  const rawTotal = jsRaw + cssRaw;

  const gzipTotal = files.reduce(
    (total, filePath) => total + getGzipSize(filePath),
    0
  );
  const brotliTotal = files.reduce(
    (total, filePath) => total + getBrotliSize(filePath),
    0
  );

  return { rawTotal, jsRaw, cssRaw, gzipTotal, brotliTotal };
}

function pad(value, width, align = 'left') {
  if (align === 'right') {
    return value.padStart(width, ' ');
  }

  return value.padEnd(width, ' ');
}

function printTable(rows, label) {
  const headers = [label, 'Raw total', 'JS', 'CSS', 'Gzip', 'Brotli'];
  const tableRows = rows.map((row) => [
    row.name,
    formatBytes(row.rawTotal),
    formatBytes(row.jsRaw),
    formatBytes(row.cssRaw),
    formatBytes(row.gzipTotal),
    formatBytes(row.brotliTotal),
  ]);

  const widths = headers.map((header, columnIndex) =>
    Math.max(
      header.length,
      ...tableRows.map((tableRow) => tableRow[columnIndex].length)
    )
  );

  const headerLine = headers
    .map((header, columnIndex) =>
      pad(header, widths[columnIndex], columnIndex === 0 ? 'left' : 'right')
    )
    .join(' | ');
  const separatorLine = widths
    .map((width) => ''.padEnd(width, '-'))
    .join('-|-');

  console.log(headerLine);
  console.log(separatorLine);

  for (const tableRow of tableRows) {
    console.log(
      tableRow
        .map((value, columnIndex) =>
          pad(value, widths[columnIndex], columnIndex === 0 ? 'left' : 'right')
        )
        .join(' | ')
    );
  }
}

function printSummaryTable(rows) {
  const headers = ['Group', 'Raw total', 'JS', 'CSS', 'Gzip', 'Brotli'];
  const tableRows = rows.map((row) => [
    row.group,
    formatBytes(row.rawTotal),
    formatBytes(row.jsRaw),
    formatBytes(row.cssRaw),
    formatBytes(row.gzipTotal),
    formatBytes(row.brotliTotal),
  ]);

  const widths = headers.map((header, columnIndex) =>
    Math.max(
      header.length,
      ...tableRows.map((tableRow) => tableRow[columnIndex].length)
    )
  );

  const headerLine = headers
    .map((header, columnIndex) =>
      pad(header, widths[columnIndex], columnIndex === 0 ? 'left' : 'right')
    )
    .join(' | ');
  const separatorLine = widths
    .map((width) => ''.padEnd(width, '-'))
    .join('-|-');

  console.log(headerLine);
  console.log(separatorLine);

  for (const tableRow of tableRows) {
    console.log(
      tableRow
        .map((value, columnIndex) =>
          pad(value, widths[columnIndex], columnIndex === 0 ? 'left' : 'right')
        )
        .join(' | ')
    );
  }
}

function collectDirectoryEntrypoints(groupDir) {
  return fs
    .readdirSync(groupDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function auditDirectoryGroup({ entityName, groupDir, groupLabel }) {
  const entries = collectDirectoryEntrypoints(groupDir);

  if (entries.length === 0) {
    fail(`No ${entityName.toLowerCase()} directories found in ${groupDir}.`);
  }

  const allFiles = new Set();
  const rows = entries.map((name) => {
    const entryPath = path.join(groupDir, name, 'index.js');

    if (!fs.existsSync(entryPath)) {
      fail(`Missing ${entityName.toLowerCase()} entrypoint: ${entryPath}`);
    }

    const recursiveFiles = collectRecursiveFiles(entryPath);

    for (const filePath of recursiveFiles) {
      allFiles.add(filePath);
    }

    return { name, ...sumSizes(recursiveFiles) };
  });

  rows.sort((left, right) => right.rawTotal - left.rawTotal);
  const unionSizes = sumSizes([...allFiles]);

  console.log(
    `Build size audit for ${entries.length} ${entityName.toLowerCase()}s in ${groupLabel}`
  );
  console.log(
    `(Recursive JS + CSS dependency footprint per ${entityName.toLowerCase()})`
  );
  console.log('');
  printTable(rows, entityName);
  console.log('');
  console.log(`Deduped union across all ${entityName.toLowerCase()}s:`);
  console.log(
    `Raw ${formatBytes(unionSizes.rawTotal)} (JS ${formatBytes(
      unionSizes.jsRaw
    )} + CSS ${formatBytes(unionSizes.cssRaw)}) | ` +
      `Gzip ${formatBytes(unionSizes.gzipTotal)} | ` +
      `Brotli ${formatBytes(unionSizes.brotliTotal)}`
  );

  return unionSizes;
}

function auditFileEntrypointGroup({
  entityName,
  groupDir,
  groupLabel,
  include,
}) {
  const files = fs
    .readdirSync(groupDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && include(entry.name) && !entry.name.endsWith('.d.ts')
    )
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  if (files.length === 0) {
    fail(`No ${entityName.toLowerCase()} files found in ${groupDir}.`);
  }

  const allFiles = new Set();
  const rows = files.map((fileName) => {
    const entryPath = path.join(groupDir, fileName);
    const recursiveFiles = collectRecursiveFiles(entryPath);

    for (const filePath of recursiveFiles) {
      allFiles.add(filePath);
    }

    return { name: fileName, ...sumSizes(recursiveFiles) };
  });

  rows.sort((left, right) => right.rawTotal - left.rawTotal);
  const unionSizes = sumSizes([...allFiles]);

  console.log(
    `Build size audit for ${files.length} ${entityName.toLowerCase()} file${files.length === 1 ? '' : 's'} in ${groupLabel}`
  );
  console.log(
    `(Recursive JS + CSS dependency footprint per ${entityName.toLowerCase()})`
  );
  console.log('');
  printTable(rows, entityName);
  console.log('');
  console.log(`Deduped union across all ${entityName.toLowerCase()} files:`);
  console.log(
    `Raw ${formatBytes(unionSizes.rawTotal)} (JS ${formatBytes(
      unionSizes.jsRaw
    )} + CSS ${formatBytes(unionSizes.cssRaw)}) | ` +
      `Gzip ${formatBytes(unionSizes.gzipTotal)} | ` +
      `Brotli ${formatBytes(unionSizes.brotliTotal)}`
  );

  return unionSizes;
}

function auditCssGroup({ groupDir, groupLabel }) {
  const files = fs
    .readdirSync(groupDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  if (files.length === 0) {
    fail(`No css files found in ${groupDir}.`);
  }

  const rows = files.map((fileName) => {
    const filePath = path.join(groupDir, fileName);
    const sizes = sumSizes([filePath]);

    return { name: fileName, ...sizes };
  });

  rows.sort((left, right) => right.rawTotal - left.rawTotal);
  const unionSizes = sumSizes(
    files.map((fileName) => path.join(groupDir, fileName))
  );

  console.log(
    `Build size audit for ${files.length} css files in ${groupLabel}`
  );
  console.log('(Direct CSS file sizes in dist/css)');
  console.log('');
  printTable(rows, 'CSS');
  console.log('');
  console.log('Deduped union across all css files:');
  console.log(
    `Raw ${formatBytes(unionSizes.rawTotal)} (JS ${formatBytes(
      unionSizes.jsRaw
    )} + CSS ${formatBytes(unionSizes.cssRaw)}) | ` +
      `Gzip ${formatBytes(unionSizes.gzipTotal)} | ` +
      `Brotli ${formatBytes(unionSizes.brotliTotal)}`
  );

  return unionSizes;
}

const summaryRows = [];

const componentTotals = auditDirectoryGroup({
  entityName: 'Component',
  groupDir: componentsDir,
  groupLabel: 'dist/components',
});
summaryRows.push({ group: 'Components', ...componentTotals });

console.log('');

const hookTotals = auditDirectoryGroup({
  entityName: 'Hook',
  groupDir: hooksDir,
  groupLabel: 'dist/hooks',
});
summaryRows.push({ group: 'Hooks', ...hookTotals });

console.log('');

const cssTotals = auditCssGroup({
  groupDir: cssDir,
  groupLabel: 'dist/css',
});
summaryRows.push({ group: 'CSS', ...cssTotals });

console.log('');

const iconTotals = auditFileEntrypointGroup({
  entityName: 'Icon',
  groupDir: iconsDir,
  groupLabel: 'dist/icons',
  include: (fileName) => fileName.endsWith('.js'),
});
summaryRows.push({ group: 'Icons', ...iconTotals });

console.log('');

const templateTotals = auditDirectoryGroup({
  entityName: 'Template',
  groupDir: templatesDir,
  groupLabel: 'dist/templates',
});
summaryRows.push({ group: 'Templates', ...templateTotals });

console.log('');
console.log('Summary totals by group:');
printSummaryTable(summaryRows);
