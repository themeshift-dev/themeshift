import { Heading } from '@themeshift/ui/components/Heading';

import styles from './AccessibilitySection.module.scss';

export const AccessibilitySection = () => {
  return (
    <section className={styles.playground}>
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Treat navbar layout helpers as structure and ensure semantic landmarks
        and interactive controls are still explicit.
      </p>

      <div className={styles.results}>
        <article className={styles.issue}>
          <strong>Label navigation landmarks</strong>
          <p>
            Provide an <code>aria-label</code> or <code>aria-labelledby</code>{' '}
            on the navbar root when multiple navigation regions exist.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Keep focus order predictable</strong>
          <p>
            Arrange links and buttons in DOM order that matches visual order to
            avoid confusing keyboard users.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Account for sticky and fixed navbars</strong>
          <p>
            Ensure skip links and in-page anchors account for top offsets so
            focused content is not hidden behind persistent navigation.
          </p>
        </article>
      </div>
    </section>
  );
};
