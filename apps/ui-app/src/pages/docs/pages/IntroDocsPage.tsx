import { Heading } from '@themeshift/ui/components/Heading';

import { Link, TableOfContents } from '@/app/components';
import { StringCopier } from '@/pages/componentGuides/components';

import styles from '../DocsPage.module.scss';

const UI_INSTALL_COMMAND = 'npm install @themeshift/ui react react-dom';
const VITE_PLUGIN_INSTALL_COMMAND =
  'npm install --save-dev @themeshift/vite-plugin sass';

export const IntroDocsPage = () => {
  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>Docs</p>
      <Heading level={1}>ThemeShift Ecosystem</Heading>
      <p className={styles.lead}>
        ThemeShift is a token-driven UI ecosystem: <code>@themeshift/core</code>{' '}
        powers token builds, <code>@themeshift/cli</code> runs the engine from
        the command line, <code>@themeshift/vite-plugin</code> connects the
        engine to Vite apps, and <code>@themeshift/ui</code> ships React
        components built on the same token model.
      </p>
      <p className={styles.lead}>
        The packages are designed to work together, but you can adopt them in
        stages.
      </p>

      <section className={styles.section}>
        <TableOfContents.Marker id="ecosystem-map" label="Ecosystem map" />
        <Heading level={2}>Ecosystem map</Heading>
        <ul>
          <li>
            <code>@themeshift/ui</code>: React components, hooks, templates, and
            default CSS/token assets.
          </li>
          <li>
            <code>@themeshift/vite-plugin</code>: token build/watch integration
            for Vite projects, including Sass and JS token helpers.
          </li>
          <li>
            <code>@themeshift/cli</code>: package-agnostic token commands for
            build/watch/audit workflows.
          </li>
          <li>
            <code>@themeshift/core</code>: framework-agnostic engine behind the
            CLI and Vite plugin.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="start-here" label="Start here" />
        <Heading level={2}>Start here</Heading>
        <p>Choose your entry point based on what you are building right now.</p>

        <div className={styles.subsection}>
          <Heading level={3}>
            I just need production-ready React components
          </Heading>
          <StringCopier string={UI_INSTALL_COMMAND} />
          <p>
            Start with <Link to="/docs/ui">UI docs</Link>. Add token overrides
            later with the Vite plugin if needed.
          </p>
        </div>

        <div className={styles.subsection}>
          <Heading level={3}>I need custom token outputs for my app</Heading>
          <StringCopier string={VITE_PLUGIN_INSTALL_COMMAND} />
          <p>
            Start with <Link to="/docs/vite-plugin">Vite Plugin docs</Link>. Use{' '}
            <code>extends: ['@themeshift/ui']</code> to layer app tokens over UI
            defaults.
          </p>
        </div>

        <div className={styles.subsection}>
          <Heading level={3}>I need token tooling outside Vite</Heading>
          <p>
            Start with <Link to="/docs/cli">CLI docs</Link>. If you are building
            custom integrations, use <Link to="/docs/core">Core docs</Link>.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <TableOfContents.Marker id="what-to-expect" label="What to expect" />
        <Heading level={2}>What to expect</Heading>
        <ul>
          <li>
            Token-first theming with generated CSS variables and Sass/JS token
            access.
          </li>
          <li>
            Accessibility and bidirectional layout support as first-class
            defaults in <code>@themeshift/ui</code>.
          </li>
          <li>
            A monorepo workflow where UI, plugin, core, and docs evolve
            together.
          </li>
        </ul>

        <div className={styles.callout}>
          <p>
            Need package-level release details? Check npm pages for{' '}
            <Link to="https://www.npmjs.com/package/@themeshift/ui">UI</Link>,{' '}
            <Link to="https://www.npmjs.com/package/@themeshift/vite-plugin">
              Vite Plugin
            </Link>
            ,{' '}
            <Link to="https://www.npmjs.com/package/@themeshift/core">
              Core
            </Link>
            , and{' '}
            <Link to="https://www.npmjs.com/package/@themeshift/cli">CLI</Link>.
          </p>
        </div>
      </section>
    </article>
  );
};
