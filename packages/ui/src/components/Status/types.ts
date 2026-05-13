import type {
  AriaRole,
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
  ReactNode,
} from 'react';

/**
 * Shared polymorphic prop helper used by Status slots.
 */
type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  /**
   * HTML element or component to render instead of the default element.
   */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as' | 'children'>;

/**
 * Shared props for slot primitives that can render with `asChild`.
 */
type StatusAsChildOwnProps = {
  /**
   * Applies slot styling to a single child element instead of rendering a
   * native wrapper.
   */
  asChild?: boolean;

  /**
   * Slot contents.
   */
  children?: ReactNode;

  /**
   * Additional class names to append to the rendered element.
   */
  className?: string;
};

/**
 * Alignment options for the overall status block.
 */
export type StatusAlign = 'start' | 'center' | 'end';

/**
 * Density options for spacing and text measure.
 */
export type StatusDensity = 'compact' | 'comfortable' | 'spacious';

/**
 * Visual treatment options for the status container.
 */
export type StatusVariant = 'plain' | 'panel' | 'subtle';

/**
 * Semantic tone options for status intent.
 */
export type StatusIntent =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

/**
 * Props for the Status root component.
 */
export type StatusOwnProps = {
  /**
   * Visual alignment of the block. Uses logical alignment so start/end mirror
   * in LTR and RTL.
   */
  align?: StatusAlign;

  /**
   * Announcement mode used when the status should be read by assistive tech.
   */
  'aria-live'?: 'off' | 'polite' | 'assertive';

  /**
   * Status primitives and custom contents.
   */
  children?: ReactNode;

  /**
   * Additional class names to append to the root element.
   */
  className?: string;

  /**
   * Controls spacing scale and maximum content width.
   */
  density?: StatusDensity;

  /**
   * Semantic status type used for tone-aware styling.
   */
  intent?: StatusIntent;

  /**
   * Optional ARIA role when the status should be announced semantically.
   */
  role?: AriaRole;

  /**
   * Optional visual treatment for the container.
   */
  variant?: StatusVariant;
};

/**
 * Props for the Status.Content slot.
 */
export type StatusContentOwnProps = {
  /**
   * Content region children, usually title and description.
   */
  children?: ReactNode;

  /**
   * Additional class names to append to the content slot.
   */
  className?: string;
};

/**
 * Props for the Status.Icon slot.
 */
export type StatusIconOwnProps = StatusAsChildOwnProps;

/**
 * Props for the Status.Title slot.
 */
export type StatusTitleOwnProps = StatusAsChildOwnProps;

/**
 * Props for the Status.Description slot.
 */
export type StatusDescriptionOwnProps = StatusAsChildOwnProps;

/**
 * Props for the Status.Actions slot.
 */
export type StatusActionsOwnProps = StatusAsChildOwnProps;

/**
 * Shared props for built-in Status presets.
 */
export type StatusPresetProps = Omit<StatusProps, 'children'> & {
  /**
   * Optional action region content, such as buttons or links.
   */
  actions?: ReactNode;

  /**
   * Optional replacement content used when `description` is not provided.
   */
  children?: ReactNode;

  /**
   * Optional description copy.
   */
  description?: ReactNode;

  /**
   * Optional icon node rendered above the text content.
   */
  icon?: ReactNode;

  /**
   * Optional heading copy.
   */
  title?: ReactNode;
};

/**
 * Props for the Status root component.
 */
export type StatusProps<T extends ElementType = 'section'> = PolymorphicProps<
  T,
  StatusOwnProps
>;

/**
 * Alias for Status root props.
 */
export type StatusRootProps<T extends ElementType = 'section'> = StatusProps<T>;

/**
 * Props for the Status.Content slot.
 */
export type StatusContentProps<T extends ElementType = 'div'> =
  PolymorphicProps<T, StatusContentOwnProps>;

type StatusAsChildElementProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  keyof StatusAsChildOwnProps | 'children'
> &
  StatusAsChildOwnProps & {
    as?: never;
    asChild: true;
    children: ReactElement;
  };

type StatusAsElementProps<T extends ElementType> = PolymorphicProps<
  T,
  StatusAsChildOwnProps & {
    asChild?: false;
  }
>;

/**
 * Props for the Status.Icon slot.
 */
export type StatusIconProps<T extends ElementType = 'div'> =
  | StatusAsElementProps<T>
  | StatusAsChildElementProps;

/**
 * Props for the Status.Title slot.
 */
export type StatusTitleProps<T extends ElementType = 'h2'> =
  | StatusAsElementProps<T>
  | StatusAsChildElementProps;

/**
 * Props for the Status.Description slot.
 */
export type StatusDescriptionProps<T extends ElementType = 'p'> =
  | StatusAsElementProps<T>
  | StatusAsChildElementProps;

/**
 * Props for the Status.Actions slot.
 */
export type StatusActionsProps<T extends ElementType = 'div'> =
  | StatusAsElementProps<T>
  | StatusAsChildElementProps;
