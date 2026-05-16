import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Menu } from '../index';
import { renderSubmenu } from './test-utils';

describe('Menu - submenu', () => {
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

  it('supports click and focus behavior without hover opening when openOnHover=false', async () => {
    renderSubmenu({ openOnHover: false });

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
    renderSubmenu();

    const trigger = screen.getByRole('menuitem', { name: /More tools/ });
    fireEvent.mouseMove(trigger);

    await waitFor(() => {
      expect(
        screen.getByRole('menu', { name: 'More tools' })
      ).toBeInTheDocument();
    });
  });

  it('keeps keyboard open path when openOnHover=false', async () => {
    renderSubmenu({ openOnHover: false });

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

  it('skips fully disabled submenu items during roving focus including loop wrap', () => {
    render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Disabled item behavior">
          <Menu.Sub defaultOpen={false}>
            <Menu.SubTrigger>Advanced actions</Menu.SubTrigger>
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
});
