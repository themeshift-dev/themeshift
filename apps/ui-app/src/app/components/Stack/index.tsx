import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';

import styles from './Stack.module.scss';

export type StackProps = {
  align?: CSSProperties['alignItems'];
  children?: ReactNode;
  className?: string;
  gap?: CSSProperties['gap'];
  justify?: CSSProperties['justifyContent'];
};

export const Stack = ({
  align,
  children,
  className,
  gap = '1rem',
  justify,
}: StackProps) => {
  const style = {
    '--stack-gap': gap,
    alignItems: align,
    justifyContent: justify,
  } as CSSProperties;

  return (
    <div className={classNames(styles.container, className)} style={style}>
      {children}
    </div>
  );
};
