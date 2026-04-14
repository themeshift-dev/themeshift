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
import styles from './TextareaGuide.module.scss';
import * as examples from './examples';

const textareaFallbackImport =
  "import { Textarea } from '@themeshift/ui/components/Textarea';";

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

export const TextareaGuide = () => {
  const { component } = useComponentData('textarea');

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
            string={component?.importString ?? textareaFallbackImport}
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
        description="Start with a labelled textarea, then layer in sizing, resize behavior, and validation props as needed."
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
          <code>Textarea</code> wraps a native <code>textarea</code> and adds
          size, validation, resize control, and optional autosize behavior via{' '}
          <code>resize="auto"</code>.
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
            Use <code>size</code> to control textarea typography, spacing, and
            minimum height.
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
            id="examples-resize"
            label="Resize modes"
            level={2}
          />
          <Heading level={4}>Resize modes</Heading>
          <p>
            Use <code>resize</code> to control user resizing behavior. Choose
            from none, vertical, horizontal, or both.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.resizeModes}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
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
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.autoResize}
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
            Textareas are full width by default. Set <code>fullWidth</code> to{' '}
            <code>false</code> for inline layouts.
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
            id="examples-disabled"
            label="Disabled"
            level={2}
          />
          <Heading level={4}>Disabled</Heading>
          <p>
            Use native <code>disabled</code> to prevent edits while preserving
            value visibility.
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
      'Get a textarea onto the page quickly, then expand into resize, autosize, and validation patterns below.',
    title: 'Quick start',
  } satisfies ComponentGuideSection;

  const propsSection = {
    content: propsContent,
    id: 'props',
    intro:
      'Use the API reference for exact prop names, native passthrough behavior, and autosize-specific controls.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse common multiline input patterns teams typically need in production: size variants, validation feedback, and resize behavior.',
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
            { href: '/components/textarea', label: 'Textarea' },
            { current: true, label: 'Docs' },
          ]}
        />
      }
      description="A theme-aware textarea with native and autosize resize modes."
      eyebrow="Textarea"
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
