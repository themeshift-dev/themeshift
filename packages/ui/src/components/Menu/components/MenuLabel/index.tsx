import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from '@/components/Menu/Menu.module.scss';
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
        className={classNames(
          styles.label,
          inset && styles.inset,
          muted && styles.muted,
          className
        )}
        ref={ref}
        role="presentation"
      />
    );
  }
);

MenuLabel.displayName = 'Menu.Label';
