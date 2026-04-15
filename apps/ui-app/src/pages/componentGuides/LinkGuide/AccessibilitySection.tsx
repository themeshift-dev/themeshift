import { Heading } from '@themeshift/ui/components/Heading';

import styles from './AccessibilitySection.module.scss';

export const AccessibilitySection = () => {
  return (
    <section className={styles.playground}>
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Link text should communicate destination or outcome without relying on
        nearby visual context.
      </p>

      <div className={styles.results}>
        <article className={styles.issue}>
          <strong>Use descriptive link labels</strong>
          <p>
            Avoid vague text like "click here." Prefer labels such as "Read API
            docs" or "Open billing settings".
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Handle new tabs safely</strong>
          <p>
            For <code>target="_blank"</code>, include{' '}
            <code>rel="noreferrer noopener"</code> and consider communicating
            that a new tab opens.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Use links only for navigation</strong>
          <p>
            Use <code>Button</code> for in-place actions and <code>Link</code>{' '}
            for navigation between pages or locations.
          </p>
        </article>
      </div>
    </section>
  );
};
