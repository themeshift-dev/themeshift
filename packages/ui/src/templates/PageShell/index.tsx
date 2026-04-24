import classNames from 'classnames';
import type { ElementType } from 'react';

import { SkipLink } from '@/components';
import type {
  ShellAccessibilityProps,
  ShellSemanticProps,
  ShellStructuralSlots,
} from '@/templates';
import { resolveShellA11yProps } from '@/templates/utils';

import styles from './PageShell.module.scss';

/**
 * Structural regions supported specifically by `PageShell`.
 *
 * `PageShell` intentionally opts into only a subset of the shared shell slots.
 * This helps prevent the shell from becoming a "god component" that claims to
 * handle every layout scenario.
 *
 * Supported regions:
 * - `header`
 * - `navigation`
 * - `aside`
 * - `footer`
 * - `children`
 *
 * Not supported here:
 * - `sidebar`
 */
type PageShellAreas = Pick<
  ShellStructuralSlots,
  'header' | 'navigation' | 'aside' | 'footer' | 'children'
>;

/**
 * `PageShell`-specific layout and presentation props.
 *
 * These props should remain focused on layout behavior and visual structure.
 * They should not encode business-specific page meaning.
 */
type PageShellOwnProps = {
  /**
   * Optional accessible label for the complementary aside landmark.
   *
   * Guidance:
   * Provide this when the aside contains navigation or supporting content that
   * benefits from a clearer purpose for assistive technology users.
   */
  asideLabel?: string;

  /**
   * An extra classname that is applied to the outermost element.
   *
   * This is useful for applying extra styles.
   */
  className?: string;

  /**
   * Whether the shell should render the skip link.
   *
   * Guidance:
   * Keep this enabled by default. Disable only when the shell is embedded in a
   * context where bypass navigation is already handled externally or would be
   * duplicative.
   */
  showSkipLink?: boolean;

  /**
   * Positioning mode for the header region.
   */
  headerPosition?: 'static' | 'sticky';

  /**
   * Whether header content should be wrapped in the standard shell container.
   */
  headerContained?: boolean;

  /**
   * Whether the header should render a bottom divider.
   */
  headerDivider?: boolean;

  /**
   * Whether the shell should render visual dividers between major regions.
   *
   * Examples:
   * - divider under header
   * - divider above footer
   * - separator between main and aside
   */
  divider?: boolean;
};

/**
 * Semantic props supported specifically by `PageShell`.
 *
 * `PageShell` intentionally only opts into the semantic props it actually uses.
 */
type PageShellSemanticProps = Pick<
  ShellSemanticProps,
  'as' | 'mainAs' | 'mainLabel' | 'navLabel'
>;

/**
 * Props for the `PageShell` component.
 *
 * `PageShell` is the most general-purpose shell in the system. It is intended
 * for standard public-facing or non-dense application pages that need:
 *
 * - a skip link
 * - optional header/navigation/footer regions
 * - a primary main content area
 * - an optional complementary aside
 *
 * Typical use cases:
 * - content pages
 * - documentation pages
 * - marketing pages
 * - simple settings/help pages
 *
 * Non-goals:
 * - dense dashboard/workspace layout
 * - highly specialized business-specific templates
 * - complex multi-pane application shells
 *
 * Design principle:
 * `PageShell` should stay boring. That is a strength.
 */
export type PageShellProps = ShellAccessibilityProps &
  PageShellSemanticProps &
  PageShellAreas &
  PageShellOwnProps;

/**
 * A general-purpose page-level shell for standard web pages.
 *
 * `PageShell` is a structural frame, not a business template.
 * It should handle:
 * - page regions
 * - semantic landmarks
 * - skip-link behavior
 * - width and spacing defaults
 */
export const PageShell = ({
  as,
  aside,
  asideLabel,
  children,
  className,
  divider = false,
  footer,
  header,
  headerContained = true,
  headerDivider,
  headerPosition = 'static',
  mainAs,
  mainId,
  mainLabel,
  navLabel,
  navigation,
  showSkipLink = true,
  skipLinkLabel,
}: PageShellProps) => {
  const Component = (as ?? 'div') as ElementType;
  const MainComponent = (mainAs ?? 'main') as ElementType;
  const resolvedA11y = resolveShellA11yProps({ mainId, skipLinkLabel });

  return (
    <Component className={classNames(styles.container, className)}>
      {showSkipLink ? (
        <SkipLink
          href={resolvedA11y.skipLinkHref}
          label={resolvedA11y.skipLinkLabel}
        />
      ) : null}

      {header ? (
        <header
          className={classNames(
            styles.header,
            headerPosition === 'sticky' && styles.headerSticky,
            (headerDivider ?? divider) && styles.headerDivider
          )}
        >
          {headerContained ? (
            <div className={styles.regionInner}>{header}</div>
          ) : (
            header
          )}
        </header>
      ) : null}

      {navigation ? (
        <nav
          aria-label={navLabel}
          className={classNames(
            styles.navigation,
            divider && styles.navigationDivider
          )}
        >
          <div className={styles.regionInner}>{navigation}</div>
        </nav>
      ) : null}

      <div
        className={classNames(
          styles.contentGrid,
          Boolean(aside) && styles.withAside
        )}
      >
        <MainComponent
          id={resolvedA11y.mainId}
          aria-label={mainLabel}
          className={classNames(styles.main)}
        >
          <div className={styles.regionInner}>{children}</div>
        </MainComponent>

        {aside ? (
          <aside
            aria-label={asideLabel}
            className={classNames(styles.aside, divider && styles.asideDivider)}
          >
            <div className={styles.regionInner}>{aside}</div>
          </aside>
        ) : null}
      </div>

      {footer ? (
        <footer
          className={classNames(styles.footer, divider && styles.footerDivider)}
        >
          <div className={styles.regionInner}>{footer}</div>
        </footer>
      ) : null}
    </Component>
  );
};
