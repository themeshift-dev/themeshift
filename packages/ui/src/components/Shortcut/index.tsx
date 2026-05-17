/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';

import styles from './Shortcut.module.scss';
import { formatShortcut } from './formatShortcut';
import type {
  FormattedShortcut,
  FormatShortcutOptions,
  ShortcutFormat,
  ShortcutKey,
  ShortcutPlatform,
  ShortcutProps,
  ShortcutSeparator,
  ShortcutSize,
  ShortcutTone,
  ShortcutVariant,
} from './types';

const sizeClassMap = {
  xSmall: styles.sizeXs,
  small: styles.sizeSm,
  medium: styles.sizeMd,
  large: styles.sizeLg,
} satisfies Record<ShortcutSize, string>;

const variantClassMap = {
  solid: styles.variantSolid,
  soft: styles.variantSoft,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
} satisfies Record<ShortcutVariant, string>;

const toneClassMap = {
  neutral: styles.toneNeutral,
  muted: styles.toneMuted,
  inverse: styles.toneInverse,
} satisfies Record<ShortcutTone, string>;

/**
 * Inline keyboard shortcut renderer with platform-aware key normalization.
 */
export const Shortcut = ({
  className,
  compact = false,
  disabled = false,
  format = 'symbols',
  keyClassName,
  keys,
  platform = 'auto',
  separator = 'none',
  size = 'small',
  tone = 'neutral',
  uppercase = true,
  variant = 'solid',
  wrap = false,
  role,
  ...props
}: ShortcutProps) => {
  const formatted = formatShortcut(keys, {
    format,
    platform,
    uppercase,
  });

  return (
    <span
      {...props}
      aria-disabled={disabled || undefined}
      aria-label={formatted.label}
      role={role ?? 'group'}
      className={classNames(
        styles.root,
        sizeClassMap[size],
        variantClassMap[variant],
        toneClassMap[tone],
        compact && styles.compact,
        disabled && styles.disabled,
        !uppercase && styles.uppercaseOff,
        wrap && styles.wrap,
        className
      )}
    >
      {formatted.display.map((key, index) => (
        <span className={styles.item} key={`${key}-${index}`}>
          {separator === 'plus' && index > 0 ? (
            <span aria-hidden="true" className={styles.plus}>
              +
            </span>
          ) : null}
          <kbd
            aria-hidden="true"
            className={classNames(styles.key, keyClassName)}
          >
            {key}
          </kbd>
        </span>
      ))}
    </span>
  );
};

export { formatShortcut };

export type {
  FormattedShortcut,
  FormatShortcutOptions,
  ShortcutFormat,
  ShortcutKey,
  ShortcutPlatform,
  ShortcutProps,
  ShortcutSeparator,
  ShortcutSize,
  ShortcutTone,
  ShortcutVariant,
};
