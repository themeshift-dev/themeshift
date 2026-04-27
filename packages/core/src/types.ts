export type ThemeShiftExtendSource =
  | string
  | {
      package: string;
      tokensGlob?: string;
      contractFile?: string;
    };

export type ThemeShiftPlatform = 'css' | 'scss' | 'meta';

export type ThemeShiftTokenFilterRule = {
  includePrefixes?: string[];
  excludePrefixes?: string[];
};

export type ThemeShiftTokenFilterPredicate = (token: any) => boolean;

export type ThemeShiftTokenFilter =
  | ThemeShiftTokenFilterRule
  | ThemeShiftTokenFilterPredicate;

export type ThemeShiftCssGroup = {
  label: string;
  match: (name: string) => boolean;
};

export type ThemeShiftOptions = {
  tokensGlob?: string;
  tokensDir?: string;
  extends?: ThemeShiftExtendSource[];
  cssVarPrefix?: string;
  groups?: ThemeShiftCssGroup[];
  defaultTheme?: 'light' | 'dark';
  outputPrintTheme?: boolean;
  outputComments?: boolean;
  watch?: boolean;
  injectSassTokenFn?: boolean;
  platforms?: Array<'css' | 'scss' | 'meta'>;
  filters?: Partial<Record<ThemeShiftPlatform, ThemeShiftTokenFilter>>;
  reloadStrategy?: 'hmr' | 'full';
  log?: {
    warnings?: 'warn' | 'error' | 'disabled';
    verbosity?: 'default' | 'silent' | 'verbose';
    errors?: { brokenReferences?: 'throw' | 'console' };
  };
};

export type ThemeShiftResolvedOptions = Required<
  Omit<
    ThemeShiftOptions,
    'cssVarPrefix' | 'groups' | 'defaultTheme' | 'filters' | 'extends' | 'log'
  >
> & {
  cssVarPrefix?: string;
  defaultTheme?: 'light' | 'dark';
  extends: ThemeShiftExtendSource[];
  filters?: Partial<Record<ThemeShiftPlatform, ThemeShiftTokenFilter>>;
  groups?: ThemeShiftCssGroup[];
  log: {
    warnings?: 'warn' | 'error' | 'disabled';
    verbosity?: 'default' | 'silent' | 'verbose';
    errors?: { brokenReferences?: 'throw' | 'console' };
  };
};

export type BuildResult = {
  startedAt: number;
  endedAt: number;
  durationMs: number;
  writtenFiles: string[];
  changedFiles?: string[];
};

export type ThemeShiftCoreOptions = ThemeShiftOptions & {
  mode?: 'build' | 'serve';
  root?: string;
  changedFiles?: string[];
  onStart?: () => void;
  onSuccess?: (result: BuildResult) => void;
  onError?: (error: unknown) => void;
};

export type WatchHandle = {
  close(): Promise<void>;
};

export type TokenAuditTarget = string | 'all';

export type AuditTokensOptions = {
  cssVarPrefix?: string;
  outputFile?: string;
  root?: string;
  scanRoots?: string[];
  target?: TokenAuditTarget;
  tokenPathsFile?: string;
  tokenValuesFile?: string;
};

export type AuditTokensResult = {
  outputFile: string;
  scannedTargets: string[];
  tokenCount: number;
};
