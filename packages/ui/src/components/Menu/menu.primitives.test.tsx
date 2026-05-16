import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Menu } from './index';
import {
  MenuContentContext,
  MenuRootContext,
  MenuSubContext,
} from './internal/contexts';
import type {
  MenuContentContextValue,
  MenuRootContextValue,
  MenuSubContextValue,
} from './internal/types';
import { renderOpenMenu, renderSubmenu } from './test-utils';

function createRootContextValue(
  overrides: Partial<MenuRootContextValue> = {}
): MenuRootContextValue {
  return {
    closeAll: vi.fn(),
    closeOnSelect: false,
    density: 'normal',
    dir: 'ltr',
    disabled: false,
    loop: true,
    modal: true,
    open: true,
    orientation: 'vertical',
    registerTrigger: vi.fn(),
    selectionMode: 'none',
    size: 'md',
    triggerRef: createRef<HTMLElement>(),
    typeahead: true,
    ...overrides,
  };
}

function createSubContextValue(
  overrides: Partial<MenuSubContextValue> = {}
): MenuSubContextValue {
  const triggerRef = createRef<HTMLElement>();
  const contentRef = createRef<HTMLElement>();

  return {
    closeDelay: 1,
    contentRef,
    disabled: false,
    open: false,
    openDelay: 1,
    openOnHover: true,
    setContentNode: vi.fn(),
    setOpen: vi.fn(),
    setTriggerNode: vi.fn(),
    triggerRef,
    ...overrides,
  };
}

function createContentContextValue(
  overrides: Partial<MenuContentContextValue> = {}
): MenuContentContextValue {
  return {
    contentId: 'content-id',
    focusByDelta: vi.fn(),
    focusFirst: vi.fn(),
    focusLast: vi.fn(),
    getItems: vi.fn(() => []),
    highlightedId: null,
    registerItem: vi.fn(() => vi.fn()),
    requestClose: vi.fn(),
    selectByTypeahead: vi.fn(),
    setHighlightedId: vi.fn(),
    ...overrides,
  };
}

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
    const setOpen = vi.fn();
    const setTriggerNode = vi.fn();
    const registerTrigger = vi.fn();
    const triggerRef = createRef<HTMLElement>();
    const contentRef = createRef<HTMLElement>();
    const root = createRootContextValue({ registerTrigger });
    const content = createContentContextValue();
    const sub = createSubContextValue({
      contentRef,
      open: true,
      openOnHover: false,
      setOpen,
      setTriggerNode,
      triggerRef,
    });

    render(
      <MenuRootContext.Provider value={root}>
        <MenuContentContext.Provider value={content}>
          <MenuSubContext.Provider value={sub}>
            <Menu.SubTrigger
              indicator={null}
              onKeyDown={onKeyDown}
              onMouseMove={onMouseMove}
              onSelect={onSelect}
            >
              More tools
            </Menu.SubTrigger>
          </MenuSubContext.Provider>
        </MenuContentContext.Provider>
      </MenuRootContext.Provider>
    );

    const trigger = screen.getByRole('menuitem', { name: 'More tools' });

    fireEvent.keyDown(trigger, { key: 'z' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(trigger, { key: 'ArrowLeft' });
    expect(setOpen).toHaveBeenCalledWith(false);

    fireEvent.mouseMove(trigger);
    expect(onMouseMove).toHaveBeenCalledTimes(1);

    fireEvent.click(trigger);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);

    expect(setTriggerNode).toHaveBeenCalled();
    expect(registerTrigger).toHaveBeenCalled();
  });

  it('covers MenuSubTrigger hover intent open/close timer branches', () => {
    vi.useFakeTimers();

    const setOpen = vi.fn();
    const triggerRef = createRef<HTMLElement>();
    const contentRef = createRef<HTMLElement>();
    const root = createRootContextValue({ dir: 'ltr' });
    const content = createContentContextValue();
    const sub = createSubContextValue({
      closeDelay: 10,
      contentRef,
      open: true,
      openDelay: 10,
      openOnHover: true,
      setOpen,
      triggerRef,
    });

    const firstItem = document.createElement('div');
    firstItem.setAttribute('role', 'menuitem');
    firstItem.setAttribute('tabindex', '0');
    const focusSpy = vi.spyOn(firstItem, 'focus');

    const submenuContent = document.createElement('div');
    submenuContent.appendChild(firstItem);
    contentRef.current = submenuContent;

    const triggerNode = document.createElement('div');
    triggerNode.getBoundingClientRect = () =>
      ({
        left: 0,
        right: 100,
      }) as DOMRect;
    triggerRef.current = triggerNode;

    submenuContent.getBoundingClientRect = () =>
      ({
        left: 90,
        right: 200,
      }) as DOMRect;

    render(
      <MenuRootContext.Provider value={root}>
        <MenuContentContext.Provider value={content}>
          <MenuSubContext.Provider value={sub}>
            <Menu.SubTrigger>Hover tools</Menu.SubTrigger>
          </MenuSubContext.Provider>
        </MenuContentContext.Provider>
      </MenuRootContext.Provider>
    );

    const trigger = screen.getByRole('menuitem', { name: 'Hover tools' });

    fireEvent.mouseMove(trigger);
    vi.runOnlyPendingTimers();
    vi.runOnlyPendingTimers();
    expect(setOpen).toHaveBeenCalledWith(true);
    expect(focusSpy).toHaveBeenCalled();

    fireEvent.mouseLeave(trigger);
    vi.runOnlyPendingTimers();
    expect(setOpen).not.toHaveBeenCalledWith(false);

    submenuContent.getBoundingClientRect = () =>
      ({
        left: 10,
        right: 80,
      }) as DOMRect;
    fireEvent.mouseLeave(trigger);
    vi.runOnlyPendingTimers();
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('covers test-utils custom render paths', () => {
    renderOpenMenu(<Menu.Item>Profile</Menu.Item>, { dir: 'rtl' });
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeInTheDocument();

    renderSubmenu({
      contentLabel: 'Custom submenu',
      dir: 'rtl',
      label: 'More custom',
      openOnHover: false,
    });
    expect(
      screen.getByRole('menuitem', { name: 'More custom' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menu', { name: 'Custom submenu' })
    ).not.toBeInTheDocument();
  });
});
