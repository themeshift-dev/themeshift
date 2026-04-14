import classNames from 'classnames';
import { forwardRef, isValidElement, type ReactNode } from 'react';

import styles from './Input.module.scss';
import type { InputProps, InputSize, InputValidationState } from './types';

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
} satisfies Record<InputSize, string>;

const validationStateClassMap = {
  none: styles.none,
  invalid: styles.invalid,
  valid: styles.valid,
  warning: styles.warning,
} satisfies Record<InputValidationState, string>;

const interactiveRoles = new Set(['button', 'link']);
const interactiveTags = new Set(['a', 'button', 'input', 'select', 'textarea']);

const isInteractiveAdornment = (adornment: ReactNode) => {
  if (!isValidElement(adornment)) {
    return false;
  }

  if (typeof adornment.type === 'string') {
    return interactiveTags.has(adornment.type);
  }

  const props = adornment.props as {
    href?: unknown;
    onClick?: unknown;
    role?: unknown;
    tabIndex?: unknown;
    to?: unknown;
    type?: unknown;
  };

  if (typeof props.role === 'string' && interactiveRoles.has(props.role)) {
    return true;
  }

  if (typeof props.tabIndex === 'number' && props.tabIndex >= 0) {
    return true;
  }

  if (
    props.href !== undefined ||
    props.to !== undefined ||
    props.onClick !== undefined
  ) {
    return true;
  }

  return (
    props.type === 'button' || props.type === 'submit' || props.type === 'reset'
  );
};

/** A theme-aware text input with size, adornment, and validation variants. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      endAdornment,
      fullWidth = true,
      inputClassName,
      size = 'medium',
      startAdornment,
      validationState = 'none',
      ...inputProps
    },
    ref
  ) => {
    const hasEndAdornment = endAdornment !== undefined && endAdornment !== null;
    const hasInteractiveEndAdornment =
      hasEndAdornment && isInteractiveAdornment(endAdornment);
    const hasStartAdornment =
      startAdornment !== undefined && startAdornment !== null;
    const hasInteractiveStartAdornment =
      hasStartAdornment && isInteractiveAdornment(startAdornment);
    const hasCallerAriaInvalid = inputProps['aria-invalid'] !== undefined;

    const derivedAriaInvalid = hasCallerAriaInvalid
      ? inputProps['aria-invalid']
      : validationState === 'invalid'
        ? true
        : validationState === 'valid'
          ? false
          : undefined;

    return (
      <div
        className={classNames(
          styles.container,
          hasStartAdornment && styles.withStartAdornment,
          hasInteractiveStartAdornment && styles.withStartAdornmentInteractive,
          hasEndAdornment && styles.withEndAdornment,
          hasInteractiveEndAdornment && styles.withEndAdornmentInteractive,
          sizeClassMap[size],
          validationStateClassMap[validationState],
          fullWidth && styles.fullWidth,
          inputProps.disabled && styles.disabled,
          className
        )}
      >
        {hasStartAdornment ? (
          <span className={styles.adornment}>{startAdornment}</span>
        ) : null}
        <input
          {...inputProps}
          aria-invalid={derivedAriaInvalid}
          className={classNames(styles.input, inputClassName)}
          ref={ref}
        />
        {hasEndAdornment ? (
          <span className={styles.adornment}>{endAdornment}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export type { InputProps, InputSize, InputValidationState };
