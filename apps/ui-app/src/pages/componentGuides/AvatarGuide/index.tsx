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
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideIntro,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const avatarFallbackImport =
  "import { Avatar } from '@themeshift/ui/components/Avatar';";

export const AvatarGuide = () => {
  const { component } = useApiReference({ component: 'avatar' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.introExamples} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? avatarFallbackImport,
    intro:
      'Use Avatar for identity visuals with smart fallback behavior and optional grouped overflow.',
    useDescription:
      'Start with shorthand props for the common case, then compose Root/Image/Fallback/Badge for advanced behavior.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsSection = createPropsSection({
    content: <ApiReference items={component?.apiReference ?? []} />,
    intro:
      'Avatar exposes both shorthand and compound props for image loading, fallback behavior, grouping, and adornments.',
  });

  const examplesSection = createExamplesSection({
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-composed"
              label="Composed primitives"
              level={2}
            />
            <Heading level={4}>Composed primitives</Heading>
            <p>
              Use root/image/fallback/badge primitives when you need custom
              overlay or image behavior.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.composed} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-sizes-shapes"
              label="Sizes and shapes"
              level={2}
            />
            <Heading level={4}>Sizes and shapes</Heading>
            <p>
              Use the size and shape scales to match identity density across
              compact and spacious layouts.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.sizesAndShapes} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-group-overflow"
              label="Group and overflow"
              level={2}
            />
            <Heading level={4}>Group and overflow</Heading>
            <p>
              Keep group behavior visual-only in base Avatar and expose a clear
              overflow label for assistive technology.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.groupOverflow} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-group-overlap"
              label="Custom overlap"
              level={2}
            />
            <Heading level={4}>Custom overlap</Heading>
            <p>
              Use <code>overlap</code> to control how tightly grouped avatars
              stack in the horizontal direction.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.groupOverlap} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-auto-color"
              label="Auto color fallback"
              level={2}
            />
            <Heading level={4}>Auto color fallback</Heading>
            <p>
              Use deterministic <code>color="auto"</code> for stable server and
              client rendering.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.autoColorFallback} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'Browse shorthand usage, composed primitives, visual grouping, and deterministic fallback color behavior.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Avatar accessibility should communicate identity clearly while avoiding duplicate screen reader announcements.',
    items: [
      {
        title: 'Pick identity vs decorative semantics intentionally',
        content: (
          <p>
            Provide an identity name for standalone avatars. Use{' '}
            <code>decorative</code> when adjacent visible text already names the
            person.
          </p>
        ),
        example: {
          id: 'a11y-decorative',
          label: examples.decorative.label,
          code: examples.decorative.code,
          render: examples.decorative.sample,
        },
      },
      {
        title: 'Use descriptive overflow labels',
        content: (
          <p>
            For grouped avatars, provide an <code>aria-label</code> on the group
            and expose meaningful overflow wording such as “3 more teammates”.
          </p>
        ),
        example: {
          id: 'a11y-overflow',
          label: examples.groupOverflow.label,
          code: examples.groupOverflow.code,
          render: examples.groupOverflow.sample,
        },
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
            componentHref: '/ui/component/avatar',
            componentLabel: 'Avatar',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for identity avatars, composed slots, and grouped overflow patterns."
      eyebrow="Avatar"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
