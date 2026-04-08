import type {
  ShellAccessibilityProps,
  ShellSemanticProps,
  ShellStructuralSlots,
} from '@/templates';

import styles from './AppShell.module.scss';

/**
 * Available layout modes for navigation/sidebar regions in `AppShell`.
 *
 * Suggested semantics:
 * - `fixed`: region is persistently visible in the layout
 * - `inline`: region participates in normal document/layout flow
 * - `overlay`: region appears above content, often for small screens
 *
 * Design note:
 * These values describe layout behavior, not visual style.
 */
export type AppShellRegionMode = 'fixed' | 'inline' | 'overlay';

/**
 * Shared breakpoint token type for responsive shell behavior.
 *
 * Replace this with your system's actual breakpoint token type if you already
 * have one defined elsewhere.
 *
 * Example values:
 * - `'mobile'`
 * - `'mobile-tablet'`
 * - `'tablet'`
 * - `'tablet-desktop'`
 * - `'desktop'`
 */
export type AppShellBreakpoint =
  | 'mobile'
  | 'mobile-tablet'
  | 'tablet'
  | 'tablet-desktop'
  | 'desktop';

/**
 * Structural regions supported specifically by `AppShell`.
 *
 * `AppShell` is intended for authenticated or tool-like application layouts
 * with persistent chrome and workspace-style structure.
 *
 * Supported regions:
 * - `header`
 * - `navigation`
 * - `sidebar`
 * - `aside`
 * - `footer`
 * - `children`
 *
 * Design note:
 * `AppShell` is broader than `PageShell`, but it should still stay structural.
 * It should not encode product-specific business meaning.
 */
type AppShellAreas = Pick<
  ShellStructuralSlots,
  'header' | 'navigation' | 'sidebar' | 'aside' | 'footer' | 'children'
>;

/**
 * Semantic props supported specifically by `AppShell`.
 */
type AppShellSemanticProps = Pick<
  ShellSemanticProps,
  'as' | 'mainAs' | 'mainLabel' | 'navLabel' | 'sidebarLabel'
>;

/**
 * `AppShell`-specific layout and interaction props.
 *
 * These props should stay focused on:
 * - persistent chrome
 * - responsive shell behavior
 * - region visibility
 * - navigation/sidebar interaction
 *
 * They should not drift into business-specific concerns.
 */
type AppShellOwnProps = {
  /**
   * Whether the header should use sticky positioning.
   *
   * Guidance:
   * This is common for authenticated applications with persistent top chrome.
   */
  stickyHeader?: boolean;

  /**
   * Whether the primary navigation region should use sticky positioning.
   */
  stickyNavigation?: boolean;

  /**
   * Whether the sidebar region should use sticky positioning.
   */
  stickySidebar?: boolean;

  /**
   * Layout mode for the navigation region.
   *
   * Common use:
   * - desktop: `fixed` or `inline`
   * - mobile: `overlay`
   */
  navigationMode?: AppShellRegionMode;

  /**
   * Layout mode for the sidebar region.
   */
  sidebarMode?: AppShellRegionMode;

  /**
   * Breakpoint below which navigation should collapse into its compact/mobile
   * behavior.
   */
  collapseNavigationBelow?: AppShellBreakpoint;

  /**
   * Breakpoint below which the sidebar should collapse into its compact/mobile
   * behavior.
   */
  collapseSidebarBelow?: AppShellBreakpoint;

  /**
   * Whether the navigation region is open.
   *
   * Use this together with `onNavigationOpenChange` for a controlled pattern.
   */
  isNavigationOpen?: boolean;

  /**
   * Callback fired when the navigation open state changes.
   */
  onNavigationOpenChange?: (open: boolean) => void;

  /**
   * Whether the sidebar region is open.
   *
   * Use this together with `onSidebarOpenChange` for a controlled pattern.
   */
  isSidebarOpen?: boolean;

  /**
   * Callback fired when the sidebar open state changes.
   */
  onSidebarOpenChange?: (open: boolean) => void;

  /**
   * Uncontrolled initial open state for navigation.
   *
   * Guidance:
   * Prefer either a controlled API (`isNavigationOpen`) or an uncontrolled API
   * (`defaultNavigationOpen`) rather than mixing both without intent.
   */
  defaultNavigationOpen?: boolean;

  /**
   * Uncontrolled initial open state for sidebar.
   */
  defaultSidebarOpen?: boolean;

  /**
   * Whether visual dividers should appear between major app regions.
   */
  divider?: boolean;
};

/**
 * Props for the `AppShell` component.
 *
 * `AppShell` is the shell for authenticated, tool-like, or dashboard-style
 * experiences that need persistent structural chrome.
 *
 * Typical use cases:
 * - dashboards
 * - admin panels
 * - project management tools
 * - internal tools
 * - settings areas with persistent app nav
 * - mail/file/task-style applications
 *
 * Structural responsibilities:
 * - skip link
 * - header/banner region
 * - primary navigation region
 * - optional sidebar / workspace rail
 * - main application content region
 * - optional complementary content
 * - optional footer
 *
 * Non-goals:
 * - page-specific data presentation
 * - business-specific workflows
 * - card/table/gallery logic
 * - task/form semantics
 *
 * Design principle:
 * `AppShell` should provide persistent application frame behavior, not become a
 * product-specific god component.
 */
