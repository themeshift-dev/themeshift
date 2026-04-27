import { afterEach, describe, expect, it, vi } from 'vitest';

const watchCommandMocks = vi.hoisted(() => {
  const close = vi.fn(async () => {});

  return {
    close,
    loadThemeShiftConfig: vi.fn(async () => ({
      config: {
        cssVarPrefix: 'themeshift',
      },
    })),
    watchTokens: vi.fn(async (options: Record<string, unknown>) => {
      const onError = options.onError as ((error: unknown) => void) | undefined;
      const onSuccess = options.onSuccess as
        | ((result: { durationMs: number }) => void)
        | undefined;

      onError?.(new Error('watch build failed'));
      onSuccess?.({ durationMs: 12 });

      return { close };
    }),
  };
});

vi.mock('@themeshift/core', () => ({
  watchTokens: watchCommandMocks.watchTokens,
}));

vi.mock('../src/config/loadConfig', () => ({
  loadThemeShiftConfig: watchCommandMocks.loadThemeShiftConfig,
}));

import { runWatch } from '../src/commands/watch';

describe('runWatch', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    watchCommandMocks.close.mockClear();
    watchCommandMocks.loadThemeShiftConfig.mockClear();
    watchCommandMocks.watchTokens.mockClear();
  });

  it('wires watch mode callbacks and process signal handlers', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const onSpy = vi
      .spyOn(process, 'on')
      .mockImplementation((() => process) as typeof process.on);
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);

    void runWatch({
      configPath: 'themeshift.config.ts',
      cwd: '/tmp/theme-app',
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(watchCommandMocks.loadThemeShiftConfig).toHaveBeenCalledWith(
      '/tmp/theme-app',
      'themeshift.config.ts'
    );

    expect(watchCommandMocks.watchTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        cssVarPrefix: 'themeshift',
        root: '/tmp/theme-app',
      })
    );

    expect(onSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(logSpy).toHaveBeenCalledWith('Watching token files...');
    expect(logSpy).toHaveBeenCalledWith('Build complete in 12ms');

    const sigintHandler = onSpy.mock.calls.find(
      (call) => call[0] === 'SIGINT'
    )?.[1];
    const sigtermHandler = onSpy.mock.calls.find(
      (call) => call[0] === 'SIGTERM'
    )?.[1];

    expect(sigintHandler).toBeTypeOf('function');
    expect(sigtermHandler).toBeTypeOf('function');
    await (sigintHandler as () => Promise<void>)();
    await (sigtermHandler as () => Promise<void>)();

    expect(watchCommandMocks.close).toHaveBeenCalledTimes(2);
    expect(exitSpy).toHaveBeenCalledTimes(2);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
