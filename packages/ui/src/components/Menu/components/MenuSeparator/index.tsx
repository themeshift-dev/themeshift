import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from '@/components/Menu/Menu.module.scss';
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
        className={classNames(
          styles.separator,
          orientation === 'vertical' && styles.separatorVertical,
          spacing === 'none' && styles.separatorSpacingNONE,
          spacing === 'small' && styles.separatorSpacingSM,
          spacing === 'medium' && styles.separatorSpacingMD,
          spacing === 'large' && styles.separatorSpacingLG,
          className
        )}
        ref={ref}
        role={decorative ? 'presentation' : 'separator'}
      />
    );
  }
);

MenuSeparator.displayName = 'Menu.Separator';
