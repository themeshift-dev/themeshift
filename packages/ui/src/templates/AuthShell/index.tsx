import type { ReactNode } from 'react';

import type {
  ShellAccessibilityProps,
  ShellSemanticProps,
  ShellStructuralSlots,
} from '@/templates';

import styles from './AuthShell.module.scss';

/**
 * Alignment options for the primary auth content block.
 *
 * Suggested semantics:
 * - `start`: content begins near the top/start of the available space
 * - `center`: content is centered within the available space
 *
 * Design note:
 * Auth flows are usually distraction-free and focused, so alignment should stay
 * simple and predictable.
 */
export type AuthShellAlignment = 'start' | 'center';

/**
 * Width options for the primary auth content block.
 *
 * These should map to stable layout tokens in the design system.
 */
export type AuthShellWidth = 'narrow' | 'content' | 'wide';

/**
 * Structural regions supported specifically by `AuthShell`.
 *
 * `AuthShell` is intentionally more focused than `PageShell` or `AppShell`.
 * It is meant for minimal, task-oriented authentication and account access
 * flows.
 *
 * Supported regions:
 * - `footer`
 * - `children`
 *
 * Design note:
 * Most visible auth regions are specialized shell props like `logo`,
 * `heading`, `supportingContent`, and `visual`, rather than generic page slots.
 */
type AuthShellAreas = Pick<ShellStructuralSlots, 'footer' | 'children'>;

/**
 * Semantic props supported specifically by `AuthShell`.
 */
type AuthShellSemanticProps = Pick<
  ShellSemanticProps,
  'as' | 'mainAs' | 'mainLabel'
>;

/**
 * `AuthShell`-specific layout and presentation props.
 *
 * These props should stay focused on:
 * - focused auth/task framing
 * - minimal chrome
 * - optional supporting brand/visual regions
 * - centered or split auth composition
 *
 * They should not drift into product-specific business content.
 */
type AuthShellOwnProps = {
  /**
   * Optional brand/logo region displayed near the primary auth content.
   *
   * Examples:
   * - company wordmark
   * - product logo
   * - small brand lockup
   *
   * Guidance:
   * Keep this compact and supportive. Avoid turning auth pages into full
   * marketing layouts.
   */
  logo?: ReactNode;

  /**
   * Optional heading/content introducing the auth task.
   *
   * Examples:
   * - `"Sign in"`
   * - `"Create your account"`
   * - `"Reset your password"`
   *
   * Guidance:
   * This is shell-level because auth flows frequently need a consistent,
   * prominent heading area above the form/task content.
   */
  heading?: ReactNode;

  /**
   * Optional supporting content near the primary auth content block.
   *
   * Examples:
   * - brief description text
   * - account help links
   * - small legal copy
   * - alternate sign-in guidance
   */
  supportingContent?: ReactNode;

  /**
   * Optional visual/illustrative region.
   *
   * This is most useful for split auth layouts.
   *
   * Examples:
   * - illustration
   * - brand panel
   * - promotional/supportive visual
   *
   * Guidance:
   * This should remain secondary to task completion. AuthShell should still
   * feel focused and distraction-light.
   */
  visual?: ReactNode;

  /**
   * Alignment of the primary auth content block.
   */
  alignment?: AuthShellAlignment;

  /**
   * Width of the primary auth content block.
   *
   * Guidance:
   * - `narrow`: sign-in, password reset, MFA
   * - `content`: standard account access forms
   * - `wide`: broader auth/onboarding content when needed
   */
  width?: AuthShellWidth;

  /**
   * Whether the primary auth content should be visually contained in a card/panel.
   *
   * Guidance:
   * This is common for sign-in and sign-up flows, but should be design-system
   * driven rather than hardcoded to one visual style.
   */
  card?: boolean;

  /**
   * Whether the auth shell should use a split layout.
   *
   * Suggested composition:
   * - one side for primary auth content
   * - one side for `visual` or supporting brand content
   *
   * Guidance:
   * Use this when the design system intentionally supports richer auth layouts.
   * For many apps, the non-split centered layout should remain the default.
   */
  split?: boolean;

  /**
   * Whether the shell should fill at least the viewport height.
   *
   * Guidance:
   * This is often desirable for centered auth layouts.
   */
  fullHeight?: boolean;

  /**
   * Whether standard shell padding should be applied.
   *
   * Guidance:
   * This should usually default to `true`.
   */
  padded?: boolean;

  /**
   * Whether visual dividers should appear between major auth regions.
   *
   * Most useful for split layouts.
   */
  divider?: boolean;
};

