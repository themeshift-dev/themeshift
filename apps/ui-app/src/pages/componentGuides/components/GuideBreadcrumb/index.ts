import type { BreadcrumbItem } from '@/app/components';

export type CreateComponentBreadcrumbItemsOptions = {
  componentHref: string;
  componentLabel: string;
  currentLabel?: string;
};

export const createComponentBreadcrumbItems = ({
  componentHref,
  componentLabel,
  currentLabel = 'Docs',
}: CreateComponentBreadcrumbItemsOptions): BreadcrumbItem[] => [
  { href: '/ui', label: 'UI' },
  { href: componentHref, label: componentLabel },
  { current: true, label: currentLabel },
];

export type CreateHookBreadcrumbItemsOptions = {
  hookHref: string;
  hookLabel: string;
  currentLabel?: string;
};

export const createHookBreadcrumbItems = ({
  hookHref,
  hookLabel,
  currentLabel = 'Docs',
}: CreateHookBreadcrumbItemsOptions): BreadcrumbItem[] => [
  { href: '/ui', label: 'UI' },
  { href: hookHref, label: hookLabel },
  { current: true, label: currentLabel },
];
