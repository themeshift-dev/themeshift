import { Heading } from '@themeshift/ui/components/Heading';
import type { ReactNode } from 'react';
import { IoHomeSharp } from 'react-icons/io5';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useComponentData } from '@/component-data';
import {
  ExampleViewer,
  StringCopier,
} from '@/pages/componentGuides/components';
import {
  ComponentGuide,
  type ComponentGuideSection,
} from '@/templates/ComponentGuide';

import { AccessibilitySection } from './AccessibilitySection';
import * as examples from './examples';
import styles from './FieldGuide.module.scss';

const fieldFallbackImport =
  "import { Field } from '@themeshift/ui/components/Field';";

type StepCardProps = {
  children: ReactNode;
  description: ReactNode;
  number: string;
  title: string;
};

const StepCard = ({ children, description, number, title }: StepCardProps) => (
  <div className={styles.stepCard}>
    <span aria-hidden="true" className={styles.stepNumber}>
      {number}
    </span>
    <Heading className={styles.stepHeading} level={4}>
      {title}
    </Heading>
    <p className={styles.stepText}>{description}</p>
    {children}
  </div>
);

export const FieldGuide = () => {
  const { component } = useComponentData('field');

  const intro = (
    <section className={styles.introSection}>
      <ExampleViewer
        className={styles.exampleViewer}
        examples={examples.propHighlights}
      />
    </section>
  );

  const quickStartContent = (
    <div className={styles.quickstartLayout}>
      <div className={styles.quickstartColumn}>
        <StepCard
          description="Add the package to your project."
          number="1."
          title="Install"
        >
          <StringCopier string="npm install @themeshift/ui" />
        </StepCard>

        <StepCard
          description="Import the component directly from the UI package."
          number="2."
          title="Import"
        >
          <StringCopier
            className={styles.importString}
            language="jsx"
            string={component?.importString ?? fieldFallbackImport}
          />

          <p className={styles.stepText}>
            Import base styles globally, usually inside <code>main.tsx</code>.
          </p>

          <StringCopier
            language="jsx"
            string="import '@themeshift/ui/css/base.css';"
          />
        </StepCard>
      </div>

      <StepCard
        description="Start with a labelled field, then layer in description, error states, and composable subcomponents when you need more control."
        number="3."
        title="Use"
      >
        <ExampleViewer
          className={styles.stepExampleViewer}
          defaultCodeExpanded={true}
          example={examples.basicUsage}
        />
      </StepCard>
    </div>
  );

  const propsContent = (
    <ApiReference
      intro={
        <p className={styles.callout}>
          <code>Field</code> coordinates IDs, <code>aria-describedby</code>,{' '}
          <code>aria-invalid</code>, and shared form state while controls like{' '}
          <code>Input</code> and <code>Textarea</code> stay thin wrappers around
          native elements.
        </p>
      }
      items={component?.apiReference ?? []}
    />
  );

  const examplesContent = (
    <div className={styles.examplesGrid}>
      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-shorthand"
            label="Shorthand"
            level={2}
          />
          <Heading level={4}>Shorthand content</Heading>
          <p>
            Pass <code>label</code>, <code>description</code>, and{' '}
            <code>error</code> directly to <code>Field</code> for a concise API.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.shorthandContent}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-composable"
            label="Composable"
            level={2}
          />
          <Heading level={4}>Composable API</Heading>
          <p>
            Use <code>Field.Label</code>, <code>Field.Description</code>, and{' '}
            <code>Field.Error</code> when layout and conditional rendering need
            explicit control.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.composableContent}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-required-optional"
            label="Required and optional"
            level={2}
          />
          <Heading level={4}>Required and optional</Heading>
          <p>
            Use <code>required</code> and <code>optional</code> to keep
            indicator presentation consistent with your form language.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.optionalAndRequired}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-inline-shorthand"
            label="Inline shorthand"
            level={2}
          />
          <Heading level={4}>Inline control layout (shorthand)</Heading>
          <p>
            Use <code>layout="inline-control"</code> when the control and main
            label should appear in one row, such as checkboxes.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.inlineControlShorthand}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-inline-composable"
            label="Inline composable"
            level={2}
          />
          <Heading level={4}>Inline control layout (composable)</Heading>
          <p>
            Use composable children when checkbox-style controls need custom
            wrapper structure for labels and support text.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.inlineControlComposable}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-with-textarea"
            label="With Textarea"
            level={2}
          />
          <Heading level={4}>With Textarea</Heading>
          <p>
            The same wiring applies to multiline controls, including autosize
            textareas.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.withTextarea}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-shared-state"
            label="Shared state"
            level={2}
          />
          <Heading level={4}>Shared state</Heading>
          <p>
            Set <code>disabled</code>, <code>readOnly</code>, and
            <code>validationState</code> at the field level to keep control
            behavior synchronized.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.sharedState}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-hide-label"
            label="Hide label"
            level={2}
          />
          <Heading level={4}>Visually hidden label</Heading>
          <p>
            Set <code>hideLabel</code> when a visible label is not desired,
            while preserving accessible naming.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.hideLabel}
        />
      </div>
    </div>
  );

  const quickStartSection = {
    content: quickStartContent,
    id: 'quick-start',
    intro:
      'Get a field wired quickly, then expand into shorthand content, composable slots, and shared control state.',
    title: 'Quick start',
  } satisfies ComponentGuideSection;

  const propsSection = {
    content: propsContent,
    id: 'props',
    intro:
      'Use the API reference for Field root props and shared state primitives that integrate with field-aware controls.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse practical form composition patterns: shorthand, explicit composition, state propagation, and hidden-label layouts.',
    title: 'Examples',
  } satisfies ComponentGuideSection;

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          items={[
            {
              ariaLabel: 'Home',
              href: '/',
              icon: <IoHomeSharp />,
            },
            { href: '/components', label: 'Components' },
            { href: '/components/field', label: 'Field' },
            { current: true, label: 'Docs' },
          ]}
        />
      }
      description="A field composition primitive that owns labels, helper text, errors, and shared control semantics."
      eyebrow="Field"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    >
      <AccessibilitySection />
    </ComponentGuide>
  );
};