/**
 * Props for the `AuthShell` component.
 *
 * `AuthShell` is a focused shell for authentication and account-access flows.
 *
 * Typical use cases:
 * - sign in
 * - sign up
 * - forgot password
 * - reset password
 * - magic link verification
 * - invite acceptance
 * - 2FA / verification steps
 *
 * Structural responsibilities:
 * - skip link
 * - stable main landmark
 * - minimal outer frame
 * - optional logo/heading/supporting content
 * - optional split layout with visual region
 * - optional footer
 *
 * Non-goals:
 * - full application chrome
 * - dense dashboard/workspace layout
 * - business-specific onboarding workflow logic
 * - table/card/detail page behavior
 *
 * Design principle:
 * `AuthShell` should feel intentionally reduced and task-focused.
 */
export type AuthShellProps = ShellAccessibilityProps &
  AuthShellSemanticProps &
  AuthShellAreas &
  AuthShellOwnProps;

/**
 * A focused shell for authentication and account-access pages.
 *
 * `AuthShell` should manage page-level structure and auth framing, including:
 * - skip-link support
 * - semantic landmarks
 * - minimal or centered layout
 * - optional split layout with supportive visual content
 * - optional branded/auth-specific header content
 *
 * It should not know about:
 * - specific form fields
 * - validation logic
 * - authentication providers
 * - domain-specific onboarding steps
 * - business-specific promotional content structure
 *
 * Strong guidance:
 * Keep this shell focused and distraction-light. If you find yourself adding
 * props for testimonials, pricing, feature grids, or campaign content, that
 * likely belongs in a higher-level marketing/auth template, not the shell.
 *
 * @todo Add support for `logo`, `heading`, `supportingContent`, `visual`,
 * `footer`, and `children` regions. Render them only when values are provided.
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
 * @todo Build the main layout around two primary modes:
 * - centered/focused auth layout
 * - split auth layout when `split === true`
 *
 * @todo In centered mode, render a constrained auth content container using:
 * - `alignment`
 * - `width`
 * - `card`
 * - `padded`
 *
 * @todo In split mode, render:
 * - a primary auth content region
 * - a secondary visual/supporting region
 * Use `visual` as the main secondary slot for the split side.
 *
 * @todo Decide how `supportingContent` should behave in both modes:
 * - stacked with the primary auth content
 * - or placed in a secondary content area near the form
 * Keep the behavior consistent and documented.
 *
 * @todo Translate `alignment`, `width`, `card`, `split`, `fullHeight`,
 * `padded`, and `divider` into stable CSS module class names.
 *
 * @todo Ensure the shell remains usable with no `logo`, no `heading`,
 * no `supportingContent`, and no `visual`.
 * The minimal case should still work cleanly for simple sign-in forms.
 *
 * @todo Keep `AuthShell` structural rather than business-specific.
 * Do not add props for provider lists, auth methods, legal agreements,
 * password requirements, or stepper logic. Those belong in organisms or
 * higher-level templates/content components.
 *
 * @todo Verify the component against at least four realistic layouts:
 * - simple sign-in page with centered card
 * - sign-up page with heading and supporting copy
 * - password reset page with minimal content
 * - split-layout auth page with a visual/brand panel
 *
 * @todo Add tests covering:
 * - default skip-link text
 * - resolved `mainId`
 * - conditional region rendering
 * - centered vs split layout class application
 * - width/alignment/card behavior
 * - landmark semantics
 */
export const AuthShell = ({ children, mainId }: AuthShellProps) => {
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
       * @todo Replace this placeholder structure with the actual auth-shell layout.
       *
       * Recommended render order:
       * 1. skip link
       * 2. outer auth layout wrapper
       * 3. optional split visual region (if `split`)
       * 4. primary auth content region
       * 5. logo
       * 6. heading
       * 7. supporting content
       * 8. main content landmark containing `children`
       * 9. footer
       *
       * Notes:
       * - only render optional regions when provided
       * - `children` belongs inside the main landmark
       * - the shell should stay minimal and task-focused
       * - auth content should remain easy to scan and complete
       */}
      {children}
    </div>
  );
};
