import { ErrorMessage } from '@themeshift/ui/components/ErrorMessage';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';

export const basicUsage = {
  code: '<ErrorMessage>Please enter a valid email address.</ErrorMessage>',
  label: 'Basic usage',
  sample: <ErrorMessage>Please enter a valid email address.</ErrorMessage>,
};

export const withField = {
  code: `<Field validationState="invalid">
  <Field.Label>Email address</Field.Label>
  <Input aria-describedby="email-error" placeholder="you@example.com" />
  <ErrorMessage id="email-error">Email address is required.</ErrorMessage>
</Field>`,
  label: 'With Field',
  sample: (
    <Field validationState="invalid">
      <Field.Label>Email address</Field.Label>
      <Input aria-describedby="email-error" placeholder="you@example.com" />
      <ErrorMessage id="email-error">Email address is required.</ErrorMessage>
    </Field>
  ),
};

export const assertiveAndPolite = {
  code: `<ErrorMessage>Unable to save your changes.</ErrorMessage>
<ErrorMessage role="status">Checking username availability...</ErrorMessage>`,
  label: 'Alert and status roles',
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <ErrorMessage>Unable to save your changes.</ErrorMessage>
      <ErrorMessage role="status">
        Checking username availability...
      </ErrorMessage>
    </div>
  ),
};

export const longForm = {
  code: `<ErrorMessage>
  Password must include at least 12 characters, one number, and one symbol.
</ErrorMessage>`,
  label: 'Long-form message',
  sample: (
    <ErrorMessage>
      Password must include at least 12 characters, one number, and one symbol.
    </ErrorMessage>
  ),
};

export const propHighlights = [basicUsage, withField, assertiveAndPolite];
