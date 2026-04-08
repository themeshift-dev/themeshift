import styles from './CenteredShell.module.scss';

import type {
  ShellAccessibilityProps,
  ShellSemanticProps,
  ShellStructuralSlots,
} from '@/templates';

/**
 * Structural regions supported specifically by `CenteredShell`.
 *
 * `CenteredShell` is a focused shell for layouts where the main content should
 * be constrained and visually centered rather than surrounded by persistent
 * application chrome.
 *
 * Supported regions:
 * - `header`
 * - `footer`
 * - `children`
 *
 * Not supported here:
 * - `navigation`
 * - `sidebar`
 * - `aside`
 *
 * Design note:
 * If a layout needs persistent navigation or multiple strong secondary regions,
 * it likely wants `PageShell` or `AppShell` instead of `CenteredShell`.
 */
type CenteredShellAreas = Pick<
  ShellStructuralSlots,
  'header' | 'footer' | 'children'
>;

/**
 * Semantic props supported specifically by `CenteredShell`.
 *
 * `CenteredShell` only opts into the semantic props it actually needs.
 */
type CenteredShellSemanticProps = Pick<
  ShellSemanticProps,
  'as' | 'mainAs' | 'mainLabel'
>;

/**
 * Width options for the primary centered content block.
 *
 * These should map to stable design-system layout tokens.
 *
 * Suggested semantics:
 * - `narrow`: tight reading/task width
 * - `content`: standard content width
 * - `wide`: broader centered layout while still constrained
 */
export type CenteredShellWidth = 'narrow' | 'content' | 'wide';

/**
 * Vertical alignment options for the centered content block.
 *
 * Suggested semantics:
 * - `start`: content begins near the top of the available space
 * - `center`: content is vertically centered in the available space
 *
 * Design note:
 * This is especially useful for focused forms, confirmations, and sparse pages.
 */
export type CenteredShellVerticalAlign = 'start' | 'center';

/**
 * Height behavior options for the shell.
 *
 * Suggested semantics:
 * - `auto`: shell height follows its content
 * - `screen`: shell should occupy at least the viewport height
 */
export type CenteredShellMinHeight = 'auto' | 'screen';

/**
 * `CenteredShell`-specific layout and presentation props.
 *
 * These props should remain focused on:
 * - centered content framing
 * - constrained width
 * - vertical alignment
 * - minimal shell presentation
 *
 * They should not drift into business-specific page meaning.
 */
type CenteredShellOwnProps = {
  /**
   * Width of the centered content block.
   *
   * Guidance:
   * Choose based on reading density or task focus, not page "type".
   *
   * Common use:
   * - `narrow`: forms, confirmations, legal prompts
   * - `content`: standard reading/content layout
   * - `wide`: broader but still centered experiences
   */
  width?: CenteredShellWidth;

  /**
   * Whether standard shell padding should be applied.
   *
   * Guidance:
   * This should usually default to `true`.
   */
  padded?: boolean;

  /**
   * Minimum height behavior for the shell.
   *
   * Guidance:
   * Use `screen` when the content should feel intentionally centered within the
   * viewport rather than simply stacked from the top.
   */
  minHeight?: CenteredShellMinHeight;

  /**
   * Vertical alignment of the primary centered content region.
   *
   * Guidance:
   * - `start`: better for longer content
   * - `center`: better for short focused tasks or sparse result pages
   */
  verticalAlign?: CenteredShellVerticalAlign;

  /**
   * Whether the primary content block should be visually contained in a card/panel.
   *
   * Guidance:
   * This is useful for focused experiences like forms or confirmation pages,
   * but should remain a design-system-driven treatment rather than a business
   * concept.
   */
  card?: boolean;

  /**
   * Whether visual dividers should appear between major regions.
   *
   * Most useful when `header` or `footer` are present.
   */
  divider?: boolean;
};

/**
 * Props for the `CenteredShell` component.
 *
 * `CenteredShell` is a focused shell for layouts where content should be
 * constrained and visually centered within the page.
 *
 * Typical use cases:
 * - legal pages
 * - focused forms
 * - onboarding steps
 * - confirmations/result pages
 * - simple settings subsections
 * - narrow reading experiences
 *
 * Structural responsibilities:
 * - skip link
 * - stable main landmark
 * - optional header/footer
 * - centered content container
 * - constrained width and vertical alignment behavior
 *
 * Non-goals:
 * - persistent app chrome
 * - navigation-heavy page structure
 * - dashboard/workspace layouts
 * - business-specific workflows or content semantics
 *
 * Design principle:
 * `CenteredShell` should emphasize focus and readability over chrome.
 */
export type CenteredShellProps = ShellAccessibilityProps &
  CenteredShellSemanticProps &
  CenteredShellAreas &
  CenteredShellOwnProps;

/**
 * A focused shell for constrained, centered page layouts.
 *
 * `CenteredShell` should manage:
 * - skip-link support
 * - semantic main landmark
 * - centered content framing
 * - constrained width behavior
 * - vertical alignment within the page/viewport
 * - optional header/footer regions
 *
 * It should not know about:
 * - navigation systems
 * - sidebars
 * - multi-pane workspace structure
 * - specific forms or field logic
 * - domain-specific content patterns
 *
 * Strong guidance:
 * Keep this shell focused on layout framing only. If you find yourself adding
 * props for steps, fields, status panels, or action groups, those likely belong
 * in organisms or higher-level templates rather than the shell.
 *
 * @todo Render a skip link before the main content when this shell supports it.
 * Use `skipLinkLabel ?? 'Skip to main content'` for safe default text.
 * Use `resolvedSkipLinkHref` as the anchor destination.
 *
 * @todo Render `header` and `footer` only when provided.
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
 * @todo Build the shell around a centered inner content container rather than
 * placing layout constraints directly on the outer wrapper.
 *
 * @todo Translate `width`, `padded`, `minHeight`, `verticalAlign`, `card`,
 * and `divider` into stable CSS module class names.
 * Prefer token-based modifier classes over ad-hoc inline styling.
 *
 * @todo Keep this shell structurally simple.
 * Do not add support for navigation, sidebar, or aside regions here.
 *
 * @todo Decide how `header` should behave relative to the centered content:
 * - fully centered with the content block
 * - or outside the centered card/container but still within the shell
 * Choose one pattern and document it consistently.
 *
 * @todo Decide how `footer` should behave for sparse pages vs longer pages.
 * It may belong inside the centered flow or outside the main constrained block
 * depending on your design system's conventions.
 *
 * @todo Verify the component against at least four realistic examples:
 * - narrow legal/terms page
 * - centered confirmation page
 * - focused form page
 * - sparse result/success page with vertical centering
 *
 * @todo Add tests covering:
 * - default skip-link text
 * - resolved `mainId`
 * - conditional rendering of `header` and `footer`
 * - class application for `width`, `padded`, `minHeight`, `verticalAlign`, `card`
 * - polymorphic wrapper behavior
 * - landmark semantics
 */
export const CenteredShell = ({ children, mainId }: CenteredShellProps) => {
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
       * @todo Replace this placeholder structure with the actual centered-shell layout.
       *
       * Recommended render order:
       * 1. skip link
       * 2. outer wrapper
       * 3. optional header
       * 4. centered layout region
       * 5. main content landmark containing `children`
       * 6. optional footer
       *
       * Notes:
       * - `children` belongs inside the main landmark
       * - use an inner centered content container with width modifiers
       * - keep the shell focused and minimal
       * - vertical centering should be driven by shell props, not business logic
       */}
      {children}
    </div>
  );
};
