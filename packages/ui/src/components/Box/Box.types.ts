import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/**
 * Responsive breakpoint keys supported by layout primitives.
 *
 * `base` is the mobile-first default.
 */
export type Breakpoint = 'base' | 'tablet' | 'desktop';
export type BoxBreakpoint = Breakpoint;

/**
 * Accepts either one value for all breakpoints or per-breakpoint overrides.
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Space scale token keys.
 *
 * These map to `space.*` token values.
 */
export type SpaceToken =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24';

/**
 * Spacing prop value.
 *
 * Use token keys like `"4"` which maps to the `{space.4}` design token, or
 * raw CSS values like `"1rem"` / `16` as an escape hatch.
 */
export type SpacingValue = SpaceToken | string | number;

/**
 * Size prop value.
 *
 * Accepts CSS strings and numeric values.
 */
export type SizeValue = string | number;

export type AsProp<T extends ElementType> = {
  /**
   * Render a different element while keeping the same layout prop API.
   */
  as?: T;
};

export type PropsToOmit<T extends ElementType, Props> = keyof (AsProp<T> &
  Props);

export type PolymorphicProps<T extends ElementType, Props = object> = Props &
  AsProp<T> &
  Omit<ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>;

/**
 * Supported CSS display keywords for Box.
 */
export type DisplayValue =
  | 'block'
  | 'inline-block'
  | 'inline'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'none';

/**
 * Supported CSS overflow keywords.
 */
export type OverflowValue = 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

/**
 * Logical inline/main-axis distribution shortcuts.
 *
 * `between`, `around`, and `evenly` map to their `space-*` CSS variants.
 */
export type JustifyContentValue =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch';

/**
 * Logical cross-axis alignment keywords for container items.
 */
export type AlignItemsValue =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'baseline';

/**
 * Logical cross-axis alignment override for a single item.
 */
export type AlignSelfValue = 'start' | 'end' | 'center' | 'stretch';

/**
 * Logical inline-axis alignment override for a single item.
 */
export type JustifySelfValue = 'start' | 'end' | 'center' | 'stretch';

export type BoxOwnProps = {
  /**
   * Box contents.
   */
  children?: ReactNode;

  /**
   * Additional class names for custom styling hooks.
   */
  className?: string;

  /**
   * Display mode for the rendered element.
   */
  display?: ResponsiveValue<DisplayValue>;

  /**
   * Element height.
   */
  height?: ResponsiveValue<SizeValue>;

  /**
   * Margin on all sides.
   */
  margin?: ResponsiveValue<SpacingValue>;

  /**
   * Margin on block-end.
   */
  marginBottom?: ResponsiveValue<SpacingValue>;

  /**
   * Margin on inline-start.
   */
  marginLeft?: ResponsiveValue<SpacingValue>;

  /**
   * Margin on inline-end.
   */
  marginRight?: ResponsiveValue<SpacingValue>;

  /**
   * Margin on block-start.
   */
  marginTop?: ResponsiveValue<SpacingValue>;

  /**
   * Margin on the inline axis.
   */
  marginX?: ResponsiveValue<SpacingValue>;

  /**
   * Margin on the block axis.
   */
  marginY?: ResponsiveValue<SpacingValue>;

  /**
   * Maximum element height.
   */
  maxHeight?: ResponsiveValue<SizeValue>;

  /**
   * Maximum element width.
   */
  maxWidth?: ResponsiveValue<SizeValue>;

  /**
   * Minimum element height.
   */
  minHeight?: ResponsiveValue<SizeValue>;

  /**
   * Minimum element width.
   */
  minWidth?: ResponsiveValue<SizeValue>;

  /**
   * Overflow behavior on both axes.
   */
  overflow?: ResponsiveValue<OverflowValue>;

  /**
   * Overflow behavior on the inline axis.
   */
  overflowX?: ResponsiveValue<OverflowValue>;

  /**
   * Overflow behavior on the block axis.
   */
  overflowY?: ResponsiveValue<OverflowValue>;

  /**
   * Padding on all sides.
   */
  padding?: ResponsiveValue<SpacingValue>;

  /**
   * Padding on block-end.
   */
  paddingBottom?: ResponsiveValue<SpacingValue>;

  /**
   * Padding on inline-start.
   */
  paddingLeft?: ResponsiveValue<SpacingValue>;

  /**
   * Padding on inline-end.
   */
  paddingRight?: ResponsiveValue<SpacingValue>;

  /**
   * Padding on block-start.
   */
  paddingTop?: ResponsiveValue<SpacingValue>;

  /**
   * Padding on the inline axis.
   */
  paddingX?: ResponsiveValue<SpacingValue>;

  /**
   * Padding on the block axis.
   */
  paddingY?: ResponsiveValue<SpacingValue>;

  /**
   * Element width.
   */
  width?: ResponsiveValue<SizeValue>;
};

export type BoxProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  BoxOwnProps
>;
