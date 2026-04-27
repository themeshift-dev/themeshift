import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
  ReactNode,
} from 'react';

/**
 * Button size options.
 */
export type ButtonSize = 'small' | 'medium' | 'large' | 'hero';

/**
 * Button intent options for communicating the action's purpose or outcome.
 */
export type ButtonIntent =
  | 'primary'
  | 'secondary'
  | 'constructive'
  | 'destructive';

/**
 * Button variant options for controlling visual treatment.
 */
export type ButtonVariant = 'solid' | 'outline' | 'link';

/** Shared polymorphic prop helper used by Button. */
type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  /** HTML element or component to render instead of the default element. */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as' | 'children'>;

type ButtonBaseProps = {
  /**
   * Applies Button styles to a single child element instead of rendering a
   * native element.
   *
   * Use this when pairing Button with routing links or other custom elements
   * where you want to preserve the child element identity.
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
   * Visual treatment for the selected intent.
   */
  variant?: ButtonVariant;

  /**
   * Shows disabled styling without blocking interaction.
   *
   * Use this when the button should explain why an action is unavailable.
   */
  visuallyDisabled?: boolean;
};

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
  ComponentPropsWithoutRef<'button'>,
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

type ButtonAsElementProps<T extends ElementType> = PolymorphicProps<
  T,
  ButtonBaseProps & {
    asChild?: false;
  }
>;

type ButtonAsChildProps = ButtonBaseProps &
  AsChildButtonProps & {
    as?: never;
    asChild: true;
    children: ReactElement;
  };

/**
 * Props for the ThemeShift button component.
 */
export type ButtonProps<T extends ElementType = 'button'> =
  | (ButtonAsElementProps<T> & (ButtonWithLabelProps | ButtonWithIconProps))
  | (ButtonAsChildProps & (ButtonWithLabelProps | ButtonWithIconProps));
