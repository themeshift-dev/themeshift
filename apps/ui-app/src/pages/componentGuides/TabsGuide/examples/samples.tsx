import { Tabs } from '@themeshift/ui/components/Tabs';
import { useState } from 'react';

export const ControlledTabsSample = () => {
  const [value, setValue] = useState('overview');

  return (
    <Tabs onValueChange={setValue} value={value}>
      <Tabs.List aria-label="Controlled sections">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="analytics">Analytics content</Tabs.Panel>
    </Tabs>
  );
};

export const UnmountBehaviorSample = () => {
  const [persistedName, setPersistedName] = useState('');

  return (
    <Tabs defaultValue="ephemeral" lazyMount unmountOnExit>
      <Tabs.List aria-label="Lifecycle behavior demo">
        <Tabs.Trigger value="ephemeral">Unmounted input</Tabs.Trigger>
        <Tabs.Trigger value="pinned">Force-mounted input</Tabs.Trigger>
        <Tabs.Trigger value="controlled">Controlled input</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panels>
        <Tabs.Panel value="ephemeral">
          <p style={{ marginTop: 0, maxWidth: '24rem' }}>
            This input is inside a panel that unmounts when inactive. Enter
            text, switch tabs, then come back to see it reset.
          </p>
          <input
            defaultValue=""
            placeholder="Type here, then switch tabs"
            style={{ inlineSize: '100%' }}
            type="text"
          />
        </Tabs.Panel>

        <Tabs.Panel forceMount value="pinned">
          <p style={{ marginTop: 0, maxWidth: '24rem' }}>
            This panel uses <code>forceMount</code>, so its input remains in the
            DOM and keeps entered text.
          </p>
          <input
            defaultValue=""
            placeholder="This value should remain"
            style={{ inlineSize: '100%' }}
            type="text"
          />
        </Tabs.Panel>

        <Tabs.Panel value="controlled">
          <p style={{ marginTop: 0, maxWidth: '24rem' }}>
            This field is controlled by parent state, so its value persists even
            when panel content unmounts.
          </p>
          <input
            onChange={(event) => setPersistedName(event.currentTarget.value)}
            placeholder="Controlled value"
            style={{ inlineSize: '100%' }}
            type="text"
            value={persistedName}
          />
          <p style={{ marginBottom: 0 }}>
            Stored value: <strong>{persistedName || '(empty)'}</strong>
          </p>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};
