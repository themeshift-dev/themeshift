import { Link } from '@/app/components';

import { type ComponentData } from '@/component-data';

import styles from './ComponentCard.module.scss';
import classNames from 'classnames';

type ComponentCardProps = {
  className?: string;
  componentData: ComponentData;
  href: string;
};

export const ComponentCard = ({
  className,
  componentData,
  href,
}: ComponentCardProps) => {
  return (
    <Link className={classNames(styles.container, className)} to={href}>
      <div className={styles.title}>{componentData.component}</div>

      <div className={styles.description}>
        {componentData.meta?.description}
      </div>
    </Link>
  );
};
