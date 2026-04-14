import type { ReactNode, SelectHTMLAttributes } from 'react';

/**
 * Select size options.
 */
export type SelectSize = 'small' | 'medium' | 'large';

/**
 * Visual validation state options.
 */
export type SelectValidationState = 'none' | 'invalid' | 'valid' | 'warning';

/**
 * Option shape used by the `options` prop.
 */
export type SelectOption = {
  /**
   * Visible text shown in the dropdown list.
   */
  label: string;

  /**
   * Submitted value for the option.
   */
  value: string;
};

/**
 * Props for the ThemeShift select component.
 *
 * Note: native read-only behavior is not supported on `<select>`.
 */
export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'multiple' | 'readOnly' | 'size'
> & {
  /**
   * Custom class name for the chevron icon container.
   */
  chevronClassName?: string;

  /**
   * Custom chevron icon. Defaults to `IconSelectChevron`.
   */
  chevronIcon?: ReactNode;

  /**
   * Makes the select span the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * Options to render when you do not want to pass children manually.
   *
   * When provided, `options` takes precedence over `children`.
   */
  options?: SelectOption[];

  /**
   * Placeholder label rendered as a disabled empty option.
   *
   * Use `defaultValue=""` or `value=""` to show it as the current value.
   */
  placeholder?: string;

  /**
   * Visual size for the control.
   */
  size?: SelectSize;

  /**
   * Visual validation state for border and state colors.
   */
  validationState?: SelectValidationState;
};
