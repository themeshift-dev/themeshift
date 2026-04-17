import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './GuideCallout.module.scss';

export type GuideCalloutProps = {
  children: ReactNode;
  className?: string;
};

export const GuideCallout = ({ children, className }: GuideCalloutProps) => (
  <p className={classNames(styles.container, className)}>{children}</p>
);
