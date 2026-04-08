import type { ReactNode, ElementType } from 'react';

/**
 * Shared accessibility props for shell components.
 *
 * These props exist to make shell-level accessibility consistent across all
 * page/frame components in the system.
 *
 * Design note:
 * Shells should provide safe defaults wherever possible. In particular,
 * `mainId` is used as the target for the skip link, so consumers should not
 * need to wire those two concepts together manually in most cases.
 */
export type ShellAccessibilityProps = {
  /**
   * Accessible text for the skip link.
   *
   * This should usually default to something like:
   * `"Skip to main content"`
   *
   * End-user guidance:
   * Only override this when the shell's primary content area has a meaningfully
   * different label that would help keyboard and assistive technology users.
   */
  skipLinkLabel?: string;

  /**
   * The `id` applied to the main content region.
   *
   * This is also used to generate the skip-link destination.
   *
   * End-user guidance:
   * In most cases you should not need to provide this manually. A default such
   * as `"main-content"` is generally appropriate.
   */
  mainId?: string;
};

/**
 * Shared structural slots for shell components.
 *
 * These represent the major page regions a shell may expose. Individual shell
 * components should use `Pick<>` to opt into only the regions they actually
 * support.
 *
 * Design note:
 * This shared type is intentionally broader than any one shell. For example,
 * `PageShell` may support `aside` but not `sidebar`, while `AppShell` may
 * support both.
 *
 * Important:
 * Shells are structural frames, not business-specific templates. These slots
 * should stay generic and layout-oriented.
 */
export type ShellStructuralSlots = {
  /**
   * Content rendered in the page header/banner region.
   *
   * Examples:
   * - site header
   * - brand bar
   * - page-level masthead
   */
  header?: ReactNode;

  /**
   * Content rendered inside the primary navigation landmark.
   *
   * Examples:
   * - top navigation
   * - section navigation
   * - breadcrumb-adjacent navigation groups
   */
  navigation?: ReactNode;

  /**
   * Content rendered in a sidebar region.
   *
   * This is more likely to be used by shells such as `AppShell` than
   * `PageShell`.
   *
   * Examples:
   * - persistent app navigation
   * - filter rail
   * - workspace tools
   */
  sidebar?: ReactNode;

  /**
   * Content rendered in a complementary/secondary region.
   *
   * Examples:
   * - related links
   * - contextual help
   * - supporting metadata
   * - secondary callouts
   */
  aside?: ReactNode;

  /**
   * Content rendered in the page footer/contentinfo region.
   */
  footer?: ReactNode;

  /**
   * The primary page content.
   *
   * This is the most important slot in the shell and is usually rendered inside
   * the main landmark.
   */
  children: ReactNode;
};

/**
 * Shared semantic and landmark-related props for shell components.
 *
 * These props allow consumers to adjust semantic HTML or accessible landmark
 * labeling without changing the shell's structural intent.
 *
 * Design note:
 * Semantic flexibility is useful, but should be introduced carefully. Shells
 * should prefer strong defaults over excessive polymorphism.
 */
export type ShellSemanticProps = {
  /**
   * The outer wrapper element type for the shell.
   *
   * Common values:
   * - `'div'`
   * - `'section'`
   * - custom layout component
   *
   * Guidance:
   * Prefer using the default unless you have a specific semantic or integration
   * reason to change it.
   */
  as?: ElementType;

  /**
   * The element type used for the main content region.
   *
   * This will usually remain `'main'`.
   *
   * Guidance:
   * Override only when the shell is being embedded in a context where a
   * top-level `main` landmark would be invalid or undesirable.
   */
  mainAs?: ElementType;

  /**
   * Optional accessible label for the main content landmark.
   *
   * This is usually unnecessary when there is only one obvious main region,
   * but can help clarify purpose in more complex page compositions.
   */
  mainLabel?: string;

  /**
   * Optional accessible label for the navigation landmark.
   *
   * Example values:
   * - `"Primary"`
   * - `"Section"`
   * - `"Documentation"`
   */
  navLabel?: string;

  /**
   * Optional accessible label for a sidebar landmark.
   *
   * This is defined in the shared type even if not every shell uses it.
   */
  sidebarLabel?: string;
};
