import { useState } from 'react';

import { Sidebar } from '@themeshift/ui/components/Sidebar';

export const quickStart = {
  code: `<Sidebar.Provider defaultCollapsed={false}>
  <Sidebar>
    <Sidebar.Header>
      <Sidebar.Trigger label="Toggle sidebar" />
    </Sidebar.Header>

    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
        <Sidebar.Menu>
          <Sidebar.MenuItem active>
            <Sidebar.MenuButton iconOnlyLabel="Dashboard" tooltip="Dashboard">
              <span>Dashboard</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>

    <Sidebar.Footer>Account</Sidebar.Footer>
    <Sidebar.Rail label="Expand sidebar" />
  </Sidebar>

  <Sidebar.Inset>
    <main>Content</main>
  </Sidebar.Inset>
</Sidebar.Provider>`,
  label: 'Quick start',
  sample: (
    <Sidebar.Provider defaultCollapsed={false}>
      <div style={{ display: 'flex', minHeight: 320 }}>
        <Sidebar>
          <Sidebar.Header>
            <Sidebar.Trigger label="Toggle sidebar" />
          </Sidebar.Header>

          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuItem active>
                  <Sidebar.MenuButton
                    iconOnlyLabel="Dashboard"
                    tooltip="Dashboard"
                  >
                    <span>Dashboard</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>

          <Sidebar.Footer>Account</Sidebar.Footer>
          <Sidebar.Rail label="Expand sidebar" />
        </Sidebar>

        <Sidebar.Inset>
          <main style={{ padding: '1rem' }}>Content</main>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  ),
};

export const offcanvasWithLocationKey = {
  code: `const [locationKey, setLocationKey] = useState('/dashboard');

<Sidebar.Provider
  closeOnRouteChange
  collapseMode="offcanvas"
  defaultOpen={false}
  locationKey={locationKey}
>
  <Sidebar mode="offcanvas">
    <Sidebar.Header>
      <Sidebar.Trigger label="Toggle navigation" />
    </Sidebar.Header>
    <Sidebar.Content>…</Sidebar.Content>
  </Sidebar>

  <Sidebar.Inset>
    <button onClick={() => setLocationKey('/projects')}>Navigate</button>
  </Sidebar.Inset>
</Sidebar.Provider>`,
  label: 'Offcanvas + locationKey',
  sample: () => {
    const [locationKey, setLocationKey] = useState('/dashboard');

    return (
      <Sidebar.Provider
        closeOnRouteChange
        collapseMode="offcanvas"
        defaultOpen={false}
        locationKey={locationKey}
      >
        <div style={{ display: 'flex', minHeight: 320 }}>
          <Sidebar mode="offcanvas">
            <Sidebar.Header>
              <Sidebar.Trigger label="Toggle navigation" />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton iconOnlyLabel="Dashboard">
                    <span>Dashboard</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Content>
          </Sidebar>

          <Sidebar.Inset>
            <div style={{ padding: '1rem' }}>
              <p>Current locationKey: {locationKey}</p>
              <button type="button" onClick={() => setLocationKey('/projects')}>
                Navigate to /projects
              </button>
            </div>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    );
  },
};

export const rtlSideAware = {
  code: `<div dir="rtl">
  <Sidebar.Provider side="end" defaultCollapsed>
    <Sidebar side="end" variant="floating">
      <Sidebar.Header>
        <Sidebar.Trigger label="Toggle sidebar" />
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton iconOnlyLabel="التقارير" tooltip="التقارير">
              <span>التقارير</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Content>
    </Sidebar>
  </Sidebar.Provider>
</div>`,
  label: 'RTL side-aware',
  sample: (
    <div dir="rtl">
      <Sidebar.Provider side="end" defaultCollapsed>
        <div style={{ display: 'flex', minHeight: 280 }}>
          <Sidebar side="end" variant="floating">
            <Sidebar.Header>
              <Sidebar.Trigger label="Toggle sidebar" />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    iconOnlyLabel="التقارير"
                    tooltip="التقارير"
                  >
                    <span>التقارير</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Content>
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>RTL content area</main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    </div>
  ),
};

export const propHighlights = [
  quickStart,
  offcanvasWithLocationKey,
  rtlSideAware,
];
