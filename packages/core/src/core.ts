import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { makeStyleDictionaryConfig, registerStyleDictionaryThings } from './sd';
import type {
  BuildResult,
  ThemeShiftCoreOptions,
  ThemeShiftExtendSource,
  ThemeShiftOptions,
  ThemeShiftResolvedOptions,
} from './types';

const TRANSIENT_BUILD_RETRY_DELAYS_MS = [50, 100, 200, 400, 800];

export function defineConfig(config: ThemeShiftOptions): ThemeShiftOptions {
  return config;
}

function normalizeOptions(
  options: ThemeShiftOptions = {}
): ThemeShiftResolvedOptions {
  return {
    tokensGlob: options.tokensGlob ?? 'tokens/**/*.json',
    tokensDir: options.tokensDir ?? 'tokens',
    extends: options.extends ?? [],
    cssVarPrefix: options.cssVarPrefix,
    groups: options.groups,
    defaultTheme: options.defaultTheme,
    outputPrintTheme: options.outputPrintTheme ?? false,
    outputComments: options.outputComments ?? true,
    watch: options.watch ?? true,
    injectSassTokenFn: options.injectSassTokenFn ?? true,
    platforms: options.platforms ?? ['css', 'scss', 'meta'],
    filters: options.filters,
    reloadStrategy: options.reloadStrategy ?? 'hmr',
    log: {
      warnings: 'disabled',
      verbosity: 'silent',
      ...options.log,
      errors: {
        ...options.log?.errors,
      },
    },
  };
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function withRootCwd<T>(root: string, run: () => Promise<T>) {
  const prev = process.cwd();
  process.chdir(root);

  return run().finally(() => {
    process.chdir(prev);
  });
}

export function isTransientTokenLoadError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);

  return (
    message.includes('Failed to load or parse JSON or JS Object') ||
    message.includes('JSON5: invalid end of input') ||
    message.includes('Unexpected end of JSON input')
  );
}

function isMissingFileError(error: unknown) {
  return (error as NodeJS.ErrnoException)?.code === 'ENOENT';
}

function getExtendDescriptor(extendSource: ThemeShiftExtendSource) {
  return typeof extendSource === 'string'
    ? { package: extendSource }
    : extendSource;
}

async function resolvePackageTokenSource(options: {
  extendSource: ThemeShiftExtendSource;
  root: string;
}) {
  const descriptor = getExtendDescriptor(options.extendSource);
  const packageName = descriptor.package;
  const requireFromRoot = createRequire(
    path.join(options.root, 'package.json')
  );

  let packageJsonPath: string;
  try {
    packageJsonPath = requireFromRoot.resolve(`${packageName}/package.json`);
  } catch {
    throw new Error(
      `[style-dictionary] could not resolve extended token package "${packageName}" from ${options.root}.`
    );
  }

  const packageRoot = path.dirname(packageJsonPath);
  const contractFile = descriptor.contractFile ?? 'theme-contract.json';
  let tokensGlobFromContract: string | undefined;

  if (!descriptor.tokensGlob) {
    const contractPath = path.resolve(packageRoot, contractFile);

    try {
      const contractRaw = await fs.readFile(contractPath, 'utf8');
      const contract = JSON.parse(contractRaw) as { tokensGlob?: string };
      tokensGlobFromContract = contract.tokensGlob;
    } catch (error) {
      if (!isMissingFileError(error)) {
        throw new Error(
          `[style-dictionary] failed to read theme contract "${contractFile}" from package "${packageName}".`
        );
      }
    }
  }

  const packageTokensGlob = descriptor.tokensGlob ?? tokensGlobFromContract;

  if (!packageTokensGlob) {
    throw new Error(
      `[style-dictionary] no token source was found for "${packageName}". Provide "tokensGlob" in extends or publish "${contractFile}" with a "tokensGlob" entry.`
    );
  }

  const entries = await Array.fromAsync(
    fs.glob(packageTokensGlob, { cwd: packageRoot })
  );

  const sources: string[] = [];

  for (const entry of entries) {
    const absoluteEntry = path.resolve(packageRoot, entry);
    const content = await fs.readFile(absoluteEntry, 'utf8');
    const trimmed = content.trim();

    if (!trimmed) {
      continue;
    }

    try {
      JSON.parse(trimmed);
    } catch {
      throw new Error(
        `[style-dictionary] invalid token file in package "${packageName}": ${entry}. Token files must contain valid JSON.`
      );
    }

    sources.push(absoluteEntry);
  }

  return sources.sort();
}

