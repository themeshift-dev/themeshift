import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { FocusLockAdapterProps } from '@/components/FocusLock';

import { Navbar } from './index';
import styles from './Navbar.module.scss';

describe('Navbar', () => {
  it('renders a nav element by default', () => {
    render(<Navbar aria-label="Primary">Content</Navbar>);

    expect(screen.getByRole('navigation', { name: 'Primary' })).toHaveProperty(
      'tagName',
      'NAV'
    );
  });

  it('supports the compound API', () => {
    expect(Navbar.Brand).toBeDefined();
    expect(Navbar.Content).toBeDefined();
    expect(Navbar.List).toBeDefined();
    expect(Navbar.Item).toBeDefined();
    expect(Navbar.Link).toBeDefined();
    expect(Navbar.Actions).toBeDefined();
    expect(Navbar.Toggle).toBeDefined();
    expect(Navbar.Menu).toBeDefined();
  });

  it('renders Navbar.Brand as a link when href is provided', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
      </Navbar>
    );

    expect(screen.getByRole('link', { name: 'ThemeShift' })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('renders Navbar.Brand as a span when href is not provided', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Brand>ThemeShift</Navbar.Brand>
      </Navbar>
    );

    expect(screen.getByText('ThemeShift')).toHaveProperty('tagName', 'SPAN');
  });

  it('applies responsive visibility classes consistently', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Content hideBelow="tablet">Content</Navbar.Content>
        <Navbar.Actions showBelow="desktop">Actions</Navbar.Actions>
      </Navbar>
    );

    expect(screen.getByText('Content')).toHaveClass(styles.hideBelowTablet);
    expect(screen.getByText('Actions')).toHaveClass(styles.showBelowDesktop);
  });

  it('defaults list orientation to horizontal outside menus and vertical inside menus', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.List data-testid="inline-list">
          <Navbar.Item>One</Navbar.Item>
        </Navbar.List>
        <Navbar.Menu open data-testid="menu">
          <Navbar.List data-testid="menu-list">
            <Navbar.Item>Two</Navbar.Item>
          </Navbar.List>
        </Navbar.Menu>
      </Navbar>
    );

    expect(screen.getByTestId('inline-list')).toHaveClass(
      styles.listHorizontal
    );
    expect(screen.getByTestId('menu-list')).toHaveClass(styles.listVertical);
  });

  it('applies aria-current when Navbar.Link is active', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Link active href="/docs">
          Docs
        </Navbar.Link>
      </Navbar>
    );

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('prevents interaction when Navbar.Link is disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Link disabled href="/docs" onClick={onClick}>
          Docs
        </Navbar.Link>
      </Navbar>
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    await user.click(link);

    expect(onClick).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('lets Navbar.Toggle control the nearest menu and sets aria attributes', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports function-valued aria-label and children on Navbar.Toggle', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle
          aria-label={(isOpen) =>
            isOpen ? 'Close navigation' : 'Open navigation'
          }
        >
          {(isOpen) => (isOpen ? 'Close' : 'Menu')}
        </Navbar.Toggle>
        <Navbar.Menu>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const toggle = screen.getByRole('button', { name: 'Open navigation' });

    expect(toggle).toHaveTextContent('Menu');
    await user.click(toggle);

    expect(
      screen.getByRole('button', { name: 'Close navigation' })
    ).toHaveTextContent('Close');
  });

  it('renders Navbar.Toggle without controlling state when no menu exists', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
      </Navbar>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    await user.click(toggle);

    expect(toggle).not.toHaveAttribute('aria-expanded');
    expect(toggle).not.toHaveAttribute('aria-controls');
  });

  it('does not toggle when toggle click handler prevents default', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle
          aria-label="Toggle navigation"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          Open
        </Navbar.Toggle>
        <Navbar.Menu>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles menu state from Enter key on Navbar.Toggle', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    toggle.focus();
    await user.keyboard('{Enter}');

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not toggle from keydown when handler prevents default', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle
          aria-label="Toggle navigation"
          onKeyDown={(event) => {
            event.preventDefault();
          }}
        >
          Open
        </Navbar.Toggle>
        <Navbar.Menu>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    toggle.focus();
    await user.keyboard('{Enter}');

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the menu on Escape and restores focus to the toggle', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    await user.click(toggle);

    const menu = screen.getByRole('group');

    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(document.activeElement).toBe(toggle);
      expect(menu).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('moves focus to the first focusable item when the menu opens', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
          <button type="button">Action</button>
        </Navbar.Menu>
      </Navbar>
    );

    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Docs' })).toHaveFocus();
    });
  });

  it('calls onOpenChange when menu state changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu onOpenChange={onOpenChange}>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('supports controlled menu state through open + onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu onOpenChange={onOpenChange} open={false}>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    await user.click(toggle);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the menu open when closeOnLinkClick is false', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu closeOnLinkClick={false} defaultOpen>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const menu = screen.getByRole('group');
    await user.click(screen.getByRole('link', { name: 'Docs' }));

    expect(menu).toHaveAttribute('aria-hidden', 'false');
  });

  it('closes the menu when a link is clicked by default', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Menu defaultOpen onOpenChange={onOpenChange}>
          <Navbar.Link
            href="/docs"
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            Docs
          </Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    await user.click(screen.getByRole('link', { name: 'Docs' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('group', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('closes an open menu when onClickOutside is set to close', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Menu defaultOpen onClickOutside="close">
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    await user.click(document.body);

    expect(screen.getByRole('group', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('toggles an open menu when onClickOutside is set to toggle', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Menu defaultOpen onClickOutside="toggle">
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    await user.click(document.body);

    expect(screen.getByRole('group', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('keeps an open menu open when onClickOutside is set to open', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Menu defaultOpen onClickOutside="open">
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    await user.click(document.body);

    expect(screen.getByRole('group')).toHaveAttribute('aria-hidden', 'false');
  });

  it('passes event and helper actions to onClickOutside callback', async () => {
    const user = userEvent.setup();
    const onClickOutside = vi.fn();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Menu defaultOpen onClickOutside={onClickOutside}>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    await user.click(document.body);

    expect(onClickOutside).toHaveBeenCalledTimes(1);

    const args = onClickOutside.mock.calls[0]?.[0];
    expect(args.event).toBeInstanceOf(Event);
    expect(args.isOpen).toBe(true);
    expect(args.close).toEqual(expect.any(Function));
    expect(args.open).toEqual(expect.any(Function));
    expect(args.toggle).toEqual(expect.any(Function));
  });

  it('does not treat toggle interactions as outside clicks', async () => {
    const user = userEvent.setup();
    const onClickOutside = vi.fn();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Menu</Navbar.Toggle>
        <Navbar.Menu defaultOpen onClickOutside={onClickOutside}>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('ignores non-link clicks for closeOnLinkClick behavior', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu defaultOpen>
          <button type="button">Action</button>
        </Navbar.Menu>
      </Navbar>
    );

    const menu = screen.getByRole('group');
    await user.click(screen.getByRole('button', { name: 'Action' }));

    expect(menu).toHaveAttribute('aria-hidden', 'false');
  });

  it('does not close when menu click capture handler prevents default', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu
          defaultOpen
          onClickCapture={(event) => {
            event.preventDefault();
          }}
        >
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const menu = screen.getByRole('group');
    await user.click(screen.getByRole('link', { name: 'Docs' }));

    expect(menu).toHaveAttribute('aria-hidden', 'false');
  });

  it('renders drawer placement with focus-lock-capable menu wiring', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu placement="drawer">
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    expect(screen.getByRole('group', { hidden: true })).toHaveClass(
      styles.menuPlacementDrawer
    );
  });

  it('traps focus in drawer menus by default', async () => {
    const user = userEvent.setup();

    render(
      <Navbar aria-label="Primary">
        <button type="button">Outside action</button>
        <Navbar.Menu defaultOpen placement="drawer">
          <button type="button">First menu action</button>
          <button type="button">Second menu action</button>
        </Navbar.Menu>
      </Navbar>
    );

    const first = screen.getByRole('button', { name: 'First menu action' });
    const second = screen.getByRole('button', { name: 'Second menu action' });
    const outside = screen.getByRole('button', { name: 'Outside action' });

    first.focus();
    await user.tab();
    expect(second).toHaveFocus();

    await user.tab();
    expect(first).toHaveFocus();
    expect(outside).not.toHaveFocus();
  });

  it('uses focusLockComponent override for menu focus locking', () => {
    const CustomFocusLock = ({ active, children }: FocusLockAdapterProps) => (
      <div
        data-active={active ? 'true' : 'false'}
        data-testid="custom-focus-lock"
      >
        {children}
      </div>
    );

    render(
      <Navbar aria-label="Primary">
        <Navbar.Menu
          defaultOpen
          focusLockComponent={CustomFocusLock}
          placement="drawer"
        >
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    expect(screen.getByTestId('custom-focus-lock')).toHaveAttribute(
      'data-active',
      'true'
    );
  });

  it('renders drawer placement and uses explicit menu ids', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu id="primary-drawer-menu" placement="drawer">
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    const menu = screen.getByRole('group', { hidden: true });
    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });

    expect(menu).toHaveClass(styles.menuPlacementDrawer);
    expect(menu).toHaveAttribute('id', 'primary-drawer-menu');
    expect(toggle).toHaveAttribute('aria-controls', 'primary-drawer-menu');
  });

  it('uses aria-labelledby on menu when labelledBy is provided', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Menu labelledBy="menu-heading">
          <h2 id="menu-heading">Menu</h2>
        </Navbar.Menu>
      </Navbar>
    );

    const menu = screen.getByRole('group', { hidden: true });
    expect(menu).toHaveAttribute('aria-labelledby', 'menu-heading');
    expect(menu).not.toHaveAttribute('aria-label');
  });

  it('opens menu by default when defaultOpen is true', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Menu defaultOpen>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    expect(screen.getByRole('group')).toHaveAttribute('aria-hidden', 'false');
  });

  it('calls menu onKeyDown for non-escape keys', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();

    render(
      <Navbar aria-label="Primary">
        <Navbar.Toggle aria-label="Toggle navigation">Open</Navbar.Toggle>
        <Navbar.Menu defaultOpen onKeyDown={onKeyDown}>
          <Navbar.Link href="/docs">Docs</Navbar.Link>
        </Navbar.Menu>
      </Navbar>
    );

    await user.keyboard('{ArrowDown}');

    expect(onKeyDown).toHaveBeenCalled();
  });

  it('supports asChild for Brand and Toggle', () => {
    render(
      <Navbar aria-label="Primary">
        <Navbar.Brand asChild href="/">
          <a data-testid="brand-link">ThemeShift</a>
        </Navbar.Brand>
        <Navbar.Toggle aria-label="Toggle navigation" asChild>
          <button data-testid="custom-toggle" type="button">
            Toggle
          </button>
        </Navbar.Toggle>
      </Navbar>
    );

    expect(screen.getByTestId('brand-link')).toHaveClass(styles.brand);
    expect(screen.getByTestId('custom-toggle')).toHaveClass(styles.toggle);
  });

  it('throws when Brand uses asChild without a valid child element', () => {
    expect(() =>
      render(
        <Navbar aria-label="Primary">
          <Navbar.Brand asChild>ThemeShift</Navbar.Brand>
        </Navbar>
      )
    ).toThrowError(
      'ThemeShift Navbar.Brand with asChild expects a single React element child.'
    );
  });

  it('throws when Toggle uses asChild without a valid child element', () => {
    expect(() =>
      render(
        <Navbar aria-label="Primary">
          <Navbar.Toggle aria-label="Toggle" asChild>
            Toggle
          </Navbar.Toggle>
        </Navbar>
      )
    ).toThrowError(
      'ThemeShift Navbar.Toggle with asChild expects a single React element child.'
    );
  });

  it('has no accessibility violations for a representative responsive menu render', async () => {
    const { container } = render(
      <Navbar
        aria-label="Primary navigation"
        position="sticky"
        surface="elevated"
      >
        <Navbar.Container>
          <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
          <Navbar.Content hideBelow="tablet">
            <Navbar.List>
              <Navbar.Item>
                <Navbar.Link href="/docs">Docs</Navbar.Link>
              </Navbar.Item>
            </Navbar.List>
          </Navbar.Content>
          <Navbar.Toggle aria-label="Open navigation" showBelow="tablet" />
        </Navbar.Container>
        <Navbar.Menu showBelow="tablet">
          <Navbar.List>
            <Navbar.Item>
              <Navbar.Link href="/docs">Docs</Navbar.Link>
            </Navbar.Item>
          </Navbar.List>
        </Navbar.Menu>
      </Navbar>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
