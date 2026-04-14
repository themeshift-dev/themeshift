import type { TextareaHTMLAttributes } from 'react';

/**
 * Textarea size options.
 */
export type TextareaSize = 'small' | 'medium' | 'large';

/**
 * Visual validation state options.
 */
export type TextareaValidationState = 'none' | 'invalid' | 'valid' | 'warning';

/**
 * Resize behavior options.
 */
export type TextareaResize =
  | 'none'
  | 'vertical'
  | 'horizontal'
  | 'both'
  | 'auto';

/**
 * Props for the ThemeShift textarea component.
 */
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /**
   * Makes the textarea span the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * Maximum rows when `resize="auto"`.
   */
  maxRows?: number;

  /**
   * Minimum rows when `resize="auto"`.
   */
  minRows?: number;

  /**
   * Resize behavior for the control.
   */
  resize?: TextareaResize;

  /**
   * Visual size for the control.
   */
  size?: TextareaSize;

  /**
   * Visual validation state for border and state colors.
   */
  validationState?: TextareaValidationState;
};
