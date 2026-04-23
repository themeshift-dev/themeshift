import type { ElementType, ReactNode } from 'react';

import type {
  AlignItemsValue,
  AlignSelfValue,
  BoxOwnProps,
  JustifyContentValue,
  JustifySelfValue,
  PolymorphicProps,
  ResponsiveValue,
  SizeValue,
  SpacingValue,
} from '@/components/Box';

/**
 * Auto-placement direction and density behavior.
 */
export type GridAutoFlowValue =
  | 'row'
  | 'column'
  | 'dense'
  | 'row dense'
  | 'column dense';

/**
 * Child alignment options for `justify-items` and `align-items`.
 */
export type GridItemsAlignmentValue = 'start' | 'end' | 'center' | 'stretch';

/**
 * Content alignment options for `justify-content` and `align-content`.
 */
export type GridContentAlignmentValue =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch';

/**
 * Grid track value.
 *
 * Numbers map to equal `repeat(n, minmax(0, 1fr))` tracks where supported.
 */
export type GridTrackValue = number | string;

export type GridOwnProps = Omit<BoxOwnProps, 'display'> & {
  /**
   * Alignment of the full grid content block on the block axis.
   */
  alignContent?: ResponsiveValue<GridContentAlignmentValue>;

  /**
   * Default block-axis alignment for grid children.
   */
  alignItems?: ResponsiveValue<AlignItemsValue>;

  /**
   * Size for implicitly-created columns.
   */
  autoColumns?: ResponsiveValue<SizeValue>;

  /**
   * Auto-placement flow for implicit item placement.
   */
  autoFlow?: ResponsiveValue<GridAutoFlowValue>;

  /**
   * Size for implicitly-created rows.
   */
  autoRows?: ResponsiveValue<SizeValue>;

  /**
   * Gap between grid columns.
   */
  columnGap?: ResponsiveValue<SpacingValue>;

  /**
   * Grid column tracks.
   *
   * Numeric values create equal-width tracks.
   */
  columns?: ResponsiveValue<GridTrackValue>;

  /**
   * Gap between rows and columns.
   */
  gap?: ResponsiveValue<SpacingValue>;

  /**
   * Render as inline-grid when true.
   */
  inline?: ResponsiveValue<boolean>;

  /**
   * Alignment of the full grid content block on the inline axis.
   */
  justifyContent?: ResponsiveValue<JustifyContentValue>;

  /**
   * Default inline-axis alignment for grid children.
   */
  justifyItems?: ResponsiveValue<GridItemsAlignmentValue>;

  /**
   * Gap between grid rows.
   */
  rowGap?: ResponsiveValue<SpacingValue>;

  /**
   * Grid row tracks.
   *
   * Numeric values create equal-height tracks.
   */
  rows?: ResponsiveValue<GridTrackValue>;

  /**
   * Named area layout string.
   */
  templateAreas?: ResponsiveValue<string>;

  /**
   * Explicit grid-template-columns value.
   *
   * This takes precedence over `columns`.
   */
  templateColumns?: ResponsiveValue<string>;

  /**
   * Explicit grid-template-rows value.
   *
   * This takes precedence over `rows`.
   */
  templateRows?: ResponsiveValue<string>;
};

export type GridProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  GridOwnProps
>;

export type GridItemOwnProps = {
  /**
   * Block-axis alignment override for this item.
   */
  alignSelf?: ResponsiveValue<AlignSelfValue>;

  /**
   * Named area assignment for this item.
   */
  area?: ResponsiveValue<string>;

  /**
   * Grid item content.
   */
  children?: ReactNode;

  /**
   * Additional class names for custom styling hooks.
   */
  className?: string;

  /**
   * Direct grid-column value.
   *
   * If provided, this overrides `columnSpan`.
   */
  column?: ResponsiveValue<string>;

  /**
   * Grid column end line.
   */
  columnEnd?: ResponsiveValue<number | string>;

  /**
   * Column span shortcut.
   *
   * Use `'full'` for `1 / -1`.
   */
  columnSpan?: ResponsiveValue<number | 'full'>;

  /**
   * Grid column start line.
   */
  columnStart?: ResponsiveValue<number | string>;

  /**
   * Inline-axis alignment override for this item.
   */
  justifySelf?: ResponsiveValue<JustifySelfValue>;

  /**
   * Direct grid-row value.
   *
   * If `rowSpan` is also provided, span takes precedence.
   */
  row?: ResponsiveValue<string>;

  /**
   * Grid row end line.
   */
  rowEnd?: ResponsiveValue<number | string>;

  /**
   * Row span shortcut.
   */
  rowSpan?: ResponsiveValue<number>;

  /**
   * Grid row start line.
   */
  rowStart?: ResponsiveValue<number | string>;
};

export type GridItemProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  GridItemOwnProps
>;
