import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/Button';
import { Navbar } from '@/components/Navbar';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Primary navigation',
    position: 'static',
    surface: 'default',
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compound: Story = {
  render: (args) => (
    <Navbar {...args}>
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
            <Navbar.Item>
              <Navbar.Link href="/tokens">Tokens</Navbar.Link>
            </Navbar.Item>
          </Navbar.List>
        </Navbar.Content>

        <Navbar.Actions hideBelow="tablet">
          <Button intent="secondary" size="small">
            Sign in
          </Button>
          <Button size="small">Get started</Button>
        </Navbar.Actions>

        <Navbar.Toggle aria-label="Open navigation" showBelow="tablet" />
      </Navbar.Container>

      <Navbar.Menu showBelow="tablet">
        <Navbar.List>
          <Navbar.Item>
            <Navbar.Link href="/docs">Docs</Navbar.Link>
          </Navbar.Item>
          <Navbar.Item>
            <Navbar.Link href="/components">Components</Navbar.Link>
          </Navbar.Item>
          <Navbar.Item>
            <Navbar.Link href="/tokens">Tokens</Navbar.Link>
          </Navbar.Item>
        </Navbar.List>
      </Navbar.Menu>
    </Navbar>
  ),
};

export const DrawerMenu: Story = {
  render: () => (
    <Navbar
      aria-label="Primary navigation"
      position="sticky"
      surface="elevated"
    >
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
        <Navbar.Toggle aria-label="Open navigation">Open</Navbar.Toggle>
      </Navbar.Container>

      <Navbar.Menu labelledBy="navbar-drawer-title" placement="drawer">
        <h3 id="navbar-drawer-title">Navigation</h3>
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
