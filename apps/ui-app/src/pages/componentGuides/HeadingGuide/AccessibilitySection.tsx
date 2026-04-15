import { Heading } from '@themeshift/ui/components/Heading';

import styles from './AccessibilitySection.module.scss';

export const AccessibilitySection = () => {
  return (
    <section className={styles.playground}>
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Preserve a logical heading outline so keyboard and screen reader users
        can navigate content quickly.
      </p>

      <div className={styles.results}>
        <article className={styles.issue}>
          <strong>Use levels in order</strong>
          <p>
            Avoid skipping from <code>h1</code> to <code>h4</code> unless there
            is a real nested structure that justifies it.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Keep text meaningful</strong>
          <p>
            Write heading copy that describes the section purpose, not only
            styling intent.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Do not use heading for body text</strong>
          <p>
            Reserve <code>Heading</code> for document structure and use text
            primitives for non-structural content.
          </p>
        </article>
      </div>
    </section>
  );
};
