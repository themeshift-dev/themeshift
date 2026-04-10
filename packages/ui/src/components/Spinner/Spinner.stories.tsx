import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Loading',
    size: 24,
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <Spinner {...args} size={16} />
      <Spinner {...args} size={24} />
      <Spinner {...args} size={40} />
    </div>
  ),
};

export const InButtons: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <Button isBusy>Saving</Button>
      <Button intent="secondary" isBusy>
        Updating
      </Button>
      <Button aria-label="Loading" icon={<Spinner aria-hidden />} />
    </div>
  ),
};

export const CustomColor: Story = {
  args: {
    'aria-label': 'Loading',
    style: {
      color: '#3ccf91',
    },
  },
};
