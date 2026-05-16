import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { forwardRef, useContext } from 'react';

import styles from '@/components/Menu/Menu.module.scss';
import { MenuItemStateContext } from '@/components/Menu/internal/contexts';
import type { MenuItemIndicatorProps } from '@/components/Menu/types';

/** Indicator slot for checkbox/radio/submenu state visuals. */
export const MenuItemIndicator = forwardRef<
  HTMLSpanElement,
  MenuItemIndicatorProps
>(
  (
    {
      asChild = false,
      children,
      className,
      forceMount = false,
      position = 'start',
      ...indicatorProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';
    const state = useContext(MenuItemStateContext);

    const visible = !!state?.checked;

    if (!forceMount && !visible) {
      return null;
    }

    return (
      <Component
        {...indicatorProps}
        className={classNames(
          styles.itemIndicator,
          position === 'end' ? styles.indicatorEnd : styles.indicatorStart,
          className
        )}
        data-state={visible ? 'visible' : 'hidden'}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

MenuItemIndicator.displayName = 'Menu.ItemIndicator';
