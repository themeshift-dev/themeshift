import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  JSX,
  ReactNode,
} from 'react';

/** Shared size options for avatar primitives. */
export type AvatarSize = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';

/** Shape options for avatar roots and grouped avatars. */
export type AvatarShape = 'circle' | 'rounded' | 'square';

/** Placement options for badge overlays using logical directions. */
export type AvatarPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

/** Loading lifecycle states exposed by Avatar.Image. */
export type AvatarImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** Props for the Avatar root primitive. */
export type AvatarRootProps = {
  /**
   * Children for composed usage such as Avatar.Image and Avatar.Fallback.
   */
  children?: ReactNode;

  /**
   * Additional class names to append to the root.
   */
  className?: string;

  /**
   * Controls fallback palette. Use `auto` for deterministic name-based colors.
   */
  color?: 'auto' | 'neutral' | 'accent' | string;

  /**
   * Marks the avatar as decorative when adjacent visible text already conveys
   * the same identity.
   */
  decorative?: boolean;

  /**
   * Name used for accessibility labels and initials generation.
   */
  name?: string;

  /**
   * Shape treatment for the avatar frame.
   */
  shape?: AvatarShape;

  /**
   * Size scale for root dimensions.
   */
  size?: AvatarSize;

  /**
   * Inline style overrides for the root.
   */
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/** Props for Avatar.Image. */
export type AvatarImageProps = {
  /**
   * Additional class names to append to the image slot.
   */
  className?: string;

  /**
   * Decoding strategy for the image element.
   */
  decoding?: 'sync' | 'async' | 'auto';

  /**
   * Alternate text for identity announcements.
   */
  alt?: string;

  /**
   * Browser loading hint.
   */
  loading?: 'eager' | 'lazy';

  /**
   * Notifies consumers when image state changes.
   */
  onLoadingStatusChange?: (status: AvatarImageLoadingStatus) => void;

  /**
   * Referrer policy for the image request.
   */
  referrerPolicy?: ComponentPropsWithoutRef<'img'>['referrerPolicy'];

  /**
   * Responsive image size hints.
   */
  sizes?: string;

  /**
   * Image source URL.
   */
  src?: string;

  /**
   * Responsive image source set.
   */
  srcSet?: string;
} & Omit<ComponentPropsWithoutRef<'img'>, 'alt' | 'children' | 'src'>;

/** Props for Avatar.Fallback. */
export type AvatarFallbackProps = {
  /**
   * Additional class names to append to the fallback slot.
   */
  className?: string;

  /**
   * Custom content that overrides initials/icon fallback.
   */
  children?: ReactNode;

  /**
   * Delay before fallback appears when loading images.
   */
  delayMs?: number;

  /**
   * Custom icon to render when no text fallback is available.
   */
  icon?: ReactNode;

  /**
   * Explicit initials value, for example `MJ`.
   */
  initials?: string;

  /**
   * Optional name override used to derive initials.
   */
  name?: string;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/** Props for Avatar.Badge. */
export type AvatarBadgeProps = {
  /**
   * Accessible name when badge content itself is not descriptive.
   */
  'aria-label'?: string;

  /**
   * Badge or indicator content.
   */
  children?: ReactNode;

  /**
   * Additional class names to append to the badge slot.
   */
  className?: string;

  /**
   * Applies inset positioning so the badge hugs the avatar edge.
   */
  inset?: boolean;

  /**
   * Optional text label for non-visual users.
   */
  label?: string;

  /**
   * Badge offset from its logical corner.
   */
  offset?: number | string;

  /**
   * Logical corner where the badge is anchored.
   */
  placement?: AvatarPlacement;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/** Props for Avatar.Group. */
export type AvatarGroupProps = {
  /**
   * Accessible group label, for example “Project members”.
   */
  'aria-label'?: string;

  /**
   * Avatar children to stack within the group.
   */
  children?: ReactNode;

  /**
   * Additional class names to append to the group wrapper.
   */
  className?: string;

  /**
   * Maximum avatars to render before showing overflow.
   */
  max?: number;

  /**
   * Controls how much group items overlap. Number values are interpreted as
   * pixels.
   */
  overlap?: number | string;

  /**
   * Adds a surface-color separator ring so overlapped avatars remain visually
   * distinct.
   */
  separated?: boolean;

  /**
   * Total number of people represented by the group.
   */
  total?: number;

  /**
   * Produces an accessible overflow label from hidden count.
   */
  overflowLabel?: (count: number) => string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Props for Avatar.GroupItem. */
export type AvatarGroupItemProps = {
  /**
   * Avatar content for this group item.
   */
  children?: ReactNode;

  /**
   * Additional class names to append to the item wrapper.
   */
  className?: string;

  /**
   * Optional index used for deterministic stacking order overrides.
   */
  index?: number;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Props for Avatar.Overflow. */
export type AvatarOverflowProps = {
  /**
   * Accessible name that explains hidden member count.
   */
  'aria-label'?: string;

  /**
   * Custom overflow content. Defaults to `+{count}`.
   */
  children?: ReactNode;

  /**
   * Additional class names to append to the overflow slot.
   */
  className?: string;

  /**
   * Hidden member count.
   */
  count?: number;

  /**
   * Optional overflow label text for assistive technology.
   */
  label?: string;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/** Props for shorthand Avatar usage. */
export type AvatarProps = {
  /**
   * Optional fallback children for advanced shorthand composition.
   */
  children?: ReactNode;

  /**
   * Explicit initials override.
   */
  initials?: string;

  /**
   * Image source used by Avatar.Image.
   */
  src?: string;

  /**
   * Optional image source set for responsive loading.
   */
  srcSet?: string;
} & Omit<AvatarRootProps, 'children'>;

/** Full compound Avatar component shape. */
export type AvatarCompoundComponent = ((props: AvatarProps) => JSX.Element) & {
  Root: (props: AvatarRootProps) => JSX.Element;
  Image: (props: AvatarImageProps) => JSX.Element | null;
  Fallback: (props: AvatarFallbackProps) => JSX.Element | null;
  Badge: (props: AvatarBadgeProps) => JSX.Element;
  Group: (props: AvatarGroupProps) => JSX.Element;
  GroupItem: (props: AvatarGroupItemProps) => JSX.Element;
  Overflow: (props: AvatarOverflowProps) => JSX.Element;
};
