import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Field } from '@/components/Field';
import { IconMoon, IconSun } from '@/icons';

import { ToggleSwitch } from './index';

const meta = {
  args: {
    intent: 'primary',
    size: 'medium',
  },
  component: ToggleSwitch,
  tags: ['autodocs'],
  title: 'Components/ToggleSwitch',
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <label
      htmlFor="toggle-default"
      style={{ alignItems: 'center', display: 'inline-flex', gap: '0.75rem' }}
    >
      Email notifications
      <ToggleSwitch {...args} id="toggle-default" />
    </label>
  ),
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
  render: (args) => (
    <label
      htmlFor="toggle-checked"
      style={{ alignItems: 'center', display: 'inline-flex', gap: '0.75rem' }}
    >
      Enabled by default
      <ToggleSwitch {...args} id="toggle-checked" />
    </label>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);

    return (
      <Field layout="inline-control">
        <ToggleSwitch
          {...args}
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Field.Label>
          {checked ? 'Controlled on' : 'Controlled off'}
        </Field.Label>
      </Field>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
      }}
    >
      <Field layout="inline-control">
        <ToggleSwitch {...args} size="small" />
        <Field.Label>Small</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch {...args} size="medium" />
        <Field.Label>Medium</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch {...args} size="large" />
        <Field.Label>Large</Field.Label>
      </Field>
    </div>
  ),
};

export const Intents: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
      }}
    >
      <Field layout="inline-control">
        <ToggleSwitch {...args} defaultChecked intent="primary" />
        <Field.Label>Primary</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch {...args} defaultChecked intent="secondary" />
        <Field.Label>Secondary</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch {...args} defaultChecked intent="tertiary" />
        <Field.Label>Tertiary</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch {...args} defaultChecked intent="constructive" />
        <Field.Label>Constructive</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch {...args} defaultChecked intent="destructive" />
        <Field.Label>Destructive</Field.Label>
      </Field>
    </div>
  ),
};

export const InvalidWithError: Story = {
  render: (args) => (
    <Field
      description="This setting requires enterprise access."
      error="This preference conflicts with your current plan."
      label="Enterprise-only setting"
      layout="inline-control"
      validationState="invalid"
    >
      <ToggleSwitch {...args} />
    </Field>
  ),
};

export const Disabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
  render: (args) => (
    <Field layout="inline-control">
      <ToggleSwitch {...args} />
      <Field.Label>Disabled setting</Field.Label>
    </Field>
  ),
};

export const ReadOnly: Story = {
  args: {
    defaultChecked: true,
    readOnly: true,
  },
  render: (args) => (
    <Field layout="inline-control">
      <ToggleSwitch {...args} />
      <Field.Label>Read-only setting</Field.Label>
    </Field>
  ),
};

export const WithIcons: Story = {
  args: {
    'aria-label': 'Toggle theme',
    defaultChecked: true,
    trackIconOff: <IconMoon aria-hidden />,
    trackIconOn: <IconSun aria-hidden />,
  },
};

export const WithThumbIcons: Story = {
  args: {
    'aria-label': 'Toggle theme',
    defaultChecked: true,
    thumbIconOff: <IconMoon aria-hidden />,
    thumbIconOn: <IconSun aria-hidden />,
  },
};

export const IconOnlyAccessibleName: Story = {
  args: {
    'aria-label': 'Enable solar mode',
    trackIconOff: <IconMoon aria-hidden />,
    trackIconOn: <IconSun aria-hidden />,
  },
};
