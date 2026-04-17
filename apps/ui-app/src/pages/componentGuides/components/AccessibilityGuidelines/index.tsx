import { Heading } from '@themeshift/ui/components/Heading';
import type { ReactNode } from 'react';

import { ExampleViewer, type ExampleViewerExample } from '../ExampleViewer';
import {
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
} from '../GuideExamples';

export type AccessibilityGuideline = {
  content: ReactNode;
  example?: ExampleViewerExample;
  examples?: ExampleViewerExample[];
  title: ReactNode;
};

export type AccessibilityGuidelinesProps = {
  items: AccessibilityGuideline[];
};

export const AccessibilityGuidelines = ({
  items,
}: AccessibilityGuidelinesProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <GuideExamplesGrid>
      {items.map(({ content, example, examples, title }, index) => (
        <GuideExampleCard key={index}>
          <GuideExampleText>
            <Heading level={4}>{title}</Heading>
            {content}
          </GuideExampleText>

          {(example || examples) && (
            <GuideExampleViewer>
              <ExampleViewer
                defaultCodeExpanded={true}
                example={example}
                examples={examples}
              />
            </GuideExampleViewer>
          )}
        </GuideExampleCard>
      ))}
    </GuideExamplesGrid>
  );
};
