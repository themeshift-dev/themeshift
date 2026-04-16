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

import { AccessibilityGuidelinesSection } from './AccessibilityGuidelinesSection';
import styles from './SkeletonGuide.module.scss';
import * as examples from './examples';

const skeletonFallbackImport =
  "import { Skeleton } from '@themeshift/ui/components/Skeleton';";

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

export const SkeletonGuide = () => {
  const { component } = useComponentData('skeleton');

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
            string={component?.importString ?? skeletonFallbackImport}
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
        description="Start with placeholders that match the final layout so content can load without shifting."
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

  const propsSection = {
    content: (
      <ApiReference
        intro={
          <p className={styles.callout}>
            <code>Skeleton</code> renders a decorative placeholder block. Use it
            directly for custom shapes, then reach for{' '}
            <code>Skeleton.Text</code> and <code>Skeleton.Avatar</code> for
            common patterns.
          </p>
        }
        items={component?.apiReference ?? []}
      />
    ),
    id: 'props',
    intro:
      'Use the API reference when you need exact prop names, supported values, and default behavior across the base Skeleton and its subcomponents.',
    title: 'Props',
  } satisfies ComponentGuideSection;

  const examplesContent = (
    <div className={styles.examplesGrid}>
      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-text" label="Text" level={2} />
          <Heading level={4}>Text blocks</Heading>
          <p>
            Use <code>Skeleton.Text</code> to match paragraph rhythm. Tune{' '}
            <code>lines</code>, <code>lineHeight</code>, and{' '}
            <code>lastLineWidth</code> to mimic the final content.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.text}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-cards" label="Cards" level={2} />
          <Heading level={4}>Card layouts</Heading>
          <p>
            Combine base blocks with <code>Skeleton.Text</code> to keep cards
            stable while images and content stream in.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.cardShimmer}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-lists" label="Lists" level={2} />
          <Heading level={4}>List rows</Heading>
          <p>
            Reserve space for repeating content. Use consistent widths so rows
            align once content replaces placeholders.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.listRows}
        />
      </div>

      <div className={styles.exampleCard}>
        <div className={styles.exampleText}>
          <TableOfContents.Marker id="examples-rtl" label="RTL" level={2} />
          <Heading level={4}>RTL shimmer</Heading>
          <p>
            Shimmer direction adapts to the document direction. Set{' '}
            <code>dir</code> on a parent region when rendering RTL layouts.
          </p>
        </div>

        <ExampleViewer
          className={styles.exampleViewer}
          example={examples.rtlShimmer}
        />
      </div>
    </div>
  );

  const quickStartSection = {
    content: quickStartContent,
    id: 'quick-start',
    intro:
      'Add Skeleton, import it, then build placeholders that match your final layout.',
    title: 'Quick start',
  } satisfies ComponentGuideSection;

  const examplesSection = {
    content: examplesContent,
    id: 'examples',
    intro:
      'Browse Skeleton patterns for text, cards, lists, and direction-aware shimmer.',
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
            { href: '/components/skeleton', label: 'Skeleton' },
            { current: true, label: 'Docs' },
          ]}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Skeleton."
      eyebrow="Skeleton"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    >
      <AccessibilityGuidelinesSection />
    </ComponentGuide>
  );
};
