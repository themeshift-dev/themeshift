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

const cardFallbackImport =
  "import { Card } from '@themeshift/ui/components/Card';";

export const CardGuide = () => {
  const { component } = useApiReference({ component: 'card' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? cardFallbackImport,
    intro:
      'Use Card as a composable container that can be as simple or as structured as your layout needs.',
    useDescription:
      'Start with Card + Header + Body, then add Footer, Actions, and Media for richer content patterns.',
    useExample: (
      <ExampleViewer
        defaultCodeExpanded={true}
        example={examples.structuredUsage}
      />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <>
          <GuideCallout>
            <code>Card</code> is a compound component with polymorphic slots and
            native prop passthrough so semantics, <code>aria</code> attributes,
            and <code>data</code> attributes stay first-class.
            <br />
            In <code>Card.Header</code> and <code>Card.Footer</code>, use{' '}
            <code>justify</code> for horizontal distribution (start, center,
            end, space-between). Use <code>align</code> for cross-axis
            alignment.
          </GuideCallout>
        </>
      }
      items={component?.apiReference ?? []}
    />
  );

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-settings"
            label="Settings panel"
            level={2}
          />
          <Heading level={4}>Settings panel</Heading>
          <p>
            Combine <code>Card</code> with form primitives like{' '}
            <code>Field</code> and <code>Input</code> for dashboard and settings
            surfaces.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.settingsPanel} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-metric"
            label="Metric card"
            level={2}
          />
          <Heading level={4}>Metric card</Heading>
          <p>
            Use header/body/footer regions for stat summaries with compact
            actions and status badges.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.metricCard} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-header-actions"
            label="Header actions"
            level={2}
          />
          <Heading level={4}>Header actions</Heading>
          <p>
            Keep controls in <code>Card.Actions</code> so button/link groups are
            aligned consistently.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.headerActions} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-footer-actions"
            label="Footer actions"
            level={2}
          />
          <Heading level={4}>Footer actions</Heading>
          <p>
            Place confirmations and secondary actions in the footer for
            predictable layout and scanning.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.footerActions} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-media"
            label="Media cards"
            level={2}
          />
          <Heading level={4}>Media cards (top and bottom)</Heading>
          <p>
            <code>Card.Media</code> is layout-only and supports ratio, fit, and
            top/bottom positioning.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={[examples.mediaTop, examples.mediaBottom]} />
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
            Start/end alignment uses logical directions, so layout mirrors
            correctly in both writing modes.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-link-overlay"
            label="Link overlay"
            level={2}
          />
          <Heading level={4}>Full-surface links with LinkOverlay</Heading>
          <p>
            Use <code>Card.LinkOverlay</code> for clickable card surfaces while
            keeping nested controls independently interactive with{' '}
            <code>data-card-interactive</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.linkOverlay} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-divider"
            label="Divider"
            level={2}
          />
          <Heading level={4}>Horizontal and vertical dividers</Heading>
          <p>
            <code>Card.Divider</code> supports horizontal and vertical
            orientations with logical inset behavior.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.dividers} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-card-badge"
            label="Card.Badge"
            level={2}
          />
          <Heading level={4}>Card.Badge positions and composition</Heading>
          <p>
            Use <code>Card.Badge</code> for corner positioning with RTL/LTR-safe
            offsets and pass-through Badge visuals.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.badgePlacementExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-card-badge-composition"
            label="Card.Badge as/asChild"
            level={2}
          />
          <Heading level={4}>Card.Badge as vs asChild</Heading>
          <p>
            Use <code>as</code> when you want direct polymorphism. Use{' '}
            <code>asChild</code> when you need to preserve an existing child
            element identity.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.badgeAsVsAsChild} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for root and slot props, including polymorphic semantics and layout options.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common card patterns for settings, metrics, actions, previews, and direction-aware layouts.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Guidance for semantic structure, heading hierarchy, and media behavior.',
    items: [
      {
        content: (
          <p>
            Choose semantic wrappers intentionally: use{' '}
            <code>as="article"</code>
            for feed items, <code>as="section"</code> for grouped content, and
            only use <code>as="a"</code> when the whole card should be a single
            link target.
          </p>
        ),
        example: examples.structuredUsage,
        tocLabel: 'Card semantics',
        title: 'Pick semantics that match content intent',
      },
      {
        content: (
          <p>
            Keep heading levels meaningful. If <code>Card.Title</code> needs
            heading semantics, set <code>as</code> to an appropriate heading tag
            and keep page heading order consistent.
          </p>
        ),
        example: examples.settingsPanel,
        title: 'Maintain heading hierarchy',
      },
      {
        content: (
          <p>
            For decorative images inside <code>Card.Media</code>, use empty{' '}
            <code>alt</code> text. For informative media, provide descriptive
            alternative text so context is available to screen reader users.
          </p>
        ),
        example: examples.mediaTop,
        tocLabel: 'Media alt text',
        title: 'Treat media alt text intentionally',
      },
      {
        content: (
          <p>
            <code>Card.LinkOverlay</code> creates a full-surface click target.
            Add <code>data-card-interactive</code> to nested controls that
            should remain independently clickable and keyboard-focusable.
          </p>
        ),
        example: examples.linkOverlay,
        tocLabel: 'LinkOverlay controls',
        title: 'Preserve nested interactive controls with LinkOverlay',
      },
      {
        content: (
          <p>
            Use full-surface links for cards that represent one primary
            destination. If the card has multiple primary actions, prefer direct
            buttons/links without an overlay.
          </p>
        ),
        example: examples.linkOverlay,
        tocLabel: 'Full-surface links',
        title: 'Use full-surface links intentionally',
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
            componentHref: '/ui/component/card',
            componentLabel: 'Card',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Card and its slot primitives."
      eyebrow="Card"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
