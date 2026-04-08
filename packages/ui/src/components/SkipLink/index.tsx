import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import classNames from 'classnames';

import styles from './SkipLink.module.scss';

/** Props for the ThemeShift skip-link primitive. */
export type SkipLinkProps = {
  /** Additional class names to append to the rendered link. */
  className?: string;

  /** Optional text content for the skip link. */
  children?: ReactNode;

  /** Destination id reference, typically the main landmark. */
  href: string;

  /** Optional text label used when `children` is not provided. */
  label?: string;
} & Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'href'>;

/** A focus-revealed link that lets keyboard users bypass repeated chrome. */
export const SkipLink = ({
  children,
  className,
  href,
  label,
  ...anchorProps
}: SkipLinkProps) => (
  <a
    {...anchorProps}
    href={href}
    className={classNames(styles.container, className)}
  >
    {children ?? label}
  </a>
);
