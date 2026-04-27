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

const inputFallbackImport =
  "import { Input } from '@themeshift/ui/components/Input';";

export const InputGuide = () => {
  const { component } = useApiReference({ component: 'input' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? inputFallbackImport,
    intro:
      'Get an input onto the page quickly, then expand into validation, adornments, and layout patterns below.',
    useDescription:
      'Start with a labelled input, then layer in size, adornments, width, and validation state props as needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      hideColumns={['defaultValue']}
      intro={
        <GuideCallout>
          <code>Input</code> wraps a native <code>input</code> element and adds
          size, validation, adornment, and layout props while preserving native
          text entry behavior.
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
            Use <code>size</code> to scale control height, padding, and text.
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
            valid states also derive <code>aria-invalid</code> when you do not
            pass it explicitly.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.validationStates} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-adornments"
            label="Adornments"
            level={2}
          />
          <Heading level={4}>Adornments</Heading>
          <p>
            Use <code>startAdornment</code> and <code>endAdornment</code> for
            icons, helper text, or inline actions.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.adornments} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-input-direction"
            label="Direction (LTR/RTL)"
            level={2}
          />
          <Heading level={4}>Direction (LTR/RTL)</Heading>
          <p>
            Start and end adornments should mirror with writing direction
            without changing component props.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-action"
            label="Action"
            level={2}
          />
          <Heading level={4}>Action adornment</Heading>
          <p>
            Adornments can include interactive content when inline actions make
            sense for the workflow.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withAction} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-field" label="Field" level={2} />
          <Heading level={4}>With Field</Heading>
          <p>
            Pair <code>Input</code> with <code>Field</code> to centralize
            labels, descriptions, and error messaging while the control stays a
            thin native wrapper.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withField} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-width"
            label="Widths"
            level={2}
          />
          <Heading level={4}>Widths</Heading>
          <p>
            Inputs are full width by default. Set <code>fullWidth</code> to{' '}
            <code>false</code> for inline forms.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.widths} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-class-names"
            label="Class names"
            level={2}
          />
          <Heading level={4}>Class names</Heading>
          <p>
            Use <code>className</code> for the wrapper and{' '}
            <code>inputClassName</code> for the native input element.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.classNames} />
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
            Use native <code>disabled</code> to prevent edits and reflect a
            read-only interaction moment in the UI.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.disabled} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop names, native passthrough behavior, and wrapper-specific customization hooks.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common text input patterns you will likely need in production: sizing, state feedback, adornments, and width control.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for labels, adornments, and validation announcements.',
    items: [
      {
        content: (
          <p>
            Prefer a visible label by pairing <code>Input</code> with{' '}
            <code>Field</code>. Use <code>aria-label</code> only when a visible
            label is not appropriate.
          </p>
        ),
        example: examples.withField,
        tocLabel: 'Accessible names',
        title: 'Provide an accessible name',
      },
      {
        content: (
          <p>
            For adornments, mark decorative icons as <code>aria-hidden</code>.
            If an adornment is interactive (like a button), ensure it has an
            accessible name and an explicit <code>type="button"</code>.
          </p>
        ),
        example: examples.withAction,
        tocLabel: 'Adornments',
        title: 'Keep adornments accessible',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/input',
            componentLabel: 'Input',
          })}
        />
      }
      description="A theme-aware text input with native behavior and optional adornments."
      eyebrow="Input"
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