async function resolveExtendedTokenSources(
  options: ThemeShiftResolvedOptions,
  root: string
) {
  const sources: string[] = [];

  for (const extendSource of options.extends) {
    const resolved = await resolvePackageTokenSource({ extendSource, root });
    sources.push(...resolved);
  }

  return sources;
}

export async function resolveTokenSources(
  options: ThemeShiftOptions = {},
  context: {
    mode?: 'build' | 'serve';
    root?: string;
  } = {}
) {
  const normalized = normalizeOptions(options);
  const root = context.root ?? process.cwd();
  const mode = context.mode ?? 'build';
  const packageSources = await resolveExtendedTokenSources(normalized, root);

  const entries = await Array.fromAsync(
    fs.glob(normalized.tokensGlob, {
      cwd: root,
      exclude: ['**/node_modules/**'],
    })
  );

  const sources = [...packageSources];

  for (const entry of entries.sort()) {
    const source = entry.split(path.sep).join('/');
    const content = await fs.readFile(path.resolve(root, entry), 'utf8');
    const trimmed = content.trim();

    if (!trimmed) {
      continue;
    }

    try {
      JSON.parse(trimmed);
    } catch {
      if (mode === 'serve') {
        continue;
      }

      throw new Error(
        `[style-dictionary] invalid token file: ${source}. Token files must contain valid JSON.`
      );
    }

    sources.push(source);
  }

  return sources;
}

export async function resolveExtendedTokenWatchRoots(
  options: ThemeShiftOptions = {},
  root = process.cwd()
) {
  const normalized = normalizeOptions(options);
  const roots = new Set<string>();

  for (const extendSource of normalized.extends) {
    const descriptor = getExtendDescriptor(extendSource);
    const packageName = descriptor.package;
    const requireFromRoot = createRequire(path.join(root, 'package.json'));

    let packageJsonPath: string;
    try {
      packageJsonPath = requireFromRoot.resolve(`${packageName}/package.json`);
    } catch {
      continue;
    }

    const packageRoot = path.dirname(packageJsonPath);
    const contractFile = descriptor.contractFile ?? 'theme-contract.json';
    let tokensGlobFromContract: string | undefined;

    if (!descriptor.tokensGlob) {
      const contractPath = path.resolve(packageRoot, contractFile);

      try {
        const contractRaw = await fs.readFile(contractPath, 'utf8');
        const contract = JSON.parse(contractRaw) as { tokensGlob?: string };
        tokensGlobFromContract = contract.tokensGlob;
      } catch (error) {
        if (!isMissingFileError(error)) {
          throw new Error(
            `[style-dictionary] failed to read theme contract "${contractFile}" from package "${packageName}".`
          );
        }
      }
    }

    const packageTokensGlob = descriptor.tokensGlob ?? tokensGlobFromContract;

    if (!packageTokensGlob) {
      continue;
    }

    const globSegments = packageTokensGlob.split(/[\\/]/);
    const staticSegments: string[] = [];

    for (const segment of globSegments) {
      if (/[*?[\]{}()!+@]/.test(segment)) {
        break;
      }

      staticSegments.push(segment);
    }

    const watchRoot =
      staticSegments.length > 0
        ? path.resolve(packageRoot, staticSegments.join(path.sep))
        : packageRoot;

    roots.add(watchRoot);
  }

  return Array.from(roots);
}

function getWrittenFiles(
  root: string,
  platforms: Array<'css' | 'scss' | 'meta'>,
  config: ReturnType<typeof makeStyleDictionaryConfig>
) {
  const files: string[] = [];

  for (const platform of platforms) {
    const platformConfig = config.platforms?.[platform];
    if (!platformConfig?.buildPath) {
      continue;
    }

    for (const file of platformConfig.files ?? []) {
      if (!file.destination) {
        continue;
      }

      files.push(
        path.resolve(root, platformConfig.buildPath, file.destination)
      );
    }
  }

  return files;
}

