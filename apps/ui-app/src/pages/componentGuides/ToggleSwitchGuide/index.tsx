import { Heading } from '@themeshift/ui/components/Heading';
import { IoHomeSharp } from 'react-icons/io5';
import type { ReactNode } from 'react';

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
        description="Start with a labelled switch, then layer in intent, descriptions, icons, and state props as needed."
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
          <code>ToggleSwitch</code> wraps a native <code>checkbox</code> input
          and adds switch semantics, label content, description and error text,
          thumb intents, and optional state icons.
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
            Use the <code>size</code> prop to scale the track, thumb, and
            iconography.
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
            Use the <code>intent</code> prop to change the thumb color while
            keeping the track neutral.
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
            id="examples-label-positions"
            label="Label positions"
            level={2}
          />
          <Heading level={4}>Label positions</Heading>
          <p>
            Use <code>labelPosition</code> to place content before or after the
            switch control.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.labelPositions}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-description"
            label="Description"
            level={2}
          />
          <Heading level={4}>Description</Heading>
          <p>
            Use <code>description</code> to add supporting guidance below the
            visible label when the switch needs a little more context.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.descriptions}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-error-message"
            label="Error message"
            level={2}
          />
          <Heading level={4}>Error message</Heading>
          <p>
            Use <code>errorMessage</code> alongside <code>aria-invalid</code>{' '}
            when the current selection needs validation feedback.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.errorMessages}
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
            Use <code>onCheckedChange</code> with <code>checked</code> when the
            switch state needs to drive other UI or stay in sync with external
            state.
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
            Use <code>iconOff</code> and <code>iconOn</code> to show state-aware
            icons inside the track. For icon-only usage, provide an accessible
            name with <code>aria-label</code> or <code>aria-labelledby</code>.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.icons}
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
            <code>readOnly</code> to communicate the current interaction mode of
            the switch.
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
      'Get a switch onto the page quickly, then expand into state, feedback, and icon patterns below.',
    title: 'Quick start',
  } satisfies ComponentGuideSection;

  const propsSection = {
    content: propsContent,
    id: 'props',
    intro:
      'Use the API reference for the exact prop names, state semantics, and customization hooks supported by ToggleSwitch.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse the most common switch patterns developers usually need in production: sizing, thumb intents, labels, supporting copy, icons, and state handling.',
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
      description="A theme-aware switch built on top of a native checkbox input."
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
