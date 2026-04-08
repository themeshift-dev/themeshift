import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading } from '@/components/Heading';

const meta = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: {
    children: 'Section heading',
    level: 2,
    muted: false,
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
      }}
    >
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
      <Heading level={5}>Heading level 5</Heading>
      <Heading level={6}>Heading level 6</Heading>
    </div>
  ),
};

export const Muted: Story = {
  args: {
    children: 'Muted heading',
    level: 3,
    muted: true,
  },
};
