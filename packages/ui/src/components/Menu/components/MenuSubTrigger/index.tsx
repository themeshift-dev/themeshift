import { forwardRef, useCallback, useContext, useEffect, useRef } from 'react';

import { IconChevronRight } from '@/icons';

import {
  MenuItemStateContext,
  MenuSubContext,
  useMenuRootContext,
} from '@/components/Menu/internal/contexts';
import { mergeRefs } from '@/components/Menu/internal/utils';
import type { MenuSubTriggerProps } from '@/components/Menu/types';
import { MenuItemBase } from '../MenuItem';
import { MenuItemMeta } from '../MenuItemMeta';

/**
 * Item primitive that controls nested submenu open/close interactions.
 */
export const MenuSubTrigger = forwardRef<HTMLDivElement, MenuSubTriggerProps>(
  ({ indicator, onSelect, ...triggerProps }, ref) => {
    const sub = useContext(MenuSubContext);
    const root = useMenuRootContext('Menu.SubTrigger');
    const openTimerRef = useRef<number | null>(null);
    const closeTimerRef = useRef<number | null>(null);

    if (!sub) {
      throw new Error('Menu.SubTrigger must be used within Menu.Sub.');
    }

    /**
     * Opens submenu after intent delay and moves focus into first submenu item.
     */
    const openWithDelay = useCallback(() => {
      if (sub.disabled) {
        return;
      }

      if (typeof window === 'undefined') {
        sub.setOpen(true);
        return;
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }

      openTimerRef.current = window.setTimeout(() => {
        openTimerRef.current = null;
        sub.setOpen(true);
        window.setTimeout(() => {
          const firstItem = sub.contentRef.current?.querySelector(
            '[role^="menuitem"][tabindex="0"]'
          );

          if (firstItem instanceof HTMLElement) {
            firstItem.focus();
          }
        }, 0);
      }, sub.openDelay);
    }, [sub]);

    /**
     * Closes submenu after intent delay unless pointer movement suggests intent
     * toward submenu content.
     */
    const closeWithDelay = useCallback(() => {
      if (typeof window === 'undefined') {
        sub.setOpen(false);
        return;
      }

      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }

      closeTimerRef.current = window.setTimeout(() => {
        const triggerRect = sub.triggerRef.current?.getBoundingClientRect();
        const contentRect = sub.contentRef.current?.getBoundingClientRect();

        if (triggerRect && contentRect) {
          const movingTowardContent =
            root.dir === 'rtl'
              ? triggerRect.left >= contentRect.left
              : triggerRect.right <= contentRect.right;

          if (movingTowardContent && sub.open) {
            closeTimerRef.current = null;
            return;
          }
        }

        closeTimerRef.current = null;
        sub.setOpen(false);
      }, sub.closeDelay);
    }, [root.dir, sub]);

    useEffect(
      () => () => {
        if (typeof window === 'undefined') {
          return;
        }

        if (openTimerRef.current !== null) {
          window.clearTimeout(openTimerRef.current);
        }

        if (closeTimerRef.current !== null) {
          window.clearTimeout(closeTimerRef.current);
        }
      },
      []
    );

    const resolvedIndicator =
      indicator === undefined ? (
        <IconChevronRight
          aria-hidden
          style={root.dir === 'rtl' ? { transform: 'scaleX(-1)' } : undefined}
        />
      ) : (
        indicator
      );

    return (
      <MenuItemStateContext.Provider value={{ checked: sub.open }}>
        <MenuItemBase
          {...triggerProps}
          closeOnSelect={false}
          kind="sub-trigger"
          onKeyDown={(event) => {
            const openKey = root.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
            const closeKey = root.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

            if (event.key === openKey) {
              event.preventDefault();
              sub.setOpen(true);
              if (typeof window !== 'undefined') {
                window.setTimeout(() => {
                  const firstItem = sub.contentRef.current?.querySelector(
                    '[role^="menuitem"][tabindex="0"]'
                  );

                  if (firstItem instanceof HTMLElement) {
                    firstItem.focus();
                  }
                }, 0);
              }
              return;
            }

            if (event.key === closeKey) {
              event.preventDefault();
              sub.setOpen(false);
              sub.triggerRef.current?.focus();
              return;
            }

            triggerProps.onKeyDown?.(event);
          }}
          onMouseLeave={() => {
            if (!sub.openOnHover) {
              return;
            }

            closeWithDelay();
          }}
          onMouseMove={(event) => {
            if (sub.openOnHover) {
              openWithDelay();
            }

            triggerProps.onMouseMove?.(event);
          }}
          onSelect={(event) => {
            const nextOpen = !sub.open;
            sub.setOpen(nextOpen);
            if (nextOpen && typeof window !== 'undefined') {
              window.setTimeout(() => {
                const firstItem = sub.contentRef.current?.querySelector(
                  '[role^="menuitem"][tabindex="0"]'
                );

                if (firstItem instanceof HTMLElement) {
                  firstItem.focus();
                }
              }, 0);
            }
            onSelect?.(event);
          }}
          ref={mergeRefs(ref, (node: HTMLElement | null) => {
            sub.setTriggerNode(node);
            root.registerTrigger(node);
          })}
        >
          {triggerProps.children}
          {resolvedIndicator !== null ? (
            <MenuItemMeta>{resolvedIndicator}</MenuItemMeta>
          ) : null}
        </MenuItemBase>
      </MenuItemStateContext.Provider>
    );
  }
);

MenuSubTrigger.displayName = 'Menu.SubTrigger';
