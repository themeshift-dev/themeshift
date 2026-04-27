import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * ToggleSwitch size options.
 */
export type ToggleSwitchSize = 'small' | 'medium' | 'large';

/**
 * ToggleSwitch intent options.
 */
export type ToggleSwitchIntent =
  | 'primary'
  | 'secondary'
  | 'constructive'
  | 'destructive';

/**
 * Visual validation state options.
 */
export type ToggleSwitchValidationState =
  | 'none'
  | 'invalid'
  | 'valid'
  | 'warning';

/**
 * Props for the ThemeShift toggle switch component.
 */
export type ToggleSwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'size' | 'type'
> & {
  /**
   * Additional class name for the outer wrapper.
   */
  className?: string;

  /**
   * Visual style used for the thumb color.
   */
  intent?: ToggleSwitchIntent;

  /**
   * Called with the next checked state after user interaction.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Size option for the track and thumb.
   */
  size?: ToggleSwitchSize;

  /**
   * Icon shown inside the track when the switch is off.
   */
  trackIconOff?: ReactNode;

  /**
   * Icon shown inside the track when the switch is on.
   */
  trackIconOn?: ReactNode;

  /**
   * Additional class name for the thumb element.
   */
  thumbClassName?: string;

  /**
   * Icon shown inside the thumb when the switch is off.
   */
  thumbIconOff?: ReactNode;

  /**
   * Icon shown inside the thumb when the switch is on.
   */
  thumbIconOn?: ReactNode;

  /**
   * Additional class name for the track element.
   */
  trackClassName?: string;

  /**
   * Visual validation state for border feedback.
   */
  validationState?: ToggleSwitchValidationState;
};
