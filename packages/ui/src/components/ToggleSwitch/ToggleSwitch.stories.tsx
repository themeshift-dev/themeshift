import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { IconMoon, IconSun } from '@/icons';

import { ToggleSwitch } from './index';

const meta = {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
  tags: ['autodocs'],
  args: {
    intent: 'primary',
    label: 'Email notifications',
    labelPosition: 'end',
    size: 'medium',
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: 'Enabled by default',
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);

    return (
      <ToggleSwitch
        {...args}
        checked={checked}
        label={checked ? 'Controlled on' : 'Controlled off'}
        onCheckedChange={setChecked}
      />
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
      <ToggleSwitch {...args} label="Small" size="small" />
      <ToggleSwitch {...args} label="Medium" size="medium" />
      <ToggleSwitch {...args} label="Large" size="large" />
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
      <ToggleSwitch {...args} defaultChecked intent="primary" label="Primary" />
      <ToggleSwitch
        {...args}
        defaultChecked
        intent="secondary"
        label="Secondary"
      />
      <ToggleSwitch
        {...args}
        defaultChecked
        intent="tertiary"
        label="Tertiary"
      />
      <ToggleSwitch
        {...args}
        defaultChecked
        intent="constructive"
        label="Constructive"
      />
      <ToggleSwitch
        {...args}
        defaultChecked
        intent="destructive"
        label="Destructive"
      />
    </div>
  ),
};

export const LabelPositions: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
      }}
    >
      <ToggleSwitch {...args} label="Label at end" labelPosition="end" />
      <ToggleSwitch {...args} label="Label at start" labelPosition="start" />
    </div>
  ),
};

export const WithDescription: Story = {
  args: {
    description: 'Send a digest instead of individual notifications.',
    label: 'Daily summary',
  },
};

export const InvalidWithError: Story = {
  args: {
    errorMessage: 'This preference conflicts with your current plan.',
    invalid: true,
    label: 'Enterprise-only setting',
  },
};

export const Disabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
    label: 'Disabled setting',
  },
};

export const ReadOnly: Story = {
  args: {
    defaultChecked: true,
    label: 'Read-only setting',
    readOnly: true,
  },
};

export const WithIcons: Story = {
  args: {
    ariaLabel: 'Toggle theme',
    defaultChecked: true,
    iconOff: <IconMoon aria-hidden />,
    iconOn: <IconSun aria-hidden />,
    label: 'Theme mode',
  },
};

export const IconOnlyAccessibleName: Story = {
  args: {
    ariaLabel: 'Enable solar mode',
    iconOff: <IconMoon aria-hidden />,
    iconOn: <IconSun aria-hidden />,
    label: undefined,
  },
};
