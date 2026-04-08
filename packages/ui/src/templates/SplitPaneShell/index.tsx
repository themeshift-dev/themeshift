import styles from './SplitPaneShell.module.scss';

import type {
  ShellAccessibilityProps,
  ShellSemanticProps,
} from '@/templates';

/**
 * Orientation options for `SplitPaneShell`.
 *
 * Suggested semantics:
 * - `horizontal`: panes sit side-by-side
 * - `vertical`: panes stack top-to-bottom
 *
 * Design note:
 * This is a structural layout decision, not a content meaning decision.
 */
export type SplitPaneShellDirection = 'horizontal' | 'vertical';

/**
 * Which pane may collapse in responsive or interactive scenarios.
 *
 * Suggested semantics:
 * - `start`: only the start pane may collapse
 * - `end`: only the end pane may collapse
 * - `both`: either pane may collapse
 * - `false`: neither pane may collapse
 *
 * Design note:
 * Collapsing behavior should stay predictable and documented. This shell should
 * not silently invent pane behavior that consumers cannot reason about.
 */
export type SplitPaneShellCollapsible = 'start' | 'end' | 'both' | false;

/**
 * Which pane is currently treated as the primary pane.
 *
 * This is useful when the shell needs to distinguish between the "main working
 * area" and the "supporting/secondary" area without naming them according to a
 * business concept like sidebar, preview, or detail.
 */
export type SplitPaneShellPrimaryPane = 'start' | 'end';

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
export type SplitPaneShellBreakpoint =
  | 'mobile'
  | 'mobile-tablet'
  | 'tablet'
  | 'tablet-desktop'
  | 'desktop';

/**
 * Semantic props supported specifically by `SplitPaneShell`.
 *
 * `SplitPaneShell` opts into only the semantic props it actually needs.
 *
 * Design note:
 * `navLabel` and `sidebarLabel` are intentionally not included here because
 * this shell should remain structurally neutral. Its panes are not inherently
 * navigation or sidebar regions.
 */
type SplitPaneShellSemanticProps = Pick<
  ShellSemanticProps,
  'as' | 'mainAs' | 'mainLabel'
>;

/**
 * `SplitPaneShell`-specific layout and interaction props.
 *
 * These props should stay focused on:
 * - pane composition
 * - pane sizing
 * - pane collapse behavior
 * - responsive split behavior
 *
 * They should not encode business-specific meanings such as mail, editor,
 * gallery, dashboard, or documentation.
 */
type SplitPaneShellOwnProps = {
  /**
   * Content rendered in the start pane.
   *
   * In a horizontal layout, this is typically the left pane in LTR contexts.
   * In a vertical layout, this is the top pane.
   */
  startPane: React.ReactNode;

  /**
   * Content rendered in the end pane.
   *
   * In a horizontal layout, this is typically the right pane in LTR contexts.
   * In a vertical layout, this is the bottom pane.
   */
  endPane: React.ReactNode;

  /**
   * Orientation of the split.
   *
   * Guidance:
   * - use `horizontal` for side-by-side workspaces
   * - use `vertical` for stacked editing/preview or inspector layouts
   */
  direction?: SplitPaneShellDirection;

  /**
   * Which pane should be treated as the primary pane.
   *
   * Guidance:
   * This is useful for semantics and responsive behavior decisions, but should
   * not introduce business-specific assumptions.
   */
  primaryPane?: SplitPaneShellPrimaryPane;

  /**
   * Initial ratio between the two panes.
   *
   * Example values:
   * - `0.5`
   * - `'40/60'` (if your system supports custom parsing)
   * - `'320px / 1fr'` (if your system later formalizes tokenized split sizing)
   *
   * Guidance:
   * Keep the accepted value format narrow and well-documented. If you do not yet
   * have a parsing strategy, prefer a simpler type such as `number`.
   */
  ratio?: string | number;

  /**
   * Minimum size for the start pane.
   *
   * Example values:
   * - `240`
   * - `'240px'`
   */
  minStart?: string | number;

  /**
   * Minimum size for the end pane.
   *
   * Example values:
   * - `320`
   * - `'20rem'`
   */
  minEnd?: string | number;

  /**
   * Whether panes can be resized by the user.
   *
   * Guidance:
   * Only implement this if your design system genuinely supports interactive
   * resizing. Otherwise keep it as a layout-only shell concern for now.
   */
  resizable?: boolean;

  /**
   * Which pane(s), if any, may collapse.
   */
  collapsible?: SplitPaneShellCollapsible;

  /**
   * Breakpoint below which the shell should stop behaving as a persistent split
   * and adopt its collapsed/stacked behavior.
   *
   * Guidance:
   * This is especially useful for smaller screens where a two-pane workspace is
   * not realistic.
   */
  collapseBelow?: SplitPaneShellBreakpoint;

  /**
   * Whether a visual divider should appear between panes.
   */
  divider?: boolean;

  /**
   * Accessible label for the start pane when it is rendered as a labelled region.
   *
   * Guidance:
   * Only apply when the pane needs extra clarification for assistive technology.
   */
  startLabel?: string;

  /**
   * Accessible label for the end pane when it is rendered as a labelled region.
   */
  endLabel?: string;
};

