import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
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

    expect(screen.getByRole('complementary')).toHaveAttribute(
      'data-collapsed',
      'true'
    );
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
});
