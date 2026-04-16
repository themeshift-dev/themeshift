import { Skeleton } from '@themeshift/ui/components/Skeleton';
import { Heading } from '@themeshift/ui/components/Heading';

import { TableOfContents } from '@/app/components';
import {
  ExampleViewer,
  type ExampleViewerExample,
} from '@/pages/componentGuides/components';

import styles from './AccessibilityGuidelinesSection.module.scss';

const busyRegionExample = {
  code: `<section aria-busy="true">
  <p className="visually-hidden" role="status">
    Loading profile
  </p>

  <div className="row">
    <Skeleton.Avatar />
    <div className="text">
      <Skeleton height="1.25rem" width="12rem" />
      <Skeleton width="18rem" />
    </div>
  </div>
</section>`,
  label: 'Busy region announcement',
  sample: (
    <section aria-busy="true">
      <p className={styles.visuallyHidden} role="status">
        Loading profile
      </p>

      <div className={styles.loadingRow}>
        <Skeleton.Avatar />
        <div className={styles.loadingText}>
          <Skeleton height="1.25rem" width="12rem" />
          <Skeleton width="18rem" />
        </div>
      </div>
    </section>
  ),
} satisfies ExampleViewerExample;

const keepStructureExample = {
  code: `<article aria-busy="true">
  <h3>Customer summary</h3>
  <Skeleton.Text />
</article>`,
  label: 'Keep structure while loading',
  sample: (
    <article aria-busy="true">
      <Heading level={4}>Customer summary</Heading>
      <Skeleton.Text />
    </article>
  ),
} satisfies ExampleViewerExample;

export const AccessibilityGuidelinesSection = () => {
  return (
    <section className={styles.section}>
      <TableOfContents.Marker
        id="accessibility-guidelines"
        label="Accessibility guidelines"
      />
      <Heading level={3}>Accessibility guidelines</Heading>

      <p className={styles.note}>
        Skeleton placeholders are decorative and hidden from assistive
        technology. Use real text and state attributes to communicate progress.
      </p>

      <div className={styles.guidelines}>
        <article className={styles.guideline}>
          <strong>Announce loading state with real text</strong>
          <p>
            Use <code>role=&quot;status&quot;</code> and/or{' '}
            <code>aria-busy</code> on the region that is loading. Skeletons
            themselves should stay silent.
          </p>
          <ExampleViewer
            className={styles.exampleViewer}
            example={busyRegionExample}
          />
        </article>

        <article className={styles.guideline}>
          <strong>Keep headings and landmarks stable</strong>
          <p>
            Maintain structure while data loads so screen reader users do not
            lose context. Replace the body content with skeleton placeholders.
          </p>
          <ExampleViewer
            className={styles.exampleViewer}
            example={keepStructureExample}
          />
        </article>
      </div>
    </section>
  );
};
