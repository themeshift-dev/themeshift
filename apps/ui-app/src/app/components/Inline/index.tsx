import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';

import styles from './Inline.module.scss';

export type InlineProps = {
  align?: CSSProperties['alignItems'];
  children?: ReactNode;
  className?: string;
  gap?: CSSProperties['gap'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
};

export const Inline = ({
  align,
  children,
  className,
  gap = '1rem',
  justify = 'center',
  wrap = true,
}: InlineProps) => {
  const style = {
    '--inline-gap': gap,
    alignItems: align,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    justifyContent: justify,
  } as CSSProperties;

  return (
    <div className={classNames(styles.container, className)} style={style}>
      {children}
    </div>
  );
};
