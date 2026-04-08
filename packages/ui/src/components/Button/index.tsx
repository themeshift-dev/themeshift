import classNames from 'classnames';

import styles from './Button.module.scss';

/** Available button size variants. */
export type ButtonSize = 'small' | 'medium' | 'large';

/** Available button intent variants. */
export type ButtonIntent =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'constructive'
  | 'destructive';

/** Props for the ThemeShift button component. */
export type ButtonProps = {
  /** Button label or content. */
  children: React.ReactNode;

  /** Additional class names to append to the button element. */
  className?: string;

  /** Visual treatment used to communicate the action's priority or outcome. */
  intent?: ButtonIntent;

  /** Predefined size variant for spacing and typography. */
  size?: ButtonSize;

  /**
   * Applies disabled styling without disabling interaction.
   *
   * Example: `<Button visuallyDisabled onClick={showReason}>Upgrade required</Button>`
   */
  visuallyDisabled?: boolean;
} & React.ComponentPropsWithoutRef<'button'>;

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
} satisfies Record<ButtonSize, string>;

const intentClassMap = {
  primary: styles.primary,
  secondary: styles.secondary,
  tertiary: styles.tertiary,
  constructive: styles.constructive,
  destructive: styles.destructive,
} satisfies Record<ButtonIntent, string>;

/** A theme-aware button with intent and size variants. */
export const Button = ({
  children,
  className,
  intent = 'primary',
  size = 'medium',
  visuallyDisabled = false,
  ...buttonProps
}: ButtonProps) => (
  <button
    {...buttonProps}
    className={classNames(
      styles.container,
      sizeClassMap[size],
      intentClassMap[intent],
      visuallyDisabled && styles.visuallyDisabled,
      className
    )}
  >
    {children}
  </button>
);
