import classNames from 'classnames';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import styles from './Responsive.module.scss';

/** Supported responsive breakpoints. */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/** Controls when content should be visible across breakpoints. */
export type ResponsiveWhen = {
  /**
   * Shows content above a breakpoint, excluding the breakpoint itself.
   *
   * Example: `<Responsive when={{ above: 'mobile' }} />`
   */
  above?: Breakpoint;

  /**
   * Shows content below a breakpoint, excluding the breakpoint itself.
   *
   * Example: `<Responsive when={{ below: 'desktop' }} />`
   */
  below?: Breakpoint;

  /**
   * Shows content from a breakpoint and up, including the breakpoint itself.
   *
   * Example: `<Responsive when={{ from: 'tablet' }} />`
   */
  from?: Breakpoint;

  /**
   * Shows content up to a breakpoint, including the breakpoint itself.
   *
   * Example: `<Responsive when={{ to: 'tablet' }} />`
   */
  to?: Breakpoint;
};

/** Shared props for the responsive visibility wrapper. */
type ResponsiveOwnProps = {
  /** Content that should be conditionally shown. */
  children?: ReactNode;

  /** Additional class names to append to the rendered element. */
  className?: string;

  /** Breakpoint rule used to control visibility. */
  when: ResponsiveWhen;
};

type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

export type ResponsiveProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  ResponsiveOwnProps
>;

type ResponsiveVisibility =
  | 'mobileOnly'
  | 'tabletOnly'
  | 'desktopOnly'
  | 'belowDesktop'
  | 'fromTablet'
  | null;

const breakpointOrder: Breakpoint[] = ['mobile', 'tablet', 'desktop'];
const visibilityClassMap: Record<
  Exclude<ResponsiveVisibility, null>,
  string
> = {
  mobileOnly: styles.mobileOnly,
  tabletOnly: styles.tabletOnly,
  desktopOnly: styles.desktopOnly,
  belowDesktop: styles.belowDesktop,
  fromTablet: styles.fromTablet,
};

function warnInvalidWhen(message: string) {
  if (import.meta.env?.DEV) {
    console.warn(`[Responsive] ${message}`);
  }
}

function getBreakpointIndex(breakpoint: Breakpoint) {
  return breakpointOrder.indexOf(breakpoint);
}

function normalizeWhen(when: ResponsiveWhen): ResponsiveVisibility {
  if (when.from && when.above) {
    warnInvalidWhen('Use either `from` or `above`, not both.');
    return null;
  }

  if (when.to && when.below) {
    warnInvalidWhen('Use either `to` or `below`, not both.');
    return null;
  }

  const lowerBound = when.from
    ? getBreakpointIndex(when.from)
    : when.above
      ? getBreakpointIndex(when.above) + 1
      : 0;

  const upperBound = when.to
    ? getBreakpointIndex(when.to)
    : when.below
      ? getBreakpointIndex(when.below) - 1
      : breakpointOrder.length - 1;

  if (lowerBound < 0 || lowerBound >= breakpointOrder.length) {
    warnInvalidWhen('The provided lower breakpoint is out of range.');
    return null;
  }

  if (upperBound < 0 || upperBound >= breakpointOrder.length) {
    warnInvalidWhen('The provided upper breakpoint is out of range.');
    return null;
  }

  if (lowerBound > upperBound) {
    warnInvalidWhen('The provided breakpoint range is impossible.');
    return null;
  }

  if (lowerBound === 0 && upperBound === 2) {
    return null;
  }

  if (lowerBound === 0 && upperBound === 0) {
    return 'mobileOnly';
  }

  if (lowerBound === 1 && upperBound === 1) {
    return 'tabletOnly';
  }

  if (lowerBound === 2 && upperBound === 2) {
    return 'desktopOnly';
  }

  if (lowerBound === 0 && upperBound === 1) {
    return 'belowDesktop';
  }

  if (lowerBound === 1 && upperBound === 2) {
    return 'fromTablet';
  }

  warnInvalidWhen('The provided breakpoint combination is unsupported.');
  return null;
}

/** Shows or hides content based on the provided breakpoint rules. */
export const Responsive = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  when,
  ...props
}: ResponsiveProps<T>) => {
  const Component = as ?? 'div';
  const visibility = normalizeWhen(when);

  return (
    <Component
      {...props}
      className={classNames(
        styles.root,
        visibility && visibilityClassMap[visibility],
        className
      )}
    >
      {children}
    </Component>
  );
};
