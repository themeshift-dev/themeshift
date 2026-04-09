import classNames from 'classnames';
import type { ElementType, ReactNode } from 'react';

import { SkipLink } from '@/components';
import type {
  ShellAccessibilityProps,
  ShellSemanticProps,
  ShellStructuralSlots,
} from '@/templates';
import { resolveShellA11yProps } from '@/templates/utils';

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
 */
export const AuthShell = ({
  alignment = 'center',
  as,
  card = false,
  children,
  divider = false,
  footer,
  fullHeight = true,
  heading,
  logo,
  mainAs,
  mainId,
  mainLabel,
  padded = true,
  skipLinkLabel,
  split = false,
  supportingContent,
  visual,
  width = 'content',
}: AuthShellProps) => {
  const Component = (as ?? 'div') as ElementType;
  const MainComponent = (mainAs ?? 'main') as ElementType;
  const resolvedA11y = resolveShellA11yProps({ mainId, skipLinkLabel });

  return (
    <Component
      className={classNames(
        styles.container,
        fullHeight && styles.fullHeight,
        padded && styles.padded,
        split ? styles.split : styles.centered,
        alignment === 'start' ? styles.alignStart : styles.alignCenter
      )}
    >
      <SkipLink
        href={resolvedA11y.skipLinkHref}
        label={resolvedA11y.skipLinkLabel}
      />

      <div
        className={classNames(
          styles.layout,
          split && styles.splitLayout,
          divider && split && styles.splitDivider
        )}
      >
        <MainComponent
          id={resolvedA11y.mainId}
          aria-label={mainLabel}
          className={styles.main}
        >
          <div
            className={classNames(
              styles.mainInner,
              width === 'narrow' && styles.widthNarrow,
              width === 'content' && styles.widthContent,
              width === 'wide' && styles.widthWide,
              card && styles.card
            )}
          >
            {logo ? <div className={styles.logo}>{logo}</div> : null}
            {heading ? <div className={styles.heading}>{heading}</div> : null}
            {supportingContent ? (
              <div className={styles.supportingContent}>
                {supportingContent}
              </div>
            ) : null}
            <div className={styles.content}>{children}</div>
          </div>
        </MainComponent>

        {split && visual ? (
          <aside className={styles.visual} aria-hidden="true">
            <div className={styles.visualInner}>{visual}</div>
          </aside>
        ) : null}
      </div>

      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </Component>
  );
};
