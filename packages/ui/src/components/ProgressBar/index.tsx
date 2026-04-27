/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  createContext,
  type CSSProperties,
  type ElementType,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import styles from './ProgressBar.module.scss';
import type {
  ProgressBarDescriptionProps,
  ProgressBarIndicatorProps,
  ProgressBarLabelProps,
  ProgressBarOrientation,
  ProgressBarProps,
  ProgressBarRadius,
  ProgressBarSize,
  ProgressBarTone,
  ProgressBarTrackProps,
  ProgressBarValueProps,
  ProgressBarValueState,
  ProgressValueFormatter,
} from './types';

type NormalizedProgressState = ProgressBarValueState;

type ProgressBarContextValue = {
  animated: boolean;
  descriptionId: string;
  hasDescription: boolean;
  hasLabel: boolean;
  labelId: string;
  orientation: ProgressBarOrientation;
  registerDescription: () => void;
  registerLabel: () => void;
  radius: ProgressBarRadius;
  size: ProgressBarSize;
  tone: ProgressBarTone;
  unregisterDescription: () => void;
  unregisterLabel: () => void;
  valueFormatter?: ProgressValueFormatter;
  valueState: NormalizedProgressState;
};

type CSSVarStyle = CSSProperties & {
  '--progress-ratio'?: string;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_SIZE: ProgressBarSize = 'medium';
const DEFAULT_TONE: ProgressBarTone = 'primary';
const DEFAULT_RADIUS: ProgressBarRadius = 'full';
const DEFAULT_ORIENTATION: ProgressBarOrientation = 'horizontal';
const DEFAULT_ANIMATED = true;

const ProgressBarContext = createContext<ProgressBarContextValue | null>(null);

function hasRenderableContent(value: ReactNode) {
  return value !== null && value !== undefined;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeProgressState({
  indeterminate,
  max,
  min,
  value,
}: {
  indeterminate?: boolean;
  max?: number;
  min?: number;
  value?: number;
}): NormalizedProgressState {
  const resolvedMin = Number.isFinite(min) ? Number(min) : DEFAULT_MIN;
  const proposedMax = Number.isFinite(max) ? Number(max) : DEFAULT_MAX;
  const resolvedMax = proposedMax > resolvedMin ? proposedMax : resolvedMin + 1;
  const resolvedValue = Number.isFinite(value) ? Number(value) : resolvedMin;
  const clampedValue = clamp(resolvedValue, resolvedMin, resolvedMax);
  const range = resolvedMax - resolvedMin;
  const percent = range > 0 ? ((clampedValue - resolvedMin) / range) * 100 : 0;

  return {
    isIndeterminate: Boolean(indeterminate),
    max: resolvedMax,
    min: resolvedMin,
    percent: clamp(percent, 0, 100),
    value: clampedValue,
  };
}

function formatDefaultValue(
  valueState: NormalizedProgressState,
  showPercentSign: boolean
) {
  const roundedPercent = Math.round(valueState.percent);

  return showPercentSign ? `${roundedPercent}%` : `${roundedPercent}`;
}

function getTextValue(value: ReactNode) {
  if (typeof value === 'string' || typeof value === 'number') {
    return `${value}`;
  }

  return undefined;
}

function resolveValueState(
  contextValueState: NormalizedProgressState | undefined,
  overrides: {
    indeterminate?: boolean;
    max?: number;
    min?: number;
    value?: number;
  }
) {
  if (
    overrides.indeterminate === undefined &&
    overrides.max === undefined &&
    overrides.min === undefined &&
    overrides.value === undefined
  ) {
    return contextValueState ?? normalizeProgressState({});
  }

  return normalizeProgressState({
    indeterminate:
      overrides.indeterminate ?? contextValueState?.isIndeterminate,
    max: overrides.max ?? contextValueState?.max,
    min: overrides.min ?? contextValueState?.min,
    value: overrides.value ?? contextValueState?.value,
  });
}

export const ProgressBarLabel = <T extends ElementType = 'span'>({
  as,
  children,
  className,
  ...labelProps
}: ProgressBarLabelProps<T>) => {
  const contextValue = useContext(ProgressBarContext);
  const Component = as ?? 'span';
  const hasContent = hasRenderableContent(children);

  useEffect(() => {
    if (!contextValue || !hasContent) {
      return undefined;
    }

    contextValue.registerLabel();

    return () => {
      contextValue.unregisterLabel();
    };
  }, [contextValue, hasContent]);

  if (!hasContent) {
    return null;
  }

  return (
    <Component
      {...labelProps}
      className={classNames(styles.label, className)}
      id={contextValue?.labelId}
    >
      {children}
    </Component>
  );
};

export const ProgressBarTrack = <T extends ElementType = 'div'>({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-valuetext': ariaValueText,
  as,
  children,
  className,
  inset = false,
  ...trackProps
}: ProgressBarTrackProps<T>) => {
  const contextValue = useContext(ProgressBarContext);
  const Component = as ?? 'div';
  const valueState = contextValue?.valueState ?? normalizeProgressState({});
  const formatter = contextValue?.valueFormatter;

  const derivedValueText =
    formatter && !valueState.isIndeterminate
      ? getTextValue(
          formatter(valueState.value, valueState.max, valueState.min)
        )
      : undefined;

  const resolvedAriaLabelledBy =
    ariaLabel || ariaLabelledBy
      ? ariaLabelledBy
      : contextValue?.hasLabel
        ? contextValue.labelId
        : undefined;

  const resolvedAriaDescribedBy =
    ariaDescribedBy ??
    (contextValue?.hasDescription ? contextValue.descriptionId : undefined);

  const resolvedValueText = ariaValueText ?? derivedValueText;

  return (
    <Component
      {...trackProps}
      aria-describedby={resolvedAriaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={resolvedAriaLabelledBy}
      aria-valuemax={valueState.max}
      aria-valuemin={valueState.min}
      aria-valuenow={
        valueState.isIndeterminate ? undefined : Number(valueState.value)
      }
      aria-valuetext={resolvedValueText}
      className={classNames(
        styles.track,
        inset && styles.trackInset,
        className
      )}
      role="progressbar"
    >
      {children ?? <ProgressBarIndicator />}
    </Component>
  );
};

export const ProgressBarIndicator = <T extends ElementType = 'div'>({
  animated,
  as,
  className,
  indeterminate,
  max,
  min,
  striped = false,
  value,
  ...indicatorProps
}: ProgressBarIndicatorProps<T>) => {
  const contextValue = useContext(ProgressBarContext);
  const Component = as ?? 'div';
  const valueState = resolveValueState(contextValue?.valueState, {
    indeterminate,
    max,
    min,
    value,
  });

  const resolvedAnimated =
    animated ?? contextValue?.animated ?? DEFAULT_ANIMATED;
  const resolvedOrientation = contextValue?.orientation ?? DEFAULT_ORIENTATION;

  const indicatorStyle: CSSVarStyle = {
    ...(indicatorProps.style ?? {}),
    '--progress-ratio': `${valueState.percent / 100}`,
  };

  return (
    <Component
      {...indicatorProps}
      aria-hidden="true"
      className={classNames(
        styles.indicator,
        striped && styles.indicatorStriped,
        valueState.isIndeterminate && styles.indeterminate,
        valueState.isIndeterminate &&
          resolvedAnimated &&
          (resolvedOrientation === 'vertical'
            ? styles.indeterminateVerticalAnimated
            : styles.indeterminateHorizontalAnimated),
        className
      )}
      style={indicatorStyle}
    />
  );
};

export const ProgressBarValue = <T extends ElementType = 'span'>({
  as,
  children,
  className,
  format,
  indeterminate,
  max,
  min,
  showPercentSign = true,
  value,
  ...valueProps
}: ProgressBarValueProps<T>) => {
  const contextValue = useContext(ProgressBarContext);
  const Component = as ?? 'span';
  const valueState = resolveValueState(contextValue?.valueState, {
    indeterminate,
    max,
    min,
    value,
  });

  if (valueState.isIndeterminate && !hasRenderableContent(children)) {
    return null;
  }

  const resolvedFormatter = format ?? contextValue?.valueFormatter;

  const renderedValue = hasRenderableContent(children)
    ? children
    : resolvedFormatter
      ? resolvedFormatter(valueState.value, valueState.max, valueState.min)
      : formatDefaultValue(valueState, showPercentSign);

  if (!hasRenderableContent(renderedValue)) {
    return null;
  }

  return (
    <Component {...valueProps} className={classNames(styles.value, className)}>
      {renderedValue}
    </Component>
  );
};

export const ProgressBarDescription = <T extends ElementType = 'p'>({
  as,
  children,
  className,
  ...descriptionProps
}: ProgressBarDescriptionProps<T>) => {
  const contextValue = useContext(ProgressBarContext);
  const Component = as ?? 'p';
  const hasContent = hasRenderableContent(children);

  useEffect(() => {
    if (!contextValue || !hasContent) {
      return undefined;
    }

    contextValue.registerDescription();

    return () => {
      contextValue.unregisterDescription();
    };
  }, [contextValue, hasContent]);

  if (!hasContent) {
    return null;
  }

  return (
    <Component
      {...descriptionProps}
      className={classNames(styles.description, className)}
      id={contextValue?.descriptionId}
    >
      {children}
    </Component>
  );
};

const sizeClassMap: Record<ProgressBarSize, string> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

const toneClassMap: Record<ProgressBarTone, string> = {
  primary: styles.tonePrimary,
  secondary: styles.toneSecondary,
  constructive: styles.toneConstructive,
  destructive: styles.toneDestructive,
};

const radiusClassMap: Record<ProgressBarRadius, string> = {
  none: styles.radiusNone,
  small: styles.radiusSmall,
  medium: styles.radiusMedium,
  large: styles.radiusLarge,
  full: styles.radiusFull,
};

const orientationClassMap: Record<ProgressBarOrientation, string> = {
  horizontal: styles.horizontal,
  vertical: styles.vertical,
};

export const ProgressBarRoot = <T extends ElementType = 'div'>({
  animated = DEFAULT_ANIMATED,
  as,
  children,
  className,
  description,
  id,
  indeterminate,
  label,
  max,
  min,
  orientation = DEFAULT_ORIENTATION,
  radius = DEFAULT_RADIUS,
  showValue = false,
  size = DEFAULT_SIZE,
  tone = DEFAULT_TONE,
  value,
  valueFormatter,
  ...progressBarProps
}: ProgressBarProps<T>) => {
  const Component = as ?? 'div';
  const reactId = useId();
  const rootId = id ?? `progress-${reactId}`;
  const descriptionId = `${rootId}-description`;
  const labelId = `${rootId}-label`;

  const [descriptionRegistrations, setDescriptionRegistrations] = useState(0);
  const [labelRegistrations, setLabelRegistrations] = useState(0);
  const hasChildren = hasRenderableContent(children);

  const valueState = useMemo(
    () =>
      normalizeProgressState({
        indeterminate,
        max,
        min,
        value,
      }),
    [indeterminate, max, min, value]
  );

  const registerDescription = useCallback(() => {
    setDescriptionRegistrations((count) => count + 1);
  }, []);

  const registerLabel = useCallback(() => {
    setLabelRegistrations((count) => count + 1);
  }, []);

  const unregisterDescription = useCallback(() => {
    setDescriptionRegistrations((count) => Math.max(0, count - 1));
  }, []);

  const unregisterLabel = useCallback(() => {
    setLabelRegistrations((count) => Math.max(0, count - 1));
  }, []);

  const hasDescription =
    (!hasChildren && hasRenderableContent(description)) ||
    descriptionRegistrations > 0;
  const hasLabel =
    (!hasChildren && hasRenderableContent(label)) || labelRegistrations > 0;

  const contextValue = useMemo(
    () => ({
      animated,
      descriptionId,
      hasDescription,
      hasLabel,
      labelId,
      orientation,
      radius,
      registerDescription,
      registerLabel,
      size,
      tone,
      unregisterDescription,
      unregisterLabel,
      valueFormatter,
      valueState,
    }),
    [
      animated,
      descriptionId,
      hasDescription,
      hasLabel,
      labelId,
      orientation,
      radius,
      size,
      tone,
      valueFormatter,
      valueState,
      registerDescription,
      registerLabel,
      unregisterDescription,
      unregisterLabel,
    ]
  );

  const shouldRenderAutoValue =
    !hasChildren && showValue && !valueState.isIndeterminate;

  const defaultChildren = (
    <>
      {hasRenderableContent(label) ? (
        <ProgressBarLabel>{label}</ProgressBarLabel>
      ) : null}
      <ProgressBarTrack>
        <ProgressBarIndicator />
      </ProgressBarTrack>
      {shouldRenderAutoValue ? (
        <ProgressBarValue format={valueFormatter} />
      ) : null}
      {hasRenderableContent(description) ? (
        <ProgressBarDescription>{description}</ProgressBarDescription>
      ) : null}
    </>
  );

  return (
    <ProgressBarContext.Provider value={contextValue}>
      <Component
        {...progressBarProps}
        className={classNames(
          styles.container,
          sizeClassMap[size],
          toneClassMap[tone],
          radiusClassMap[radius],
          orientationClassMap[orientation],
          className
        )}
        data-orientation={orientation}
        id={rootId}
      >
        {hasChildren ? children : defaultChildren}
      </Component>
    </ProgressBarContext.Provider>
  );
};

type ProgressBarComponent = (<T extends ElementType = 'div'>(
  props: ProgressBarProps<T>
) => React.JSX.Element) & {
  Description: typeof ProgressBarDescription;
  Indicator: typeof ProgressBarIndicator;
  Label: typeof ProgressBarLabel;
  Track: typeof ProgressBarTrack;
  Value: typeof ProgressBarValue;
};

export const ProgressBar = Object.assign(ProgressBarRoot, {
  Description: ProgressBarDescription,
  Indicator: ProgressBarIndicator,
  Label: ProgressBarLabel,
  Track: ProgressBarTrack,
  Value: ProgressBarValue,
}) as ProgressBarComponent;

export { normalizeProgressState };

export type {
  ProgressBarDescriptionProps,
  ProgressBarIndicatorProps,
  ProgressBarLabelProps,
  ProgressBarOrientation,
  ProgressBarProps,
  ProgressBarRadius,
  ProgressBarSize,
  ProgressBarTone,
  ProgressBarTrackProps,
  ProgressBarValueProps,
  ProgressBarValueState,
  ProgressValueFormatter,
} from './types';
