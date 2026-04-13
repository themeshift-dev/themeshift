import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';

import { useComponentData } from '@/component-data';

import { ComponentCard } from './components';

const toComponentRoute = (componentName: string) =>
  componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const ComponentsPage = () => {
  const { components } = useComponentData();

  return (
    <PageShell>
      <Heading>Components</Heading>

      {components.map(({ component, slug }) => (
        <ComponentCard
          key={component}
          name={component}
          url={`/components/${toComponentRoute(component ?? slug)}`}
        />
      ))}
    </PageShell>
  );
};
