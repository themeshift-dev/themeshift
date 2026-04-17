import classNames from 'classnames';
import { forwardRef, type ForwardedRef } from 'react';

import { mergeIds, useFieldContextOptional } from '@/components/Field/context';
import { IconSelectChevron } from '@/icons';

import styles from './Select.module.scss';
import type {
  SelectOption,
  SelectProps,
  SelectSize,
  SelectValidationState,
} from './types';

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
} satisfies Record<SelectSize, string>;

const validationStateClassMap = {
  none: styles.none,
  invalid: styles.invalid,
  valid: styles.valid,
  warning: styles.warning,
} satisfies Record<SelectValidationState, string>;

function setRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

const renderOptions = (options: SelectOption[]) =>
  options.map(({ label, value }) => (
    <option key={`${value}-${label}`} value={value}>
      {label}
    </option>
  ));

/**
 * A theme-aware select control with native behavior and Field integration.
 *
 * Note: native read-only behavior is not supported for `<select>`.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      children,
      chevronClassName,
      chevronIcon = <IconSelectChevron aria-hidden />,
      className,
      fullWidth = true,
      options,
      placeholder,
      size = 'medium',
      validationState,
      ...selectProps
    },
    ref
  ) => {
    const fieldContext = useFieldContextOptional();
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      defaultValue: defaultValueProp,
      disabled: disabledProp,
      id: idProp,
      name: nameProp,
      onBlur: onBlurProp,
      onChange: onChangeProp,
      required: requiredProp,
      ...nativeSelectProps
    } = selectProps;
    const shouldAutoRegister =
      nameProp === undefined && !!fieldContext?.form && !!fieldContext?.name;
    const registration = shouldAutoRegister
      ? fieldContext.form?.register(fieldContext.name as never)
      : undefined;
    const resolvedName = nameProp ?? registration?.name;
    const hasCallerAriaInvalid = ariaInvalid !== undefined;
    const resolvedDisabled = disabledProp ?? fieldContext?.disabled;
    const resolvedId = idProp ?? fieldContext?.controlId;
    const resolvedRequired = requiredProp ?? fieldContext?.required;
    const resolvedValidationState =
      validationState === undefined
        ? (fieldContext?.validationState ?? 'none')
        : validationState;
    const describedBy = mergeIds(
      ariaDescribedBy,
      fieldContext?.hasDescription ? fieldContext.descriptionId : undefined,
      fieldContext?.hasError ? fieldContext.errorId : undefined
    );
    const derivedAriaInvalid = hasCallerAriaInvalid
      ? ariaInvalid
      : resolvedValidationState === 'invalid'
        ? true
        : resolvedValidationState === 'valid'
          ? false
          : undefined;

    const resolvedDefaultValue =
      defaultValueProp ??
      (nativeSelectProps.value === undefined
        ? registration?.defaultValue
        : undefined);

    const content = options === undefined ? children : renderOptions(options);

    return (
      <div
        className={classNames(
          styles.container,
          sizeClassMap[size],
          validationStateClassMap[resolvedValidationState],
          fullWidth && styles.fullWidth,
          resolvedDisabled && styles.disabled,
          className
        )}
      >
        <select
          {...nativeSelectProps}
          aria-describedby={describedBy}
          aria-invalid={derivedAriaInvalid}
          className={styles.select}
          defaultValue={resolvedDefaultValue as never}
          disabled={resolvedDisabled}
          id={resolvedId}
          name={resolvedName}
          onBlur={
            registration
              ? (event) => {
                  registration.onBlur(event);
                  onBlurProp?.(event);
                }
              : onBlurProp
          }
          onChange={
            registration
              ? (event) => {
                  registration.onChange(event);
                  onChangeProp?.(event);
                }
              : onChangeProp
          }
          ref={(node) => {
            setRef(ref, node);
            registration?.ref(node);
          }}
          required={resolvedRequired}
        >
          {placeholder ? (
            <option disabled value="">
              {placeholder}
            </option>
          ) : null}
          {content}
        </select>
        {chevronIcon !== null && chevronIcon !== undefined ? (
          <span
            aria-hidden="true"
            className={classNames(styles.chevron, chevronClassName)}
          >
            {chevronIcon}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export type { SelectOption, SelectProps, SelectSize, SelectValidationState };
