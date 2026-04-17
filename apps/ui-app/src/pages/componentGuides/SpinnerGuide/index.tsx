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

const spinnerFallbackImport =
  "import { Spinner } from '@themeshift/ui/components/Spinner';";

export const SpinnerGuide = () => {
  const { component } = useApiReference({ component: 'spinner' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? spinnerFallbackImport,
    intro:
      'Show loading state quickly, then tune spinner size and semantics for each context.',
    useDescription:
      'Start with a labelled spinner for standalone loading, then adapt size and context for inline use.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Spinner</code> renders an animated SVG loader. Use
          <code>size</code> to scale it and native SVG props for accessibility
          and presentation.
        </GuideCallout>
      }
      items={component?.apiReference ?? []}
    />
  );

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use size values that match surrounding controls and density targets.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.sizes} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-buttons"
            label="Buttons"
            level={2}
          />
          <Heading level={4}>In buttons</Heading>
          <p>
            Use button busy states or icon slots to communicate in-progress
            actions without layout shift.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.inButtons} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-color" label="Color" level={2} />
          <Heading level={4}>Custom color</Heading>
          <p>
            Spinner inherits current text color. Use style or utility classes to
            align with surface context.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.customColor} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-decorative"
            label="Decorative"
            level={2}
          />
          <Heading level={4}>Decorative spinner</Heading>
          <p>
            Set <code>aria-hidden</code> when adjacent text already announces
            loading context.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.hiddenDecorative} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for size defaults and native SVG prop passthroughs.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse spinner patterns for standalone loading, button integration, and decorative usage.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Loading indicators should communicate both visuals and semantics.',
    items: [
      {
        content: (
          <p>
            If the spinner is the primary loading indicator, provide an
            accessible name via <code>aria-label</code> (or an adjacent text
            alternative).
          </p>
        ),
        example: examples.basicUsage,
        title: 'Name standalone spinners',
      },
      {
        content: (
          <p>
            When a nearby label already communicates loading, hide the spinner
            from assistive tech with <code>aria-hidden</code>.
          </p>
        ),
        example: examples.hiddenDecorative,
        title: 'Hide decorative spinners',
      },
      {
        content: (
          <p>
            Pair spinner visuals with semantic busy state (for example{' '}
            <code>aria-busy</code> on the region or control that is updating).
          </p>
        ),
        example: examples.inButtons,
        title: 'Expose busy state on the right element',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/spinner',
            componentLabel: 'Spinner',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Spinner."
      eyebrow="Spinner"
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
