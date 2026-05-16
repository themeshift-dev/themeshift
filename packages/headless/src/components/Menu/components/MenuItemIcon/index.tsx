import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import type { MenuItemIconProps } from '@/components/Menu/types';

/** Leading icon slot for menu items. */
export const MenuItemIcon = forwardRef<HTMLSpanElement, MenuItemIconProps>(
  (
    {
      asChild = false,
      className,
      decorative = true,
      size = 'medium',
      ...iconProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';

    return (
      <Component
        {...iconProps}
        aria-hidden={decorative ? true : iconProps['aria-hidden']}
        className={className}
        data-size={size}
        ref={ref}
      />
    );
  }
);

MenuItemIcon.displayName = 'Menu.ItemIcon';
