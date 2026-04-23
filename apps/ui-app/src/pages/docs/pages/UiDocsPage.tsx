import { Heading } from '@themeshift/ui/components/Heading';

import { Link, TableOfContents } from '@/app/components';
import { StringCopier } from '@/pages/componentGuides/components';

import styles from '../DocsPage.module.scss';

const INSTALL_COMMAND = 'npm install @themeshift/ui react react-dom';
const REQUIRED_IMPORT = `import '@themeshift/ui/css/base.css';`;
const OPTIONAL_IMPORTS = `import '@themeshift/ui/css/fonts.css';
import '@themeshift/ui/css/tokens.css';`;
const THEME_SWITCH_SNIPPET = `useEffect(() => {
  document.documentElement.dataset.theme = 'dark';
}, []);`;
const TOKEN_OVERRIDE_EXAMPLE = `import { defineConfig } from 'vite';
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

export const UiDocsPage = () => {
  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>UI</p>
      <Heading level={1}>@themeshift/ui</Heading>
      <p className={styles.lead}>
        <code>@themeshift/ui</code> provides React components, hooks, templates,
        and shared CSS/token assets. Most teams start here.
      </p>

      <section className={styles.section}>
        <TableOfContents.Marker id="install" label="Install" />
        <Heading level={2}>Install</Heading>
        <div className={styles.subsection}>
          <Heading level={3}>Package install</Heading>
          <StringCopier string={INSTALL_COMMAND} />
        </div>
        <div className={styles.subsection}>
          <Heading level={3}>Required style import</Heading>
          <p>Import base styles once in your app entry.</p>
          <StringCopier language="typescript" string={REQUIRED_IMPORT} />
        </div>
        <div className={styles.subsection}>
          <Heading level={3}>Optional defaults</Heading>
          <p>Use package fonts/tokens if they match your app baseline.</p>
          <StringCopier language="typescript" string={OPTIONAL_IMPORTS} />
        </div>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="theming" label="Theming and data-theme" />
        <Heading level={2}>Theming and data-theme</Heading>
        <p>
          Set <code>data-theme</code> on the document root (
          <code>{'<html>'}</code>) so ThemeShift theme selectors match generated
          variables.
        </p>
        <StringCopier language="typescript" string={THEME_SWITCH_SNIPPET} />
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="token-overrides" label="Token overrides" />
        <Heading level={2}>Token overrides with Vite plugin</Heading>
        <p>
          Use <code>@themeshift/vite-plugin</code> to generate app-level token
          outputs while extending UI defaults.
        </p>
        <StringCopier language="typescript" string={TOKEN_OVERRIDE_EXAMPLE} />
        <p>
          See <Link to="/docs/vite-plugin">Vite Plugin docs</Link> for output
          controls and advanced options.
        </p>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="imports" label="Subpath imports" />
        <Heading level={2}>Subpath imports</Heading>
        <p>
          Import only what you use. ThemeShift UI exports per-component and
          per-hook entrypoints such as:
        </p>
        <ul>
          <li>
            <code>@themeshift/ui/components/Button</code>
          </li>
          <li>
            <code>@themeshift/ui/components/Navbar</code>
          </li>
          <li>
            <code>@themeshift/ui/hooks/useForm</code>
          </li>
          <li>
            <code>@themeshift/ui/templates/PageShell</code>
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker
          id="built-in-standards"
          label="Accessibility and directionality defaults"
        />
        <Heading level={2}>Accessibility and directionality defaults</Heading>
        <p>
          Components are built with accessibility and bidirectional support in
          mind by default. For details, see{' '}
          <Link to="/docs/accessibility">Accessibility</Link> and{' '}
          <Link to="/docs/bidirectional-support">Bidirectional Support</Link>.
        </p>
        <p>
          Ready to browse all component and hook guides? Visit{' '}
          <Link to="/ui">UI reference</Link>.
        </p>
      </section>
    </article>
  );
};
