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

const checkboxFallbackImport =
  "import { Checkbox } from '@themeshift/ui/components/Checkbox';";

export const CheckboxGuide = () => {
  const { component } = useApiReference({ component: 'checkbox' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? checkboxFallbackImport,
    intro:
      'Get a checkbox onto the page quickly, then expand into indeterminate, validation, and Field composition patterns.',
    useDescription:
      'Start with a native checkbox, then layer in validation state, indeterminate behavior, and Field integration as needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      hideColumns={['defaultValue']}
      intro={
        <GuideCallout>
          <code>Checkbox</code> wraps a native{' '}
          <code>input[type="checkbox"]</code> and adds size, validation,
          indeterminate behavior, and optional Field integration.
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
            id="examples-field-inline"
            label="Field inline"
            level={2}
          />
          <Heading level={4}>With Field inline-control</Heading>
          <p>
            Use <code>layout="inline-control"</code> to align checkbox and label
            in one row.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withFieldInline} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-description-error"
            label="Description and error"
            level={2}
          />
          <Heading level={4}>Description and error</Heading>
          <p>
            Pair checkbox with Field subcomponents for helper text and
            validation messaging.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withDescriptionAndError} />
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
            Inline checkbox layouts should mirror start and end alignment
            between LTR and RTL writing modes.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-indeterminate"
            label="Indeterminate"
            level={2}
          />
          <Heading level={4}>Indeterminate</Heading>
          <p>
            Use <code>indeterminate</code> for partial selection states in
            grouped checklists.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.indeterminate} />
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
            Use <code>validationState</code> for border feedback and derived
            <code>aria-invalid</code> semantics.
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
            Use native <code>disabled</code> to prevent toggling and reflect
            unavailable options.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.disabled} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use <code>size</code> to scale the control for compact or spacious
            interfaces.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.sizes} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop names, native passthrough behavior, and Field-aware accessibility defaults.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common boolean-input patterns: inline layout, helper text, indeterminate state, and validation feedback.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for labeling and validation semantics.',
    items: [
      {
        content: (
          <p>
            Ensure the checkbox has a programmatic label. Use a native{' '}
            <code>label</code> or pair with <code>Field</code> so the entire
            label area toggles the control.
          </p>
        ),
        example: examples.withFieldInline,
        title: 'Provide a label',
      },
      {
        content: (
          <p>
            Use <code>Field.Description</code> and <code>Field.Error</code> to
            keep helper text and validation messages associated with the
            checkbox for assistive technology.
          </p>
        ),
        example: examples.withDescriptionAndError,
        tocLabel: 'Help & errors',
        title: 'Associate help text and errors',
      },
      {
        content: (
          <p>
            Indeterminate is a visual “partial selection” state. If the checkbox
            is unlabeled, provide an accessible name via <code>aria-label</code>
            .
          </p>
        ),
        example: examples.indeterminate,
        title: 'Label indeterminate states',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/checkbox',
            componentLabel: 'Checkbox',
          })}
        />
      }
      description="A theme-aware native checkbox with Field integration and indeterminate support."
      eyebrow="Checkbox"
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
