import { useState } from 'react';
import { Button } from '@themeshift/ui/components/Button';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { Label } from '@themeshift/ui/components/Label';
import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';
import { useForm } from '@themeshift/ui/hooks/useForm';

export const BasicUsageDemo = () => {
  const form = useForm<{ name: string }>({
    defaultValues: { name: '' },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        console.log('useForm submit', values);
      })}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: '28rem' }}
    >
      <Label htmlFor="userName">Enter your name</Label>
      <Input {...form.register('name')} id="userName" />

      <Button isBusy={form.formState.isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
};

export const EmailFormDemo = ({
  validateOn,
}: {
  validateOn?: 'submit' | 'blur';
}) => {
  const [submittedValues, setSubmittedValues] = useState<{
    email: string;
  } | null>(null);
  const form = useForm<{ email: string }>({
    defaultValues: { email: '' },
    validate: {
      email: (value) => {
        if (!value) {
          return 'Email is required.';
        }

        if (!String(value).includes('@')) {
          return 'Enter a valid email.';
        }

        return undefined;
      },
    },
    validateOn: validateOn ?? 'submit',
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        console.log('useForm submit', values);
        setSubmittedValues(values);
      })}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: '28rem' }}
    >
      <Field form={form} name="email">
        <Field.Label>Email</Field.Label>
        <Input aria-label="Email" placeholder="you@example.com" />
        <Field.Error />
      </Field>

      <Button isBusy={form.formState.isSubmitting} type="submit">
        Submit
      </Button>

      {submittedValues ? (
        <p style={{ margin: 0 }}>
          <strong>Submitted:</strong> {submittedValues.email}
        </p>
      ) : null}
    </form>
  );
};

export const ControllerDemo = () => {
  const form = useForm<{ emailUpdates: boolean }>({
    defaultValues: { emailUpdates: false },
    validate: {
      emailUpdates: (value) =>
        value ? undefined : 'Enable updates so we can send onboarding tips.',
    },
  });

  const emailUpdates = form.controller<boolean>('emailUpdates', {
    defaultValue: false,
  });

  return (
    <form
      onSubmit={form.handleSubmit(() => {
        // demo only
      })}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: '28rem' }}
    >
      <Field form={form} name="emailUpdates" layout="inline-control">
        <ToggleSwitch
          aria-label="Email updates"
          checked={emailUpdates.value}
          onBlur={emailUpdates.onBlur}
          onCheckedChange={emailUpdates.onChange}
        />
        <Field.Label>Email me product updates</Field.Label>
        <Field.Error />
      </Field>

      <Button type="submit">Continue</Button>
    </form>
  );
};

export const RegisterOptionsDemo = () => {
  const form = useForm<{ email: string; nickname: string }>({
    defaultValues: { email: '', nickname: '' },
    validate: {
      email: (value) => {
        if (!value) {
          return 'Email is required.';
        }

        if (!String(value).includes('@')) {
          return 'Enter a valid email.';
        }

        return undefined;
      },
      nickname: (value) =>
        value ? undefined : 'Nickname is required on submit.',
    },
    validateOn: 'submit',
  });

  return (
    <form
      onSubmit={form.handleSubmit(() => {
        // demo only
      })}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: '28rem' }}
    >
      <label style={{ display: 'grid', gap: '0.35rem' }}>
        <span>Email (validates on change)</span>
        <input
          aria-label="Email (validate on change)"
          placeholder="you@example.com"
          style={{ padding: '0.5rem 0.65rem' }}
          type="email"
          {...form.register('email', { validateOn: 'change' })}
        />
      </label>
      <p style={{ margin: 0, minHeight: '1.25rem' }}>
        {form.field('email').error ?? ''}
      </p>

      <label style={{ display: 'grid', gap: '0.35rem' }}>
        <span>Nickname (validates on submit)</span>
        <input
          aria-label="Nickname"
          placeholder="Ada"
          style={{ padding: '0.5rem 0.65rem' }}
          type="text"
          {...form.register('nickname')}
        />
      </label>
      <p style={{ margin: 0, minHeight: '1.25rem' }}>
        {form.field('nickname').error ?? ''}
      </p>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export const ProgrammaticFormApiDemo = () => {
  const form = useForm<{ firstName: string; lastName: string }>({
    defaultValues: { firstName: '', lastName: '' },
  });

  const values = form.getValues();

  return (
    <form
      onSubmit={form.handleSubmit(() => {
        // demo only
      })}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: '28rem' }}
    >
      <Field form={form} name="firstName">
        <Field.Label>First name</Field.Label>
        <Input aria-label="First name" placeholder="Ada" />
        <Field.Error />
      </Field>

      <Field form={form} name="lastName">
        <Field.Label>Last name</Field.Label>
        <Input aria-label="Last name" placeholder="Lovelace" />
        <Field.Error />
      </Field>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Button
          onClick={() => {
            form.setValue('firstName', 'Ada', { shouldDirty: true });
            form.setValue('lastName', 'Lovelace', { shouldDirty: true });
          }}
          type="button"
        >
          Set values
        </Button>

        <Button
          intent="secondary"
          onClick={() => {
            form.reset();
          }}
          type="button"
        >
          Reset
        </Button>
      </div>

      <p style={{ margin: 0 }}>
        <strong>Current values:</strong> {values.firstName || '(empty)'}{' '}
        {values.lastName || ''}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Dirty fields:</strong>{' '}
        {Object.keys(form.formState.dirtyFields).join(', ') || '(none)'}
      </p>
    </form>
  );
};

