import { Card } from '@themeshift/ui/components/Card';
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
    <Card
      as={Link}
      className={classNames(styles.container, className)}
      padding="small"
      radius="small"
      shadow="none"
      to={href}
    >
      <Card.Header>
        <Card.Title>{componentData.name}</Card.Title>
        <Card.Description>{componentData.meta?.description}</Card.Description>
      </Card.Header>
    </Card>
  );
};
