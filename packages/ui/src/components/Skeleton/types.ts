/**
 * Animation options for Skeleton placeholders.
 */
export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

/**
 * Props for the base Skeleton block.
 *
 * Skeleton elements are purely decorative. The component always renders with
 * `aria-hidden` so it won't be announced by assistive technology.
 *
 * To communicate loading state, set `aria-busy` on the region that is loading
 * and keep real content in the DOM when possible.
 */
export type SkeletonRootProps = {
  /**
   * Additional class names for custom styling.
   */
  className?: string;

  /**
   * Controls rendered size of the element.
   *
   * When set, this overrides both `height` and `width`.
   *
   * Numbers are interpreted as pixels. Strings can be any valid CSS length
   * value (for example `"2rem"`).
   */
  size?: number | string;

  /**
   * Controls rendered height of the element.
   *
   * Numbers are interpreted as pixels. Strings can be any valid CSS length
   * value (for example `"1.25rem"`).
   */
  height?: number | string;

  /**
   * Controls rendered width of the element.
   *
   * Numbers are interpreted as pixels. Strings can be any valid CSS length
   * value (for example `"50%"`).
   */
  width?: number | string;

  /**
   * Applies border radius to the element.
   *
   * Numbers are interpreted as pixels. Strings can be any valid CSS length
   * value (for example `"9999px"`).
   */
  radius?: number | string;

  /**
   * When set, the element renders as a circle.
   *
   * This overrides `radius`.
   */
  circle?: boolean;

  /**
   * Controls the animation used.
   *
   * Use `"none"` for static placeholders. Animations are also disabled when the
   * user enables reduced motion.
   */
  animation?: SkeletonAnimation;
} & React.ComponentPropsWithoutRef<'div'>;

/**
 * Props for an avatar-shaped Skeleton placeholder.
 */
export type SkeletonAvatarProps = {
  /**
   * When set, the element renders as a circle.
   */
  circle?: boolean;

  /**
   * Additional class names for custom styling.
   */
  className?: string;

  /**
   * Controls rendered size of the element.
   *
   * When set, this overrides both `height` and `width`.
   *
   * Numbers are interpreted as pixels. Strings can be any valid CSS length
   * value (for example `"3rem"`).
   */
  size?: number | string;

  /**
   * Controls the animation used.
   */
  animation?: SkeletonAnimation;
} & React.ComponentPropsWithoutRef<'div'>;

/**
 * Props for a multi-line text Skeleton placeholder.
 *
 * The container is a single decorative element (it always renders with
 * `aria-hidden`). If you need attributes on the individual lines (for example
 * `data-testid`), use `lineProps`.
 */
export type SkeletonTextProps = {
  /**
   * Additional class names for custom styling.
   */
  className?: string;

  /**
   * Space between lines.
   *
   * Numbers are interpreted as pixels. Strings can be any valid CSS length
   * value (for example `"0.75rem"`).
   */
  gap?: number | string;

  /**
   * Height of each line.
   *
   * Numbers are interpreted as pixels. Strings can be any valid CSS length
   * value (for example `"1em"`).
   */
  lineHeight?: number | string;

  /**
   * Border radius applied to each line.
   *
   * Numbers are interpreted as pixels. Strings can be any valid CSS length
   * value.
   */
  lineRadius?: number | string;

  /**
   * Additional props applied to each rendered skeleton line.
   */
  lineProps?: Omit<
    SkeletonRootProps,
    'animation' | 'children' | 'circle' | 'height' | 'radius' | 'size' | 'width'
  >;

  /**
   * Width of the last line.
   *
   * This is typically used to mimic the ragged edge of a paragraph.
   */
  lastLineWidth?: number | string;

  /**
   * Number of lines to render.
   */
  lines?: number;

  /**
   * Controls the animation used.
   *
   * Use `"none"` for static placeholders. Animations are also disabled when the
   * user enables reduced motion.
   */
  animation?: SkeletonAnimation;
} & React.ComponentPropsWithoutRef<'div'>;
