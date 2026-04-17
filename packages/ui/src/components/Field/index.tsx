/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  Children,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { ErrorMessage } from '@/components/ErrorMessage';
import { Label } from '@/components/Label';

import { FieldContext, useFieldContext } from './context';
import styles from './Field.module.scss';
import type {
  FieldAlign,
  FieldContextInternalValue,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLayout,
  FieldLabelProps,
  FieldProps,
  ValidationState,
} from './types';

const hasRenderableContent = (value: ReactNode) =>
  value !== null && value !== undefined;

export const FieldLabel = ({
  as = 'label',
  children,
  className,
  showOptionalIndicator,
  showRequiredIndicator,
  visuallyHidden,
  ...labelProps
}: FieldLabelProps) => {
  const fieldContext = useFieldContext('Field.Label');

  if (!hasRenderableContent(children)) {
    return null;
  }

  const isRequired = showRequiredIndicator ?? !!fieldContext?.required;
  const isOptional =
    showOptionalIndicator ??
    (!!fieldContext?.optional && !fieldContext?.required);
  const hidden = visuallyHidden ?? fieldContext?.hideLabel ?? false;

  return as === 'legend' ? (
    <legend
      {...labelProps}
      className={classNames(
        styles.legend,
        styles.label,
        hidden && styles.visuallyHidden,
        className
      )}
      id={fieldContext?.labelId}
    >
      <span>{children}</span>
      {isRequired ? (
        <span aria-hidden="true" className={styles.requiredIndicator}>
          *
        </span>
      ) : isOptional ? (
        <span className={styles.optionalIndicator}>(optional)</span>
      ) : null}
    </legend>
  ) : (
    <Label
      {...labelProps}
      className={classNames(
        styles.label,
        hidden && styles.visuallyHidden,
        className
      )}
      htmlFor={fieldContext?.controlId}
      id={fieldContext?.labelId}
    >
      <span>{children}</span>
      {isRequired ? (
        <span aria-hidden="true" className={styles.requiredIndicator}>
          *
        </span>
      ) : isOptional ? (
        <span className={styles.optionalIndicator}>(optional)</span>
      ) : null}
    </Label>
  );
};

export const FieldDescription = ({
  children,
  className,
  ...descriptionProps
}: FieldDescriptionProps) => {
  const fieldContext = useFieldContext('Field.Description');
  const hasContent = hasRenderableContent(children);

  useEffect(() => {
    if (!fieldContext || !hasContent) {
      return undefined;
    }

    fieldContext.registerDescription();

    return () => {
      fieldContext.unregisterDescription();
    };
  }, [fieldContext, hasContent]);

  if (!hasContent) {
    return null;
  }

  return (
    <p
      {...descriptionProps}
      className={classNames(styles.description, className)}
      id={fieldContext?.descriptionId}
    >
      {children}
    </p>
  );
};

