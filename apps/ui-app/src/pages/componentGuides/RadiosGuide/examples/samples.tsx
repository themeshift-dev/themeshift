import { Field } from '@themeshift/ui/components/Field';
import { Radio } from '@themeshift/ui/components/Radio';
import { useId } from 'react';

import { ResponsiveStackInline } from '../../components';

function useUniqueName(base: string) {
  const reactId = useId();

  return `${base}-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export const BasicUsageSample = () => {
  const name = useUniqueName('contactMethod');

  return (
    <Radio.Group defaultValue="email" name={name}>
      <legend>Preferred contact method</legend>
      <Radio value="email">Email</Radio>
      <Radio value="phone">Phone</Radio>
      <Radio value="sms">SMS</Radio>
    </Radio.Group>
  );
};

export const WithFieldSample = () => {
  const name = useUniqueName('contactMethod');

  return (
    <Field required validationState="invalid">
      <Radio.Group name={name}>
        <Field.Label as="legend">Preferred contact method</Field.Label>

        <Radio value="email">Email</Radio>
        <Radio value="phone">Phone</Radio>
        <Radio value="sms">SMS</Radio>

        <Field.Description>
          Choose how you&apos;d like us to contact you.
        </Field.Description>
        <Field.Error>Please select a contact method.</Field.Error>
      </Radio.Group>
    </Field>
  );
};

export const UncontrolledSample = () => {
  const name = useUniqueName('size');

  return (
    <Radio.Group defaultValue="m" name={name}>
      <legend>Size</legend>
      <Radio value="s">Small</Radio>
      <Radio value="m">Medium</Radio>
      <Radio value="l">Large</Radio>
    </Radio.Group>
  );
};

export const DisabledSample = () => {
  const billingCycleName = useUniqueName('billingCycle');
  const newsletterName = useUniqueName('newsletter');

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Radio.Group defaultValue="monthly" disabled name={billingCycleName}>
        <legend>Billing cycle</legend>
        <Radio value="monthly">Monthly</Radio>
        <Radio value="yearly">Yearly</Radio>
      </Radio.Group>

      <Radio.Group defaultValue="weekly" name={newsletterName}>
        <legend>Newsletter</legend>
        <Radio value="weekly">Weekly</Radio>
        <Radio disabled value="daily">
          Daily (unavailable)
        </Radio>
      </Radio.Group>
    </div>
  );
};

export const SizesSample = () => {
  const smallName = useUniqueName('densitySmall');
  const mediumName = useUniqueName('densityMedium');
  const largeName = useUniqueName('densityLarge');

  return (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'start', justify: 'center', wrap: true }}
      stackProps={{ align: 'stretch' }}
    >
      <Radio.Group defaultValue="compact" name={smallName} size="small">
        <legend>Small</legend>
        <Radio value="compact">Compact</Radio>
        <Radio value="comfortable">Comfortable</Radio>
      </Radio.Group>

      <Radio.Group defaultValue="compact" name={mediumName}>
        <legend>Medium</legend>
        <Radio value="compact">Compact</Radio>
        <Radio value="comfortable">Comfortable</Radio>
      </Radio.Group>

      <Radio.Group defaultValue="compact" name={largeName} size="large">
        <legend>Large</legend>
        <Radio value="compact">Compact</Radio>
        <Radio value="comfortable">Comfortable</Radio>
      </Radio.Group>
    </ResponsiveStackInline>
  );
};
