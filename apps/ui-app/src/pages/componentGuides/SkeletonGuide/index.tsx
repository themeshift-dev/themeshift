import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useApiReference } from '@/apiReference';
import {
  ExampleViewer,
  GuideExampleCard,
  GuideExampleText,
  GuideIntro,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideCallout,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import { AccessibilityGuidelinesSection } from './AccessibilityGuidelinesSection';
import * as examples from './examples';

const skeletonFallbackImport =
  "import { Skeleton } from '@themeshift/ui/components/Skeleton';";

export const SkeletonGuide = () => {
  const { component } = useApiReference({ component: 'skeleton' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? skeletonFallbackImport,
    intro:
      'Add Skeleton, import it, then build placeholders that match your final layout.',
    useDescription:
      'Start with placeholders that match the final layout so content can load without shifting.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsSection = createPropsSection({
    content: (
      <ApiReference
        intro={
          <GuideCallout>
            <code>Skeleton</code> renders a decorative placeholder block. Use it
            directly for custom shapes, then reach for{' '}
            <code>Skeleton.Text</code> and <code>Skeleton.Avatar</code> for
            common patterns.
          </GuideCallout>
        }
        items={component?.apiReference ?? []}
      />
    ),
    intro:
      'Use the API reference when you need exact prop names, supported values, and default behavior across the base Skeleton and its subcomponents.',
  });

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-text" label="Text" level={2} />
          <Heading level={4}>Text blocks</Heading>
          <p>
            Use <code>Skeleton.Text</code> to match paragraph rhythm. Tune{' '}
            <code>lines</code>, <code>lineHeight</code>, and{' '}
            <code>lastLineWidth</code> to mimic the final content.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.text} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-cards" label="Cards" level={2} />
          <Heading level={4}>Card layouts</Heading>
          <p>
            Combine base blocks with <code>Skeleton.Text</code> to keep cards
            stable while images and content stream in.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.cardShimmer} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-lists" label="Lists" level={2} />
          <Heading level={4}>List rows</Heading>
          <p>
            Reserve space for repeating content. Use consistent widths so rows
            align once content replaces placeholders.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.listRows} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-direction"
            label="Direction (LTR/RTL)"
            level={2}
          />
          <Heading level={4}>Direction (LTR/RTL)</Heading>
          <p>
            Shimmer direction adapts to writing direction. Set <code>dir</code>{' '}
            on parent regions to support both LTR and RTL interfaces.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse Skeleton patterns for text, cards, lists, and direction-aware shimmer.',
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/skeleton',
            componentLabel: 'Skeleton',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Skeleton."
      eyebrow="Skeleton"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    >
      <AccessibilityGuidelinesSection />
    </ComponentGuide>
  );
};
