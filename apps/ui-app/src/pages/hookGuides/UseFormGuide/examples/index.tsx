import {
  BasicUsageDemo,
  ControllerDemo,
  EmailFormDemo,
  ProgrammaticFormApiDemo,
  RegisterOptionsDemo,
  SubmitLifecycleDemo,
  TargetedValidationDemo,
} from './demos';

export const basicUsage = {
  code: `import { Button } from '@themeshift/ui/components/Button';
import { Input } from '@themeshift/ui/components/Input';
import { Label } from '@themeshift/ui/components/Label';

export const BasicUsageDemo = () => {
  const form = useForm<{ name: string }>({
    defaultValues: { name: '' },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        console.log('useForm submit', values);
      })}
    >
      <Label htmlFor="userName">Enter your name</Label>
      <Input {...form.register('name')} id="userName" />

      <Button isBusy={form.formState.isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
};
`,
  label: 'Basic usage',
  sample: <BasicUsageDemo />,
};

export const fieldUsage = {
  code: `import { useForm } from '@themeshift/ui/hooks/useForm';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { Button } from '@themeshift/ui/components/Button';

type Values = { email: string };

export const EmailForm = () => {
  const form = useForm<Values>({
    validate: {
      email: (value) => (!value ? 'Email is required.' : undefined),
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        console.log('useForm submit', values);
      })}
    >
      <Field form={form} name="email">
        <Field.Label>Email</Field.Label>
        {/* Note: this Input auto-registers through Field context */}
        <Input aria-label="Email" placeholder="you@example.com" />
        <Field.Error />
      </Field>

      <Button type="submit">Submit</Button>
    </form>
  );
};`,
  label: 'Field usage',
  sample: <EmailFormDemo key="validate-on-submit" />,
};

export const validateOnBlur = {
  code: `import { useForm } from '@themeshift/ui/hooks/useForm';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { Button } from '@themeshift/ui/components/Button';

export const EmailForm = () => {
  const form = useForm<{ email: string }>({
    validateOn: 'blur',
    validate: {
      email: (value) => (!value ? 'Email is required.' : undefined),
    },
  });

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <Field form={form} name="email">
        <Field.Label>Email</Field.Label>
        <Input aria-label="Email" placeholder="you@example.com" />
        <Field.Error />
      </Field>

      <Button type="submit">Submit</Button>
    </form>
  );
};`,
  label: 'Validate on blur',
  sample: <EmailFormDemo key="validate-on-blur" validateOn="blur" />,
};

export const controllerPattern = {
  code: `import { useForm } from '@themeshift/ui/hooks/useForm';
import { Field } from '@themeshift/ui/components/Field';
import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';
import { Button } from '@themeshift/ui/components/Button';

export const SettingsForm = () => {
  const form = useForm<{ emailUpdates: boolean }>();
  const emailUpdates = form.controller<boolean>('emailUpdates', {
    defaultValue: false,
  });

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
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
};`,
  label: 'Controller adapter',
  sample: <ControllerDemo />,
};

export const registerOptions = {
  code: `import { useForm } from '@themeshift/ui/hooks/useForm';
import { Button } from '@themeshift/ui/components/Button';

type Values = { email: string; nickname: string };

export const RegisterOptionsForm = () => {
  const form = useForm<Values>({
    validateOn: 'submit',
    validate: {
      email: (value) => {
        if (!value) return 'Email is required.';
        return String(value).includes('@') ? undefined : 'Enter a valid email.';
      },
      nickname: (value) =>
        value ? undefined : 'Nickname is required on submit.',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <input
        type="email"
        placeholder="you@example.com"
        {...form.register('email', { validateOn: 'change' })}
      />
      <p>{form.field('email').error}</p>

      <input type="text" placeholder="Ada" {...form.register('nickname')} />
      <p>{form.field('nickname').error}</p>

      <Button type="submit">Submit</Button>
    </form>
  );
};`,
  label: 'Register options',
  sample: <RegisterOptionsDemo />,
};

export const formApiActions = {
  code: `import { useForm } from '@themeshift/ui/hooks/useForm';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { Button } from '@themeshift/ui/components/Button';

type Values = { firstName: string; lastName: string };

export const FormApiActions = () => {
  const form = useForm<Values>({
    defaultValues: { firstName: '', lastName: '' },
  });

  const values = form.getValues();

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <Field form={form} name="firstName">
        <Field.Label>First name</Field.Label>
        <Input />
      </Field>

      <Field form={form} name="lastName">
        <Field.Label>Last name</Field.Label>
        <Input />
      </Field>

      <Button
        type="button"
        onClick={() => {
          form.setValue('firstName', 'Ada', { shouldDirty: true });
          form.setValue('lastName', 'Lovelace', { shouldDirty: true });
        }}
      >
        Set values
      </Button>
      <Button type="button" intent="secondary" onClick={() => form.reset()}>
        Reset
      </Button>

      <p>Current values: {values.firstName} {values.lastName}</p>
      <p>Dirty fields: {Object.keys(form.formState.dirtyFields).join(', ')}</p>
    </form>
  );
};`,
  label: 'Programmatic form API',
  sample: <ProgrammaticFormApiDemo />,
};

export const targetedValidation = {
  code: `import { useForm } from '@themeshift/ui/hooks/useForm';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { Button } from '@themeshift/ui/components/Button';

type Values = { email: string; team: string };

export const TargetedValidation = () => {
  const form = useForm<Values>({
    validate: {
      email: (value) => {
        if (!value) return 'Email is required.';
        return String(value).includes('@') ? undefined : 'Enter a valid email.';
      },
      team: (value) => (value ? undefined : 'Team name is required.'),
    },
  });

  const emailState = form.field('email');

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <Field form={form} name="email">
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error />
      </Field>

      <Field form={form} name="team">
        <Field.Label>Team</Field.Label>
        <Input />
        <Field.Error />
      </Field>

      <Button type="button" intent="secondary" onClick={() => form.validate('email')}>
        Validate email only
      </Button>
      <Button type="submit">Submit all</Button>

      <p>
        Email state: touched={String(emailState.touched)}, dirty={String(
          emailState.dirty
        )}, invalid={String(emailState.invalid)}
      </p>
    </form>
  );
};`,
  label: 'Targeted validation',
  sample: <TargetedValidationDemo />,
};

export const submitLifecycle = {
  code: `import { useForm } from '@themeshift/ui/hooks/useForm';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { Button } from '@themeshift/ui/components/Button';

export const SubmitLifecycle = () => {
  const form = useForm<{ email: string }>({
    validate: {
      email: (value) => {
        if (!value) return 'Email is required.';
        return String(value).includes('@') ? undefined : 'Enter a valid email.';
      },
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(
        (values) => {
          console.log('valid submit', values);
        },
        (errors) => {
          console.log('invalid submit', errors);
        }
      )}
    >
      <Field form={form} name="email">
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error />
      </Field>

      <Button isBusy={form.formState.isSubmitting} type="submit">
        Submit
      </Button>

      <p>submitCount: {form.formState.submitCount}</p>
      <p>isSubmitted: {String(form.formState.isSubmitted)}</p>
      <p>isValid: {String(form.formState.isValid)}</p>
      <p>error keys: {Object.keys(form.formState.errors).join(', ')}</p>
    </form>
  );
};`,
  label: 'Submit lifecycle',
  sample: <SubmitLifecycleDemo />,
};

export const commonUseCases = [
  basicUsage,
  fieldUsage,
  validateOnBlur,
  controllerPattern,
];
