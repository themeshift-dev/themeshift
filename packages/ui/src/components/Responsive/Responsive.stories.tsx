import type { Meta, StoryObj } from '@storybook/react-vite';

import { Responsive } from '@/components/Responsive';

const meta = {
  title: 'Components/Responsive',
  component: Responsive,
  tags: ['autodocs'],
} satisfies Meta<typeof Responsive>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MobileOnly: Story = {
  render: () => (
    <Responsive data-testid="mobile-only" when={{ below: 'tablet' }}>
      Mobile only
    </Responsive>
  ),
};

export const TabletAndUp: Story = {
  render: () => (
    <Responsive when={{ from: 'tablet' }}>Tablet and up</Responsive>
  ),
};

export const TabletThroughDesktop: Story = {
  render: () => (
    <Responsive when={{ from: 'tablet', to: 'desktop' }}>
      Tablet through desktop
    </Responsive>
  ),
};

export const BelowDesktop: Story = {
  render: () => (
    <Responsive when={{ below: 'desktop' }}>Below desktop</Responsive>
  ),
};
