import { Heading } from '@themeshift/ui/components/Heading';
import type { ComponentType, ReactNode } from 'react';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useApiReference } from '@/apiReference';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
  GuideExampleCard,
  GuideExampleText,
  GuideExamplesGrid,
  GuideExampleViewer,
  GuideIntro,
  LayoutViewer,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples/index';

const sidebarFallbackImport =
  "import { Sidebar } from '@themeshift/ui/components/Sidebar';";

const renderLegacyExampleSample = (
  sample: ReactNode | ComponentType<Record<string, never>>
) => {
  if (typeof sample === 'function') {
    const ExampleSample = sample;

    return <ExampleSample />;
  }

  return sample;
};

export const SidebarGuide = () => {
  const { component } = useApiReference({ component: 'sidebar' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <LayoutViewer
          allowOpenInNewTab={false}
          examples={examples.layoutShellExamples}
          focusMode="enter-to-interact"
          frameDescription="Sidebar shell example with persistent navigation and content area."
          frameTitle="Sidebar shell preview"
          mode="shell"
          showCode
        />
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
      <LayoutViewer
        defaultCodeOpen
        examples={[examples.layoutShellExamples[0]]}
        focusMode="enter-to-interact"
        frameDescription="Expanded sidebar with inset main content."
        mode="shell"
      />
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
              id="examples-pattern-collapsible-groups"
              label="Collapsible groups"
              level={2}
            />
            <Heading level={4}>Collapsible menu groups</Heading>
            <p>
              Use inline collapsible items for nested navigation trees inside a
              single sidebar group.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.commonPatternExamples[0]]}
              frameDescription="Sidebar pattern: collapsible menu groups."
              mode="shell"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-pattern-status-badges"
              label="Status badges"
              level={2}
            />
            <Heading level={4}>Status badges</Heading>
            <p>
              Show operational counts directly in navigation rows so users can
              triage quickly.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.commonPatternExamples[1]]}
              frameDescription="Sidebar pattern: status badges in menu rows."
              mode="shell"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-pattern-collapsed-rail"
              label="Collapsed rail"
              level={2}
            />
            <Heading level={4}>Collapsed + rail</Heading>
            <p>
              Start in icon-first mode and let users expand navigation with the
              sidebar rail.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.commonPatternExamples[2]]}
              frameDescription="Sidebar pattern: collapsed icon nav with rail."
              mode="shell"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-realistic-product-workspace"
              label="Product workspace"
              level={2}
            />
            <Heading level={4}>Product workspace</Heading>
            <p>
              Dashboard-style app shell with persistent analytics navigation and
              nested model sections.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.realisticSidebarExamples[0]]}
              frameDescription="Realistic product workspace sidebar."
              mode="shell"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-realistic-mobile-docs"
              label="Mobile docs nav"
              level={2}
            />
            <Heading level={4}>Mobile docs nav</Heading>
            <p>
              Offcanvas docs navigation optimized for mobile reading surfaces.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.realisticSidebarExamples[1]]}
              frameDescription="Realistic mobile documentation navigation."
              mode="shell"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-realistic-rtl-portal"
              label="RTL portal"
              level={2}
            />
            <Heading level={4}>RTL customer portal</Heading>
            <p>
              Account portal navigation anchored to logical end for RTL locales.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.realisticSidebarExamples[2]]}
              frameDescription="Realistic RTL customer portal navigation."
              mode="shell"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

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
            <LayoutViewer
              defaultCodeOpen
              examples={[
                {
                  code: examples.offcanvasWithLocationKey.code,
                  id: 'offcanvas-route-close',
                  label: 'Offcanvas route close',
                  render: renderLegacyExampleSample(
                    examples.offcanvasWithLocationKey.sample
                  ),
                },
              ]}
              frameDescription="Offcanvas sidebar that closes on route changes."
              mode="shell"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-persistent-sidebar-region"
              label="Persistent sidebar region"
              level={2}
            />
            <Heading level={4}>Persistent sidebar region</Heading>
            <p>
              Render the Sidebar directly in the start region while the rest of
              the preview uses lightweight placeholder content.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.layoutRegionExample]}
              frameDescription="Region-focused sidebar preview."
              mode="region"
              region="start"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-trigger-tooltip"
              label="Trigger with tooltip"
              level={2}
            />
            <Heading level={4}>Trigger with tooltip</Heading>
            <p>
              Compose <code>Sidebar.Trigger</code> with <code>Tooltip</code> by
              rendering Trigger <code>as</code> your button component so the
              tooltip and trigger share one interactive element.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.triggerWithTooltip]}
              frameDescription="Sidebar trigger wrapped with tooltip content."
              mode="shell"
            />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'Examples are split into single-viewer patterns and realistic scenarios, plus route-driven offcanvas behavior and persistent navigation layouts.',
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
