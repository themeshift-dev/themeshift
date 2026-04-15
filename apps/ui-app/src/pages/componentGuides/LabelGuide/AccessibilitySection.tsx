import { Heading } from '@themeshift/ui/components/Heading';

import styles from './AccessibilitySection.module.scss';

export const AccessibilitySection = () => {
  return (
    <section className={styles.playground}>
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Every form control should have a clear programmatic label, whether
        visible or visually hidden.
      </p>

      <div className={styles.results}>
        <article className={styles.issue}>
          <strong>Always connect label and control</strong>
          <p>
            Use <code>htmlFor</code> with a matching input <code>id</code>, or
            wrap the control directly inside <code>Label</code>.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Keep labels persistent</strong>
          <p>
            Placeholder text is not a replacement for a label and should not be
            the only way users identify a field.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Keep required messaging consistent</strong>
          <p>
            If you add visual required markers, ensure required state is also
            represented in control semantics.
          </p>
        </article>
      </div>
    </section>
  );
};
