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
import styles from './ErrorMessageGuide.module.scss';

const errorMessageFallbackImport =
  "import { ErrorMessage } from '@themeshift/ui/components/ErrorMessage';";

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

export const ErrorMessageGuide = () => {
  const { component } = useComponentData('errormessage');

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
            string={component?.importString ?? errorMessageFallbackImport}
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
        description="Start with a short inline error message, then connect it to controls with aria-describedby."
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
          <code>ErrorMessage</code> is a lightweight text primitive for
          validation feedback. It defaults to <code>role="alert"</code> so
          updates are announced by assistive technology.
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
            id="examples-field"
            label="With Field"
            level={2}
          />
          <Heading level={4}>With Field</Heading>
          <p>
            Pair <code>ErrorMessage</code> with <code>aria-describedby</code> so
            input focus includes error text in screen reader output.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.withField}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-roles" label="Roles" level={2} />
          <Heading level={4}>Alert and status roles</Heading>
          <p>
            Keep the default <code>alert</code> role for blocking errors, or use
            <code>role="status"</code> for less urgent validation updates.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.assertiveAndPolite}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-long-form"
            label="Long message"
            level={2}
          />
          <Heading level={4}>Long-form message</Heading>
          <p>
            Use clear, actionable copy when users need to correct multiple
            constraints in one field.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.longForm}
        />
      </div>
    </div>
  );

  const quickStartSection = {
    content: quickStartContent,
    id: 'quick-start',
    intro:
      'Get error text on screen quickly, then connect it to controls with robust semantics.',
    title: 'Quick start',
  } satisfies ComponentGuideSection;

  const propsSection = {
    content: propsContent,
    id: 'props',
    intro:
      'Use the API reference for exact native paragraph props and defaults.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse common error-message patterns used in forms and validation workflows.',
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
            { href: '/components/error-message', label: 'ErrorMessage' },
            { current: true, label: 'Docs' },
          ]}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with ErrorMessage."
      eyebrow="ErrorMessage"
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
