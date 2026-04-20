import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';

import { Link, TableOfContents } from '@/app/components';
import { StringCopier } from '@/pages/componentGuides/components';

import styles from './DocsHome.module.scss';

const UI_INSTALL_COMMAND = 'npm install @themeshift/ui react react-dom';

const UI_REQUIRED_STYLES_IMPORT = `import '@themeshift/ui/css/base.css';`;

const UI_OPTIONAL_STYLES_IMPORTS = `import '@themeshift/ui/css/tokens.css';
import '@themeshift/ui/css/fonts.css';`;

const VITE_PLUGIN_INSTALL_COMMAND =
  'npm install --save-dev @themeshift/vite-plugin-themeshift style-dictionary sass';

const VITE_PLUGIN_CONFIG_EXAMPLE = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { themeShift } from '@themeshift/vite-plugin-themeshift';

export default defineConfig({
  plugins: [
    react(),
    themeShift({
      extends: ['@themeshift/ui'],
      cssVarPrefix: 'themeshift',
    }),
  ],
});`;

export const DocsHome = () => {
  return (
    <TableOfContents.Root>
      <PageShell
        className={styles.container}
        aside={
          <aside className={styles.aside}>
            <div className={styles.asideInner}>
              <TableOfContents.Nav />
            </div>
          </aside>
        }
        asideLabel="On this page"
      >
        <main
          aria-label="ThemeShift documentation home"
          className={styles.main}
        >
          <p className={styles.eyebrow}>Docs</p>
          <Heading level={1}>ThemeShift Documentation</Heading>
          <p className={styles.lead}>
            ThemeShift is a React UI framework and component system built on
            design tokens. It gives teams production-ready components with
            accessibility behavior and LTR/RTL support built in, so teams can
            move fast without rewriting fundamentals later.
          </p>
          <p className={styles.lead}>
            Think of this page as your launch pad. Fewer setup mysteries, more
            shipping.
          </p>

          <section className={styles.section}>
            <TableOfContents.Marker
              id="install-ui"
              label="Install @themeshift/ui"
            />
            <Heading level={2}>
              Install <code>@themeshift/ui</code>
            </Heading>
            <p>
              Start with the UI package and React peer dependencies. For most
              apps, this is the only package you need to render ThemeShift
              components.
            </p>
            <StringCopier string={UI_INSTALL_COMMAND} />
            <p>
              Import base styles once in your app entry file. Base styles are
              required.
            </p>
            <StringCopier
              language="typescript"
              string={UI_REQUIRED_STYLES_IMPORT}
            />
            <p>
              Then add accessory styles for tokens and typography defaults as
              needed:
            </p>
            <StringCopier
              language="typescript"
              string={UI_OPTIONAL_STYLES_IMPORTS}
            />
            <p>
              Ready to browse what is available? Head to{' '}
              <Link to="/ui">the UI reference</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <TableOfContents.Marker
              id="install-vite-plugin"
              label="Install vite-plugin-themeshift"
            />
            <Heading level={2}>
              Install <code>@themeshift/vite-plugin-themeshift</code>
            </Heading>
            <p>
              Use the plugin when you want generated token outputs in your app
              and layered overrides on top of `@themeshift/ui` token defaults.
            </p>
            <StringCopier string={VITE_PLUGIN_INSTALL_COMMAND} />
            <p>
              Add the plugin to <code>vite.config.ts</code>:
            </p>
            <StringCopier
              language="typescript"
              string={VITE_PLUGIN_CONFIG_EXAMPLE}
            />

            <p>
              Full package docs and releases are published on{' '}
              <Link to="https://www.npmjs.com/package/@themeshift/vite-plugin-themeshift">
                npmjs.org
              </Link>
              .
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Option</th>
                    <th scope="col">What it controls</th>
                    <th scope="col">Typical value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <code>extends</code>
                    </th>
                    <td>Loads package token files before local app tokens.</td>
                    <td>
                      <code>['@themeshift/ui']</code>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>cssVarPrefix</code>
                    </th>
                    <td>Prefixes generated CSS variable names.</td>
                    <td>
                      <code>'themeshift'</code>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>defaultTheme</code>
                    </th>
                    <td>
                      Copies one theme into plain <code>:root</code> as
                      fallback.
                    </td>
                    <td>
                      <code>'light'</code>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>outputPrintTheme</code>
                    </th>
                    <td>Generates print-theme tokens when enabled.</td>
                    <td>
                      <code>true</code>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>reloadStrategy</code>
                    </th>
                    <td>
                      Controls token-change updates with HMR or full reload.
                    </td>
                    <td>
                      <code>'full'</code> (optional)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </PageShell>
    </TableOfContents.Root>
  );
};
