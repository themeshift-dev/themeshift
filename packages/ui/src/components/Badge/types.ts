import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** Visual tone options for status-style badges. */
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** Variant options used with semantic tones. */
export type BadgeVariant = 'soft' | 'solid' | 'outline';

/** Curated color options for category-style badges. */
export type BadgeColor =
  | 'gray'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'pink'
  | 'purple';

/** Size options for the base badge. */
export type BadgeSize = 'small' | 'medium';

/** Logical placement options for Badge.Count overlays. */
export type BadgeCountPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

/** Shared props for the base badge. */
type BadgeBaseProps = {
  /**
   * Applies badge styles to a single child element instead of rendering a
   * native span.
   */
  asChild?: boolean;

  /** Badge content, typically short text metadata. */
  children: ReactNode;

  /** Additional class names to append to the rendered element. */
  className?: string;

  /** Optional icon shown beside the badge label. */
  icon?: ReactNode;

  /** Position of the icon relative to label text. */
  iconPosition?: 'start' | 'end';

  /** Visual size for spacing and typography. */
  size?: BadgeSize;
};

type BadgeToneVariantProps = {
  /** Preset semantic tone for status-style badges. */
  tone?: BadgeTone;

  /** Visual treatment used with semantic tones. */
  variant?: BadgeVariant;

  /** Use `tone` + `variant` mode instead. */
  color?: never;
};

type BadgeColorProps = {
  /** Curated color for category-style badges. */
  color: BadgeColor;

  /** Use `color` mode instead. */
  tone?: never;

  /** Use `color` mode instead. */
  variant?: never;
};

type BadgeAsSpanProps = {
  asChild?: false;
  children: ReactNode;
};

type BadgeAsChildProps = {
  asChild: true;
  children: ReactElement;
};

type BadgeNativeProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  keyof BadgeBaseProps | 'children'
>;

/** Props for the Badge root component. */
export type BadgeRootProps = BadgeBaseProps &
  BadgeNativeProps &
  (BadgeToneVariantProps | BadgeColorProps) &
  (BadgeAsSpanProps | BadgeAsChildProps);

/** Props for the Badge.Count subcomponent. */
export type BadgeCountProps = {
  /**
   * Optional anchor content. When provided, the indicator is positioned over
   * this content.
   */
  children?: ReactNode;

  /** Additional class names to append to the rendered element. */
  className?: string;

  /** Numeric count to display. */
  count?: number;

  /** Displays a small dot instead of numeric text. */
  dot?: boolean;

  /** Upper bound used to display compact overflow labels (for example, `99+`). */
  max?: number;

  /** Logical placement for anchored indicators. */
  placement?: BadgeCountPlacement;

  /** Shows `0` when count is zero. */
  showZero?: boolean;

  /** Displays a centered text dot (`•`) in a standard count pill. */
  textDot?: boolean;
} & ComponentPropsWithoutRef<'span'>;
