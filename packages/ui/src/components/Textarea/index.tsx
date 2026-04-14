import classNames from 'classnames';
import { forwardRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { mergeIds, useFieldContextOptional } from '@/components/Field/context';

import styles from './Textarea.module.scss';
import type {
  TextareaProps,
  TextareaResize,
  TextareaSize,
  TextareaValidationState,
} from './types';

const resizeClassMap = {
  none: styles.resizeNone,
  vertical: styles.resizeVertical,
  horizontal: styles.resizeHorizontal,
  both: styles.resizeBoth,
  auto: styles.resizeAuto,
} satisfies Record<TextareaResize, string>;

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
} satisfies Record<TextareaSize, string>;

const validationStateClassMap = {
  none: styles.none,
  invalid: styles.invalid,
  valid: styles.valid,
  warning: styles.warning,
} satisfies Record<TextareaValidationState, string>;

/** A theme-aware textarea with native and autosize resize modes. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      fullWidth = true,
      maxRows,
      minRows,
      resize = 'vertical',
      size = 'medium',
      style,
      validationState,
      ...textareaProps
    },
    ref
  ) => {
    const fieldContext = useFieldContextOptional();
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      disabled: disabledProp,
      id: idProp,
      readOnly: readOnlyProp,
      required: requiredProp,
      ...nativeTextareaProps
    } = textareaProps;
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

    const hasConflictingRows =
      resize === 'auto' && nativeTextareaProps.rows !== undefined;
    const hasConflictingHeight =
      resize === 'auto' && style?.height !== undefined;

    if (
      import.meta.env.DEV &&
      resize === 'auto' &&
      (hasConflictingRows || hasConflictingHeight)
    ) {
      console.warn(
        '[Textarea] `resize="auto"` ignores `rows` and `style.height`. Use `minRows` and `maxRows` to control autosize bounds.'
      );
    }

    const controlClassName = classNames(
      styles.container,
      sizeClassMap[size],
      validationStateClassMap[resolvedValidationState],
      resizeClassMap[resize],
      fullWidth && styles.fullWidth,
      resolvedDisabled && styles.disabled,
      className
    );

    if (resize === 'auto') {
      const { rows: _rows, ...autosizeTextareaProps } = nativeTextareaProps;
      const { height: _height, ...autosizeStyle } = style ?? {};

      return (
        <TextareaAutosize
          {...autosizeTextareaProps}
          aria-describedby={describedBy}
          aria-invalid={derivedAriaInvalid}
          className={controlClassName}
          disabled={resolvedDisabled}
          id={resolvedId}
          maxRows={maxRows}
          minRows={minRows}
          readOnly={resolvedReadOnly}
          ref={ref}
          required={resolvedRequired}
          style={autosizeStyle}
        />
      );
    }

    return (
      <textarea
        {...nativeTextareaProps}
        aria-describedby={describedBy}
        aria-invalid={derivedAriaInvalid}
        className={controlClassName}
        disabled={resolvedDisabled}
        id={resolvedId}
        readOnly={resolvedReadOnly}
        ref={ref}
        required={resolvedRequired}
        style={style}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export type {
  TextareaProps,
  TextareaResize,
  TextareaSize,
  TextareaValidationState,
};
