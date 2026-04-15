import { Heading } from '@themeshift/ui/components/Heading';

import styles from './AccessibilitySection.module.scss';

export const AccessibilitySection = () => {
  return (
    <section className={styles.playground}>
      <Heading level={3}>Accessibility</Heading>

      <p className={styles.note}>
        Use concise, actionable language and keep error text programmatically
        associated with the related control.
      </p>

      <div className={styles.results}>
        <article className={styles.issue}>
          <strong>Associate errors with controls</strong>
          <p>
            Use matching <code>id</code> and <code>aria-describedby</code> so
            assistive tech reads the error when focus lands on the input.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Use live-region behavior intentionally</strong>
          <p>
            <code>ErrorMessage</code> defaults to <code>role="alert"</code>.
            Change the role only when less assertive announcements are needed.
          </p>
        </article>

        <article className={styles.issue}>
          <strong>Pair with visual state</strong>
          <p>
            Keep border, icon, or helper text states aligned with the announced
            error so sighted and non-sighted users receive the same signal.
          </p>
        </article>
      </div>
    </section>
  );
};
