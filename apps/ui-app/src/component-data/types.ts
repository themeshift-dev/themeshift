import { type ComponentMeta } from '../../../../packages/ui/src/types';

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

export type ComponentData = {
  apiReference: ApiReferenceItem[];
  name: string;
  exportName: string;
  importPath: string;
  importString: string;
  slug: string;
  routeSlug: string;
  sourceCodeUrl: string;
  meta: ComponentMeta | null;
};

export type ComponentDataContextValue = {
  components: ComponentData[];
};
