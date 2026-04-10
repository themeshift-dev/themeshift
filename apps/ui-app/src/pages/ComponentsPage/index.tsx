import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';

import { useComponentData } from '@/component-data';

import { ComponentCard } from './components';

export const ComponentsPage = () => {
  const { components } = useComponentData();

  return (
    <PageShell>
      <Heading>Components</Heading>

      {components.map(({ component, slug }) => (
        <ComponentCard
          key={component}
          name={component}
          url={`/components/${slug}`}
        />
      ))}
    </PageShell>
  );
};
