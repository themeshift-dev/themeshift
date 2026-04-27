/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  type ElementType,
  type ReactNode,
} from 'react';

import { Badge, type BadgeRootProps } from '@/components/Badge';

import styles from './Card.module.scss';
import type {
  CardActionsDirection,
  CardActionsGap,
  CardActionsProps,
  CardAlign,
  CardBadgeOffset,
  CardBadgePosition,
  CardBadgeProps,
  CardBodyProps,
  CardDividerOrientation,
  CardDividerProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardJustify,
  CardLinkOverlayProps,
  CardMediaAspectRatio,
  CardMediaFit,
  CardMediaPosition,
  CardMediaProps,
  CardProps,
  CardRadius,
  CardRootProps,
  CardSectionPadding,
  CardShadow,
  CardSurface,
  CardTitleProps,
} from './types';

const CARD_SLOT_SYMBOL = Symbol.for('themeshift.card.slot');

type CardSlotMarker = {
  [CARD_SLOT_SYMBOL]?: true;
};

type CardContextValue = {
  align: CardAlign;
  justify: CardJustify;
  padding: CardSectionPadding;
};

const CardContext = createContext<CardContextValue | null>(null);

const alignClassMap = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
} satisfies Record<CardAlign, string>;

const justifyClassMap = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  'space-between': styles.justifySpaceBetween,
} satisfies Record<CardJustify, string>;

const paddingClassMap = {
  none: styles.paddingNone,
  small: styles.paddingSmall,
  medium: styles.paddingMedium,
  large: styles.paddingLarge,
} satisfies Record<CardSectionPadding, string>;

const radiusClassMap = {
  none: styles.radiusNone,
  small: styles.radiusSmall,
  medium: styles.radiusMedium,
  large: styles.radiusLarge,
} satisfies Record<CardRadius, string>;

const shadowClassMap = {
  none: styles.shadowNone,
  small: styles.shadowSmall,
  medium: styles.shadowMedium,
  large: styles.shadowLarge,
} satisfies Record<CardShadow, string>;

const surfaceClassMap = {
  default: styles.surfaceDefault,
  subtle: styles.surfaceSubtle,
  elevated: styles.surfaceElevated,
} satisfies Record<CardSurface, string>;

const aspectRatioClassMap = {
  auto: styles.aspectAuto,
  square: styles.aspectSquare,
  video: styles.aspectVideo,
  wide: styles.aspectWide,
} satisfies Record<CardMediaAspectRatio, string>;

const fitClassMap = {
  cover: styles.fitCover,
  contain: styles.fitContain,
} satisfies Record<CardMediaFit, string>;

const mediaPositionClassMap = {
  top: styles.mediaTop,
  bottom: styles.mediaBottom,
} satisfies Record<CardMediaPosition, string>;

const actionsDirectionClassMap = {
  row: styles.actionsRow,
  column: styles.actionsColumn,
} satisfies Record<CardActionsDirection, string>;

const actionsGapClassMap = {
  none: styles.actionsGapNone,
  small: styles.actionsGapSmall,
  medium: styles.actionsGapMedium,
  large: styles.actionsGapLarge,
} satisfies Record<CardActionsGap, string>;

const dividerOrientationClassMap = {
  horizontal: styles.dividerHorizontal,
  vertical: styles.dividerVertical,
} satisfies Record<CardDividerOrientation, string>;

const badgePositionClassMap = {
  'top-start': styles.badgeTopStart,
  'top-end': styles.badgeTopEnd,
  'bottom-start': styles.badgeBottomStart,
  'bottom-end': styles.badgeBottomEnd,
} satisfies Record<CardBadgePosition, string>;

const badgeOffsetClassMap = {
  none: styles.badgeOffsetNone,
  small: styles.badgeOffsetSmall,
  medium: styles.badgeOffsetMedium,
} satisfies Record<CardBadgeOffset, string>;

const markCardSlot = <T extends object>(component: T): T => {
  (component as CardSlotMarker)[CARD_SLOT_SYMBOL] = true;

  return component;
};

const isCardSlotChild = (child: ReactNode) => {
  if (!isValidElement(child)) {
    return false;
  }

  return Boolean((child.type as CardSlotMarker)[CARD_SLOT_SYMBOL]);
};

