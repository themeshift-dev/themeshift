import { Button } from '@themeshift/ui/components/Button';
import {
  FocusLock,
  type FocusLockAdapterComponent,
} from '@themeshift/ui/components/FocusLock';
import { Navbar } from '@themeshift/ui/components/Navbar';

export const quickStart = {
  code: `<Navbar aria-label="Primary navigation">
  <Navbar.Container>
    <Navbar.Brand href="/">ThemeShift</Navbar.Brand>

    <Navbar.List>
      <Navbar.Item>
        <Navbar.Link href="/docs">Docs</Navbar.Link>
      </Navbar.Item>
      <Navbar.Item>
        <Navbar.Link href="/pricing">Pricing</Navbar.Link>
      </Navbar.Item>
    </Navbar.List>

    <Navbar.Actions>
      <Button size="small">Get started</Button>
    </Navbar.Actions>
  </Navbar.Container>
</Navbar>`,
  label: 'Quick start',
  sample: (
    <Navbar aria-label="Primary navigation">
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>

        <Navbar.List>
          <Navbar.Item>
            <Navbar.Link href="/docs">Docs</Navbar.Link>
          </Navbar.Item>
          <Navbar.Item>
            <Navbar.Link href="/pricing">Pricing</Navbar.Link>
          </Navbar.Item>
        </Navbar.List>

        <Navbar.Actions>
          <Button size="small">Get started</Button>
        </Navbar.Actions>
      </Navbar.Container>
    </Navbar>
  ),
};

export const responsiveMenu = {
  code: `<Navbar aria-label="Primary navigation">
  <Navbar.Container>
    <Navbar.Brand href="/">ThemeShift</Navbar.Brand>

    <Navbar.Content hideBelow="tablet">
      <Navbar.List>
        <Navbar.Item>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Item>
        <Navbar.Item>
          <Navbar.Link href="/components">Components</Navbar.Link>
        </Navbar.Item>
      </Navbar.List>
    </Navbar.Content>

    <Navbar.Actions hideBelow="tablet">
      <Button intent="secondary" size="small">Sign in</Button>
      <Button size="small">Get started</Button>
    </Navbar.Actions>

    <Navbar.Toggle
      aria-label={(isOpen) => (isOpen ? 'Close navigation' : 'Open navigation')}
      showBelow="tablet"
    >
      {(isOpen) => (isOpen ? 'Close' : 'Menu')}
    </Navbar.Toggle>
  </Navbar.Container>

  <Navbar.Menu
    labelledBy="navbar-mobile-heading"
    onClickOutside="toggle"
    showBelow="tablet"
  >
    <h3 id="navbar-mobile-heading">Navigation</h3>
    <Navbar.List>
      <Navbar.Item>
        <Navbar.Link href="/docs">Docs</Navbar.Link>
      </Navbar.Item>
      <Navbar.Item>
        <Navbar.Link href="/components">Components</Navbar.Link>
      </Navbar.Item>
    </Navbar.List>
  </Navbar.Menu>
</Navbar>`,
  label: 'Responsive menu',
  sample: (
    <Navbar aria-label="Primary navigation">
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>

        <Navbar.Content hideBelow="tablet">
          <Navbar.List>
            <Navbar.Item>
              <Navbar.Link href="/docs">Docs</Navbar.Link>
            </Navbar.Item>
            <Navbar.Item>
              <Navbar.Link href="/components">Components</Navbar.Link>
            </Navbar.Item>
          </Navbar.List>
        </Navbar.Content>

        <Navbar.Actions hideBelow="tablet">
          <Button intent="secondary" size="small">
            Sign in
          </Button>
          <Button size="small">Get started</Button>
        </Navbar.Actions>

        <Navbar.Toggle
          aria-label={(isOpen) =>
            isOpen ? 'Close navigation' : 'Open navigation'
          }
          showBelow="tablet"
        >
          {(isOpen) => (isOpen ? 'Close' : 'Menu')}
        </Navbar.Toggle>
      </Navbar.Container>

      <Navbar.Menu
        labelledBy="navbar-mobile-heading"
        onClickOutside="toggle"
        showBelow="tablet"
      >
        <h3 id="navbar-mobile-heading">Navigation</h3>
        <Navbar.List>
          <Navbar.Item>
            <Navbar.Link href="/docs">Docs</Navbar.Link>
          </Navbar.Item>
          <Navbar.Item>
            <Navbar.Link href="/components">Components</Navbar.Link>
          </Navbar.Item>
        </Navbar.List>
      </Navbar.Menu>
    </Navbar>
  ),
};

