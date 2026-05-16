import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootArg = process.argv.find((entry) => entry.startsWith('--root='));
const rootDir = rootArg
  ? path.resolve(process.cwd(), rootArg.slice('--root='.length))
  : path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const componentsDir = path.join(distDir, 'components');
const jsonMode = process.argv.includes('--json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(componentsDir)) {
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

  return [...visited].filter((filePath) => filePath.endsWith('.js'));
}

function sumSizes(files) {
  const rawTotal = files.reduce(
    (total, filePath) => total + getFilesize(filePath),
    0
  );
  const gzipTotal = files.reduce(
    (total, filePath) => total + getGzipSize(filePath),
    0
  );
  const brotliTotal = files.reduce(
    (total, filePath) => total + getBrotliSize(filePath),
    0
  );

  return { brotliTotal, gzipTotal, rawTotal };
}

function pad(value, width, align = 'left') {
  if (align === 'right') {
    return value.padStart(width, ' ');
  }

  return value.padEnd(width, ' ');
}

function printTable(rows) {
  const headers = ['Component', 'Raw total', 'Gzip', 'Brotli'];
  const tableRows = rows.map((row) => [
    row.name,
    formatBytes(row.rawTotal),
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

const components = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right));

if (components.length === 0) {
  fail(`No component directories found in ${componentsDir}.`);
}

const allFiles = new Set();
const rows = components.map((name) => {
  const entryPath = path.join(componentsDir, name, 'index.js');

  if (!fs.existsSync(entryPath)) {
    fail(`Missing component entrypoint: ${entryPath}`);
  }

  const recursiveFiles = collectRecursiveFiles(entryPath);

  for (const filePath of recursiveFiles) {
    allFiles.add(filePath);
  }

  return { name, ...sumSizes(recursiveFiles) };
});

rows.sort((left, right) => right.rawTotal - left.rawTotal);
const unionSizes = sumSizes([...allFiles]);

if (jsonMode) {
  process.stdout.write(
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        distDir,
        group: { components: { rows, unionSizes } },
      },
      null,
      2
    )}\n`
  );
} else {
  console.log(
    `Build size audit for ${components.length} headless components in dist/components`
  );
  console.log('(Recursive JS dependency footprint per component)');
  console.log('');
  printTable(rows);
  console.log('');
  console.log('Deduped union across all components:');
  console.log(
    `Raw ${formatBytes(unionSizes.rawTotal)} | ` +
      `Gzip ${formatBytes(unionSizes.gzipTotal)} | ` +
      `Brotli ${formatBytes(unionSizes.brotliTotal)}`
  );
}
