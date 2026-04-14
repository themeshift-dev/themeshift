import type { InputHTMLAttributes } from 'react';

/**
 * Checkbox size options.
 */
export type CheckboxSize = 'small' | 'medium' | 'large';

/**
 * Visual validation state options.
 */
export type CheckboxValidationState = 'none' | 'invalid' | 'valid' | 'warning';

/**
 * Props for the ThemeShift checkbox component.
 */
export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> & {
  /**
   * Makes the checkbox wrapper span the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * Sets the checkbox to the mixed state.
   *
   * This updates the DOM `indeterminate` property through JavaScript.
   */
  indeterminate?: boolean;

  /**
   * Visual size for the control.
   */
  size?: CheckboxSize;

  /**
   * Visual validation state for border and state colors.
   */
  validationState?: CheckboxValidationState;
};
