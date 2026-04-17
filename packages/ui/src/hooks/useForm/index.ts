import { useCallback, useMemo, useRef, useState, type FormEvent } from 'react';

export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends Record<string, unknown>
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type FieldName<TValues> =
  | (keyof TValues & string)
  | `${keyof TValues & string}.${string}`;

export type FieldValidator<TValue, TValues> = (
  value: TValue,
  values: TValues
) => string | undefined | Promise<string | undefined>;

export type FormErrors<TValues> = Partial<Record<FieldName<TValues>, string>>;

export type FieldState<TValues> = {
  name: FieldName<TValues>;
  value: unknown;
  error?: string;
  invalid: boolean;
  touched: boolean;
  dirty: boolean;
};

export type RegisteredFieldProps = {
  name: string;
  ref: (node: HTMLElement | null) => void;
  onBlur: (event: unknown) => void;
  onChange: (event: unknown) => void;
  defaultValue?: string | number | readonly string[];
  defaultChecked?: boolean;
};

export type RegisterOptions = {
  /** Overrides form-level validation behavior for this field. */
  validateOn?: 'submit' | 'blur' | 'change' | 'blur-submit' | false;
};

export type ControlledField<TValues, TValue> = {
  name: FieldName<TValues>;
  value: TValue;
  setValue: (value: TValue) => void;
  onChange: (value: TValue) => void;
  onBlur: () => void;
  error?: string;
  invalid: boolean;
  touched: boolean;
  dirty: boolean;
};

export type ControllerOptions<TValue> = {
  defaultValue?: TValue;
};

export type SetValueOptions = {
  shouldDirty?: boolean;
  shouldTouch?: boolean;
  shouldValidate?: boolean;
};

export type UseFormOptions<TValues> = {
  /**
   * Default values for the form.
   *
   * These values are applied to registered DOM fields (via Field-aware
   * controls) and controller fields.
   */
  defaultValues?: DeepPartial<TValues>;

  /**
   * Optional map of field validators.
   *
   * Each validator can be sync or async and should return a string error
   * message (or `undefined` when valid).
   */
  validate?: Partial<
    Record<FieldName<TValues>, FieldValidator<unknown, TValues>>
  >;

  /**
   * Controls when validation runs.
   *
   * - `submit`: validate on submit (default)
   * - `blur`: validate when a field blurs
   * - `change`: validate on each change
   * - `blur-submit`: validate on blur, but only after the first submit attempt
   */
  validateOn?: 'submit' | 'blur' | 'change' | 'blur-submit';
};

