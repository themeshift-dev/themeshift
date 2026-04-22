import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useApiReference } from '@/apiReference';
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

const progressBarFallbackImport =
  "import { ProgressBar } from '@themeshift/ui/components/ProgressBar';";

export const ProgressBarGuide = () => {
  const { component } = useApiReference({ component: 'progress-bar' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? progressBarFallbackImport,
    intro:
      'Use ProgressBar for determinate and indeterminate task progress with accessible label, value, and description wiring.',
    useDescription:
      'Start with value and label, then switch to custom composition only when you need advanced track/indicator/value layouts.',
    useExample: (
      <ExampleViewer
        defaultCodeExpanded={true}
        example={examples.withLabelAndValue}
      />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>ProgressBar</code> is a compound component. Use shorthand props
          for quick setup, or compose with <code>ProgressBar.Track</code> and{' '}
          <code>ProgressBar.Indicator</code> for full control.
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
            id="examples-basic"
            label="Basic usage"
            level={2}
          />
          <Heading level={4}>Basic usage</Heading>
          <p>Render a determinate value when progress is known.</p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.basicUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-indeterminate"
            label="Indeterminate"
            level={2}
          />
          <Heading level={4}>Indeterminate state</Heading>
          <p>
            Use <code>indeterminate</code> when completion percentage is
            unknown.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.indeterminate} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-formatter"
            label="Custom formatter"
            level={2}
          />
          <Heading level={4}>Custom value formatting</Heading>
          <p>
            Pass <code>valueFormatter</code> for ratio-style or domain-specific
            value text.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.customFormatter} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-composition"
            label="Composition"
            level={2}
          />
          <Heading level={4}>Custom composition</Heading>
          <p>
            Compose label, track, indicator, value, and description explicitly
            when layout needs differ from shorthand defaults.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.composition} />
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
            Vertical progress bars fill from bottom to top and support the same
            value semantics.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.vertical} />
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
            Horizontal fill direction follows document writing direction
            automatically.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-tones" label="Tones" level={2} />
          <Heading level={4}>Tone variants</Heading>
          <p>
            Use <code>tone</code> to align progress visuals with UI intent.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.tones} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop signatures, defaults, and subcomponent override behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Start with shorthand for common use-cases, then move to compound composition when you need custom structure.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Progress indicators should communicate purpose and state to all users, including assistive technology users.',
    items: [
      {
        content: (
          <p>
            Always provide a clear accessible name through visible label text,
            <code> aria-label</code>, or <code>aria-labelledby</code>. Generic
            labels like “Loading” are less helpful than context-specific labels.
          </p>
        ),
        example: examples.withLabelAndValue,
        tocLabel: 'Meaningful names',
        title: 'Provide a meaningful name',
      },
      {
        content: (
          <p>
            Use <code>indeterminate</code> only when progress values are
            genuinely unknown. Avoid fake percentages that imply precision.
          </p>
        ),
        example: examples.indeterminate,
        tocLabel: 'Progress mode',
        title: 'Choose determinate vs indeterminate correctly',
      },
      {
        content: (
          <p>
            Include supporting context with <code>ProgressBar.Description</code>{' '}
            when users need status detail, remaining time, or cautions.
          </p>
        ),
        example: examples.composition,
        tocLabel: 'Progress text',
        title: 'Pair progress with explanatory text',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/component/progress-bar',
            componentLabel: 'ProgressBar',
          })}
        />
      }
      description="Implementation guidance, API details, and examples for determinate and indeterminate progress indicators with ProgressBar."
      eyebrow="ProgressBar"
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
