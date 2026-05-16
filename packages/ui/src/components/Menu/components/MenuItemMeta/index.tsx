import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from '@/components/Menu/Menu.module.scss';
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
        className={classNames(
          styles.itemMeta,
          align === 'start' ? styles.metaStart : styles.metaEnd,
          muted && styles.muted,
          className
        )}
        ref={ref}
      />
    );
  }
);

MenuItemMeta.displayName = 'Menu.ItemMeta';