export type FormApi<TValues> = {
  /**
   * Registers a DOM-backed field and returns props for the input element.
   */
  register: (
    name: FieldName<TValues>,
    options?: RegisterOptions
  ) => RegisteredFieldProps;
  /**
   * Creates a controlled adapter for non-standard or fully controlled inputs.
   */
  controller: <TValue = unknown>(
    name: FieldName<TValues>,
    options?: ControllerOptions<TValue>
  ) => ControlledField<TValues, TValue>;
  /**
   * Creates a submit handler that validates first and then calls your
   * success/error callbacks.
   */
  handleSubmit: (
    onValid: (
      values: TValues,
      event: FormEvent<HTMLFormElement>
    ) => void | Promise<void>,
    onInvalid?: (errors: FormErrors<TValues>) => void
  ) => (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  /**
   * Returns live state for a single field.
   */
  field: (name: FieldName<TValues>) => FieldState<TValues>;
  /**
   * Returns a snapshot of current form values.
   */
  getValues: () => TValues;
  /**
   * Sets a field value and optionally marks the field dirty/touched or triggers
   * validation.
   */
  setValue: (
    name: FieldName<TValues>,
    value: unknown,
    options?: SetValueOptions
  ) => void;
  /**
   * Resets values and form state back to defaults (or provided next values).
   */
  reset: (nextValues?: DeepPartial<TValues>) => void;
  /**
   * Runs validation for one field or the full form and resolves with the
   * validity result.
   */
  validate: (name?: FieldName<TValues>) => Promise<boolean>;
  /**
   * Aggregate state for the form.
   */
  formState: {
    /**
     * `true` while an async submit handler is running.
     */
    isSubmitting: boolean;
    /**
     * `true` after at least one submit attempt.
     */
    isSubmitted: boolean;
    /**
     * `true` when there are no current validation errors.
     */
    isValid: boolean;
    /**
     * Total number of submit attempts.
     */
    submitCount: number;
    /**
     * Current error messages keyed by field name.
     */
    errors: FormErrors<TValues>;
    /**
     * Tracks which fields have been blurred/interacted with.
     */
    touchedFields: Partial<Record<FieldName<TValues>, boolean>>;
    /**
     * Tracks which fields differ from their default values.
     */
    dirtyFields: Partial<Record<FieldName<TValues>, boolean>>;
  };
};

type ValidateMode = NonNullable<
  UseFormOptions<Record<string, unknown>>['validateOn']
>;

type DomElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type DomRegistration = {
  kind: 'dom';
  elements: Set<DomElement>;
  defaultValue: unknown;
  lastValue: unknown;
  touched: boolean;
  dirty: boolean;
  validateOnOverride?: ValidateMode | false;
};

type ControllerRegistration = {
  kind: 'controller';
  value: unknown;
  defaultValue: unknown;
  lastValue: unknown;
  touched: boolean;
  dirty: boolean;
  validateOnOverride?: ValidateMode | false;
};

type Registration = DomRegistration | ControllerRegistration;

type Store<TValues> = {
  defaultValues: DeepPartial<TValues>;
  initialDefaultValues: DeepPartial<TValues>;
  validateOn: ValidateMode;
  validators: Partial<Record<string, FieldValidator<unknown, TValues>>>;
  registrations: Map<string, Registration>;
  errors: Record<string, string>;
  submitCount: number;
  isSubmitted: boolean;
  isSubmitting: boolean;
  registerCache: Map<
    string,
    {
      ref: (node: HTMLElement | null) => void;
      onBlur: (event: unknown) => void;
      onChange: (event: unknown) => void;
    }
  >;
};

function splitPath(path: string) {
  return path.split('.').filter(Boolean);
}

function getIn(obj: unknown, path: string) {
  const parts = splitPath(path);
  let current: unknown = obj;

  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function setIn(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = splitPath(path);

  if (parts.length === 0) {
    return;
  }

  let current: Record<string, unknown> = target;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];

    const next = current[part];

    if (
      next === null ||
      next === undefined ||
      typeof next !== 'object' ||
      Array.isArray(next)
    ) {
      current[part] = {};
    }

    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
}

function cloneDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as T;
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(
      value as Record<string, unknown>
    )) {
      result[key] = cloneDeep(entry);
    }

    return result as T;
  }

  return value;
}

function arrayShallowEqual(left: unknown[], right: unknown[]) {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (!Object.is(left[index], right[index])) {
      return false;
    }
  }

  return true;
}

function valuesEqual(left: unknown, right: unknown) {
  if (Array.isArray(left) && Array.isArray(right)) {
    return arrayShallowEqual(left, right);
  }

  return Object.is(left, right);
}

function toRegisteredDefaultValue(
  value: unknown
): RegisteredFieldProps['defaultValue'] {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => String(entry));
  }

  return String(value);
}

function readDomValue(element: DomElement): unknown {
  if (element instanceof HTMLSelectElement) {
    if (element.multiple) {
      return Array.from(element.selectedOptions).map((option) => option.value);
    }

    return element.value;
  }

  if (element instanceof HTMLTextAreaElement) {
    return element.value;
  }

  if (element.type === 'checkbox') {
    return element.checked;
  }

  if (element.type === 'radio') {
    return element.checked ? element.value : undefined;
  }

  return element.value;
}

