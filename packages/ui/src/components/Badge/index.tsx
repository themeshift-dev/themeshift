/* eslint-disable react-refresh/only-export-components */
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

import styles from './Badge.module.scss';
import type {
  BadgeColor,
  BadgeCountPlacement,
  BadgeCountProps,
  BadgeRootProps,
  BadgeSize,
  BadgeTone,
  BadgeVariant,
} from './types';

const toneClassMap = {
  neutral: {
    soft: styles.toneNeutralSoft,
    solid: styles.toneNeutralSolid,
    outline: styles.toneNeutralOutline,
  },
  info: {
    soft: styles.toneInfoSoft,
    solid: styles.toneInfoSolid,
    outline: styles.toneInfoOutline,
  },
  success: {
    soft: styles.toneSuccessSoft,
    solid: styles.toneSuccessSolid,
    outline: styles.toneSuccessOutline,
  },
  warning: {
    soft: styles.toneWarningSoft,
    solid: styles.toneWarningSolid,
    outline: styles.toneWarningOutline,
  },
  danger: {
    soft: styles.toneDangerSoft,
    solid: styles.toneDangerSolid,
    outline: styles.toneDangerOutline,
  },
} satisfies Record<BadgeTone, Record<BadgeVariant, string>>;

const colorClassMap = {
  gray: styles.colorGray,
  blue: styles.colorBlue,
  green: styles.colorGreen,
  yellow: styles.colorYellow,
  orange: styles.colorOrange,
  red: styles.colorRed,
  pink: styles.colorPink,
  purple: styles.colorPurple,
} satisfies Record<BadgeColor, string>;

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
} satisfies Record<BadgeSize, string>;

const placementClassMap = {
  'top-start': styles.topStart,
  'top-end': styles.topEnd,
  'bottom-start': styles.bottomStart,
  'bottom-end': styles.bottomEnd,
} satisfies Record<BadgeCountPlacement, string>;

type SlottableChild = ReactElement<{ children?: ReactNode }>;

/** Root badge primitive for metadata labels. */
export const BadgeRoot = ({
  asChild = false,
  children,
  className,
  color,
  icon,
  iconPosition = 'start',
  size = 'medium',
  tone = 'neutral',
  variant = 'soft',
  ...badgeProps
}: BadgeRootProps) => {
  const childElement =
    asChild && isValidElement(children)
      ? (Children.only(children) as SlottableChild)
      : null;

  if (asChild && !childElement) {
    throw new Error(
      'ThemeShift Badge with asChild expects a single React element child.'
    );
  }

  const contentSource = asChild ? childElement?.props.children : children;
  const hasContent = contentSource !== null && contentSource !== undefined;
  const isColorMode = color !== undefined;
  const Comp = asChild ? Slot : 'span';

  const content = (
    <>
      {icon && iconPosition === 'start' ? (
        <span className={styles.iconSlot}>{icon}</span>
      ) : null}
      {hasContent ? (
        <span className={styles.label}>{contentSource}</span>
      ) : null}
      {icon && iconPosition === 'end' ? (
        <span className={styles.iconSlot}>{icon}</span>
      ) : null}
    </>
  );

  const resolvedChildren = childElement
    ? cloneElement(childElement, undefined, content)
    : content;

  return (
    <Comp
      {...badgeProps}
      className={classNames(
        styles.root,
        sizeClassMap[size],
        isColorMode ? colorClassMap[color] : toneClassMap[tone][variant],
        className
      )}
    >
      {resolvedChildren}
    </Comp>
  );
};

/** Numeric or dot indicator for counts and notifications. */
export const BadgeCount = ({
  children,
  className,
  count,
  dot = false,
  max,
  placement = 'top-end',
  showZero = false,
  textDot = false,
  ...countProps
}: BadgeCountProps) => {
  const hasAnchor = children !== null && children !== undefined;
  const hasNumericCount =
    typeof count === 'number' && Number.isFinite(count) && count >= 0;
  const shouldShowCount = hasNumericCount && (showZero || count !== 0);
  const isVisible = dot || textDot || shouldShowCount;

  if (!hasAnchor && !isVisible) {
    return null;
  }

  const displayCount = textDot
    ? '·'
    : shouldShowCount && !dot
      ? max !== undefined && count > max
        ? `${max}+`
        : `${count}`
      : null;

  return (
    <span
      {...countProps}
      className={classNames(
        styles.countRoot,
        hasAnchor ? styles.anchored : styles.standalone,
        hasAnchor && placementClassMap[placement],
        className
      )}
      data-placement={placement}
    >
      {hasAnchor ? <span className={styles.anchor}>{children}</span> : null}
      {isVisible ? (
        <span
          className={classNames(
            styles.indicator,
            dot ? styles.dot : textDot ? styles.textDot : styles.numeric,
            !hasAnchor && styles.inlineIndicator
          )}
          data-dot={dot ? '' : undefined}
          data-text-dot={textDot ? '' : undefined}
        >
          {dot ? null : displayCount}
        </span>
      ) : null}
    </span>
  );
};

type BadgeComponent = ((props: BadgeRootProps) => React.JSX.Element) & {
  Count: typeof BadgeCount;
};

/** Compound badge component with count subcomponent. */
export const Badge = Object.assign(BadgeRoot, {
  Count: BadgeCount,
}) as BadgeComponent;

export type {
  BadgeColor,
  BadgeCountPlacement,
  BadgeCountProps,
  BadgeRootProps,
  BadgeSize,
  BadgeTone,
  BadgeVariant,
};
