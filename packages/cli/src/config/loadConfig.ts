import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

import { transform } from 'esbuild';

import type { ThemeShiftOptions } from '@themeshift/core';

const CONFIG_BASENAMES = [
  'themeshift.config.ts',
  'themeshift.config.mts',
  'themeshift.config.cts',
  'themeshift.config.js',
  'themeshift.config.mjs',
  'themeshift.config.cjs',
] as const;

async function resolveConfigExport(
  configExport: unknown
): Promise<ThemeShiftOptions> {
  const resolved =
    typeof configExport === 'function' ? await configExport() : configExport;

  if (!resolved || typeof resolved !== 'object') {
    return {};
  }

  return resolved as ThemeShiftOptions;
}

async function importTsConfig(filePath: string) {
  const source = await fs.promises.readFile(filePath, 'utf8');
  const transformed = await transform(source, {
    format: 'esm',
    loader: 'ts',
    sourcefile: filePath,
    sourcemap: 'inline',
    target: 'es2022',
  });

  const tempFile = path.join(
    os.tmpdir(),
    `themeshift-config-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.mjs`
  );

  try {
    await fs.promises.writeFile(tempFile, transformed.code, 'utf8');
    return await import(pathToFileURL(tempFile).href);
  } finally {
    await fs.promises.rm(tempFile, { force: true });
  }
}

export async function loadThemeShiftConfig(
  cwd = process.cwd(),
  explicitPath?: string
): Promise<{ config: ThemeShiftOptions; configPath: string | null }> {
  const configPath = explicitPath
    ? path.resolve(cwd, explicitPath)
    : (CONFIG_BASENAMES.map((name) => path.resolve(cwd, name)).find((entry) =>
        fs.existsSync(entry)
      ) ?? null);

  if (!configPath) {
    return { config: {}, configPath: null };
  }

  const ext = path.extname(configPath).toLowerCase();

  if (ext === '.cjs' || ext === '.cts') {
    const require = createRequire(import.meta.url);
    const loaded = require(configPath);

    return {
      config: await resolveConfigExport(loaded.default ?? loaded),
      configPath,
    };
  }

  const loaded =
    ext === '.ts' || ext === '.mts'
      ? await importTsConfig(configPath)
      : await import(pathToFileURL(configPath).href);

  return {
    config: await resolveConfigExport(loaded.default ?? loaded),
    configPath,
  };
}
