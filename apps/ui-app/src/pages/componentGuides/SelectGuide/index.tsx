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
import styles from './SelectGuide.module.scss';
import * as examples from './examples';

const selectFallbackImport =
  "import { Select } from '@themeshift/ui/components/Select';";

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

export const SelectGuide = () => {
  const { component } = useComponentData('select');

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
            string={component?.importString ?? selectFallbackImport}
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
        description="Start with a labelled select, then layer in options, placeholder handling, validation state, and Field integration as needed."
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
          <code>Select</code> wraps a native <code>select</code> element and
          adds size, validation, placeholder helpers, and Field-aware
          accessibility wiring.
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
            id="examples-options"
            label="Options prop"
            level={2}
          />
          <Heading level={4}>Options prop</Heading>
          <p>
            Use <code>options</code> when you want to define option values as
            data.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.withOptions}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.withPlaceholder}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use <code>size</code> to scale control height, typography, and
            spacing.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.sizes}
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
            Use <code>validationState</code> for visual feedback. Invalid and
            valid states derive <code>aria-invalid</code> when not explicitly
            provided.
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
            Use native <code>disabled</code> to prevent selection changes while
            preserving value visibility.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.disabled}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.customChevron}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-field" label="Field" level={2} />
          <Heading level={4}>With Field</Heading>
          <p>
            Pair <code>Select</code> with <code>Field</code> to centralize
            labels, descriptions, and error messaging.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.withField}
        />
      </div>
    </div>
  );

  const quickStartSection = {
    content: quickStartContent,
    id: 'quick-start',
    intro:
      'Get a select onto the page quickly, then expand into option data, placeholder patterns, and Field integration.',
    title: 'Quick start',
  } satisfies ComponentGuideSection;

  const propsSection = {
    content: propsContent,
    id: 'props',
    intro:
      'Use the API reference for exact prop names, native passthrough behavior, and field-aware accessibility defaults.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse common dropdown patterns: options as data, placeholders, validation states, and Field composition.',
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
            { href: '/components/select', label: 'Select' },
            { current: true, label: 'Docs' },
          ]}
        />
      }
      description="A theme-aware select with native behavior and Field integration."
      eyebrow="Select"
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
