import classNames from 'classnames';

import type { ApiReferenceHook } from '@/apiReference';
import { Link } from '@/app/components';

import styles from './HookCard.module.scss';
import { Badge } from '@themeshift/ui/components/Badge';

type HookCardProps = {
  className?: string;
  hook: ApiReferenceHook;
  href: string;
};

export const HookCard = ({ className, hook, href }: HookCardProps) => {
  return (
    <Link className={classNames(styles.container, className)} to={href}>
      <div className={styles.titleRow}>
        <div className={styles.title}>{hook.name}</div>
        <Badge tone="info" variant="outline">
          Hook
        </Badge>
      </div>

      <div className={styles.description}>{hook.meta?.description}</div>
    </Link>
  );
};
