import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from '@/components/Menu/Menu.module.scss';
import type { MenuItemIconProps } from '@/components/Menu/types';

/** Leading icon slot for menu items. */
export const MenuItemIcon = forwardRef<HTMLSpanElement, MenuItemIconProps>(
  (
    {
      asChild = false,
      className,
      decorative = true,
      size = 'md',
      ...iconProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';

    return (
      <Component
        {...iconProps}
        aria-hidden={decorative ? true : iconProps['aria-hidden']}
        className={classNames(
          styles.itemIcon,
          size === 'sm' && styles.itemIconSM,
          size === 'md' && styles.itemIconMD,
          size === 'lg' && styles.itemIconLG,
          className
        )}
        ref={ref}
      />
    );
  }
);

MenuItemIcon.displayName = 'Menu.ItemIcon';
