import { Heading } from '@themeshift/ui/components/Heading';

import { useApiReference } from '@/apiReference';
import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import {
  ExampleViewer,
  GuideCallout,
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideIntro,
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const tabsFallbackImport =
  "import { Tabs } from '@themeshift/ui/components/Tabs';";

export const TabsGuide = () => {
  const { component } = useApiReference({ component: 'tabs' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? tabsFallbackImport,
    intro:
      'Use Tabs for sectioned content with accessible trigger/panel wiring, keyboard navigation, and optional active indicator polish.',
    useDescription:
      'Start with a list of triggers and matching panels, then layer in activation mode and mount behavior based on content cost.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Tabs</code> is a compound component. Use <code>Tabs.List</code>,
          <code> Tabs.Trigger</code>, and <code>Tabs.Panel</code> for baseline
          composition, then add <code>Tabs.Panels</code> and{' '}
          <code>Tabs.Indicator</code> when needed.
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
            id="examples-uncontrolled"
            label="Uncontrolled"
            level={2}
          />
          <Heading level={4}>Uncontrolled tabs</Heading>
          <p>
            Use <code>defaultValue</code> to set a startup tab and let tabs
            manage selection internally.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.uncontrolled} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-controlled"
            label="Controlled"
            level={2}
          />
          <Heading level={4}>Controlled tabs</Heading>
          <p>
            Drive selected tab externally with <code>value</code> and
            <code> onValueChange</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.controlled} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-indicator"
            label="Indicator"
            level={2}
          />
          <Heading level={4}>Indicator</Heading>
          <p>
            Use <code>Tabs.Indicator</code> inside <code>Tabs.List</code> for a
            shared active highlight. Tune line thickness with
            <code>size</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withIndicator} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-fitted"
            label="Fitted"
            level={2}
          />
          <Heading level={4}>Fitted triggers</Heading>
          <p>
            Set <code>fitted</code> to make triggers share equal inline width
            within the list container.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.fitted} />
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
            Tabs inherit reading direction. Verify keyboard flow and indicator
            movement in both LTR and RTL containers.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-vertical"
            label="Vertical"
            level={2}
          />
          <Heading level={4}>Vertical orientation</Heading>
          <p>
            Set <code>orientation="vertical"</code> for column-style section
            navigation.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.vertical} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-vertical-indicator"
            label="Vertical + indicator"
            level={2}
          />
          <Heading level={4}>Vertical with indicator</Heading>
          <p>
            Combine <code>orientation="vertical"</code> with
            <code> Tabs.Indicator</code> for side-navigation patterns.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.verticalWithIndicatorExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-panels"
            label="Tabs.Panels"
            level={2}
          />
          <Heading level={4}>Panels wrapper</Heading>
          <p>
            Group panel content with <code>Tabs.Panels</code> when you need a
            dedicated container.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.panelsContainer} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-manual"
            label="Manual activation"
            level={2}
          />
          <Heading level={4}>Manual activation</Heading>
          <p>
            In manual mode, arrow keys move focus and Enter/Space commits
            selection.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.manualActivation} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-lazy"
            label="Lazy mount"
            level={2}
          />
          <Heading level={4}>Lazy mount and unmount</Heading>
          <p>
            Use <code>lazyMount</code>, <code>unmountOnExit</code>, and{' '}
            <code>forceMount</code> to tune panel lifecycle behavior.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.lazyPanels} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-unmount-forms"
            label="Unmount behavior + forms"
            level={2}
          />
          <Heading level={4}>Unmount behavior with forms</Heading>
          <p>
            Compare three panel strategies: unmounted input reset,{' '}
            <code>forceMount</code> preservation, and parent-controlled
            persistence.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.unmountBehaviorForms} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop signatures, defaults, and compound part behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Start with baseline trigger/panel composition, then add indicator and panel lifecycle controls for richer UX.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Tabs should keep focus flow predictable and clearly separate focused vs selected state.',
    items: [
      {
        content: (
          <p>
            Provide an accessible name for the list with visible heading
            association or <code>aria-label</code>. This helps screen readers
            announce context for the tab set.
          </p>
        ),
        example: examples.basicUsage,
        title: 'Label the tablist clearly',
      },
      {
        content: (
          <p>
            Choose activation mode intentionally. Use{' '}
            <code>activationMode="automatic"</code> for lightweight panels and
            <code> "manual"</code> for expensive content to avoid accidental
            heavy re-renders while arrowing.
          </p>
        ),
        example: examples.manualActivation,
        title: 'Match activation mode to content cost',
      },
      {
        content: (
          <p>
            Keep decorative indicator visuals separate from semantics. Active
            tab semantics come from <code>aria-selected</code> and panel wiring,
            not from indicator animation.
          </p>
        ),
        example: examples.withIndicator,
        title: 'Treat indicator as decoration only',
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
            componentHref: '/ui/component/tabs',
            componentLabel: 'Tabs',
          })}
        />
      }
      description="Implementation guidance, API details, and examples for accessible compound Tabs composition."
      eyebrow="Tabs"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
