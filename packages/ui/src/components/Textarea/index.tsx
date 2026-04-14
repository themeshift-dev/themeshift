import classNames from 'classnames';
import { forwardRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

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
      validationState = 'none',
      ...textareaProps
    },
    ref
  ) => {
    const hasCallerAriaInvalid = textareaProps['aria-invalid'] !== undefined;

    const derivedAriaInvalid = hasCallerAriaInvalid
      ? textareaProps['aria-invalid']
      : validationState === 'invalid'
        ? true
        : validationState === 'valid'
          ? false
          : undefined;

    const hasConflictingRows =
      resize === 'auto' && textareaProps.rows !== undefined;
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
      validationStateClassMap[validationState],
      resizeClassMap[resize],
      fullWidth && styles.fullWidth,
      textareaProps.disabled && styles.disabled,
      className
    );

    if (resize === 'auto') {
      const { rows: _rows, ...nativeTextareaProps } = textareaProps;
      const { height: _height, ...autosizeStyle } = style ?? {};

      return (
        <TextareaAutosize
          {...nativeTextareaProps}
          aria-invalid={derivedAriaInvalid}
          className={controlClassName}
          maxRows={maxRows}
          minRows={minRows}
          ref={ref}
          style={autosizeStyle}
        />
      );
    }

    return (
      <textarea
        {...textareaProps}
        aria-invalid={derivedAriaInvalid}
        className={controlClassName}
        ref={ref}
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
