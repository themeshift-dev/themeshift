import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import type { MenuItemTextProps } from '@/components/Menu/types';

/** Optional text slot with secondary description support. */
export const MenuItemText = forwardRef<HTMLSpanElement, MenuItemTextProps>(
  (
    {
      asChild = false,
      children,
      className,
      description,
      truncate = false,
      ...textProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';

    return (
      <Component
        {...textProps}
        className={className}
        data-truncate={truncate ? '' : undefined}
        ref={ref}
      >
        {children}
        {description ? (
          <span data-slot="description">{description}</span>
        ) : null}
      </Component>
    );
  }
);

MenuItemText.displayName = 'Menu.ItemText';
