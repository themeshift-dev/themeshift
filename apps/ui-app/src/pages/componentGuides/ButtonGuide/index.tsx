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
import styles from './ButtonGuide.module.scss';
import * as examples from './examples';

const buttonFallbackImport =
  "import { Button } from '@themeshift/ui/components/Button';";

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
    <Heading level={4} className={styles.stepHeading}>
      {title}
    </Heading>
    <p className={styles.stepText}>{description}</p>
    {children}
  </div>
);

export const ButtonGuide = () => {
  const { component } = useComponentData('button');

  const intro = (
    <section className={styles.introSection}>
      <ExampleViewer
        examples={examples.propHighlights}
        className={styles.exampleViewer}
      />
    </section>
  );

  const howToUseContent = (
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
          description="Pull in the component directly from the UI package."
          number="2."
          title="Import"
        >
          <StringCopier
            language="jsx"
            string={component?.importString ?? buttonFallbackImport}
          />
        </StepCard>
      </div>

      <StepCard
        description="Start with the default button, then layer on intent, size, and state props as needed."
        number="3."
        title="Use"
      >
        <ExampleViewer
          example={examples.basicUsage}
          className={styles.stepExampleViewer}
        />
      </StepCard>
    </div>
  );

  const propsContent = (
    <ApiReference
      intro={
        <p className={styles.callout}>
          <code>Button</code> extends the native <code>button</code> element and
          adds extra props for appearance, icon support, loading states, and
          composition.
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
            Use the <code>size</code> prop to change the size of the button.
          </p>
        </div>

        <ExampleViewer
          example={examples.sizes}
          className={styles.exampleViewer}
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
            Use the <code>intent</code> prop to render a variant appearance.
          </p>
        </div>

        <ExampleViewer
          example={examples.intents}
          className={styles.exampleViewer}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-icon-only"
            label="Icon only"
            level={2}
          />
          <Heading level={4}>Icons</Heading>
          <p>
            Use the <code>icon</code> prop to render an icon-only button. Pair
            it with <code>aria-label</code> or <code>aria-labelledby</code> so
            screen readers still announce a useful name.
          </p>
          <p>
            Use <code>startIcon</code> or <code>endIcon</code> to place an icon
            next to button text.
          </p>
        </div>

        <ExampleViewer
          example={examples.icons}
          className={styles.exampleViewer}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-busy" label="Busy" level={2} />
          <Heading level={4}>Busy</Heading>
          <p>
            Use the <code>isBusy</code> flag to render a spinner inside the
            button and communicate work in progress. This also applies{' '}
            <code>aria-busy</code> for assistive tech.
          </p>
        </div>

        <ExampleViewer
          example={examples.busy}
          className={styles.exampleViewer}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker
            id="examples-as-child"
            label="As Child"
            level={2}
          />
          <Heading level={4}>As Child</Heading>
          <p>
            Use the <code>asChild</code> prop to render a child element as a
            button. This works well when you need a link, badge or other
            primitive to inherit button styling and behavior.
          </p>
        </div>
        <ExampleViewer
          example={examples.asChild}
          className={styles.exampleViewer}
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
            Use the <code>className</code> prop to apply extra class names to
            the button element when you need local styling tweaks.
          </p>
        </div>
        <ExampleViewer
          example={examples.extraClassName}
          className={styles.exampleViewer}
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
            Use <code>disabled</code> to prevent clicks and remove the button
            from normal keyboard interaction.
          </p>
          <p>
            Use <code>visuallyDisabled</code> when the button should look
            unavailable but still needs to receive events so you can explain why
            the action is blocked.
          </p>
        </div>
        <ExampleViewer
          example={examples.disabled}
          className={styles.exampleViewer}
        />
      </div>
    </div>
  );

  const howToUseSection = {
    content: howToUseContent,
    id: 'how-to-use',
    intro:
      'Get a button onto the page fast, then branch out into the variants and patterns below.',
    title: 'How to use',
  } satisfies ComponentGuideSection;

  const propsGuideSection = {
    content: propsContent,
    id: 'props',
    intro:
      'Use the API reference when you need exact prop names, supported values, and default behavior.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse the common patterns developers usually need in production. Copy and paste what you need to get going quickly.',
    title: 'Examples',
  } satisfies ComponentGuideSection;

  return (
    <TableOfContents.Root>
      <TableOfContents.Marker id="intro" label="Intro" />

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
              { href: '/components/button', label: 'Button' },
              { current: true, label: 'Docs' },
            ]}
          />
        }
        description="Implementation guidance, API details, and copy-paste examples for building with Button."
        eyebrow="Button"
        examples={examplesSection}
        howToUse={howToUseSection}
        intro={intro}
        propsSection={propsGuideSection}
        toc={<TableOfContents.Nav />}
        title="Docs"
      >
        <TableOfContents.Marker id="accessibility" label="Accessibility" />
        <section>
          <AccessibilitySection />
        </section>
      </ComponentGuide>
    </TableOfContents.Root>
  );
};
