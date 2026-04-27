import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildTokens,
  resolveExtendedTokenWatchRoots,
  resolveTokenSources,
} from '../src/core';

const sdMocks = vi.hoisted(() => {
  const buildPlatform = vi.fn(async () => {});
  const extend = vi.fn(() => ({ buildPlatform }));
  const registerTransform = vi.fn();
  const registerFormat = vi.fn();
  const styleDictionary = {
    extend,
    registerFormat,
    registerTransform,
  };

  return {
    buildPlatform,
    extend,
    registerFormat,
    registerTransform,
    styleDictionary,
  };
});

vi.mock('style-dictionary', () => ({
  default: sdMocks.styleDictionary,
}));

describe('core build orchestration', () => {
  beforeEach(() => {
    sdMocks.buildPlatform.mockReset();
    sdMocks.extend.mockReset();
    sdMocks.registerFormat.mockReset();
    sdMocks.registerTransform.mockReset();
    delete (sdMocks.styleDictionary as { __hd_registered?: boolean })
      .__hd_registered;
    sdMocks.buildPlatform.mockImplementation(async () => {});
    sdMocks.extend.mockImplementation(() => ({
      buildPlatform: sdMocks.buildPlatform,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds all default platforms', async () => {
    await buildTokens();

    const calls = sdMocks.buildPlatform.mock.calls.map((call) => call[0]);
    expect(calls).toEqual(['css', 'scss', 'meta']);
  });

  it('defaults defaultTheme to dark when not provided', async () => {
    await buildTokens();

    const cssVariablesFormat = sdMocks.registerFormat.mock.calls
      .map((call) => call[0])
      .find(
        (entry: { name?: string }) =>
          entry?.name === 'css/variables-modes-grouped'
      );

    const output = cssVariablesFormat?.format?.({
      dictionary: {
        allTokens: [
          {
            attributes: { theme: 'light' },
            name: 'theme-surface-base',
            value: '#ffffff',
          },
          {
            attributes: { theme: 'dark' },
            name: 'theme-surface-base',
            value: '#111111',
          },
        ],
      },
    });

    expect(output).toContain(
      ':root {\n  /* Theme */\n  --theme-surface-base: #111111;'
    );
  });

  it('ignores empty and invalid local tokens in serve mode', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-core-'));

    try {
      await fs.mkdir(path.join(root, 'tokens'));
      await fs.writeFile(
        path.join(root, 'tokens', 'valid.json'),
        '{"theme":{"text":{"base":{"value":"#000"}}}}'
      );
      await fs.writeFile(path.join(root, 'tokens', 'empty.json'), '');
      await fs.writeFile(path.join(root, 'tokens', 'invalid.json'), '{"a":');

      await buildTokens({ mode: 'serve', root });

      const config = sdMocks.extend.mock.calls.at(-1)?.[0];
      expect(config?.source).toEqual(['tokens/valid.json']);
    } finally {
      await fs.rm(root, { force: true, recursive: true });
    }
  });

  it('resolves extended package tokens before local tokens', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-core-'));

    try {
      const packageRoot = path.join(root, 'node_modules', '@themeshift', 'ui');
      await fs.mkdir(path.join(root, 'tokens'), { recursive: true });
      await fs.mkdir(path.join(packageRoot, 'dist', 'tokens'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(packageRoot, 'package.json'),
        '{"name":"@themeshift/ui","version":"1.0.0"}'
      );
      await fs.writeFile(
        path.join(packageRoot, 'theme-contract.json'),
        '{"tokensGlob":"dist/tokens/**/*.json"}'
      );
      await fs.writeFile(
        path.join(packageRoot, 'dist', 'tokens', 'base.json'),
        '{"components":{"button":{"font":{"value":"500 1rem/1.2 Inter"}}}}'
      );
      await fs.writeFile(
        path.join(root, 'tokens', 'theme.json'),
        '{"components":{"button":{"font":{"value":"600 1rem/1.2 Inter"}}}}'
      );

      const sources = await resolveTokenSources(
        {
          extends: ['@themeshift/ui'],
        },
        { root }
      );

      expect(sources).toHaveLength(2);
      expect(sources[0]).toMatch(
        /node_modules\/@themeshift\/ui\/dist\/tokens\/base\.json$/
      );
      expect(sources[1]).toBe('tokens/theme.json');
    } finally {
      await fs.rm(root, { force: true, recursive: true });
    }
  });

  it('resolves extended watch roots from package contracts', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-core-'));

    try {
      const packageRoot = path.join(root, 'node_modules', '@themeshift', 'ui');
      await fs.mkdir(path.join(packageRoot, 'dist', 'tokens'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(packageRoot, 'package.json'),
        '{"name":"@themeshift/ui","version":"1.0.0"}'
      );
      await fs.writeFile(
        path.join(packageRoot, 'theme-contract.json'),
        '{"tokensGlob":"dist/tokens/**/*.json"}'
      );

      const roots = await resolveExtendedTokenWatchRoots(
        {
          extends: ['@themeshift/ui'],
        },
        root
      );
      const expectedRoot = await fs.realpath(
        path.join(root, 'node_modules', '@themeshift', 'ui', 'dist', 'tokens')
      );

      expect(roots).toEqual([expectedRoot]);
    } finally {
      await fs.rm(root, { force: true, recursive: true });
    }
  });
});
