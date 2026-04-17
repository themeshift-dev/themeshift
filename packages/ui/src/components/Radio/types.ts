import type {
  FieldsetHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

import type { ValidationState } from '@/components/Field';

/**
 * Visual size options for radios.
 */
export type RadioGroupSize = 'small' | 'medium' | 'large';

/**
 * Visual validation state options.
 */
export type RadioValidationState = ValidationState;

/**
 * Props for the ThemeShift radio group component.
 *
 * `Radio.Group` renders a native `<fieldset>` and manages selection state for
 * its child radios.
 */
export type RadioGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'children' | 'defaultValue' | 'disabled' | 'onChange'
> & {
  /**
   * Radio options and any supporting content, such as `<Field.Label as="legend">`.
   */
  children: ReactNode;

  /**
   * Sets an initial selected value for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Disables the entire group.
   *
   * This also disables all descendant radio inputs.
   */
  disabled?: boolean;

  /**
   * Name shared by all radios in the group.
   *
   * If omitted, a stable name is generated so the group still behaves like a
   * single selection set. Provide a name to include the value in form submits.
   */
  name?: string;

  /**
   * Called with the next selected value after user interaction.
   */
  onValueChange?: (value: string) => void;

  /**
   * Marks the group as required.
   *
   * This is forwarded to each radio input so native validation works.
   */
  required?: boolean;

  /**
   * Visual size for the radio control.
   *
   * This value is inherited by all `Radio` children.
   */
  size?: RadioGroupSize;

  /**
   * Sets the group validation state used for styling and accessibility.
   */
  validationState?: RadioValidationState;

  /**
   * Controls the selected value in controlled usage.
   */
  value?: string;
};

/**
 * Props for the ThemeShift radio component.
 *
 * `Radio` wraps a native `<input type="radio">` and can be used standalone or
 * inside `Radio.Group`.
 */
export type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'disabled' | 'type' | 'value'
> & {
  /**
   * Radio label content.
   *
   * This can include multiple lines and custom layout.
   */
  children: ReactNode;

  /**
   * Disables the radio option.
   *
   * This overrides the group state when used inside `Radio.Group`.
   */
  disabled?: boolean;

  /**
   * Submitted value for the radio option.
   */
  value: string;
};

/**
 * Props for the `Radio` root implementation used by the compound export.
 *
 * This alias helps documentation tooling surface `Radio` props.
 */
export type RadioRootProps = RadioProps;