async function buildTokensOnce(
  options: ThemeShiftResolvedOptions,
  context: {
    mode: 'build' | 'serve';
    root: string;
    changedFiles?: string[];
  }
) {
  const startedAt = Date.now();
  const imported = await import('style-dictionary');
  const StyleDictionary = (imported as any).default ?? imported;

  registerStyleDictionaryThings(StyleDictionary, {
    cssVarPrefix: options.cssVarPrefix,
    groups: options.groups,
    defaultTheme: options.defaultTheme,
    filters: options.filters,
    outputComments: options.outputComments,
    outputPrintTheme: options.outputPrintTheme,
  });

  const source = await resolveTokenSources(options, {
    mode: context.mode,
    root: context.root,
  });
  const config = makeStyleDictionaryConfig({
    log: options.log,
    source,
  });

  await withRootCwd(context.root, async () => {
    const sd = await (typeof StyleDictionary.extend === 'function'
      ? StyleDictionary.extend(config)
      : new StyleDictionary(config));

    for (const platform of options.platforms) {
      await sd.buildPlatform(platform);
    }
  });

  const endedAt = Date.now();

  return {
    startedAt,
    endedAt,
    durationMs: endedAt - startedAt,
    writtenFiles: getWrittenFiles(context.root, options.platforms, config),
    changedFiles: context.changedFiles,
  } satisfies BuildResult;
}

export async function buildTokens(options: ThemeShiftCoreOptions = {}) {
  const normalized = normalizeOptions(options);
  const root = options.root ?? process.cwd();
  const mode = options.mode ?? 'build';

  options.onStart?.();

  let attempt = 0;
  while (true) {
    try {
      const result = await buildTokensOnce(normalized, {
        mode,
        root,
        changedFiles: options.changedFiles,
      });
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const retryDelay = TRANSIENT_BUILD_RETRY_DELAYS_MS[attempt];
      if (!retryDelay || !isTransientTokenLoadError(error)) {
        options.onError?.(error);
        throw error;
      }

      attempt += 1;
      await sleep(retryDelay);
    }
  }
}

function isTokenJson(file: string) {
  return file.endsWith('.json');
}

function isInRoot(file: string, root: string) {
  const normalizedFile = path.resolve(file);
  const normalizedRoot = path.resolve(root);

  return (
    normalizedFile === normalizedRoot ||
    normalizedFile.startsWith(normalizedRoot + path.sep)
  );
}

export async function watchTokens(options: ThemeShiftCoreOptions = {}) {
  const normalized = normalizeOptions(options);
  const root = options.root ?? process.cwd();

  const localTokensRoot = path.join(root, normalized.tokensDir);
  const extendedWatchRoots = await resolveExtendedTokenWatchRoots(
    normalized,
    root
  );

  const { default: chokidar } = await import('chokidar');

  let building: Promise<BuildResult> | null = null;

  const runBuild = async (changedFile?: string) => {
    if (building) {
      return building;
    }

    building = buildTokens({
      ...normalized,
      changedFiles: changedFile ? [changedFile] : undefined,
      mode: 'serve',
      onError: options.onError,
      onStart: options.onStart,
      onSuccess: options.onSuccess,
      root,
    }).finally(() => {
      building = null;
    });

    return building;
  };

  try {
    await runBuild();
  } catch {
    // Keep watcher alive for future changes when initial build fails.
  }

  const watcher = chokidar.watch([localTokensRoot, ...extendedWatchRoots], {
    ignoreInitial: true,
  });

  const onChange = async (file: string) => {
    if (!isTokenJson(file)) {
      return;
    }

    const isLocalTokenFile = isInRoot(file, localTokensRoot);
    const isExtendedTokenFile = extendedWatchRoots.some((watchRoot) =>
      isInRoot(file, watchRoot)
    );

    if (!isLocalTokenFile && !isExtendedTokenFile) {
      return;
    }

    try {
      await runBuild(file);
    } catch {
      // Error already forwarded through onError.
    }
  };

  watcher.on('add', (file) => {
    void onChange(file);
  });
  watcher.on('change', (file) => {
    void onChange(file);
  });
  watcher.on('unlink', (file) => {
    void onChange(file);
  });

  return {
    async close() {
      await watcher.close();
    },
  };
}
