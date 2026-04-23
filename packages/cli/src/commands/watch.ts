import { watchTokens } from '@themeshift/core';

import { loadThemeShiftConfig } from '../config/loadConfig';

export async function runWatch(options: { configPath?: string; cwd?: string }) {
  const cwd = options.cwd ?? process.cwd();
  const { config } = await loadThemeShiftConfig(cwd, options.configPath);

  const handle = await watchTokens({
    ...config,
    onError(error) {
      console.error(`[style-dictionary] build failed:\n${String(error)}`);
    },
    onSuccess(result) {
      console.log(`Build complete in ${result.durationMs}ms`);
    },
    root: cwd,
  });

  console.log('Watching token files...');

  const stop = async () => {
    await handle.close();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void stop();
  });
  process.on('SIGTERM', () => {
    void stop();
  });

  await new Promise(() => {
    // Intentionally unresolved while watch mode is active.
  });
}
