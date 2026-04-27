import type { ComponentType } from 'react';

import {
  AccessibilityDocsPage,
  BidirectionalSupportDocsPage,
  CliDocsPage,
  CoreDocsPage,
  IntroDocsPage,
  UiDocsPage,
  VitePluginDocsPage,
} from './pages';

export type DocsPageId =
  | 'intro'
  | 'cli'
  | 'core'
  | 'ui'
  | 'vite-plugin'
  | 'accessibility'
  | 'bidirectional-support';

export type DocsPageDefinition = {
  Component: ComponentType;
  description: string;
  id: DocsPageId;
  label: string;
  path: string;
  route: string;
};

export const docsPages: DocsPageDefinition[] = [
  {
    Component: IntroDocsPage,
    description: 'ThemeShift ecosystem overview and first-step guidance.',
    id: 'intro',
    label: 'Intro',
    path: '/docs',
    route: '',
  },
  {
    Component: CliDocsPage,
    description: 'Command-line build, watch, and audit workflows.',
    id: 'cli',
    label: 'CLI',
    path: '/docs/cli',
    route: 'cli',
  },
  {
    Component: CoreDocsPage,
    description: 'Framework-agnostic engine APIs and integration use cases.',
    id: 'core',
    label: 'Core',
    path: '/docs/core',
    route: 'core',
  },
  {
    Component: UiDocsPage,
    description: 'React package setup, imports, and token override flow.',
    id: 'ui',
    label: 'UI',
    path: '/docs/ui',
    route: 'ui',
  },
  {
    Component: VitePluginDocsPage,
    description: 'Vite integration, options reference, and common patterns.',
    id: 'vite-plugin',
    label: 'Vite Plugin',
    path: '/docs/vite-plugin',
    route: 'vite-plugin',
  },
  {
    Component: AccessibilityDocsPage,
    description: 'How ThemeShift validates and documents accessibility.',
    id: 'accessibility',
    label: 'Accessibility',
    path: '/docs/accessibility',
    route: 'accessibility',
  },
  {
    Component: BidirectionalSupportDocsPage,
    description: 'LTR/RTL behavior, testing, and usage guidance.',
    id: 'bidirectional-support',
    label: 'Bidirectional Support',
    path: '/docs/bidirectional-support',
    route: 'bidirectional-support',
  },
];