export type AppShellProps = ShellAccessibilityProps &
  AppShellSemanticProps &
  AppShellAreas &
  AppShellOwnProps;

/**
 * A persistent application shell for authenticated or workspace-style layouts.
 *
 * `AppShell` should manage page-level structure and region behavior, including:
 * - skip-link support
 * - semantic landmarks
 * - persistent application chrome
 * - responsive nav/sidebar layout
 * - optional controlled open/close behavior
 *
 * It should not know about:
 * - tables
 * - cards
 * - entity detail layouts
 * - product-specific sidebars
 * - domain-specific workflows
 *
 * Strong guidance:
 * Keep this structural. If you find yourself adding props like `projects`,
 * `filters`, `breadcrumbs`, `tabs`, `actions`, or `tableToolbar`, those likely
 * belong in organisms or higher-level templates, not in the shell.
 *
 * @todo Add support for `header`, `navigation`, `sidebar`, `aside`, and `footer`
 * regions. Render them only when provided.
 *
 * @todo Render a skip link before all other visible content.
 * Use `skipLinkLabel ?? 'Skip to main content'` for safe default text.
 * Use `resolvedSkipLinkHref` as the anchor destination.
 *
 * @todo Render `children` inside the main content landmark, never directly
 * inside the root wrapper.
 *
 * @todo Support polymorphic wrapper elements:
 * - `as` for the outer wrapper
 * - `mainAs` for the main content region
 * Default them to sensible semantic elements.
 *
 * @todo Render `navigation` inside a `<nav>` landmark with `aria-label={navLabel}`
 * when navigation content exists.
 *
 * @todo Decide whether `sidebar` should render as:
 * - `<aside>`
 * - a labelled `<div>`
 * - a dedicated complementary region abstraction
 * based on your design system's semantic rules.
 *
 * @todo Apply `sidebarLabel` when the sidebar region renders as a labelled
 * landmark or complementary region.
 *
 * @todo Translate `stickyHeader`, `stickyNavigation`, `stickySidebar`,
 * `navigationMode`, `sidebarMode`, and `divider` into stable CSS module class names.
 *
 * @todo Implement responsive region behavior for:
 * - `collapseNavigationBelow`
 * - `collapseSidebarBelow`
 * These should map to design-system breakpoints rather than ad-hoc media queries.
 *
 * @todo Decide on the controlled/uncontrolled pattern for navigation and sidebar.
 * Recommended approach:
 * - support controlled usage via `isNavigationOpen` / `onNavigationOpenChange`
 * - support uncontrolled usage via `defaultNavigationOpen`
 * - avoid ambiguous behavior when both are passed
 *
 * @todo Add optional affordances for toggling navigation/sidebar open state,
 * but only if the shell is truly responsible for that interaction in your system.
 * Otherwise, allow parent components to own the controls.
 *
 * @todo Ensure overlay modes are accessible:
 * - focus should move predictably
 * - keyboard dismissal should be possible where appropriate
 * - hidden regions should not remain tabbable
 * - off-screen content should not confuse screen reader users
 *
 * @todo Keep `navigation` and `sidebar` conceptually distinct:
 * - `navigation` = primary app/site movement
 * - `sidebar` = secondary workspace/supporting region
 * Do not merge them unless your design system intentionally treats them as one.
 *
 * @todo Verify the component against at least four realistic layouts:
 * - admin dashboard with left nav and top header
 * - settings area with persistent section nav
 * - mail/file style UI with nav + secondary panel
 * - internal tool with collapsible mobile navigation
 *
 * @todo Add tests covering:
 * - default skip-link text
 * - resolved `mainId`
 * - conditional region rendering
 * - landmark labels
 * - mode class application
 * - controlled/uncontrolled region behavior
 * - collapsed/overlay accessibility behavior
 */
export const AppShell = ({ children, mainId }: AppShellProps) => {
  /**
   * Resolved id for the main content region.
   *
   * Guidance:
   * This should remain stable so skip-link behavior is safe by default.
   */
  const resolvedMainId = mainId ?? 'main-content';

  /**
   * Resolved skip-link destination.
   *
   * Guidance:
   * Keep this coupled to the resolved main landmark id.
   */
  const resolvedSkipLinkHref = `#${resolvedMainId}`;

  /**
   * @todo Use `resolvedSkipLinkHref` when rendering the skip link.
   * Example intent:
   * `<a href={resolvedSkipLinkHref}>...</a>`
   */
  void resolvedSkipLinkHref;

  return (
    <div className={styles.container}>
      {/**
       * @todo Replace this placeholder structure with the actual app-shell layout.
       *
       * Recommended render order:
       * 1. skip link
       * 2. header
       * 3. navigation
       * 4. main application layout wrapper
       * 5. sidebar / aside within the app layout as appropriate
       * 6. main content landmark
       * 7. footer
       *
       * Notes:
       * - only render optional regions when provided
       * - `children` belongs inside the main landmark
       * - `AppShell` should define the frame, not the business content
       * - responsive behavior should come from shell props + design-system tokens
       */}
      {children}
    </div>
  );
};
