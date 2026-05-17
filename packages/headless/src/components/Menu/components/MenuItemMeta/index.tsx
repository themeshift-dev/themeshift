import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import type { MenuItemMetaProps } from '@/components/Menu/types';

/** Trailing metadata slot for shortcuts, badges, and hints. */
export const MenuItemMeta = forwardRef<HTMLSpanElement, MenuItemMetaProps>(
  (
    { asChild = false, align = 'end', className, muted = false, ...metaProps },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';

    return (
      <Component
        {...metaProps}
        className={className}
        data-align={align}
        data-muted={muted ? '' : undefined}
        ref={ref}
      />
    );
  }
);

MenuItemMeta.displayName = 'Menu.ItemMeta';
