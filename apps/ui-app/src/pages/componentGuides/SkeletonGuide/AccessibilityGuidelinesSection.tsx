import { Skeleton } from '@themeshift/ui/components/Skeleton';
import { Heading } from '@themeshift/ui/components/Heading';

import { TableOfContents } from '@/app/components';
import {
  ExampleViewer,
  type ExampleViewerExample,
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
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
      <TableOfContents.Marker id="accessibility" label="Accessibility" />
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Skeleton placeholders are decorative and hidden from assistive
        technology. Use real text and state attributes to communicate progress.
      </p>

      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <Heading level={4}>Announce loading state with real text</Heading>
            <p>
              Use <code>role=&quot;status&quot;</code> and/or{' '}
              <code>aria-busy</code> on the region that is loading. Skeletons
              themselves should stay silent.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={busyRegionExample} defaultCodeExpanded />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <Heading level={4}>Keep headings and landmarks stable</Heading>
            <p>
              Maintain structure while data loads so screen reader users do not
              lose context. Replace the body content with skeleton placeholders.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={keepStructureExample} defaultCodeExpanded />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    </section>
  );
};
