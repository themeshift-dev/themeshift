import type { ShellAccessibilityProps } from './types';

type ResolvedShellA11yProps = {
  mainId: string;
  skipLinkHref: string;
  skipLinkLabel: string;
};

/** Resolves shared shell accessibility defaults into stable render values. */
export const resolveShellA11yProps = ({
  mainId,
  skipLinkLabel,
}: ShellAccessibilityProps): ResolvedShellA11yProps => {
  const resolvedMainId = mainId ?? 'main-content';

  return {
    mainId: resolvedMainId,
    skipLinkHref: `#${resolvedMainId}`,
    skipLinkLabel: skipLinkLabel ?? 'Skip to main content',
  };
};
