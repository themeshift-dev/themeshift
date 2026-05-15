import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Menu } from './index';

function BasicMenu({ dir = 'ltr' as const }) {
  return (
    <Menu.Root defaultOpen dir={dir}>
      <Menu.Content aria-label="Actions" data-testid="content" role="menu">
        <Menu.Item textValue="Account settings">Account settings</Menu.Item>
        <Menu.Item disabled>Disabled item</Menu.Item>
        <Menu.Item>Billing</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}

describe('Menu', () => {
  it('supports the compound API', () => {
    expect(Menu.Root).toBeDefined();
    expect(Menu.Content).toBeDefined();
    expect(Menu.Viewport).toBeDefined();
    expect(Menu.Group).toBeDefined();
    expect(Menu.Label).toBeDefined();
    expect(Menu.Item).toBeDefined();
    expect(Menu.ItemText).toBeDefined();
    expect(Menu.ItemIcon).toBeDefined();
    expect(Menu.ItemMeta).toBeDefined();
    expect(Menu.Separator).toBeDefined();
    expect(Menu.CheckboxItem).toBeDefined();
    expect(Menu.RadioGroup).toBeDefined();
    expect(Menu.RadioItem).toBeDefined();
    expect(Menu.ItemIndicator).toBeDefined();
    expect(Menu.Sub).toBeDefined();
    expect(Menu.SubTrigger).toBeDefined();
    expect(Menu.SubContent).toBeDefined();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Menu.Root onOpenChange={onOpenChange} open>
        <Menu.Content aria-label="Actions">Hello</Menu.Content>
      </Menu.Root>
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();

    rerender(
      <Menu.Root onOpenChange={onOpenChange} open={false}>
        <Menu.Content aria-label="Actions">Hello</Menu.Content>
      </Menu.Root>
    );

    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });

  it('keeps content open when onEscapeKeyDown prevents default', () => {
    render(
      <Menu.Root
        defaultOpen
        onEscapeKeyDown={(event) => {
          event.preventDefault();
        }}
      >
        <Menu.Content aria-label="Actions" data-testid="content">
          <Menu.Item>Profile</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.keyDown(screen.getByTestId('content'), { key: 'Escape' });

    expect(screen.getByRole('menu', { name: 'Actions' })).toBeInTheDocument();
  });

  it('keeps a single tabbable item and supports roving focus', () => {
    render(<BasicMenu />);

    const items = screen.getAllByRole('menuitem');

    expect(
      items.filter((item) => item.getAttribute('tabindex') === '0')
    ).toHaveLength(1);

    items[0].focus();
    fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowDown' });

    expect(document.activeElement).toBe(items[2]);
  });

  it('supports typeahead with wraparound and textValue override', async () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions" data-testid="content">
          <Menu.Item>Zoom out</Menu.Item>
          <Menu.Item textValue="Account settings">
            <span>Settings</span>
          </Menu.Item>
          <Menu.Item disabled>Zebra</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    const content = screen.getByTestId('content');
    fireEvent.keyDown(content, { key: 'a' });

    await waitFor(() => {
      expect(document.activeElement).toHaveTextContent('Settings');
    });

    fireEvent.keyDown(content, { key: 'z' });

    expect(document.activeElement).toHaveTextContent('Settings');
  });

  it('honors preventDefault on select to keep content open', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Item
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            Rename
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('checkbox and radio items default to closeOnSelect=false', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.CheckboxItem>Dense mode</Menu.CheckboxItem>
          <Menu.RadioGroup defaultValue="compact">
            <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
            <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Dense mode' })
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Comfortable' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('supports submenu keyboard behavior with RTL inversion', async () => {
    render(
      <Menu.Root defaultOpen dir="rtl">
        <Menu.Content aria-label="Actions">
          <Menu.Sub defaultOpen={false}>
            <Menu.SubTrigger>More</Menu.SubTrigger>
            <Menu.SubContent aria-label="More actions">
              <Menu.Item>Rename</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    const trigger = screen.getByRole('menuitem', { name: 'More' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowLeft' });

    await waitFor(() => {
      expect(
        screen.getByRole('menu', { name: 'More actions' })
      ).toBeInTheDocument();
    });
  });

  it('renders floating mode with sizing css variables', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content
          aria-label="Actions"
          data-testid="floating"
          mode="floating"
          portal={false}
        >
          <Menu.Item>One</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    const content = screen.getByTestId('floating');
    const style = content.getAttribute('style') ?? '';

    expect(style).toContain('--menu-content-available-height');
    expect(style).toContain('--menu-trigger-width');
  });

  it('has no accessibility violations for representative states', async () => {
    const { container } = render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Label>Account</Menu.Label>
          <Menu.Item>Profile</Menu.Item>
          <Menu.Separator />
          <Menu.CheckboxItem checked>
            <Menu.ItemIndicator>✓</Menu.ItemIndicator>
            <Menu.ItemText>Enabled</Menu.ItemText>
          </Menu.CheckboxItem>
        </Menu.Content>
      </Menu.Root>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps keyboard entry stable across different menu compositions', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before</button>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="Submenu intent handling">
            <Menu.Sub>
              <Menu.SubTrigger indicator=">">More tools</Menu.SubTrigger>
              <Menu.SubContent aria-label="More tools">
                <Menu.Item>Rename</Menu.Item>
                <Menu.Item>Duplicate</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Root>

        <Menu.Root closeOnSelect={false} defaultOpen dir="rtl">
          <Menu.Content aria-label="RTL behavior">
            <Menu.Sub>
              <Menu.SubTrigger indicator="<">עוד</Menu.SubTrigger>
              <Menu.SubContent aria-label="RTL nested actions">
                <Menu.Item>שנה שם</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Root>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="asChild link item">
            <Menu.Item asChild>
              <a href="/settings">Settings</a>
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="Typeahead with text value">
            <Menu.Item textValue="Account settings">
              <Menu.ItemText>Account settings</Menu.ItemText>
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </>
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('menuitem', { name: /More tools/ })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('menuitem', { name: /עוד/ })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('menuitem', { name: /Settings/ })).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole('menuitem', { name: /Account settings/ })
    ).toHaveFocus();
  });

  it('closes submenu with opposite directional arrow from submenu content', async () => {
    render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub>
            <Menu.SubTrigger indicator=">">More tools</Menu.SubTrigger>
            <Menu.SubContent aria-label="More tools">
              <Menu.Item>Rename</Menu.Item>
              <Menu.Item>Duplicate</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    const trigger = screen.getByRole('menuitem', { name: /More tools/ });
    trigger.focus();

    fireEvent.keyDown(trigger, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(
        screen.getByRole('menu', { name: 'More tools' })
      ).toBeInTheDocument();
    });

    const firstSubItem = screen.getByRole('menuitem', { name: 'Rename' });
    expect(firstSubItem).toHaveFocus();

    fireEvent.keyDown(firstSubItem, { key: 'ArrowLeft' });

    await waitFor(() => {
      expect(
        screen.queryByRole('menu', { name: 'More tools' })
      ).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('skips fully disabled submenu items during roving focus including loop wrap', async () => {
    render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Disabled item behavior">
          <Menu.Sub defaultOpen={false}>
            <Menu.SubTrigger indicator=">">Advanced actions</Menu.SubTrigger>
            <Menu.SubContent aria-label="Advanced actions">
              <Menu.Item disabled>Convert format (disabled)</Menu.Item>
              <Menu.Item disabled disabledBehavior="focusable">
                Reset permissions (focusable disabled)
              </Menu.Item>
              <Menu.Item>Export report</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    const trigger = screen.getByRole('menuitem', { name: /Advanced actions/ });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowRight' });

    const focusableDisabled = screen.getByRole('menuitem', {
      name: /Reset permissions/,
    });
    const enabled = screen.getByRole('menuitem', { name: /Export report/ });
    const disabled = screen.getByRole('menuitem', {
      name: /Convert format/,
    });

    expect(focusableDisabled).toHaveFocus();

    fireEvent.keyDown(focusableDisabled, { key: 'ArrowDown' });
    expect(enabled).toHaveFocus();

    fireEvent.keyDown(enabled, { key: 'ArrowDown' });
    expect(focusableDisabled).toHaveFocus();
    expect(disabled).not.toHaveFocus();
  });

  it('supports click and focus behavior without hover opening when openOnHover=false', async () => {
    render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub openOnHover={false}>
            <Menu.SubTrigger>More tools</Menu.SubTrigger>
            <Menu.SubContent aria-label="More tools">
              <Menu.Item>Rename</Menu.Item>
              <Menu.Item>Duplicate</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    const trigger = screen.getByRole('menuitem', { name: /More tools/ });

    fireEvent.mouseMove(trigger);
    expect(
      screen.queryByRole('menu', { name: 'More tools' })
    ).not.toBeInTheDocument();

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(
        screen.getByRole('menu', { name: 'More tools' })
      ).toBeInTheDocument();
    });

    const firstSubItem = screen.getByRole('menuitem', { name: 'Rename' });
    expect(firstSubItem).toHaveFocus();
  });

  it('opens submenu on hover by default', async () => {
    render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub>
            <Menu.SubTrigger>More tools</Menu.SubTrigger>
            <Menu.SubContent aria-label="More tools">
              <Menu.Item>Rename</Menu.Item>
              <Menu.Item>Duplicate</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    const trigger = screen.getByRole('menuitem', { name: /More tools/ });
    fireEvent.mouseMove(trigger);

    await waitFor(() => {
      expect(
        screen.getByRole('menu', { name: 'More tools' })
      ).toBeInTheDocument();
    });
  });

  it('keeps keyboard open path when openOnHover=false', async () => {
    render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub openOnHover={false}>
            <Menu.SubTrigger>More tools</Menu.SubTrigger>
            <Menu.SubContent aria-label="More tools">
              <Menu.Item>Rename</Menu.Item>
              <Menu.Item>Duplicate</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    const trigger = screen.getByRole('menuitem', { name: /More tools/ });
    trigger.focus();

    expect(
      screen.queryByRole('menu', { name: 'More tools' })
    ).not.toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(
        screen.getByRole('menu', { name: 'More tools' })
      ).toBeInTheDocument();
    });
  });
});
