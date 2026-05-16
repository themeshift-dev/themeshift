import type { ComponentPropsWithoutRef } from 'react';

/**
 * A normalized shortcut key token recognized by ThemeShift `Shortcut`.
 */
export type ShortcutKey =
  | string
  | 'mod'
  | 'cmd'
  | 'ctrl'
  | 'alt'
  | 'option'
  | 'shift'
  | 'enter'
  | 'escape'
  | 'backspace'
  | 'delete'
  | 'space'
  | 'tab'
  | 'arrowup'
  | 'arrowdown'
  | 'arrowleft'
  | 'arrowright';

/**
 * Platform targets used to resolve `mod` and platform-specific key labels.
 */
export type ShortcutPlatform = 'auto' | 'mac' | 'windows' | 'linux';

/**
 * Visual separator style rendered between keycaps.
 */
export type ShortcutSeparator = 'none' | 'plus' | 'space';

/**
 * Output style for rendered keys.
 */
export type ShortcutFormat = 'symbols' | 'text';

/**
 * Visual size scale for keycaps.
 */
export type ShortcutSize = 'xSmall' | 'small' | 'medium' | 'large';

/**
 * Surface style for keycaps.
 */
export type ShortcutVariant = 'solid' | 'soft' | 'outline' | 'ghost';

/**
 * Tone for keycap color treatment.
 */
export type ShortcutTone = 'neutral' | 'muted' | 'inverse';

/**
 * Formatting options for `formatShortcut`.
 */
export type FormatShortcutOptions = {
  /**
   * Platform used for `mod` normalization and platform-specific labels.
   */
  platform?: ShortcutPlatform;

  /**
   * Output style used for display values.
   */
  format?: ShortcutFormat;

  /**
   * Uppercases alphanumeric key output when enabled.
   */
  uppercase?: boolean;
};

/**
 * Normalized shortcut output consumed by components and docs.
 */
export type FormattedShortcut = {
  /**
   * Display values for each rendered keycap.
   */
  display: string[];

  /**
   * Screen-reader friendly readable label.
   */
  label: string;
};

/**
 * Props for the ThemeShift `Shortcut` component.
 */
export type ShortcutProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children' | 'className'
> & {
  /**
   * Shortcut input as a `+`-delimited string or explicit key token list.
   */
  keys: string | ShortcutKey[];

  /**
   * Platform used for `mod` normalization and key formatting behavior.
   */
  platform?: ShortcutPlatform;

  /**
   * Separator style rendered between keys.
   */
  separator?: ShortcutSeparator;

  /**
   * Visual formatting style for key output.
   */
  format?: ShortcutFormat;

  /**
   * Size scale for keycaps.
   */
  size?: ShortcutSize;

  /**
   * Keycap surface variant.
   */
  variant?: ShortcutVariant;

  /**
   * Keycap color tone.
   */
  tone?: ShortcutTone;

  /**
   * Disables emphasis and interaction affordance styles.
   */
  disabled?: boolean;

  /**
   * Class name applied to the outer shortcut wrapper.
   */
  className?: string;

  /**
   * Class name applied to each `kbd` keycap.
   */
  keyClassName?: string;

  /**
   * Compacts keycap padding and inter-key spacing.
   */
  compact?: boolean;

  /**
   * Controls alphanumeric output casing.
   */
  uppercase?: boolean;

  /**
   * Allows the shortcut row to wrap across lines.
   */
  wrap?: boolean;
};
