import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from '@/components/Menu/Menu.module.scss';
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
        className={classNames(
          styles.itemText,
          truncate && styles.truncate,
          className
        )}
        ref={ref}
      >
        {children}
        {description ? (
          <span className={styles.itemDescription}>{description}</span>
        ) : null}
      </Component>
    );
  }
);

MenuItemText.displayName = 'Menu.ItemText';
