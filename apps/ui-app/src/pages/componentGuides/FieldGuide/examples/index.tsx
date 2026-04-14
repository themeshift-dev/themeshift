import { Checkbox } from '@themeshift/ui/components/Checkbox';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { Textarea } from '@themeshift/ui/components/Textarea';

import { Stack } from '@/app/components';

import { ResponsiveStackInline } from '../../components';

export const basicUsage = {
  code: `<Field label="Email address" required>
  <Input placeholder="you@example.com" type="email" />
</Field>`,
  label: 'Basic usage',
  sample: (
    <Field label="Email address" required>
      <Input placeholder="you@example.com" type="email" />
    </Field>
  ),
};

export const shorthandContent = {
  code: `<Field
  description="We'll only use this for account updates."
  label="Email address"
>
  <Input placeholder="you@example.com" type="email" />
</Field>`,
  label: 'Shorthand content',
  sample: (
    <Field
      description="We'll only use this for account updates."
      label="Email address"
    >
      <Input placeholder="you@example.com" type="email" />
    </Field>
  ),
};

export const composableContent = {
  code: `<Field required validationState="invalid">
  <Field.Label>Email address</Field.Label>
  <Input placeholder="you@example.com" type="email" />
  <Field.Description>Use your work email for notifications.</Field.Description>
  <Field.Error>Please enter a valid email address.</Field.Error>
</Field>`,
  label: 'Composable content',
  sample: (
    <Field required validationState="invalid">
      <Field.Label>Email address</Field.Label>
      <Input placeholder="you@example.com" type="email" />
      <Field.Description>
        Use your work email for notifications.
      </Field.Description>
      <Field.Error>Please enter a valid email address.</Field.Error>
    </Field>
  ),
};

export const optionalAndRequired = {
  code: `<>
  <Field label="Project name" required>
    <Input placeholder="ThemeShift UI" />
  </Field>
  <Field label="Company" optional>
    <Input placeholder="Optional" />
  </Field>
</>`,
  label: 'Required and optional',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'start', justify: 'center', wrap: true }}
      stackProps={{ align: 'stretch' }}
    >
      <Field label="Project name" required>
        <Input placeholder="ThemeShift UI" />
      </Field>
      <Field label="Company" optional>
        <Input placeholder="Optional" />
      </Field>
    </ResponsiveStackInline>
  ),
};

export const withTextarea = {
  code: `<Field
  description="Keep this short and clear for your team."
  label="Project summary"
>
  <Textarea minRows={3} placeholder="Summarize your project..." resize="auto" />
</Field>`,
  label: 'With Textarea',
  sample: (
    <Field
      description="Keep this short and clear for your team."
      label="Project summary"
    >
      <Textarea
        minRows={3}
        placeholder="Summarize your project..."
        resize="auto"
      />
    </Field>
  ),
};

export const sharedState = {
  code: `<Stack>
  <Field disabled label="Disabled by Field">
    <Input placeholder="Disabled" />
  </Field>
  <Field label="Read only by Field" readOnly>
    <Input defaultValue="Read only value" />
  </Field>
</Stack>`,
  label: 'Shared state',
  sample: (
    <Stack>
      <Field disabled label="Disabled by Field">
        <Input placeholder="Disabled" />
      </Field>
      <Field label="Read only by Field" readOnly>
        <Input defaultValue="Read only value" />
      </Field>
    </Stack>
  ),
};

export const hideLabel = {
  code: `<Field hideLabel label="Search">
  <Input placeholder="Search docs" />
</Field>`,
  label: 'Visually hidden label',
  sample: (
    <Field hideLabel label="Search">
      <Input placeholder="Search docs" />
    </Field>
  ),
};

export const inlineControlShorthand = {
  code: `<Field
  description="We'll email you about important updates."
  label="Enable notifications"
  layout="inline-control"
>
  <Checkbox name="notifications" />
</Field>`,
  label: 'Inline control (shorthand)',
  sample: (
    <Field
      description="We'll email you about important updates."
      label="Enable notifications"
      layout="inline-control"
    >
      <Checkbox name="notifications" />
    </Field>
  ),
};

export const inlineControlComposable = {
  code: `<Field align="start" layout="inline-control" validationState="invalid">
  <Checkbox name="terms" required />
  <div>
    <Field.Label>I agree to the terms</Field.Label>
    <Field.Error>You must accept the terms to continue.</Field.Error>
  </div>
</Field>`,
  label: 'Inline control (composable)',
  sample: (
    <Field align="start" layout="inline-control" validationState="invalid">
      <Checkbox name="terms" required />
      <div>
        <Field.Label>I agree to the terms</Field.Label>
        <Field.Error>You must accept the terms to continue.</Field.Error>
      </div>
    </Field>
  ),
};

export const propHighlights = [
  basicUsage,
  shorthandContent,
  composableContent,
  inlineControlShorthand,
  withTextarea,
  sharedState,
];
