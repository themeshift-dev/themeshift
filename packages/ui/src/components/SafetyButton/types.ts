import type {
  ElementType,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
} from 'react';

import type { ButtonProps, ButtonVariant } from '@/components/Button/types';

export type SafetyButtonResolverState = {
  isPressing: boolean;
  progress: number;
  timeRemaining: number;
  wasCancelled: boolean;
  wasConfirmed: boolean;
};

type SafetyButtonResolver<T> = (state: SafetyButtonResolverState) => T | void;
type SafetyButtonDynamicValue<T> = T | SafetyButtonResolver<T>;

type SafetyButtonOverrideProps = {
  /**
   * Accessible name for icon-only safety buttons.
   */
  'aria-label'?: SafetyButtonDynamicValue<string>;

  /**
   * Toggles progress countdown announcements for assistive tech.
   */
  announceProgress?: boolean;

  /**
   * Label content shown inside the button.
   */
  children?: SafetyButtonDynamicValue<ReactNode>;

  /**
   * Icon-only content for the button.
   */
  icon?: SafetyButtonDynamicValue<ReactNode>;

  /**
   * Icon content shown after the button label.
   */
  endIcon?: SafetyButtonDynamicValue<ReactNode>;

  /**
   * Icon content shown before the button label.
   */
  startIcon?: SafetyButtonDynamicValue<ReactNode>;

  /**
   * Visual treatment forwarded to the underlying Button.
   */
  variant?: ButtonVariant;
};

type SafetyButtonBehaviorProps = {
  /**
   * Duration in milliseconds required before confirming.
   */
  confirmationDelay?: number;

  /**
   * Called when an active hold is interrupted before confirmation.
   */
  onCancel?: () => void;

  /**
   * Called when the hold duration completes.
   */
  onConfirm?: () => void;

  /**
   * Called when a hold attempt starts.
   */
  onAttemptStart?: (
    event: PointerEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
  ) => void;

  /**
   * Called with progress updates while pressing, then `undefined` when idle.
   */
  onProgress?: (progress?: number, timeRemaining?: number) => void;

  /**
   * Announcement interval for screen readers when `announceProgress` is true.
   */
  progressAnnounceIntervalMs?: number;
};

type OverriddenButtonPropNames =
  | 'aria-label'
  | 'children'
  | 'endIcon'
  | 'icon'
  | 'onClick'
  | 'startIcon'
  | 'variant';

export type SafetyButtonProps<T extends ElementType = 'button'> = Omit<
  ButtonProps<T>,
  OverriddenButtonPropNames
> &
  SafetyButtonBehaviorProps &
  SafetyButtonOverrideProps;
