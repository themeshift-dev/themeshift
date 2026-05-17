import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import type { MenuSeparatorProps } from '@/components/Menu/types';

/** Visual separator between menu sections. */
export const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  (
    {
      asChild = false,
      className,
      decorative = true,
      orientation = 'horizontal',
      spacing = 'medium',
      ...separatorProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...separatorProps}
        aria-hidden={decorative ? true : separatorProps['aria-hidden']}
        className={className}
        data-orientation={orientation}
        data-spacing={spacing}
        ref={ref}
        role={decorative ? 'presentation' : 'separator'}
      />
    );
  }
);

MenuSeparator.displayName = 'Menu.Separator';
