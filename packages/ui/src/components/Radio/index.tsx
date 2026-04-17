/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ChangeEventHandler,
} from 'react';

import { mergeIds, useFieldContextOptional } from '@/components/Field/context';

import styles from './Radio.module.scss';
import type {
  RadioGroupProps,
  RadioGroupSize,
  RadioProps,
  RadioValidationState,
} from './types';

type RadioGroupContextValue = {
  describedBy?: string;
  disabled: boolean;
  name: string;
  onValueChange: (value: string) => void;
  required: boolean;
  size: RadioGroupSize;
  validationState: RadioValidationState;
  value?: string;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function sanitizeNamePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '');
}

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
} satisfies Record<RadioGroupSize, string>;

const validationStateClassMap = {
  none: styles.none,
  invalid: styles.invalid,
  valid: styles.valid,
  warning: styles.warning,
} satisfies Record<RadioValidationState, string>;

function deriveAriaInvalid(
  ariaInvalid: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined,
  validationState: RadioValidationState
) {
  if (ariaInvalid !== undefined) {
    return ariaInvalid;
  }

  if (validationState === 'invalid') {
    return true;
  }

  if (validationState === 'valid') {
    return false;
  }

  return undefined;
}

/**
 * A single theme-aware radio input that can be used standalone or inside
 * `Radio.Group`.
 */
export const RadioRoot = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, disabled, value, ...radioProps }, ref) => {
    const groupContext = useContext(RadioGroupContext);
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      checked: checkedProp,
      className,
      defaultChecked: defaultCheckedProp,
      name: nameProp,
      onChange: onChangeProp,
      required: requiredProp,
      ...nativeRadioProps
    } = radioProps;

    const isInGroup = !!groupContext;
    const resolvedName = isInGroup ? groupContext.name : nameProp;
    const resolvedSize = groupContext?.size ?? 'medium';
    const resolvedValidationState = groupContext?.validationState ?? 'none';
    const resolvedDisabled = disabled ?? groupContext?.disabled ?? false;
    const resolvedRequired = requiredProp ?? groupContext?.required ?? false;
    const isChecked = isInGroup
      ? (checkedProp ?? groupContext.value === value)
      : checkedProp;
    const describedBy = mergeIds(
      ariaDescribedBy,
      groupContext?.describedBy ?? undefined
    );
    const derivedAriaInvalid = deriveAriaInvalid(
      ariaInvalid,
      resolvedValidationState
    );

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      onChangeProp?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (!groupContext) {
        return;
      }

      if (event.currentTarget.checked) {
        groupContext.onValueChange(value);
      }
    };

    return (
      <label
        className={classNames(
          styles.radio,
          sizeClassMap[resolvedSize],
          validationStateClassMap[resolvedValidationState],
          resolvedDisabled && styles.disabled,
          isChecked && styles.checked,
          className
        )}
      >
        <span className={styles.control}>
          <input
            {...nativeRadioProps}
            aria-describedby={describedBy}
            aria-invalid={derivedAriaInvalid}
            checked={isChecked}
            className={styles.input}
            defaultChecked={isInGroup ? undefined : defaultCheckedProp}
            disabled={resolvedDisabled}
            name={resolvedName}
            onChange={handleChange}
            ref={ref}
            required={resolvedRequired}
            type="radio"
            value={value}
          />
          <span aria-hidden="true" className={styles.indicator}>
            <span aria-hidden="true" className={styles.dot} />
          </span>
        </span>
        <span className={styles.content}>{children}</span>
      </label>
    );
  }
);

RadioRoot.displayName = 'Radio';

/**
 * A native radio group built on top of `<fieldset>`.
 *
 * `Radio.Group` manages selection state and propagates shared props like
 * `name`, `required`, and `disabled` to its children.
 */
export const RadioGroup = <TValue extends string = string>({
  children,
  defaultValue,
  disabled,
  name,
  onValueChange,
  required,
  size = 'medium',
  validationState,
  value,
  ...fieldsetProps
}: RadioGroupProps<TValue>) => {
  const fieldContext = useFieldContextOptional();
  const reactId = useId();
  const fallbackName = useMemo(
    () => `radio-${sanitizeNamePart(reactId)}`,
    [reactId]
  );
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);
  const {
    'aria-describedby': ariaDescribedBy,
    className,
    ...nativeFieldsetProps
  } = fieldsetProps;

  const resolvedValue = value ?? uncontrolledValue;
  const resolvedDisabled = disabled ?? fieldContext?.disabled ?? false;
  const resolvedRequired = required ?? fieldContext?.required ?? false;
  const resolvedValidationState =
    validationState === undefined
      ? (fieldContext?.validationState ?? 'none')
      : validationState;
  const resolvedName = name ?? fallbackName;
  const describedBy = mergeIds(
    ariaDescribedBy,
    fieldContext?.hasDescription ? fieldContext.descriptionId : undefined,
    fieldContext?.hasError ? fieldContext.errorId : undefined
  );

  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue as TValue);
    },
    [onValueChange, value]
  );

  const contextValue = useMemo(
    () =>
      ({
        describedBy,
        disabled: resolvedDisabled,
        name: resolvedName,
        onValueChange: handleValueChange,
        required: resolvedRequired,
        size,
        validationState: resolvedValidationState,
        value: resolvedValue,
      }) satisfies RadioGroupContextValue,
    [
      describedBy,
      handleValueChange,
      resolvedDisabled,
      resolvedName,
      resolvedRequired,
      resolvedValidationState,
      resolvedValue,
      size,
    ]
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <fieldset
        {...nativeFieldsetProps}
        className={classNames(styles.group, className)}
        disabled={resolvedDisabled}
        data-size={size}
        data-validation-state={resolvedValidationState}
      >
        {children}
      </fieldset>
    </RadioGroupContext.Provider>
  );
};

type RadioComponent = ((props: RadioProps) => React.JSX.Element) & {
  Group: typeof RadioGroup;
};

export const Radio = Object.assign(RadioRoot, {
  Group: RadioGroup,
}) as RadioComponent;

export type {
  RadioGroupProps,
  RadioGroupSize,
  RadioProps,
  RadioRootProps,
  RadioValidationState,
} from './types';
