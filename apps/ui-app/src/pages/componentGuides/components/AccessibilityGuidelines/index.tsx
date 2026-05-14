import { Heading } from '@themeshift/ui/components/Heading';
import type { ReactNode } from 'react';

import { TableOfContents } from '@/app/components';

import { ExampleViewer, type ExampleViewerExample } from '../ExampleViewer';
import { LayoutViewer, type LayoutViewerExample } from '../LayoutViewer';
import {
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
} from '../GuideExamples';

export type AccessibilityGuidelineViewer = 'example' | 'layout';

export type AccessibilityGuideline = {
  content: ReactNode;
  example?: ExampleViewerExample | LayoutViewerExample;
  examples?: Array<ExampleViewerExample | LayoutViewerExample>;
  viewer?: AccessibilityGuidelineViewer;
  tocLabel?: string;
  title: ReactNode;
};

export type AccessibilityGuidelinesProps = {
  items: AccessibilityGuideline[];
  viewer?: AccessibilityGuidelineViewer;
};

const getAccessibilityMarkerLabel = ({
  index,
  title,
  tocLabel,
}: {
  index: number;
  title: ReactNode;
  tocLabel?: string;
}) => {
  if (typeof tocLabel === 'string' && tocLabel.trim()) {
    return tocLabel;
  }

  if (typeof title === 'string') {
    return title;
  }

  return `Accessibility item ${index + 1}`;
};

const toMarkerSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function isLayoutViewerExample(
  example: ExampleViewerExample | LayoutViewerExample
): example is LayoutViewerExample {
  return 'id' in example && 'render' in example;
}

function toLayoutViewerExample({
  example,
  index,
}: {
  example: ExampleViewerExample | LayoutViewerExample;
  index: number;
}): LayoutViewerExample {
  if (isLayoutViewerExample(example)) {
    return example;
  }

  const { args, label, sample } = example;
  const id = `${toMarkerSlug(label)}-${index + 1}`;
  const render =
    typeof sample === 'function'
      ? (() => {
          const Sample = sample;

          return <Sample {...(args ?? {})} />;
        })()
      : sample;

  return {
    code: example.code,
    id,
    label,
    render,
  };
}

function toExampleViewerExample(
  example: ExampleViewerExample | LayoutViewerExample
): ExampleViewerExample {
  if (!isLayoutViewerExample(example)) {
    return example;
  }

  return {
    code: example.code,
    label: example.label,
    sample: example.render,
  };
}

export const AccessibilityGuidelines = ({
  items,
  viewer = 'example',
}: AccessibilityGuidelinesProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <GuideExamplesGrid>
      {items.map(
        (
          { content, example, examples, title, tocLabel, viewer: itemViewer },
          index
        ) => {
          const resolvedViewer = itemViewer ?? viewer;
          const resolvedExamples =
            examples ?? (example ? [example] : undefined);
          const markerLabel = getAccessibilityMarkerLabel({
            index,
            title,
            tocLabel,
          });

          return (
            <GuideExampleCard key={index}>
              <GuideExampleText>
                <TableOfContents.Marker
                  id={`accessibility-${index + 1}-${toMarkerSlug(markerLabel)}`}
                  label={markerLabel}
                  level={2}
                />
                <Heading level={4}>{title}</Heading>
                {content}
              </GuideExampleText>

              {resolvedExamples && (
                <GuideExampleViewer>
                  {resolvedViewer === 'layout' ? (
                    <LayoutViewer
                      defaultCodeOpen
                      examples={resolvedExamples.map(
                        (viewerExample, viewerIndex) =>
                          toLayoutViewerExample({
                            example: viewerExample,
                            index: viewerIndex,
                          })
                      )}
                      mode="contained"
                    />
                  ) : (
                    <ExampleViewer
                      defaultCodeExpanded={true}
                      examples={resolvedExamples.map(toExampleViewerExample)}
                    />
                  )}
                </GuideExampleViewer>
              )}
            </GuideExampleCard>
          );
        }
      )}
    </GuideExamplesGrid>
  );
};
