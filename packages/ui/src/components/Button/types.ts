import type { ReactElement, ReactNode } from 'react';

/**
 * Button size options.
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button style variants for different action types.
 */
export type ButtonIntent =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'constructive'
  | 'destructive';

type ButtonBaseProps = {
  /**
   * Applies Button styles to a single child element instead of rendering a
   * native button.
   *
   * Use this when pairing Button with routing links or other custom elements.
   */
  asChild?: boolean;

  /**
   * Additional class names for custom styling.
   */
  className?: string;

  /**
   * Visual style that communicates the action's priority or outcome.
   */
  intent?: ButtonIntent;

  /**
   * Shows a spinner while an action is in progress.
   *
   * Also adds `aria-busy` for assistive technology.
   */
  isBusy?: boolean;

  /**
   * Size option for button spacing and text.
   */
  size?: ButtonSize;

  /**
   * Shows disabled styling without blocking interaction.
   *
   * Use this when the button should explain why an action is unavailable.
   */
  visuallyDisabled?: boolean;
};

type NativeButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  keyof ButtonBaseProps | 'children'
>;

type ButtonOnlyPropNames =
  | 'disabled'
  | 'form'
  | 'formAction'
  | 'formEncType'
  | 'formMethod'
  | 'formNoValidate'
  | 'formTarget'
  | 'name'
  | 'type'
  | 'value';

type AsChildButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  keyof ButtonBaseProps | 'children' | ButtonOnlyPropNames
>;

type ButtonSharedContentProps = {
  /**
   * Icon shown before the button label.
   */
  startIcon?: ReactNode;

  /**
   * Icon shown after the button label.
   */
  endIcon?: ReactNode;
};

export type SlottableChild = ReactElement<{ children?: ReactNode }>;

type IconButtonAccessibleName =
  | {
      /**
       * Accessible label for an icon-only button.
       *
       * Required when using `icon` without visible text.
       */
      'aria-label': string;
      'aria-labelledby'?: string;
    }
  | {
      /**
       * ID of the element that labels an icon-only button.
       *
       * Required when using `icon` without visible text.
       */
      'aria-labelledby': string;
      'aria-label'?: string;
    };

type ButtonWithLabelProps = ButtonSharedContentProps & {
  /**
   * Visible button label or content.
   */
  children?: ReactNode;

  /**
   * Icon-only button content.
   *
   * For buttons with text and an icon, use `startIcon` or `endIcon` instead.
   */
  icon?: never;
};

type ButtonWithIconProps = IconButtonAccessibleName & {
  // Kept for type compatibility. The rendered content comes from `icon`.
  children?: ReactNode;

  icon: ReactNode;

  // Use `icon` for icon-only buttons.
  startIcon?: ReactNode;

  // Use `icon` for icon-only buttons.
  endIcon?: ReactNode;
};

type ButtonAsButtonProps = {
  asChild?: false;
  children?: ReactNode;
};

type ButtonAsChildProps = {
  asChild: true;
  children: ReactElement;
};

/**
 * Props for the ThemeShift button component.
 */
export type ButtonProps =
  | (ButtonBaseProps &
      NativeButtonProps &
      (ButtonWithLabelProps | ButtonWithIconProps) &
      ButtonAsButtonProps)
  | (ButtonBaseProps &
      AsChildButtonProps &
      (ButtonWithLabelProps | ButtonWithIconProps) &
      ButtonAsChildProps);
