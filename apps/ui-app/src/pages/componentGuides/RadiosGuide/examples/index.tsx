import { ControlledRadioGroup } from './ControlledRadioGroup';
import {
  BasicUsageSample,
  DisabledSample,
  SizesSample,
  UncontrolledSample,
  WithFieldSample,
} from './samples';

export const basicUsage = {
  code: `<Radio.Group name="contactMethodBasic" defaultValue="email">
  <legend>Preferred contact method</legend>
  <Radio value="email">Email</Radio>
  <Radio value="phone">Phone</Radio>
  <Radio value="sms">SMS</Radio>
</Radio.Group>`,
  label: 'Basic usage',
  sample: <BasicUsageSample />,
};

export const withField = {
  code: `<Field required validationState="invalid">
  <Radio.Group name="contactMethodField">
    <Field.Label as="legend">Preferred contact method</Field.Label>

    <Radio value="email">Email</Radio>
    <Radio value="phone">Phone</Radio>
    <Radio value="sms">SMS</Radio>

    <Field.Description>
      Choose how you'd like us to contact you.
    </Field.Description>
    <Field.Error>Please select a contact method.</Field.Error>
  </Radio.Group>
</Field>`,
  label: 'With Field',
  sample: <WithFieldSample />,
};

export const controlled = {
  code: `const [value, setValue] = useState('m');

<Radio.Group name="sizeControlled" value={value} onValueChange={setValue}>
  <legend>Size</legend>
  <Radio value="s">Small</Radio>
  <Radio value="m">Medium</Radio>
  <Radio value="l">Large</Radio>
</Radio.Group>`,
  label: 'Controlled',
  sample: <ControlledRadioGroup />,
};

export const uncontrolled = {
  code: `<Radio.Group name="sizeUncontrolled" defaultValue="m">
  <legend>Size</legend>
  <Radio value="s">Small</Radio>
  <Radio value="m">Medium</Radio>
  <Radio value="l">Large</Radio>
</Radio.Group>`,
  label: 'Uncontrolled',
  sample: <UncontrolledSample />,
};

export const disabled = {
  code: `<Radio.Group name="billingCycle" defaultValue="monthly" disabled>
  <legend>Billing cycle</legend>
  <Radio value="monthly">Monthly</Radio>
  <Radio value="yearly">Yearly</Radio>
</Radio.Group>

<Radio.Group name="newsletter" defaultValue="weekly">
  <legend>Newsletter</legend>
  <Radio value="weekly">Weekly</Radio>
  <Radio disabled value="daily">
    Daily (unavailable)
  </Radio>
</Radio.Group>`,
  label: 'Disabled',
  sample: <DisabledSample />,
};

export const sizes = {
  code: `<Radio.Group name="densitySmall" size="small" defaultValue="compact">
  <legend>Small</legend>
  <Radio value="compact">Compact</Radio>
  <Radio value="comfortable">Comfortable</Radio>
</Radio.Group>

<Radio.Group name="densityMedium" defaultValue="compact">
  <legend>Medium</legend>
  <Radio value="compact">Compact</Radio>
  <Radio value="comfortable">Comfortable</Radio>
</Radio.Group>

<Radio.Group name="densityLarge" size="large" defaultValue="compact">
  <legend>Large</legend>
  <Radio value="compact">Compact</Radio>
  <Radio value="comfortable">Comfortable</Radio>
</Radio.Group>`,
  label: 'Sizes',
  sample: <SizesSample />,
};

export const propHighlights = [basicUsage, withField, controlled, disabled];
