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
  component: string;
  importString: string;
  slug: string;
  sourceCodeUrl: string;
};

export type ComponentDataContextValue = {
  components: ComponentData[];
};
