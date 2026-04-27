import { Heading } from '@themeshift/ui/components/Heading';

import { Link, TableOfContents } from '@/app/components';

import styles from '../DocsPage.module.scss';

export const AccessibilityDocsPage = () => {
  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>Accessibility</p>
      <Heading level={1}>Accessibility Practices</Heading>
      <p className={styles.lead}>
        ThemeShift UI treats accessibility as part of component behavior, not
        optional polish. The package and docs workflows both include
        accessibility checks.
      </p>

      <section className={styles.section}>
        <TableOfContents.Marker id="unit-tests" label="Unit test coverage" />
        <Heading level={2}>Unit test coverage with jest-axe</Heading>
        <p>
          UI components and templates include representative a11y tests using{' '}
          <code>jest-axe</code> with <code>toHaveNoViolations()</code>{' '}
          assertions. This validates baseline semantics, labeling, and
          structural behavior in automated CI.
        </p>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="guide-docs" label="Guide documentation" />
        <Heading level={2}>Accessibility guidance in component docs</Heading>
        <p>
          Component guides in this docs app include dedicated accessibility
          sections covering keyboard interactions, landmark usage, labeling,
          state announcements, and focus behavior. These notes are maintained as
          part of each guide instead of isolated in one reference page.
        </p>
        <p>
          Browse component guides in the <Link to="/ui">UI reference</Link> to
          see per-component accessibility patterns.
        </p>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="sandbox" label="Sandbox scanning" />
        <Heading level={2}>Real-time sandbox scanning</Heading>
        <p>
          ThemeShift docs sandbox/playground pages run live accessibility scans
          while examples are rendered. This gives teams fast feedback during
          customization and integration, without waiting for a separate QA step.
        </p>
        <div className={styles.callout}>
          <p>
            Sandbox scanning is intended to catch common issues early, but it
            does not replace manual testing with assistive technologies.
          </p>
        </div>
      </section>
    </article>
  );
};
