import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react';

/**
 * Shared validation states used by Field and field-aware controls.
 */
export type ValidationState = 'none' | 'invalid' | 'valid' | 'warning';

/**
 * Layout options for control/label composition.
 */
export type FieldLayout = 'stacked' | 'inline-control';

/**
 * Vertical alignment options for inline-control layout.
 */
export type FieldAlign = 'start' | 'center';

/**
 * Shared semantic state for fields and field-aware controls.
 */
export type FieldBaseStateProps = {
  /**
   * Disables the control and related field content.
   */
  disabled?: boolean;

  /**
   * Makes the control read-only while keeping it focusable.
   */
  readOnly?: boolean;

  /**
   * Marks the control as required.
   */
  required?: boolean;

  /**
   * Sets the field validation state used for styling and accessibility.
   */
  validationState?: ValidationState;
};

/**
 * Optional shorthand content that can be rendered by Field.
 */
export type FieldTextContent = {
  /**
   * Helper text shown below the control.
   */
  description?: ReactNode;

  /**
   * Validation message shown when the field is invalid.
   */
  error?: ReactNode;

  /**
   * Visible label content for the control.
   */
  label?: ReactNode;
};

/**
 * Public context value exposed to field-aware controls and subcomponents.
 */
export type FieldContextValue = {
  align: FieldAlign;
  controlId: string;
  description?: ReactNode;
  descriptionId: string;
  disabled?: boolean;
  error?: ReactNode;
  errorId: string;
  fieldId: string;
  hasDescription: boolean;
  hasError: boolean;
  hideLabel?: boolean;
  label?: ReactNode;
  labelId: string;
  optional?: boolean;
  readOnly?: boolean;
  required?: boolean;
  layout: FieldLayout;
  validationState?: ValidationState;
};

/**
 * Props for the ThemeShift Field root component.
 */
export type FieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> &
  FieldBaseStateProps &
  FieldTextContent & {
    /**
     * Field contents, usually a control and optional field subcomponents.
     */
    children: ReactNode;

    /**
     * Vertical alignment used when `layout="inline-control"`.
     */
    align?: FieldAlign;

    /**
     * Whether label text should be visually hidden but still accessible.
     */
    hideLabel?: boolean;

    /**
     * Optional stable ID base. If omitted, an ID is generated.
     */
    id?: string;

    /**
     * Layout style for control and supporting content.
     */
    layout?: FieldLayout;

    /**
     * Marks the field as optional for presentation.
     */
    optional?: boolean;
  };

/**
 * Props for the field-aware label primitive.
 */
export type FieldLabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'htmlFor'
> &
  Omit<HTMLAttributes<HTMLLegendElement>, 'children'> & {
    /**
     * Element to render for the label.
     *
     * Use `as="legend"` when labeling a grouped control rendered in a
     * `<fieldset>`, such as `Radio.Group`.
     */
    as?: 'label' | 'legend';

    /**
     * Label text or custom label content.
     */
    children?: ReactNode;

    /**
     * Overrides optional indicator rendering.
     */
    showOptionalIndicator?: boolean;

    /**
     * Overrides required indicator rendering.
     */
    showRequiredIndicator?: boolean;

    /**
     * Visually hides label text while keeping it accessible.
     */
    visuallyHidden?: boolean;
  };

/**
 * Props for field-aware helper text.
 */
export type FieldDescriptionProps = Omit<
  HTMLAttributes<HTMLParagraphElement>,
  'children'
> & {
  /**
   * Helper text content associated with the control.
   */
  children?: ReactNode;
};

/**
 * Props for field-aware error text.
 */
export type FieldErrorProps = Omit<
  HTMLAttributes<HTMLParagraphElement>,
  'children'
> & {
  /**
   * Error text content associated with the control.
   */
  children?: ReactNode;

  /**
   * Keeps the error element mounted even when the field is not invalid.
   * Useful for preventing layout shift and enabling show/hide transitions.
   */
  forceMount?: boolean;
};

type FieldContextRegistration = {
  registerDescription: () => void;
  registerError: () => void;
  unregisterDescription: () => void;
  unregisterError: () => void;
};

/**
 * Internal Field context shape with registration callbacks.
 */
export type FieldContextInternalValue = FieldContextValue &
  FieldContextRegistration;
