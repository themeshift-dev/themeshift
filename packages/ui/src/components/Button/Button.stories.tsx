import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '@/components/Button';
import { IconMoon } from '@/icons/IconMoon';
import { IconSun } from '@/icons/IconSun';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Click me',
    intent: 'primary',
    size: 'medium',
    variant: 'solid',
    visuallyDisabled: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'constructive', 'destructive'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large', 'hero'],
    },
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'link'],
    },
    visuallyDisabled: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Intents: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <Button {...args} intent="primary">
        Primary
      </Button>
      <Button {...args} intent="secondary">
        Secondary
      </Button>
      <Button {...args} intent="constructive">
        Constructive
      </Button>
      <Button {...args} intent="destructive">
        Destructive
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
      }}
    >
      {(['primary', 'secondary', 'constructive', 'destructive'] as const).map(
        (intent) => (
          <div
            key={intent}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
          >
            <Button {...args} intent={intent} variant="solid">
              Solid
            </Button>
            <Button {...args} intent={intent} variant="outline">
              Outline
            </Button>
            <Button {...args} intent={intent} variant="link">
              Link
            </Button>
          </div>
        )
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <Button {...args} size="small">
        Small
      </Button>
      <Button {...args} size="medium">
        Medium
      </Button>
      <Button {...args} size="large">
        Large
      </Button>
      <Button {...args} size="hero">
        Hero
      </Button>
    </div>
  ),
};

export const VisuallyDisabled: Story = {
  args: {
    children: 'Visually disabled',
    visuallyDisabled: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Icons: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <Button {...args} startIcon={<IconMoon aria-hidden />}>
        Start icon
      </Button>
      <Button {...args} endIcon={<IconSun aria-hidden />}>
        End icon
      </Button>
      <Button
        {...args}
        aria-label="Toggle theme"
        icon={<IconMoon aria-hidden />}
      />
    </div>
  ),
};

export const AsChild: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="/login">Login</a>
    </Button>
  ),
};

export const CustomClassName: Story = {
  args: {
    children: 'Custom class',
    className: 'storybook-button-custom-class',
  },
};

export const NativeButtonProps: Story = {
  args: {
    children: 'Submit form',
    type: 'submit',
    name: 'storybook-submit',
    value: 'submit-value',
  },
};
