import classNames from 'classnames';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './ErrorMessage.module.scss';

export type ErrorMessageProps = ComponentPropsWithoutRef<'p'>;

/** A lightweight error text primitive for form controls. */
export const ErrorMessage = ({
  children,
  className,
  role = 'alert',
  ...props
}: ErrorMessageProps) => {
  return (
    <p
      {...props}
      className={classNames(styles.container, className)}
      role={role}
    >
      {children}
    </p>
  );
};
