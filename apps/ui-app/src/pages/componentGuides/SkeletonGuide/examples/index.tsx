import { Skeleton } from '@themeshift/ui/components/Skeleton';

import styles from './SkeletonGuideExamples.module.scss';

export const basicUsage = {
  code: `<Skeleton height="1.25rem" width="12rem" />`,
  label: 'Basic usage',
  sample: (
    <div className={styles.sampleContainer}>
      <Skeleton height="1.25rem" width="12rem" />
    </div>
  ),
};

const avatar = {
  code: `<Skeleton.Avatar size="4rem" />`,
  label: 'Avatar',
  sample: <Skeleton.Avatar size="4rem" />,
};

export const text = {
  code: `<Skeleton.Text lines={4} lastLineWidth="60%" />`,
  label: 'Text',
  sample: (
    <div className={styles.sampleContainer}>
      <Skeleton.Text lines={4} lastLineWidth="60%" />
    </div>
  ),
};

const cardPulse = {
  code: `<article className="card" aria-busy={isLoading}>
  <Skeleton.Avatar size="4rem" />

  <div className="card-content">
    <Skeleton height="1.75rem" width="80%" />
    <Skeleton.Text lastLineWidth="40%" />
  </div>
</article>`,
  label: 'Card (pulse)',
  sample: (
    <article className={styles.card} aria-busy="true">
      <Skeleton.Avatar size="4rem" />

      <div className={styles.cardContent}>
        <Skeleton height="1.75rem" width="80%" />
        <Skeleton.Text lastLineWidth="40%" />
      </div>
    </article>
  ),
};

export const cardShimmer = {
  code: `<article className="card" aria-busy="true">
  <Skeleton.Avatar size="4rem" animation="shimmer" />

  <div className="card-content">
    <Skeleton height="1.75rem" width="80%" animation="shimmer" />
    <Skeleton.Text lastLineWidth="40%" animation="shimmer" />
  </div>
</article>`,
  label: 'Card (shimmer)',
  sample: (
    <article className={styles.card} aria-busy="true">
      <Skeleton.Avatar size="4rem" animation="shimmer" />

      <div className={styles.cardContent}>
        <Skeleton height="1.75rem" width="80%" animation="shimmer" />
        <Skeleton.Text lastLineWidth="40%" animation="shimmer" />
      </div>
    </article>
  ),
};

export const listRows = {
  code: `<ul aria-busy="true">
  <li className="row">
    <Skeleton.Avatar style={{ flexShrink: 0 }} />
    <Skeleton.Text lines={2} />
  </li>

  <li className="row">
    <Skeleton.Avatar style={{ flexShrink: 0 }} />
    <Skeleton.Text lines={2} />
  </li>
</ul>`,
  label: 'List rows',
  sample: (
    <ul aria-busy="true" className={styles.list}>
      {Array.from({ length: 3 }).map((_, index) => (
        <li className={styles.listRow} key={index}>
          <Skeleton.Avatar animation="shimmer" style={{ flexShrink: 0 }} />
          <div className={styles.listRowText}>
            <Skeleton height="1.25rem" width="60%" animation="shimmer" />
            <Skeleton height="1rem" width="90%" animation="shimmer" />
          </div>
        </li>
      ))}
    </ul>
  ),
};

export const rtlShimmer = {
  code: `<div dir="rtl">
  <Skeleton height="1.25rem" width="12rem" animation="shimmer" />
</div>`,
  label: 'RTL shimmer',
  sample: (
    <div className={styles.sampleContainer} dir="rtl">
      <Skeleton height="1.25rem" width="12rem" animation="shimmer" />
    </div>
  ),
};

export const propHighlights = [
  basicUsage,
  avatar,
  text,
  cardPulse,
  cardShimmer,
];
