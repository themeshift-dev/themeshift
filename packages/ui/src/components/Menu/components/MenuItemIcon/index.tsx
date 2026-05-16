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
        className={classNames(
          styles.itemIcon,
          size === 'small' && styles.itemIconSM,
          size === 'medium' && styles.itemIconMD,
          size === 'large' && styles.itemIconLG,
          className
        )}
        ref={ref}
      />
    );
  }
);

MenuItemIcon.displayName = 'Menu.ItemIcon';
