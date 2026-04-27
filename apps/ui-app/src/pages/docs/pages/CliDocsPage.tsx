import { Heading } from '@themeshift/ui/components/Heading';

import { TableOfContents } from '@/app/components';
import { StringCopier } from '@/pages/componentGuides/components';

import styles from '../DocsPage.module.scss';

const INSTALL_COMMAND = 'npm install --save-dev @themeshift/cli';
const BUILD_COMMAND = 'npx themeshift build';
const WATCH_COMMAND = 'npx themeshift watch';
const AUDIT_COMMAND = 'npx themeshift audit --target all';
const CONFIG_EXAMPLE = `import { defineConfig } from '@themeshift/core';

export default defineConfig({
  cssVarPrefix: 'themeshift',
  defaultTheme: 'light',
  extends: ['@themeshift/ui'],
});`;

export const CliDocsPage = () => {
  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>CLI</p>
      <Heading level={1}>@themeshift/cli</Heading>
      <p className={styles.lead}>
        <code>@themeshift/cli</code> is a thin command-line wrapper around
        <code> @themeshift/core</code>. Use it when you want token build/watch
        tooling without wiring Vite plugin hooks.
      </p>

      <section className={styles.section}>
        <TableOfContents.Marker id="install" label="Install" />
        <Heading level={2}>Install</Heading>
        <StringCopier string={INSTALL_COMMAND} />
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="commands" label="Commands" />
        <Heading level={2}>Commands</Heading>
        <p>The CLI currently supports three commands.</p>
        <div className={styles.subsection}>
          <Heading level={3}>Build once</Heading>
          <StringCopier string={BUILD_COMMAND} />
        </div>
        <div className={styles.subsection}>
          <Heading level={3}>Watch token changes</Heading>
          <StringCopier string={WATCH_COMMAND} />
        </div>
        <div className={styles.subsection}>
          <Heading level={3}>Audit token usage</Heading>
          <StringCopier string={AUDIT_COMMAND} />
        </div>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="flags" label="Flags" />
        <Heading level={2}>Flags</Heading>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Flag</th>
                <th scope="col">Applies to</th>
                <th scope="col">Description</th>
                <th scope="col">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <code>--config</code>
                </th>
                <td>
                  <code>build</code>, <code>watch</code>
                </td>
                <td>Use a specific ThemeShift config file path.</td>
                <td>
                  <code>themeshift build --config ./themeshift.config.ts</code>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <code>--target</code>
                </th>
                <td>
                  <code>audit</code>
                </td>
                <td>
                  Scan one workspace target (for example{' '}
                  <code>apps/ui-app</code>) or <code>all</code>.
                </td>
                <td>
                  <code>themeshift audit --target apps/ui-app</code>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <code>--cssVarPrefix</code>
                </th>
                <td>
                  <code>audit</code>
                </td>
                <td>Match CSS variable naming with your configured prefix.</td>
                <td>
                  <code>themeshift audit --target all --cssVarPrefix acme</code>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <code>--output</code>
                </th>
                <td>
                  <code>audit</code>
                </td>
                <td>Write audit CSV output to a custom file path.</td>
                <td>
                  <code>
                    themeshift audit --target all --output reports/tokens.csv
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="config-files" label="Config files" />
        <Heading level={2}>Config files</Heading>
        <p>
          When <code>--config</code> is omitted, the CLI looks for these files
          in your project root:
        </p>
        <ul>
          <li>
            <code>themeshift.config.ts</code>
          </li>
          <li>
            <code>themeshift.config.mts</code>
          </li>
          <li>
            <code>themeshift.config.cts</code>
          </li>
          <li>
            <code>themeshift.config.js</code>
          </li>
          <li>
            <code>themeshift.config.mjs</code>
          </li>
          <li>
            <code>themeshift.config.cjs</code>
          </li>
        </ul>
        <StringCopier language="typescript" string={CONFIG_EXAMPLE} />
      </section>
    </article>
  );
};
