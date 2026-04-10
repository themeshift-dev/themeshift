import { useContext, useMemo } from 'react';

import { ComponentDataContext } from './ComponentDataContext';
import type { ComponentData } from './types';

type UseComponentDataValue = {
  component: ComponentData | undefined;
  components: ComponentData[];
};

export function useComponentData(slug?: string): UseComponentDataValue {
  const context = useContext(ComponentDataContext);

  if (!context) {
    throw new Error(
      'useComponentData must be used within a ComponentDataProvider'
    );
  }

  return useMemo(
    () => ({
      component: slug
        ? context.components.find((component) => component.slug === slug)
        : undefined,
      components: context.components,
    }),
    [context.components, slug]
  );
}
