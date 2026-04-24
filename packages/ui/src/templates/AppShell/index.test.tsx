import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import styles from './AppShell.module.scss';
import { AppShell } from './index';

describe('AppShell', () => {
  it('defaults the main landmark id and skip-link label', () => {
    render(<AppShell>Workspace content</AppShell>);

    expect(
      screen.getByRole('link', { name: 'Skip to main content' })
    ).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('renders children inside the main landmark', () => {
    render(<AppShell>Workspace content</AppShell>);

    expect(screen.getByRole('main')).toContainElement(
      screen.getByText('Workspace content')
    );
  });

  it('renders optional regions only when provided and applies labels', () => {
    render(
      <AppShell
        aside={<p>Context panel</p>}
        footer={<p>Footer tools</p>}
        header={<p>App header</p>}
        navLabel="Primary app navigation"
        navigation={<a href="/projects">Projects</a>}
        sidebar={<p>Workspace sidebar</p>}
        sidebarLabel="Workspace support"
      >
        Workspace content
      </AppShell>
    );

    expect(screen.getByRole('banner')).toHaveTextContent('App header');
    expect(
      screen.getByRole('navigation', { name: 'Primary app navigation' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Workspace support' })
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Workspace content');
    expect(screen.getByRole('complementary')).toHaveTextContent(
      'Context panel'
    );
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Footer tools');
  });

  it('applies position and mode classes for shell regions', () => {
    render(
      <AppShell
        defaultSidebarOpen
        header={<p>Header</p>}
        headerPosition="sticky"
        navigation={<p>Navigation</p>}
        navigationMode="fixed"
        navigationPosition="sticky"
        sidebar={<p>Sidebar</p>}
        sidebarMode="overlay"
        sidebarPosition="fixed"
      >
        Workspace
      </AppShell>
    );

    expect(screen.getByRole('banner')).toHaveClass(
      styles.header,
      styles.regionPositionSticky
    );
    expect(screen.getByRole('navigation')).toHaveClass(
      styles.navigation,
      styles.regionModeFixed,
      styles.regionPositionSticky
    );
    expect(screen.getByRole('region', { name: 'Sidebar' })).toHaveClass(
      styles.sidebar,
      styles.regionModeOverlay,
      styles.regionPositionFixed
    );
  });

  it('supports uncontrolled overlay state defaults and hidden overlay semantics', () => {
    render(
      <AppShell
        defaultNavigationOpen={false}
        navigation={<a href="/inbox">Inbox</a>}
        navigationMode="overlay"
      >
        Workspace
      </AppShell>
    );

    const navigation = screen.getByRole('navigation', {
      hidden: true,
    });

    expect(navigation).toHaveAttribute('hidden');
    expect(navigation).toHaveAttribute('aria-hidden', 'true');
    expect(navigation).toHaveAttribute('inert');
  });

  it('updates uncontrolled overlay state and onChange on escape dismissal', () => {
    const onNavigationOpenChange = vi.fn();

    render(
      <AppShell
        defaultNavigationOpen
        navigation={<a href="/inbox">Inbox</a>}
        navigationMode="overlay"
        onNavigationOpenChange={onNavigationOpenChange}
      >
        Workspace
      </AppShell>
    );

    fireEvent.keyDown(screen.getByRole('main'), { key: 'Escape' });

    expect(onNavigationOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('navigation', { hidden: true })).toHaveAttribute(
      'hidden'
    );
  });

  it('supports controlled overlay state and escape dismissal', async () => {
    const user = userEvent.setup();

    const ControlledShell = () => {
      const [isNavigationOpen, setIsNavigationOpen] = useState(false);

      return (
        <>
          <button onClick={() => setIsNavigationOpen(true)} type="button">
            Open navigation
          </button>
          <AppShell
            isNavigationOpen={isNavigationOpen}
            navigation={
              <a href="/dashboard" onClick={(event) => event.preventDefault()}>
                Dashboard
              </a>
            }
            navigationMode="overlay"
            onNavigationOpenChange={setIsNavigationOpen}
          >
            Workspace
          </AppShell>
        </>
      );
    };

    render(<ControlledShell />);

    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(screen.getByRole('navigation')).toBeVisible();

    const navigationLink = screen.getByRole('link', { name: 'Dashboard' });
    navigationLink.focus();
    fireEvent.keyDown(navigationLink, { key: 'Escape' });

    expect(screen.getByRole('navigation', { hidden: true })).toHaveAttribute(
      'hidden'
    );
    expect(trigger).toHaveFocus();
  });

  it('does not dismiss overlays for non-escape keys', () => {
    const onNavigationOpenChange = vi.fn();
    const onSidebarOpenChange = vi.fn();

    render(
      <AppShell
        isNavigationOpen
        isSidebarOpen
        navigation={<p>Navigation</p>}
        navigationMode="overlay"
        onNavigationOpenChange={onNavigationOpenChange}
        onSidebarOpenChange={onSidebarOpenChange}
        sidebar={<p>Sidebar</p>}
        sidebarMode="overlay"
      >
        Workspace
      </AppShell>
    );

    fireEvent.keyDown(screen.getByRole('main'), { key: 'Enter' });

    expect(onNavigationOpenChange).not.toHaveBeenCalled();
    expect(onSidebarOpenChange).not.toHaveBeenCalled();
  });

  it('safely closes overlay when no focus trigger was captured', () => {
    const ControlledShell = () => {
      const [isNavigationOpen, setIsNavigationOpen] = useState(true);

      return (
        <>
          <button onClick={() => setIsNavigationOpen(false)} type="button">
            Close navigation
          </button>
          <AppShell
            isNavigationOpen={isNavigationOpen}
            navigation={<a href="/dashboard">Dashboard</a>}
            navigationMode="overlay"
            onNavigationOpenChange={setIsNavigationOpen}
          >
            Workspace
          </AppShell>
        </>
      );
    };

    render(<ControlledShell />);

    fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }));

    expect(screen.getByRole('navigation', { hidden: true })).toHaveAttribute(
      'hidden'
    );
  });

  it('switches to overlay mode below configured breakpoint', () => {
    const originalMatchMedia = window.matchMedia;

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query === '(max-width: 1023px)',
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });

    render(
      <AppShell
        defaultNavigationOpen
        navigation={<p>Navigation</p>}
        navigationMode="inline"
        navigationOverlayBelow="desktop"
      >
        Workspace
      </AppShell>
    );

    expect(screen.getByRole('navigation')).toHaveClass(
      styles.regionModeOverlay
    );

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
      writable: true,
    });
  });

  it('renders regions in the expected structural order', () => {
    const { container } = render(
      <AppShell
        aside={<p>Aside</p>}
        footer={<p>Footer</p>}
        header={<p>Header</p>}
        navigation={<p>Navigation</p>}
        sidebar={<p>Sidebar</p>}
      >
        Main content
      </AppShell>
    );

    const root = container.firstElementChild as HTMLElement;
    const shell = root.lastElementChild as HTMLElement;
    const layout = shell.children[1] as HTMLElement;

    expect(root.firstElementChild?.tagName).toBe('A');
    expect(shell.firstElementChild?.tagName).toBe('HEADER');
    expect(layout.children[0]?.tagName).toBe('NAV');
    expect(layout.children[1]?.tagName).toBe('SECTION');
    expect(layout.children[2]?.tagName).toBe('MAIN');
    expect(layout.children[3]?.tagName).toBe('ASIDE');
    expect(shell.lastElementChild?.tagName).toBe('FOOTER');
  });

  it('handles independent navigation and sidebar controlled states', () => {
    const onNavigationOpenChange = vi.fn();
    const onSidebarOpenChange = vi.fn();

    render(
      <AppShell
        isNavigationOpen
        isSidebarOpen
        navigation={<p>Navigation</p>}
        navigationMode="overlay"
        onNavigationOpenChange={onNavigationOpenChange}
        onSidebarOpenChange={onSidebarOpenChange}
        sidebar={<p>Sidebar</p>}
        sidebarMode="overlay"
      >
        Workspace
      </AppShell>
    );

    fireEvent.keyDown(screen.getByRole('main'), { key: 'Escape' });

    expect(onNavigationOpenChange).toHaveBeenCalledWith(false);
    expect(onSidebarOpenChange).toHaveBeenCalledWith(false);
  });

  it('applies divider classes for sidebar, aside, and footer regions', () => {
    render(
      <AppShell
        aside={<p>Aside</p>}
        divider
        footer={<p>Footer</p>}
        navigation={<p>Navigation</p>}
        sidebar={<p>Sidebar</p>}
        sidebarMode="overlay"
      >
        Workspace
      </AppShell>
    );

    const sidebar = screen.getByText('Sidebar').closest('section');

    expect(sidebar).toHaveClass(styles.overlayClosed, styles.sidebarDivider);
    expect(screen.getByRole('complementary')).toHaveClass(styles.asideDivider);
    expect(screen.getByRole('contentinfo')).toHaveClass(styles.footerDivider);
  });
});
