import type { CSSProperties } from 'react';

import type {
  AlignItemsValue,
  AlignSelfValue,
  Breakpoint,
  JustifyContentValue,
  JustifySelfValue,
  ResponsiveValue,
  SpacingValue,
} from './Box.types';

const SPACE_TOKENS = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '20',
  '24',
]);

const ALIGN_ALIAS_MAP = {
  end: 'flex-end',
  start: 'flex-start',
} as const;

const JUSTIFY_ALIAS_MAP = {
  around: 'space-around',
  between: 'space-between',
  end: 'flex-end',
  evenly: 'space-evenly',
  start: 'flex-start',
} as const;

type ResponsiveRecord<T> = Partial<Record<Breakpoint, T>>;

type StyleVarValue = number | string;

type StyleVars = CSSProperties & Record<string, StyleVarValue>;

const BREAKPOINTS: Breakpoint[] = ['base', 'tablet', 'desktop'];

/**
 * Returns true when a responsive prop is provided as a breakpoint-keyed object.
 */
function isResponsiveObject<T>(
  value: ResponsiveValue<T>
): value is ResponsiveRecord<T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Normalizes a responsive value into a breakpoint record for consistent reads.
 * Scalar values are assigned to `base`.
 */
export function normalizeResponsiveValue<T>(
  value: ResponsiveValue<T> | undefined
): ResponsiveRecord<T> {
  if (value === undefined) {
    return {};
  }

  if (isResponsiveObject(value)) {
    return value;
  }

  return { base: value };
}

/**
 * Writes a CSS custom property onto the style var bag.
 */
function setVar(styleVars: StyleVars, name: string, value: StyleVarValue) {
  styleVars[name] = value;
}

/**
 * Resolves spacing token keys to ThemeShift CSS vars and passes through raw values.
 */
export function withSpacingTokens(value: SpacingValue): number | string {
  if (typeof value === 'string' && SPACE_TOKENS.has(value)) {
    return `var(--themeshift-space-${value})`;
  }

  return value;
}

/**
 * Maps shorthand align aliases (e.g. `start`, `end`) to CSS flex values.
 */
export function mapAlignAlias(value: AlignItemsValue | AlignSelfValue): string {
  return ALIGN_ALIAS_MAP[value as keyof typeof ALIGN_ALIAS_MAP] ?? value;
}

/**
 * Maps shorthand justify aliases to their corresponding CSS values.
 */
export function mapJustifyAlias(
  value: JustifyContentValue | JustifySelfValue
): string {
  return JUSTIFY_ALIAS_MAP[value as keyof typeof JUSTIFY_ALIAS_MAP] ?? value;
}

/**
 * Applies responsive values to CSS custom properties for each known breakpoint.
 */
export function applyResponsiveStyleVar<T>({
  cssProp,
  styleVars,
  transform,
  value,
}: {
  cssProp: string;
  styleVars: StyleVars;
  transform?: (nextValue: T) => number | string | null;
  value: ResponsiveValue<T> | undefined;
}) {
  const normalizedValue = normalizeResponsiveValue(value);

  for (const breakpoint of BREAKPOINTS) {
    const nextValue = normalizedValue[breakpoint];

    if (nextValue === undefined) {
      continue;
    }

    const transformed = transform
      ? transform(nextValue)
      : (nextValue as unknown as StyleVarValue);

    if (transformed === null) {
      continue;
    }

    setVar(styleVars, `--ts-${cssProp}-${breakpoint}`, transformed);
  }
}

/**
 * Maps a responsive value (scalar or breakpoint object) with a provided mapper.
 */
export function mapResponsiveValue<T, R>(
  value: ResponsiveValue<T> | undefined,
  mapper: (next: T) => R
): ResponsiveValue<R> | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (isResponsiveObject(value)) {
    const mapped: Partial<Record<Breakpoint, R>> = {};

    if (value.base !== undefined) {
      mapped.base = mapper(value.base);
    }

    if (value.tablet !== undefined) {
      mapped.tablet = mapper(value.tablet);
    }

    if (value.desktop !== undefined) {
      mapped.desktop = mapper(value.desktop);
    }

    return mapped;
  }

  return mapper(value);
}

export type { StyleVars };
