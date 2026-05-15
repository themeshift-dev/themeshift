import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Menu } from './index';

describe('Menu focus regression', () => {
  it('tabs into submenu trigger, rtl submenu trigger, asChild item, and typeahead item', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">before</button>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="Actions">
            <Menu.Sub>
              <Menu.SubTrigger indicator=">">More tools</Menu.SubTrigger>
              <Menu.SubContent aria-label="More tools">
                <Menu.Item>Rename</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Root>

        <Menu.Root closeOnSelect={false} defaultOpen dir="rtl">
          <Menu.Content aria-label="RTL actions">
            <Menu.Sub>
              <Menu.SubTrigger indicator="<">עוד</Menu.SubTrigger>
              <Menu.SubContent aria-label="RTL nested actions">
                <Menu.Item>שנה שם</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Root>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="Navigation">
            <Menu.Item asChild>
              <a href="/settings">Settings</a>
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="Commands">
            <Menu.Item textValue="Account settings">
              <Menu.ItemText>Account settings</Menu.ItemText>
              <Menu.ItemMeta>⌘,</Menu.ItemMeta>
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </>
    );

    await user.tab(); // before
    expect(screen.getByRole('button', { name: 'before' })).toHaveFocus();

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
});
