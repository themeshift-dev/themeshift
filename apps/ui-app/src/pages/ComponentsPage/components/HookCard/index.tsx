import { Card } from '@themeshift/ui/components/Card';
import classNames from 'classnames';

import type { ApiReferenceHook } from '@/apiReference';
import { Link } from '@/app/components';

import styles from './HookCard.module.scss';

type HookCardProps = {
  className?: string;
  hook: ApiReferenceHook;
  href: string;
};

export const HookCard = ({ className, hook, href }: HookCardProps) => {
  return (
    <Card
      as={Link}
      className={classNames(styles.container, className)}
      padding="small"
      radius="small"
      shadow="none"
      to={href}
    >
      <Card.Header>
        <div className={styles.titleRow}>
          <Card.Title className={styles.title}>{hook.name}</Card.Title>
          <Card.Badge tone="info" variant="outline" size="small">
            Hook
          </Card.Badge>
        </div>
        <Card.Description>{hook.meta?.description}</Card.Description>
      </Card.Header>
    </Card>
  );
};
