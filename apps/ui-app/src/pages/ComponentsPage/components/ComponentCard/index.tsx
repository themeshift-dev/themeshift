import classNames from 'classnames';

import type { ApiReferenceComponent } from '@/apiReference';
import { Link } from '@/app/components';

import styles from './ComponentCard.module.scss';

type ComponentCardProps = {
  className?: string;
  componentData: ApiReferenceComponent;
  href: string;
};

export const ComponentCard = ({
  className,
  componentData,
  href,
}: ComponentCardProps) => {
  return (
    <Link className={classNames(styles.container, className)} to={href}>
      <div className={styles.title}>{componentData.name}</div>

      <div className={styles.description}>
        {componentData.meta?.description}
      </div>
    </Link>
  );
};
