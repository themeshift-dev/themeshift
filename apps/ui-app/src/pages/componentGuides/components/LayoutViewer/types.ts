import type { ReactNode } from 'react';

export type LayoutViewerDir = 'ltr' | 'rtl';

export type LayoutViewerViewport = 'desktop' | 'mobile' | 'tablet' | 'wide';

export type LayoutViewerMode =
  | 'contained'
  | 'page'
  | 'region'
  | 'shell'
  | 'slot';

export type LayoutViewerRegion = 'bottom' | 'center' | 'end' | 'start' | 'top';

export type LayoutViewerIsolation = 'iframe' | 'inline';

export type LayoutViewerFocusMode = 'direct' | 'enter-to-interact';

export type LayoutViewerExample = {
  code?: string;
  id: string;
  label: string;
  render: ReactNode;
};

export type LayoutViewerState = {
  dir: LayoutViewerDir;
  exampleId: string;
  mode: LayoutViewerMode;
  viewport: LayoutViewerViewport;
};

export type LayoutViewerProps = {
  activeExample?: string;
  allowDirectionToggle?: boolean;
  allowOpenInNewTab?: boolean;
  allowViewportToggle?: boolean;
  className?: string;
  defaultCodeOpen?: boolean;
  defaultDir?: LayoutViewerDir;
  defaultExample?: string;
  defaultViewport?: LayoutViewerViewport;
  description?: string;
  dir?: LayoutViewerDir;
  examples?: LayoutViewerExample[];
  focusMode?: LayoutViewerFocusMode;
  frameDescription?: string;
  frameLabel?: string;
  frameTitle?: string;
  height?: number | string;
  isolation?: LayoutViewerIsolation;
  minHeight?: number | string;
  mode?: LayoutViewerMode;
  onDirChange?: (dir: LayoutViewerDir) => void;
  onExampleChange?: (id: string) => void;
  onViewportChange?: (viewport: LayoutViewerViewport) => void;
  openInNewTabHref?: string | ((state: LayoutViewerState) => string);
  region?: LayoutViewerRegion;
  renderPlaceholder?: (
    region: Exclude<LayoutViewerRegion, 'center'>
  ) => ReactNode;
  restoreFocusOnExit?: boolean;
  showCode?: boolean;
  title?: string;
  viewport?: LayoutViewerViewport;
};

export type LayoutViewerRootProps = LayoutViewerProps & {
  children: ReactNode;
};

export type LayoutViewerExampleProps = {
  children: ReactNode;
  code?: string;
  id: string;
  label: string;
};
