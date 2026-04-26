import fs from 'node:fs/promises';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { withThemeShift } from '../src/plugin';

const coreMocks = vi.hoisted(() => {
  return {
    buildTokens: vi.fn(async () => ({
      changedFiles: undefined,
      durationMs: 10,
      endedAt: 2,
      startedAt: 1,
      writtenFiles: ['/tmp/src/css/tokens.css'],
    })),
    watchTokens: vi.fn(async () => ({
      close: vi.fn(async () => {}),
    })),
  };
});

vi.mock('@themeshift/core', async () => {
  const actual =
    await vi.importActual<typeof import('@themeshift/core')>(
      '@themeshift/core'
    );

  return {
    ...actual,
    buildTokens: coreMocks.buildTokens,
    watchTokens: coreMocks.watchTokens,
  };
});

describe('withThemeShift', () => {
  beforeEach(() => {
    coreMocks.buildTokens.mockClear();
    coreMocks.watchTokens.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('supports withThemeShift(nextConfig, options)', async () => {
    const wrapped = withThemeShift(
      {
        reactStrictMode: true,
      },
      {
        cssVarPrefix: 'themeshift',
      }
    );

    const resolved = await wrapped('phase-production-build', {
      dir: '/repo',
    });

    expect(resolved.reactStrictMode).toBe(true);
    expect(coreMocks.buildTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        cssVarPrefix: 'themeshift',
        mode: 'build',
        root: '/repo',
      })
    );
  });

  it('supports withThemeShift(options)(nextConfig)', async () => {
    const wrapped = withThemeShift({ defaultTheme: 'dark' });

    const resolved = await wrapped({ poweredByHeader: false })(
      'phase-production-build',
      {
        dir: '/repo',
      }
    );

    expect(resolved.poweredByHeader).toBe(false);
    expect(coreMocks.buildTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultTheme: 'dark',
        mode: 'build',
      })
    );
  });

  it('starts the watcher only once per root in development phase', async () => {
    const wrapped = withThemeShift({ reactStrictMode: true }, { watch: true });

    await wrapped('phase-development-server', { dir: '/repo' });
    await wrapped('phase-development-server', { dir: '/repo' });

    expect(coreMocks.watchTokens).toHaveBeenCalledTimes(1);
    expect(coreMocks.watchTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'serve',
        root: '/repo',
        watch: true,
      })
    );
  });

  it('wraps webpack and preserves user webpack behavior', async () => {
    const userWebpack = vi.fn((config: Record<string, unknown>) => ({
      ...config,
      transformed: true,
    }));

    const wrapped = withThemeShift(
      {
        webpack: userWebpack,
      },
      {
        cssVarPrefix: 'themeshift',
      }
    );

    const resolved = await wrapped('phase-production-build', {
      dir: '/repo',
    });

    const webpackResult = await resolved.webpack?.(
      { entry: './src/index.ts' },
      {
        dev: false,
        dir: '/repo',
      }
    );

    expect(userWebpack).toHaveBeenCalledWith(
      { entry: './src/index.ts' },
      { dev: false, dir: '/repo' }
    );
    expect(webpackResult).toEqual({
      entry: './src/index.ts',
      transformed: true,
    });
    expect(coreMocks.buildTokens).toHaveBeenCalledTimes(1);
  });

  it('merges Sass additionalData using ThemeShift token helpers', async () => {
    const wrapped = withThemeShift(
      {
        sassOptions: {
          additionalData: '@use "sass:map";\n',
        },
      },
      {
        cssVarPrefix: 'themeshift',
      }
    );

    const resolved = await wrapped('phase-production-build', {
      dir: '/repo',
    });

    const additionalData = resolved.sassOptions?.additionalData;

    expect(typeof additionalData).toBe('function');

    const transformed = (additionalData as (source: string) => string)(
      '.button { color: token("text.primary"); }',
      'styles.scss'
    );

    expect(transformed).toContain('@use "sass:map";');
    expect(transformed).toContain('$theme-shift-default-css-var-prefix');
    expect(transformed).toContain(
      '@function token($path, $cssVarPrefix: null)'
    );
  });

  it('can skip Sass injection when injectSassTokenFn is false', async () => {
    const wrapped = withThemeShift(
      {
        sassOptions: {
          additionalData: 'body { color: red; }\n',
        },
      },
      {
        injectSassTokenFn: false,
      }
    );

    const resolved = await wrapped('phase-production-build', {
      dir: '/repo',
    });

    expect(resolved.sassOptions).toEqual({
      additionalData: 'body { color: red; }\n',
    });
  });

  it('defines token and sass subpath exports in package.json', async () => {
    const packagePath = path.resolve(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8')) as {
      exports?: Record<string, unknown>;
    };

    expect(packageJson.exports).toMatchObject({
      '.': expect.any(Object),
      './token': expect.any(Object),
      './_token': expect.any(Object),
      './token-defaults': expect.any(Object),
      './_token-defaults': expect.any(Object),
    });
  });
});
