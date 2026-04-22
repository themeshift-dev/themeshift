import { Heading } from '@themeshift/ui/components/Heading';

import { useApiReference } from '@/apiReference';
import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
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

const badgeFallbackImport =
  "import { Badge } from '@themeshift/ui/components/Badge';";

export const BadgeGuide = () => {
  const { component } = useApiReference({ component: 'badge' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? badgeFallbackImport,
    intro:
      'Use Badge for compact metadata labels and Badge.Count for lightweight notification indicators.',
    useDescription:
      'Start with tone + variant for status labels, then use Badge.Count for anchored counters and dots.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Badge</code> supports semantic tones, curated colors, and{' '}
          polymorphic composition. Use <code>as</code> for straightforward
          element/component swaps, and use <code>asChild</code> when you need to
          preserve an existing child element identity. <code>Badge.Count</code>{' '}
          is a dedicated <code>span</code> indicator for numeric and dot badges.
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
            id="examples-tones-variants"
            label="Tones and variants"
            level={2}
          />
          <Heading level={4}>Tones and variants</Heading>
          <p>
            Use semantic tones with soft, solid, and outline variants for
            status-style metadata.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.tonesAndVariants} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-colors"
            label="Colors"
            level={2}
          />
          <Heading level={4}>Curated colors</Heading>
          <p>
            Use color mode for category badges where semantic status variants
            are not needed.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.colors} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-as-and-as-child"
            label="as vs asChild"
            level={2}
          />
          <Heading level={4}>Interactive with as and asChild</Heading>
          <p>
            Use <code>as</code> for direct polymorphic rendering (for example,
            <code>NavLink</code> or <code>a</code>). Use <code>asChild</code>{' '}
            when you already have a child element and need to preserve that
            element while applying Badge styles.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer
            examples={[examples.interactiveAs, examples.interactiveAsChild]}
          />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-with-icon"
            label="With icon"
            level={2}
          />
          <Heading level={4}>With icon</Heading>
          <p>
            Add a compact icon when the badge benefits from quick visual
            context.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withIcon} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-anchored-count"
            label="Anchored count"
            level={2}
          />
          <Heading level={4}>Anchored count</Heading>
          <p>
            Wrap target content in <code>Badge.Count</code> to overlay a numeric
            indicator.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.countAnchored} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-standalone-count"
            label="Standalone count"
            level={2}
          />
          <Heading level={4}>Standalone count, text dot, and dot</Heading>
          <p>
            Use standalone count indicators for unread totals, text-dot
            attention badges, and tiny dot-only notification cues.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.countStandalone} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-placement"
            label="Placement"
            level={2}
          />
          <Heading level={4}>Placement with logical directions</Heading>
          <p>
            Placement uses start/end logical directions so RTL and LTR layouts
            are handled automatically.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.placementExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for root and count prop details, including asChild, color/tone modes, and count formatting behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse status badges, category colors, interactive composition, and count indicator patterns.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Guidance for readable metadata and count semantics.',
    items: [
      {
        content: (
          <p>
            Treat badges as supplemental metadata. Keep primary control labels
            and headings outside the badge so screen reader users get the main
            context first.
          </p>
        ),
        example: examples.tonesAndVariants,
        tocLabel: 'Badge hierarchy',
        title: 'Keep badges secondary to primary labels',
      },
      {
        content: (
          <p>
            <code>Badge.Count</code> is static by default. Add{' '}
            <code>aria-live</code> only when changing counts should be announced
            to assistive technology.
          </p>
        ),
        example: examples.countLiveAnnouncements,
        tocLabel: 'Live announcements',
        title: 'Opt into live announcements intentionally',
      },
      {
        content: (
          <p>
            For icon-only controls, include the unread count in the control
            label (for example, <code>Notifications, 3 unread</code>). If the
            overlaid badge is decorative, set <code>aria-hidden</code> on
            <code>Badge.Count</code> so assistive tech does not announce an
            isolated number.
          </p>
        ),
        example: examples.countAnchored,
        tocLabel: 'Anchor names',
        title: 'Ensure anchor controls have accessible names',
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
            componentHref: '/ui/component/badge',
            componentLabel: 'Badge',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Badge and Badge.Count."
      eyebrow="Badge"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
