import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const styleDictionaryMocks = vi.hoisted(() => {
  const buildPlatform = vi.fn(async () => {});
  const extend = vi.fn(() => ({ buildPlatform }));
  const registerFormat = vi.fn();
  const registerTransform = vi.fn();

  return {
    buildPlatform,
    extend,
    registerFormat,
    registerTransform,
    styleDictionary: {
      extend,
      registerFormat,
      registerTransform,
    },
  };
});

const chokidarMocks = vi.hoisted(() => {
  const handlers = new Map<string, Array<(file: string) => void>>();

  const watcher = {
    close: vi.fn(async () => {}),
    on: vi.fn((event: string, callback: (file: string) => void) => {
      const callbacks = handlers.get(event) ?? [];
      callbacks.push(callback);
      handlers.set(event, callbacks);
      return watcher;
    }),
  };

  const watch = vi.fn(() => watcher);

  const emit = (event: string, file: string) => {
    for (const callback of handlers.get(event) ?? []) {
      callback(file);
    }
  };

  const reset = () => {
    handlers.clear();
    watcher.close.mockClear();
    watcher.on.mockClear();
    watch.mockClear();
  };

  return {
    emit,
    reset,
    watch,
    watcher,
  };
});

vi.mock('style-dictionary', () => ({
  default: styleDictionaryMocks.styleDictionary,
}));

vi.mock('chokidar', () => ({
  default: {
    watch: chokidarMocks.watch,
  },
}));

import {
  buildTokens,
  resolveExtendedTokenWatchRoots,
  resolveTokenSources,
  watchTokens,
} from '../src/core';

const WORKSPACE_ROOT = process.cwd();
const tempRoots: string[] = [];

async function createTempRoot() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-core-'));
  tempRoots.push(root);

  await fs.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'tmp-theme-root', private: true }),
    'utf8'
  );

  await fs.mkdir(path.join(root, 'tokens'), { recursive: true });
  await fs.writeFile(
    path.join(root, 'tokens', 'theme.json'),
    '{"theme":{"surface":{"base":{"value":"#111111"}}}}',
    'utf8'
  );

  return root;
}

async function flushMicrotasks() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function waitForExpectation(assertion: () => void, timeoutMs = 1000) {
  const startedAt = Date.now();

  while (true) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() - startedAt >= timeoutMs) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}