function readRegistrationValue(registration: Registration): unknown {
  if (registration.kind === 'controller') {
    return registration.value;
  }

  const elements = Array.from(registration.elements);

  if (elements.length === 0) {
    return registration.lastValue;
  }

  const first = elements[0];

  if (first instanceof HTMLInputElement && first.type === 'radio') {
    for (const element of elements) {
      if (element instanceof HTMLInputElement && element.type === 'radio') {
        if (element.checked) {
          return element.value;
        }
      }
    }

    return undefined;
  }

  return readDomValue(first);
}

function applyValueToDom(element: DomElement, value: unknown) {
  if (element instanceof HTMLSelectElement) {
    if (element.multiple && Array.isArray(value)) {
      const values = new Set(value.map(String));

      for (const option of Array.from(element.options)) {
        option.selected = values.has(option.value);
      }

      return;
    }

    element.value = value === undefined || value === null ? '' : String(value);
    return;
  }

  if (element instanceof HTMLTextAreaElement) {
    element.value = value === undefined || value === null ? '' : String(value);
    return;
  }

  if (element.type === 'checkbox') {
    element.checked = Boolean(value);
    return;
  }

  if (element.type === 'radio') {
    element.checked = element.value === String(value);
    return;
  }

  element.value = value === undefined || value === null ? '' : String(value);
}

async function validateWithValues<TValues>(
  validators: Partial<Record<string, FieldValidator<unknown, TValues>>>,
  values: TValues,
  name?: string
) {
  const errors: Record<string, string> = {};
  const entries = Object.entries(validators);

  for (const [fieldName, validator] of entries) {
    if (!validator) {
      continue;
    }

    if (name && fieldName !== name) {
      continue;
    }

    const error = await validator(getIn(values, fieldName), values);

    if (typeof error === 'string' && error.trim().length > 0) {
      errors[fieldName] = error;
    }
  }

  return errors;
}

