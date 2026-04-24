import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';

/** Supported responsive breakpoints for navbar visibility helpers. */
export type NavbarBreakpoint = 'mobile' | 'tablet' | 'desktop';

/** Shared `as` helper for polymorphic navbar components. */
export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  /** Render a different element while keeping the same Navbar API. */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

/** Shared responsive visibility controls. */
export type NavbarVisibilityProps = {
  /** Hide the component below this breakpoint. */
  hideBelow?: NavbarBreakpoint;

  /** Show the component only below this breakpoint. */
  showBelow?: NavbarBreakpoint;
};

/** Root positioning mode for the navbar. */
export type NavbarPosition = 'static' | 'sticky' | 'fixed';

/** Root placement edge for sticky/fixed navbars. */
export type NavbarPlacement = 'top' | 'bottom';

/** Width behavior for root and container. */
export type NavbarWidth = 'full' | 'contained';

/** Max-width presets for root and container. */
export type NavbarMaxWidth = 'small' | 'medium' | 'large' | 'xLarge' | 'full';

/** Surface treatment for the navbar root. */
export type NavbarSurface = 'default' | 'subtle' | 'elevated' | 'transparent';

/** Shadow level for navbar root. */
export type NavbarShadow = 'none' | 'small' | 'medium' | 'large';

/** Height preset for navbar rows. */
export type NavbarHeight = 'small' | 'medium' | 'large';

/** Inline padding preset for navbar rows. */
export type NavbarPadding = 'none' | 'small' | 'medium' | 'large';

/** Navigation list orientation. */
export type NavbarListOrientation = 'horizontal' | 'vertical';

/** Menu rendering behavior for compact navigation. */
export type NavbarMenuPlacement = 'belowNavbar' | 'overlay' | 'drawer';

/** Outside-interaction action shorthand for compact menu behavior. */
export type NavbarOnClickOutsideAction = 'toggle' | 'close' | 'open';

export type NavbarToggleDynamicValue<T> = T | ((isOpen: boolean) => T);

export type NavbarOnClickOutsideCallbackArgs = {
  close: () => void;
  event: Event;
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
};

export type NavbarOnClickOutsideCallback = (
  args: NavbarOnClickOutsideCallbackArgs
) => void;

/** Base root props for `Navbar`. */
export type NavbarOwnProps = {
  /** Navbar content. */
  children: ReactNode;

  /** Applies a detached/floating chrome style. */
  floating?: boolean;

  /** Whether to render a border on the navbar root. */
  border?: boolean;

  /** Height preset for navbar rows. */
  height?: NavbarHeight;

  /** Maximum content width when width is `contained`. */
  maxWidth?: NavbarMaxWidth;

  /** Inline padding preset for navbar rows. */
  padding?: NavbarPadding;

  /** Sticky/fixed placement edge. */
  placement?: NavbarPlacement;

  /** Positioning mode for the navbar root. */
  position?: NavbarPosition;

  /** Root shadow depth. */
  shadow?: NavbarShadow;

  /** Surface token variant for the navbar root. */
  surface?: NavbarSurface;

  /** Root width behavior. */
  width?: NavbarWidth;

  /** Optional inline styles for custom overrides. */
  style?: CSSProperties;
};

/** Props for `Navbar.Container`. */
export type NavbarContainerOwnProps = NavbarVisibilityProps & {
  /** Container content. */
  children: ReactNode;

  /** Maximum content width when width is `contained`. */
  maxWidth?: NavbarMaxWidth;

  /** Width behavior for the inner layout row. */
  width?: NavbarWidth;
};

/** Props for `Navbar.Brand`. */
export type NavbarBrandOwnProps = NavbarVisibilityProps & {
  /** Render brand styles onto a single child element. */
  asChild?: boolean;

  /** Brand label or custom content. */
  children: ReactNode;

  /** Optional destination URL. Defaults to non-interactive when omitted. */
  href?: string;
};

/** Props for `Navbar.Content`. */
export type NavbarContentOwnProps = NavbarVisibilityProps & {
  /** Inline desktop/tablet navigation content. */
  children: ReactNode;
};

