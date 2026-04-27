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
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const responsiveFallbackImport =
  "import { Responsive } from '@themeshift/ui/components/Responsive';";

export const ResponsiveGuide = () => {
  const { component } = useApiReference({ component: 'responsive' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? responsiveFallbackImport,
    intro:
      'Gate content by breakpoint quickly, then scale into range-based responsive layouts.',
    useDescription:
      'Start with one simple breakpoint rule, then compose range-based visibility for multi-layout UIs.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      hideColumns={['defaultValue']}
      intro={
        <GuideCallout>
          <code>Responsive</code> conditionally displays content based on
          breakpoint rules using a simple <code>when</code> prop contract.
        </GuideCallout>
      }
      items={component?.apiReference ?? []}
    />
  );

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-tablet-up"
            label="Tablet and up"
            level={2}
          />
          <Heading level={4}>Tablet and up</Heading>
          <p>
            Use <code>from</code> when content should appear at a breakpoint and
            remain visible for larger viewports.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.tabletAndUp} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-ranges"
            label="Ranges"
            level={2}
          />
          <Heading level={4}>Breakpoint ranges</Heading>
          <p>
            Combine <code>from</code>, <code>to</code>, <code>above</code>, and
            <code>below</code> to target visibility windows.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.ranges} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-polymorphic"
            label="Polymorphic"
            level={2}
          />
          <Heading level={4}>Polymorphic rendering</Heading>
          <p>
            Use <code>as</code> to preserve semantic structure while applying
            responsive visibility rules.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.asElement} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for breakpoint rule shapes and polymorphic rendering options.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common visibility patterns for mobile-only, tablet-up, and bounded range content.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Responsive visibility impacts assistive technology.',
    items: [
      {
        content: (
          <p>
            Avoid rendering duplicate interactive controls across breakpoint
            variants. When content is <code>display: none</code>, it is also
            removed from the accessibility tree.
          </p>
        ),
        tocLabel: 'Duplicate targets',
        title: 'Avoid duplicated interactive targets',
      },
      {
        content: (
          <p>
            Duplicated IDs can happen when rendering multiple breakpoint
            variants. Keep IDs unique or refactor to render a single instance
            per breakpoint.
          </p>
        ),
        tocLabel: 'Unique IDs',
        title: 'Keep IDs unique across variants',
      },
      {
        content: (
          <p>
            Keyboard and screen reader behavior can change when layout shifts.
            Validate focus order and announcements at each breakpoint.
          </p>
        ),
        tocLabel: 'Breakpoint testing',
        title: 'Test at each breakpoint',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/responsive',
            componentLabel: 'Responsive',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Responsive."
      eyebrow="Responsive"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      accessibility={accessibilitySection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
