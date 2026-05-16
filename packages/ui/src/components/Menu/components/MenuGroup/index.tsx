import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from '@/components/Menu/Menu.module.scss';
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
        className={classNames(
          styles.group,
          inset && styles.inset,
          disabled && styles.disabled,
          className
        )}
        data-disabled={disabled ? '' : undefined}
        ref={ref}
        role="group"
      />
    );
  }
);

MenuGroup.displayName = 'Menu.Group';
