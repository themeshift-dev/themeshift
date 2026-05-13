import { Button } from '@themeshift/ui/components/Button';
import { Status } from '@themeshift/ui/components/Status';
import {
  LuDatabase,
  LuFileSearch,
  LuShieldX,
  LuUnplug,
  LuWifiOff,
} from 'react-icons/lu';

export const quickStart = {
  code: `<Status>
  <Status.Icon>
    <LuDatabase aria-hidden />
  </Status.Icon>

  <Status.Content>
    <Status.Title>No projects yet</Status.Title>
    <Status.Description>
      Create your first project to start organizing your work.
    </Status.Description>
  </Status.Content>

  <Status.Actions>
    <Button>Create project</Button>
    <Button variant="link">Learn more</Button>
  </Status.Actions>
</Status>`,
  label: 'Quick start',
  sample: (
    <Status>
      <Status.Icon>
        <LuDatabase aria-hidden size={28} />
      </Status.Icon>

      <Status.Content>
        <Status.Title>No projects yet</Status.Title>
        <Status.Description>
          Create your first project to start organizing your work.
        </Status.Description>
      </Status.Content>

      <Status.Actions>
        <Button>Create project</Button>
        <Button variant="link">Learn more</Button>
      </Status.Actions>
    </Status>
  ),
};

export const compositionExample = {
  code: `<Status align="start" variant="panel">
  <Status.Icon>
    <LuUnplug aria-hidden />
  </Status.Icon>

  <Status.Content>
    <Status.Title>Connection lost</Status.Title>
    <Status.Description>
      We lost network access while loading your workspace.
    </Status.Description>
  </Status.Content>

  <Status.Actions>
    <Button>Retry</Button>
    <Button variant="link">Open offline docs</Button>
  </Status.Actions>
</Status>`,
  id: 'composition',
  label: 'Composed primitives',
  render: (
    <div style={{ padding: '1rem' }}>
      <Status align="start" variant="panel">
        <Status.Icon>
          <LuUnplug aria-hidden size={28} />
        </Status.Icon>

        <Status.Content>
          <Status.Title>Connection lost</Status.Title>
          <Status.Description>
            We lost network access while loading your workspace.
          </Status.Description>
        </Status.Content>

        <Status.Actions>
          <Button>Retry</Button>
          <Button variant="link">Open offline docs</Button>
        </Status.Actions>
      </Status>
    </div>
  ),
};

export const actionsAsChildExample = {
  code: `<Status intent="danger">
  <Status.Icon>
    <LuWifiOff aria-hidden />
  </Status.Icon>

  <Status.Content>
    <Status.Title>Connection failed</Status.Title>
    <Status.Description>
      We could not reach the service. Please retry.
    </Status.Description>
  </Status.Content>

  <Status.Actions asChild>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button>Retry</Button>
      <Button variant="link">Cancel</Button>
    </div>
  </Status.Actions>
</Status>`,
  id: 'actions-as-child',
  label: 'Actions asChild',
  render: (
    <div style={{ padding: '1rem' }}>
      <Status intent="danger">
        <Status.Icon>
          <LuWifiOff aria-hidden size={28} />
        </Status.Icon>

        <Status.Content>
          <Status.Title>Connection failed</Status.Title>
          <Status.Description>
            We could not reach the service. Please retry.
          </Status.Description>
        </Status.Content>

        <Status.Actions asChild>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button>Retry</Button>
            <Button variant="link">Cancel</Button>
          </div>
        </Status.Actions>
      </Status>
    </div>
  ),
};

export const allPresetsExample = {
  code: `<div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
  <Status.Empty icon={<LuDatabase aria-hidden />} />
  <Status.Error icon={<LuShieldX aria-hidden />} />
  <Status.PageNotFound icon={<LuFileSearch aria-hidden />} />
  <Status.Disconnected icon={<LuWifiOff aria-hidden />} />
  <Status.NoResults icon={<LuDatabase aria-hidden />} />
  <Status.PermissionDenied icon={<LuShieldX aria-hidden />} />
</div>`,
  id: 'all-presets',
  label: 'All presets',
  render: (
    <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
      <Status.Empty icon={<LuDatabase aria-hidden size={28} />} />
      <Status.Error icon={<LuShieldX aria-hidden size={28} />} />
      <Status.PageNotFound icon={<LuFileSearch aria-hidden size={28} />} />
      <Status.Disconnected icon={<LuWifiOff aria-hidden size={28} />} />
      <Status.NoResults icon={<LuDatabase aria-hidden size={28} />} />
      <Status.PermissionDenied icon={<LuShieldX aria-hidden size={28} />} />
    </div>
  ),
};

