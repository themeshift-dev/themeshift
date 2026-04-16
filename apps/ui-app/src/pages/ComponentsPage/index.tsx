import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';

import { useComponentData } from '@/component-data';

import { ComponentCard } from './components';
import styles from './ComponentsPage.module.scss';

export const ComponentsPage = () => {
  const { groupedComponents } = useComponentData();

  return (
    <PageShell>
      <Heading>Components</Heading>

      <div className={styles.cardGrid}>
        {groupedComponents.map((group) => (
          <>
            <Heading level={2} className={styles.sectionHeading}>
              {group.label}
            </Heading>

            {group.components.map((component) => (
              <ComponentCard
                href={`/components/${component.routeSlug}`}
                className={styles.card}
                componentData={component}
                key={component.name}
              />
            ))}
          </>
        ))}
      </div>
    </PageShell>
  );
};