export const TargetedValidationDemo = () => {
  const [validationResult, setValidationResult] = useState<string>('');
  const form = useForm<{ email: string; team: string }>({
    defaultValues: { email: '', team: '' },
    validate: {
      email: (value) => {
        if (!value) {
          return 'Email is required.';
        }

        return String(value).includes('@') ? undefined : 'Enter a valid email.';
      },
      team: (value) => (value ? undefined : 'Team name is required.'),
    },
  });

  const emailState = form.field('email');

  return (
    <form
      onSubmit={form.handleSubmit(() => {
        // demo only
      })}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: '28rem' }}
    >
      <Field form={form} name="email">
        <Field.Label>Email</Field.Label>
        <Input aria-label="Email for targeted validation" />
        <Field.Error />
      </Field>

      <Field form={form} name="team">
        <Field.Label>Team</Field.Label>
        <Input aria-label="Team" />
        <Field.Error />
      </Field>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Button
          intent="secondary"
          onClick={async () => {
            const isEmailValid = await form.validate('email');
            setValidationResult(
              isEmailValid
                ? 'Email looks valid.'
                : 'Email has validation errors.'
            );
          }}
          type="button"
        >
          Validate email only
        </Button>

        <Button type="submit">Submit all</Button>
      </div>

      <p style={{ margin: 0 }}>
        <strong>Email state:</strong> touched={String(emailState.touched)},
        dirty={String(emailState.dirty)}, invalid={String(emailState.invalid)}
      </p>
      {validationResult ? (
        <p style={{ margin: 0 }}>
          <strong>Last check:</strong> {validationResult}
        </p>
      ) : null}
    </form>
  );
};

export const SubmitLifecycleDemo = () => {
  const [statusMessage, setStatusMessage] = useState<string>('');
  const form = useForm<{ email: string }>({
    defaultValues: { email: '' },
    validate: {
      email: (value) => {
        if (!value) {
          return 'Email is required.';
        }

        if (!String(value).includes('@')) {
          return 'Enter a valid email.';
        }

        return undefined;
      },
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(
        (values) => {
          setStatusMessage(`Submitted: ${values.email}`);
        },
        (errors) => {
          setStatusMessage(
            `Invalid submit (${Object.keys(errors).length} error${Object.keys(errors).length === 1 ? '' : 's'})`
          );
        }
      )}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: '28rem' }}
    >
      <Field form={form} name="email">
        <Field.Label>Email</Field.Label>
        <Input aria-label="Lifecycle email" placeholder="you@example.com" />
        <Field.Error />
      </Field>

      <Button isBusy={form.formState.isSubmitting} type="submit">
        Submit
      </Button>

      <p style={{ margin: 0 }}>
        <strong>submitCount:</strong> {form.formState.submitCount}
      </p>
      <p style={{ margin: 0 }}>
        <strong>isSubmitted:</strong> {String(form.formState.isSubmitted)}
      </p>
      <p style={{ margin: 0 }}>
        <strong>isValid:</strong> {String(form.formState.isValid)}
      </p>
      <p style={{ margin: 0 }}>
        <strong>error keys:</strong>{' '}
        {Object.keys(form.formState.errors).join(', ') || '(none)'}
      </p>
      {statusMessage ? (
        <p style={{ margin: 0 }}>
          <strong>Last submit:</strong> {statusMessage}
        </p>
      ) : null}
    </form>
  );
};
