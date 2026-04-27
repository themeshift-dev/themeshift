#!/usr/bin/env node

import { runAudit } from './commands/audit';
import { runBuild } from './commands/build';
import { runWatch } from './commands/watch';

type ParsedArgs = {
  command?: string;
  options: {
    configPath?: string;
    cssVarPrefix?: string;
    outputFile?: string;
    target?: string;
  };
};

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    command: argv[0],
    options: {},
  };

  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--config') {
      parsed.options.configPath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--cssVarPrefix') {
      parsed.options.cssVarPrefix = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--output') {
      parsed.options.outputFile = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--target') {
      parsed.options.target = argv[index + 1];
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  switch (parsed.command) {
    case 'build':
      await runBuild({ configPath: parsed.options.configPath });
      return;
    case 'watch':
      await runWatch({ configPath: parsed.options.configPath });
      return;
    case 'audit':
      await runAudit({
        cssVarPrefix: parsed.options.cssVarPrefix,
        outputFile: parsed.options.outputFile,
        target: parsed.options.target,
      });
      return;
    default:
      console.log('Usage: themeshift <build|watch|audit> [options]');
      console.log('  --config <path>');
      console.log(
        '  audit options: --target <target|all> --cssVarPrefix <prefix> --output <path>'
      );
      process.exit(parsed.command ? 1 : 0);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
