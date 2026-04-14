import { Field } from '@themeshift/ui/components/Field';
import { Select } from '@themeshift/ui/components/Select';
import { IconSelectChevron } from '@themeshift/ui/icons';

import { ResponsiveStackInline } from '../../components';

export const basicUsage = {
  code: `<Select aria-label="Country" placeholder="Choose a country" defaultValue="">
  <option value="ca">Canada</option>
  <option value="us">United States</option>
</Select>`,
  label: 'Basic usage',
  sample: (
    <Select aria-label="Country" placeholder="Choose a country" defaultValue="">
      <option value="ca">Canada</option>
      <option value="us">United States</option>
    </Select>
  ),
};

export const withOptions = {
  code: `<Select
  aria-label="Country"
  options={[
    { label: 'Canada', value: 'ca' },
    { label: 'United States', value: 'us' },
    { label: 'Mexico', value: 'mx' },
  ]}
/>`,
  label: 'Options prop',
  sample: (
    <Select
      aria-label="Country"
      options={[
        { label: 'Canada', value: 'ca' },
        { label: 'United States', value: 'us' },
        { label: 'Mexico', value: 'mx' },
      ]}
    />
  ),
};

export const withPlaceholder = {
  code: `<Select
  aria-label="Country"
  defaultValue=""
  placeholder="Choose a country"
  options={[
    { label: 'Canada', value: 'ca' },
    { label: 'United States', value: 'us' },
  ]}
/>`,
  label: 'Placeholder',
  sample: (
    <Select
      aria-label="Country"
      defaultValue=""
      options={[
        { label: 'Canada', value: 'ca' },
        { label: 'United States', value: 'us' },
      ]}
      placeholder="Choose a country"
    />
  ),
};

export const sizes = {
  code: `<>
  <Select aria-label="Small" size="small" />
  <Select aria-label="Medium" />
  <Select aria-label="Large" size="large" />
</>`,
  label: 'Sizes',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Select aria-label="Small" size="small" />
      <Select aria-label="Medium" />
      <Select aria-label="Large" size="large" />
    </ResponsiveStackInline>
  ),
};

export const validationStates = {
  code: `<>
  <Select aria-label="Default state" />
  <Select aria-label="Invalid state" validationState="invalid" />
  <Select aria-label="Valid state" validationState="valid" />
  <Select aria-label="Warning state" validationState="warning" />
</>`,
  label: 'Validation states',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Select aria-label="Default state" />
      <Select aria-label="Invalid state" validationState="invalid" />
      <Select aria-label="Valid state" validationState="valid" />
      <Select aria-label="Warning state" validationState="warning" />
    </ResponsiveStackInline>
  ),
};

export const disabled = {
  code: `<>
  <Select aria-label="Disabled select" disabled />
  <Select
    aria-label="Disabled invalid"
    disabled
    validationState="invalid"
  />
</>`,
  label: 'Disabled',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Select aria-label="Disabled select" disabled />
      <Select
        aria-label="Disabled invalid"
        disabled
        validationState="invalid"
      />
    </ResponsiveStackInline>
  ),
};

export const customChevron = {
  code: `<Select
  aria-label="Custom chevron"
  chevronIcon={<IconSelectChevron aria-hidden style={{ transform: 'scaleX(-1)' }} />}
/>`,
  label: 'Custom chevron',
  sample: (
    <Select
      aria-label="Custom chevron"
      chevronIcon={
        <IconSelectChevron aria-hidden style={{ transform: 'scaleX(-1)' }} />
      }
    />
  ),
};

export const withField = {
  code: `<Field
  description="Select your country of residence."
  error="Please choose a country."
  label="Country"
  validationState="invalid"
>
  <Select defaultValue="" name="country" placeholder="Choose a country">
    <option value="ca">Canada</option>
    <option value="us">United States</option>
  </Select>
</Field>`,
  label: 'With Field',
  sample: (
    <Field
      description="Select your country of residence."
      error="Please choose a country."
      label="Country"
      validationState="invalid"
    >
      <Select defaultValue="" name="country" placeholder="Choose a country">
        <option value="ca">Canada</option>
        <option value="us">United States</option>
      </Select>
    </Field>
  ),
};

export const propHighlights = [
  basicUsage,
  withOptions,
  withPlaceholder,
  validationStates,
  withField,
];
