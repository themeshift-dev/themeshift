import { forwardRef, useContext, useLayoutEffect } from 'react';

import {
  MenuSubContext,
  useMenuRootContext,
} from '@/components/Menu/internal/contexts';
import { mergeRefs } from '@/components/Menu/internal/utils';
import type {
  MenuPlacement,
  MenuSubContentProps,
} from '@/components/Menu/types';
import { MenuContentPrimitive } from '../MenuContent';

/**
 * Floating submenu content container rendered from a `Menu.Sub` scope.
 */
export const MenuSubContent = forwardRef<HTMLDivElement, MenuSubContentProps>(
  (props, ref) => {
    const root = useMenuRootContext('Menu.SubContent');
    const sub = useContext(MenuSubContext);

    if (!sub) {
      throw new Error('Menu.SubContent must be used within Menu.Sub.');
    }

    const side: MenuPlacement = root.dir === 'rtl' ? 'left' : 'right';
    const { role, ...subContentProps } = props;
    void role;

    /**
     * Focuses the first tabbable submenu item once content is available.
     */
    const focusFirstItem = (node: HTMLElement | null) => {
      const firstFocusableItem = node?.querySelector(
        '[role^="menuitem"][tabindex="0"]'
      );

      if (firstFocusableItem instanceof HTMLElement) {
        firstFocusableItem.focus();
      }
    };

    useLayoutEffect(() => {
      if (!sub.open) {
        return;
      }
      focusFirstItem(sub.contentRef.current);
    }, [sub.contentRef, sub.open]);

    return (
      <MenuContentPrimitive
        {...subContentProps}
        align="start"
        defaultHighlighted="first"
        mode="floating"
        open={sub.open}
        onEscape={(event) => {
          event.preventDefault();
          sub.setOpen(false);
          sub.triggerRef.current?.focus();
        }}
        onKeyDown={(event) => {
          const closeKey = root.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

          if (event.key === closeKey) {
            event.preventDefault();
            sub.setOpen(false);
            sub.triggerRef.current?.focus();
          }
        }}
        ref={mergeRefs(ref, (node: HTMLElement | null) => {
          sub.setContentNode(node);

          if (node && sub.open && typeof window !== 'undefined') {
            window.requestAnimationFrame(() => {
              focusFirstItem(node);
            });
          }
        })}
        requestClose={() => sub.setOpen(false)}
        side={side}
        triggerRef={sub.triggerRef}
      />
    );
  }
);

MenuSubContent.displayName = 'Menu.SubContent';
