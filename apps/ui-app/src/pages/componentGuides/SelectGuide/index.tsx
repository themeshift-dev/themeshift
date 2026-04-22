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

const selectFallbackImport =
  "import { Select } from '@themeshift/ui/components/Select';";

export const SelectGuide = () => {
  const { component } = useApiReference({ component: 'select' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? selectFallbackImport,
    intro:
      'Get a select onto the page quickly, then expand into option data, placeholder patterns, and Field integration.',
    useDescription:
      'Start with a labelled select, then layer in options, placeholder handling, validation state, and Field integration as needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      hideColumns={['defaultValue']}
      intro={
        <GuideCallout>
          <code>Select</code> wraps a native <code>select</code> element and
          adds size, validation, placeholder helpers, and Field-aware
          accessibility wiring.
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
            id="examples-options"
            label="Options prop"
            level={2}
          />
          <Heading level={4}>Options prop</Heading>
          <p>
            Use <code>options</code> when you want to define option values as
            data.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withOptions} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-placeholder"
            label="Placeholder"
            level={2}
          />
          <Heading level={4}>Placeholder</Heading>
          <p>
            Use <code>placeholder</code> to render a disabled empty option for
            prompt text.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withPlaceholder} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use <code>size</code> to scale control height, typography, and
            spacing.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.sizes} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-validation"
            label="Validation"
            level={2}
          />
          <Heading level={4}>Validation states</Heading>
          <p>
            Use <code>validationState</code> for visual feedback. Invalid and
            valid states derive <code>aria-invalid</code> when not explicitly
            provided.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.validationStates} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-disabled"
            label="Disabled"
            level={2}
          />
          <Heading level={4}>Disabled</Heading>
          <p>
            Use native <code>disabled</code> to prevent selection changes while
            preserving value visibility.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.disabled} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-chevron"
            label="Chevron"
            level={2}
          />
          <Heading level={4}>Custom chevron</Heading>
          <p>
            Use <code>chevronIcon</code> to replace the default dropdown
            indicator.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.customChevron} />
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
            Placeholder text, value text, and chevron placement should follow
            logical start/end behavior automatically.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-field" label="Field" level={2} />
          <Heading level={4}>With Field</Heading>
          <p>
            Pair <code>Select</code> with <code>Field</code> to centralize
            labels, descriptions, and error messaging.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withField} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop names, native passthrough behavior, and field-aware accessibility defaults.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common dropdown patterns: options as data, placeholders, validation states, and Field composition.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for labeling and selection prompts.',
    items: [
      {
        content: (
          <p>
            Ensure the select has an accessible name via a visible{' '}
            <code>Field</code> label (preferred). Avoid using placeholder text
            as the only label.
          </p>
        ),
        example: examples.withField,
        title: 'Provide a label',
      },
      {
        content: (
          <p>
            If the user must pick a value, include a placeholder option and
            start with <code>defaultValue=""</code> so the prompt is announced
            before a real choice is made.
          </p>
        ),
        example: examples.withPlaceholder,
        title: 'Use placeholders intentionally',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/select',
            componentLabel: 'Select',
          })}
        />
      }
      description="A theme-aware select with native behavior and Field integration."
      eyebrow="Select"
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
