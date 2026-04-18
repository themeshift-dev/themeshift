import { Badge } from '@themeshift/ui/components/Badge';
import { Button } from '@themeshift/ui/components/Button';
import { Heading } from '@themeshift/ui/components/Heading';
import { type ElementType, type ReactNode } from 'react';
import {
  FaBookOpen,
  FaCode,
  FaGlobe,
  FaGithub,
  FaRegCheckCircle,
  FaStar,
  FaTree,
} from 'react-icons/fa';
import { IoAccessibility } from 'react-icons/io5';
import { NavLink } from 'react-router';

import { useApiReference } from '@/apiReference';

import styles from './Landing.module.scss';
import { COMPONENT_PREVIEWS } from './examples/componentPreviews';

const PRIMARY_DOCS_ROUTE = '/ui';
const TOKENS_ROUTE = '/design-tokens';

const GITHUB_REPO_URL = 'https://github.com/themeshift-dev/themeshift';
const GITHUB_CONTRIBUTING_URL =
  'https://github.com/themeshift-dev/themeshift/pulls';
const GITHUB_ISSUES_URL = 'https://github.com/themeshift-dev/themeshift/issues';

type FeatureCard = {
  body: string;
  icon: ReactNode;
  title: string;
};

type WhyItem = {
  body: string;
  title: string;
};

const WHY_ITEMS: WhyItem[] = [
  {
    body: 'Release inclusive UI by default with keyboard and semantic behavior already handled.',
    title: 'Accessibility That Ships',
  },
  {
    body: 'Support LTR and RTL from the same component APIs, so localization does not trigger layout rewrites.',
    title: 'Global Without Rework',
  },
  {
    body: 'Get practical examples and API guidance that answer implementation questions fast.',
    title: 'Docs Built for Delivery',
  },
];

const ACCESSIBILITY_BULLETS = [
  'Keyboard navigation and focus management are built into core behaviors.',
  'ARIA usage guidance is documented where components are implemented.',
  'Patterns are validated with representative accessibility tests in-repo.',
  'Teams can move quickly without treating accessibility as follow-up work.',
];

const CORE_FEATURES: FeatureCard[] = [
  {
    body: 'Patterns prioritize keyboard support, semantic structure, and practical accessibility defaults.',
    icon: <IoAccessibility aria-hidden />,
    title: 'Accessibility-First Components',
  },
  {
    body: 'Use the same component APIs across left-to-right and right-to-left interfaces without rebuilding layouts.',
    icon: <FaGlobe aria-hidden />,
    title: 'LTR + RTL Support',
  },
  {
    body: 'Component guides combine examples, API references, and usage guidance that hold up in production work.',
    icon: <FaBookOpen aria-hidden />,
    title: 'Documentation That Delivers',
  },
];

const FOUNDATION_FEATURES: FeatureCard[] = [
  {
    body: 'Typed component and hook APIs designed for TypeScript-first React apps.',
    icon: <FaCode aria-hidden />,
    title: 'Type-Safe',
  },
  {
    body: 'Import only what you need with per-component and per-hook entrypoints.',
    icon: <FaTree aria-hidden />,
    title: 'Tree-Shakable',
  },
  {
    body: 'MIT licensed and built in public with contribution-friendly workflows.',
    icon: <FaGithub aria-hidden />,
    title: 'Open Source',
  },
];

type OssAction = {
  href: string;
  icon: ElementType;
  label: string;
};

const TRUST_SIGNALS = [
  '{componentsCount} production-ready components (and growing)',
  '{hooksCount} reusable hooks',
  'MIT licensed and free to use',
  'Actively developed in public—issues and PRs welcome',
];

const OSS_ACTIONS: OssAction[] = [
  {
    href: `${GITHUB_REPO_URL}/stargazers`,
    icon: FaStar,
    label: 'Give us a star',
  },
  {
    href: GITHUB_CONTRIBUTING_URL,
    icon: FaCode,
    label: 'Contribute',
  },
  {
    href: GITHUB_ISSUES_URL,
    icon: FaRegCheckCircle,
    label: 'Open an issue',
  },
];

