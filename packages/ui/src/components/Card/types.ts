import type { BadgeRootProps } from '@/components/Badge';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/** Shared polymorphic prop helper used by Card and slot components. */
export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  /** HTML element or component to render instead of the default element. */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

/** Padding options used by Card and padded sections. */
export type CardSectionPadding = 'none' | 'small' | 'medium' | 'large';

/** Start/center/end alignment options for Card layout slots. */
export type CardAlign = 'start' | 'center' | 'end';

/** Justification options for Card layout slots. */
export type CardJustify = 'start' | 'center' | 'end' | 'space-between';

/** Corner radius options for Card root visuals. */
export type CardRadius = 'none' | 'small' | 'medium' | 'large';

/** Shadow depth options for Card root visuals. */
export type CardShadow = 'none' | 'small' | 'medium' | 'large';

/** Surface tone options for Card root visuals. */
export type CardSurface = 'default' | 'subtle' | 'elevated';

/** Aspect ratio presets for Card.Media. */
export type CardMediaAspectRatio = 'auto' | 'square' | 'video' | 'wide';

/** Object fit options for media content inside Card.Media. */
export type CardMediaFit = 'cover' | 'contain';

/** Vertical placement options for Card.Media. */
export type CardMediaPosition = 'top' | 'bottom';

/** Direction options for Card.Actions layout. */
export type CardActionsDirection = 'row' | 'column';

/** Gap scale options for Card.Actions layout. */
export type CardActionsGap = 'none' | 'small' | 'medium' | 'large';

/** Orientation options for Card.Divider. */
export type CardDividerOrientation = 'horizontal' | 'vertical';

/** Position options for Card.Badge. */
export type CardBadgePosition =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

/** Edge offset options for Card.Badge positioning. */
export type CardBadgeOffset = 'none' | 'small' | 'medium';

/** Shared visual/layout props for the Card root component. */
export type CardRootOwnProps = {
  /** Horizontal cross-axis alignment for root content. */
  align?: CardAlign;

  /** Shows a border around the card shell when true. */
  border?: boolean;

  /** Card content. */
  children: ReactNode;

  /** Additional class names to append to the card root. */
  className?: string;

  /** Main-axis content distribution for root content. */
  justify?: CardJustify;

  /** Default section padding inherited by Header, Body, and Footer. */
  padding?: CardSectionPadding;

  /** Corner radius scale for the card shell. */
  radius?: CardRadius;

  /** Shadow depth for the card shell. */
  shadow?: CardShadow;

  /** Surface tone for the card shell. */
  surface?: CardSurface;
};

/** Props for the Card.Header layout slot. */
export type CardHeaderOwnProps = {
  /** Horizontal cross-axis alignment for header content. */
  align?: CardAlign;

  /** Header content. */
  children: ReactNode;

  /** Additional class names to append to the header slot. */
  className?: string;

  /** Main-axis content distribution for header content. */
  justify?: CardJustify;

  /** Header padding; inherits from Card by default. */
  padding?: CardSectionPadding;
};

/** Props for the Card.Title slot. */
export type CardTitleOwnProps = {
  /** Additional class names to append to the title slot. */
  className?: string;

  /** Title content. */
  children: ReactNode;
};

/** Props for the Card.Description slot. */
export type CardDescriptionOwnProps = {
  /** Additional class names to append to the description slot. */
  className?: string;

  /** Description content. */
  children: ReactNode;
};

/** Props for the Card.Body slot. */
export type CardBodyOwnProps = {
  /** Body content. */
  children: ReactNode;

  /** Additional class names to append to the body slot. */
  className?: string;

  /** Body padding; inherits from Card by default. */
  padding?: CardSectionPadding;
};

/** Props for the Card.Footer slot. */
export type CardFooterOwnProps = {
  /** Horizontal cross-axis alignment for footer content. */
  align?: CardAlign;

  /** Footer content. */
  children: ReactNode;

  /** Additional class names to append to the footer slot. */
  className?: string;

  /** Main-axis content distribution for footer content. */
  justify?: CardJustify;

  /** Footer padding; inherits from Card by default. */
  padding?: CardSectionPadding;
};

/** Props for the Card.Media slot. */
export type CardMediaOwnProps = {
  /** Media ratio preset for the media region wrapper. */
  aspectRatio?: CardMediaAspectRatio;

  /** Media content, such as image, video, or custom markup. */
  children: ReactNode;

  /** Additional class names to append to the media slot. */
  className?: string;

  /** Object-fit behavior applied to direct media descendants. */
  fit?: CardMediaFit;

  /** Vertical position of the media section within the card stack. */
  position?: CardMediaPosition;
};

/** Props for the Card.Actions slot. */
export type CardActionsOwnProps = {
  /** Horizontal cross-axis alignment for actions content. */
  align?: CardAlign;

  /** Actions content, typically buttons or links. */
  children: ReactNode;

  /** Additional class names to append to the actions slot. */
  className?: string;

  /** Direction used to lay out actions. */
  direction?: CardActionsDirection;

  /** Gap between actions. */
  gap?: CardActionsGap;

  /** Main-axis content distribution for actions content. */
  justify?: CardJustify;

  /** Allows actions to wrap onto multiple lines. */
  wrap?: boolean;
};

/** Props for the Card.LinkOverlay slot. */
export type CardLinkOverlayOwnProps = {
  /** Optional class names to append to the overlay element. */
  className?: string;

  /** Optional overlay contents, typically visually hidden text. */
  children?: ReactNode;
};

/** Props for the Card.Divider slot. */
export type CardDividerOwnProps = {
  /** Additional class names to append to the divider element. */
  className?: string;

  /** Applies logical inset spacing based on divider orientation. */
  inset?: boolean;

  /** Divider orientation. */
  orientation?: CardDividerOrientation;
};

/** Card badge positioning props layered on top of Badge root props. */
export type CardBadgeOwnProps = {
  /** Edge offset between card bounds and badge. */
  offset?: CardBadgeOffset;

  /** Positioned corner for the badge wrapper. */
  position?: CardBadgePosition;
};

/** Props for the Card root component. */
export type CardRootProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  CardRootOwnProps
>;

/** Alias for root props used by consumers who prefer CardProps naming. */
export type CardProps<T extends ElementType = 'div'> = CardRootProps<T>;

/** Props for the Card.Header slot. */
export type CardHeaderProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  CardHeaderOwnProps
>;

/** Props for the Card.Title slot. */
export type CardTitleProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  CardTitleOwnProps
>;

/** Props for the Card.Description slot. */
export type CardDescriptionProps<T extends ElementType = 'div'> =
  PolymorphicProps<T, CardDescriptionOwnProps>;

/** Props for the Card.Body slot. */
export type CardBodyProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  CardBodyOwnProps
>;

/** Props for the Card.Footer slot. */
export type CardFooterProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  CardFooterOwnProps
>;

/** Props for the Card.Media slot. */
export type CardMediaProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  CardMediaOwnProps
>;

/** Props for the Card.Actions slot. */
export type CardActionsProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  CardActionsOwnProps
>;

/** Props for the Card.LinkOverlay slot. */
export type CardLinkOverlayProps<T extends ElementType = 'a'> =
  PolymorphicProps<T, CardLinkOverlayOwnProps>;

/** Props for the Card.Divider slot. */
export type CardDividerProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  CardDividerOwnProps
>;

/** Props for the Card.Badge slot. */
export type CardBadgeProps<T extends ElementType = 'span'> = BadgeRootProps<T> &
  CardBadgeOwnProps;