export const FieldError = ({
  children,
  className,
  forceMount = false,
  role = 'status',
  ...errorProps
}: FieldErrorProps) => {
  const fieldContext = useFieldContext('Field.Error');
  const resolvedChildren =
    children === null || children === undefined
      ? fieldContext?.error
      : children;
  const hasContent = hasRenderableContent(resolvedChildren);
  const isInvalid = fieldContext?.validationState === 'invalid';
  const shouldRender = hasContent && (forceMount || isInvalid || !fieldContext);

  useEffect(() => {
    if (!fieldContext || !shouldRender) {
      return undefined;
    }

    fieldContext.registerError();

    return () => {
      fieldContext.unregisterError();
    };
  }, [fieldContext, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <ErrorMessage
      {...errorProps}
      className={classNames(styles.error, className)}
      id={fieldContext?.errorId}
      role={role}
    >
      {resolvedChildren}
    </ErrorMessage>
  );
};

export const FieldRoot = ({
  align = 'start',
  children,
  className,
  description,
  disabled,
  error: errorProp,
  form,
  hideLabel = false,
  id,
  label,
  layout = 'stacked',
  name,
  optional = false,
  readOnly,
  required,
  validationState: validationStateProp,
  ...rootProps
}: FieldProps) => {
  const reactId = useId();
  const fieldId = id ?? `field-${reactId}`;
  const controlId = `${fieldId}-control`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const labelId = `${fieldId}-label`;
  const [descriptionRegistrations, setDescriptionRegistrations] = useState(0);
  const [errorRegistrations, setErrorRegistrations] = useState(0);
  const integratedFieldState =
    form && name ? form.field(name as never) : undefined;
  const integratedError = integratedFieldState?.error;
  const resolvedValidationState =
    validationStateProp ?? (integratedFieldState?.invalid ? 'invalid' : 'none');
  const hasDescription =
    hasRenderableContent(description) || descriptionRegistrations > 0;
  const hasError =
    resolvedValidationState === 'invalid' &&
    (hasRenderableContent(errorProp) ||
      hasRenderableContent(integratedError) ||
      errorRegistrations > 0);

  const registerDescription = useCallback(() => {
    setDescriptionRegistrations((count) => count + 1);
  }, []);

  const unregisterDescription = useCallback(() => {
    setDescriptionRegistrations((count) => Math.max(0, count - 1));
  }, []);

  const registerError = useCallback(() => {
    setErrorRegistrations((count) => count + 1);
  }, []);

  const unregisterError = useCallback(() => {
    setErrorRegistrations((count) => Math.max(0, count - 1));
  }, []);

  const contextValue = useMemo(
    () =>
      ({
        align,
        controlId,
        description,
        descriptionId,
        disabled,
        error: errorProp ?? integratedError,
        errorId,
        fieldId,
        form,
        hasDescription,
        hasError,
        hideLabel,
        label,
        labelId,
        layout,
        name,
        optional,
        readOnly,
        registerDescription,
        registerError,
        required,
        unregisterDescription,
        unregisterError,
        validationState: resolvedValidationState,
      }) satisfies FieldContextInternalValue,
    [
      align,
      controlId,
      description,
      descriptionId,
      disabled,
      errorProp,
      errorId,
      fieldId,
      form,
      hasDescription,
      hasError,
      hideLabel,
      label,
      labelId,
      layout,
      name,
      optional,
      readOnly,
      registerDescription,
      registerError,
      required,
      unregisterDescription,
      unregisterError,
      integratedError,
      resolvedValidationState,
    ]
  );

  const shouldRenderShorthand =
    hasRenderableContent(label) ||
    hasRenderableContent(description) ||
    hasRenderableContent(errorProp);

  let fieldContent = children;

  if (shouldRenderShorthand && layout === 'stacked') {
    fieldContent = (
      <>
        {hasRenderableContent(label) ? <FieldLabel>{label}</FieldLabel> : null}
        {children}
        {hasRenderableContent(description) ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        {hasRenderableContent(errorProp) ? (
          <FieldError>{errorProp}</FieldError>
        ) : null}
      </>
    );
  }

  if (shouldRenderShorthand && layout === 'inline-control') {
    fieldContent = (
      <>
        {children}
        <div className={styles.inlineContent}>
          {hasRenderableContent(label) ? (
            <FieldLabel>{label}</FieldLabel>
          ) : null}
          {hasRenderableContent(description) ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
          {hasRenderableContent(errorProp) ? (
            <FieldError>{errorProp}</FieldError>
          ) : null}
        </div>
      </>
    );
  }

  if (!shouldRenderShorthand && layout === 'inline-control') {
    const inlineChildren = Children.toArray(children);
    const [control, ...content] = inlineChildren;

    if (content.length > 0) {
      fieldContent = (
        <>
          {control}
          <div className={styles.inlineContent}>{content}</div>
        </>
      );
    }
  }

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        {...rootProps}
        className={classNames(styles.container, className)}
        data-align={align as FieldAlign}
        data-layout={layout as FieldLayout}
        data-validation-state={resolvedValidationState as ValidationState}
      >
        {fieldContent}
      </div>
    </FieldContext.Provider>
  );
};

type FieldComponent = ((props: FieldProps) => React.JSX.Element) & {
  Description: typeof FieldDescription;
  Error: typeof FieldError;
  Label: typeof FieldLabel;
};

export const Field = Object.assign(FieldRoot, {
  Description: FieldDescription,
  Error: FieldError,
  Label: FieldLabel,
}) as FieldComponent;

export type {
  FieldAlign,
  FieldBaseStateProps,
  FieldContextValue,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLayout,
  FieldLabelProps,
  FieldProps,
  FieldTextContent,
  ValidationState,
} from './types';
