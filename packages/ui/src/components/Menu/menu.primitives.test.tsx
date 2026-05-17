import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Menu } from './index';
import { renderOpenMenu } from './test-utils';

describe('Menu - low coverage branches', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Menu.Group disabled/inset state', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Group className="custom-group" disabled inset>
            <Menu.Item>Open</Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Root>
    );

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('data-disabled', '');
    expect(group.className).toContain('custom-group');
  });

  it('renders Menu.ItemIcon variants and non-decorative path', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Item>
            <Menu.ItemIcon decorative={false} size="sm">
              A
            </Menu.ItemIcon>
            <Menu.ItemText>Alpha</Menu.ItemText>
          </Menu.Item>
          <Menu.Item>
            <Menu.ItemIcon size="lg">B</Menu.ItemIcon>
            <Menu.ItemText>Beta</Menu.ItemText>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    expect(screen.getByText('A')).not.toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('B')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders Menu.Viewport style and non-scrollable mode', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Viewport
            data-testid="viewport"
            maxHeight={200}
            overscrollBehavior="contain"
            scrollable={false}
          >
            <Menu.Item>Open</Menu.Item>
          </Menu.Viewport>
        </Menu.Content>
      </Menu.Root>
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport.className).not.toContain('scrollable');
    expect(viewport).toHaveStyle({ maxHeight: '200px' });
    expect(viewport).toHaveStyle({ overscrollBehavior: 'contain' });
  });

  it('covers MenuSubTrigger branches for custom handlers and indicator null', () => {
    const onKeyDown = vi.fn();
    const onMouseMove = vi.fn();
    const onSelect = vi.fn();
    const onSubOpenChange = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub
            defaultOpen
            onOpenChange={onSubOpenChange}
            openOnHover={false}
          >
            <Menu.SubTrigger
              indicator={null}
              onKeyDown={onKeyDown}
              onMouseMove={onMouseMove}
              onSelect={onSelect}
            >
              More tools
            </Menu.SubTrigger>
            <Menu.SubContent aria-label="More tools">
              <Menu.Item>Format</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    const trigger = screen.getByRole('menuitem', { name: 'More tools' });

    fireEvent.keyDown(trigger, { key: 'z' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(trigger, { key: 'ArrowLeft' });
    expect(onSubOpenChange).toHaveBeenCalledWith(false);

    fireEvent.mouseMove(trigger);
    expect(onMouseMove).toHaveBeenCalledTimes(1);

    fireEvent.click(trigger);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSubOpenChange).toHaveBeenCalledWith(false);
  });

  it('covers MenuSubTrigger hover intent open/close timer branches', () => {
    vi.useFakeTimers();

    const onSubOpenChange = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub
            closeDelay={10}
            onOpenChange={onSubOpenChange}
            openDelay={10}
            openOnHover
          >
            <Menu.SubTrigger>Hover tools</Menu.SubTrigger>
            <Menu.SubContent aria-label="Hover tools submenu">
              <Menu.Item>Open submenu item</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    const trigger = screen.getByRole('menuitem', { name: 'Hover tools' });

    fireEvent.mouseMove(trigger);
    vi.runOnlyPendingTimers();
    vi.runOnlyPendingTimers();
    expect(onSubOpenChange).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(trigger);
    vi.runOnlyPendingTimers();
    expect(onSubOpenChange).toHaveBeenCalledWith(false);
  });

  it('assigns explicit item value and emits onSelect callback', () => {
    const onSelect = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Item onSelect={onSelect} value="rename">
            Rename
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    const item = screen.getByRole('menuitem', { name: 'Rename' });
    expect(item).toHaveAttribute('id');

    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('keeps content open when closeOnSelect is disabled globally', () => {
    render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Item>Rename</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders submenu with delayed hover intent', () => {
    vi.useFakeTimers();
    const onSubOpenChange = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub
            closeDelay={50}
            onOpenChange={onSubOpenChange}
            openDelay={50}
            openOnHover
          >
            <Menu.SubTrigger>More actions</Menu.SubTrigger>
            <Menu.SubContent aria-label="More actions submenu">
              <Menu.Item>Inspect</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.mouseMove(screen.getByRole('menuitem', { name: 'More actions' }));
    vi.advanceTimersByTime(50);
    vi.runOnlyPendingTimers();

    expect(onSubOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders open menu helper content', () => {
    renderOpenMenu();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
