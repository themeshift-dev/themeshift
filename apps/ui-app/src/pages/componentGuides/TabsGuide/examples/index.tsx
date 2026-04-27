import { Tabs } from '@themeshift/ui/components/Tabs';

import { ControlledTabsSample, UnmountBehaviorSample } from './samples';

export const basicUsage = {
  code: `<Tabs>
  <Tabs.List aria-label="Main sections">
    <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
    <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
    <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="dashboard">Dashboard content</Tabs.Panel>
  <Tabs.Panel value="teams">Teams content</Tabs.Panel>
  <Tabs.Panel value="reports">Reports content</Tabs.Panel>
</Tabs>`,
  label: 'Basic usage',
  sample: (
    <Tabs>
      <Tabs.List aria-label="Main sections">
        <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
        <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
        <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="dashboard">Dashboard content</Tabs.Panel>
      <Tabs.Panel value="teams">Teams content</Tabs.Panel>
      <Tabs.Panel value="reports">Reports content</Tabs.Panel>
    </Tabs>
  ),
};

export const uncontrolled = {
  code: `<Tabs defaultValue="billing">
  <Tabs.List aria-label="Settings sections">
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="account">Account content</Tabs.Panel>
  <Tabs.Panel value="billing">Billing content</Tabs.Panel>
</Tabs>`,
  label: 'Uncontrolled',
  sample: (
    <Tabs defaultValue="billing">
      <Tabs.List aria-label="Settings sections">
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="account">Account content</Tabs.Panel>
      <Tabs.Panel value="billing">Billing content</Tabs.Panel>
    </Tabs>
  ),
};

export const controlled = {
  code: `const [tab, setTab] = useState('overview');

<Tabs onValueChange={setTab} value={tab}>
  <Tabs.List aria-label="Controlled sections">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="analytics">Analytics content</Tabs.Panel>
</Tabs>`,
  label: 'Controlled',
  sample: <ControlledTabsSample />,
};

export const fitted = {
  code: `<Tabs defaultValue="overview" fitted>
  <Tabs.List aria-label="Main sections">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
    <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="teams">Teams content</Tabs.Panel>
  <Tabs.Panel value="reports">Reports content</Tabs.Panel>
</Tabs>`,
  label: 'Fitted',
  sample: (
    <Tabs defaultValue="overview" fitted>
      <Tabs.List aria-label="Main sections">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
        <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="teams">Teams content</Tabs.Panel>
      <Tabs.Panel value="reports">Reports content</Tabs.Panel>
    </Tabs>
  ),
};

export const vertical = {
  code: `<Tabs defaultValue="profile" orientation="vertical">
  <Tabs.List aria-label="Settings sections">
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
    <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="profile">Profile content</Tabs.Panel>
  <Tabs.Panel value="security">Security content</Tabs.Panel>
  <Tabs.Panel value="notifications">Notifications content</Tabs.Panel>
</Tabs>`,
  label: 'Vertical',
  sample: (
    <Tabs defaultValue="profile" orientation="vertical">
      <Tabs.List aria-label="Settings sections">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="profile">Profile content</Tabs.Panel>
      <Tabs.Panel value="security">Security content</Tabs.Panel>
      <Tabs.Panel value="notifications">Notifications content</Tabs.Panel>
    </Tabs>
  ),
};

const verticalWithIndicatorCode = `<Tabs defaultValue="profile" orientation="vertical">
  <Tabs.List aria-label="Settings sections">
    <Tabs.Indicator inset="small" />
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
    <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="profile">Profile content</Tabs.Panel>
  <Tabs.Panel value="security">Security content</Tabs.Panel>
  <Tabs.Panel value="notifications">Notifications content</Tabs.Panel>
</Tabs>`;

export const verticalWithIndicatorLTR = {
  code: verticalWithIndicatorCode,
  label: 'LTR',
  sample: (
    <Tabs defaultValue="profile" orientation="vertical">
      <Tabs.List aria-label="Settings sections">
        <Tabs.Indicator inset="small" />
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="profile">Profile content</Tabs.Panel>
      <Tabs.Panel value="security">Security content</Tabs.Panel>
      <Tabs.Panel value="notifications">Notifications content</Tabs.Panel>
    </Tabs>
  ),
};

export const verticalWithIndicatorRTL = {
  code: verticalWithIndicatorCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <Tabs defaultValue="profile" orientation="vertical">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Indicator inset="medium" />
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
          <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="profile">Profile content</Tabs.Panel>
        <Tabs.Panel value="security">Security content</Tabs.Panel>
        <Tabs.Panel value="notifications">Notifications content</Tabs.Panel>
      </Tabs>
    </div>
  ),
};

export const verticalWithIndicator = {
  ...verticalWithIndicatorLTR,
  label: 'Vertical + indicator',
};

