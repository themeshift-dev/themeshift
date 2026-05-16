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

const shortcutFallbackImport =
  "import { Shortcut } from '@themeshift/ui/components/Shortcut';";

export const ShortcutGuide = () => {
  const { component } = useApiReference({ component: 'shortcut' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.introExamples} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStart = createQuickStartSection({
    componentImport: component?.importString ?? shortcutFallbackImport,
    intro:
      'Use Shortcut to render keyboard hints that stay compact in menus, inputs, and action surfaces.',
    useDescription:
      'Provide `keys` as a string or array, then tune platform behavior, separators, and visual style.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsSection = createPropsSection({
    content: <ApiReference items={component?.apiReference ?? []} />,
    intro:
      'Shortcut normalizes key aliases, resolves platform-specific `mod` behavior, and exposes layout/style props for tight UI composition.',
  });

  const examplesSection = createExamplesSection({
    intro:
      'Review platform resolution, separators, format modes, visual styles, shared formatter usage, and composition in existing primitives.',
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-platform"
              label="Platform behavior"
              level={2}
            />
            <Heading level={4}>Platform behavior</Heading>
            <p>
              Use <code>platform</code> to force rendering for macOS, Windows,
              or Linux, or keep <code>auto</code> to map <code>mod</code> based
              on the current environment.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.platformFormatting} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-separators"
              label="Separators and format"
              level={2}
            />
            <Heading level={4}>Separators and format</Heading>
            <p>
              Switch between symbol and text output, and choose separator style
              for denser command rows or explicit chord notation.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.separatorsAndFormats} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-visual"
              label="Visual styles"
              level={2}
            />
            <Heading level={4}>Visual styles</Heading>
            <p>
              Adjust <code>size</code>, <code>variant</code>, and{' '}
              <code>tone</code> to match surrounding UI density and contrast.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.visualVariants} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-disabled"
              label="Disabled state"
              level={2}
            />
            <Heading level={4}>Enabled and disabled</Heading>
            <p>
              Use <code>disabled</code> when a shortcut hint should appear
              unavailable while preserving layout consistency.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.enabledAndDisabled} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-compact"
              label="Compact spacing"
              level={2}
            />
            <Heading level={4}>Compact spacing</Heading>
            <p>
              Use <code>compact</code> to reduce inter-key and key-separator
              spacing for dense layouts.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.compactSpacing} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-compose"
              label="Composition"
              level={2}
            />
            <Heading level={4}>Menu and Input composition</Heading>
            <p>
              Place Shortcut directly in <code>Menu.ItemMeta</code> and Input
              adornments to keep interactions consistent across command
              surfaces.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.menuAndInputUsage} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-utility"
              label="Formatter utility"
              level={2}
            />
            <Heading level={4}>Formatter utility</Heading>
            <p>
              Use <code>formatShortcut</code> when you need normalized display
              and accessible labels outside the component.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.formatterUtility} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
  });

  const accessibility = createAccessibilityGuidelinesSection({
    intro:
      'Shortcut accessibility relies on screen-reader labels and hidden symbol keycaps so announcements stay readable.',
    items: [
      {
        title: 'Expose a readable shortcut label',
        content: (
          <p>
            Shortcut sets an <code>aria-label</code> on the wrapper so assistive
            tech hears readable key names like “Command Shift P” instead of raw
            symbols.
          </p>
        ),
        example: {
          id: 'a11y-readable-label',
          label: examples.formatterUtility.label,
          code: examples.formatterUtility.code,
          render: examples.formatterUtility.sample,
        },
      },
      {
        title: 'Keep keycaps decorative to screen readers',
        content: (
          <p>
            Individual <code>kbd</code> keycaps are rendered with{' '}
            <code>aria-hidden</code> so symbols do not get announced
            individually.
          </p>
        ),
        example: {
          id: 'a11y-hidden-keycaps',
          label: examples.basicUsage.label,
          code: examples.basicUsage.code,
          render: examples.basicUsage.sample,
        },
      },
      {
        title: 'Preserve contrast and spacing in dense layouts',
        content: (
          <p>
            Verify keycaps remain legible in compact menu rows and input
            adornments, especially for inverse or muted tones.
          </p>
        ),
        example: {
          id: 'a11y-composition',
          label: examples.menuAndInputUsage.label,
          code: examples.menuAndInputUsage.code,
          render: examples.menuAndInputUsage.sample,
        },
      },
    ],
  });

  return (
    <ComponentGuide
      accessibility={accessibility}
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/component/shortcut',
            componentLabel: 'Shortcut',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for platform-aware keyboard shortcut hints."
      eyebrow="Shortcut"
      examples={examplesSection}
      howToUse={quickStart}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
