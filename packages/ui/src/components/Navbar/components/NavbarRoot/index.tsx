import classNames from 'classnames';
import type { ElementType } from 'react';

import type { NavbarPosition, NavbarProps } from '../types';
import styles from './NavbarRoot.module.scss';

const positionClassMap = {
  static: styles.static,
  absolute: styles.absolute,
  fixed: styles.fixed,
  sticky: styles.sticky,
} satisfies Record<NavbarPosition, string>;

/** Root wrapper for the ThemeShift navbar. */
export const NavbarRoot = <T extends ElementType = 'nav'>({
  as,
  children,
  className,
  position = 'static',
  ...navbarProps
}: NavbarProps<T>) => {
  const Component = as ?? 'nav';

  return (
    <Component
      {...navbarProps}
      className={classNames(
        styles.root,
        positionClassMap[position],
        className,
      )}
    >
      {children}
    </Component>
  );
};
