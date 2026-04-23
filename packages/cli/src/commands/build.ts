import path from 'node:path';

import { buildTokens } from '@themeshift/core';

import { loadThemeShiftConfig } from '../config/loadConfig';

export async function runBuild(options: { configPath?: string; cwd?: string }) {
  const cwd = options.cwd ?? process.cwd();
  const { config, configPath } = await loadThemeShiftConfig(
    cwd,
    options.configPath
  );

  const result = await buildTokens({
    ...config,
    root: cwd,
  });

  const sourceLabel = configPath
    ? path.relative(cwd, configPath)
    : 'inline defaults';

  console.log(
    `Built ThemeShift tokens (${sourceLabel}) in ${result.durationMs}ms`
  );
  for (const file of result.writtenFiles) {
    console.log(`  - ${path.relative(cwd, file)}`);
  }
}
