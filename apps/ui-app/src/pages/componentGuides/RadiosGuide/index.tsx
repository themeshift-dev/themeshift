import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useComponentData } from '@/component-data';
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

const radioFallbackImport =
  "import { Radio } from '@themeshift/ui/components/Radio';";

export const RadiosGuide = () => {
  const { component } = useComponentData('radio');

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? radioFallbackImport,
    intro:
      'Use Radio.Group for a single-choice selection list with native fieldset semantics.',
    useDescription:
      'Start with a group, add a legend for labeling, then compose with Field for descriptions and validation messaging.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Radio</code> wraps a native <code>input[type="radio"]</code> and{' '}
          <code>Radio.Group</code> renders a native <code>fieldset</code> for
          selection state and shared props.
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
            id="examples-controlled"
            label="Controlled"
            level={2}
          />
          <Heading level={4}>Controlled value</Heading>
          <p>
            Use <code>value</code> and <code>onValueChange</code> when managing
            the selected option in React state.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.controlled} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-field"
            label="With Field"
            level={2}
          />
          <Heading level={4}>With Field</Heading>
          <p>
            Use <code>Field.Label as=&quot;legend&quot;</code> to label the
            whole group, and compose descriptions and errors inside the group.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withField} />
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
            Disable the full group or a single option. Group disabled uses the
            native <code>fieldset</code> behavior.
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
            Use <code>size</code> to scale the radio control for compact or
            touch-friendly interfaces.
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
      'Browse common single-choice selection patterns, including Field composition and controlled usage.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for labeling and validation semantics.',
    items: [
      {
        content: (
          <p>
            Use a <code>legend</code> to label the entire group. When composing
            with <code>Field</code>, prefer{' '}
            <code>Field.Label as=&quot;legend&quot;</code>.
          </p>
        ),
        example: examples.withField,
        title: 'Label the group',
      },
      {
        content: (
          <p>
            Use <code>Field.Description</code> and <code>Field.Error</code> to
            keep helper text and validation messages associated with the group.
          </p>
        ),
        example: examples.withField,
        title: 'Associate help text and errors',
      },
      {
        content: (
          <p>
            Use <code>name</code> for form submission and native required
            validation. If you omit it, a stable name is generated for behavior,
            but the value will not submit under a meaningful key. Ensure each
            logical group on a page has its own name—unrelated groups that share
            a name will behave like one big group.
          </p>
        ),
        example: examples.basicUsage,
        title: 'Provide a name for forms',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/components/radio',
            componentLabel: 'Radio',
          })}
        />
      }
      description="A theme-aware native radio with a fieldset-based group and Field integration."
      eyebrow="Radio"
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
