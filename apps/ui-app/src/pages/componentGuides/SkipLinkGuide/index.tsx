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

const skipLinkFallbackImport =
  "import { SkipLink } from '@themeshift/ui/components/SkipLink';";

export const SkipLinkGuide = () => {
  const { component } = useApiReference({ component: 'skiplink' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? skipLinkFallbackImport,
    intro:
      'Place a working skip link quickly, then expand to additional landmark targets as needed.',
    useDescription:
      'Start with one skip link to your main landmark, then add additional targets only when needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      hideColumns={['defaultValue']}
      intro={
        <GuideCallout>
          <code>SkipLink</code> is a focus-revealed anchor that helps keyboard
          users bypass repeated page chrome and jump to main landmarks.
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
            id="examples-label"
            label="label prop"
            level={2}
          />
          <Heading level={4}>label prop</Heading>
          <p>
            Use <code>label</code> when you want concise JSX and no explicit
            child node.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.labelProp} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-anchor-props"
            label="Native props"
            level={2}
          />
          <Heading level={4}>Native anchor props</Heading>
          <p>
            Pass standard anchor attributes like <code>id</code> and{' '}
            <code>title</code> for analytics hooks or additional context.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withCustomAttributes} />
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
            SkipLink placement follows logical inline-start positioning, so it
            should mirror correctly in RTL regions.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-multiple"
            label="Multiple links"
            level={2}
          />
          <Heading level={4}>Multiple skip links</Heading>
          <p>
            Provide multiple skip targets only when the page has repeated
            structures users frequently bypass.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.multipleTargets} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for href requirements and optional label/children behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse skip-link patterns for default labels, native anchor props, and multi-target setups.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Skip links are a keyboard-first affordance.',
    items: [
      {
        content: (
          <p>
            Point <code>href</code> at a real landmark that exists on the page
            (often <code>#main-content</code>). Ensure the destination can
            receive focus or is immediately followed by focusable content.
          </p>
        ),
        example: examples.basicUsage,
        tocLabel: 'Landmark target',
        title: 'Target a real landmark',
      },
      {
        content: (
          <p>
            Render skip links early in the DOM so they are available as soon as
            users begin tabbing. Verify focus visibility on both the skip link
            and the destination.
          </p>
        ),
        tocLabel: 'Order & focus',
        title: 'Place skip links first and test focus',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/skip-link',
            componentLabel: 'SkipLink',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with SkipLink."
      eyebrow="SkipLink"
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
