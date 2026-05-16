import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Menu } from './index';

describe('Menu - positioning', () => {
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

  it('renders floating content in open state', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content
          aria-label="Floating actions"
          mode="floating"
          portal={false}
        >
          <Menu.Item>One</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    expect(
      screen.getByRole('menu', { name: 'Floating actions' })
    ).toBeInTheDocument();
  });
});