export const floatingSticky = {
  code: `<Navbar
  aria-label="Product navigation"
  floating
  position="sticky"
  surface="elevated"
>
  <Navbar.Container maxWidth="xLarge" width="contained">
    <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
    <Navbar.Actions>
      <Button intent="secondary" size="small">Contact</Button>
      <Button size="small">Get started</Button>
    </Navbar.Actions>
  </Navbar.Container>
</Navbar>`,
  label: 'Floating + sticky',
  sample: (
    <Navbar
      aria-label="Product navigation"
      floating
      position="sticky"
      surface="elevated"
    >
      <Navbar.Container maxWidth="xLarge" width="contained">
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
        <Navbar.Actions>
          <Button intent="secondary" size="small">
            Contact
          </Button>
          <Button size="small">Get started</Button>
        </Navbar.Actions>
      </Navbar.Container>
    </Navbar>
  ),
};

export const drawerPlacement = {
  code: `<Navbar aria-label="Drawer navigation" position="sticky" surface="elevated">
  <Navbar.Container>
    <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
    <Navbar.Toggle aria-label="Open navigation">Open menu</Navbar.Toggle>
  </Navbar.Container>

  <Navbar.Menu
    labelledBy="drawer-menu-title"
    onClickOutside="close"
    placement="drawer"
  >
    <h3 id="drawer-menu-title">Navigation</h3>
    <Navbar.List>
      <Navbar.Item>
        <Navbar.Link href="/docs">Docs</Navbar.Link>
      </Navbar.Item>
      <Navbar.Item>
        <Navbar.Link href="/components">Components</Navbar.Link>
      </Navbar.Item>
    </Navbar.List>
  </Navbar.Menu>
</Navbar>`,
  label: 'Drawer placement',
  sample: (
    <Navbar aria-label="Drawer navigation" position="sticky" surface="elevated">
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
        <Navbar.Toggle aria-label="Open navigation">Open menu</Navbar.Toggle>
      </Navbar.Container>

      <Navbar.Menu
        labelledBy="drawer-menu-title"
        onClickOutside="close"
        placement="drawer"
      >
        <h3 id="drawer-menu-title">Navigation</h3>
        <Navbar.List>
          <Navbar.Item>
            <Navbar.Link href="/docs">Docs</Navbar.Link>
          </Navbar.Item>
          <Navbar.Item>
            <Navbar.Link href="/components">Components</Navbar.Link>
          </Navbar.Item>
        </Navbar.List>
      </Navbar.Menu>
    </Navbar>
  ),
};

export const onClickOutsideCallback = {
  code: `<Navbar aria-label="Primary navigation">
  <Navbar.Container>
    <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
    <Navbar.Toggle
      aria-label={(isOpen) => (isOpen ? 'Close menu' : 'Open menu')}
      showBelow="tablet"
    >
      {(isOpen) => (isOpen ? 'Close' : 'Menu')}
    </Navbar.Toggle>
  </Navbar.Container>

  <Navbar.Menu
    labelledBy="callback-menu-title"
    onClickOutside={({ close }) => {
      externalSideEffect();
      close();
    }}
    showBelow="tablet"
  >
    <h3 id="callback-menu-title">Navigation</h3>
    <Navbar.List>
      <Navbar.Item>
        <Navbar.Link href="/docs">Docs</Navbar.Link>
      </Navbar.Item>
      <Navbar.Item>
        <Navbar.Link href="/components">Components</Navbar.Link>
      </Navbar.Item>
    </Navbar.List>
  </Navbar.Menu>
</Navbar>`,
  label: 'onClickOutside callback',
  sample: () => (
    <Navbar aria-label="Primary navigation">
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
        <Navbar.Toggle
          aria-label={(isOpen) => (isOpen ? 'Close menu' : 'Open menu')}
          showBelow="tablet"
        >
          {(isOpen) => (isOpen ? 'Close' : 'Menu')}
        </Navbar.Toggle>
      </Navbar.Container>

      <Navbar.Menu
        labelledBy="callback-menu-title"
        onClickOutside={({ close }) => {
          close();
        }}
        showBelow="tablet"
      >
        <h3 id="callback-menu-title">Navigation</h3>
        <Navbar.List>
          <Navbar.Item>
            <Navbar.Link href="/docs">Docs</Navbar.Link>
          </Navbar.Item>
          <Navbar.Item>
            <Navbar.Link href="/components">Components</Navbar.Link>
          </Navbar.Item>
        </Navbar.List>
      </Navbar.Menu>
    </Navbar>
  ),
};

