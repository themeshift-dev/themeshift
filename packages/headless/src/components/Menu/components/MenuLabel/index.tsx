import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import type { MenuLabelProps } from '@/components/Menu/types';

/** Non-interactive label used to title groups or sections. */
export const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(
  (
    { asChild = false, className, inset = false, muted = false, ...labelProps },
    ref
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...labelProps}
        className={className}
        data-inset={inset ? '' : undefined}
        data-muted={muted ? '' : undefined}
        ref={ref}
        role="presentation"
      />
    );
  }
);

MenuLabel.displayName = 'Menu.Label';
