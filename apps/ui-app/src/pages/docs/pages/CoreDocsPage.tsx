import { Heading } from '@themeshift/ui/components/Heading';

import { Link, TableOfContents } from '@/app/components';
import { StringCopier } from '@/pages/componentGuides/components';

import styles from '../DocsPage.module.scss';

const API_IMPORT = `import {
  auditTokens,
  buildTokens,
  defineConfig,
  watchTokens,
} from '@themeshift/core';`;

const BUILD_EXAMPLE = `import { buildTokens, defineConfig } from '@themeshift/core';

const config = defineConfig({
  cssVarPrefix: 'themeshift',
  extends: ['@themeshift/ui'],
});

await buildTokens({
  ...config,
  root: process.cwd(),
});`;

export const CoreDocsPage = () => {
  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>Core</p>
      <Heading level={1}>@themeshift/core</Heading>
      <p className={styles.lead}>
        <code>@themeshift/core</code> is the framework-agnostic token engine. It
        resolves token sources, builds outputs, watches token roots, and powers
        auditing.
      </p>

      <section className={styles.section}>
        <TableOfContents.Marker id="who-core-is-for" label="Who Core is for" />
        <Heading level={2}>Who Core is for</Heading>
        <p>
          Use Core if you are building tooling integrations, custom pipelines,
          or wrappers around ThemeShift behavior.
        </p>
        <p>
          If you are building a typical app, start with{' '}
          <Link to="/docs/vite-plugin">Vite Plugin</Link> or{' '}
          <Link to="/docs/cli">CLI</Link> instead.
        </p>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="public-api" label="Public API" />
        <Heading level={2}>Public API</Heading>
        <StringCopier language="typescript" string={API_IMPORT} />
        <ul>
          <li>
            <code>defineConfig(config)</code>: typed helper for ThemeShift
            config objects.
          </li>
          <li>
            <code>buildTokens(options?)</code>: one-shot token output build.
          </li>
          <li>
            <code>watchTokens(options?)</code>: file watcher with rebuild hooks.
          </li>
          <li>
            <code>auditTokens(options?)</code>: token usage CSV audit.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker
          id="integration-example"
          label="Integration example"
        />
        <Heading level={2}>Integration example</Heading>
        <p>
          Minimal Node integration when building your own wrapper around
          ThemeShift:
        </p>
        <StringCopier language="typescript" string={BUILD_EXAMPLE} />
      </section>
    </article>
  );
};
