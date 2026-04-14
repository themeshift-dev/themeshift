import classNames from 'classnames';
import {
  forwardRef,
  useState,
  type ChangeEventHandler,
  type ForwardedRef,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type PointerEventHandler,
} from 'react';

import { mergeIds, useFieldContextOptional } from '@/components/Field/context';

import styles from './ToggleSwitch.module.scss';
import type {
  ToggleSwitchIntent,
  ToggleSwitchProps,
  ToggleSwitchSize,
  ToggleSwitchValidationState,
} from './types';

const intentClassMap = {
  constructive: styles.constructive,
  destructive: styles.destructive,
  primary: styles.primary,
  secondary: styles.secondary,
  tertiary: styles.tertiary,
} satisfies Record<ToggleSwitchIntent, string>;

const sizeClassMap = {
  large: styles.large,
  medium: styles.medium,
  small: styles.small,
} satisfies Record<ToggleSwitchSize, string>;

const validationStateClassMap = {
  invalid: styles.invalid,
  none: styles.none,
  valid: styles.valid,
  warning: styles.warning,
} satisfies Record<ToggleSwitchValidationState, string>;

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
 * A theme-aware switch built on top of a native checkbox input.
 *
 * Use `Field` to render label, description, and error messaging.
 */
export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  (
    {
      checked,
      className,
      defaultChecked = false,
      intent = 'primary',
      onCheckedChange,
      size = 'medium',
      thumbClassName,
      thumbIconOff,
      thumbIconOn,
      trackClassName,
      trackIconOff,
      trackIconOn,
      validationState,
      ...inputProps
    },
    ref
  ) => {
    const fieldContext = useFieldContextOptional();
    const [, forceRender] = useState(0);
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      disabled: disabledProp,
      id: idProp,
      onClick: onInputClick,
      onKeyDown: onInputKeyDown,
      onKeyUp: onInputKeyUp,
      onPointerDown: onInputPointerDown,
      readOnly: readOnlyProp,
      required: requiredProp,
      ...nativeInputProps
    } = inputProps;
    const hasCallerAriaInvalid = ariaInvalid !== undefined;
    const isChecked = checked ?? uncontrolledChecked;
    const activeThumbIcon = isChecked ? thumbIconOn : thumbIconOff;
    const activeTrackIcon = isChecked ? trackIconOn : trackIconOff;
    const resolvedDisabled = disabledProp ?? fieldContext?.disabled ?? false;
    const resolvedId = idProp ?? fieldContext?.controlId;
    const resolvedReadOnly = readOnlyProp ?? fieldContext?.readOnly ?? false;
    const resolvedRequired = requiredProp ?? fieldContext?.required ?? false;
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

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      if (resolvedReadOnly) {
        event.preventDefault();
        event.currentTarget.checked = isChecked;
        forceRender((value) => value + 1);
        return;
      }

      const nextChecked = event.currentTarget.checked;

      if (checked === undefined) {
        setUncontrolledChecked(nextChecked);
      }

      onCheckedChange?.(nextChecked);
    };

    const handleClick: MouseEventHandler<HTMLInputElement> = (event) => {
      onInputClick?.(event);

      if (resolvedReadOnly) {
        event.preventDefault();
        event.currentTarget.checked = isChecked;
        forceRender((value) => value + 1);
      }
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
      onInputKeyDown?.(event);

      if (
        resolvedReadOnly &&
        (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar')
      ) {
        event.preventDefault();
        event.currentTarget.checked = isChecked;
        forceRender((value) => value + 1);
      }
    };

    const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
      onInputKeyUp?.(event);

      if (
        resolvedReadOnly &&
        (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar')
      ) {
        event.preventDefault();
        event.currentTarget.checked = isChecked;
        forceRender((value) => value + 1);
      }
    };

    const handlePointerDown: PointerEventHandler<HTMLInputElement> = (
      event
    ) => {
      onInputPointerDown?.(event);

      if (resolvedReadOnly) {
        event.preventDefault();
      }
    };

    return (
      <span
        className={classNames(
          styles.container,
          sizeClassMap[size],
          intentClassMap[intent],
          validationStateClassMap[resolvedValidationState],
          isChecked && styles.checked,
          resolvedDisabled && styles.disabled,
          resolvedReadOnly && styles.readOnly,
          className
        )}
      >
        <span className={styles.controlLabel}>
          <input
            {...nativeInputProps}
            aria-checked={isChecked}
            aria-describedby={describedBy}
            aria-invalid={derivedAriaInvalid}
            aria-readonly={resolvedReadOnly || undefined}
            checked={isChecked}
            className={styles.input}
            disabled={resolvedDisabled}
            id={resolvedId}
            onChange={handleChange}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onPointerDown={handlePointerDown}
            readOnly={resolvedReadOnly}
            ref={(node) => {
              setRef(ref, node);
            }}
            required={resolvedRequired}
            role="switch"
            type="checkbox"
          />
          <span className={styles.control}>
            <span className={classNames(styles.track, trackClassName)}>
              {activeTrackIcon !== undefined ? (
                <span
                  aria-hidden="true"
                  className={classNames(
                    styles.trackIcon,
                    isChecked ? styles.trackIconOn : styles.trackIconOff
                  )}
                >
                  {activeTrackIcon}
                </span>
              ) : null}
              <span
                aria-hidden="true"
                className={classNames(styles.thumb, thumbClassName)}
              >
                {activeThumbIcon !== undefined ? (
                  <span aria-hidden="true" className={styles.thumbIcon}>
                    {activeThumbIcon}
                  </span>
                ) : null}
              </span>
            </span>
          </span>
        </span>
      </span>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';

export type {
  ToggleSwitchIntent,
  ToggleSwitchProps,
  ToggleSwitchSize,
  ToggleSwitchValidationState,
} from './types';
