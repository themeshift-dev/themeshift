import type { ReactNode } from 'react';

import type { ComponentGuideSection } from '@/templates/ComponentGuide';

type CreateGuideSectionOptions = {
  content: ReactNode;
  id: string;
  intro?: ReactNode;
  label?: string;
  title: ReactNode;
};

const createGuideSection = ({
  content,
  id,
  intro,
  label,
  title,
}: CreateGuideSectionOptions): ComponentGuideSection => ({
  content,
  id,
  intro,
  label,
  title,
});

export type CreatePropsSectionOptions = Omit<
  CreateGuideSectionOptions,
  'id' | 'title'
> & {
  id?: string;
  title?: ReactNode;
};

export const createPropsSection = ({
  content,
  id = 'props',
  intro,
  label,
  title = 'Props',
}: CreatePropsSectionOptions): ComponentGuideSection =>
  createGuideSection({ content, id, intro, label, title });

export type CreateTypesSectionOptions = Omit<
  CreateGuideSectionOptions,
  'id' | 'title'
> & {
  id?: string;
  title?: ReactNode;
};

export const createTypesSection = ({
  content,
  id = 'types',
  intro,
  label,
  title = 'Types',
}: CreateTypesSectionOptions): ComponentGuideSection =>
  createGuideSection({ content, id, intro, label, title });

export type CreateExamplesSectionOptions = Omit<
  CreateGuideSectionOptions,
  'id' | 'title'
> & {
  id?: string;
  title?: ReactNode;
};

export const createExamplesSection = ({
  content,
  id = 'examples',
  intro,
  label,
  title = 'Examples',
}: CreateExamplesSectionOptions): ComponentGuideSection =>
  createGuideSection({ content, id, intro, label, title });

export type CreateAccessibilitySectionOptions = Omit<
  CreateGuideSectionOptions,
  'id' | 'title'
> & {
  id?: string;
  title?: ReactNode;
};

export const createAccessibilitySection = ({
  content,
  id = 'accessibility',
  intro,
  label,
  title = 'Accessibility',
}: CreateAccessibilitySectionOptions): ComponentGuideSection =>
  createGuideSection({ content, id, intro, label, title });
