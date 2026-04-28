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

const tooltipFallbackImport =
  "import { Tooltip } from '@themeshift/ui/components/Tooltip';";

export const TooltipGuide = () => {
  const { component } = useApiReference({ component: 'tooltip' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? tooltipFallbackImport,
    intro:
      'Use Tooltip for compact contextual hints on hover and focus, with optional compound composition for advanced control.',
    useDescription:
      'Start with convenience `content`, then switch to primitives for custom arrow and content composition.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Tooltip</code> supports convenience usage with{' '}
          <code>content</code> and full compound primitives with{' '}
          <code>Tooltip.Root</code>, <code>Tooltip.Trigger</code>,{' '}
          <code>Tooltip.Content</code>, and <code>Tooltip.Arrow</code>.
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
            id="examples-primitives"
            label="Primitives"
            level={2}
          />
          <Heading level={4}>Primitive composition</Heading>
          <p>
            Use explicit parts for fine-grained composition and custom content
            structure.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.primitives} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-provider"
            label="Provider timing"
            level={2}
          />
          <Heading level={4}>Provider timing</Heading>
          <p>
            Use <code>Tooltip.Provider</code> to make nearby tooltip
            interactions feel faster after the first delayed open.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.providerTiming} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-controlled"
            label="Controlled"
            level={2}
          />
          <Heading level={4}>Controlled</Heading>
          <p>
            Control visibility with <code>open</code> and{' '}
            <code>onOpenChange</code> for explicit state orchestration.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.controlled} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-placement"
            label="Placement"
            level={2}
          />
          <Heading level={4}>Placement options</Heading>
          <p>
            Pick from logical placement options and let collision handling
            adjust when space is constrained.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.placementExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-portal-local"
            label="portal=false"
            level={2}
          />
          <Heading level={4}>Local rendering</Heading>
          <p>
            Use <code>portal={'{false}'}</code> for tests and isolated
            containers where in-place rendering is preferred.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.localPortal} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact defaults, controlled state options, and compound part signatures.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Explore convenience usage, primitives, group timing, and placement behavior across common scenarios.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Tooltips should remain dismissible, hoverable, and persistent while hover or focus conditions remain active.',
    items: [
      {
        content: (
          <p>
            Ensure trigger controls keep accessible names. Tooltip content is
            supplemental, so it should not replace a control label.
          </p>
        ),
        example: examples.basicUsage,
        title: 'Keep trigger labels explicit',
      },
      {
        content: (
          <p>
            Verify keyboard behavior: focus opens after delay, blur closes, and
            <code> Escape</code> dismisses open tooltips.
          </p>
        ),
        example: examples.controlled,
        title: 'Support keyboard users',
      },
      {
        content: (
          <p>
            Keep content hoverable when users move from trigger to tooltip so
            short cursor transitions do not cause accidental dismissal.
          </p>
        ),
        example: examples.primitives,
        title: 'Preserve hover path',
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
            componentHref: '/ui/component/tooltip',
            componentLabel: 'Tooltip',
          })}
        />
      }
      description={
        component?.meta?.description ??
        'Displays contextual hints anchored to a trigger with hover/focus interactions.'
      }
      eyebrow={component?.name ?? 'Tooltip'}
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