export const asChildExample = {
  code: `<Navbar aria-label="Primary navigation">
  <Navbar.Container>
    <Navbar.Brand asChild href="/">
      <a>ThemeShift</a>
    </Navbar.Brand>

    <Navbar.Toggle aria-label="Open navigation" asChild>
      <button type="button">Toggle</button>
    </Navbar.Toggle>
  </Navbar.Container>
</Navbar>`,
  label: 'asChild',
  sample: (
    <Navbar aria-label="Primary navigation">
      <Navbar.Container>
        <Navbar.Brand asChild href="/">
          <a>ThemeShift</a>
        </Navbar.Brand>

        <Navbar.Toggle aria-label="Open navigation" asChild>
          <button type="button">Toggle</button>
        </Navbar.Toggle>
      </Navbar.Container>
    </Navbar>
  ),
};

const softFocusLockAdapter: FocusLockAdapterComponent = ({
  active,
  autoFocus,
  children,
  containerRef,
  returnFocus,
  shards,
}) => (
  <FocusLock
    active={active}
    autoFocus={autoFocus}
    containerRef={containerRef}
    returnFocus={returnFocus}
    shards={shards}
  >
    <div
      data-focus-lock-adapter="soft-outline"
      style={{ outline: active ? '2px solid currentColor' : 'none' }}
    >
      {children}
    </div>
  </FocusLock>
);

export const customFocusLockAdapter = {
  code: `const softFocusLockAdapter: FocusLockAdapterComponent = ({
  active,
  autoFocus,
  children,
  containerRef,
  returnFocus,
  shards,
}) => (
  <FocusLock
    active={active}
    autoFocus={autoFocus}
    containerRef={containerRef}
    returnFocus={returnFocus}
    shards={shards}
  >
    <div data-focus-lock-adapter="soft-outline">{children}</div>
  </FocusLock>
);

<Navbar.Menu
  focusLockComponent={softFocusLockAdapter}
  placement="drawer"
>
  ...
</Navbar.Menu>`,
  label: 'Custom focus lock adapter',
  sample: (
    <Navbar aria-label="Primary navigation">
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
        <Navbar.Toggle aria-label="Open navigation">Open menu</Navbar.Toggle>
      </Navbar.Container>

      <Navbar.Menu
        defaultOpen
        focusLockComponent={softFocusLockAdapter}
        labelledBy="adapter-menu-title"
        placement="drawer"
      >
        <h3 id="adapter-menu-title">Navigation</h3>
        <Navbar.List>
          <Navbar.Item>
            <Navbar.Link href="/docs">Docs</Navbar.Link>
          </Navbar.Item>
          <Navbar.Item>
            <Navbar.Link href="/components">Components</Navbar.Link>
          </Navbar.Item>
        </Navbar.List>
      </Navbar.Menu>
    </Navbar>
  ),
};

export const propHighlights = [quickStart, responsiveMenu, floatingSticky];
export const behaviorExamples = [
  drawerPlacement,
  onClickOutsideCallback,
  asChildExample,
  customFocusLockAdapter,
];
