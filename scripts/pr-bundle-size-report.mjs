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

const baseUiPath = getArgValue('--base-ui') ?? getArgValue('--base');
const headUiPath = getArgValue('--head-ui') ?? getArgValue('--head');
const baseHeadlessPath = getArgValue('--base-headless');
const headHeadlessPath = getArgValue('--head-headless');
const outPath = getArgValue('--out');
const changedArg = getArgValue('--changed') ?? '';
const baseSha = getArgValue('--base-sha') ?? 'unknown';
const headSha = getArgValue('--head-sha') ?? 'unknown';

if (!baseUiPath || !headUiPath || !outPath) {
  fail(
    'Missing required args. Use --base-ui=... --head-ui=... --out=... (or legacy --base/--head).'
  );
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

const baseUiReport = readJson(baseUiPath);
const headUiReport = readJson(headUiPath);
const baseHeadlessReport = baseHeadlessPath ? readJson(baseHeadlessPath) : null;
const headHeadlessReport = headHeadlessPath ? readJson(headHeadlessPath) : null;

const baseUiMap = toComponentMap(baseUiReport);
const headUiMap = toComponentMap(headUiReport);
const baseHeadlessMap = toComponentMap(baseHeadlessReport);
const headHeadlessMap = toComponentMap(headHeadlessReport);

const componentNames = new Set(changedComponents);
for (const name of baseUiMap.keys()) {
  if (!headUiMap.has(name)) {
    componentNames.add(name);
  }
}
for (const name of headUiMap.keys()) {
  if (!baseUiMap.has(name)) {
    componentNames.add(name);
  }
}
for (const name of baseHeadlessMap.keys()) {
  if (!headHeadlessMap.has(name)) {
    componentNames.add(name);
  }
}
for (const name of headHeadlessMap.keys()) {
  if (!baseHeadlessMap.has(name)) {
    componentNames.add(name);
  }
}

const rows = [...componentNames]
  .sort((left, right) => left.localeCompare(right))
  .map((name) => {
    const baseUiRow = baseUiMap.get(name);
    const headUiRow = headUiMap.get(name);
    const baseHeadlessRow = baseHeadlessMap.get(name);
    const headHeadlessRow = headHeadlessMap.get(name);

    const uiRawDelta =
      metric(headUiRow, 'rawTotal') - metric(baseUiRow, 'rawTotal');
    const uiGzipDelta =
      metric(headUiRow, 'gzipTotal') - metric(baseUiRow, 'gzipTotal');
    const uiBrotliDelta =
      metric(headUiRow, 'brotliTotal') - metric(baseUiRow, 'brotliTotal');

    const headlessRawDelta =
      metric(headHeadlessRow, 'rawTotal') - metric(baseHeadlessRow, 'rawTotal');
    const headlessGzipDelta =
      metric(headHeadlessRow, 'gzipTotal') -
      metric(baseHeadlessRow, 'gzipTotal');
    const headlessBrotliDelta =
      metric(headHeadlessRow, 'brotliTotal') -
      metric(baseHeadlessRow, 'brotliTotal');

    return {
      name,
      status: statusFor(
        baseUiRow ?? baseHeadlessRow,
        headUiRow ?? headHeadlessRow
      ),
      uiRawDelta,
      uiGzipDelta,
      uiBrotliDelta,
      headlessRawDelta,
      headlessGzipDelta,
      headlessBrotliDelta,
      rawDelta: uiRawDelta + headlessRawDelta,
      gzipDelta: uiGzipDelta + headlessGzipDelta,
      brotliDelta: uiBrotliDelta + headlessBrotliDelta,
    };
  });

rows.sort((left, right) => {
  const deltaDiff = Math.abs(right.brotliDelta) - Math.abs(left.brotliDelta);
  if (deltaDiff !== 0) {
    return deltaDiff;
  }

  return left.name.localeCompare(right.name);
});

const baseUiUnion = baseUiReport?.groups?.components?.unionSizes ?? {};
const headUiUnion = headUiReport?.groups?.components?.unionSizes ?? {};
const baseHeadlessUnion =
  baseHeadlessReport?.group?.components?.unionSizes ?? {};
const headHeadlessUnion =
  headHeadlessReport?.group?.components?.unionSizes ?? {};

const uiUnionRawDelta =
  metric(headUiUnion, 'rawTotal') - metric(baseUiUnion, 'rawTotal');
const uiUnionGzipDelta =
  metric(headUiUnion, 'gzipTotal') - metric(baseUiUnion, 'gzipTotal');
const uiUnionBrotliDelta =
  metric(headUiUnion, 'brotliTotal') - metric(baseUiUnion, 'brotliTotal');

const headlessUnionRawDelta =
  metric(headHeadlessUnion, 'rawTotal') - metric(baseHeadlessUnion, 'rawTotal');
const headlessUnionGzipDelta =
  metric(headHeadlessUnion, 'gzipTotal') -
  metric(baseHeadlessUnion, 'gzipTotal');
const headlessUnionBrotliDelta =
  metric(headHeadlessUnion, 'brotliTotal') -
  metric(baseHeadlessUnion, 'brotliTotal');

const unionRawDelta = uiUnionRawDelta + headlessUnionRawDelta;
const unionGzipDelta = uiUnionGzipDelta + headlessUnionGzipDelta;
const unionBrotliDelta = uiUnionBrotliDelta + headlessUnionBrotliDelta;

const marker = '<!-- bundle-size-report -->';
const lines = [
  marker,
  '# Component Bundle Size Report',
  '',
  `Base: \`${shortSha(baseSha)}\`  Head: \`${shortSha(headSha)}\``,
  '',
  `Overall deduped components union deltas (UI + headless combined): Raw ${formatDelta(unionRawDelta)}, Gzip ${formatDelta(unionGzipDelta)}, Brotli ${formatDelta(unionBrotliDelta)}.`,
  '',
  `UI-only union deltas: Raw ${formatDelta(uiUnionRawDelta)}, Gzip ${formatDelta(uiUnionGzipDelta)}, Brotli ${formatDelta(uiUnionBrotliDelta)}.`,
  `Headless-only union deltas: Raw ${formatDelta(headlessUnionRawDelta)}, Gzip ${formatDelta(headlessUnionGzipDelta)}, Brotli ${formatDelta(headlessUnionBrotliDelta)}.`,
  '',
];

if (rows.length === 0) {
  lines.push('No component-level bundle changes detected.');
} else {
  lines.push(
    '| Component | Status | UI Raw Δ | Headless Raw Δ | Combined Raw Δ | UI Gzip Δ | Headless Gzip Δ | Combined Gzip Δ | UI Brotli Δ | Headless Brotli Δ | Combined Brotli Δ |'
  );
  lines.push('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');

  for (const row of rows) {
    lines.push(
      `| ${row.name} | ${row.status} | ${formatDelta(row.uiRawDelta)} | ${formatDelta(row.headlessRawDelta)} | ${formatDelta(row.rawDelta)} | ${formatDelta(row.uiGzipDelta)} | ${formatDelta(row.headlessGzipDelta)} | ${formatDelta(row.gzipDelta)} | ${formatDelta(row.uiBrotliDelta)} | ${formatDelta(row.headlessBrotliDelta)} | ${formatDelta(row.brotliDelta)} |`
    );
  }
}

const output = `${lines.join('\n')}\n`;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output, 'utf8');
