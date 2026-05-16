import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';

import { MenuItemStateContext } from '@/components/Menu/internal/contexts';
import type { MenuItemIndicatorProps } from '@/components/Menu/types';

/** Indicator slot for checkbox/radio/submenu state visuals. */
export const MenuItemIndicator = forwardRef<
  HTMLSpanElement,
  MenuItemIndicatorProps
>(
  (
    {
      asChild = false,
      children,
      className,
      forceMount = false,
      position = 'start',
      ...indicatorProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';
    const state = useContext(MenuItemStateContext);

    const visible = !!state?.checked;

    if (!forceMount && !visible) {
      return null;
    }

    return (
      <Component
        {...indicatorProps}
        className={className}
        data-position={position}
        data-state={visible ? 'visible' : 'hidden'}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

MenuItemIndicator.displayName = 'Menu.ItemIndicator';
