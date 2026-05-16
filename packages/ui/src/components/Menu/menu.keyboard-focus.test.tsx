import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Menu } from './index';
import { renderBasicMenu } from './test-utils';

describe('Menu - keyboard/focus', () => {
  it('keeps a single tabbable item and supports roving focus', () => {
    renderBasicMenu();

    const items = screen.getAllByRole('menuitem');

    expect(
      items.filter((item) => item.getAttribute('tabindex') === '0')
    ).toHaveLength(1);

    items[0].focus();
    fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowDown' });

    expect(document.activeElement).toBe(items[2]);
  });

  it('supports home/end navigation', () => {
    renderBasicMenu();

    const content = screen.getByTestId('content');
    const items = screen.getAllByRole('menuitem');

    items[2].focus();
    fireEvent.keyDown(content, { key: 'Home' });
    expect(items[0]).toHaveFocus();

    fireEvent.keyDown(content, { key: 'End' });
    expect(items[2]).toHaveFocus();
  });

  it('supports tab entry/exit across mixed menu compositions', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before</button>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="Submenu intent handling">
            <Menu.Sub>
              <Menu.SubTrigger>More tools</Menu.SubTrigger>
              <Menu.SubContent aria-label="More tools">
                <Menu.Item>Rename</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Root>

        <Menu.Root closeOnSelect={false} defaultOpen dir="rtl">
          <Menu.Content aria-label="RTL behavior">
            <Menu.Sub>
              <Menu.SubTrigger>עוד</Menu.SubTrigger>
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

  it('closes submenu with opposite directional arrow and restores trigger focus', async () => {
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
});
