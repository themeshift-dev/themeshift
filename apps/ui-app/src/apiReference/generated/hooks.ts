import type { ApiReferenceHook } from '../types';

export const hooks = [
  {
    apiReference: [
      {
        comments:
          'Specifies the amount of time, in milliseconds, before the\n`wasCopied` flag returns to false after a successful copy.',
        defaultValue: 2000,
        displayName: 'useCopyToClipboard',
        propName: 'clearDelay',
        type: 'number',
        values: [],
      },
    ],
    returnReference: [
      {
        comments:
          '`true` after a successful copy, then resets to `false` after `clearDelay`.\n\nUse this flag to render transient success feedback.',
        defaultValue: null,
        displayName: 'useCopyToClipboard',
        propName: 'wasCopied',
        type: 'boolean',
        values: [],
      },
      {
        comments:
          'Copies text to the clipboard.\n\nResolves to `true` when the copy succeeds and `false` when it fails or\nclipboard APIs are unavailable.',
        defaultValue: null,
        displayName: 'useCopyToClipboard',
        propName: 'copy',
        type: 'CopyFn',
        values: [],
      },
    ],
    name: 'useCopyToClipboard',
    exportName: 'useCopyToClipboard',
    importPath: '@themeshift/ui/hooks/useCopyToClipboard',
    importString:
      "import { useCopyToClipboard } from '@themeshift/ui/hooks/useCopyToClipboard';",
    meta: {
      category: 'actions',
      description:
        'Copies text to the clipboard and provides a transient `wasCopied` flag.',
      tags: ['clipboard', 'copy'],
      status: 'stable',
      type: 'hook',
    },
    slug: 'usecopytoclipboard',
    routeSlug: 'use-copy-to-clipboard',
    sourceCodeUrl:
      'https://github.com/themeshift-dev/themeshift/tree/develop/packages/ui/src/hooks/useCopyToClipboard',
    type: 'hook',
  },
  {
    apiReference: [
      {
        comments:
          'Default values for the form.\n\nThese values are applied to registered DOM fields (via Field-aware\ncontrols) and controller fields.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'defaultValues',
        type: 'DeepPartial<TValues>',
        values: [],
      },
      {
        comments:
          'Optional map of field validators.\n\nEach validator can be sync or async and should return a string error\nmessage (or `undefined` when valid).',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'validate',
        type: 'Partial<Record<FieldName<TValues>, FieldValidator<any, TValues>>>',
        values: [],
      },
      {
        comments:
          'Controls when validation runs.\n\n- `submit`: validate on submit (default)\n- `blur`: validate when a field blurs\n- `change`: validate on each change\n- `blur-submit`: validate on blur, but only after the first submit attempt',
        defaultValue: 'submit',
        displayName: 'useForm',
        propName: 'validateOn',
        type: '"submit" | "blur" | "change" | "blur-submit"',
        values: ['submit', 'blur', 'change', 'blur-submit'],
      },
    ],
    returnReference: [
      {
        comments:
          'Creates a controlled adapter for non-standard or fully controlled inputs.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'controller',
        type: '<TValue = unknown>(name: FieldName<TValues>, options?: ControllerOptions<TValue>) => ControlledField<TValues, TValue>',
        values: [],
      },
      {
        comments: 'Returns live state for a single field.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'field',
        type: '(name: FieldName<TValues>) => FieldState<TValues>',
        values: [],
      },
      {
        comments: 'Aggregate state for the form.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'formState',
        type: 'object',
        values: [],
      },
      {
        comments: 'Tracks which fields differ from their default values.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'formState.dirtyFields',
        type: 'Partial<Record<FieldName<TValues>, boolean>>',
        values: [],
      },
      {
        comments: 'Current error messages keyed by field name.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'formState.errors',
        type: 'FormErrors<TValues>',
        values: [],
      },
      {
        comments: '`true` after at least one submit attempt.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'formState.isSubmitted',
        type: 'boolean',
        values: [],
      },
      {
        comments: '`true` while an async submit handler is running.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'formState.isSubmitting',
        type: 'boolean',
        values: [],
      },
      {
        comments: '`true` when there are no current validation errors.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'formState.isValid',
        type: 'boolean',
        values: [],
      },
      {
        comments: 'Total number of submit attempts.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'formState.submitCount',
        type: 'number',
        values: [],
      },
      {
        comments: 'Tracks which fields have been blurred/interacted with.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'formState.touchedFields',
        type: 'Partial<Record<FieldName<TValues>, boolean>>',
        values: [],
      },
      {
        comments: 'Returns a snapshot of current form values.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'getValues',
        type: '() => TValues',
        values: [],
      },
      {
        comments:
          'Creates a submit handler that validates first and then calls your\nsuccess/error callbacks.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'handleSubmit',
        type: '(onValid: (values: TValues, event: FormEvent<HTMLFormElement>) => void | Promise<void>, onInvalid?: (errors: FormErrors<TValues>) => void) => (event: FormEvent<HTMLFormElement>) => void | Promise<void>',
        values: [],
      },
      {
        comments:
          'Registers a DOM-backed field and returns props for the input element.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'register',
        type: '(name: FieldName<TValues>, options?: RegisterOptions) => RegisteredFieldProps',
        values: [],
      },
      {
        comments:
          'Resets values and form state back to defaults (or provided next values).',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'reset',
        type: '(nextValues?: DeepPartial<TValues>) => void',
        values: [],
      },
      {
        comments:
          'Sets a field value and optionally marks the field dirty/touched or triggers\nvalidation.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'setValue',
        type: '(name: FieldName<TValues>, value: unknown, options?: SetValueOptions) => void',
        values: [],
      },
      {
        comments:
          'Runs validation for one field or the full form and resolves with the\nvalidity result.',
        defaultValue: null,
        displayName: 'useForm',
        propName: 'validate',
        type: '(name?: FieldName<TValues>) => Promise<boolean>',
        values: [],
      },
    ],
    name: 'useForm',
    exportName: 'useForm',
    importPath: '@themeshift/ui/hooks/useForm',
    importString: "import { useForm } from '@themeshift/ui/hooks/useForm';",
    meta: {
      category: 'inputs-forms',
      description:
        'A small uncontrolled-first form hook with Field integration and optional controlled adapters.',
      tags: ['form', 'validation'],
      status: 'experimental',
      type: 'hook',
    },
    slug: 'useform',
    routeSlug: 'use-form',
    sourceCodeUrl:
      'https://github.com/themeshift-dev/themeshift/tree/develop/packages/ui/src/hooks/useForm',
    type: 'hook',
  },
] satisfies ApiReferenceHook[];
