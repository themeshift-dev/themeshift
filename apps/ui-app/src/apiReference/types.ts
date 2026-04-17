import type { ComponentMeta, DocsCategory } from '@themeshift/docs-types';

export type ApiReferenceType = 'component' | 'hook';

export type ApiReferenceDefaultValue =
  | string
  | number
  | boolean
  | 'object'
  | null;

export type ApiReferenceItem = {
  comments: string;
  defaultValue: ApiReferenceDefaultValue;
  displayName: string;
  propName: string;
  type: string;
  values: Array<string | number | boolean>;
};

export type ApiReferenceMeta = ComponentMeta & {
  type: ApiReferenceType;
};

export type ApiReferenceComponent = {
  apiReference: ApiReferenceItem[];
  exportName: string;
  importPath: string;
  importString: string;
  meta: ApiReferenceMeta | null;
  name: string;
  routeSlug: string;
  slug: string;
  sourceCodeUrl: string;
  type: 'component';
};

export type ApiReferenceHook = {
  apiReference: ApiReferenceItem[];
  exportName: string;
  importPath: string;
  importString: string;
  meta: ApiReferenceMeta | null;
  name: string;
  returnReference: ApiReferenceItem[];
  routeSlug: string;
  slug: string;
  sourceCodeUrl: string;
  type: 'hook';
};

export type ApiReferenceEntry = ApiReferenceComponent | ApiReferenceHook;

export type GroupedApiReference = {
  key: DocsCategory | 'uncategorized';
  label: string;
  components: ApiReferenceEntry[];
};

export type ApiReferenceContextValue = {
  components: ApiReferenceComponent[];
  hooks: ApiReferenceHook[];
};