/**
 * Props for the `SplitPaneShell` component.
 *
 * `SplitPaneShell` is a structural shell for layouts where two regions matter
 * at the same time.
 *
 * Typical use cases:
 * - editor + preview
 * - list + detail
 * - docs nav + article
 * - gallery + preview
 * - tool panel + workspace
 * - inspector + canvas
 *
 * Structural responsibilities:
 * - skip link
 * - stable main landmark
 * - two-pane layout composition
 * - pane sizing and responsive split behavior
 * - optional collapse/resizing affordances
 *
 * Non-goals:
 * - assigning business meaning to either pane
 * - app-wide persistent chrome
 * - workflow or content semantics
 * - domain-specific list/detail/editor behavior
 *
 * Design principle:
 * `SplitPaneShell` should describe dual-region structure, not product concepts.
 */
export type SplitPaneShellProps = ShellAccessibilityProps &
  SplitPaneShellSemanticProps &
  SplitPaneShellOwnProps;

/**
 * A structural shell for two-pane layouts.
 *
 * `SplitPaneShell` should manage:
 * - skip-link support
 * - semantic main landmark
 * - start/end pane composition
 * - direction, ratio, and sizing behavior
 * - optional collapse/responsive behavior
 *
 * It should not know about:
 * - navigation systems
 * - mail threads
 * - file browsers
 * - editor toolbars
 * - gallery metadata
 * - domain-specific detail layouts
 *
 * Strong guidance:
 * Keep this shell neutral. Do not rename its panes to business-specific concepts
 * inside the component itself. Consumers can supply those meanings externally.
 *
 * @todo Render a skip link before the main content when this shell supports it.
 * Use `skipLinkLabel ?? 'Skip to main content'` for safe default text.
 * Use `resolvedSkipLinkHref` as the anchor destination.
 *
 * @todo Support polymorphic wrapper elements:
 * - `as` for the outer wrapper
 * - `mainAs` for whichever pane contains the main content landmark
 * Default them to sensible semantic elements.
 *
 * @todo Apply the resolved `mainId` to the pane that represents the primary
 * main content region so keyboard users have a stable skip-link target.
 *
 * @todo Decide how pane semantics should work:
 * - one pane should likely contain the `main` landmark
 * - the other pane may render as `<section>`, `<aside>`, or a labelled region
 * Choose a predictable rule based on `primaryPane`.
 *
 * @todo Build the shell around a dedicated split layout wrapper with two pane
 * children:
 * - start pane
 * - end pane
 *
 * @todo Translate `direction`, `primaryPane`, `ratio`, `minStart`, `minEnd`,
 * `divider`, `resizable`, `collapsible`, and `collapseBelow` into stable CSS
 * module class names and/or controlled layout logic.
 *
 * @todo Keep accepted `ratio` values well-scoped and documented.
 * If the format is not yet finalized, consider narrowing it temporarily to
 * something simpler like `number`.
 *
 * @todo Decide whether `resizable` is truly supported at the shell layer.
 * If not, leave a clear scaffold but do not imply full resize interaction
 * without accessible drag-handle behavior, keyboard support, and persistence strategy.
 *
 * @todo Implement responsive behavior for `collapseBelow`.
 * Decide what happens below that breakpoint:
 * - stacked panes
 * - one pane hidden/toggled
 * - primary pane only with a reveal affordance for the secondary pane
 * Whatever rule you choose, document it clearly and keep it consistent.
 *
 * @todo Ensure collapsed/hidden pane behavior is accessible:
 * - hidden panes should not remain tabbable
 * - focus movement should be predictable
 * - visible pane hierarchy should remain understandable
 *
 * @todo Decide how `startLabel` and `endLabel` should be applied.
 * They likely belong on non-main labelled regions when extra clarity is needed.
 *
 * @todo Verify the component against at least four realistic layouts:
 * - list + detail
 * - editor + preview
 * - docs nav + article
 * - inspector + canvas
 *
 * @todo Add tests covering:
 * - default skip-link text
 * - resolved `mainId`
 * - primary pane main-landmark behavior
 * - class application for direction/divider/collapse modes
 * - ratio/min size handling
 * - collapsed state accessibility behavior
 */
export const SplitPaneShell = ({
  mainId,
  startPane,
  endPane,
}: SplitPaneShellProps) => {
  /**
   * Resolved id for the main content region.
   *
   * Guidance:
   * A stable default reduces consumer burden and ensures the skip link has a
   * reliable destination.
   */
  const resolvedMainId = mainId ?? 'main-content';

  /**
   * Resolved skip-link destination.
   *
   * Guidance:
   * This should stay coupled to `resolvedMainId` so consumers do not need to
   * manually keep those concerns in sync.
   */
  const resolvedSkipLinkHref = `#${resolvedMainId}`;

  /**
   * @todo Use `resolvedSkipLinkHref` when rendering the skip link.
   * Example intent:
   * `<a href={resolvedSkipLinkHref}>...</a>`
   */
  void resolvedSkipLinkHref;

  /**
   * @todo Use `startPane` and `endPane` inside a real split layout structure.
   * Do not render them as plain siblings without a dedicated split wrapper.
   */
  void startPane;
  void endPane;

  return (
    <div className={styles.container}>
      {/**
       * @todo Replace this placeholder structure with the actual split-pane-shell layout.
       *
       * Recommended render order:
       * 1. skip link
       * 2. outer wrapper
       * 3. split layout wrapper
       * 4. start pane region
       * 5. end pane region
       *
       * Notes:
       * - one pane should contain the main landmark based on `primaryPane`
       * - the other pane should remain a neutral secondary region
       * - keep the shell structural and business-agnostic
       * - direction, collapse, and ratio should be driven by shell props
       */}
      <div>{startPane}</div>
      <div>{endPane}</div>
    </div>
  );
};
