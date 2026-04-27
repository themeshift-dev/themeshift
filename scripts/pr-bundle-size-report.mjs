import fs from 'node:fs';
import path from 'node:path';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function getArgValue(name) {
  const arg = process.argv.find((entry) => entry.startsWith(`${name}=`));
  if (!arg) {
    return null;
  }

  return arg.slice(name.length + 1);
}

const basePath = getArgValue('--base');
const headPath = getArgValue('--head');
const outPath = getArgValue('--out');
const changedArg = getArgValue('--changed') ?? '';
const baseSha = getArgValue('--base-sha') ?? 'unknown';
const headSha = getArgValue('--head-sha') ?? 'unknown';

if (!basePath || !headPath || !outPath) {
  fail('Missing required args. Use --base=... --head=... --out=...');
}

const changedComponents = changedArg
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function bytesToHuman(value) {
  if (Math.abs(value) < 1024) {
    return `${value} B`;
  }

  return `${(value / 1024).toFixed(2)} KB`;
}

function formatDelta(value) {
  if (value === 0) {
    return '0 B';
  }

  return `${value > 0 ? '+' : ''}${bytesToHuman(value)}`;
}

function shortSha(sha) {
  return sha.slice(0, 7);
}

function toComponentMap(report) {
  const rows = report?.groups?.components?.rows ?? [];

  return new Map(rows.map((row) => [row.name, row]));
}

function metric(row, key) {
  if (!row) {
    return 0;
  }

  const value = row[key];
  return typeof value === 'number' ? value : 0;
}

function statusFor(baseRow, headRow) {
  if (!baseRow && headRow) {
    return 'Added';
  }

  if (baseRow && !headRow) {
    return 'Removed';
  }

  return 'Changed';
}

const baseReport = readJson(basePath);
const headReport = readJson(headPath);

const baseMap = toComponentMap(baseReport);
const headMap = toComponentMap(headReport);

const componentNames = new Set(changedComponents);
for (const name of baseMap.keys()) {
  if (!headMap.has(name)) {
    componentNames.add(name);
  }
}
for (const name of headMap.keys()) {
  if (!baseMap.has(name)) {
    componentNames.add(name);
  }
}

const rows = [...componentNames]
  .sort((left, right) => left.localeCompare(right))
  .map((name) => {
    const baseRow = baseMap.get(name);
    const headRow = headMap.get(name);
    const rawDelta = metric(headRow, 'rawTotal') - metric(baseRow, 'rawTotal');
    const gzipDelta =
      metric(headRow, 'gzipTotal') - metric(baseRow, 'gzipTotal');
    const brotliDelta =
      metric(headRow, 'brotliTotal') - metric(baseRow, 'brotliTotal');

    return {
      name,
      baseRow,
      headRow,
      status: statusFor(baseRow, headRow),
      rawDelta,
      gzipDelta,
      brotliDelta,
    };
  });

rows.sort((left, right) => {
  const deltaDiff = Math.abs(right.brotliDelta) - Math.abs(left.brotliDelta);
  if (deltaDiff !== 0) {
    return deltaDiff;
  }

  return left.name.localeCompare(right.name);
});

const baseUnion = baseReport?.groups?.components?.unionSizes ?? {};
const headUnion = headReport?.groups?.components?.unionSizes ?? {};
const unionRawDelta =
  metric(headUnion, 'rawTotal') - metric(baseUnion, 'rawTotal');
const unionGzipDelta =
  metric(headUnion, 'gzipTotal') - metric(baseUnion, 'gzipTotal');
const unionBrotliDelta =
  metric(headUnion, 'brotliTotal') - metric(baseUnion, 'brotliTotal');

const marker = '<!-- bundle-size-report -->';
const lines = [
  marker,
  '# Component Bundle Size Report',
  '',
  `Base: \`${shortSha(baseSha)}\`  Head: \`${shortSha(headSha)}\``,
  '',
  `Overall deduped components union deltas: Raw ${formatDelta(unionRawDelta)}, Gzip ${formatDelta(unionGzipDelta)}, Brotli ${formatDelta(unionBrotliDelta)}.`,
  '',
];

if (rows.length === 0) {
  lines.push('No component-level bundle changes detected.');
} else {
  lines.push('| Component | Status | Raw Δ | Gzip Δ | Brotli Δ |');
  lines.push('|---|---:|---:|---:|---:|');

  for (const row of rows) {
    lines.push(
      `| ${row.name} | ${row.status} | ${formatDelta(row.rawDelta)} | ${formatDelta(row.gzipDelta)} | ${formatDelta(row.brotliDelta)} |`
    );
  }
}

const output = `${lines.join('\n')}\n`;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output, 'utf8');