export const withIndicator = {
  code: `<Tabs defaultValue="dashboard">
  <Tabs.List aria-label="Main sections">
    <Tabs.Indicator inset="small" size="medium" />
    <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
    <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
    <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="dashboard">Dashboard content</Tabs.Panel>
  <Tabs.Panel value="teams">Teams content</Tabs.Panel>
  <Tabs.Panel value="reports">Reports content</Tabs.Panel>
</Tabs>`,
  label: 'Indicator',
  sample: (
    <Tabs defaultValue="dashboard">
      <Tabs.List aria-label="Main sections">
        <Tabs.Indicator inset="small" size="medium" />
        <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
        <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
        <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="dashboard">Dashboard content</Tabs.Panel>
      <Tabs.Panel value="teams">Teams content</Tabs.Panel>
      <Tabs.Panel value="reports">Reports content</Tabs.Panel>
    </Tabs>
  ),
};

const directionCode = `<Tabs defaultValue="overview">
  <Tabs.List aria-label="Sections">
    <Tabs.Indicator inset="small" />
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="members">Members</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="members">Members content</Tabs.Panel>
  <Tabs.Panel value="billing">Billing content</Tabs.Panel>
</Tabs>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: (
    <Tabs defaultValue="overview">
      <Tabs.List aria-label="LTR sections">
        <Tabs.Indicator inset="small" />
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="members">Members</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="members">Members content</Tabs.Panel>
      <Tabs.Panel value="billing">Billing content</Tabs.Panel>
    </Tabs>
  ),
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="RTL sections">
          <Tabs.Indicator inset="small" />
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="members">Members</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="members">Members content</Tabs.Panel>
        <Tabs.Panel value="billing">Billing content</Tabs.Panel>
      </Tabs>
    </div>
  ),
};

export const panelsContainer = {
  code: `<Tabs defaultValue="account">
  <Tabs.List aria-label="Account sections">
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panels>
    <Tabs.Panel value="account">Account content</Tabs.Panel>
    <Tabs.Panel value="security">Security content</Tabs.Panel>
  </Tabs.Panels>
</Tabs>`,
  label: 'Tabs.Panels',
  sample: (
    <Tabs defaultValue="account">
      <Tabs.List aria-label="Account sections">
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panels>
        <Tabs.Panel value="account">Account content</Tabs.Panel>
        <Tabs.Panel value="security">Security content</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  ),
};

export const manualActivation = {
  code: `<Tabs activationMode="manual" defaultValue="overview">
  <Tabs.List aria-label="Manual activation">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
    <Tabs.Trigger value="history">History</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="reports">Reports content</Tabs.Panel>
  <Tabs.Panel value="history">History content</Tabs.Panel>
</Tabs>`,
  label: 'Manual activation',
  sample: (
    <Tabs activationMode="manual" defaultValue="overview">
      <Tabs.List aria-label="Manual activation">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        <Tabs.Trigger value="history">History</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="reports">Reports content</Tabs.Panel>
      <Tabs.Panel value="history">History content</Tabs.Panel>
    </Tabs>
  ),
};

export const lazyPanels = {
  code: `<Tabs defaultValue="summary" lazyMount unmountOnExit>
  <Tabs.List aria-label="Heavy sections">
    <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
    <Tabs.Trigger value="events">Events</Tabs.Trigger>
    <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panels>
    <Tabs.Panel value="summary">Summary content</Tabs.Panel>
    <Tabs.Panel value="events">Events content</Tabs.Panel>
    <Tabs.Panel forceMount value="logs">Logs content (force mounted)</Tabs.Panel>
  </Tabs.Panels>
</Tabs>`,
  label: 'Lazy mount + unmount',
  sample: (
    <Tabs defaultValue="summary" lazyMount unmountOnExit>
      <Tabs.List aria-label="Heavy sections">
        <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
        <Tabs.Trigger value="events">Events</Tabs.Trigger>
        <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panels>
        <Tabs.Panel value="summary">Summary content</Tabs.Panel>
        <Tabs.Panel value="events">Events content</Tabs.Panel>
        <Tabs.Panel forceMount value="logs">
          Logs content (force mounted)
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  ),
};

export const unmountBehaviorForms = {
  code: `const [persistedName, setPersistedName] = useState('');

<Tabs defaultValue="ephemeral" lazyMount unmountOnExit>
  <Tabs.List aria-label="Lifecycle behavior demo">
    <Tabs.Trigger value="ephemeral">Unmounted input</Tabs.Trigger>
    <Tabs.Trigger value="pinned">Force-mounted input</Tabs.Trigger>
    <Tabs.Trigger value="controlled">Controlled input</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panels>
    <Tabs.Panel value="ephemeral">
      <input placeholder="Type here, then switch tabs" />
    </Tabs.Panel>

    <Tabs.Panel forceMount value="pinned">
      <input placeholder="This value should remain" />
    </Tabs.Panel>

    <Tabs.Panel value="controlled">
      <input
        onChange={(event) => setPersistedName(event.currentTarget.value)}
        value={persistedName}
      />
    </Tabs.Panel>
  </Tabs.Panels>
</Tabs>`,
  label: 'Unmount behavior with forms',
  sample: <UnmountBehaviorSample />,
};

export const propHighlights = [
  basicUsage,
  withIndicator,
  verticalWithIndicator,
  manualActivation,
];

export const directionExamples = [directionLTR, directionRTL];
export const verticalWithIndicatorExamples = [
  verticalWithIndicatorLTR,
  verticalWithIndicatorRTL,
];
