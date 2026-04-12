import classNames from 'classnames';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Label.module.scss';

export type LabelProps = ComponentPropsWithoutRef<'label'>;

/** A lightweight text label for form controls. */
export const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <label {...props} className={classNames(styles.container, className)}>
      {children}
    </label>
  );
};
