import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Menu } from './index';

describe('Menu - integration smoke', () => {
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

  it('supports controlled open lifecycle', () => {
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

  it('supports short end-to-end tab traversal across mixed menu compositions', async () => {
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

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="asChild link item">
            <Menu.Item asChild>
              <a href="/settings">Settings</a>
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
    expect(screen.getByRole('menuitem', { name: /Settings/ })).toHaveFocus();
  });

  it('closes on Escape by default', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions" data-testid="content">
          <Menu.Item>Profile</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.keyDown(screen.getByTestId('content'), { key: 'Escape' });

    expect(
      screen.queryByRole('menu', { name: 'Actions' })
    ).not.toBeInTheDocument();
  });
});
