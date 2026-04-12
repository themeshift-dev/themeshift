import classNames from 'classnames';
import type { ReactNode } from 'react';

import { Link } from '@/app/components/Link';

import styles from './Breadcrumb.module.scss';

export type BreadcrumbItem = {
  ariaLabel?: string;
  current?: boolean;
  href?: string;
  icon?: ReactNode;
  label?: string;
};

export type BreadcrumbProps = {
  ariaLabel?: string;
  className?: string;
  items: BreadcrumbItem[];
};

const getCurrentItemIndex = (items: BreadcrumbItem[]) => {
  const explicitCurrentIndex = items.reduce(
    (currentIndex, item, index) => (item.current ? index : currentIndex),
    -1
  );

  return explicitCurrentIndex === -1 ? items.length - 1 : explicitCurrentIndex;
};

const renderItemContent = ({ icon, label }: BreadcrumbItem) => (
  <>
    {icon && (
      <span aria-hidden="true" className={styles.icon}>
        {icon}
      </span>
    )}
    {label && <span>{label}</span>}
  </>
);

export const Breadcrumb = ({
  ariaLabel = 'Breadcrumb',
  className,
  items,
}: BreadcrumbProps) => {
  if (!items.length) {
    return null;
  }

  const currentItemIndex = getCurrentItemIndex(items);

  return (
    <nav
      aria-label={ariaLabel}
      className={classNames(styles.continer, className)}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === currentItemIndex;
          const key =
            item.href ?? item.label ?? item.ariaLabel ?? String(index);
          const itemContent = renderItemContent(item);

          return (
            <li className={styles.item} key={key}>
              {item.href && !isCurrent ? (
                <Link
                  aria-label={item.ariaLabel}
                  className={styles.link}
                  to={item.href}
                >
                  {itemContent}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={item.ariaLabel}
                  className={classNames(
                    styles.text,
                    isCurrent ? styles.current : styles.muted
                  )}
                >
                  {itemContent}
                </span>
              )}

              {index < items.length - 1 && (
                <span aria-hidden="true" className={styles.separator}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
