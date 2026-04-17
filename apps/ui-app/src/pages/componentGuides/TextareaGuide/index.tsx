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

const textareaFallbackImport =
  "import { Textarea } from '@themeshift/ui/components/Textarea';";

export const TextareaGuide = () => {
  const { component } = useApiReference({ component: 'textarea' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? textareaFallbackImport,
    intro:
      'Get a textarea onto the page quickly, then expand into resize, autosize, and validation patterns below.',
    useDescription:
      'Start with a labelled textarea, then layer in sizing, resize behavior, and validation props as needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      hideColumns={['defaultValue']}
      intro={
        <GuideCallout>
          <code>Textarea</code> wraps a native <code>textarea</code> and adds
          size, validation, resize control, and optional autosize behavior via{' '}
          <code>resize="auto"</code>.
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
            Use <code>size</code> to control textarea typography, spacing, and
            minimum height.
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
            id="examples-resize"
            label="Resize modes"
            level={2}
          />
          <Heading level={4}>Resize modes</Heading>
          <p>
            Use <code>resize</code> to control user resizing behavior. Choose
            from none, vertical, horizontal, or both.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.resizeModes} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-auto-resize"
            label="Auto resize"
            level={2}
          />
          <Heading level={4}>Auto resize</Heading>
          <p>
            Set <code>resize</code> to <code>auto</code> to use autosizing, then
            bound growth with <code>minRows</code> and <code>maxRows</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.autoResize} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-field" label="Field" level={2} />
          <Heading level={4}>With Field</Heading>
          <p>
            Pair <code>Textarea</code> with <code>Field</code> to share label,
            helper text, and error semantics while keeping multiline input
            behavior native.
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
            Textareas are full width by default. Set <code>fullWidth</code> to{' '}
            <code>false</code> for inline layouts.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.widths} />
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
            Use native <code>disabled</code> to prevent edits while preserving
            value visibility.
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
      'Use the API reference for exact prop names, native passthrough behavior, and autosize-specific controls.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common multiline input patterns teams typically need in production: size variants, validation feedback, and resize behavior.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for accessible labeling and error messaging.',
    items: [
      {
        content: (
          <p>
            Ensure the textarea has an accessible name via a visible{' '}
            <code>Field</code> label, or use <code>aria-label</code> when a
            visual label is not appropriate.
          </p>
        ),
        example: examples.withField,
        title: 'Provide a label and description',
      },
      {
        content: (
          <p>
            Keep error messaging programmatically associated with the control so
            assistive tech announces it on focus. Pair{' '}
            <code>validationState</code> with an explicit error message.
          </p>
        ),
        example: examples.withField,
        title: 'Announce validation feedback',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/textarea',
            componentLabel: 'Textarea',
          })}
        />
      }
      description="A theme-aware textarea with native and autosize resize modes."
      eyebrow="Textarea"
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
