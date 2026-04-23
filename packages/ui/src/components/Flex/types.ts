import type { ElementType } from 'react';

import type {
  AlignItemsValue,
  BoxOwnProps,
  JustifyContentValue,
  PolymorphicProps,
  ResponsiveValue,
  SpacingValue,
} from '@/components/Box';

/**
 * Direction options for flex item flow.
 */
export type FlexDirectionValue =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse';

/**
 * Wrapping behavior for flex items.
 */
export type FlexWrapValue = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Cross-axis line distribution in wrapped flex layouts.
 */
export type FlexAlignContentValue =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch';

export type FlexOwnProps = Omit<BoxOwnProps, 'display'> & {
  /**
   * Cross-axis alignment for direct children.
   */
  align?: ResponsiveValue<AlignItemsValue>;

  /**
   * Alignment between wrapped rows or columns.
   */
  alignContent?: ResponsiveValue<FlexAlignContentValue>;

  /**
   * Horizontal gap between columns in wrapped layouts.
   */
  columnGap?: ResponsiveValue<SpacingValue>;

  /**
   * Main layout direction for flex children.
   */
  direction?: ResponsiveValue<FlexDirectionValue>;

  /**
   * Gap between direct children.
   */
  gap?: ResponsiveValue<SpacingValue>;

  /**
   * Render as inline-flex when true.
   */
  inline?: ResponsiveValue<boolean>;

  /**
   * Main-axis distribution of children.
   */
  justify?: ResponsiveValue<JustifyContentValue>;

  /**
   * Vertical gap between wrapped rows.
   */
  rowGap?: ResponsiveValue<SpacingValue>;

  /**
   * Allows children to wrap to additional rows or columns.
   */
  wrap?: ResponsiveValue<FlexWrapValue>;
};

export type FlexProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  FlexOwnProps
>;
