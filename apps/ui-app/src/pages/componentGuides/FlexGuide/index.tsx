import { Heading } from '@themeshift/ui/components/Heading';

import { useApiReference } from '@/apiReference';
import {
  ApiReference,
  Breadcrumb,
  TableOfContents,
  TypesReference,
} from '@/app/components';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
  createTypesSection,
  ExampleViewer,
  GuideCallout,
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideIntro,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const flexFallbackImport =
  "import { Flex } from '@themeshift/ui/components/Flex';";

export const FlexGuide = () => {
  const { component } = useApiReference({ component: 'flex' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? flexFallbackImport,
    intro:
      'Use Flex for the most common row and column layouts without re-writing display, alignment, and gap CSS.',
    useDescription:
      'Start with direction, gap, and alignment aliases, then add responsive object values for breakpoint shifts.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsSection = createPropsSection({
    content: (
      <ApiReference
        hideColumns={['values']}
        intro={
          <GuideCallout>
            <code>Flex</code> builds on <code>Box</code>. It defaults to{' '}
            <code>display: flex</code> and adds ergonomic alias props like{' '}
            <code>justify="between"</code>.
          </GuideCallout>
        }
        items={component?.apiReference ?? []}
      />
    ),
    intro:
      'Use aliases for common alignment patterns and spacing token keys for gaps. Raw CSS values remain supported.',
  });

  const typesSection = createTypesSection({
    content: (
      <TypesReference
        intro={
          <GuideCallout>
            Flex aliases reuse Box primitives. Check each alias type for allowed
            tokens and keyword shortcuts.
          </GuideCallout>
        }
        items={component?.typesReference ?? []}
      />
    ),
    intro:
      'Type aliases document valid responsive values for flex alignment, direction, and spacing.',
  });

  const examplesSection = createExamplesSection({
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-responsive-direction"
              label="Responsive direction"
              level={2}
            />
            <Heading level={4}>Responsive direction</Heading>
            <p>
              Flip between stacked and inline layouts using responsive object
              values on <code>direction</code>.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.responsiveDirection} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-inline"
              label="Inline flex"
              level={2}
            />
            <Heading level={4}>Inline flex</Heading>
            <p>
              Use <code>inline</code> when the layout should flow with text or
              surrounding inline elements.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.inlineLayout} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-wrap"
              label="Wrapping"
              level={2}
            />
            <Heading level={4}>Wrapping actions</Heading>
            <p>
              Combine <code>wrap</code> with <code>rowGap</code> and{' '}
              <code>gap</code> when items should flow onto multiple rows.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.wrappingRows} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'These examples cover the most common toolbar, form-row, and wrapping action layouts.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Flex influences visual layout only; ensure keyboard and reading order still match expectations.',
    items: [
      {
        content: (
          <p>
            Avoid relying on CSS reordering for logical content order. Screen
            readers and keyboard navigation follow DOM order, not visual
            placement.
          </p>
        ),
        example: examples.keepDomOrderMeaningful,
        title: 'Keep DOM order meaningful',
      },
      {
        content: (
          <p>
            Use semantic container tags with <code>as</code> for grouped actions
            and navigation patterns, and provide labels for landmark regions
            where needed.
          </p>
        ),
        example: examples.semanticWrappers,
        title: 'Use semantic wrappers',
      },
      {
        content: (
          <p>
            When wrapping controls, test focus traversal across breakpoints to
            ensure visual grouping matches tab order.
          </p>
        ),
        example: examples.testFocusAtEachBreakpoint,
        title: 'Test focus at each breakpoint',
      },
    ],
  });

  return (
    <ComponentGuide
      accessibility={accessibilitySection}
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/component/flex',
            componentLabel: 'Flex',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Flex."
      eyebrow="Flex"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      typesSection={typesSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
