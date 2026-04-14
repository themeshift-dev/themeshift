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
import styles from './CheckboxGuide.module.scss';
import * as examples from './examples';

const checkboxFallbackImport =
  "import { Checkbox } from '@themeshift/ui/components/Checkbox';";

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

export const CheckboxGuide = () => {
  const { component } = useComponentData('checkbox');

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
            string={component?.importString ?? checkboxFallbackImport}
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
        description="Start with a native checkbox, then layer in validation state, indeterminate behavior, and Field integration as needed."
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
          <code>Checkbox</code> wraps a native{' '}
          <code>input[type="checkbox"]</code> and adds size, validation,
          indeterminate behavior, and optional Field integration.
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
            id="examples-field-inline"
            label="Field inline"
            level={2}
          />
          <Heading level={4}>With Field inline-control</Heading>
          <p>
            Use <code>layout="inline-control"</code> to align checkbox and label
            in one row.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.withFieldInline}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.withDescriptionAndError}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.indeterminate}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.validationStates}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.disabled}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use <code>size</code> to scale the control for compact or spacious
            interfaces.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.sizes}
        />
      </div>
    </div>
  );

  const quickStartSection = {
    content: quickStartContent,
    id: 'quick-start',
    intro:
      'Get a checkbox onto the page quickly, then expand into indeterminate, validation, and Field composition patterns.',
    title: 'Quick start',
  } satisfies ComponentGuideSection;

  const propsSection = {
    content: propsContent,
    id: 'props',
    intro:
      'Use the API reference for exact prop names, native passthrough behavior, and Field-aware accessibility defaults.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse common boolean-input patterns: inline layout, helper text, indeterminate state, and validation feedback.',
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
            { href: '/components/checkbox', label: 'Checkbox' },
            { current: true, label: 'Docs' },
          ]}
        />
      }
      description="A theme-aware native checkbox with Field integration and indeterminate support."
      eyebrow="Checkbox"
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
