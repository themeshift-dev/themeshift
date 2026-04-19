import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/**
 * Visual tone options for the progress indicator fill.
 *
 * Example: `<ProgressBar tone="constructive" value={72} />`
 */
export type ProgressBarTone =
  | 'primary'
  | 'secondary'
  | 'constructive'
  | 'destructive';

/**
 * Size options for the track thickness.
 *
 * Example: `<ProgressBar size="large" value={48} />`
 */
export type ProgressBarSize = 'small' | 'medium' | 'large';

/**
 * Radius presets for the track and indicator corners.
 *
 * Example: `<ProgressBar radius="full" value={48} />`
 */
export type ProgressBarRadius = 'none' | 'small' | 'medium' | 'large' | 'full';

/**
 * Layout direction for the progress track.
 *
 * Example: `<ProgressBar orientation="vertical" value={48} />`
 */
export type ProgressBarOrientation = 'horizontal' | 'vertical';

/**
 * Formatter used by `valueFormatter` and `ProgressBar.Value format`.
 *
 * The callback receives `(value, max, min)` in that order.
 *
 * Example: `(value, max) => `${value} / ${max}``
 */
export type ProgressValueFormatter = (
  value: number,
  max: number,
  min: number
) => ReactNode;

/**
 * Internal polymorphic helper used by ProgressBar parts.
 */
type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  /**
   * HTML element or component to render instead of the default element.
   */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

/**
 * Normalized value state used internally by ProgressBar parts.
 */
export type ProgressBarValueState = {
  /**
   * Whether the bar is currently indeterminate.
   */
  isIndeterminate: boolean;

  /**
   * Resolved maximum value.
   */
  max: number;

  /**
   * Resolved minimum value.
   */
  min: number;

  /**
   * Normalized progress percentage from 0 to 100.
   */
  percent: number;

  /**
   * Resolved value clamped between `min` and `max`.
   */
  value: number;
};

/**
 * Shared state props accepted by root and value-driven subcomponents.
 */
export type ProgressBarSharedStateProps = {
  /**
   * Enables indeterminate mode when progress value is unknown.
   *
   * Tip: when true, numeric value output is hidden by default.
   */
  indeterminate?: boolean;

  /**
   * Maximum bound used to normalize value.
   */
  max?: number;

  /**
   * Minimum bound used to normalize value.
   */
  min?: number;

  /**
   * Current determinate value.
   */
  value?: number;
};

/**
 * Props for the ProgressBar root.
 */
export type ProgressBarOwnProps = ProgressBarSharedStateProps & {
  /**
   * Enables or disables indicator animation.
   */
  animated?: boolean;

  /**
   * Custom composition content.
   *
   * When provided, shorthand root props like `label` and `description` do not
   * auto-render subcomponents.
   */
  children?: ReactNode;

  /**
   * Additional class names applied to the root.
   */
  className?: string;

  /**
   * Optional helper text shown below the track in shorthand mode.
   */
  description?: ReactNode;

  /**
   * Visible label content shown above the track in shorthand mode.
   */
  label?: ReactNode;

  /**
   * Track orientation.
   */
  orientation?: ProgressBarOrientation;

  /**
   * Radius preset for track and indicator.
   */
  radius?: ProgressBarRadius;

  /**
   * Renders `ProgressBar.Value` automatically in shorthand mode.
   */
  showValue?: boolean;

  /**
   * Size preset for the track.
   */
  size?: ProgressBarSize;

  /**
   * Visual tone for the indicator fill.
   */
  tone?: ProgressBarTone;

  /**
   * Custom value output formatter used by shorthand value rendering.
   *
   * Example: `(value, max) => `${value} / ${max}``
   */
  valueFormatter?: ProgressValueFormatter;
};

/**
 * Props for `ProgressBar.Label`.
 */
export type ProgressBarLabelOwnProps = {
  /**
   * Label content.
   */
  children?: ReactNode;

  /**
   * Additional class names applied to the label.
   */
  className?: string;
};

/**
 * Props for `ProgressBar.Track`.
 */
export type ProgressBarTrackOwnProps = {
  /**
   * Track content.
   *
   * Defaults to `ProgressBar.Indicator` when omitted.
   */
  children?: ReactNode;

  /**
   * Additional class names applied to the track.
   */
  className?: string;

  /**
   * Adds a subtle inset effect by applying inner padding.
   */
  inset?: boolean;
};

/**
 * Props for `ProgressBar.Indicator`.
 */
export type ProgressBarIndicatorOwnProps = ProgressBarSharedStateProps & {
  /**
   * Overrides root `animated` for this indicator instance.
   */
  animated?: boolean;

  /**
   * Additional class names applied to the indicator.
   */
  className?: string;

  /**
   * Adds striped visual treatment to the fill.
   */
  striped?: boolean;
};

/**
 * Props for `ProgressBar.Value`.
 */
export type ProgressBarValueOwnProps = ProgressBarSharedStateProps & {
  /**
   * Custom value content.
   *
   * When provided, formatter and percent output are skipped.
   */
  children?: ReactNode;

  /**
   * Additional class names applied to the value text.
   */
  className?: string;

  /**
   * Custom formatter for value text.
   */
  format?: ProgressValueFormatter;

  /**
   * Appends `%` when using default percent output.
   */
  showPercentSign?: boolean;
};

/**
 * Props for `ProgressBar.Description`.
 */
export type ProgressBarDescriptionOwnProps = {
  /**
   * Description content.
   */
  children?: ReactNode;

  /**
   * Additional class names applied to the description.
   */
  className?: string;
};

/**
 * Public props for the ProgressBar root component.
 */
export type ProgressBarProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  ProgressBarOwnProps
>;

/**
 * Public props for `ProgressBar.Label`.
 */
export type ProgressBarLabelProps<T extends ElementType = 'span'> =
  PolymorphicProps<T, ProgressBarLabelOwnProps>;

/**
 * Public props for `ProgressBar.Track`.
 */
export type ProgressBarTrackProps<T extends ElementType = 'div'> =
  PolymorphicProps<T, ProgressBarTrackOwnProps>;

/**
 * Public props for `ProgressBar.Indicator`.
 */
export type ProgressBarIndicatorProps<T extends ElementType = 'div'> =
  PolymorphicProps<T, ProgressBarIndicatorOwnProps>;

/**
 * Public props for `ProgressBar.Value`.
 */
export type ProgressBarValueProps<T extends ElementType = 'span'> =
  PolymorphicProps<T, ProgressBarValueOwnProps>;

/**
 * Public props for `ProgressBar.Description`.
 */
export type ProgressBarDescriptionProps<T extends ElementType = 'p'> =
  PolymorphicProps<T, ProgressBarDescriptionOwnProps>;
