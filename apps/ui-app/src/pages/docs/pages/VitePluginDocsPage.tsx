import { Heading } from '@themeshift/ui/components/Heading';

import { Link, TableOfContents } from '@/app/components';
import { StringCopier } from '@/pages/componentGuides/components';

import styles from '../DocsPage.module.scss';

const INSTALL_COMMAND = 'npm install --save-dev @themeshift/vite-plugin sass';

const CONFIG_EXAMPLE = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { themeShift } from '@themeshift/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    themeShift({
      extends: ['@themeshift/ui'],
      cssVarPrefix: 'themeshift',
    }),
  ],
});`;

const IMPORT_TOKENS_CSS = `import './css/tokens.css';`;

const SASS_HELPER_EXAMPLE = `@use '@themeshift/vite-plugin/token' as themeShift;

.button {
  color: themeShift.token('components.button.light.intents.primary.fg');
}`;

const JS_HELPER_EXAMPLE = `import { token, tokenValue } from '@themeshift/vite-plugin/token';
import { tokenValues } from './design-tokens/token-values';

const cssVarValue = token('text.primary', { prefix: 'themeshift' });
const staticTokenValue = tokenValue('text.primary', { values: tokenValues });`;

export const VitePluginDocsPage = () => {
  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>Vite Plugin</p>
      <Heading level={1}>@themeshift/vite-plugin</Heading>
      <p className={styles.lead}>
        The Vite plugin is the fastest way to run ThemeShift token builds inside
        Vite. It wraps <code>@themeshift/core</code>, runs initial build output,
        and can watch token changes during dev.
      </p>

      <section className={styles.section}>
        <TableOfContents.Marker id="quick-start" label="Quick start" />
        <Heading level={2}>Quick start</Heading>
        <div className={styles.subsection}>
          <Heading level={3}>1. Install</Heading>
          <StringCopier string={INSTALL_COMMAND} />
        </div>
        <div className={styles.subsection}>
          <Heading level={3}>2. Configure Vite</Heading>
          <StringCopier language="typescript" string={CONFIG_EXAMPLE} />
        </div>
        <div className={styles.subsection}>
          <Heading level={3}>3. Import generated CSS</Heading>
          <StringCopier language="typescript" string={IMPORT_TOKENS_CSS} />
        </div>
        <div className={styles.subsection}>
          <Heading level={3}>Generated outputs</Heading>
          <ul>
            <li>
              <code>src/css/tokens.css</code>
            </li>
            <li>
              <code>src/sass/_tokens.static.scss</code>
            </li>
            <li>
              <code>src/design-tokens/token-paths.{`{json,ts}`}</code>
            </li>
            <li>
              <code>src/design-tokens/token-values.{`{json,ts}`}</code>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker
          id="overrides"
          label="Overrides and extending"
        />
        <Heading level={2}>Overrides and extending</Heading>
        <p>
          Use <code>extends</code> to pull tokens from installed packages before
          local app tokens. Local tokens still win.
        </p>
        <StringCopier
          language="typescript"
          string={`themeShift({\n  extends: ['@themeshift/ui'],\n  cssVarPrefix: 'themeshift',\n});`}
        />
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker
          id="helpers"
          label="Sass and JavaScript helpers"
        />
        <Heading level={2}>Sass and JavaScript helpers</Heading>
        <p>Use the published token helper module in Sass or JavaScript.</p>
        <div className={styles.subsection}>
          <Heading level={3}>Sass helper</Heading>
          <StringCopier language="css" string={SASS_HELPER_EXAMPLE} />
        </div>
        <div className={styles.subsection}>
          <Heading level={3}>JavaScript helpers</Heading>
          <StringCopier language="typescript" string={JS_HELPER_EXAMPLE} />
        </div>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="options" label="Plugin options" />
        <Heading level={2}>Plugin options</Heading>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Option</th>
                <th scope="col">Type</th>
                <th scope="col">Default</th>
                <th scope="col">What it controls</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <code>tokensGlob</code>
                </th>
                <td>
                  <code>string</code>
                </td>
                <td>
                  <code>'tokens/**/*.json'</code>
                </td>
                <td>Token file matching pattern.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>tokensDir</code>
                </th>
                <td>
                  <code>string</code>
                </td>
                <td>
                  <code>'tokens'</code>
                </td>
                <td>Local token root watched in serve mode.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>extends</code>
                </th>
                <td>
                  <code>ThemeShiftExtendSource[]</code>
                </td>
                <td>
                  <code>[]</code>
                </td>
                <td>
                  Pulls tokens from packages (for example{' '}
                  <code>@themeshift/ui</code>) before local files.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <code>cssVarPrefix</code>
                </th>
                <td>
                  <code>string | undefined</code>
                </td>
                <td>
                  <code>undefined</code>
                </td>
                <td>Prefixes generated CSS variables.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>groups</code>
                </th>
                <td>
                  <code>ThemeShiftCssGroup[]</code>
                </td>
                <td>
                  <code>undefined</code>
                </td>
                <td>Custom comment grouping in generated CSS token output.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>defaultTheme</code>
                </th>
                <td>
                  <code>'light' | 'dark'</code>
                </td>
                <td>
                  <code>undefined</code>
                </td>
                <td>
                  Copies one theme into plain <code>:root</code> fallback
                  values.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <code>outputPrintTheme</code>
                </th>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Emits print theme token output.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>outputComments</code>
                </th>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>true</code>
                </td>
                <td>
                  Includes token descriptions/comments in generated files.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <code>watch</code>
                </th>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>true</code>
                </td>
                <td>Enables token watch mode in Vite dev server.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>injectSassTokenFn</code>
                </th>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>true</code>
                </td>
                <td>
                  Injects global Sass <code>token()</code> helper data.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <code>platforms</code>
                </th>
                <td>
                  <code>Array&lt;'css' | 'scss' | 'meta'&gt;</code>
                </td>
                <td>
                  <code>['css', 'scss', 'meta']</code>
                </td>
                <td>Controls which output platforms are generated.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>filters</code>
                </th>
                <td>
                  <code>
                    Partial&lt;Record&lt;ThemeShiftPlatform,
                    ThemeShiftTokenFilter&gt;&gt;
                  </code>
                </td>
                <td>
                  <code>undefined</code>
                </td>
                <td>Include/exclude token groups per output platform.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>reloadStrategy</code>
                </th>
                <td>
                  <code>'hmr' | 'full'</code>
                </td>
                <td>
                  <code>'hmr'</code>
                </td>
                <td>
                  Uses CSS HMR updates or full reload after token changes.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <code>log</code>
                </th>
                <td>
                  <code>{`{ warnings, verbosity, errors }`}</code>
                </td>
                <td>
                  <code>{`{ warnings: 'disabled', verbosity: 'silent' }`}</code>
                </td>
                <td>
                  Controls Style Dictionary logging and error reporting style.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="pitfalls" label="Common setup pitfalls" />
        <Heading level={2}>Common setup pitfalls</Heading>
        <ul>
          <li>
            Set <code>data-theme</code> on <code>{'<html>'}</code>, not a nested
            app container.
          </li>
          <li>
            Do not edit generated files directly; update tokens/config and
            rebuild.
          </li>
          <li>
            If using custom CSS variable prefixes, use the same prefix in Sass
            and JS helper calls.
          </li>
        </ul>
        <p>
          For non-Vite workflows, use <Link to="/docs/cli">CLI</Link> or{' '}
          <Link to="/docs/core">Core</Link>.
        </p>
      </section>
    </article>
  );
};
