const { spawn } = require('node:child_process');
const readline = require('node:readline');

const chalk = require('chalk');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const verbose = process.argv.includes('--verbose');
const useDashboard = process.stdout.isTTY && !verbose;

const checks = [
  {
    name: 'Workspace validation',
    args: ['ci:validate'],
    after: [
      {
        name: 'UI coverage',
        packageName: '@themeshift/ui',
        args: ['--filter', '@themeshift/ui', 'test:coverage'],
      },
      {
        name: 'Plugin coverage',
        packageName: '@themeshift/vite-plugin-themeshift',
        args: [
          '--filter',
          '@themeshift/vite-plugin-themeshift',
          'test:coverage',
        ],
      },
    ],
  },
];

function prepareCheck(check) {
  const prepared = {
    ...check,
    after: check.after?.map(prepareCheck) ?? [],
    blocked: false,
    blocker: null,
    coverage: null,
    durationMs: 0,
    error: null,
    output: '',
    status: 'waiting',
    tests: null,
  };

  return prepared;
}

function flattenChecks(checksToFlatten) {
  return checksToFlatten.flatMap((check) => [
    check,
    ...flattenChecks(check.after),
  ]);
}

const checkTree = checks.map(prepareCheck);
const allChecks = flattenChecks(checkTree);
const totalRunnableChecks = allChecks.length;

function markBlocked(check, blocker) {
  check.blocked = true;
  check.blocker = blocker;
}

let completedRunnableChecks = 0;
let renderedLineCount = 0;
let spinnerFrameIndex = 0;
let spinnerFrames = [''];

function stripAnsi(value) {
  return value.replace(
    /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[a-zA-Z\d]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g,
    ''
  );
}

