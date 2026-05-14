import { createElement, type ReactNode } from 'react';

import type { ComponentGuideSection } from '@/templates/ComponentGuide';

import {
  AccessibilityGuidelines,
  type AccessibilityGuideline,
  type AccessibilityGuidelineViewer,
} from './index';
import { createAccessibilitySection } from '../GuideSections';

export type CreateAccessibilityGuidelinesSectionOptions = {
  id?: string;
  intro?: ReactNode;
  items: AccessibilityGuideline[];
  label?: string;
  title?: ReactNode;
  viewer?: AccessibilityGuidelineViewer;
};

export const createAccessibilityGuidelinesSection = ({
  items,
  viewer,
  ...options
}: CreateAccessibilityGuidelinesSectionOptions):
  | ComponentGuideSection
  | undefined => {
  if (items.length === 0) {
    return undefined;
  }

  return createAccessibilitySection({
    content: createElement(AccessibilityGuidelines, { items, viewer }),
    ...options,
  });
};
