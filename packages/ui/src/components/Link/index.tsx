import React from 'react';
import classNames from 'classnames';

import styles from './Link.module.scss';

/** Shared props for the ThemeShift Link component. */
type LinkBaseProps = {
  /**
   * Applies link styling to a child element instead of rendering an anchor.
   *
   * Example: `<Link asChild><NavLink to="/docs">Docs</NavLink></Link>`
   */
  asChild?: boolean;

  /** Link label or content. */
  children: React.ReactNode;

  /** Additional class names to append to the rendered element. */
  className?: string;
};

/** Props for the ThemeShift link component. */
export type LinkProps = LinkBaseProps & React.ComponentPropsWithoutRef<'a'>;

/** A styled text link that can render an anchor or decorate a child element. */
export const Link = ({
  asChild = false,
  children,
  className,
  ...anchorProps
}: LinkProps) => {
  if (asChild) {
    if (!React.isValidElement<{ className?: string }>(children)) {
      throw new Error(
        'ThemeShift Link with asChild expects a single React element child.'
      );
    }

    return React.cloneElement(children, {
      className: classNames(
        styles.container,
        children.props.className,
        className
      ),
    });
  }

  return (
    <a {...anchorProps} className={classNames(styles.container, className)}>
      {children}
    </a>
  );
};
