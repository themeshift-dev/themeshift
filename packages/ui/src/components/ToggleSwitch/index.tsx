import classNames from 'classnames';
import {
  useId,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type PointerEventHandler,
} from 'react';

import { ErrorMessage } from '../ErrorMessage';
import { Label } from '../Label';

import styles from './ToggleSwitch.module.scss';
import type {
  ToggleSwitchIntent,
  ToggleSwitchProps,
  ToggleSwitchSize,
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

/**
 * Combines external and internally generated description IDs into a single
 * valid ARIA ID reference list.
 *
 * This lets the switch preserve caller-provided `aria-describedby` values
 * while also appending the generated IDs for `description` and
 * `errorMessage`.
 */
function mergeIds(...idGroups: Array<string | undefined>) {
  const values = new Set(
    idGroups
      .flatMap((idGroup) => idGroup?.split(/\s+/) ?? [])
      .map((value) => value.trim())
      .filter(Boolean)
  );

  return values.size > 0 ? Array.from(values).join(' ') : undefined;
}

/** A theme-aware switch built on top of a native checkbox input. */
export const ToggleSwitch = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  allowTextSelection = false,
  checked,
  className,
  defaultChecked = false,
  description,
  disabled = false,
  errorMessage,
  iconOff,
  iconOn,
  id,
  intent = 'primary',
  label,
  labelClassName,
  labelPosition = 'end',
  name,
  onBlur,
  onCheckedChange,
  onFocus,
  readOnly = false,
  required = false,
  size = 'medium',
  thumbClassName,
  trackClassName,
  value,
  ...inputProps
}: ToggleSwitchProps) => {
  const reactId = useId();
  const [, forceRender] = useState(0);
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const inputId = id ?? `toggle-switch-${reactId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId, errorId);
  const isChecked = checked ?? uncontrolledChecked;
  const activeIcon = isChecked ? iconOn : iconOff;
  const hasContent =
    label !== undefined ||
    description !== undefined ||
    errorMessage !== undefined;
  const accessibleLabel = label === undefined ? ariaLabel : undefined;
  const accessibleLabelledBy = label === undefined ? ariaLabelledBy : undefined;
  const {
    onClick: onInputClick,
    onKeyDown: onInputKeyDown,
    onKeyUp: onInputKeyUp,
    onPointerDown: onInputPointerDown,
    ...nativeInputProps
  } = inputProps;
  const isInvalid =
    nativeInputProps['aria-invalid'] === true ||
    nativeInputProps['aria-invalid'] === 'true';

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (readOnly) {
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

    if (readOnly) {
      event.preventDefault();
      event.currentTarget.checked = isChecked;
      forceRender((value) => value + 1);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    onInputKeyDown?.(event);

    if (
      readOnly &&
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
      readOnly &&
      (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar')
    ) {
      event.preventDefault();
      event.currentTarget.checked = isChecked;
      forceRender((value) => value + 1);
    }
  };

  const handlePointerDown: PointerEventHandler<HTMLInputElement> = (event) => {
    onInputPointerDown?.(event);

    if (readOnly) {
      event.preventDefault();
    }
  };

  const content = hasContent ? (
    <div className={styles.content}>
      {label !== undefined ? (
        <Label className={labelClassName} htmlFor={inputId}>
          {label}
        </Label>
      ) : null}
      {description !== undefined ? (
        <p className={styles.description} id={descriptionId}>
          {description}
        </p>
      ) : null}
      {errorMessage !== undefined ? (
        <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>
      ) : null}
    </div>
  ) : null;

  return (
    <div
      className={classNames(
        styles.container,
        allowTextSelection && styles.allowTextSelection,
        sizeClassMap[size],
        intentClassMap[intent],
        isChecked && styles.checked,
        disabled && styles.disabled,
        isInvalid && styles.invalid,
        readOnly && styles.readOnly,
        className
      )}
    >
      {labelPosition === 'start' ? content : null}
      <span className={styles.controlLabel}>
        <input
          {...nativeInputProps}
          aria-checked={isChecked}
          aria-describedby={describedBy}
          aria-label={accessibleLabel}
          aria-labelledby={accessibleLabelledBy}
          aria-readonly={readOnly || undefined}
          checked={isChecked}
          className={styles.input}
          disabled={disabled}
          id={inputId}
          name={name}
          onBlur={onBlur}
          onChange={handleChange}
          onClick={handleClick}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPointerDown={handlePointerDown}
          required={required}
          role="switch"
          type="checkbox"
          value={value}
        />
        <span className={styles.control}>
          <span className={classNames(styles.track, trackClassName)}>
            {activeIcon !== undefined ? (
              <span
                aria-hidden="true"
                className={classNames(
                  styles.icon,
                  isChecked ? styles.iconOn : styles.iconOff
                )}
              >
                {activeIcon}
              </span>
            ) : null}
            <span
              aria-hidden="true"
              className={classNames(styles.thumb, thumbClassName)}
            />
          </span>
        </span>
      </span>
      {labelPosition === 'end' ? content : null}
    </div>
  );
};

export type {
  ToggleSwitchIntent,
  ToggleSwitchLabelPosition,
  ToggleSwitchProps,
  ToggleSwitchSize,
} from './types';
