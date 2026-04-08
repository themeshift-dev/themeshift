import classNames from 'classnames';
import type { ElementType } from 'react';

import type { CSSVarStyle, NavbarContainerProps } from '../types';
import styles from './NavbarContainer.module.scss';

/** Width-constrained inner layout wrapper for navbar content. */
export const NavbarContainer = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  gap,
  maxWidth,
  style,
  ...containerProps
}: NavbarContainerProps<T>) => {
  const Component = as ?? 'div';
  const cssVarStyle: CSSVarStyle = { ...style };

  if (gap !== undefined) {
    cssVarStyle['--navbar-container-gap'] = gap;
  }

  if (maxWidth !== undefined) {
    cssVarStyle['--navbar-max-width'] = maxWidth;
  }

  return (
    <Component
      {...containerProps}
      className={classNames(styles.container, className)}
      style={cssVarStyle}
    >
      {children}
    </Component>
  );
};
