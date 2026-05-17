import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  type Ref,
} from 'react';

import { Portal } from '@/components/Portal';
import { useAnchoredPosition } from '@/hooks/useAnchoredPosition';

import {
  MenuContentContext,
  useMenuRootContext,
} from '@/components/Menu/internal/contexts';
import {
  useContentInteractions,
  useMenuContentState,
} from '@/components/Menu/internal/hooks';
import {
  DEFAULT_COLLISION_PADDING,
  type MenuContentContextValue,
} from '@/components/Menu/internal/types';
import { mergeRefs, resolvePlacement } from '@/components/Menu/internal/utils';
import type { MenuContentProps, MenuStyleVars } from '@/components/Menu/types';

type MenuContentPrimitiveProps = MenuContentProps & {
  defaultHighlighted?: 'first' | 'last';
  open?: boolean;
  onEscape?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  requestClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
};

export const MenuContentPrimitive = forwardRef<
  HTMLElement,
  MenuContentPrimitiveProps
>(
  (
    {
      align = 'start',
      asChild = false,
      avoidCollisions = true,
      children,
      className,
      collisionPadding = DEFAULT_COLLISION_PADDING,
      container,
      defaultHighlighted,
      forceMount = false,
      maxHeight,
      maxWidth,
      minWidth,
      mode = 'inline',
      open,
      onCloseAutoFocus,
      onEscape,
      onKeyDown,
      onOpenAutoFocus,
      portal = false,
      requestClose,
      role = 'menu',
      side = 'bottom',
      sideOffset = 8,
      style,
      triggerRef,
      width,
      ...contentProps
    },
    forwardedRef
  ) => {
    const root = useMenuRootContext('Menu.Content');
    const generatedId = useId();
    const id =
      contentProps.id ?? `menu-content-${generatedId.replaceAll(':', '')}`;
    const Component = asChild ? Slot : 'div';
    const contentRef = useRef<HTMLElement | null>(null);
    const placement = resolvePlacement(side, align);
    const resolvedOpen = open ?? root.open;
    const shouldRender = forceMount || resolvedOpen;

    const anchored = useAnchoredPosition({
      anchorRef: triggerRef,
      boundaryPadding: collisionPadding,
      flip: avoidCollisions,
      floatingRef: contentRef,
      matchTriggerWidth: false,
      offset: sideOffset,
      open: shouldRender && mode === 'floating',
      placement,
      shift: avoidCollisions,
    });

    const state = useMenuContentState({
      closeOnTab: mode === 'floating',
      defaultHighlighted,
      open: resolvedOpen,
      onEscape,
      requestClose,
    });

    useContentInteractions({
      onCloseAutoFocus,
      onOpenAutoFocus,
      open: resolvedOpen,
      triggerRef,
    });

    useEffect(() => {
      if (!root.open || mode !== 'floating') {
        return;
      }

      /**
       * Detects pointer presses outside trigger/content for modal-style closing.
       */
      const onDocumentPointerDown = (event: PointerEvent) => {
        const target = event.target instanceof Node ? event.target : null;

        if (!target) {
          return;
        }

        const insideContent = contentRef.current?.contains(target);
        const insideTrigger = triggerRef.current?.contains(target);

        if (insideContent || insideTrigger) {
          return;
        }

        root.onPointerDownOutside?.(
          event as unknown as React.PointerEvent<HTMLElement>
        );
        root.onInteractOutside?.(event);

        if (root.modal) {
          requestClose();
        }
      };

      /**
       * Detects focus escapes from trigger/content for modal-style closing.
       */
      const onDocumentFocusIn = (event: FocusEvent) => {
        const target = event.target instanceof Node ? event.target : null;

        if (!target) {
          return;
        }

        const insideContent = contentRef.current?.contains(target);
        const insideTrigger = triggerRef.current?.contains(target);

        if (insideContent || insideTrigger) {
          return;
        }

        root.onFocusOutside?.(
          event as unknown as React.FocusEvent<HTMLElement>
        );
        root.onInteractOutside?.(event);

        if (root.modal) {
          requestClose();
        }
      };

      document.addEventListener('pointerdown', onDocumentPointerDown);
      document.addEventListener('focusin', onDocumentFocusIn);

      return () => {
        document.removeEventListener('pointerdown', onDocumentPointerDown);
        document.removeEventListener('focusin', onDocumentFocusIn);
      };
    }, [mode, requestClose, resolvedOpen, root, triggerRef]);

    useEffect(() => {
      if (import.meta.env.PROD) {
        return;
      }

      if (!shouldRender) {
        return;
      }

      const hasAriaLabel = typeof contentProps['aria-label'] === 'string';
      const hasAriaLabelledBy =
        typeof contentProps['aria-labelledby'] === 'string';

      if (!hasAriaLabel && !hasAriaLabelledBy) {
        console.warn(
          'Menu.Content should include aria-label or aria-labelledby when not labelled by a trigger.'
        );
      }
    }, [contentProps, shouldRender]);

    const contextValue = useMemo<MenuContentContextValue>(
      () => ({
        contentId: id,
        focusByDelta: state.focusByDelta,
        focusFirst: state.focusFirst,
        focusLast: state.focusLast,
        getItems: state.getItems,
        highlightedId: state.highlightedId,
        registerItem: state.registerItem,
        requestClose,
        selectByTypeahead: state.selectByTypeahead,
        setHighlightedId: state.setHighlightedId,
      }),
      [
        id,
        requestClose,
        state.focusByDelta,
        state.focusFirst,
        state.focusLast,
        state.getItems,
        state.highlightedId,
        state.registerItem,
        state.selectByTypeahead,
        state.setHighlightedId,
      ]
    );

    if (!shouldRender) {
      return null;
    }

    const styleVars = {
      ...style,
      ...(mode === 'floating'
        ? {
            ...anchored.style,
            '--menu-content-available-height': `${
              typeof window === 'undefined' ? 0 : window.innerHeight
            }px`,
            '--menu-trigger-width': `${anchored.anchorRef.current?.getBoundingClientRect().width ?? 0}px`,
          }
        : {}),
      maxHeight,
      maxWidth,
      minWidth,
      width,
    } as MenuStyleVars;

    const content = (
      <MenuContentContext.Provider value={contextValue}>
        <Component
          {...contentProps}
          aria-orientation={root.orientation}
          className={className}
          data-menu-content-id={id}
          data-mode={mode}
          data-open={resolvedOpen ? '' : undefined}
          id={id}
          onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
            const target =
              event.target instanceof Element ? event.target : null;
            const owner = target?.closest('[data-menu-content-id]');

            if (owner && owner !== event.currentTarget) {
              onKeyDown?.(event);
              return;
            }

            state.onKeyDown(event);
            onKeyDown?.(event);
          }}
          ref={mergeRefs(
            forwardedRef as Ref<HTMLElement>,
            (node: HTMLElement | null) => {
              contentRef.current = node;
            }
          )}
          role={role}
          style={styleVars as CSSProperties}
          tabIndex={-1}
        >
          {children}
        </Component>
      </MenuContentContext.Provider>
    );

    if (mode !== 'floating') {
      return content;
    }

    const portalProps = {
      container:
        container ??
        (typeof portal === 'object' && portal instanceof HTMLElement
          ? portal
          : null),
      disabled: portal === false,
    } as ComponentPropsWithoutRef<typeof Portal>;

    return <Portal {...portalProps}>{content}</Portal>;
  }
);

MenuContentPrimitive.displayName = 'MenuContentPrimitive';

/**
 * Primary container for menu items and composed content.
 */
export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  (props, ref) => {
    const root = useMenuRootContext('Menu.Content');

    return (
      <MenuContentPrimitive
        {...props}
        ref={ref}
        requestClose={() => root.onOpenChange?.(false)}
        triggerRef={root.triggerRef}
      />
    );
  }
);

MenuContent.displayName = 'Menu.Content';
