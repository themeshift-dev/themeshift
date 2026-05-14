import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Sidebar } from './index';
import styles from './Sidebar.module.scss';

describe('Sidebar', () => {
  it('supports the compound API', () => {
    expect(Sidebar.Provider).toBeDefined();
    expect(Sidebar.Header).toBeDefined();
    expect(Sidebar.Content).toBeDefined();
    expect(Sidebar.Footer).toBeDefined();
    expect(Sidebar.Group).toBeDefined();
    expect(Sidebar.Menu).toBeDefined();
    expect(Sidebar.MenuItem).toBeDefined();
    expect(Sidebar.MenuButton).toBeDefined();
    expect(Sidebar.Rail).toBeDefined();
    expect(Sidebar.Trigger).toBeDefined();
    expect(Sidebar.Inset).toBeDefined();
  });

  it('renders as aside by default with aria label', () => {
    render(
      <Sidebar.Provider>
        <Sidebar>Menu</Sidebar>
      </Sidebar.Provider>
    );

    expect(
      screen.getByRole('complementary', { name: 'Primary navigation' })
    ).toBeInTheDocument();
  });

  it('toggles collapsed state from trigger in collapsible mode', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Trigger label="Toggle sidebar" />
        </Sidebar>
      </Sidebar.Provider>
    );

    const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
    await user.click(trigger);

    const sidebar = screen.getByRole('complementary');

    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    expect(sidebar).toHaveClass(styles.collapsed);
  });

  it('applies custom width variables and collapsed sizing class', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Provider>
        <Sidebar collapsedWidth="5rem" width="18rem">
          <Sidebar.Trigger label="Toggle sidebar" />
        </Sidebar>
      </Sidebar.Provider>
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveStyle({
      '--sidebar-collapsed-width': '5rem',
      '--sidebar-width': '18rem',
    });
    expect(sidebar).not.toHaveClass(styles.collapsed);

    const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
    await user.click(trigger);

    expect(sidebar).toHaveClass(styles.collapsed);
  });

  it('renders outside trigger placement by default', () => {
    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Trigger label="Toggle sidebar" />
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByRole('button', { name: 'Toggle sidebar' })).toHaveClass(
      styles.triggerOutside
    );
  });

  it('supports inside and manual trigger placement', () => {
    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Trigger label="Inside trigger" placement="inside" />
          <Sidebar.Trigger label="Manual trigger" placement="manual" />
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByRole('button', { name: 'Inside trigger' })).toHaveClass(
      styles.triggerInside
    );
    expect(
      screen.getByRole('button', { name: 'Manual trigger' })
    ).not.toHaveClass(styles.triggerOutside);
  });

  it('supports trigger visibility callback based on collapsed state', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Trigger label="Collapse sidebar" />
          <Sidebar.Trigger
            isVisible={(collapsed) => collapsed}
            label="Collapsed only"
            placement="inside"
          />
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(
      screen.queryByRole('button', { name: 'Collapsed only' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    expect(
      screen.getByRole('button', { name: 'Collapsed only' })
    ).toBeInTheDocument();
  });

  it('wires aria-controls to the sidebar root and keeps pass-through props', () => {
    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Trigger
            data-testid="sidebar-trigger"
            label="Open sidebar"
            placement="inside"
          />
        </Sidebar>
      </Sidebar.Provider>
    );

    const sidebar = screen.getByRole('complementary');
    const trigger = screen.getByTestId('sidebar-trigger');

    expect(trigger).toHaveAttribute('aria-controls', sidebar.id);
  });

  it('forwards trigger refs to support composition wrappers like Tooltip', () => {
    const triggerRef = createRef<HTMLElement>();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Trigger
            label="Trigger with ref"
            placement="inside"
            ref={triggerRef}
          />
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLElement);
    expect(triggerRef.current).toHaveAttribute(
      'aria-label',
      'Trigger with ref'
    );
  });

  it('shows collapsed footer content while collapsed', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Trigger label="Toggle sidebar" placement="inside" />
          <Sidebar.Footer collapsedContent={<span aria-hidden>User</span>}>
            Signed in as Buzz
          </Sidebar.Footer>
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByText('Signed in as Buzz')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    expect(screen.queryByText('Signed in as Buzz')).not.toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('renders rail as an edge-anchored overlay in LTR and RTL side variants', () => {
    const { rerender } = render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Rail label="Expand sidebar" />
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveClass(
      styles.rail
    );
    expect(screen.getByRole('complementary')).toHaveClass(styles.sideStart);

    rerender(
      <Sidebar.Provider side="end">
        <Sidebar side="end">
          <Sidebar.Rail label="Expand sidebar" />
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByRole('complementary')).toHaveClass(styles.sideEnd);
  });

  it('toggles collapsed state from the rail button', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Rail label="Expand sidebar" />
        </Sidebar>
      </Sidebar.Provider>
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).not.toHaveClass(styles.collapsed);

    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

    expect(sidebar).toHaveClass(styles.collapsed);
  });

  it('keeps collapsed icon menu buttons centered with rail present', () => {
    render(
      <Sidebar.Provider defaultCollapsed>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton iconOnlyLabel="Dashboard">
                  <span>Dashboard</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
          <Sidebar.Rail label="Expand sidebar" />
        </Sidebar>
      </Sidebar.Provider>
    );

    const button = screen.getByRole('button', { name: 'Dashboard' });
    expect(button).toHaveClass(styles.menuButton);
    expect(button).toHaveAttribute('data-collapsed', 'true');
    expect(button.closest(`.${styles.menuItem}`)).toBeInTheDocument();
  });

  it('applies group label and menu button presentation classes', () => {
    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel data-testid="group-label">
                Platform
              </Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton iconOnlyLabel="Models">
                    <span>Models</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByTestId('group-label')).toHaveClass(styles.groupLabel);
    expect(screen.getByRole('button', { name: 'Models' })).toHaveClass(
      styles.menuButton
    );
  });

  it('toggles collapsible menu item submenu in uncontrolled mode', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem collapsible defaultOpen={false}>
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
      </Sidebar.Provider>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle submenu' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Genesis')).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Genesis')).toBeInTheDocument();
  });

  it('supports controlled collapsible menu item state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem collapsible onOpenChange={onOpenChange} open>
                <Sidebar.MenuButton iconOnlyLabel="Models">
                  <span>Models</span>
                </Sidebar.MenuButton>
                <ul>
                  <Sidebar.SubMenuItem>Explorer</Sidebar.SubMenuItem>
                </ul>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle submenu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Explorer')).toBeInTheDocument();

    await user.click(toggle);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Explorer')).toBeInTheDocument();
  });

  it('renders custom collapse icon content', () => {
    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem
                collapseIcon={<span data-testid="custom-chevron">+</span>}
                collapsible
              >
                <Sidebar.MenuButton iconOnlyLabel="Models">
                  <span>Models</span>
                </Sidebar.MenuButton>
                <ul>
                  <Sidebar.SubMenuItem>Quantum</Sidebar.SubMenuItem>
                </ul>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByTestId('custom-chevron')).toBeInTheDocument();
  });

  it('does not render collapsible submenu inline while sidebar is collapsed', () => {
    render(
      <Sidebar.Provider defaultCollapsed>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem collapsible defaultOpen>
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
      </Sidebar.Provider>
    );

    expect(
      screen.queryByRole('button', { name: 'Toggle submenu' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Genesis')).not.toBeInTheDocument();
  });

  it('toggles offcanvas open state from trigger and closes with Escape', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Provider collapseMode="offcanvas">
        <Sidebar.Trigger label="Open sidebar" />
        <Sidebar mode="offcanvas">
          <Sidebar.Content>
            <button type="button">Focusable</button>
          </Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    const trigger = screen.getByRole('button', { name: 'Open sidebar' });
    await user.click(trigger);

    expect(screen.getByRole('complementary')).toHaveClass(styles.offcanvasOpen);

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.getByRole('complementary')).not.toHaveClass(
        styles.offcanvasOpen
      );
    });
  });

  it('closes on locationKey change when closeOnRouteChange is enabled', async () => {
    const { rerender } = render(
      <Sidebar.Provider
        closeOnRouteChange
        collapseMode="offcanvas"
        defaultOpen
        locationKey="/one"
      >
        <Sidebar mode="offcanvas">
          <Sidebar.Content>Menu</Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByRole('complementary')).toHaveClass(styles.offcanvasOpen);

    rerender(
      <Sidebar.Provider
        closeOnRouteChange
        collapseMode="offcanvas"
        defaultOpen
        locationKey="/two"
      >
        <Sidebar mode="offcanvas">
          <Sidebar.Content>Menu</Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('complementary')).not.toHaveClass(
        styles.offcanvasOpen
      );
    });
  });

  it('warns in development when closeOnRouteChange is enabled without locationKey', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <Sidebar.Provider closeOnRouteChange>
        <Sidebar>
          <Sidebar.Content>Menu</Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(warn).toHaveBeenCalledWith(
      'Sidebar.Provider: closeOnRouteChange is enabled but locationKey is not provided.'
    );

    warn.mockRestore();
  });

  it('has no axe violations for representative state', async () => {
    const { container } = render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Header>
            <Sidebar.Trigger label="Toggle" />
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
        </Sidebar>
      </Sidebar.Provider>
    );

    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('has no axe violations for collapsible menu items', async () => {
    const { container } = render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem collapsible defaultOpen>
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
      </Sidebar.Provider>
    );

    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('toggles Sidebar.SubMenu in uncontrolled mode', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.SubMenu defaultOpen={false}>
              <Sidebar.SubMenuItem>Nested item</Sidebar.SubMenuItem>
            </Sidebar.SubMenu>
          </Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle submenu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Nested item')).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Nested item')).toBeInTheDocument();
  });

  it('supports controlled Sidebar.SubMenu state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.SubMenu onOpenChange={onOpenChange} open>
              <Sidebar.SubMenuItem>Controlled nested</Sidebar.SubMenuItem>
            </Sidebar.SubMenu>
          </Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Toggle submenu' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText('Controlled nested')).toBeInTheDocument();
  });

  it('renders menu badge and action style variants', () => {
    render(
      <Sidebar.Provider defaultCollapsed>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton badge="8" iconOnlyLabel="Inbox">
                  <span>Inbox</span>
                </Sidebar.MenuButton>
                <Sidebar.MenuBadge tone="danger">99+</Sidebar.MenuBadge>
                <Sidebar.MenuAction label="More actions" showOnHover={false}>
                  •••
                </Sidebar.MenuAction>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByText('99+')).toHaveClass(styles.menuBadgeDanger);
    expect(screen.getByText('99+')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByLabelText('More actions')).not.toHaveClass(
      styles.menuActionOnHover
    );
    expect(screen.getByText('8')).toHaveClass(styles.menuButtonBadge);
  });

  it('supports non-decorative separator and inset padding opt-out', () => {
    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Separator decorative={false} />
          <Sidebar.Inset padded={false}>Page body</Sidebar.Inset>
        </Sidebar>
      </Sidebar.Provider>
    );

    const separator = screen.getByRole('separator');
    expect(separator).not.toHaveAttribute('aria-hidden', 'true');
    expect(separator).not.toHaveAttribute('role', 'presentation');
    expect(screen.getByText('Page body')).not.toHaveClass(styles.insetPadded);
  });

  it('supports persisted collapsed state from localStorage', () => {
    window.localStorage.setItem('themeshift.sidebar.collapsed', 'true');

    render(
      <Sidebar.Provider persistCollapsed>
        <Sidebar>Menu</Sidebar>
      </Sidebar.Provider>
    );

    expect(screen.getByRole('complementary')).toHaveClass(styles.collapsed);
  });
});
