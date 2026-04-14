import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Input size options.
 */
export type InputSize = 'small' | 'medium' | 'large';

/**
 * Visual validation state options.
 */
export type InputValidationState = 'none' | 'invalid' | 'valid' | 'warning';

/**
 * Props for the ThemeShift input component.
 */
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /**
   * Additional class name for the input element.
   */
  inputClassName?: string;

  /**
   * Visual size for the control.
   */
  size?: InputSize;

  /**
   * Decorative or functional content before the input.
   */
  startAdornment?: ReactNode;

  /**
   * Decorative or functional content after the input.
   */
  endAdornment?: ReactNode;

  /**
   * Visual validation state for border and state colors.
   */
  validationState?: InputValidationState;

  /**
   * Makes the input span the full width of its container.
   */
  fullWidth?: boolean;
};
