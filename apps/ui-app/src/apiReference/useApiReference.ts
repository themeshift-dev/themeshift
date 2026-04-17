import type { DocsCategory } from '@themeshift/docs-types';
import { useContext, useMemo } from 'react';

import { ApiReferenceContext } from './ApiReferenceContext';
import type {
  ApiReferenceComponent,
  ApiReferenceEntry,
  ApiReferenceHook,
  GroupedApiReference,
} from './types';

type UseApiReferenceOptions = {
  component?: string;
  hook?: string;
};

type UseApiReferenceValue = {
  component: ApiReferenceComponent | undefined;
  components: ApiReferenceComponent[];
  grouped: GroupedApiReference[];
  hook: ApiReferenceHook | undefined;
  hooks: ApiReferenceHook[];
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

function matchesLookupTarget(value: string, target: ApiReferenceEntry) {
  const normalized = value.trim().toLowerCase();

  if (normalized.length === 0) {
    return false;
  }

  return (
    target.name.toLowerCase() === normalized ||
    target.slug.toLowerCase() === normalized ||
    target.routeSlug.toLowerCase() === normalized
  );
}

function sortEntries(a: ApiReferenceEntry, b: ApiReferenceEntry) {
  const aOrder = a.meta?.order ?? Number.POSITIVE_INFINITY;
  const bOrder = b.meta?.order ?? Number.POSITIVE_INFINITY;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return a.name.localeCompare(b.name);
}

export function useApiReference(
  options: UseApiReferenceOptions = {}
): UseApiReferenceValue {
  const context = useContext(ApiReferenceContext);

  if (!context) {
    throw new Error(
      'useApiReference must be used within an ApiReferenceProvider'
    );
  }

  return useMemo(() => {
    const component = options.component
      ? context.components.find((item) =>
          matchesLookupTarget(options.component!, item)
        )
      : undefined;
    const hook = options.hook
      ? context.hooks.find((item) => matchesLookupTarget(options.hook!, item))
      : undefined;

    const groupedMap = new Map<
      DocsCategory | 'uncategorized',
      ApiReferenceEntry[]
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

    for (const item of context.hooks) {
      const category = item.meta?.category ?? 'uncategorized';
      const existing = groupedMap.get(category);

      if (existing) {
        existing.push(item);
      } else {
        groupedMap.set(category, [item]);
      }
    }

    const grouped = CATEGORY_ORDER.map((key) => {
      const entries = groupedMap.get(key);

      if (!entries || entries.length === 0) {
        return null;
      }

      const components = entries
        .filter((entry) => entry.type === 'component')
        .sort(sortEntries);
      const hooks = entries
        .filter((entry) => entry.type === 'hook')
        .sort(sortEntries);

      return {
        key,
        label: CATEGORY_LABELS[key],
        components: [...components, ...hooks],
      };
    }).filter((group): group is GroupedApiReference => group !== null);

    return {
      component,
      components: context.components,
      grouped,
      hook,
      hooks: context.hooks,
    };
  }, [context.components, context.hooks, options.component, options.hook]);
}
