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
import styles from './InputGuide.module.scss';
import * as examples from './examples';

const inputFallbackImport =
  "import { Input } from '@themeshift/ui/components/Input';";

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

export const InputGuide = () => {
  const { component } = useComponentData('input');

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
            string={component?.importString ?? inputFallbackImport}
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
        description="Start with a labelled input, then layer in size, adornments, width, and validation state props as needed."
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
          <code>Input</code> wraps a native <code>input</code> element and adds
          size, validation, adornment, and layout props while preserving native
          text entry behavior.
        </p>
      }
      items={component?.apiReference ?? []}
    />
  );

  const examplesContent = (
    <div className={styles.examplesGrid}>
      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use <code>size</code> to scale control height, padding, and text.
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
            valid states also derive <code>aria-invalid</code> when you do not
            pass it explicitly.
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
            id="examples-adornments"
            label="Adornments"
            level={2}
          />
          <Heading level={4}>Adornments</Heading>
          <p>
            Use <code>startAdornment</code> and <code>endAdornment</code> for
            icons, helper text, or inline actions.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.adornments}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.withAction}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.widths}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.classNames}
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
            Use native <code>disabled</code> to prevent edits and reflect a
            read-only interaction moment in the UI.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.disabled}
        />
      </div>
    </div>
  );

  const quickStartSection = {
    content: quickStartContent,
    id: 'quick-start',
    intro:
      'Get an input onto the page quickly, then expand into validation, adornments, and layout patterns below.',
    title: 'Quick start',
  } satisfies ComponentGuideSection;

  const propsSection = {
    content: propsContent,
    id: 'props',
    intro:
      'Use the API reference for exact prop names, native passthrough behavior, and wrapper-specific customization hooks.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse common text input patterns you will likely need in production: sizing, state feedback, adornments, and width control.',
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
            { href: '/components/input', label: 'Input' },
            { current: true, label: 'Docs' },
          ]}
        />
      }
      description="A theme-aware text input with native behavior and optional adornments."
      eyebrow="Input"
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