/** Props for `Navbar.List`. */
export type NavbarListOwnProps = NavbarVisibilityProps & {
  /** List items or links. */
  children: ReactNode;

  /** Direction used to lay out list items. */
  orientation?: NavbarListOrientation;
};

/** Props for `Navbar.Item`. */
export type NavbarItemOwnProps = NavbarVisibilityProps & {
  /** Item content. */
  children: ReactNode;
};

/** Props for `Navbar.Link`. */
export type NavbarLinkOwnProps = NavbarVisibilityProps & {
  /** Link content. */
  children: ReactNode;

  /** Marks the current page and applies `aria-current="page"`. */
  active?: boolean;

  /** Visual and behavioral disabled state. */
  disabled?: boolean;

  /** Optional destination URL. */
  href?: string;
};

/** Props for `Navbar.Actions`. */
export type NavbarActionsOwnProps = NavbarVisibilityProps & {
  /** Action controls such as buttons or menus. */
  children: ReactNode;
};

/** Props for `Navbar.Toggle`. */
export type NavbarToggleOwnProps = NavbarVisibilityProps & {
  /** Render toggle behavior onto a single child element. */
  asChild?: boolean;

  /** Optional toggle content. */
  children?: NavbarToggleDynamicValue<ReactNode>;

  /** Accessible label for the menu toggle control. */
  'aria-label': NavbarToggleDynamicValue<string>;
};

/** Props for `Navbar.Menu`. */
export type NavbarMenuOwnProps = NavbarVisibilityProps & {
  /** Menu content authored explicitly for compact navigation. */
  children: ReactNode;

  /** Controlled open state. */
  open?: boolean;

  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;

  /** Called when menu open state changes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Defines what happens when users interact outside of the menu while it is
   * open.
   */
  onClickOutside?: NavbarOnClickOutsideAction | NavbarOnClickOutsideCallback;

  /** Render mode for the menu panel. */
  placement?: NavbarMenuPlacement;

  /** Closes the menu when links inside are activated. */
  closeOnLinkClick?: boolean;

  /** ID used by toggle `aria-controls`. Generated when omitted. */
  id?: string;

  /** ID of the element that labels the menu region. */
  labelledBy?: string;
};

/** Root props for `Navbar`. */
export type NavbarProps<T extends ElementType = 'nav'> = PolymorphicProps<
  T,
  NavbarOwnProps
>;

/** Props for `Navbar.Container`. */
export type NavbarContainerProps<T extends ElementType = 'div'> =
  PolymorphicProps<T, NavbarContainerOwnProps>;

/** Props for `Navbar.Brand`. */
export type NavbarBrandProps<T extends ElementType = 'span'> = PolymorphicProps<
  T,
  NavbarBrandOwnProps
>;

/** Props for `Navbar.Content`. */
export type NavbarContentProps<T extends ElementType = 'div'> =
  PolymorphicProps<T, NavbarContentOwnProps>;

/** Props for `Navbar.List`. */
export type NavbarListProps<T extends ElementType = 'ul'> = PolymorphicProps<
  T,
  NavbarListOwnProps
>;

/** Props for `Navbar.Item`. */
export type NavbarItemProps<T extends ElementType = 'li'> = PolymorphicProps<
  T,
  NavbarItemOwnProps
>;

/** Props for `Navbar.Link`. */
export type NavbarLinkProps<T extends ElementType = 'a'> = PolymorphicProps<
  T,
  NavbarLinkOwnProps
>;

/** Props for `Navbar.Actions`. */
export type NavbarActionsProps<T extends ElementType = 'div'> =
  PolymorphicProps<T, NavbarActionsOwnProps>;

/** Props for `Navbar.Toggle`. */
export type NavbarToggleProps<T extends ElementType = 'button'> =
  PolymorphicProps<T, NavbarToggleOwnProps>;

/** Props for `Navbar.Menu`. */
export type NavbarMenuProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  NavbarMenuOwnProps
>;
