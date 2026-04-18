import type { ComponentType } from 'react';

import {
  ComponentsAuthPreview,
  ComponentsLoadingPreview,
  ComponentsPaymentPreview,
  ComponentsSurveyPreview,
  ComponentsTeamPreview,
  ComponentsTogglePreview,
} from './componentPreviewSamples';

type ComponentPreview = {
  label: string;
  Preview: ComponentType;
};

export const COMPONENT_PREVIEWS: ComponentPreview[] = [
  { label: 'Payment form example', Preview: ComponentsPaymentPreview },
  { label: 'Team collaboration example', Preview: ComponentsTeamPreview },
  {
    label: 'Authentication settings example',
    Preview: ComponentsAuthPreview,
  },
  { label: 'Survey input example', Preview: ComponentsSurveyPreview },
  {
    label: 'Preferences toggles example',
    Preview: ComponentsTogglePreview,
  },
  { label: 'Loading states example', Preview: ComponentsLoadingPreview },
];
