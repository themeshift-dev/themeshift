import { createElement, type ReactNode } from 'react';

import type { ComponentGuideSection } from '@/templates/ComponentGuide';

import { QuickStartGuide, type QuickStartGuideProps } from './index';

export type QuickStartSectionProps = {
  id?: string;
  intro: ReactNode;
  label?: string;
  title?: ReactNode;
} & QuickStartGuideProps;

export const createQuickStartSection = ({
  id = 'quick-start',
  intro,
  label,
  title = 'Quick start',
  ...props
}: QuickStartSectionProps): ComponentGuideSection => ({
  content: createElement(QuickStartGuide, props),
  id,
  intro,
  label,
  title,
});
