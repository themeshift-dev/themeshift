import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import type { MenuViewportProps } from '@/components/Menu/types';

/** Optional scroll viewport wrapper for menu content. */
export const MenuViewport = forwardRef<HTMLDivElement, MenuViewportProps>(
  (
    {
      asChild = false,
      children,
      className,
      maxHeight,
      onScroll,
      overscrollBehavior,
      scrollable = true,
      style,
      ...viewportProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...viewportProps}
        className={className}
        data-scrollable={scrollable ? '' : undefined}
        onScroll={onScroll}
        ref={ref}
        style={{
          ...style,
          maxHeight,
          overscrollBehavior,
        }}
      >
        {children}
      </Component>
    );
  }
);

MenuViewport.displayName = 'Menu.Viewport';
