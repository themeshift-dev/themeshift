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

const linkFallbackImport =
  "import { Link } from '@themeshift/ui/components/Link';";

export const LinkGuide = () => {
  const { component } = useApiReference({ component: 'link' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? linkFallbackImport,
    intro:
      'Render navigation links quickly, then expand into router composition and external-link patterns.',
    useDescription:
      'Start with a plain anchor, then use asChild when another link primitive should receive ThemeShift styles.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      hideColumns={['defaultValue']}
      intro={
        <GuideCallout>
          <code>Link</code> styles native anchors and can decorate compatible
          child link components via <code>asChild</code>.
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
            id="examples-external"
            label="External links"
            level={2}
          />
          <Heading level={4}>External links</Heading>
          <p>
            Pair <code>target="_blank"</code> with safe <code>rel</code>
            values for cross-origin destinations.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.external} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-as-child"
            label="asChild"
            level={2}
          />
          <Heading level={4}>asChild</Heading>
          <p>
            Use <code>asChild</code> to apply link styling to router-aware link
            components without changing navigation behavior.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.asChild} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-groups"
            label="Grouped links"
            level={2}
          />
          <Heading level={4}>Grouped links</Heading>
          <p>
            Use consistent styling when listing related navigation actions in a
            toolbar, card, or footer block.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.groupedLinks} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact Link props and asChild composition behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common link patterns for internal routes, external destinations, and grouped nav actions.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for accessible navigation and link behavior.',
    items: [
      {
        content: (
          <p>
            Use descriptive link text that makes sense out of context (avoid
            repeated “Click here”). The link’s accessible name should describe
            the destination or action.
          </p>
        ),
        title: 'Write meaningful link text',
      },
      {
        content: (
          <p>
            For links that open a new tab, consider adding visible or
            screen-reader-only text that indicates the new context. Pair{' '}
            <code>target="_blank"</code> with safe <code>rel</code> values.
          </p>
        ),
        example: examples.external,
        title: 'Handle external links intentionally',
      },
      {
        content: (
          <p>
            When composing with router links, keep semantics intact by rendering
            a real link element via <code>asChild</code>.
          </p>
        ),
        example: examples.asChild,
        title: 'Preserve link semantics with asChild',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/link',
            componentLabel: 'Link',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Link."
      eyebrow="Link"
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