/** Root wrapper for the ThemeShift Card compound component. */
export const CardRoot = <T extends ElementType = 'div'>({
  align = 'start',
  as,
  border = true,
  children,
  className,
  justify = 'start',
  padding = 'medium',
  radius = 'medium',
  shadow = 'none',
  surface = 'default',
  ...rootProps
}: CardRootProps<T>) => {
  const Component = as ?? 'div';
  const hasSlotChildren = Children.toArray(children).some(isCardSlotChild);

  return (
    <CardContext.Provider value={{ align, justify, padding }}>
      <Component
        {...rootProps}
        className={classNames(
          styles.root,
          alignClassMap[align],
          justifyClassMap[justify],
          border ? styles.withBorder : styles.withoutBorder,
          !hasSlotChildren && paddingClassMap[padding],
          radiusClassMap[radius],
          shadowClassMap[shadow],
          surfaceClassMap[surface],
          className
        )}
      >
        {children}
      </Component>
    </CardContext.Provider>
  );
};

/** Header slot that stacks and aligns title/description content. */
export const CardHeader = markCardSlot(
  <T extends ElementType = 'div'>({
    align,
    as,
    children,
    className,
    justify,
    padding,
    ...headerProps
  }: CardHeaderProps<T>) => {
    const context = useContext(CardContext);
    const Component = as ?? 'div';
    const resolvedAlign = align ?? context?.align ?? 'start';
    const resolvedJustify = justify ?? context?.justify ?? 'start';
    const resolvedPadding = padding ?? context?.padding ?? 'medium';

    return (
      <Component
        {...headerProps}
        className={classNames(
          styles.section,
          styles.header,
          alignClassMap[resolvedAlign],
          justifyClassMap[resolvedJustify],
          paddingClassMap[resolvedPadding],
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

/** Title slot used for Card heading content. */
export const CardTitle = markCardSlot(
  <T extends ElementType = 'div'>({
    as,
    children,
    className,
    ...titleProps
  }: CardTitleProps<T>) => {
    const Component = as ?? 'div';

    return (
      <Component
        {...titleProps}
        className={classNames(styles.title, className)}
      >
        {children}
      </Component>
    );
  }
);

/** Description slot used for supporting Card copy. */
export const CardDescription = markCardSlot(
  <T extends ElementType = 'div'>({
    as,
    children,
    className,
    ...descriptionProps
  }: CardDescriptionProps<T>) => {
    const Component = as ?? 'div';

    return (
      <Component
        {...descriptionProps}
        className={classNames(styles.description, className)}
      >
        {children}
      </Component>
    );
  }
);

/** Body slot used for main Card content. */
export const CardBody = markCardSlot(
  <T extends ElementType = 'div'>({
    as,
    children,
    className,
    padding,
    ...bodyProps
  }: CardBodyProps<T>) => {
    const context = useContext(CardContext);
    const Component = as ?? 'div';
    const resolvedPadding = padding ?? context?.padding ?? 'medium';

    return (
      <Component
        {...bodyProps}
        className={classNames(
          styles.section,
          styles.body,
          paddingClassMap[resolvedPadding],
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

/** Footer slot used for secondary Card content and actions. */
export const CardFooter = markCardSlot(
  <T extends ElementType = 'div'>({
    align,
    as,
    children,
    className,
    justify,
    padding,
    ...footerProps
  }: CardFooterProps<T>) => {
    const context = useContext(CardContext);
    const Component = as ?? 'div';
    const resolvedAlign = align ?? context?.align ?? 'start';
    const resolvedJustify = justify ?? align ?? context?.justify ?? 'start';
    const resolvedPadding = padding ?? context?.padding ?? 'medium';

    return (
      <Component
        {...footerProps}
        className={classNames(
          styles.section,
          styles.footer,
          alignClassMap[resolvedAlign],
          justifyClassMap[resolvedJustify],
          paddingClassMap[resolvedPadding],
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

/** Media slot for layout-only media regions inside Card. */
export const CardMedia = markCardSlot(
  <T extends ElementType = 'div'>({
    as,
    aspectRatio = 'auto',
    children,
    className,
    fit = 'cover',
    position = 'top',
    ...mediaProps
  }: CardMediaProps<T>) => {
    const Component = as ?? 'div';

    return (
      <Component
        {...mediaProps}
        className={classNames(
          styles.media,
          aspectRatioClassMap[aspectRatio],
          fitClassMap[fit],
          mediaPositionClassMap[position],
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

/** Flex layout helper for action groups inside Card sections. */
export const CardActions = markCardSlot(
  <T extends ElementType = 'div'>({
    align,
    as,
    children,
    className,
    direction = 'row',
    gap = 'medium',
    justify,
    wrap = false,
    ...actionsProps
  }: CardActionsProps<T>) => {
    const context = useContext(CardContext);
    const Component = as ?? 'div';
    const resolvedAlign = align ?? context?.align ?? 'start';
    const resolvedJustify = justify ?? context?.justify ?? 'start';

    return (
      <Component
        {...actionsProps}
        className={classNames(
          styles.actions,
          alignClassMap[resolvedAlign],
          justifyClassMap[resolvedJustify],
          actionsDirectionClassMap[direction],
          actionsGapClassMap[gap],
          wrap && styles.actionsWrap,
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

/** Full-surface link overlay for clickable card patterns. */
export const CardLinkOverlay = markCardSlot(
  <T extends ElementType = 'a'>({
    as,
    children,
    className,
    ...overlayProps
  }: CardLinkOverlayProps<T>) => {
    const Component = as ?? 'a';

    return (
      <Component
        {...overlayProps}
        className={classNames(styles.linkOverlay, className)}
      >
        {children}
      </Component>
    );
  }
);

/** Orientation-aware divider for separating card sections and inline groups. */
export const CardDivider = markCardSlot(
  <T extends ElementType = 'div'>({
    as,
    className,
    inset = false,
    orientation = 'horizontal',
    role,
    ...dividerProps
  }: CardDividerProps<T>) => {
    const Component = as ?? 'div';

    return (
      <Component
        {...dividerProps}
        aria-orientation={orientation}
        className={classNames(
          styles.divider,
          dividerOrientationClassMap[orientation],
          inset && styles.dividerInset,
          className
        )}
        role={role ?? 'separator'}
      />
    );
  }
);

/** Positioned badge wrapper for card-local status and metadata indicators. */
export const CardBadge = markCardSlot(
  <T extends ElementType = 'span'>({
    className,
    offset = 'small',
    position = 'top-end',
    ...badgeProps
  }: CardBadgeProps<T>) => {
    return (
      <div
        className={classNames(
          styles.badgeContainer,
          badgePositionClassMap[position],
          badgeOffsetClassMap[offset]
        )}
      >
        <Badge {...(badgeProps as BadgeRootProps<T>)} className={className} />
      </div>
    );
  }
);

type CardComponent = (<T extends ElementType = 'div'>(
  props: CardProps<T>
) => React.JSX.Element) & {
  Actions: typeof CardActions;
  Badge: typeof CardBadge;
  Body: typeof CardBody;
  Divider: typeof CardDivider;
  Description: typeof CardDescription;
  Footer: typeof CardFooter;
  Header: typeof CardHeader;
  LinkOverlay: typeof CardLinkOverlay;
  Media: typeof CardMedia;
  Title: typeof CardTitle;
};

/** Compound Card component with structural slot primitives. */
export const Card = Object.assign(CardRoot, {
  Actions: CardActions,
  Badge: CardBadge,
  Body: CardBody,
  Divider: CardDivider,
  Description: CardDescription,
  Footer: CardFooter,
  Header: CardHeader,
  LinkOverlay: CardLinkOverlay,
  Media: CardMedia,
  Title: CardTitle,
}) as CardComponent;

export type {
  CardActionsDirection,
  CardActionsGap,
  CardActionsProps,
  CardAlign,
  CardBadgeOffset,
  CardBadgePosition,
  CardBadgeProps,
  CardBodyProps,
  CardDividerOrientation,
  CardDividerProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardJustify,
  CardLinkOverlayProps,
  CardMediaAspectRatio,
  CardMediaFit,
  CardMediaPosition,
  CardMediaProps,
  CardProps,
  CardRadius,
  CardRootProps,
  CardSectionPadding,
  CardShadow,
  CardSurface,
  CardTitleProps,
};