export const Landing = () => {
  const { components, hooks } = useApiReference();
  const trustSignals = TRUST_SIGNALS.map((signal) =>
    signal
      .replace('{componentsCount}', String(components.length))
      .replace('{hooksCount}', String(hooks.length))
  );

  return (
    <main aria-label="ThemeShift UI home" className={styles.main}>
      <section aria-labelledby="landing-hero-title" className={styles.hero}>
        <p className={styles.eyebrow}>ThemeShift UI</p>
        <Heading className={styles.heroTitle} level={1}>
          Ship accessible, global-ready React apps from day one.
        </Heading>
        <p className={styles.heroLead}>
          Production-ready components with accessibility built in.
          <br />
          First-class LTR/RTL support. Docs that hold up under real delivery
          pressure.
        </p>

        <div className={styles.heroActions}>
          <Button size="large" asChild>
            <NavLink to={PRIMARY_DOCS_ROUTE}>Start building</NavLink>
          </Button>

          <Button size="large" asChild intent="tertiary">
            <NavLink to={PRIMARY_DOCS_ROUTE}>Explore docs</NavLink>
          </Button>
        </div>

        <div className={styles.heroMetaBadges}>
          <Badge tone="info" variant="outline">
            {components.length} components
          </Badge>
          <Badge tone="info" variant="outline">
            {hooks.length} hooks
          </Badge>
          <Badge tone="success" variant="soft">
            MIT licensed
          </Badge>
        </div>
      </section>

      <section aria-labelledby="landing-why-title" className={styles.section}>
        <Heading id="landing-why-title" level={2}>
          Why ThemeShift?
        </Heading>

        <div className={styles.whyGrid}>
          {WHY_ITEMS.map((item) => (
            <article className={styles.whyCard} key={item.title}>
              <Heading className={styles.cardTitle} level={3}>
                {item.title}
              </Heading>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="landing-accessibility-title"
        className={`${styles.section} ${styles.accessibilitySection}`}
      >
        <div className={styles.accessibilityHeader}>
          <div className={styles.accessibilityIcon} aria-hidden>
            <IoAccessibility />
          </div>
          <div>
            <Heading id="landing-accessibility-title" level={2}>
              Accessibility, Built-In From the Start
            </Heading>
            <p className={styles.sectionLead}>
              No retrofitting sprint required, core interaction and semantics
              are part of the component contract.
            </p>
          </div>
        </div>

        <div className={styles.accessibilityContent}>
          <Heading level={3}>
            If it’s interactive, it’s already accessible.
          </Heading>
          <ul className={styles.accessibilityList}>
            {ACCESSIBILITY_BULLETS.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="landing-features-title"
        className={styles.section}
      >
        <Heading id="landing-features-title" level={2}>
          Features for Production Teams
        </Heading>
        <p className={styles.sectionLead}>
          Start with the differences that matter most, then rely on the
          foundations you already expect.
        </p>
        <p className={styles.featureGroupLabel}>Core differentiators</p>

        <div className={styles.featureGrid}>
          {CORE_FEATURES.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <div className={styles.featureIcon} aria-hidden>
                {feature.icon}
              </div>
              <Heading className={styles.cardTitle} level={3}>
                {feature.title}
              </Heading>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>

        <p className={styles.featureGroupLabel}>Foundations included</p>
        <div className={styles.foundationRow}>
          {FOUNDATION_FEATURES.map((feature) => (
            <article className={styles.foundationFeature} key={feature.title}>
              <div className={styles.featureIcon} aria-hidden>
                {feature.icon}
              </div>
              <Heading className={styles.foundationTitle} level={3}>
                {feature.title}
              </Heading>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="landing-components-title"
        className={styles.section}
      >
        <Heading id="landing-components-title" level={2}>
          Components
        </Heading>

        <p className={styles.sectionLead}>
          A growing set of components designed for real product UI.
        </p>

        <div className={styles.componentGrid}>
          {COMPONENT_PREVIEWS.map(({ label, Preview }) => (
            <article
              aria-label={label}
              className={styles.componentPreviewCard}
              key={label}
            >
              <span className={styles.srOnly}>{label}</span>
              <div className={styles.previewBody}>
                <Preview />
              </div>
            </article>
          ))}
        </div>

        <div className={styles.previewFooter}>
          <Button asChild intent="tertiary">
            <NavLink to={PRIMARY_DOCS_ROUTE}>Browse all component docs</NavLink>
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="landing-tokens-title"
        className={`${styles.section} ${styles.centerSection} ${styles.withDivider}`}
      >
        <Heading id="landing-tokens-title" level={2}>
          Customize through design tokens
        </Heading>
        <p className={styles.centerLead}>
          Keep the same components and shape them to your product with
          token-based typography, spacing, and color.
        </p>

        <div className={styles.actionsRow}>
          <Button asChild intent="tertiary">
            <NavLink to={TOKENS_ROUTE}>Explore design token docs</NavLink>
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="landing-trust-title"
        className={`${styles.section} ${styles.centerSection} ${styles.withDivider}`}
      >
        <Heading id="landing-trust-title" level={2}>
          Built in the Open, Ready for Real Projects
        </Heading>
        <ul className={styles.trustSignals}>
          {trustSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>

        <div className={styles.actionsRow}>
          <Button asChild intent="tertiary">
            <a href={GITHUB_REPO_URL} rel="noreferrer" target="_blank">
              View activity on GitHub
            </a>
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="landing-pricing-title"
        className={`${styles.section} ${styles.centerSection} ${styles.withDivider}`}
      >
        <Heading id="landing-pricing-title" level={2}>
          Pricing
        </Heading>
        <p className={styles.centerLead}>
          Just kidding. ThemeShift UI is free and open source - no tiers, no
          seat limits, no lock-in. Use it the way your team ships best.
        </p>

        <div className={styles.actionsRow}>
          {OSS_ACTIONS.map(({ label, icon: Icon, href }) => (
            <Button
              asChild
              intent="tertiary"
              key={label}
              startIcon={<Icon aria-hidden />}
            >
              <a href={href} rel="noreferrer" target="_blank">
                <span>{label}</span>
              </a>
            </Button>
          ))}
        </div>
      </section>

      <section aria-labelledby="landing-cta-title" className={styles.finalCta}>
        <Heading id="landing-cta-title" level={2}>
          Ready to get started?
        </Heading>
        <p>Start building with docs you can trust.</p>

        <div className={styles.finalCtaActions}>
          <Button asChild size="large">
            <NavLink to={PRIMARY_DOCS_ROUTE}>Start building</NavLink>
          </Button>
          <Button asChild intent="tertiary" size="large">
            <NavLink to={PRIMARY_DOCS_ROUTE}>Explore docs</NavLink>
          </Button>
        </div>
      </section>
    </main>
  );
};
