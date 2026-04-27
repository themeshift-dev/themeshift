import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/Button';
import {
  FocusLock,
  type FocusLockAdapterComponent,
} from '@/components/FocusLock';

const meta = {
  title: 'Components/FocusLock',
  component: FocusLock,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    returnFocus: { control: 'boolean' },
  },
} satisfies Meta<typeof FocusLock>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicExample = () => {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Button onClick={() => setActive((value) => !value)}>
        {active ? 'Deactivate lock' : 'Activate lock'}
      </Button>

      <button type="button">Outside button</button>

      <div
        ref={containerRef}
        style={{
          border: '1px solid currentColor',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <FocusLock active={active} containerRef={containerRef}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <button type="button">First lock action</button>
            <button type="button">Second lock action</button>
          </div>
        </FocusLock>
      </div>
    </div>
  );
};

const ShardsExample = () => {
  const [active, setActive] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shardRef = useRef<HTMLDivElement | null>(null);

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Button onClick={() => setActive((value) => !value)}>
        {active ? 'Disable lock' : 'Enable lock'}
      </Button>

      <div
        ref={containerRef}
        style={{
          border: '1px solid currentColor',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <FocusLock
          active={active}
          containerRef={containerRef}
          returnFocus
          shards={[shardRef]}
        >
          <button type="button">Menu action</button>
        </FocusLock>
      </div>

      <div
        ref={shardRef}
        style={{
          border: '1px dashed currentColor',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <button type="button">Portaled action shard</button>
      </div>

      <button type="button">Outside unrelated action</button>
    </div>
  );
};

const SoftAdapter: FocusLockAdapterComponent = ({ active, children }) => (
  <div
    data-active={active ? 'true' : 'false'}
    style={{ outline: active ? '2px solid currentColor' : 'none' }}
  >
    {children}
  </div>
);

const CustomAdapterExample = () => {
  const [active, setActive] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Button onClick={() => setActive((value) => !value)}>
        {active ? 'Disable lock' : 'Enable lock'}
      </Button>

      <div
        ref={containerRef}
        style={{ border: '1px solid currentColor', padding: 12 }}
      >
        <SoftAdapter active={active} containerRef={containerRef}>
          <FocusLock active={active} containerRef={containerRef}>
            <button type="button">Focusable content</button>
          </FocusLock>
        </SoftAdapter>
      </div>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const WithShards: Story = {
  render: () => <ShardsExample />,
};

export const AdapterPattern: Story = {
  render: () => <CustomAdapterExample />,
};
