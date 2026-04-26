import path from 'node:path';

import {
  buildTokens,
  makeSassTokenInjection,
  mergeScssAdditionalData,
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

export type {
  ThemeShiftCssGroup,
  ThemeShiftExtendSource,
  ThemeShiftOptions,
  ThemeShiftPlatform,
  ThemeShiftTokenFilter,
  ThemeShiftTokenFilterPredicate,
  ThemeShiftTokenFilterRule,
};

export type NextWebpackContext = {
  dev?: boolean;
  dir?: string;
  [key: string]: unknown;
};

export type NextWebpackFn = (
  config: Record<string, unknown>,
  context: NextWebpackContext
) => Record<string, unknown>;

export type NextConfig = {
  sassOptions?: {
    additionalData?: unknown;
    [key: string]: unknown;
  };
  webpack?: NextWebpackFn;
  [key: string]: unknown;
};

export type NextPhaseContext = {
  defaultConfig?: NextConfig;
  dir?: string;
  [key: string]: unknown;
};

export type NextConfigFactory = (
  phase: string,
  context: NextPhaseContext
) => NextConfig;

export type NextConfigInput = NextConfig | NextConfigFactory;

type BuildState = {
  buildByRoot: Map<string, Promise<void>>;
  watchByRoot: Map<string, Promise<void>>;
  watcherByRoot: Map<string, WatchHandle>;
};

const PHASE_DEVELOPMENT_SERVER = 'phase-development-server';
const PHASE_PRODUCTION_BUILD = 'phase-production-build';

const THEME_SHIFT_OPTION_KEYS = new Set<keyof ThemeShiftOptions>([
  'cssVarPrefix',
  'defaultTheme',
  'extends',
  'filters',
  'groups',
  'injectSassTokenFn',
  'log',
  'outputComments',
  'outputPrintTheme',
  'platforms',
  'reloadStrategy',
  'tokensDir',
  'tokensGlob',
  'watch',
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isThemeShiftOptions(value: unknown): value is ThemeShiftOptions {
  if (!isObject(value)) {
    return false;
  }

  const keys = Object.keys(value);
  if (keys.length === 0) {
    return false;
  }

  return keys.every((key) =>
    THEME_SHIFT_OPTION_KEYS.has(key as keyof ThemeShiftOptions)
  );
}

function isDevelopmentPhase(phase: string) {
  return phase === PHASE_DEVELOPMENT_SERVER;
}

function isBuildPhase(phase: string) {
  return phase === PHASE_PRODUCTION_BUILD;
}

function resolveRoot(context: NextPhaseContext | NextWebpackContext) {
  if (typeof context.dir === 'string' && context.dir.trim()) {
    return path.resolve(context.dir);
  }

  return process.cwd();
}

function normalizeNextConfigInput(value: unknown): NextConfigInput {
  if (typeof value === 'function') {
    return value as NextConfigFactory;
  }

  if (isObject(value)) {
    return value as NextConfig;
  }

  return {};
}

function resolveNextConfig(
  input: NextConfigInput,
  phase: string,
  context: NextPhaseContext
): NextConfig {
  if (typeof input === 'function') {
    return input(phase, context) ?? {};
  }

  return input;
}

function createBuildState(): BuildState {
  return {
    buildByRoot: new Map(),
    watchByRoot: new Map(),
    watcherByRoot: new Map(),
  };
}

function createRuntimeController(
  options: ThemeShiftOptions,
  state: BuildState
) {
  return {
    async ensureBuild(root: string) {
      const existing = state.buildByRoot.get(root);
      if (existing) {
        return existing;
      }

      const nextBuild = buildTokens({
        ...options,
        mode: 'build',
        root,
      }).then(() => undefined);

      state.buildByRoot.set(root, nextBuild);
      return nextBuild;
    },

    async ensureWatch(root: string) {
      const existing = state.watchByRoot.get(root);
      if (existing) {
        return existing;
      }

      const nextWatch = watchTokens({
        ...options,
        mode: 'serve',
        onError(error) {
          console.error(`[themeshift] token watch failed:\n${String(error)}`);
        },
        root,
      })
        .then((watchHandle) => {
          state.watcherByRoot.set(root, watchHandle);
        })
        .catch((error) => {
          state.watchByRoot.delete(root);
          throw error;
        });

      state.watchByRoot.set(root, nextWatch);
      return nextWatch;
    },
  };
}

function withWebpackWrapper(
  config: NextConfig,
  options: ThemeShiftOptions,
  runtime: ReturnType<typeof createRuntimeController>,
  defaultRoot: string
): NextConfig {
  const userWebpack = config.webpack;

  return {
    ...config,
    webpack: (webpackConfig, context) => {
      const root = resolveRoot({ dir: context.dir ?? defaultRoot });

      if (context.dev) {
        void runtime.ensureWatch(root);
      } else {
        void runtime.ensureBuild(root);
      }

      if (typeof userWebpack === 'function') {
        return userWebpack(webpackConfig, context);
      }

      return webpackConfig;
    },
    ...(options.injectSassTokenFn === false
      ? {}
      : {
          sassOptions: {
            ...(config.sassOptions ?? {}),
            additionalData: mergeScssAdditionalData(
              config.sassOptions?.additionalData,
              makeSassTokenInjection(options.cssVarPrefix)
            ),
          },
        }),
  };
}

function withThemeShiftConfig(
  nextConfigInput: NextConfigInput,
  options: ThemeShiftOptions
): NextConfigFactory {
  const state = createBuildState();
  const runtime = createRuntimeController(options, state);

  return (phase, context) => {
    const resolvedRoot = resolveRoot(context);

    if (isDevelopmentPhase(phase)) {
      void runtime.ensureWatch(resolvedRoot);
    } else if (isBuildPhase(phase)) {
      void runtime.ensureBuild(resolvedRoot);
    }

    const config = resolveNextConfig(nextConfigInput, phase, context);

    return withWebpackWrapper(config, options, runtime, resolvedRoot);
  };
}

export function withThemeShift(
  nextConfigInput: NextConfigInput,
  options?: ThemeShiftOptions
): NextConfigFactory;
export function withThemeShift(
  options?: ThemeShiftOptions
): (nextConfigInput: NextConfigInput) => NextConfigFactory;
export function withThemeShift(
  firstArg?: NextConfigInput | ThemeShiftOptions,
  secondArg?: ThemeShiftOptions
):
  | NextConfigFactory
  | ((nextConfigInput: NextConfigInput) => NextConfigFactory) {
  if (secondArg !== undefined) {
    return withThemeShiftConfig(normalizeNextConfigInput(firstArg), secondArg);
  }

  if (typeof firstArg === 'function') {
    return withThemeShiftConfig(firstArg, {});
  }

  if (isThemeShiftOptions(firstArg)) {
    return (nextConfigInput: NextConfigInput) =>
      withThemeShiftConfig(nextConfigInput, firstArg);
  }

  return withThemeShiftConfig(normalizeNextConfigInput(firstArg), {});
}
