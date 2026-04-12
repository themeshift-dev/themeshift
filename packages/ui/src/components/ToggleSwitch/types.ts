import type { FocusEventHandler, ReactNode } from 'react';

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
  | 'tertiary'
  | 'constructive'
  | 'destructive';

/**
 * ToggleSwitch label placement options.
 */
export type ToggleSwitchLabelPosition = 'start' | 'end';

/**
 * Props for the ThemeShift toggle switch component.
 */
export type ToggleSwitchProps = {
  /**
   * Accessible description IDs to append to the generated switch description.
   */
  ariaDescribedBy?: string;

  /**
   * Accessible name for cases where no visible label is rendered.
   */
  ariaLabel?: string;

  /**
   * ID of an external element that labels the switch.
   */
  ariaLabelledBy?: string;

  /**
   * Focuses the switch on mount.
   */
  autoFocus?: boolean;

  /**
   * Controlled checked state.
   */
  checked?: boolean;

  /**
   * Additional class name for the outer wrapper.
   */
  className?: string;

  /**
   * Initial checked state for uncontrolled usage.
   */
  defaultChecked?: boolean;

  /**
   * Helper text shown below the label.
   */
  description?: ReactNode;

  /**
   * Disables interaction and applies disabled styling.
   */
  disabled?: boolean;

  /**
   * Error text shown below the description.
   */
  errorMessage?: ReactNode;

  /**
   * Unique DOM ID for the underlying checkbox.
   */
  id?: string;

  /**
   * Icon shown when the switch is off.
   */
  iconOff?: ReactNode;

  /**
   * Icon shown when the switch is on.
   */
  iconOn?: ReactNode;

  /**
   * Applies invalid semantics and styling.
   */
  invalid?: boolean;

  /**
   * Visible label content for the switch.
   */
  label?: ReactNode;

  /**
   * Additional class name for the visible label element.
   */
  labelClassName?: string;

  /**
   * Controls whether the label content appears before or after the switch.
   */
  labelPosition?: ToggleSwitchLabelPosition;

  /**
   * Form field name for native form submission.
   */
  name?: string;

  /**
   * Called when the switch loses focus.
   */
  onBlur?: FocusEventHandler<HTMLInputElement>;

  /**
   * Called with the next checked state after user interaction.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Called when the switch receives focus.
   */
  onFocus?: FocusEventHandler<HTMLInputElement>;

  /**
   * Prevents state changes while keeping the control focusable.
   */
  readOnly?: boolean;

  /**
   * Marks the field as required for native form validation.
   */
  required?: boolean;

  /**
   * Visual style used for the thumb color.
   */
  intent?: ToggleSwitchIntent;

  /**
   * Size option for the track, thumb, and label spacing.
   */
  size?: ToggleSwitchSize;

  /**
   * Additional class name for the thumb element.
   */
  thumbClassName?: string;

  /**
   * Additional class name for the track element.
   */
  trackClassName?: string;

  /**
   * Native form value for checked submissions.
   */
  value?: string;
};
