import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { loadThemeShiftConfig } from '../src/config/loadConfig';

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots
      .splice(0)
      .map((root) => fs.rm(root, { force: true, recursive: true }))
  );
});

describe('loadThemeShiftConfig', () => {
  it('loads themeshift.config.ts default export', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-cli-'));
    tempRoots.push(root);

    await fs.writeFile(
      path.join(root, 'themeshift.config.ts'),
      `
      export default {
        cssVarPrefix: 'themeshift',
        outputComments: true,
      };
      `,
      'utf8'
    );

    const result = await loadThemeShiftConfig(root);

    expect(result.configPath).toBe(path.join(root, 'themeshift.config.ts'));
    expect(result.config).toMatchObject({
      cssVarPrefix: 'themeshift',
      outputComments: true,
    });
  });

  it('returns empty config when file does not exist', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-cli-'));
    tempRoots.push(root);

    const result = await loadThemeShiftConfig(root);

    expect(result.configPath).toBeNull();
    expect(result.config).toEqual({});
  });
});
