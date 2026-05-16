import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';

import {
  useMenuContentContext,
  useMenuRootContext,
} from '@/components/Menu/internal/contexts';
import type { ItemKind } from '@/components/Menu/internal/types';
import {
  createMenuSelectEvent,
  deriveTextValue,
  isDisabled,
  mergeRefs,
} from '@/components/Menu/internal/utils';
import type {
  MenuItemDisabledBehavior,
  MenuItemProps,
  MenuSelectEvent,
} from '@/components/Menu/types';

type MenuItemBaseOptions = {
  checkedState?: boolean | 'mixed';
  closeOnSelect?: boolean;
  disabled?: boolean;
  disabledBehavior?: MenuItemDisabledBehavior;
  kind: ItemKind;
  onSelect?: (event: MenuSelectEvent) => void;
  textValue?: string;
};

export const MenuItemBase = forwardRef<
  HTMLDivElement,
  MenuItemProps & MenuItemBaseOptions
>(
  (
    {
      asChild = false,
      children,
      checkedState,
      className,
      closeOnSelect,
      destructive = false,
      disabled = false,
      disabledBehavior = 'skip',
      highlighted,
      id,
      inset = false,
      kind,
      onKeyDown,
      onMouseMove,
      onSelect,
      textValue,
      ...itemProps
    },
    ref
  ) => {
    const root = useMenuRootContext('Menu.Item');
    const content = useMenuContentContext('Menu.Item');
    const generatedId = useId();
    const resolvedId = id ?? `menu-item-${generatedId.replaceAll(':', '')}`;
    const Component = asChild ? Slot : 'div';
    const localRef = useRef<HTMLElement | null>(null);
    const resolvedDisabled = root.disabled || disabled;

    const registerItem = content.registerItem;
    const enabledItems = content.getItems().filter((item) => !isDisabled(item));
    const firstEnabledId = enabledItems[0]?.id;
    const hasValidHighlight =
      content.highlightedId !== null &&
      content.getItems().some((item) => item.id === content.highlightedId);
    const isNonFocusableDisabled =
      resolvedDisabled && disabledBehavior !== 'focusable';

    useLayoutEffect(() => {
      const node = localRef.current;

      return registerItem({
        closeOnSelect,
        disabled: resolvedDisabled,
        disabledBehavior,
        id: resolvedId,
        kind,
        ref: node,
        textValue: textValue || deriveTextValue(node),
      });
    }, [
      closeOnSelect,
      disabledBehavior,
      kind,
      registerItem,
      resolvedDisabled,
      resolvedId,
      textValue,
    ]);

    const resolvedTabIndex = isNonFocusableDisabled
      ? -1
      : !hasValidHighlight
        ? firstEnabledId === resolvedId
          ? 0
          : -1
        : content.highlightedId === resolvedId
          ? 0
          : -1;

    const invokeSelect = useCallback(() => {
      if (resolvedDisabled && disabledBehavior !== 'focusable') {
        return;
      }

      const event = createMenuSelectEvent();

      onSelect?.(event);

      const shouldClose = closeOnSelect ?? root.closeOnSelect;

      if (!event.defaultPrevented && shouldClose) {
        content.requestClose();
      }
    }, [
      closeOnSelect,
      content,
      disabledBehavior,
      onSelect,
      resolvedDisabled,
      root.closeOnSelect,
    ]);

    return (
      <Component
        {...itemProps}
        aria-checked={
          itemProps.role === 'menuitemcheckbox' ||
          itemProps.role === 'menuitemradio'
            ? checkedState
            : undefined
        }
        aria-disabled={resolvedDisabled ? true : undefined}
        className={className}
        data-destructive={destructive ? '' : undefined}
        data-disabled={resolvedDisabled ? '' : undefined}
        data-checked={
          checkedState === true
            ? 'checked'
            : checkedState === 'mixed'
              ? 'mixed'
              : undefined
        }
        data-highlighted={content.highlightedId === resolvedId ? '' : undefined}
        data-inset={inset ? '' : undefined}
        data-kind={kind}
        data-manual-highlighted={highlighted ? '' : undefined}
        id={resolvedId}
        onClick={() => invokeSelect()}
        onFocus={() => {
          if (isNonFocusableDisabled) {
            return;
          }

          content.setHighlightedId(resolvedId);
        }}
        onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            invokeSelect();
            return;
          }

          onKeyDown?.(event);
        }}
        onMouseMove={(event: ReactMouseEvent<HTMLDivElement>) => {
          if (!isNonFocusableDisabled) {
            content.setHighlightedId(resolvedId);
          }

          onMouseMove?.(event);
        }}
        ref={mergeRefs(ref, (node: HTMLElement | null) => {
          localRef.current = node;
        })}
        role={itemProps.role ?? 'menuitem'}
        tabIndex={resolvedTabIndex}
      >
        {children}
      </Component>
    );
  }
);

MenuItemBase.displayName = 'MenuItemBase';

/** Action item primitive for standard menu commands. */
export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  (props, ref) => {
    return <MenuItemBase {...props} kind="item" ref={ref} />;
  }
);

MenuItem.displayName = 'Menu.Item';
