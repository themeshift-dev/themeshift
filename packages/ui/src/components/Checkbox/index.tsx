import classNames from 'classnames';
import { forwardRef, useEffect, useRef, type ForwardedRef } from 'react';

import { mergeIds, useFieldContextOptional } from '@/components/Field/context';
import { IconCheck, IconMinus } from '@/icons';

import styles from './Checkbox.module.scss';
import type {
  CheckboxProps,
  CheckboxSize,
  CheckboxValidationState,
} from './types';

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
} satisfies Record<CheckboxSize, string>;

const validationStateClassMap = {
  none: styles.none,
  invalid: styles.invalid,
  valid: styles.valid,
  warning: styles.warning,
} satisfies Record<CheckboxValidationState, string>;

function setRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

/**
 * A theme-aware native checkbox with optional indeterminate and Field wiring.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      fullWidth = false,
      indeterminate = false,
      size = 'medium',
      validationState,
      ...checkboxProps
    },
    ref
  ) => {
    const fieldContext = useFieldContextOptional();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {
      'aria-checked': ariaChecked,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      disabled: disabledProp,
      id: idProp,
      readOnly: readOnlyProp,
      required: requiredProp,
      ...nativeCheckboxProps
    } = checkboxProps;
    const hasCallerAriaInvalid = ariaInvalid !== undefined;
    const resolvedDisabled = disabledProp ?? fieldContext?.disabled;
    const resolvedId = idProp ?? fieldContext?.controlId;
    const resolvedReadOnly = readOnlyProp ?? fieldContext?.readOnly;
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
    const derivedAriaChecked =
      indeterminate && ariaChecked === undefined ? 'mixed' : ariaChecked;

    useEffect(() => {
      if (!inputRef.current) {
        return;
      }

      inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <span
        className={classNames(
          styles.container,
          sizeClassMap[size],
          validationStateClassMap[resolvedValidationState],
          fullWidth && styles.fullWidth,
          resolvedDisabled && styles.disabled,
          className
        )}
      >
        <span className={styles.control}>
          <input
            {...nativeCheckboxProps}
            aria-checked={derivedAriaChecked}
            aria-describedby={describedBy}
            aria-invalid={derivedAriaInvalid}
            className={styles.input}
            data-indeterminate={indeterminate ? 'true' : undefined}
            disabled={resolvedDisabled}
            id={resolvedId}
            readOnly={resolvedReadOnly}
            ref={(node) => {
              inputRef.current = node;
              setRef(ref, node);
            }}
            required={resolvedRequired}
            type="checkbox"
          />
          <span
            aria-hidden="true"
            className={classNames(styles.icon, styles.checkIcon)}
          >
            <IconCheck />
          </span>
          <span
            aria-hidden="true"
            className={classNames(styles.icon, styles.minusIcon)}
          >
            <IconMinus />
          </span>
        </span>
      </span>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export type { CheckboxProps, CheckboxSize, CheckboxValidationState };
