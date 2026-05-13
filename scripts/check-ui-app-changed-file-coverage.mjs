#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const COVERAGE_FLOOR = 75;
const REPO_ROOT = process.cwd();
const LCOV_PATH = path.join(REPO_ROOT, 'apps/ui-app/coverage/lcov.info');
const SOURCE_PREFIX = 'apps/ui-app/src/';
const VALID_EXTENSIONS = new Set(['.ts', '.tsx']);
const EXCLUDED_PATH_PATTERNS = [
  /^apps\/ui-app\/src\/apiReference\/generated\//,
  /^apps\/ui-app\/src\/design-tokens\//,
  /^apps\/ui-app\/src\/pages\/componentGuides\//,
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

function getStagedUiAppFiles() {
  const output = run('git', [
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMR',
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
        ? `apps/ui-app/${normalizedSourcePath}`
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

    const percent = (lh / lf) * 100;
    coverageByFile.set(relativePath, percent);
  }

  return coverageByFile;
}

const stagedFiles = getStagedUiAppFiles();

if (!stagedFiles.length) {
  console.log(
    'No staged apps/ui-app source files detected; skipping ui-app coverage gate.'
  );
  process.exit(0);
}

console.log('Running ui-app coverage for staged files...');
run('pnpm', ['-C', 'apps/ui-app', 'test:coverage']);

if (!fs.existsSync(LCOV_PATH)) {
  console.error(`Coverage file not found at ${LCOV_PATH}`);
  process.exit(1);
}

const coverageByFile = parseLcov(fs.readFileSync(LCOV_PATH, 'utf8'));
const failures = [];

for (const stagedFile of stagedFiles) {
  const percent = coverageByFile.get(stagedFile);

  if (percent === undefined) {
    failures.push({
      file: stagedFile,
      percent: 0,
      reason: 'missing from lcov report',
    });
    continue;
  }

  if (percent < COVERAGE_FLOOR) {
    failures.push({ file: stagedFile, percent, reason: 'below threshold' });
  }
}

console.log(`Coverage floor: ${COVERAGE_FLOOR}%`);
for (const stagedFile of stagedFiles) {
  const percent = coverageByFile.get(stagedFile);
  const formatted = percent === undefined ? 'N/A' : `${percent.toFixed(2)}%`;
  console.log(`- ${stagedFile}: ${formatted}`);
}

if (failures.length) {
  console.error('\nCoverage gate failed for staged files:');
  for (const failure of failures) {
    console.error(
      `- ${failure.file}: ${failure.percent.toFixed(2)}% (${failure.reason})`
    );
  }
  process.exit(1);
}

console.log('ui-app staged-file coverage gate passed.');
