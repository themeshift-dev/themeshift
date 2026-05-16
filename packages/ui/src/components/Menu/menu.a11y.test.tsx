import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Menu } from './index';

describe('Menu - a11y', () => {
  it('has no accessibility violations for representative root/content/selection states', async () => {
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

  it('has no accessibility violations for submenu configuration', async () => {
    const { container } = render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub>
            <Menu.SubTrigger>More tools</Menu.SubTrigger>
            <Menu.SubContent aria-label="More tools">
              <Menu.Item>Rename</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
