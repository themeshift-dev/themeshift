import { Button } from '@themeshift/ui/components/Button';
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

export const overlayPlacement = {
  code: `<Navbar aria-label="Overlay navigation" position="sticky" surface="elevated">
  <Navbar.Container>
    <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
    <Navbar.Toggle aria-label="Open navigation">Open menu</Navbar.Toggle>
  </Navbar.Container>

  <Navbar.Menu
    labelledBy="overlay-menu-title"
    onClickOutside="close"
    placement="overlay"
  >
    <h3 id="overlay-menu-title">Navigation</h3>
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
  label: 'Overlay placement',
  sample: (
    <Navbar
      aria-label="Overlay navigation"
      position="sticky"
      surface="elevated"
    >
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
        <Navbar.Toggle aria-label="Open navigation">Open menu</Navbar.Toggle>
      </Navbar.Container>

      <Navbar.Menu
        labelledBy="overlay-menu-title"
        onClickOutside="close"
        placement="overlay"
      >
        <h3 id="overlay-menu-title">Navigation</h3>
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

export const propHighlights = [quickStart, responsiveMenu, floatingSticky];
export const behaviorExamples = [
  overlayPlacement,
  onClickOutsideCallback,
  asChildExample,
];
