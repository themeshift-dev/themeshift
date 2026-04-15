import { useContext, useMemo } from 'react';

import { ComponentDataContext } from './ComponentDataContext';
import type { ComponentData } from './types';
import type { DocsCategory } from '../../../../packages/ui/src/types';

type GroupedComponents = {
  key: DocsCategory | 'uncategorized';
  label: string;
  components: ComponentData[];
};

type UseComponentDataValue = {
  component: ComponentData | undefined;
  components: ComponentData[];
  groupedComponents: GroupedComponents[];
};

const CATEGORY_ORDER: Array<DocsCategory | 'uncategorized'> = [
  'inputs-forms',
  'actions',
  'feedback-status',
  'data-display',
  'navigation-structure',
  'overlays',
  'layout-utilities',
  'templates-shells',
  'uncategorized',
];

const CATEGORY_LABELS: Record<DocsCategory | 'uncategorized', string> = {
  'inputs-forms': 'Inputs & Forms',
  actions: 'Actions',
  'feedback-status': 'Feedback & Status',
  'data-display': 'Data Display',
  'navigation-structure': 'Navigation & Structure',
  overlays: 'Overlays',
  'layout-utilities': 'Layout & Utilities',
  'templates-shells': 'Templates & Shells',
  uncategorized: 'Uncategorized',
};

function sortComponents(a: ComponentData, b: ComponentData) {
  const aOrder = a.meta?.order ?? Number.POSITIVE_INFINITY;
  const bOrder = b.meta?.order ?? Number.POSITIVE_INFINITY;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return a.component.localeCompare(b.component);
}

export function useComponentData(slug?: string): UseComponentDataValue {
  const context = useContext(ComponentDataContext);

  if (!context) {
    throw new Error(
      'useComponentData must be used within a ComponentDataProvider'
    );
  }

  return useMemo(() => {
    const component = slug
      ? context.components.find((component) => component.slug === slug)
      : undefined;

    const groupedMap = new Map<
      DocsCategory | 'uncategorized',
      ComponentData[]
    >();

    for (const item of context.components) {
      const category = item.meta?.category ?? 'uncategorized';
      const existing = groupedMap.get(category);

      if (existing) {
        existing.push(item);
      } else {
        groupedMap.set(category, [item]);
      }
    }

    const groupedComponents = CATEGORY_ORDER.map((key) => {
      const components = groupedMap.get(key);

      if (!components || components.length === 0) {
        return null;
      }

      return {
        key,
        label: CATEGORY_LABELS[key],
        components: [...components].sort(sortComponents),
      };
    }).filter((group): group is GroupedComponents => group !== null);

    return {
      component,
      components: context.components,
      groupedComponents,
    };
  }, [context.components, slug]);
}
