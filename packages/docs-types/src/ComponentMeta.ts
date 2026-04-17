export type DocsCategory =
  | 'inputs-forms'
  | 'actions'
  | 'feedback-status'
  | 'data-display'
  | 'navigation-structure'
  | 'overlays'
  | 'layout-utilities'
  | 'templates-shells';

export type ComponentMeta = {
  category: DocsCategory;
  description: string;
  tags?: string[];
  order?: number;
  status?: 'stable' | 'beta' | 'experimental' | 'deprecated';
  featured?: boolean;
  aliases?: string[];
  related?: string[];
};