export const allPresetExamples = [
  {
    code: `<Status.Empty icon={<LuDatabase aria-hidden />} />`,
    id: 'preset-empty',
    label: 'Empty',
    render: (
      <div style={{ padding: '1rem' }}>
        <Status.Empty icon={<LuDatabase aria-hidden size={28} />} />
      </div>
    ),
  },
  {
    code: `<Status.Error icon={<LuShieldX aria-hidden />} />`,
    id: 'preset-error',
    label: 'Error',
    render: (
      <div style={{ padding: '1rem' }}>
        <Status.Error icon={<LuShieldX aria-hidden size={28} />} />
      </div>
    ),
  },
  {
    code: `<Status.PageNotFound icon={<LuFileSearch aria-hidden />} />`,
    id: 'preset-page-not-found',
    label: 'PageNotFound',
    render: (
      <div style={{ padding: '1rem' }}>
        <Status.PageNotFound icon={<LuFileSearch aria-hidden size={28} />} />
      </div>
    ),
  },
  {
    code: `<Status.Disconnected icon={<LuWifiOff aria-hidden />} />`,
    id: 'preset-disconnected',
    label: 'Disconnected',
    render: (
      <div style={{ padding: '1rem' }}>
        <Status.Disconnected icon={<LuWifiOff aria-hidden size={28} />} />
      </div>
    ),
  },
  {
    code: `<Status.NoResults icon={<LuDatabase aria-hidden />} />`,
    id: 'preset-no-results',
    label: 'NoResults',
    render: (
      <div style={{ padding: '1rem' }}>
        <Status.NoResults icon={<LuDatabase aria-hidden size={28} />} />
      </div>
    ),
  },
  {
    code: `<Status.PermissionDenied icon={<LuShieldX aria-hidden />} />`,
    id: 'preset-permission-denied',
    label: 'PermissionDenied',
    render: (
      <div style={{ padding: '1rem' }}>
        <Status.PermissionDenied icon={<LuShieldX aria-hidden size={28} />} />
      </div>
    ),
  },
];

