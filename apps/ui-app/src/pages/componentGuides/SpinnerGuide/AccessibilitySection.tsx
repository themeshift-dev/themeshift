import { Heading } from '@themeshift/ui/components/Heading';

import styles from './AccessibilitySection.module.scss';

export const AccessibilitySection = () => {
  return (
    <section className={styles.playground}>
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Loading indicators should communicate both visual progress and semantic
        busy state to assistive technologies.
      </p>

      <div className={styles.results}>
        <article className={styles.issue}>
          <strong>Provide an accessible name when needed</strong>
          <p>
            Use <code>aria-label</code> when spinner is standalone. If a nearby
            label already describes loading, set <code>aria-hidden</code>.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Expose busy state on containers</strong>
          <p>
            Pair spinner visuals with <code>aria-busy</code> on relevant regions
            or controls so screen readers receive state updates.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Keep contrast and motion considerate</strong>
          <p>
            Ensure spinner color is visible on its background and avoid using
            spinner-only feedback for long-running tasks.
          </p>
        </article>
      </div>
    </section>
  );
};
