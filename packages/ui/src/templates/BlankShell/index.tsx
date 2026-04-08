import styles from './BlankShell.module.scss';

import type {
  ShellAccessibilityProps,
  ShellSemanticProps,
  ShellStructuralSlots,
} from '@/templates';

/**
 * Structural regions supported specifically by `BlankShell`.
 *
 * `BlankShell` is intentionally minimal. It should expose only the slots needed
 * for essentially "just render the main content area" scenarios.
 *
 * Supported regions:
 * - `children`
 *
 * Not supported here:
 * - `header`
 * - `navigation`
 * - `sidebar`
 * - `aside`
 * - `footer`
 *
 * Design note:
 * If a layout needs persistent chrome or multiple named page regions, it likely
 * wants `PageShell`, `CenteredShell`, or `AppShell` instead of `BlankShell`.
 */
type BlankShellAreas = Pick<ShellStructuralSlots, 'children'>;

/**
 * Semantic props supported specifically by `BlankShell`.
 *
 * `BlankShell` only opts into the semantic props it actually needs.
 */
type BlankShellSemanticProps = Pick<
  ShellSemanticProps,
  'as' | 'mainAs' | 'mainLabel'
>;

/**
 * Visual/background options for `BlankShell`.
 *
 * These should map to stable design-system tokens rather than one-off colors.
 *
 * Suggested semantics:
 * - `default`: standard page/app background
 * - `subtle`: slightly differentiated surface
 * - `transparent`: no imposed background treatment
 */
export type BlankShellBackground = 'default' | 'subtle' | 'transparent';

/**
 * `BlankShell`-specific layout and presentation props.
 *
 * These props should stay intentionally small. `BlankShell` is meant to be the
 * "least opinionated shell" in the system.
 *
 * Design principle:
 * If this prop list starts growing quickly, that is usually a sign the layout
 * belongs in another shell.
 */
type BlankShellOwnProps = {
  /**
   * Whether standard shell padding should be applied around the main content.
   *
   * Guidance:
   * This can default to `false` or `true` depending on how your design system
   * treats fullscreen/canvas-style layouts, but the default should be explicit
   * and documented.
   */
  padded?: boolean;

  /**
   * Background treatment for the shell.
   *
   * Guidance:
   * Keep this token-based and structural. Avoid allowing arbitrary visual styling
   * props at the shell layer.
   */
  background?: BlankShellBackground;

  /**
   * Whether the shell should occupy at least the viewport height.
   *
   * Common use cases:
   * - fullscreen editor surfaces
   * - kiosk-like experiences
   * - sparse pages that should still fill the screen
   */
  fullHeight?: boolean;
};

/**
 * Props for the `BlankShell` component.
 *
 * `BlankShell` is the most minimal shell in the system. It exists for cases
 * where the application needs:
 *
 * - a reliable main landmark
 * - optional skip-link support
 * - minimal layout framing
 * - little or no visible chrome
 *
 * Typical use cases:
 * - embedded experiences
 * - fullscreen tools/editors
 * - print-friendly views
 * - route-mounted modal-like pages
 * - experimental/special layouts
 * - canvas/surface-driven UIs
 *
 * Non-goals:
 * - persistent navigation
 * - page header/footer structure
 * - dashboard/app chrome
 * - content/detail/list/form template behavior
 *
 * Design principle:
 * `BlankShell` should be almost invisible. It is an escape hatch, not a feature-rich layout system.
 */
export type BlankShellProps = ShellAccessibilityProps &
  BlankShellSemanticProps &
  BlankShellAreas &
  BlankShellOwnProps;

/**
 * A minimal shell for pages that need little or no surrounding chrome.
 *
 * `BlankShell` should manage only the most essential page structure:
 * - skip-link support
 * - semantic main landmark
 * - optional minimal padding/background behavior
 *
 * It should not know about:
 * - headers
 * - navigation
 * - sidebars
 * - cards
 * - workflows
 * - page-specific presentation patterns
 *
 * Strong guidance:
 * Keep this component extremely small. If you find yourself adding support for
 * many named regions or interaction patterns, that likely means the layout
 * should move to another shell rather than expanding `BlankShell`.
 *
 * @todo Render a skip link before the main content when this shell supports it.
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
 * @todo Apply the resolved `mainId` to the main content landmark so keyboard
 * users have a stable skip-link target.
 *
 * @todo Translate `padded`, `background`, and `fullHeight` into stable CSS module class names.
 * Prefer design-system tokens and predictable modifier classes.
 *
 * @todo Keep this shell visually and structurally minimal.
 * Do not add support for header/footer/navigation/sidebar regions here.
 *
 * @todo Decide whether skip links should always render, or only render when
 * the shell is used in a context where keyboard bypass content is meaningful.
 * Whichever approach you choose, document it consistently across all shells.
 *
 * @todo Verify the component against at least four realistic examples:
 * - fullscreen editor/canvas page
 * - print-friendly route
 * - embedded/iframe-friendly view
 * - route-mounted modal/fullscreen takeover experience
 *
 * @todo Add tests covering:
 * - default skip-link text
 * - resolved `mainId`
 * - landmark rendering
 * - class application for `padded`, `background`, and `fullHeight`
 * - polymorphic wrapper behavior
 */
export const BlankShell = ({ children, mainId }: BlankShellProps) => {
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

  return (
    <div className={styles.container}>
      {/**
       * @todo Replace this placeholder structure with the actual blank-shell layout.
       *
       * Recommended render order:
       * 1. skip link
       * 2. outer wrapper
       * 3. main content landmark containing `children`
       *
       * Notes:
       * - `children` belongs inside the main landmark
       * - keep the shell nearly invisible
       * - avoid introducing extra regions unless absolutely necessary
       * - this component should remain the smallest shell in the system
       */}
      {children}
    </div>
  );
};
