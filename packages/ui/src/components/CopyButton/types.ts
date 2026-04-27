import type { ElementType, ReactNode } from 'react';

import type { ButtonProps, ButtonVariant } from '@/components/Button/types';

type CopyButtonResolver<T> = (wasCopied: boolean) => T | void;
type CopyButtonDynamicValue<T> = T | CopyButtonResolver<T>;

type CopyButtonOverrideProps = {
  /**
   * Accessible name for icon-only copy buttons.
   *
   * You can pass a string or derive the label from the current copied state.
   */
  'aria-label'?: CopyButtonDynamicValue<string>;

  /**
   * Label content shown inside the button.
   *
   * You can pass static content or derive it from the current copied state.
   */
  children?: CopyButtonDynamicValue<ReactNode>;

  /**
   * Icon-only content for the button.
   *
   * You can pass static content or derive it from the current copied state.
   */
  icon?: CopyButtonDynamicValue<ReactNode>;

  /**
   * Icon content shown after the button label.
   *
   * You can pass static content or derive it from the current copied state.
   */
  endIcon?: CopyButtonDynamicValue<ReactNode>;

  /**
   * Icon content shown before the button label.
   *
   * You can pass static content or derive it from the current copied state.
   */
  startIcon?: CopyButtonDynamicValue<ReactNode>;

  /**
   * Visual treatment forwarded to the underlying Button.
   */
  variant?: ButtonVariant;

  /**
   * Title attribute value shown on hover in supporting browsers.
   *
   * You can pass a string or derive it from the current copied state.
   */
  title?: CopyButtonDynamicValue<string>;
};

type CopyButtonBehaviorProps = {
  /**
   * Time in milliseconds before the copied state clears.
   *
   * This maps to `useCopyToClipboard({ clearDelay })`.
   */
  clearDelay?: number;

  /**
   * Message shown after a successful copy when no custom children resolver is
   * provided.
   */
  confirmationMessage?: ReactNode;

  /**
   * Message shown after a failed copy attempt when no custom children resolver
   * is provided.
   */
  errorMessage?: ReactNode;

  /**
   * Called when a copy attempt fails.
   */
  onCopyError?: (error: unknown, value: string) => void;

  /**
   * Called when a copy attempt succeeds.
   */
  onCopySuccess?: (value: string) => void;

  /**
   * Text value written to the clipboard.
   */
  value: string;
};

type OverriddenButtonPropNames =
  | 'aria-label'
  | 'children'
  | 'endIcon'
  | 'icon'
  | 'onClick'
  | 'startIcon'
  | 'title'
  | 'variant';

/**
 * Props for the ThemeShift copy button component.
 */
export type CopyButtonProps<T extends ElementType = 'button'> = Omit<
  ButtonProps<T>,
  OverriddenButtonPropNames
> &
  CopyButtonBehaviorProps &
  CopyButtonOverrideProps;
