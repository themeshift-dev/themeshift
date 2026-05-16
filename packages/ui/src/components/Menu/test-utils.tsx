import { render, type RenderResult } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Menu } from './index';

export function renderOpenMenu(
  children: ReactNode,
  rootProps = {}
): RenderResult {
  return render(
    <Menu.Root defaultOpen {...rootProps}>
      <Menu.Content aria-label="Actions" data-testid="content" role="menu">
        {children}
      </Menu.Content>
    </Menu.Root>
  );
}

export function renderBasicMenu(): RenderResult {
  return render(
    <Menu.Root defaultOpen>
      <Menu.Content aria-label="Actions" data-testid="content" role="menu">
        <Menu.Item textValue="Account settings">Account settings</Menu.Item>
        <Menu.Item disabled>Disabled item</Menu.Item>
        <Menu.Item>Billing</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}

export function renderSubmenu({
  dir = 'ltr' as const,
  openOnHover,
  label = 'More tools',
  contentLabel = 'More tools',
}: {
  dir?: 'ltr' | 'rtl';
  openOnHover?: boolean;
  label?: string;
  contentLabel?: string;
} = {}): RenderResult {
  return render(
    <Menu.Root closeOnSelect={false} defaultOpen dir={dir}>
      <Menu.Content aria-label="Actions">
        <Menu.Sub openOnHover={openOnHover}>
          <Menu.SubTrigger>{label}</Menu.SubTrigger>
          <Menu.SubContent aria-label={contentLabel}>
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu.Root>
  );
}
