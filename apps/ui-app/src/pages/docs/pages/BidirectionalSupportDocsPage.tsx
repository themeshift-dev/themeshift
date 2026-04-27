import { Heading } from '@themeshift/ui/components/Heading';

import { Link, TableOfContents } from '@/app/components';

import styles from '../DocsPage.module.scss';

export const BidirectionalSupportDocsPage = () => {
  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>Bidirectional Support</p>
      <Heading level={1}>Bidirectional Support (LTR/RTL)</Heading>
      <p className={styles.lead}>
        Direction-aware behavior should work out of the box with{' '}
        <code>@themeshift/ui</code>. In most cases, LTR/RTL support should just
        work when your document or container <code>dir</code> is set correctly.
      </p>

      <section className={styles.section}>
        <TableOfContents.Marker id="defaults" label="Out-of-the-box behavior" />
        <Heading level={2}>Out-of-the-box behavior</Heading>
        <p>
          Components account for directionality in layout, alignment, and
          interactive motion patterns where relevant. You should not need custom
          RTL forks for standard ThemeShift usage.
        </p>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="coverage" label="Test and docs coverage" />
        <Heading level={2}>Test and docs coverage</Heading>
        <p>
          Directionality behavior is validated in UI package unit tests and
          demonstrated in docs examples. Many component guide examples include
          side-by-side <code>dir="ltr"</code> and <code>dir="rtl"</code> states
          so teams can verify behavior during adoption.
        </p>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="usage" label="Usage guidance" />
        <Heading level={2}>Usage guidance</Heading>
        <ul>
          <li>
            Set <code>dir</code> at the document level when your entire app is
            one direction.
          </li>
          <li>
            Set <code>dir</code> on local containers when embedding
            bidirectional regions in mixed-layout views.
          </li>
          <li>
            Keep alignment-sensitive custom CSS direction-aware to match
            component behavior.
          </li>
        </ul>
        <p>
          For concrete examples, review the component guides in{' '}
          <Link to="/ui">UI reference</Link>.
        </p>
      </section>
    </article>
  );
};
