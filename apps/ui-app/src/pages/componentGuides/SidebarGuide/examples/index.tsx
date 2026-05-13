import {
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Badge } from '@themeshift/ui/components/Badge';
import { Button } from '@themeshift/ui/components/Button';
import { Card } from '@themeshift/ui/components/Card';
import { Heading } from '@themeshift/ui/components/Heading';
import { Sidebar } from '@themeshift/ui/components/Sidebar';
import { Tooltip } from '@themeshift/ui/components/Tooltip';
import {
  LuFolder,
  LuGauge,
  LuHammer,
  LuTriangle,
  LuUser,
} from 'react-icons/lu';
import { VscLayoutSidebarLeftDock } from 'react-icons/vsc';

function preventDocsNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function GuideTooltipMenuButton({
  iconOnlyLabel,
  tooltip,
  ...props
}: ComponentProps<typeof Sidebar.MenuButton> & {
  tooltip?: ReactNode;
}) {
  const triggerWrapperRef = useRef<HTMLSpanElement>(null);
  const [placement, setPlacement] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const wrapper = triggerWrapperRef.current;

    if (!wrapper) {
      return;
    }

    const doc = wrapper.ownerDocument;
    const sidebar = wrapper.closest<HTMLElement>('[data-side]');
    const side = sidebar?.getAttribute('data-side') === 'end' ? 'end' : 'start';
    const direction =
      doc.defaultView?.getComputedStyle(wrapper).direction ??
      doc.documentElement.dir ??
      'ltr';
    const isRtl = direction === 'rtl';
    const nextPlacement =
      side === 'start' ? (isRtl ? 'left' : 'right') : isRtl ? 'right' : 'left';

    setPlacement(nextPlacement);
  }, []);

  const content = (
    <Sidebar.MenuButton iconOnlyLabel={iconOnlyLabel} {...props} />
  );

  const resolvedTooltip =
    tooltip ?? (typeof iconOnlyLabel === 'string' ? iconOnlyLabel : undefined);

  if (!resolvedTooltip) {
    return content;
  }

  return (
    <Tooltip content={resolvedTooltip} placement={placement}>
      <span ref={triggerWrapperRef}>{content}</span>
    </Tooltip>
  );
}

