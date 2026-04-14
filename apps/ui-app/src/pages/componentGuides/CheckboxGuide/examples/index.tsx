import { Checkbox } from '@themeshift/ui/components/Checkbox';
import { Field } from '@themeshift/ui/components/Field';

import { ResponsiveStackInline } from '../../components';

export const basicUsage = {
  code: `<label htmlFor="updates">
  Receive updates
  <Checkbox id="updates" name="updates" />
</label>`,
  label: 'Basic usage',
  sample: (
    <label
      htmlFor="updates"
      style={{ alignItems: 'center', display: 'inline-flex', gap: '0.5rem' }}
    >
      Receive updates
      <Checkbox id="updates" name="updates" />
    </label>
  ),
};

export const withFieldInline = {
  code: `<Field layout="inline-control">
  <Checkbox name="notifications" />
  <Field.Label>Enable notifications</Field.Label>
</Field>`,
  label: 'With Field',
  sample: (
    <Field layout="inline-control">
      <Checkbox name="notifications" />
      <Field.Label>Enable notifications</Field.Label>
    </Field>
  ),
};

export const withDescriptionAndError = {
  code: `<Field align="start" layout="inline-control" validationState="invalid">
  <Checkbox name="terms" required />
  <div>
    <Field.Label>I agree to the terms</Field.Label>
    <Field.Description>
      You must accept the agreement before continuing.
    </Field.Description>
    <Field.Error>You must accept the terms to continue.</Field.Error>
  </div>
</Field>`,
  label: 'Description and error',
  sample: (
    <Field align="start" layout="inline-control" validationState="invalid">
      <Checkbox name="terms" required />
      <div>
        <Field.Label>I agree to the terms</Field.Label>
        <Field.Description>
          You must accept the agreement before continuing.
        </Field.Description>
        <Field.Error>You must accept the terms to continue.</Field.Error>
      </div>
    </Field>
  ),
};

export const indeterminate = {
  code: `<Checkbox aria-label="Partially selected" indeterminate />`,
  label: 'Indeterminate',
  sample: <Checkbox aria-label="Partially selected" indeterminate />,
};

export const validationStates = {
  code: `<>
  <Checkbox aria-label="Default state" />
  <Checkbox aria-label="Invalid state" validationState="invalid" />
  <Checkbox aria-label="Valid state" validationState="valid" />
  <Checkbox aria-label="Warning state" validationState="warning" />
</>`,
  label: 'Validation states',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Checkbox aria-label="Default state" />
      <Checkbox aria-label="Invalid state" validationState="invalid" />
      <Checkbox aria-label="Valid state" validationState="valid" />
      <Checkbox aria-label="Warning state" validationState="warning" />
    </ResponsiveStackInline>
  ),
};

export const disabled = {
  code: `<>
  <Checkbox aria-label="Disabled" disabled />
  <Checkbox aria-label="Disabled checked" defaultChecked disabled />
</>`,
  label: 'Disabled',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Checkbox aria-label="Disabled" disabled />
      <Checkbox aria-label="Disabled checked" defaultChecked disabled />
    </ResponsiveStackInline>
  ),
};

export const sizes = {
  code: `<>
  <Checkbox aria-label="Small" size="small" />
  <Checkbox aria-label="Medium" />
  <Checkbox aria-label="Large" size="large" />
</>`,
  label: 'Sizes',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Checkbox aria-label="Small" size="small" />
      <Checkbox aria-label="Medium" />
      <Checkbox aria-label="Large" size="large" />
    </ResponsiveStackInline>
  ),
};

export const propHighlights = [
  basicUsage,
  withFieldInline,
  withDescriptionAndError,
  indeterminate,
  validationStates,
];
