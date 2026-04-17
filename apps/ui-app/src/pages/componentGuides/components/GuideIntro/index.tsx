import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './GuideIntro.module.scss';

export type GuideIntroProps = {
  children: ReactNode;
  className?: string;
};

export const GuideIntro = ({ children, className }: GuideIntroProps) => (
  <section className={classNames(styles.container, className)}>
    {children}
  </section>
);
