#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const COVERAGE_FLOOR = Number(process.env.TS_UI_COVERAGE_FLOOR ?? 80);
const REPO_ROOT = process.cwd();
const LCOV_PATH = path.join(REPO_ROOT, 'packages/ui/coverage/lcov.info');
const SOURCE_PREFIX = 'packages/ui/src/';
const VALID_EXTENSIONS = new Set(['.ts', '.tsx']);
const EXCLUDED_PATH_PATTERNS = [
  /^packages\/ui\/src\/components\/index\.ts$/,
  /^packages\/ui\/src\/components\/.+\/types\.ts$/,
  /^packages\/ui\/src\/components\/.+\.meta\.ts$/,
  /^packages\/ui\/src\/design-tokens\//,
  /^packages\/ui\/src\/entrypoints\//,
  /^packages\/ui\/src\/icons\//,
];

function isCoverageTarget(entry) {
  return !EXCLUDED_PATH_PATTERNS.some((pattern) => pattern.test(entry));
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    process.exit(result.status ?? 1);
  }

  return result.stdout ?? '';
}

function getDiffBaseRef() {
  const upstream = spawnSync(
    'git',
    ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    }
  );

  if (upstream.status === 0) {
    return upstream.stdout.trim();
  }

  return 'origin/main';
}

function getChangedUiFiles() {
  const baseRef = getDiffBaseRef();
  const output = run('git', [
    'diff',
    '--name-only',
    '--diff-filter=ACMR',
    `${baseRef}...HEAD`,
  ]);

  const files = output
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => entry.startsWith(SOURCE_PREFIX))
    .filter((entry) => VALID_EXTENSIONS.has(path.extname(entry)))
    .filter(isCoverageTarget)
    .filter(
      (entry) =>
        !entry.endsWith('.test.ts') &&
        !entry.endsWith('.test.tsx') &&
        !entry.endsWith('.stories.ts') &&
        !entry.endsWith('.stories.tsx')
    );

  return [...new Set(files)].sort();
}

function parseLcov(content) {
  const coverageByFile = new Map();
  const records = content.split('end_of_record');

  for (const record of records) {
    const lines = record.split('\n').map((line) => line.trim());
    const sourceLine = lines.find((line) => line.startsWith('SF:'));

    if (!sourceLine) {
      continue;
    }

    const sourcePath = sourceLine.slice(3);
    const normalizedSourcePath = sourcePath.replace(/\\/g, '/');
    const relativePath = path.isAbsolute(sourcePath)
      ? path.relative(REPO_ROOT, sourcePath).replace(/\\/g, '/')
      : normalizedSourcePath.startsWith('src/')
        ? `packages/ui/${normalizedSourcePath}`
        : normalizedSourcePath;

    const lf = Number(
      lines.find((line) => line.startsWith('LF:'))?.slice(3) ?? 0
    );
    const lh = Number(
      lines.find((line) => line.startsWith('LH:'))?.slice(3) ?? 0
    );

    if (lf <= 0) {
      coverageByFile.set(relativePath, 100);
      continue;
    }

    coverageByFile.set(relativePath, (lh / lf) * 100);
  }

  return coverageByFile;
}

const changedFiles = getChangedUiFiles();

if (!changedFiles.length) {
  console.log(
    'No changed packages/ui source files detected; skipping ui changed-file coverage gate.'
  );
  process.exit(0);
}

console.log('Running ui coverage for changed files...');
run('pnpm', ['-C', 'packages/ui', 'test:coverage']);

if (!fs.existsSync(LCOV_PATH)) {
  console.error(`Coverage file not found at ${LCOV_PATH}`);
  process.exit(1);
}

const coverageByFile = parseLcov(fs.readFileSync(LCOV_PATH, 'utf8'));
const failures = [];

for (const changedFile of changedFiles) {
  const percent = coverageByFile.get(changedFile);

  if (percent === undefined) {
    console.log(`- ${changedFile}: skipped (not reported by lcov)`);
    continue;
  }

  if (percent < COVERAGE_FLOOR) {
    failures.push({ file: changedFile, percent, reason: 'below threshold' });
  }
}

console.log(`Coverage floor: ${COVERAGE_FLOOR}%`);
for (const changedFile of changedFiles) {
  const percent = coverageByFile.get(changedFile);
  const formatted = percent === undefined ? 'N/A' : `${percent.toFixed(2)}%`;
  console.log(`- ${changedFile}: ${formatted}`);
}

if (failures.length) {
  console.error('\nCoverage gate failed for changed files:');
  for (const failure of failures) {
    console.error(
      `- ${failure.file}: ${failure.percent.toFixed(2)}% (${failure.reason})`
    );
  }
  process.exit(1);
}

console.log('ui changed-file coverage gate passed.');
