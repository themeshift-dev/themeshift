import { Heading } from '@themeshift/ui/components/Heading';

import styles from './AccessibilitySection.module.scss';

export const AccessibilitySection = () => {
  return (
    <section className={styles.playground}>
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Hidden responsive content is removed from assistive technology when
        display is none, so avoid duplicating critical controls across regions.
      </p>

      <div className={styles.results}>
        <article className={styles.issue}>
          <strong>Avoid duplicated interactive targets</strong>
          <p>
            If mobile and desktop variants both contain controls, ensure only
            one variant is visible at a time for each breakpoint.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Keep IDs unique across variants</strong>
          <p>
            Duplicated IDs can happen when rendering multiple breakpoint
            variants. Use unique IDs or avoid duplicate landmark IDs.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Test at each breakpoint</strong>
          <p>
            Keyboard and screen reader behavior can differ once layout changes,
            so validate focus and announcement flow at mobile, tablet, and
            desktop widths.
          </p>
        </article>
      </div>
    </section>
  );
};
