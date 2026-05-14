/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import styles from './Avatar.module.scss';
import type {
  AvatarBadgeProps,
  AvatarCompoundComponent,
  AvatarFallbackProps,
  AvatarGroupItemProps,
  AvatarGroupProps,
  AvatarImageLoadingStatus,
  AvatarImageProps,
  AvatarOverflowProps,
  AvatarProps,
  AvatarRootProps,
  AvatarShape,
  AvatarSize,
} from './types';

type AvatarStyleVars = CSSProperties & {
  '--avatar-badge-offset'?: string;
  '--avatar-group-overlap'?: string;
  '--avatar-group-item-index'?: number;
  '--avatar-custom-background'?: string;
};

type AvatarContextValue = {
  decorative: boolean;
  name?: string;
  imageStatus: AvatarImageLoadingStatus;
  setImageStatus: (status: AvatarImageLoadingStatus) => void;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);

const shapeClassMap = {
  circle: styles.shapeCircle,
  rounded: styles.shapeRounded,
  square: styles.shapeSquare,
} satisfies Record<AvatarShape, string>;

const sizeClassMap = {
  xSmall: styles.sizeXSmall,
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
  xLarge: styles.sizeXLarge,
} satisfies Record<AvatarSize, string>;

const placementClassMap = {
  'top-start': styles.topStart,
  'top-end': styles.topEnd,
  'bottom-start': styles.bottomStart,
  'bottom-end': styles.bottomEnd,
} as const;

const autoColorClasses = [
  styles.colorAuto0,
  styles.colorAuto1,
  styles.colorAuto2,
  styles.colorAuto3,
  styles.colorAuto4,
  styles.colorAuto5,
  styles.colorAuto6,
  styles.colorAuto7,
  styles.colorAuto8,
  styles.colorAuto9,
  styles.colorAuto10,
  styles.colorAuto11,
  styles.colorAuto12,
  styles.colorAuto13,
  styles.colorAuto14,
  styles.colorAuto15,
] as const;

function useAvatarContext(component: string) {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error(`${component} must be used within Avatar.Root.`);
  }

  return context;
}

function normalizeOffset(offset: AvatarBadgeProps['offset']) {
  if (typeof offset === 'number') {
    return `${offset}px`;
  }

  if (typeof offset === 'string') {
    return offset;
  }

  return undefined;
}

function getInitials(name?: string) {
  if (!name) {
    return '';
  }

  const tokens = name
    .trim()
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean);

  if (tokens.length === 0) {
    return '';
  }

  if (tokens.length === 1) {
    return tokens[0].charAt(0).toUpperCase();
  }

  return `${tokens[0].charAt(0)}${tokens[tokens.length - 1].charAt(0)}`.toUpperCase();
}

function hashName(input: string) {
  let hash = 0;

  for (const char of input) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  return Math.abs(hash);
}

function resolveAutoColor(name?: string) {
  return hashName(name?.trim() || 'avatar') % autoColorClasses.length;
}

