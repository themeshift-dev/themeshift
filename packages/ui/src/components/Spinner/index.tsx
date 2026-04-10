import React from 'react';
import classNames from 'classnames';

import styles from './Spinner.module.scss';

export type SpinnerProps = {
  className?: string;
  size?: number;
} & React.ComponentPropsWithoutRef<'svg'>;

export const Spinner = ({ className, size = 24, ...props }: SpinnerProps) => (
  <svg
    {...props}
    className={classNames(styles.container, className)}
    width={size}
    height={size}
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className={styles.group}>
      <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" />
    </g>
  </svg>
);