function formatDuration(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatStatusIcon(status) {
  const colors = {
    failed: chalk.red('❌'),
    passed: chalk.green('✅'),
    running: chalk.white('🏃'),
    waiting: chalk.dim('💤'),
  };

  return colors[status];
}

function renderSnapshot() {
  if (!useDashboard) {
    return;
  }

  if (renderedLineCount > 0) {
    readline.moveCursor(process.stdout, 0, -renderedLineCount);
    readline.clearScreenDown(process.stdout);
  }

  const lines = [
    chalk.bold('Release Preflight'),
    '',
    `Progress: ${completedRunnableChecks}/${totalRunnableChecks}`,
    '',
    ...allChecks.map(formatProgressRow),
  ];

  process.stdout.write(`${lines.join('\n')}\n`);
  renderedLineCount = lines.length;
}

function formatProgressBar(check) {
  const width = 24;
  const percent =
    check.status === 'passed' ? 1 : check.status === 'running' ? 0.3 : 0;
  const filled = Math.round(width * percent);
  const empty = width - filled;
  const bar = `${'█'.repeat(filled)}${'░'.repeat(empty)}`;

  if (check.status === 'passed') {
    return chalk.green(bar);
  }

  if (check.status === 'failed') {
    return chalk.red(bar);
  }

  if (check.status === 'running') {
    return chalk.white(bar);
  }

  return chalk.dim(bar);
}

function formatSpinner(check) {
  if (check.status !== 'running') {
    return ' ';
  }

  return chalk.cyan(spinnerFrames[spinnerFrameIndex % spinnerFrames.length]);
}

function formatProgressRow(check) {
  const label = check.packageName ?? check.name;
  const nameColumnWidth = Math.max(
    ...allChecks
      .map((currentCheck) => currentCheck.packageName ?? currentCheck.name)
      .map((name) => name.length)
  );
  const paddedLabel = label.padEnd(nameColumnWidth);
  const name =
    check.status === 'waiting'
      ? chalk.dim(paddedLabel)
      : chalk.bold(paddedLabel);
  const details = [];

  if (check.coverage) {
    details.push(`${check.coverage.lines}% lines`);
  }

  if (check.tests) {
    details.push(`${check.tests.tests.passed} tests`);
  }

  if (check.blocked) {
    details.push(`blocked by ${check.blocker.name}`);
  } else if (check.status === 'running' || check.durationMs > 0) {
    details.push(formatDuration(check.durationMs));
  }

  return `${formatStatusIcon(check.status)} ${formatSpinner(check)} ${name} ${formatProgressBar(check)} ${chalk.dim(details.join(', '))}`;
}

function updateProgressBar() {
  renderSnapshot();
}

async function loadSpinnerFrames() {
  const { spinners } = await import('ora');
  spinnerFrames = spinners.dots.frames;
}

function finishDashboard() {
  if (!useDashboard || renderedLineCount === 0) {
    return;
  }

  console.log('');
}

function parseCount(summary, label) {
  const match = summary.match(new RegExp(`(\\d+)\\s+${label}`));
  return match ? Number(match[1]) : 0;
}

function parseTests(output) {
  const matches = [
    ...output.matchAll(/Test Files\s+([^\n]+)\n\s+Tests\s+([^\n]+)/g),
  ];
  const match = matches.at(-1);

  if (!match) {
    return null;
  }

  return {
    suites: {
      failed: parseCount(match[1], 'failed'),
      passed: parseCount(match[1], 'passed'),
      summary: match[1].trim(),
    },
    tests: {
      failed: parseCount(match[2], 'failed'),
      passed: parseCount(match[2], 'passed'),
      summary: match[2].trim(),
    },
  };
}

function parseCoverage(output) {
  const allFilesLine = output
    .split('\n')
    .find((line) => line.trim().startsWith('All files'));

  if (!allFilesLine) {
    return null;
  }

  const parts = allFilesLine.split('|').map((part) => part.trim());

  return {
    branches: parts[2],
    functions: parts[3],
    lines: parts[4],
    statements: parts[1],
  };
}

function summarizeOutput(check) {
  const output = stripAnsi(check.output);

  check.coverage = parseCoverage(output);
  check.tests = parseTests(output);
}

function printLogTail(check) {
  const lines = stripAnsi(check.output).trim().split('\n').filter(Boolean);
  const tail = lines.slice(-40).join('\n');

  if (!tail) {
    return;
  }

  console.log(`\n${chalk.bold(`${check.name} log tail`)}`);
  console.log(chalk.dim(tail));
}

function printFinalSummary() {
  const passed = allChecks.filter((check) => check.status === 'passed').length;
  const failed = allChecks.filter((check) => check.status === 'failed').length;
  const blocked = allChecks.filter((check) => check.blocked).length;
  const failedChecks = allChecks.filter((check) => check.status === 'failed');
  const heading =
    failed === 0
      ? chalk.green('Release preflight passed.')
      : chalk.red('Release preflight failed.');

  console.log(`\n${heading}`);
  console.log(
    `\nChecks: ${chalk.green(`${passed} passed`)}, ${failed > 0 ? chalk.red(`${failed} failed`) : chalk.dim(`${failed} failed`)}, ${blocked > 0 ? chalk.yellow(`${blocked} blocked`) : chalk.dim(`${blocked} blocked`)}`
  );

  for (const check of allChecks) {
    console.log(`\n${chalk.bold(check.packageName ?? check.name)}`);
    console.log(
      `Status: ${check.blocked ? chalk.yellow(`blocked by ${check.blocker.name}`) : check.status === 'passed' ? chalk.green('passed') : check.status === 'failed' ? chalk.red('failed') : chalk.dim(check.status)}`
    );

    if (check.tests) {
      console.log(
        `Tests: ${check.tests.tests.passed} passed, ${check.tests.tests.failed} failed`
      );
      console.log(
        `Suites: ${check.tests.suites.passed} passed, ${check.tests.suites.failed} failed`
      );
    }

    if (check.coverage) {
      console.log(
        `Coverage: ${check.coverage.statements}% statements, ${check.coverage.branches}% branches, ${check.coverage.functions}% functions, ${check.coverage.lines}% lines`
      );
    }

    console.log(`Duration: ${formatDuration(check.durationMs)}`);
  }

  for (const check of failedChecks) {
    printLogTail(check);
  }

  console.log('\n\n');
}

function runCheck(check) {
  return new Promise((resolve) => {
    const startedAt = Date.now();

    check.status = 'running';

    if (!useDashboard) {
      console.log(
        `\n${formatStatusIcon(check.status)} ${chalk.bold(check.name)}`
      );
    }

    updateProgressBar();

    const timer = setInterval(() => {
      check.durationMs = Date.now() - startedAt;
      spinnerFrameIndex += 1;
      updateProgressBar();
    }, 80);

    const child = spawn(pnpm, check.args, {
      env: {
        ...process.env,
        FORCE_COLOR: '0',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk) => {
      const value = String(chunk);
      check.output += value;

      if (verbose) {
        process.stdout.write(value);
      }
    });

    child.stderr.on('data', (chunk) => {
      const value = String(chunk);
      check.output += value;

      if (verbose) {
        process.stderr.write(value);
      }
    });

    child.on('error', (error) => {
      check.error = error;
    });

    child.on('close', (code) => {
      clearInterval(timer);
      check.durationMs = Date.now() - startedAt;
      check.status = code === 0 && !check.error ? 'passed' : 'failed';
      completedRunnableChecks += 1;

      summarizeOutput(check);
      updateProgressBar();

      if (!useDashboard) {
        console.log(
          `${formatStatusIcon(check.status)} ${chalk.bold(check.name)} ${chalk.dim(formatDuration(check.durationMs))}`
        );
      }

      resolve(check.status === 'passed');
    });
  });
}

async function main() {
  await loadSpinnerFrames();

  if (!useDashboard) {
    console.log(chalk.bold('Release Preflight'));
  }

  updateProgressBar();

  for (const check of checkTree) {
    const passed = await runCheck(check);

    if (!passed) {
      for (const afterCheck of check.after) {
        markBlocked(afterCheck, check);
        updateProgressBar();
      }

      break;
    }

    const afterResults = await Promise.all(check.after.map(runCheck));

    if (afterResults.some((passedAfterCheck) => !passedAfterCheck)) {
      break;
    }
  }

  finishDashboard();

  printFinalSummary();

  process.exit(allChecks.some((check) => check.status === 'failed') ? 1 : 0);
}

main().catch((error) => {
  console.error(chalk.red('Release preflight failed unexpectedly.'));
  console.error(error);
  process.exit(1);
});
