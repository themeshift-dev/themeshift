import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import type { MenuGroupProps } from '@/components/Menu/types';

/** Grouping container for related menu items. */
export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(
  (
    { asChild = false, className, disabled = false, inset, ...groupProps },
    ref
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...groupProps}
        className={className}
        data-disabled={disabled ? '' : undefined}
        data-inset={inset ? '' : undefined}
        ref={ref}
        role="group"
      />
    );
  }
);

MenuGroup.displayName = 'Menu.Group';
