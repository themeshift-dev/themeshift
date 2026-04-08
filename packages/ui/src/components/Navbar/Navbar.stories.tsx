import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/Button';
import { Navbar, NavbarContainer, NavbarSection } from '@/components/Navbar';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Primary navigation',
    position: 'static',
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compound: Story = {
  render: (args) => (
    <Navbar {...args}>
      <Navbar.Container>
        <Navbar.Section align="start">
          <a href="/">ThemeShift</a>
        </Navbar.Section>

        <Navbar.Section align="center">
          <a href="/docs">Docs</a>
          <a href="/tokens">Tokens</a>
          <a href="/themes">Themes</a>
        </Navbar.Section>

        <Navbar.Section align="end">
          <Button size="small">Sign in</Button>
        </Navbar.Section>
      </Navbar.Container>
    </Navbar>
  ),
};

export const StandalonePrimitives: Story = {
  render: () => (
    <NavbarContainer>
      <NavbarSection align="start">
        <a href="/design">Design</a>
      </NavbarSection>

      <NavbarSection align="center">
        <a href="/systems">Systems</a>
      </NavbarSection>

      <NavbarSection align="end">
        <Button size="small" intent="secondary">
          Contact
        </Button>
      </NavbarSection>
    </NavbarContainer>
  ),
};