describe('core resilience and watcher behavior', () => {
  beforeEach(() => {
    styleDictionaryMocks.buildPlatform.mockReset();
    styleDictionaryMocks.extend.mockReset();
    styleDictionaryMocks.registerFormat.mockReset();
    styleDictionaryMocks.registerTransform.mockReset();
    chokidarMocks.reset();

    styleDictionaryMocks.buildPlatform.mockImplementation(async () => {});
    styleDictionaryMocks.extend.mockImplementation(() => ({
      buildPlatform: styleDictionaryMocks.buildPlatform,
    }));

    delete (
      styleDictionaryMocks.styleDictionary as { __hd_registered?: boolean }
    ).__hd_registered;
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    process.chdir(WORKSPACE_ROOT);

    await Promise.all(
      tempRoots
        .splice(0)
        .map((root) => fs.rm(root, { force: true, recursive: true }))
    );
  });

  it('retries transient token parse errors and succeeds on a later attempt', async () => {
    const root = await createTempRoot();
    const onStart = vi.fn();
    const onSuccess = vi.fn();
    const onError = vi.fn();

    styleDictionaryMocks.extend
      .mockImplementationOnce(() => {
        throw new Error('Unexpected end of JSON input');
      })
      .mockImplementation(() => ({
        buildPlatform: styleDictionaryMocks.buildPlatform,
      }));

    const result = await buildTokens({
      onError,
      onStart,
      onSuccess,
      root,
    });

    expect(result.writtenFiles).toEqual(
      expect.arrayContaining([
        path.join(root, 'src/css/tokens.css'),
        path.join(root, 'src/sass/_tokens.static.scss'),
        path.join(root, 'src/design-tokens/token-values.ts'),
      ])
    );
    expect(styleDictionaryMocks.extend).toHaveBeenCalledTimes(2);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError and rethrows non-transient build failures', async () => {
    const root = await createTempRoot();
    const onError = vi.fn();

    styleDictionaryMocks.extend.mockImplementationOnce(() => {
      throw new Error('fatal build failure');
    });

    await expect(buildTokens({ onError, root })).rejects.toThrow(
      'fatal build failure'
    );

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('surfaces package extension resolution errors', async () => {
    const root = await createTempRoot();

    await expect(
      resolveTokenSources(
        {
          extends: ['@themeshift/does-not-exist'],
        },
        { root }
      )
    ).rejects.toThrow('could not resolve extended token package');
  });

  it('surfaces invalid contract file errors for extended packages', async () => {
    const root = await createTempRoot();
    const packageRoot = path.join(root, 'node_modules', '@themeshift', 'ui');

    await fs.mkdir(packageRoot, { recursive: true });
    await fs.writeFile(
      path.join(packageRoot, 'package.json'),
      JSON.stringify({ name: '@themeshift/ui', version: '1.0.0' }),
      'utf8'
    );
    await fs.writeFile(
      path.join(packageRoot, 'theme-contract.json'),
      '{"tokensGlob":',
      'utf8'
    );

    await expect(
      resolveTokenSources(
        {
          extends: ['@themeshift/ui'],
        },
        { root }
      )
    ).rejects.toThrow('failed to read theme contract');
  });

  it('throws when an extended package does not provide a token source', async () => {
    const root = await createTempRoot();
    const packageRoot = path.join(root, 'node_modules', '@themeshift', 'ui');

    await fs.mkdir(packageRoot, { recursive: true });
    await fs.writeFile(
      path.join(packageRoot, 'package.json'),
      JSON.stringify({ name: '@themeshift/ui', version: '1.0.0' }),
      'utf8'
    );

    await expect(
      resolveTokenSources(
        {
          extends: ['@themeshift/ui'],
        },
        { root }
      )
    ).rejects.toThrow('no token source was found');
  });

  it('ignores unsupported extension package watch roots', async () => {
    const root = await createTempRoot();

    const watchRoots = await resolveExtendedTokenWatchRoots(
      {
        extends: ['@themeshift/does-not-exist'],
      },
      root
    );

    expect(watchRoots).toEqual([]);
  });

  it('ignores non-token and out-of-root file changes while watching', async () => {
    const root = await createTempRoot();
    const handle = await watchTokens({ root });

    const initialBuildCount = styleDictionaryMocks.extend.mock.calls.length;

    chokidarMocks.emit('change', path.join(root, 'tokens', 'notes.md'));
    chokidarMocks.emit('change', path.join(root, '..', 'outside.json'));

    await flushMicrotasks();

    expect(styleDictionaryMocks.extend).toHaveBeenCalledTimes(
      initialBuildCount
    );

    await handle.close();
    expect(chokidarMocks.watcher.close).toHaveBeenCalledTimes(1);
  });

  it('de-duplicates overlapping watch-triggered builds', async () => {
    const root = await createTempRoot();

    let resolveSecondBuild: (() => void) | null = null;
    let callCount = 0;
    styleDictionaryMocks.buildPlatform.mockImplementation(() => {
      callCount += 1;

      // The first build runs once per platform (css/scss/meta). Delay the first
      // platform of the second build to verify overlapping change events de-dupe.
      if (callCount === 4) {
        return new Promise<void>((resolve) => {
          resolveSecondBuild = resolve;
        });
      }

      return Promise.resolve();
    });

    const handle = await watchTokens({ root });
    await flushMicrotasks();

    chokidarMocks.emit('change', path.join(root, 'tokens', 'theme.json'));
    chokidarMocks.emit('unlink', path.join(root, 'tokens', 'theme.json'));

    await waitForExpectation(() => {
      expect(styleDictionaryMocks.extend).toHaveBeenCalledTimes(2);
    });

    expect(resolveSecondBuild).not.toBeNull();
    resolveSecondBuild?.();
    await flushMicrotasks();

    await handle.close();
  });

  it('keeps watcher active when initial build fails and retries on later token changes', async () => {
    const root = await createTempRoot();
    const onError = vi.fn();
    const onSuccess = vi.fn();

    styleDictionaryMocks.extend
      .mockImplementationOnce(() => {
        throw new Error('initial build failed');
      })
      .mockImplementation(() => ({
        buildPlatform: styleDictionaryMocks.buildPlatform,
      }));

    const handle = await watchTokens({
      onError,
      onSuccess,
      root,
    });

    expect(onError).toHaveBeenCalledTimes(1);

    const failedBuildCount = styleDictionaryMocks.extend.mock.calls.length;

    await flushMicrotasks();
    chokidarMocks.emit('add', path.join(root, 'tokens', 'theme.json'));
    await waitForExpectation(() => {
      expect(styleDictionaryMocks.extend).toHaveBeenCalledTimes(
        failedBuildCount + 1
      );
      expect(onSuccess).toHaveBeenCalled();
    });

    await handle.close();
  });

  it('forwards lifecycle callbacks to successful builds', async () => {
    const root = await createTempRoot();
    const onStart = vi.fn();
    const onSuccess = vi.fn();

    await buildTokens({
      onStart,
      onSuccess,
      root,
    });

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        changedFiles: undefined,
        writtenFiles: expect.arrayContaining([
          path.join(root, 'src/css/tokens.css'),
          path.join(root, 'src/sass/_tokens.static.scss'),
          path.join(root, 'src/design-tokens/token-values.ts'),
        ]),
      })
    );
  });
});
