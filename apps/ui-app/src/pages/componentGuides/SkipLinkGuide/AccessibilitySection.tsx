import { Heading } from '@themeshift/ui/components/Heading';

import styles from './AccessibilitySection.module.scss';

export const AccessibilitySection = () => {
  return (
    <section className={styles.playground}>
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Skip links are a keyboard-first affordance. They should appear on focus
        and move users to a meaningful landmark.
      </p>

      <div className={styles.results}>
        <article className={styles.issue}>
          <strong>Target a real landmark</strong>
          <p>
            Point <code>href</code> to an existing element, commonly{' '}
            <code>#main-content</code> on the main region.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Place skip link early in the DOM</strong>
          <p>
            Render skip links before repeated navigation so they are available
            as soon as users begin tabbing.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Verify focus visibility</strong>
          <p>
            Confirm the focused skip link and destination region are both
            visible and easy to identify.
          </p>
        </article>
      </div>
    </section>
  );
};
