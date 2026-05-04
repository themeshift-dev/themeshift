import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useApiReference } from '@/apiReference';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
  ExampleViewer,
  GuideExampleCard,
  GuideExampleText,
  GuideExamplesGrid,
  GuideExampleViewer,
  GuideIntro,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples/index';

const sidebarFallbackImport =
  "import { Sidebar } from '@themeshift/ui/components/Sidebar';";

export const SidebarGuide = () => {
  const { component } = useApiReference({ component: 'sidebar' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? sidebarFallbackImport,
    intro:
      'Start with structural primitives, then layer collapse/offcanvas behavior from Sidebar.Provider.',
    useDescription:
      'Use Sidebar.MenuItem for structure and Sidebar.MenuButton for the interactive element.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.quickStart} />
    ),
  });

  const propsSection = createPropsSection({
    content: <ApiReference items={component?.apiReference ?? []} />,
    intro:
      'Use Provider state for collapsed/open behavior and Root props for mode, side, and sizing.',
  });

  const examplesSection = createExamplesSection({
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-offcanvas-route"
              label="Offcanvas route close"
              level={2}
            />
            <Heading level={4}>Offcanvas + locationKey</Heading>
            <p>
              Wire <code>locationKey</code> to router state when using
              <code>closeOnRouteChange</code>.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.offcanvasWithLocationKey} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-rtl"
              label="RTL side-aware"
              level={2}
            />
            <Heading level={4}>RTL side-aware behavior</Heading>
            <p>
              Use <code>side="start"</code>/<code>side="end"</code> with logical
              CSS behavior.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.rtlSideAware} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'Examples focused on route-driven close behavior and direction-aware layouts.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Checklist for landmarks, icon-only labels, keyboard flow, and offcanvas behavior.',
    items: [
      {
        content: (
          <p>
            Use <code>ariaLabel</code> or <code>labelledBy</code> to name the
            sidebar landmark.
          </p>
        ),
        example: examples.quickStart,
        tocLabel: 'Landmark labeling',
        title: 'Name the sidebar landmark',
      },
      {
        content: (
          <p>
            For collapsed icon-only items, provide <code>iconOnlyLabel</code> or
            equivalent accessible labeling.
          </p>
        ),
        example: examples.quickStart,
        tocLabel: 'Icon-only accessibility',
        title: 'Label icon-only buttons',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/component/sidebar',
            componentLabel: 'Sidebar',
          })}
        />
      }
      description="Compose accessible side navigation with shared state for desktop collapse and offcanvas mobile behavior."
      eyebrow="Sidebar"
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      examples={examplesSection}
      accessibility={accessibilitySection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
