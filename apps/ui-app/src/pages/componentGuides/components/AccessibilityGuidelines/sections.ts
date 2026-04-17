import { createElement, type ReactNode } from 'react';

import type { ComponentGuideSection } from '@/templates/ComponentGuide';

import { AccessibilityGuidelines, type AccessibilityGuideline } from './index';
import { createAccessibilitySection } from '../GuideSections';

export type CreateAccessibilityGuidelinesSectionOptions = {
  id?: string;
  intro?: ReactNode;
  items: AccessibilityGuideline[];
  label?: string;
  title?: ReactNode;
};

export const createAccessibilityGuidelinesSection = ({
  items,
  ...options
}: CreateAccessibilityGuidelinesSectionOptions):
  | ComponentGuideSection
  | undefined => {
  if (items.length === 0) {
    return undefined;
  }

  return createAccessibilitySection({
    content: createElement(AccessibilityGuidelines, { items }),
    ...options,
  });
};