function GenericAvatarIcon() {
  return (
    <svg
      aria-hidden
      className={styles.genericIcon}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 20C5.2 16.8 8.1 14.5 12 14.5C15.9 14.5 18.8 16.8 19.5 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Root avatar primitive used for composed image/fallback/badge patterns. */
export const AvatarRoot = ({
  children,
  className,
  color = 'auto',
  decorative = false,
  name,
  shape = 'circle',
  size = 'medium',
  style,
  ...rootProps
}: AvatarRootProps) => {
  const [imageStatus, setImageStatus] =
    useState<AvatarImageLoadingStatus>('idle');
  const computedAriaLabel = !decorative
    ? (rootProps['aria-label'] ?? name ?? undefined)
    : undefined;
  const autoColorIndex = resolveAutoColor(name);
  const mergedStyle = { ...style } as AvatarStyleVars;

  return (
    <AvatarContext.Provider
      value={{
        decorative,
        imageStatus,
        name,
        setImageStatus,
      }}
    >
      <span
        {...rootProps}
        aria-hidden={decorative ? true : rootProps['aria-hidden']}
        aria-label={computedAriaLabel}
        className={classNames(
          styles.root,
          shapeClassMap[shape],
          sizeClassMap[size],
          color === 'auto' && styles.colorAuto,
          color === 'auto' && autoColorClasses[autoColorIndex],
          color === 'neutral' && styles.colorNeutral,
          color === 'accent' && styles.colorAccent,
          color !== 'auto' &&
            color !== 'neutral' &&
            color !== 'accent' &&
            styles.colorCustom,
          className
        )}
        role={decorative ? undefined : (rootProps.role ?? 'img')}
        style={
          color !== 'auto' && color !== 'neutral' && color !== 'accent'
            ? ({
                ...mergedStyle,
                '--avatar-custom-background': color,
              } as AvatarStyleVars)
            : mergedStyle
        }
      >
        {children}
      </span>
    </AvatarContext.Provider>
  );
};

/** Image slot with built-in loading and failure state handling. */
export const AvatarImage = ({
  alt,
  className,
  onError,
  onLoad,
  onLoadingStatusChange,
  src,
  ...imageProps
}: AvatarImageProps) => {
  const { decorative, name, setImageStatus } = useAvatarContext('Avatar.Image');
  const [eventStatus, setEventStatus] = useState<'loaded' | 'error' | null>(
    null
  );
  const [eventStatusSrc, setEventStatusSrc] = useState<string | undefined>(
    undefined
  );

  const status: AvatarImageLoadingStatus = !src
    ? 'idle'
    : eventStatusSrc === src
      ? (eventStatus ?? 'loading')
      : 'loading';

  useEffect(() => {
    setImageStatus(status);
    onLoadingStatusChange?.(status);
  }, [onLoadingStatusChange, setImageStatus, status]);

  if (!src) {
    return null;
  }

  const imageAlt = decorative ? '' : (alt ?? name ?? '');

  return (
    <img
      {...imageProps}
      alt={imageAlt}
      aria-hidden={decorative ? true : imageProps['aria-hidden']}
      className={classNames(
        styles.image,
        status === 'loaded' ? styles.imageVisible : styles.imageHidden,
        className
      )}
      onError={(event) => {
        setEventStatus('error');
        setEventStatusSrc(src);
        setImageStatus('error');
        onLoadingStatusChange?.('error');
        onError?.(event);
      }}
      onLoad={(event) => {
        setEventStatus('loaded');
        setEventStatusSrc(src);
        setImageStatus('loaded');
        onLoadingStatusChange?.('loaded');
        onLoad?.(event);
      }}
      src={src}
    />
  );
};

/** Fallback slot that renders custom content, initials, or a generic icon. */
export const AvatarFallback = ({
  children,
  className,
  delayMs = 0,
  icon,
  initials,
  name,
  ...fallbackProps
}: AvatarFallbackProps) => {
  const { imageStatus, name: rootName } = useAvatarContext('Avatar.Fallback');
  const [isDelayed, setIsDelayed] = useState(delayMs > 0);

  useEffect(() => {
    if (!isDelayed || delayMs <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setIsDelayed(false), delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delayMs, isDelayed]);

  if (imageStatus === 'loaded') {
    return null;
  }

  if (imageStatus === 'loading' && isDelayed) {
    return null;
  }

  const derivedInitials = initials ?? getInitials(name ?? rootName);
  const content =
    children ??
    icon ??
    (derivedInitials ? (
      <span className={styles.initials}>{derivedInitials}</span>
    ) : (
      <GenericAvatarIcon />
    ));

  return (
    <span
      {...fallbackProps}
      aria-hidden
      className={classNames(styles.fallback, className)}
    >
      {content}
    </span>
  );
};

/** Adornment slot for placing badges or indicators on an avatar. */
export const AvatarBadge = ({
  children,
  className,
  inset = false,
  label,
  offset,
  placement = 'bottom-end',
  ...badgeProps
}: AvatarBadgeProps) => {
  const style = {
    ...badgeProps.style,
    '--avatar-badge-offset': normalizeOffset(offset),
  } as AvatarStyleVars;

  return (
    <span
      {...badgeProps}
      aria-label={badgeProps['aria-label'] ?? label}
      className={classNames(
        styles.badge,
        placementClassMap[placement],
        inset && styles.badgeInset,
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
};

/** Visual grouping wrapper that handles stacking and overflow. */
export const AvatarGroup = ({
  children,
  className,
  max,
  overlap,
  separated = true,
  overflowLabel,
  total,
  ...groupProps
}: AvatarGroupProps) => {
  const allChildren = Children.toArray(children).filter(isValidElement);
  const visible =
    typeof max === 'number' ? allChildren.slice(0, max) : allChildren;
  const actualTotal = total ?? allChildren.length;
  const overflowCount = Math.max(0, actualTotal - visible.length);

  const overlapValue =
    typeof overlap === 'number'
      ? `${overlap}px`
      : typeof overlap === 'string'
        ? overlap
        : undefined;

  return (
    <div
      {...groupProps}
      className={classNames(
        styles.group,
        separated && styles.groupSeparated,
        className
      )}
      role={groupProps.role ?? 'list'}
      style={
        overlapValue
          ? ({
              ...groupProps.style,
              '--avatar-group-overlap': overlapValue,
            } as AvatarStyleVars)
          : groupProps.style
      }
    >
      {visible.map((child, index) => (
        <AvatarGroupItem index={index} key={`avatar-group-${index}`}>
          {child as ReactNode}
        </AvatarGroupItem>
      ))}

      {overflowCount > 0 ? (
        <AvatarOverflow
          aria-label={
            overflowLabel?.(overflowCount) ?? `${overflowCount} more members`
          }
          count={overflowCount}
        />
      ) : null}
    </div>
  );
};

/** Group item wrapper used for consistent overlap spacing and stacking. */
export const AvatarGroupItem = ({
  children,
  className,
  index = 0,
  ...groupItemProps
}: AvatarGroupItemProps) => (
  <div
    {...groupItemProps}
    className={classNames(styles.groupItem, className)}
    role={groupItemProps.role ?? 'listitem'}
    style={
      {
        ...groupItemProps.style,
        '--avatar-group-item-index': index,
      } as AvatarStyleVars
    }
  >
    {children}
  </div>
);

/** Overflow slot for hidden group members. */
export const AvatarOverflow = ({
  children,
  className,
  count = 0,
  label,
  ...overflowProps
}: AvatarOverflowProps) => (
  <span
    {...overflowProps}
    aria-label={overflowProps['aria-label'] ?? label ?? `${count} more members`}
    className={classNames(styles.overflow, className)}
    role={overflowProps.role ?? 'listitem'}
  >
    {children ?? `+${count}`}
  </span>
);

/**
 * Shorthand avatar API for the common identity avatar case.
 */
const AvatarShorthand = ({
  children,
  color = 'auto',
  decorative = false,
  name,
  shape = 'circle',
  size = 'medium',
  initials,
  src,
  srcSet,
  ...props
}: AvatarProps) => {
  const fallbackProps = useMemo(() => ({ initials }), [initials]);

  return (
    <AvatarRoot
      color={color}
      decorative={decorative}
      name={name}
      shape={shape}
      size={size}
      {...props}
    >
      <AvatarImage src={src} srcSet={srcSet} />
      <AvatarFallback {...fallbackProps}>{children}</AvatarFallback>
    </AvatarRoot>
  );
};

export const Avatar = Object.assign(AvatarShorthand, {
  Badge: AvatarBadge,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
  GroupItem: AvatarGroupItem,
  Image: AvatarImage,
  Overflow: AvatarOverflow,
  Root: AvatarRoot,
}) as AvatarCompoundComponent;

export type {
  AvatarBadgeProps,
  AvatarFallbackProps,
  AvatarGroupItemProps,
  AvatarGroupProps,
  AvatarImageLoadingStatus,
  AvatarImageProps,
  AvatarOverflowProps,
  AvatarPlacement,
  AvatarProps,
  AvatarRootProps,
  AvatarShape,
  AvatarSize,
} from './types';

AvatarShorthand.displayName = 'Avatar';
(AvatarRoot as typeof AvatarRoot & { displayName?: string }).displayName =
  'Avatar.Root';
AvatarImage.displayName = 'Avatar.Image';
AvatarFallback.displayName = 'Avatar.Fallback';
AvatarBadge.displayName = 'Avatar.Badge';
AvatarGroup.displayName = 'Avatar.Group';
AvatarGroupItem.displayName = 'Avatar.GroupItem';
AvatarOverflow.displayName = 'Avatar.Overflow';