export const quickStart = {
  code: `<Sidebar.Provider defaultCollapsed={false}>
  <Sidebar>
    <Sidebar.Header>
      <Sidebar.Trigger
        as={Button}
        intent="secondary"
        label="Toggle sidebar"
        size="small"
        variant="link"
      />
    </Sidebar.Header>

    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
        <Sidebar.Menu>
          <Sidebar.MenuItem active>
            <Sidebar.MenuButton iconOnlyLabel="Dashboard">
              <span>Dashboard</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>

    <Sidebar.Footer
      collapsedContent={<LuUser aria-hidden />}

      hideWhenCollapsed
    >
      Account
    </Sidebar.Footer>
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
            <Sidebar.Trigger
              as={Button}
              intent="secondary"
              label="Toggle sidebar"
              size="small"
              variant="outline"
            />
          </Sidebar.Header>

          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuItem active>
                  <GuideTooltipMenuButton iconOnlyLabel="Dashboard">
                    <span>Dashboard</span>
                  </GuideTooltipMenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>

          <Sidebar.Footer
            collapsedContent={<LuUser aria-hidden />}
            hideWhenCollapsed
          >
            Account
          </Sidebar.Footer>
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
      <Sidebar.Trigger
        as={Button}
        label="Toggle navigation"
        size="small"
        variant="link"
      />
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
              <Sidebar.Trigger
                as={Button}
                label="Toggle navigation"
                size="small"
                variant="link"
              />
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
        <Sidebar.Trigger
          as={Button}
          label="Toggle sidebar"
          size="small"
          variant="link"
        />
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton iconOnlyLabel="التقارير">
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
              <Sidebar.Trigger
                as={Button}
                label="Toggle sidebar"
                size="small"
                variant="link"
              />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton iconOnlyLabel="التقارير">
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

export const collapsibleMenuItemDefault = {
  code: `<Sidebar.Provider defaultCollapsed={false}>
  <Sidebar>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
        <Sidebar.Menu>
          <Sidebar.MenuItem collapsible defaultOpen>
            <Sidebar.MenuButton iconOnlyLabel="Models">
              <span>Models</span>
            </Sidebar.MenuButton>
            <ul>
              <Sidebar.SubMenuItem>Genesis</Sidebar.SubMenuItem>
              <Sidebar.SubMenuItem>Explorer</Sidebar.SubMenuItem>
              <Sidebar.SubMenuItem>Quantum</Sidebar.SubMenuItem>
            </ul>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar>
</Sidebar.Provider>`,
  label: 'MenuItem collapsible (default)',
  sample: (
    <Sidebar.Provider defaultCollapsed={false}>
      <div style={{ display: 'flex', minHeight: 280 }}>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuItem collapsible defaultOpen>
                  <Sidebar.MenuButton iconOnlyLabel="Models">
                    <span>Models</span>
                  </Sidebar.MenuButton>
                  <ul>
                    <Sidebar.SubMenuItem>Genesis</Sidebar.SubMenuItem>
                    <Sidebar.SubMenuItem>Explorer</Sidebar.SubMenuItem>
                    <Sidebar.SubMenuItem>Quantum</Sidebar.SubMenuItem>
                  </ul>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
      </div>
    </Sidebar.Provider>
  ),
};

export const collapsibleMenuItemControlled = {
  code: `const [open, setOpen] = useState(false);

<Sidebar.MenuItem collapsible onOpenChange={setOpen} open={open}>
  <Sidebar.MenuButton iconOnlyLabel="Models">
    <span>Models</span>
  </Sidebar.MenuButton>
  <ul>
    <Sidebar.SubMenuItem>Genesis</Sidebar.SubMenuItem>
    <Sidebar.SubMenuItem>Explorer</Sidebar.SubMenuItem>
  </ul>
</Sidebar.MenuItem>`,
  label: 'MenuItem collapsible (controlled)',
  sample: () => {
    const [open, setOpen] = useState(false);

    return (
      <Sidebar.Provider defaultCollapsed={false}>
        <div style={{ display: 'flex', minHeight: 280 }}>
          <Sidebar>
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.MenuItem
                  collapsible
                  onOpenChange={setOpen}
                  open={open}
                >
                  <Sidebar.MenuButton iconOnlyLabel="Models">
                    <span>Models</span>
                  </Sidebar.MenuButton>
                  <ul>
                    <Sidebar.SubMenuItem>Genesis</Sidebar.SubMenuItem>
                    <Sidebar.SubMenuItem>Explorer</Sidebar.SubMenuItem>
                  </ul>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Content>
          </Sidebar>
        </div>
      </Sidebar.Provider>
    );
  },
};

export const collapsibleMenuItemCustomChevron = {
  code: `<Sidebar.MenuItem
  collapsible
  collapseIcon={(open) => <span>{open ? '−' : '+'}</span>}
>
  <Sidebar.MenuButton iconOnlyLabel="Models">
    <span>Models</span>
  </Sidebar.MenuButton>
  <ul>
    <Sidebar.SubMenuItem>Genesis</Sidebar.SubMenuItem>
  </ul>
</Sidebar.MenuItem>`,
  label: 'MenuItem collapsible (custom chevron)',
  sample: (
    <Sidebar.Provider defaultCollapsed={false}>
      <div style={{ display: 'flex', minHeight: 280 }}>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem
                collapsible
                collapseIcon={(open) => <span>{open ? '−' : '+'}</span>}
              >
                <Sidebar.MenuButton iconOnlyLabel="Models">
                  <span>Models</span>
                </Sidebar.MenuButton>
                <ul>
                  <Sidebar.SubMenuItem>Genesis</Sidebar.SubMenuItem>
                </ul>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar>
      </div>
    </Sidebar.Provider>
  ),
};

export const propHighlights = [
  quickStart,
  offcanvasWithLocationKey,
  rtlSideAware,
  collapsibleMenuItemDefault,
  collapsibleMenuItemControlled,
  collapsibleMenuItemCustomChevron,
];

export const commonPatternExamples = [
  {
    code: `<Sidebar.Provider defaultCollapsed={false}>
  <div style={{ display: 'flex', minHeight: 360 }}>
    <Sidebar>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Catalog</Sidebar.GroupLabel>
          <Sidebar.Menu>
            <Sidebar.MenuItem collapsible defaultOpen>
              <Sidebar.MenuButton iconOnlyLabel="Products">
                <span>Products</span>
              </Sidebar.MenuButton>
              <ul>
                <Sidebar.SubMenuItem>All products</Sidebar.SubMenuItem>
                <Sidebar.SubMenuItem>Collections</Sidebar.SubMenuItem>
                <Sidebar.SubMenuItem>Inventory</Sidebar.SubMenuItem>
              </ul>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>
    </Sidebar>
    <Sidebar.Inset>
      <main>Content</main>
    </Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
    id: 'pattern-collapsible-groups',
    label: 'Collapsible menu groups',
    render: (
      <Sidebar.Provider defaultCollapsed={false}>
        <div style={{ display: 'flex', minHeight: 360 }}>
          <Sidebar>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Catalog</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem collapsible defaultOpen>
                    <Sidebar.MenuButton iconOnlyLabel="Products">
                      <LuFolder aria-hidden />
                      <span>Products</span>
                    </Sidebar.MenuButton>
                    <ul>
                      <Sidebar.SubMenuItem>All products</Sidebar.SubMenuItem>
                      <Sidebar.SubMenuItem>Collections</Sidebar.SubMenuItem>
                      <Sidebar.SubMenuItem>Inventory</Sidebar.SubMenuItem>
                    </ul>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>Catalog workspace</main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
  {
    code: `<Sidebar.Provider defaultCollapsed={false}>
  <div style={{ display: 'flex', minHeight: 360 }}>
    <Sidebar>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Operations</Sidebar.GroupLabel>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton iconOnlyLabel="Builds">
                <span>Builds</span>
                <Badge tone="info" variant="soft">9</Badge>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton iconOnlyLabel="Incidents">
                <span>Incidents</span>
                <Badge tone="danger" variant="soft">3</Badge>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>
    </Sidebar>
  </div>
</Sidebar.Provider>`,
    id: 'pattern-status-badges',
    label: 'Status badges',
    render: (
      <Sidebar.Provider defaultCollapsed={false}>
        <div style={{ display: 'flex', minHeight: 360 }}>
          <Sidebar>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Operations</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton iconOnlyLabel="Builds">
                      <LuHammer aria-hidden />
                      <span>Builds</span>
                      <Badge tone="info" variant="soft">
                        9
                      </Badge>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton iconOnlyLabel="Incidents">
                      <LuTriangle aria-hidden />
                      <span>Incidents</span>
                      <Badge tone="danger" variant="soft">
                        3
                      </Badge>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>Operations dashboard</main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
  {
    code: `<Sidebar.Provider defaultCollapsed>
  <div style={{ display: 'flex', minHeight: 360 }}>
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Trigger as={Button} label="Toggle sidebar" size="small" variant="link" />
      </Sidebar.Header>
      <Sidebar.Content>{/* icon-first nav */}</Sidebar.Content>
      <Sidebar.Rail label="Expand sidebar" />
    </Sidebar>
  </div>
</Sidebar.Provider>`,
    id: 'pattern-collapsed-rail',
    label: 'Collapsed + rail',
    render: (
      <Sidebar.Provider defaultCollapsed>
        <div style={{ display: 'flex', minHeight: 360 }}>
          <Sidebar>
            <Sidebar.Header>
              <Sidebar.Trigger
                as={Button}
                label="Toggle sidebar"
                size="small"
                variant="link"
              />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton iconOnlyLabel="Dashboard">
                    <LuGauge aria-hidden />
                    <span>Dashboard</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton iconOnlyLabel="Projects">
                    <LuFolder aria-hidden />
                    <span>Projects</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Content>
            <Sidebar.Rail label="Expand sidebar" />
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>Collapsed navigation shell</main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
];

export const realisticSidebarExamples = [
  {
    code: `<Sidebar.Provider defaultCollapsed={false}>
  <div style={{ display: 'flex', minHeight: 420 }}>
    <Sidebar>
      <Sidebar.Content>{/* Product workspace navigation */}</Sidebar.Content>
      <Sidebar.Footer
        collapsedContent={<LuUser aria-hidden />}

        hideWhenCollapsed
      >
        Signed in as Taylor
      </Sidebar.Footer>
    </Sidebar>
    <Sidebar.Inset>{/* Product analytics content */}</Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
    id: 'realistic-product-workspace',
    label: 'Product workspace',
    render: (
      <Sidebar.Provider defaultCollapsed={false}>
        <div style={{ display: 'flex', minHeight: 420 }}>
          <Sidebar>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem active>
                    <Sidebar.MenuButton iconOnlyLabel="Dashboard">
                      <LuGauge aria-hidden />
                      <span>Dashboard</span>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem collapsible defaultOpen>
                    <Sidebar.MenuButton iconOnlyLabel="Models">
                      <LuFolder aria-hidden />
                      <span>Models</span>
                    </Sidebar.MenuButton>
                    <ul>
                      <Sidebar.SubMenuItem>Genesis</Sidebar.SubMenuItem>
                      <Sidebar.SubMenuItem>Explorer</Sidebar.SubMenuItem>
                      <Sidebar.SubMenuItem>Quantum</Sidebar.SubMenuItem>
                    </ul>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer
              collapsedContent={<LuUser aria-hidden />}
              hideWhenCollapsed
            >
              Signed in as Taylor
            </Sidebar.Footer>
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>
              <Heading level={4}>Analytics overview</Heading>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Monitor active users, feature adoption, and release health.
              </p>
            </main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
  {
    code: `<Sidebar.Provider collapseMode="offcanvas" defaultOpen={false}>
  <div style={{ display: 'flex', minHeight: 420 }}>
    <Sidebar mode="offcanvas">
      <Sidebar.Header>
        <Sidebar.Trigger as={Button} label="Toggle navigation" size="small" variant="link" />
      </Sidebar.Header>
      <Sidebar.Content>{/* Mobile docs nav */}</Sidebar.Content>
    </Sidebar>
    <Sidebar.Inset>{/* Documentation article */}</Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
    id: 'realistic-mobile-docs',
    label: 'Mobile docs nav',
    render: (
      <Sidebar.Provider collapseMode="offcanvas" defaultOpen={false}>
        <div style={{ display: 'flex', minHeight: 420 }}>
          <Sidebar mode="offcanvas">
            <Sidebar.Header>
              <Sidebar.Trigger
                as={Button}
                label="Toggle navigation"
                size="small"
                variant="link"
              />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Documentation</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton iconOnlyLabel="Getting started">
                      <span>Getting started</span>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem collapsible defaultOpen>
                    <Sidebar.MenuButton iconOnlyLabel="API reference">
                      <span>API reference</span>
                    </Sidebar.MenuButton>
                    <ul>
                      <Sidebar.SubMenuItem>Sidebar</Sidebar.SubMenuItem>
                      <Sidebar.SubMenuItem>Tooltip</Sidebar.SubMenuItem>
                      <Sidebar.SubMenuItem>Table</Sidebar.SubMenuItem>
                    </ul>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>
              <Heading level={4}>Sidebar component</Heading>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Compose desktop collapse and mobile offcanvas behavior.
              </p>
            </main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
  {
    code: `<Sidebar.Provider defaultCollapsed={false}>
  <div dir="rtl" style={{ display: 'flex', minHeight: 420 }}>
    <Sidebar side="end">
      <Sidebar.Content>{/* RTL customer portal nav */}</Sidebar.Content>
    </Sidebar>
    <Sidebar.Inset>{/* Account content */}</Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
    id: 'realistic-rtl-portal',
    label: 'RTL customer portal',
    render: (
      <Sidebar.Provider defaultCollapsed={false} side="end">
        <div dir="rtl" style={{ display: 'flex', minHeight: 420 }}>
          <Sidebar side="end">
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>حسابي</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem active>
                    <Sidebar.MenuButton iconOnlyLabel="نظرة عامة">
                      <span>نظرة عامة</span>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton iconOnlyLabel="الفواتير">
                      <span>الفواتير</span>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>
              <Heading level={4}>بوابة العملاء</Heading>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Navigation is anchored to logical end in RTL layouts.
              </p>
            </main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
];

const mainArea = (
  <div style={{ padding: '1rem', paddingTop: '2.5rem' }}>
    <Heading level={4}>Overview</Heading>
    <p style={{ color: 'var(--color-text-muted)' }}>
      Main content scrolls independently while navigation stays pinned for fast
      context switching.
    </p>
    <div
      style={{
        display: 'grid',
        gap: '0.75rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
        marginTop: '1rem',
      }}
    >
      <Card>
        <Card.Header>
          <Heading level={5}>Deployments</Heading>
        </Card.Header>
        <Card.Body>
          <p>12 active services · 99.98% uptime</p>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Heading level={5}>Alerts</Heading>
        </Card.Header>
        <Card.Body>
          <p>3 incidents requiring attention · 1 critical</p>
        </Card.Body>
      </Card>
    </div>
  </div>
);

const sidebarShellMenu = (
  <>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
      <Sidebar.Menu>
        <Sidebar.MenuItem active>
          <GuideTooltipMenuButton iconOnlyLabel="Dashboard">
            <LuGauge aria-hidden />
            <span>Dashboard</span>
          </GuideTooltipMenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <GuideTooltipMenuButton iconOnlyLabel="Projects">
            <LuFolder aria-hidden />
            <span>Projects</span>
          </GuideTooltipMenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Operations</Sidebar.GroupLabel>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <GuideTooltipMenuButton iconOnlyLabel="Builds">
            <LuHammer aria-hidden />
            <span>Builds</span>
            <Badge tone="info" variant="soft">
              9
            </Badge>
          </GuideTooltipMenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <GuideTooltipMenuButton iconOnlyLabel="Incidents">
            <LuTriangle aria-hidden />
            <span>Incidents</span>
            <Badge tone="danger" variant="soft">
              3
            </Badge>
          </GuideTooltipMenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  </>
);

export const layoutShellExamples = [
  {
    code: `<Sidebar.Provider defaultCollapsed={false}>
  <div style={{ display: 'flex', minHeight: 560 }}>
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Trigger as={Button} label="Toggle sidebar" size="small"
                variant="link" />
      </Sidebar.Header>
      <Sidebar.Content>{/* groups + menu items */}</Sidebar.Content>
      <Sidebar.Footer
        collapsedContent={<LuUser aria-hidden />}

      >
        <span
          style={{ alignItems: 'center', display: 'inline-flex', gap: '0.5rem' }}
        >
          <LuUser aria-hidden />
          <span>Signed in as Buzz</span>
        </span>
      </Sidebar.Footer>
      <Sidebar.Rail label="Expand sidebar" />
    </Sidebar>
    <Sidebar.Inset>
      <main>{/* dashboard content */}</main>
    </Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
    id: 'basic-usage',
    label: 'Basic usage',
    render: (
      <Sidebar.Provider defaultCollapsed={false}>
        <div style={{ display: 'flex', minHeight: 560 }}>
          <Sidebar>
            <Sidebar.Header>
              <Sidebar.Trigger
                as={Button}
                label="Toggle sidebar"
                size="small"
                variant="link"
              />
            </Sidebar.Header>
            <Sidebar.Content>{sidebarShellMenu}</Sidebar.Content>
            <Sidebar.Footer collapsedContent={<LuUser aria-hidden />}>
              <span
                style={{
                  alignItems: 'center',
                  display: 'inline-flex',
                  gap: '0.5rem',
                }}
              >
                <LuUser aria-hidden />
                <span>Signed in as Buzz</span>
              </span>
            </Sidebar.Footer>
            <Sidebar.Rail label="Expand sidebar" />
          </Sidebar>
          <Sidebar.Inset>{mainArea}</Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
  {
    code: `<Sidebar.Provider defaultCollapsed>
  <div style={{ display: 'flex', minHeight: 560 }}>
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Trigger
          as={Button}
          label="Toggle sidebar"
          size="small"
          variant="link"
        />
      </Sidebar.Header>
      <Sidebar.Content>{/* icon-first navigation */}</Sidebar.Content>
      <Sidebar.Footer
        collapsedContent={<LuUser aria-hidden />}

      >
        Account
      </Sidebar.Footer>
      <Sidebar.Rail label="Expand sidebar" />
    </Sidebar>
    <Sidebar.Inset>
      <main>{/* content area */}</main>
    </Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
    id: 'collapsed',
    label: 'Collapsed',
    render: (
      <Sidebar.Provider defaultCollapsed>
        <div style={{ display: 'flex', minHeight: 560 }}>
          <Sidebar>
            <Sidebar.Header>
              <Sidebar.Trigger
                as={Button}
                label="Toggle sidebar"
                size="small"
                variant="link"
              />
            </Sidebar.Header>
            <Sidebar.Content>{sidebarShellMenu}</Sidebar.Content>
            <Sidebar.Footer collapsedContent={<LuUser aria-hidden />}>
              Account
            </Sidebar.Footer>
            <Sidebar.Rail label="Expand sidebar" />
          </Sidebar>
          <Sidebar.Inset>{mainArea}</Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
  {
    code: `<Sidebar.Provider defaultCollapsed={false}>
  <div style={{ display: 'flex', minHeight: 560 }}>
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Trigger as={Button} label="Toggle sidebar" size="small" variant="link" />
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Catalog</Sidebar.GroupLabel>
          <Sidebar.Menu>
            <Sidebar.MenuItem collapsible defaultOpen>
              <Sidebar.MenuButton iconOnlyLabel="Products">
                <LuFolder aria-hidden />
                <span>Products</span>
              </Sidebar.MenuButton>
              <ul>
                <Sidebar.SubMenuItem>
                  <a href="/products" onClick={(e) => e.preventDefault()}>
                    All products
                  </a>
                </Sidebar.SubMenuItem>
                <Sidebar.SubMenuItem>
                  <a href="/collections" onClick={(e) => e.preventDefault()}>
                    Collections
                  </a>
                </Sidebar.SubMenuItem>
                <Sidebar.SubMenuItem>
                  <a href="/inventory" onClick={(e) => e.preventDefault()}>
                    Inventory
                  </a>
                </Sidebar.SubMenuItem>
              </ul>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton iconOnlyLabel="Dashboard">
                <LuGauge aria-hidden />
                <span>Dashboard</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer
        collapsedContent={<LuFolder aria-hidden />}

        hideWhenCollapsed
      >
        Catalog workspace
      </Sidebar.Footer>
      <Sidebar.Rail label="Expand sidebar" />
    </Sidebar>
    <Sidebar.Inset>
      <main style={{ padding: '1rem' }}>Content</main>
    </Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
    id: 'folders',
    label: 'Folders',
    render: (
      <Sidebar.Provider defaultCollapsed={false}>
        <div style={{ display: 'flex', minHeight: 560 }}>
          <Sidebar>
            <Sidebar.Header>
              <Sidebar.Trigger
                as={Button}
                label="Toggle sidebar"
                size="small"
                variant="link"
              />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Catalog</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem collapsible defaultOpen>
                    <Sidebar.MenuButton iconOnlyLabel="Products">
                      <LuFolder aria-hidden />
                      <span>Products</span>
                    </Sidebar.MenuButton>
                    <ul>
                      <Sidebar.SubMenuItem>
                        <a
                          href="/products"
                          onClick={preventDocsNavigation}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          All products
                        </a>
                      </Sidebar.SubMenuItem>
                      <Sidebar.SubMenuItem>
                        <a
                          href="/collections"
                          onClick={preventDocsNavigation}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          Collections
                        </a>
                      </Sidebar.SubMenuItem>
                      <Sidebar.SubMenuItem>
                        <a
                          href="/inventory"
                          onClick={preventDocsNavigation}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          Inventory
                        </a>
                      </Sidebar.SubMenuItem>
                    </ul>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton iconOnlyLabel="Dashboard">
                      <LuGauge aria-hidden />
                      <span>Dashboard</span>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer
              collapsedContent={<LuFolder aria-hidden />}
              hideWhenCollapsed
            >
              Catalog workspace
            </Sidebar.Footer>
            <Sidebar.Rail label="Expand sidebar" />
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>Catalog content</main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
  {
    code: `<Sidebar.Provider defaultCollapsed={false}>
  <div style={{ display: 'flex', minHeight: 560 }}>
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Trigger as={Button} label="Toggle sidebar" size="small" variant="link" />
      </Sidebar.Header>
      <Sidebar.Content>{/* use rail to collapse/expand */}</Sidebar.Content>
      <Sidebar.Rail label="Toggle rail" />
    </Sidebar>
    <Sidebar.Inset>
      <main>{/* rail-focused content */}</main>
    </Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
    id: 'rail',
    label: 'Rail',
    render: (
      <Sidebar.Provider defaultCollapsed={false}>
        <div style={{ display: 'flex', minHeight: 560 }}>
          <Sidebar>
            <Sidebar.Header>
              <Sidebar.Trigger
                as={Button}
                label="Toggle sidebar"
                size="small"
                variant="link"
              />
            </Sidebar.Header>
            <Sidebar.Content>{sidebarShellMenu}</Sidebar.Content>
            <Sidebar.Footer collapsedContent={<LuUser aria-hidden />}>
              Rail demo
            </Sidebar.Footer>
            <Sidebar.Rail label="Toggle rail" />
          </Sidebar>
          <Sidebar.Inset>
            <main style={{ padding: '1rem' }}>
              <Heading level={4}>Rail interaction</Heading>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Use the rail on the sidebar edge to quickly collapse or expand
                navigation.
              </p>
            </main>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    ),
  },
];

export const layoutRegionExample = {
  code: `<Sidebar.Provider defaultCollapsed={false}>
  <Sidebar>
    <Sidebar.Header>
      <Sidebar.Trigger
        as={Button}
        label="Toggle sidebar"
        placement="manual"
        size="small"
        variant="link"
      />
    </Sidebar.Header>
    <Sidebar.Content>{/* region-focused sidebar */}</Sidebar.Content>
    <Sidebar.Footer
      collapsedContent={<LuUser aria-hidden />}

      hideWhenCollapsed
    >
      Workspace settings
    </Sidebar.Footer>
  </Sidebar>
</Sidebar.Provider>`,
  id: 'persistent-nav',
  label: 'Persistent navigation',
  render: (
    <Sidebar.Provider defaultCollapsed={false}>
      <Sidebar>
        <Sidebar.Header>
          <Sidebar.Trigger
            as={Button}
            label="Toggle sidebar"
            placement="manual"
            size="small"
            variant="link"
          />
        </Sidebar.Header>
        <Sidebar.Content>{sidebarShellMenu}</Sidebar.Content>
        <Sidebar.Footer
          collapsedContent={<LuUser aria-hidden />}
          hideWhenCollapsed
        >
          Workspace settings
        </Sidebar.Footer>
      </Sidebar>
    </Sidebar.Provider>
  ),
};

export const triggerWithTooltip = {
  code: `<Sidebar.Provider defaultCollapsed={false}>
  <div style={{ display: 'flex', minHeight: 260 }}>
    <Sidebar>
      <Sidebar.Header>
        <Tooltip content="Toggle sidebar" portal={false}>
          <Sidebar.Trigger
            as={Button}
            icon={<VscLayoutSidebarLeftDock aria-hidden />}
            label="Toggle sidebar"
            placement="inside"
            size="small"
            style={{ borderRadius: '0.25rem' }}
            variant="link"
          />
        </Tooltip>
      </Sidebar.Header>
      <Sidebar.Content>{/* menu content */}</Sidebar.Content>
    </Sidebar>
    <Sidebar.Inset>
      <main style={{ padding: '1rem' }}>Content</main>
    </Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
  id: 'trigger-tooltip',
  label: 'Trigger with tooltip',
  render: (
    <Sidebar.Provider defaultCollapsed={false}>
      <div style={{ display: 'flex', minHeight: 260 }}>
        <Sidebar>
          <Sidebar.Header>
            <Tooltip content="Toggle sidebar" portal={false}>
              <Sidebar.Trigger
                as={Button}
                icon={<VscLayoutSidebarLeftDock aria-hidden />}
                label="Toggle sidebar"
                placement="inside"
                size="small"
                style={{ borderRadius: '0.25rem' }}
                variant="link"
              />
            </Tooltip>
          </Sidebar.Header>
          <Sidebar.Content>{sidebarShellMenu}</Sidebar.Content>
        </Sidebar>
        <Sidebar.Inset>
          <main style={{ padding: '1rem' }}>Content</main>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  ),
};
