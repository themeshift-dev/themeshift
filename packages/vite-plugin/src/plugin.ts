import path from 'node:path';

import {
  buildTokens,
  isTransientTokenLoadError,
  watchTokens,
} from '@themeshift/core';
import type {
  ThemeShiftCssGroup,
  ThemeShiftExtendSource,
  ThemeShiftOptions,
  ThemeShiftPlatform,
  ThemeShiftTokenFilter,
  ThemeShiftTokenFilterPredicate,
  ThemeShiftTokenFilterRule,
  WatchHandle,
} from '@themeshift/core';
import type { Plugin, UserConfig, ViteDevServer } from 'vite';

import {
  makeSassTokenInjection,
  mergeScssAdditionalData,
} from './sassTokenInjection';

export type {
  ThemeShiftCssGroup,
  ThemeShiftExtendSource,
  ThemeShiftOptions,
  ThemeShiftPlatform,
  ThemeShiftTokenFilter,
  ThemeShiftTokenFilterPredicate,
  ThemeShiftTokenFilterRule,
};

export function themeShift(options: ThemeShiftOptions = {}): Plugin {
  const watch = options.watch ?? true;
  const injectSassTokenFn = options.injectSassTokenFn ?? true;
  const reloadStrategy = options.reloadStrategy ?? 'hmr';
  const platforms = options.platforms ?? ['css', 'scss', 'meta'];

  let root = process.cwd();
  let command: 'build' | 'serve' = 'build';
  let server: ViteDevServer | null = null;
  let watcherHandle: WatchHandle | null = null;

  function getCssOutputFile() {
    if (!platforms.includes('css')) {
      return null;
    }

    return path.resolve(root, 'src/css/tokens.css');
  }

  function fullReload() {
    server?.ws.send({ type: 'full-reload' });
  }

  async function tryCssHmrUpdate(): Promise<boolean> {
    if (!server) {
      return false;
    }

    const cssOutputFile = getCssOutputFile();
    if (!cssOutputFile) {
      return false;
    }

    const rel = path.relative(root, cssOutputFile);
    if (rel.startsWith('..')) {
      return false;
    }

    const url = '/' + rel.split(path.sep).join('/');
    const mod = await server.moduleGraph.getModuleByUrl(url);
    if (!mod) {
      return false;
    }

    server.moduleGraph.invalidateModule(mod);
    server.ws.send({
      type: 'update',
      updates: [
        {
          acceptedPath: url,
          path: url,
          timestamp: Date.now(),
          type: 'css-update',
        },
      ],
    });

    return true;
  }

  async function notifyTokenOutputsUpdated() {
    if (reloadStrategy === 'full') {
      fullReload();
      return;
    }

    if (!(await tryCssHmrUpdate())) {
      fullReload();
    }
  }

  return {
    name: 'vite-plugin-style-dictionary-native',
    enforce: 'pre',

    config(userConfig, env): UserConfig {
      command = env?.command ?? command;

      if (!injectSassTokenFn) {
        return {};
      }

      const injection = makeSassTokenInjection(options.cssVarPrefix);
      const existing =
        userConfig.css?.preprocessorOptions?.scss?.additionalData;
      const merged = mergeScssAdditionalData(existing, injection);

      return {
        css: {
          preprocessorOptions: {
            scss: {
              additionalData: merged,
            },
          },
        },
      };
    },

    configResolved(resolved) {
      root = resolved.root;
    },

    async buildStart() {
      try {
        await buildTokens({
          ...options,
          mode: command,
          root,
        });
      } catch (error) {
        if (command === 'serve' && isTransientTokenLoadError(error)) {
          return;
        }

        throw error;
      }
    },

    async closeBundle() {
      await watcherHandle?.close();
      watcherHandle = null;
    },

    async configureServer(_server) {
      server = _server;

      if (!watch) {
        return;
      }

      watcherHandle = await watchTokens({
        ...options,
        mode: 'serve',
        onError(error) {
          server?.config.logger.error(
            `[style-dictionary] build failed:\n${String(error)}`
          );
        },
        async onSuccess(result) {
          if (result.changedFiles?.length) {
            await notifyTokenOutputsUpdated();
          }
        },
        root,
      });
    },
  };
}
