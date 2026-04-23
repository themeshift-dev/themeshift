import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { themeShift } from '../src/plugin';

const coreMocks = vi.hoisted(() => {
  return {
    buildTokens: vi.fn(async () => ({
      changedFiles: undefined,
      durationMs: 10,
      endedAt: 2,
      startedAt: 1,
      writtenFiles: ['/tmp/src/css/tokens.css'],
    })),
    isTransientTokenLoadError: vi.fn(() => false),
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
    isTransientTokenLoadError: coreMocks.isTransientTokenLoadError,
    watchTokens: coreMocks.watchTokens,
  };
});

function makeServerMocks() {
  return {
    config: { logger: { error: vi.fn() } },
    moduleGraph: {
      getModuleByUrl: vi.fn(async () => ({ id: 'css-module' })),
      invalidateModule: vi.fn(),
    },
    ws: { send: vi.fn() },
  };
}

describe('themeShift', () => {
  beforeEach(() => {
    coreMocks.buildTokens.mockClear();
    coreMocks.isTransientTokenLoadError.mockClear();
    coreMocks.watchTokens.mockClear();
    coreMocks.isTransientTokenLoadError.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('injects Sass helpers into additionalData by default', () => {
    const plugin = themeShift();
    const config = plugin.config?.({});
    const additional = config?.css?.preprocessorOptions?.scss?.additionalData;

    expect(typeof additional).toBe('function');
    expect(
      additional?.(
        `@use '@/sass/tokens.runtime' as *;\n.button { color: token('background.surface'); }\n`,
        'Button.module.scss'
      )
    ).toMatch(/\$theme-shift-default-css-var-prefix: null/);
  });

  it('skips Sass injection when injectSassTokenFn is false', () => {
    const plugin = themeShift({ injectSassTokenFn: false });
    expect(plugin.config?.({})).toEqual({});
  });

  it('passes options through to core buildTokens on buildStart', async () => {
    const plugin = themeShift({ defaultTheme: 'dark' });

    plugin.config?.({}, { command: 'build', mode: 'test' } as any);
    plugin.configResolved?.({ root: '/repo' } as any);
    await plugin.buildStart?.();

    expect(coreMocks.buildTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultTheme: 'dark',
        mode: 'build',
        root: '/repo',
      })
    );
  });

  it('swallows transient errors in serve buildStart', async () => {
    coreMocks.buildTokens.mockRejectedValueOnce(new Error('transient'));
    coreMocks.isTransientTokenLoadError.mockReturnValueOnce(true);

    const plugin = themeShift();
    plugin.config?.({}, { command: 'serve', mode: 'test' } as any);

    await expect(plugin.buildStart?.()).resolves.toBeUndefined();
  });

  it('rethrows non-transient buildStart errors', async () => {
    const buildError = new Error('not-transient');
    coreMocks.buildTokens.mockRejectedValueOnce(buildError);
    coreMocks.isTransientTokenLoadError.mockReturnValueOnce(false);

    const plugin = themeShift();
    plugin.config?.({}, { command: 'serve', mode: 'test' } as any);

    await expect(plugin.buildStart?.()).rejects.toBe(buildError);
  });

  it('does not start token watcher when watch is false', async () => {
    const plugin = themeShift({ watch: false });
    const server = makeServerMocks();

    await plugin.configureServer?.(server as any);

    expect(coreMocks.watchTokens).not.toHaveBeenCalled();
  });

  it('triggers css HMR updates on watch success when changed files are reported', async () => {
    const plugin = themeShift({ watch: true });
    const server = makeServerMocks();

    await plugin.configureServer?.(server as any);

    const watchOptions = coreMocks.watchTokens.mock.calls[0]?.[0];
    await watchOptions.onSuccess({
      changedFiles: ['tokens/theme.json'],
      durationMs: 5,
      endedAt: Date.now(),
      startedAt: Date.now() - 5,
      writtenFiles: ['/repo/src/css/tokens.css'],
    });

    expect(server.ws.send).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'update' })
    );
  });

  it('falls back to full reload updates when reloadStrategy is full', async () => {
    const plugin = themeShift({ reloadStrategy: 'full', watch: true });
    const server = makeServerMocks();

    await plugin.configureServer?.(server as any);

    const watchOptions = coreMocks.watchTokens.mock.calls[0]?.[0];
    await watchOptions.onSuccess({
      changedFiles: ['tokens/theme.json'],
      durationMs: 5,
      endedAt: Date.now(),
      startedAt: Date.now() - 5,
      writtenFiles: ['/repo/src/css/tokens.css'],
    });

    expect(server.ws.send).toHaveBeenCalledWith({ type: 'full-reload' });
  });

  it('falls back to full reload when css module is not in the module graph', async () => {
    const plugin = themeShift({ watch: true });
    const server = makeServerMocks();
    server.moduleGraph.getModuleByUrl.mockResolvedValue(null);

    await plugin.configureServer?.(server as any);

    const watchOptions = coreMocks.watchTokens.mock.calls[0]?.[0];
    await watchOptions.onSuccess({
      changedFiles: ['tokens/theme.json'],
      durationMs: 5,
      endedAt: Date.now(),
      startedAt: Date.now() - 5,
      writtenFiles: ['/repo/src/css/tokens.css'],
    });

    expect(server.ws.send).toHaveBeenCalledWith({ type: 'full-reload' });
  });

  it('falls back to full reload when css platform output is disabled', async () => {
    const plugin = themeShift({ platforms: ['scss', 'meta'], watch: true });
    const server = makeServerMocks();

    await plugin.configureServer?.(server as any);

    const watchOptions = coreMocks.watchTokens.mock.calls[0]?.[0];
    await watchOptions.onSuccess({
      changedFiles: ['tokens/theme.json'],
      durationMs: 5,
      endedAt: Date.now(),
      startedAt: Date.now() - 5,
      writtenFiles: ['/repo/src/css/tokens.css'],
    });

    expect(server.ws.send).toHaveBeenCalledWith({ type: 'full-reload' });
  });

  it('does not notify Vite when onSuccess has no changed files', async () => {
    const plugin = themeShift({ watch: true });
    const server = makeServerMocks();

    await plugin.configureServer?.(server as any);

    const watchOptions = coreMocks.watchTokens.mock.calls[0]?.[0];
    await watchOptions.onSuccess({
      changedFiles: undefined,
      durationMs: 5,
      endedAt: Date.now(),
      startedAt: Date.now() - 5,
      writtenFiles: ['/repo/src/css/tokens.css'],
    });

    expect(server.ws.send).not.toHaveBeenCalled();
  });

  it('forwards watch errors to the Vite logger', async () => {
    const plugin = themeShift({ watch: true });
    const server = makeServerMocks();

    await plugin.configureServer?.(server as any);

    const watchOptions = coreMocks.watchTokens.mock.calls[0]?.[0];
    watchOptions.onError(new Error('watch failed'));

    expect(server.config.logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[style-dictionary] build failed')
    );
  });

  it('closes the watcher on closeBundle', async () => {
    const close = vi.fn(async () => {});
    coreMocks.watchTokens.mockResolvedValueOnce({ close });

    const plugin = themeShift({ watch: true });
    const server = makeServerMocks();

    await plugin.configureServer?.(server as any);
    await plugin.closeBundle?.();

    expect(close).toHaveBeenCalledTimes(1);
  });
});
