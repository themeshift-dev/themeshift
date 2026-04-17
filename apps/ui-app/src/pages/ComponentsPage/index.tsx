import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';
import { Fragment } from 'react';

import { useApiReference } from '@/apiReference';

import { ComponentCard, HookCard } from './components';
import styles from './ComponentsPage.module.scss';

export const ComponentsPage = () => {
  const { grouped } = useApiReference();

  return (
    <PageShell>
      <Heading>UI</Heading>

      <div className={styles.cardGrid}>
        {grouped.map((group) => (
          <Fragment key={group.key}>
            <Heading level={2} className={styles.sectionHeading}>
              {group.label}
            </Heading>

            {group.components.map((entry) =>
              entry.type === 'component' ? (
                <ComponentCard
                  className={styles.card}
                  componentData={entry}
                  href={`/ui/component/${entry.routeSlug}`}
                  key={`${entry.type}-${entry.name}`}
                />
              ) : (
                <HookCard
                  className={styles.card}
                  hook={entry}
                  href={`/ui/hook/${entry.routeSlug}`}
                  key={`${entry.type}-${entry.name}`}
                />
              )
            )}
          </Fragment>
        ))}
      </div>
    </PageShell>
  );
};
