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

const navbarFallbackImport =
  "import { Navbar } from '@themeshift/ui/components/Navbar';";

export const NavbarGuide = () => {
  const { component } = useApiReference({ component: 'navbar' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? navbarFallbackImport,
    intro:
      'Build a usable navbar quickly, then fine-tune spacing, alignment, and wrapping behavior.',
    useDescription:
      'Start with the compound API, then tune section alignment and container spacing for your navigation layout.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Navbar</code> is a compound layout primitive with
          <code>Navbar.Container</code> and <code>Navbar.Section</code> helpers
          for aligned navigation rows.
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
            id="examples-container-gap"
            label="Container and gap"
            level={2}
          />
          <Heading level={4}>Container and gap</Heading>
          <p>
            Use <code>maxWidth</code> and <code>gap</code> to tune navbar layout
            spacing without custom wrappers.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.containerControls} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-primitives"
            label="Primitives"
            level={2}
          />
          <Heading level={4}>Standalone primitives</Heading>
          <p>
            Use <code>NavbarContainer</code> and <code>NavbarSection</code>
            directly when a full navbar root is not required.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.standalonePrimitives} />
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
            Start and end sections should mirror automatically as writing
            direction changes.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-wrapping-links"
            label="Wrapping links"
            level={2}
          />
          <Heading level={4}>Wrapping links</Heading>
          <p>
            Enable <code>wrap</code> on sections when nav items should flow onto
            multiple lines in constrained spaces.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.wrappedSection} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for root, container, and section prop details in one place.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common navbar layouts for product headers, utility links, and wrapping nav rows.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for landmarks, focus order, and sticky navigation.',
    items: [
      {
        content: (
          <p>
            Label navigation landmarks with <code>aria-label</code> or{' '}
            <code>aria-labelledby</code>, especially when multiple nav regions
            exist on a page.
          </p>
        ),
        example: examples.basicUsage,
        tocLabel: 'Nav landmark',
        title: 'Label the navigation landmark',
      },
      {
        content: (
          <p>
            Keep DOM order aligned with visual order so keyboard focus moves
            predictably. If the navbar is sticky, ensure skip links and in-page
            anchors land on visible content.
          </p>
        ),
        tocLabel: 'Focus order',
        title: 'Maintain predictable focus order',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/navbar',
            componentLabel: 'Navbar',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Navbar."
      eyebrow="Navbar"
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