export const introExamples = [
  {
    code: `<Status.Empty
  title="No projects yet"
  description="Create your first project to start organizing your work."
  actions={<Button>Create project</Button>}
  icon={<LuDatabase aria-hidden />}
/>`,
    id: 'basic-usage',
    label: 'Basic usage',
    render: (
      <div style={{ padding: '1rem' }}>
        <Status.Empty
          actions={<Button>Create project</Button>}
          description="Create your first project to start organizing your work."
          icon={<LuDatabase aria-hidden size={28} />}
          title="No projects yet"
        />
      </div>
    ),
  },
  {
    code: `<Status>
  <Status.Icon>
    <LuDatabase aria-hidden />
  </Status.Icon>

  <Status.Content>
    <Status.Title>No projects yet</Status.Title>
    <Status.Description>
      Create your first project to start organizing your work.
    </Status.Description>
  </Status.Content>

  <Status.Actions>
    <Button>Create project</Button>
  </Status.Actions>
</Status>`,
    id: 'composition',
    label: 'Composition',
    render: (
      <div style={{ padding: '1rem' }}>
        <Status>
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>

          <Status.Content>
            <Status.Title>No projects yet</Status.Title>
            <Status.Description>
              Create your first project to start organizing your work.
            </Status.Description>
          </Status.Content>

          <Status.Actions>
            <Button>Create project</Button>
          </Status.Actions>
        </Status>
      </div>
    ),
  },
  {
    code: `<div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
  <Status variant="plain">
    <Status.Icon>
      <LuDatabase aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Plain variant</Status.Title>
      <Status.Description>
        Minimal status styling for unobtrusive layouts.
      </Status.Description>
    </Status.Content>
  </Status>

  <Status variant="panel">
    <Status.Icon>
      <LuDatabase aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Panel variant</Status.Title>
      <Status.Description>
        Framed status container for stronger visual grouping.
      </Status.Description>
    </Status.Content>
  </Status>

  <Status variant="subtle">
    <Status.Icon>
      <LuDatabase aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Subtle variant</Status.Title>
      <Status.Description>
        Elevated tint to separate status content from the page background.
      </Status.Description>
    </Status.Content>
  </Status>
</div>`,
    id: 'variants-overview',
    label: 'Variants',
    render: (
      <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
        <Status variant="plain">
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Plain variant</Status.Title>
            <Status.Description>
              Minimal status styling for unobtrusive layouts.
            </Status.Description>
          </Status.Content>
        </Status>

        <Status variant="panel">
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Panel variant</Status.Title>
            <Status.Description>
              Framed status container for stronger visual grouping.
            </Status.Description>
          </Status.Content>
        </Status>

        <Status variant="subtle">
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Subtle variant</Status.Title>
            <Status.Description>
              Elevated tint to separate status content from the page background.
            </Status.Description>
          </Status.Content>
        </Status>
      </div>
    ),
  },
  {
    code: `<div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
  <Status intent="neutral" variant="panel">
    <Status.Icon>
      <LuDatabase aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Neutral</Status.Title>
      <Status.Description>General informational state.</Status.Description>
    </Status.Content>
  </Status>

  <Status intent="info" variant="panel">
    <Status.Icon>
      <LuFileSearch aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Info</Status.Title>
      <Status.Description>Additional context for the current view.</Status.Description>
    </Status.Content>
  </Status>

  <Status intent="success" variant="panel">
    <Status.Icon>
      <LuDatabase aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Success</Status.Title>
      <Status.Description>Operation completed successfully.</Status.Description>
    </Status.Content>
  </Status>

  <Status intent="warning" variant="panel">
    <Status.Icon>
      <LuWifiOff aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Warning</Status.Title>
      <Status.Description>Connection is unstable. Please retry shortly.</Status.Description>
    </Status.Content>
  </Status>

  <Status intent="danger" variant="panel">
    <Status.Icon>
      <LuShieldX aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Danger</Status.Title>
      <Status.Description>Action failed and needs immediate attention.</Status.Description>
    </Status.Content>
  </Status>
</div>`,
    id: 'intents-overview',
    label: 'Intents',
    render: (
      <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
        <Status intent="neutral" variant="panel">
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Neutral</Status.Title>
            <Status.Description>
              General informational state.
            </Status.Description>
          </Status.Content>
        </Status>

        <Status intent="info" variant="panel">
          <Status.Icon>
            <LuFileSearch aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Info</Status.Title>
            <Status.Description>
              Additional context for the current view.
            </Status.Description>
          </Status.Content>
        </Status>

        <Status intent="success" variant="panel">
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Success</Status.Title>
            <Status.Description>
              Operation completed successfully.
            </Status.Description>
          </Status.Content>
        </Status>

        <Status intent="warning" variant="panel">
          <Status.Icon>
            <LuWifiOff aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Warning</Status.Title>
            <Status.Description>
              Connection is unstable. Please retry shortly.
            </Status.Description>
          </Status.Content>
        </Status>

        <Status intent="danger" variant="panel">
          <Status.Icon>
            <LuShieldX aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Danger</Status.Title>
            <Status.Description>
              Action failed and needs immediate attention.
            </Status.Description>
          </Status.Content>
        </Status>
      </div>
    ),
  },
  {
    code: `<div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
  <Status density="compact" variant="panel">
    <Status.Icon>
      <LuDatabase aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Compact density</Status.Title>
      <Status.Description>
        Tight spacing for dense dashboards and constrained regions.
      </Status.Description>
    </Status.Content>
  </Status>

  <Status density="comfortable" variant="panel">
    <Status.Icon>
      <LuDatabase aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Comfortable density</Status.Title>
      <Status.Description>
        Balanced spacing for most layouts and common empty states.
      </Status.Description>
    </Status.Content>
  </Status>

  <Status density="spacious" variant="panel">
    <Status.Icon>
      <LuDatabase aria-hidden />
    </Status.Icon>
    <Status.Content>
      <Status.Title>Spacious density</Status.Title>
      <Status.Description>
        More breathing room for full-page states and marketing surfaces.
      </Status.Description>
    </Status.Content>
  </Status>
</div>`,
    id: 'density-overview',
    label: 'Density',
    render: (
      <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
        <Status density="compact" variant="panel">
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Compact density</Status.Title>
            <Status.Description>
              Tight spacing for dense dashboards and constrained regions.
            </Status.Description>
          </Status.Content>
        </Status>

        <Status density="comfortable" variant="panel">
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Comfortable density</Status.Title>
            <Status.Description>
              Balanced spacing for most layouts and common empty states.
            </Status.Description>
          </Status.Content>
        </Status>

        <Status density="spacious" variant="panel">
          <Status.Icon>
            <LuDatabase aria-hidden size={28} />
          </Status.Icon>
          <Status.Content>
            <Status.Title>Spacious density</Status.Title>
            <Status.Description>
              More breathing room for full-page states and marketing surfaces.
            </Status.Description>
          </Status.Content>
        </Status>
      </div>
    ),
  },
];

export const propHighlights = [quickStart];