export function useForm<TValues extends Record<string, unknown>>(
  options: UseFormOptions<TValues> = {}
): FormApi<TValues> {
  const [version, setVersion] = useState(0);

  const storeRef = useRef<Store<TValues> | null>(null);

  if (!storeRef.current) {
    const defaultValues = (options.defaultValues ?? {}) as DeepPartial<TValues>;

    storeRef.current = {
      defaultValues,
      initialDefaultValues: defaultValues,
      validateOn: options.validateOn ?? 'submit',
      validators: (options.validate ?? {}) as Partial<
        Record<string, FieldValidator<unknown, TValues>>
      >,
      registrations: new Map(),
      errors: {},
      submitCount: 0,
      isSubmitted: false,
      isSubmitting: false,
      registerCache: new Map(),
    };
  }

  const store = storeRef.current;

  const notify = useCallback(() => {
    setVersion((value) => value + 1);
  }, []);

  const getValidateModeForField = useCallback(
    (registration: Registration | undefined): ValidateMode | false => {
      if (!registration) {
        return store.validateOn;
      }

      if (registration.validateOnOverride === false) {
        return false;
      }

      return registration.validateOnOverride ?? store.validateOn;
    },
    [store.validateOn]
  );

  const getValues = useCallback((): TValues => {
    const values = cloneDeep(store.defaultValues) as unknown as TValues;

    for (const [name, registration] of store.registrations.entries()) {
      setIn(
        values as Record<string, unknown>,
        name,
        readRegistrationValue(registration)
      );
    }

    return values;
  }, [store.defaultValues, store.registrations]);

  const syncDerivedFlags = useCallback(
    (registration: Registration, nextValue: unknown) => {
      const shouldTouch = registration.touched;
      const nextDirty = !valuesEqual(nextValue, registration.defaultValue);
      const nextTouched = shouldTouch;
      const dirtyChanged = registration.dirty !== nextDirty;

      registration.lastValue = nextValue;
      registration.dirty = nextDirty;
      registration.touched = nextTouched;

      return dirtyChanged;
    },
    []
  );

  const setError = useCallback(
    (name: string, nextError: string | undefined) => {
      const prev = store.errors[name];

      if (nextError) {
        if (prev === nextError) {
          return false;
        }

        store.errors[name] = nextError;
        return true;
      }

      if (prev === undefined) {
        return false;
      }

      delete store.errors[name];
      return true;
    },
    [store.errors]
  );

  const validate = useCallback(
    async (name?: FieldName<TValues>) => {
      const values = getValues();
      const errors = await validateWithValues(store.validators, values, name);

      let didChange = false;

      if (name) {
        const next = errors[name as string];
        didChange = setError(name as string, next);
      } else {
        const nextNames = new Set(Object.keys(errors));
        const prevNames = new Set(Object.keys(store.errors));

        for (const key of prevNames) {
          if (!nextNames.has(key)) {
            delete store.errors[key];
            didChange = true;
          }
        }

        for (const [key, message] of Object.entries(errors)) {
          if (store.errors[key] !== message) {
            store.errors[key] = message;
            didChange = true;
          }
        }
      }

      if (didChange) {
        notify();
      }

      return Object.keys(errors).length === 0;
    },
    [getValues, notify, setError, store.errors, store.validators]
  );

  const ensureRegistration = useCallback(
    (
      name: FieldName<TValues>,
      options?: {
        kind?: 'dom' | 'controller';
        validateOnOverride?: ValidateMode | false;
        defaultValue?: unknown;
      }
    ): Registration => {
      const key = name as string;
      const existing = store.registrations.get(key);

      if (existing) {
        if (options?.validateOnOverride !== undefined) {
          existing.validateOnOverride = options.validateOnOverride;
        }

        return existing;
      }

      const defaultValueFromDefaults = getIn(store.defaultValues, key);
      const defaultValue =
        options?.defaultValue !== undefined
          ? options.defaultValue
          : defaultValueFromDefaults;

      const registration: Registration =
        options?.kind === 'controller'
          ? {
              kind: 'controller',
              value: defaultValue,
              defaultValue,
              lastValue: defaultValue,
              touched: false,
              dirty: false,
              validateOnOverride: options?.validateOnOverride,
            }
          : {
              kind: 'dom',
              elements: new Set(),
              defaultValue,
              lastValue: defaultValue,
              touched: false,
              dirty: false,
              validateOnOverride: options?.validateOnOverride,
            };

      store.registrations.set(key, registration);
      return registration;
    },
    [store.defaultValues, store.registrations]
  );

  const register = useCallback(
    (
      name: FieldName<TValues>,
      registerOptions?: RegisterOptions
    ): RegisteredFieldProps => {
      const key = name as string;
      const validateOnOverride =
        registerOptions?.validateOn === false
          ? false
          : registerOptions?.validateOn;
      const registration = ensureRegistration(name, { validateOnOverride });

      if (registration.kind !== 'dom') {
        throw new Error(
          `Field "${key}" is controlled. Use form.controller("${key}") instead of register().`
        );
      }

      const cached = store.registerCache.get(key);

      if (cached) {
        const defaultValue = registration.defaultValue;

        if (typeof defaultValue === 'boolean') {
          return {
            name: key,
            ref: cached.ref,
            onBlur: cached.onBlur,
            onChange: cached.onChange,
            defaultChecked: defaultValue,
          };
        }

        return {
          name: key,
          ref: cached.ref,
          onBlur: cached.onBlur,
          onChange: cached.onChange,
          defaultValue: toRegisteredDefaultValue(defaultValue),
        };
      }

      let currentNode: DomElement | null = null;

      const ref = (node: HTMLElement | null) => {
        if (currentNode) {
          registration.elements.delete(currentNode);
        }

        const next =
          node instanceof HTMLInputElement ||
          node instanceof HTMLTextAreaElement ||
          node instanceof HTMLSelectElement
            ? node
            : null;

        currentNode = next;

        if (next) {
          registration.elements.add(next);
        }
      };

      const onBlur = () => {
        const mode = getValidateModeForField(registration);

        if (!registration.touched) {
          registration.touched = true;
          notify();
        }

        if (mode === 'blur') {
          void validate(name);
          return;
        }

        if (mode === 'blur-submit' && store.isSubmitted) {
          void validate(name);
        }
      };

      const onChange = () => {
        const nextValue = readRegistrationValue(registration);
        const dirtyChanged = syncDerivedFlags(registration, nextValue);
        const mode = getValidateModeForField(registration);

        if (dirtyChanged && mode !== 'change') {
          notify();
        }

        if (mode === 'change') {
          void validate(name);
        }
      };

      store.registerCache.set(key, { onBlur, onChange, ref });

      const defaultValue = registration.defaultValue;

      if (typeof defaultValue === 'boolean') {
        return {
          name: key,
          ref,
          onBlur,
          onChange,
          defaultChecked: defaultValue,
        };
      }

      return {
        name: key,
        ref,
        onBlur,
        onChange,
        defaultValue: toRegisteredDefaultValue(defaultValue),
      };
    },
    [
      ensureRegistration,
      getValidateModeForField,
      notify,
      store.isSubmitted,
      store.registerCache,
      syncDerivedFlags,
      validate,
    ]
  );

  const field = useCallback(
    (name: FieldName<TValues>): FieldState<TValues> => {
      const key = name as string;
      const registration = store.registrations.get(key);
      const error = store.errors[key];
      const value = registration
        ? registration.lastValue
        : getIn(store.defaultValues, key);

      return {
        name,
        value,
        error,
        invalid: Boolean(error),
        touched: registration?.touched ?? false,
        dirty: registration?.dirty ?? false,
      };
    },
    [store.defaultValues, store.errors, store.registrations]
  );

  const setValue = useCallback(
    (
      name: FieldName<TValues>,
      value: unknown,
      options: SetValueOptions = {}
    ) => {
      const registration = ensureRegistration(name);

      if (registration.kind === 'controller') {
        registration.value = value;
        registration.lastValue = value;
      } else {
        for (const element of registration.elements) {
          applyValueToDom(element, value);
        }

        registration.lastValue = value;
      }

      if (options.shouldTouch) {
        registration.touched = true;
      }

      if (options.shouldDirty === true) {
        registration.dirty = true;
      } else if (options.shouldDirty === false) {
        registration.dirty = false;
      } else {
        registration.dirty = !valuesEqual(value, registration.defaultValue);
      }

      notify();

      if (options.shouldValidate) {
        void validate(name);
      }
    },
    [ensureRegistration, notify, validate]
  );

  const reset = useCallback(
    (nextValues?: DeepPartial<TValues>) => {
      store.defaultValues = (nextValues ??
        store.initialDefaultValues) as DeepPartial<TValues>;
      store.errors = {};
      store.isSubmitted = false;
      store.submitCount = 0;

      for (const [name, registration] of store.registrations.entries()) {
        const nextDefault = getIn(store.defaultValues, name);
        registration.defaultValue = nextDefault;
        registration.lastValue = nextDefault;
        registration.touched = false;
        registration.dirty = false;

        if (registration.kind === 'controller') {
          registration.value = nextDefault;
        } else {
          for (const element of registration.elements) {
            applyValueToDom(element, nextDefault);
          }
        }
      }

      notify();
    },
    [notify, store]
  );

  const controller = useCallback(
    <TValue = unknown>(
      name: FieldName<TValues>,
      controllerOptions?: ControllerOptions<TValue>
    ): ControlledField<TValues, TValue> => {
      const validateOnOverride = undefined;
      const registration = ensureRegistration(name, {
        kind: 'controller',
        defaultValue: controllerOptions?.defaultValue,
        validateOnOverride,
      }) as ControllerRegistration;

      if (registration.kind !== 'controller') {
        throw new Error(
          `Field "${name as string}" is registered to a DOM input. Use form.register("${name as string}") instead of controller().`
        );
      }

      const key = name as string;
      const error = store.errors[key];
      const mode = getValidateModeForField(registration);

      const setControllerValue = (nextValue: TValue) => {
        registration.value = nextValue;
        registration.lastValue = nextValue;
        registration.dirty = !valuesEqual(nextValue, registration.defaultValue);

        notify();

        if (mode === 'change') {
          void validate(name);
        }
      };

      const onBlur = () => {
        if (!registration.touched) {
          registration.touched = true;
          notify();
        }

        if (mode === 'blur') {
          void validate(name);
          return;
        }

        if (mode === 'blur-submit' && store.isSubmitted) {
          void validate(name);
        }
      };

      return {
        name,
        value: registration.value as TValue,
        setValue: setControllerValue,
        onChange: setControllerValue,
        onBlur,
        error,
        invalid: Boolean(error),
        touched: registration.touched,
        dirty: registration.dirty,
      };
    },
    [
      ensureRegistration,
      getValidateModeForField,
      notify,
      store.errors,
      store.isSubmitted,
      validate,
    ]
  );

  const handleSubmit = useCallback(
    (
      onValid: (
        values: TValues,
        event: FormEvent<HTMLFormElement>
      ) => void | Promise<void>,
      onInvalid?: (errors: FormErrors<TValues>) => void
    ) => {
      return async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        store.isSubmitted = true;
        store.submitCount += 1;
        store.isSubmitting = true;
        notify();

        try {
          const values = (() => {
            const nextValues = cloneDeep(
              store.defaultValues
            ) as unknown as TValues;

            for (const [name, registration] of store.registrations.entries()) {
              const value = readRegistrationValue(registration);
              registration.lastValue = value;
              setIn(nextValues as Record<string, unknown>, name, value);
            }

            const formElement = event.currentTarget;
            const formData = new FormData(formElement);

            for (const [key, entryValue] of formData.entries()) {
              if (store.registrations.has(key)) {
                continue;
              }

              const existing = getIn(
                nextValues as Record<string, unknown>,
                key
              );

              if (existing === undefined) {
                setIn(nextValues as Record<string, unknown>, key, entryValue);
                continue;
              }

              if (Array.isArray(existing)) {
                existing.push(entryValue);
                continue;
              }

              setIn(nextValues as Record<string, unknown>, key, [
                existing,
                entryValue,
              ]);
            }

            return nextValues;
          })();

          const errors = await validateWithValues(store.validators, values);
          store.errors = errors;
          notify();

          const isValid = Object.keys(errors).length === 0;

          if (isValid) {
            await onValid(values, event);
          } else {
            onInvalid?.(errors as FormErrors<TValues>);
          }
        } finally {
          store.isSubmitting = false;
          notify();
        }
      };
    },
    [notify, store]
  );

  const formState = useMemo(() => {
    void version;
    const errors = store.errors as FormErrors<TValues>;
    const touchedFields: Partial<Record<FieldName<TValues>, boolean>> = {};
    const dirtyFields: Partial<Record<FieldName<TValues>, boolean>> = {};

    for (const [name, registration] of store.registrations.entries()) {
      if (registration.touched) {
        touchedFields[name as FieldName<TValues>] = true;
      }

      if (registration.dirty) {
        dirtyFields[name as FieldName<TValues>] = true;
      }
    }

    return {
      isSubmitting: store.isSubmitting,
      isSubmitted: store.isSubmitted,
      isValid: Object.keys(store.errors).length === 0,
      submitCount: store.submitCount,
      errors,
      touchedFields,
      dirtyFields,
    };
  }, [
    store.isSubmitting,
    store.isSubmitted,
    store.submitCount,
    store.errors,
    store.registrations,
    version,
  ]);

  return {
    register,
    controller,
    handleSubmit,
    field,
    getValues,
    setValue,
    reset,
    validate,
    formState,
  };
}
