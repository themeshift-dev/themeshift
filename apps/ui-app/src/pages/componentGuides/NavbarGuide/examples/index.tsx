import { Button } from '@themeshift/ui/components/Button';
import {
  Navbar,
  NavbarContainer,
  NavbarSection,
} from '@themeshift/ui/components/Navbar';

export const basicUsage = {
  code: `<Navbar aria-label="Primary navigation">
  <Navbar.Container>
    <Navbar.Section align="start">
      <a href="/">ThemeShift</a>
    </Navbar.Section>

    <Navbar.Section align="center">
      <a href="/components">Components</a>
      <a href="/tokens">Tokens</a>
    </Navbar.Section>

    <Navbar.Section align="end">
      <Button size="small">Sign in</Button>
    </Navbar.Section>
  </Navbar.Container>
</Navbar>`,
  label: 'Compound API',
  sample: (
    <Navbar aria-label="Primary navigation">
      <Navbar.Container>
        <Navbar.Section align="start">
          <a href="/">ThemeShift</a>
        </Navbar.Section>

        <Navbar.Section align="center">
          <a href="/components">Components</a>
          <a href="/tokens">Tokens</a>
        </Navbar.Section>

        <Navbar.Section align="end">
          <Button size="small">Sign in</Button>
        </Navbar.Section>
      </Navbar.Container>
    </Navbar>
  ),
};

export const containerControls = {
  code: `<Navbar aria-label="Primary navigation">
  <Navbar.Container gap="1.5rem" maxWidth="60rem">
    <Navbar.Section align="start">
      <a href="/">ThemeShift</a>
    </Navbar.Section>
    <Navbar.Section align="end" gap="0.75rem">
      <Button intent="secondary" size="small">Contact</Button>
      <Button size="small">Get started</Button>
    </Navbar.Section>
  </Navbar.Container>
</Navbar>`,
  label: 'Container and gap',
  sample: (
    <Navbar aria-label="Primary navigation">
      <Navbar.Container gap="1.5rem" maxWidth="60rem">
        <Navbar.Section align="start">
          <a href="/">ThemeShift</a>
        </Navbar.Section>

        <Navbar.Section align="end" gap="0.75rem">
          <Button intent="secondary" size="small">
            Contact
          </Button>
          <Button size="small">Get started</Button>
        </Navbar.Section>
      </Navbar.Container>
    </Navbar>
  ),
};

export const standalonePrimitives = {
  code: `<NavbarContainer>
  <NavbarSection align="start">
    <a href="/design">Design</a>
  </NavbarSection>
  <NavbarSection align="center">
    <a href="/systems">Systems</a>
  </NavbarSection>
  <NavbarSection align="end">
    <Button intent="secondary" size="small">Contact</Button>
  </NavbarSection>
</NavbarContainer>`,
  label: 'Standalone primitives',
  sample: (
    <NavbarContainer>
      <NavbarSection align="start">
        <a href="/design">Design</a>
      </NavbarSection>
      <NavbarSection align="center">
        <a href="/systems">Systems</a>
      </NavbarSection>
      <NavbarSection align="end">
        <Button intent="secondary" size="small">
          Contact
        </Button>
      </NavbarSection>
    </NavbarContainer>
  ),
};

export const wrappedSection = {
  code: `<Navbar aria-label="Secondary navigation">
  <Navbar.Container>
    <Navbar.Section align="start" gap="0.5rem" wrap>
      <a href="/docs/getting-started">Getting started</a>
      <a href="/docs/components">Components</a>
      <a href="/docs/tokens">Tokens</a>
      <a href="/docs/themes">Themes</a>
    </Navbar.Section>
  </Navbar.Container>
</Navbar>`,
  label: 'Wrapping links',
  sample: (
    <Navbar aria-label="Secondary navigation">
      <Navbar.Container>
        <Navbar.Section align="start" gap="0.5rem" wrap>
          <a href="/docs/getting-started">Getting started</a>
          <a href="/docs/components">Components</a>
          <a href="/docs/tokens">Tokens</a>
          <a href="/docs/themes">Themes</a>
        </Navbar.Section>
      </Navbar.Container>
    </Navbar>
  ),
};

export const propHighlights = [
  basicUsage,
  containerControls,
  standalonePrimitives,
];
