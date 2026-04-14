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
import styles from './ToggleSwitchGuide.module.scss';
import * as examples from './examples';

const toggleSwitchFallbackImport =
  "import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';";

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

export const ToggleSwitchGuide = () => {
  const { component } = useComponentData('toggleswitch');

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
            string={component?.importString ?? toggleSwitchFallbackImport}
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
        description="Start with an accessible switch, then compose labels, guidance, and errors with Field when needed."
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
          <code>ToggleSwitch</code> wraps a native{' '}
          <code>input[type="checkbox"]</code> with <code>role="switch"</code>,
          supports intent/size/icon styling, and can inherit accessibility state
          from <code>Field</code>.
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
            Use <code>layout="inline-control"</code> to keep switch and label on
            one row.
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
            Compose helper text and validation with{' '}
            <code>Field.Description</code> and <code>Field.Error</code>.
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
            id="examples-on-checked-change"
            label="onCheckedChange"
            level={2}
          />
          <Heading level={4}>onCheckedChange</Heading>
          <p>
            Use <code>onCheckedChange</code> with <code>checked</code> to keep
            switch state synced with external state.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.checkedChange}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-icons" label="Icons" level={2} />
          <Heading level={4}>Icons</Heading>
          <p>
            Use <code>trackIconOff</code>/<code>trackIconOn</code> or
            <code>thumbIconOff</code>/<code>thumbIconOn</code> for state-aware
            icon placement.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.icons}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use <code>size</code> to scale track and thumb dimensions.
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
            id="examples-intents"
            label="Intents"
            level={2}
          />
          <Heading level={4}>Intents</Heading>
          <p>
            Use <code>intent</code> to style the thumb while keeping a
            consistent track treatment.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.intents}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-states"
            label="States"
            level={2}
          />
          <Heading level={4}>States</Heading>
          <p>
            Use <code>checked</code>, <code>disabled</code>, and{' '}
            <code>readOnly</code> for interaction state handling.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.states}
        />
      </div>
    </div>
  );

  const quickStartSection = {
    content: quickStartContent,
    id: 'quick-start',
    intro:
      'Get a switch onto the page quickly, then expand into Field composition, validation, and icon/state patterns.',
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
      'Browse common switch patterns for production forms and settings screens.',
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
            { href: '/components/toggle-switch', label: 'ToggleSwitch' },
            { current: true, label: 'Docs' },
          ]}
        />
      }
      description="A theme-aware native switch with Field integration and state-aware icon support."
      eyebrow="ToggleSwitch"
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
