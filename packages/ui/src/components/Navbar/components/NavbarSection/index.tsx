import classNames from 'classnames';
import type { ElementType } from 'react';

import type {
  CSSVarStyle,
  NavbarSectionAlign,
  NavbarSectionDirection,
  NavbarSectionProps,
} from '../types';
import styles from './NavbarSection.module.scss';

const alignClassMap = {
  start: styles.start,
  center: styles.center,
  end: styles.end,
} satisfies Record<NavbarSectionAlign, string>;

const directionClassMap = {
  row: styles.row,
  column: styles.column,
} satisfies Record<NavbarSectionDirection, string>;

/** Aligned content slot used within the navbar layout. */
export const NavbarSection = <T extends ElementType = 'div'>({
  align = 'start',
  as,
  children,
  className,
  direction = 'row',
  gap,
  style,
  wrap = false,
  ...sectionProps
}: NavbarSectionProps<T>) => {
  const Component = as ?? 'div';
  const cssVarStyle: CSSVarStyle = { ...style };

  if (gap !== undefined) {
    cssVarStyle['--navbar-section-gap'] = gap;
  }

  return (
    <Component
      {...sectionProps}
      className={classNames(
        styles.section,
        alignClassMap[align],
        directionClassMap[direction],
        wrap && styles.wrap,
        className,
      )}
      style={cssVarStyle}
    >
      {children}
    </Component>
  );
};
