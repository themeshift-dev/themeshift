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

const headingFallbackImport =
  "import { Heading } from '@themeshift/ui/components/Heading';";

export const HeadingGuide = () => {
  const { component } = useApiReference({ component: 'heading' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? headingFallbackImport,
    intro:
      'Get heading hierarchy in place quickly, then refine emphasis with muted styling.',
    useDescription:
      'Start with semantic levels, then use muted styling for secondary hierarchy when needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Heading</code> maps <code>level</code> to semantic heading
          elements and applies consistent typography tokens.
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
            id="examples-levels"
            label="Levels"
            level={2}
          />
          <Heading level={4}>Levels</Heading>
          <p>
            Use <code>level</code> to match document structure from{' '}
            <code>h1</code>
            through <code>h6</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.levels} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-muted" label="Muted" level={2} />
          <Heading level={4}>Muted</Heading>
          <p>
            Use <code>muted</code> for less prominent section headings while
            preserving semantics.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.muted} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-native-props"
            label="Native props"
            level={2}
          />
          <Heading level={4}>Native props</Heading>
          <p>
            Pass native heading attributes like <code>id</code> to support
            in-page links and table-of-contents targets.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.nativeProps} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact level values and default typography behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common heading patterns for semantic structure and visual hierarchy.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for semantic document structure.',
    items: [
      {
        content: (
          <p>
            Preserve a logical heading outline. Avoid skipping levels unless the
            content is truly nested.
          </p>
        ),
        example: examples.levels,
        tocLabel: 'Heading levels',
        title: 'Use heading levels for structure',
      },
      {
        content: (
          <p>
            Use headings to describe section purpose, not just to get a
            particular visual style. For non-structural emphasis, use text
            primitives instead.
          </p>
        ),
        title: 'Keep headings meaningful',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/heading',
            componentLabel: 'Heading',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Heading."
      eyebrow="Heading"
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
