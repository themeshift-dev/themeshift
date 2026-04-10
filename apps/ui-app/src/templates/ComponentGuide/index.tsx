import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';
import type { ReactNode } from 'react';

import styles from './ComponentGuide.module.scss';

type ComponentGuideProps = {
  aside?: ReactNode;
  asideLabel?: string;
  children?: ReactNode;
  description?: string;
  title: string;
};

export const ComponentGuide = ({
  aside,
  asideLabel,
  children,
  description,
  title,
}: ComponentGuideProps) => (
  <PageShell
    aside={
      aside ? (
        <div className={styles.aside}>
          <div className={styles.asideInner}>{aside}</div>
        </div>
      ) : undefined
    }
    asideLabel={asideLabel}
  >
    <div className={styles.main}>
      {title && <Heading level={2}>{title}</Heading>}
      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.content}>{children}</div>
    </div>
  </PageShell>
);
