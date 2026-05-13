import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';

/** Visual expansion state used by sidebar UIs. */
export type SidebarState = 'expanded' | 'collapsed';

/** Behavior mode for the sidebar root. */
export type SidebarMode = 'static' | 'collapsible' | 'offcanvas';

/** Logical placement edge that supports LTR and RTL layouts. */
export type SidebarSide = 'start' | 'end';

/** Visual style variant for the sidebar container. */
export type SidebarVariant = 'default' | 'inset' | 'floating' | 'rail';

/** Action presets used by `Sidebar.Trigger`. */
export type SidebarTriggerAction =
  | 'toggle'
  | 'expand'
  | 'collapse'
  | 'open'
  | 'close';

/** Shared polymorphic helper used by sidebar primitives. */
export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  /** Render this primitive as a different element. */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as' | 'asChild'>;

/**
 * Shared state and behavior controls for a sidebar tree.
 *
 * Use Provider when you need desktop collapse state and mobile/offcanvas open
 * state to stay in sync across triggers and layout regions.
 */
export type SidebarProviderProps = {
  /** Sidebar subtree controlled by this provider. */
  children: ReactNode;

  /** Closes offcanvas state when `locationKey` changes. */
  closeOnRouteChange?: boolean;

  /** Enables desktop collapsible behavior by default. */
  collapsible?: boolean;

  /** Default collapse behavior strategy. */
  collapseMode?: 'icon' | 'rail' | 'offcanvas' | 'none';

  /** Controlled desktop collapsed state. */
  collapsed?: boolean;

  /** Initial desktop collapsed state for uncontrolled usage. */
  defaultCollapsed?: boolean;

  /** Initial offcanvas open state for uncontrolled usage. */
  defaultOpen?: boolean;

  /** Router-driven change key used with `closeOnRouteChange`. */
  locationKey?: string;

  /** Called when desktop collapsed state changes. */
  onCollapsedChange?: (collapsed: boolean) => void;

  /** Called when offcanvas open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Controlled offcanvas open state. */
  open?: boolean;

  /** Persists collapsed state to local storage. */
  persistCollapsed?: boolean;

  /** Default logical side for descendant sidebars. */
  side?: SidebarSide;

  /** Storage key used when `persistCollapsed` is enabled. */
  storageKey?: string;
};

/** Root sidebar props shared by polymorphic `Sidebar`. */
export type SidebarOwnProps = {
  /** Accessible name when no `labelledBy` reference is provided. */
  ariaLabel?: string;

  /** Sidebar content and primitives. */
  children: ReactNode;

  /** Optional class name for custom styling hooks. */
  className?: string;

  /** Width used when sidebar is collapsed. */
  collapsedWidth?: string;

  /** Optional shorthand for collapsible behavior (`false` maps to static). */
  collapsible?: boolean;

  /** ID reference to an external labelling element. */
  labelledBy?: string;

  /** Sidebar behavior mode. */
  mode?: SidebarMode;

  /** Logical placement side for this sidebar instance. */
  side?: SidebarSide;

  /** Optional inline style overrides. */
  style?: CSSProperties;

  /** Visual variant for the sidebar container. */
  variant?: SidebarVariant;

  /** Expanded sidebar width. */
  width?: string;
};

/** Public props for `Sidebar`. */
export type SidebarProps<T extends ElementType = 'aside'> = PolymorphicProps<
  T,
  SidebarOwnProps
>;

/** Props for `Sidebar.Header`. */
export type SidebarHeaderProps<T extends ElementType = 'header'> =
  PolymorphicProps<
    T,
    {
      /** Header content, such as branding or trigger controls. */
      children: ReactNode;

      /** Optional class name for header styling hooks. */
      className?: string;

      /** Pins the header to the top of the sidebar when scrolling. */
      sticky?: boolean;
    }
  >;

/** Props for `Sidebar.Content`. */
export type SidebarContentProps<T extends ElementType = 'div'> =
  PolymorphicProps<
    T,
    {
      /** Main sidebar content, usually groups and menus. */
      children: ReactNode;

      /** Optional class name for content styling hooks. */
      className?: string;

      /** Enables scrolling on the main content region. */
      scrollable?: boolean;
    }
  >;

/** Props for `Sidebar.Footer`. */
export type SidebarFooterProps<T extends ElementType = 'footer'> =
  PolymorphicProps<
    T,
    {
      /** Content shown when the sidebar is collapsed. */
      collapsedContent?: ReactNode;

      /** Footer content, such as account actions or settings. */
      children: ReactNode;

      /** Optional class name for footer styling hooks. */
      className?: string;

      /** Hides footer content when the sidebar is collapsed. */
      hideWhenCollapsed?: boolean;

      /** Pins the footer to the bottom of the sidebar when scrolling. */
      sticky?: boolean;
    }
  >;

/** Props for `Sidebar.Group`. */
export type SidebarGroupProps<T extends ElementType = 'section'> =
  PolymorphicProps<
    T,
    {
      /** Group content, typically labels and menu lists. */
      children: ReactNode;

      /** Optional class name for group styling hooks. */
      className?: string;

      /** Enables group-level expand/collapse behavior. */
      collapsible?: boolean;

      /** Initial open state for uncontrolled usage. */
      defaultOpen?: boolean;

      /** Called when group open state changes. */
      onOpenChange?: (open: boolean) => void;

      /** Controlled open state. */
      open?: boolean;
    }
  >;

/** Props for `Sidebar.GroupLabel`. */
export type SidebarGroupLabelProps<T extends ElementType = 'h3'> =
  PolymorphicProps<
    T,
    {
      /** Group heading content. */
      children: ReactNode;

      /** Optional class name for label styling hooks. */
      className?: string;

      /** Visually hides the label while collapsed, keeping semantics intact. */
      visuallyHiddenWhenCollapsed?: boolean;
    }
  >;

/** Props for `Sidebar.GroupAction`. */
export type SidebarGroupActionProps<T extends ElementType = 'button'> =
  PolymorphicProps<
    T,
    {
      /** Action icon or custom content. */
      children: ReactNode;

      /** Optional class name for action styling hooks. */
      className?: string;

      /** Opacity applied to icon content rendered by this action. */
      iconOpacity?: number;

      /** Required accessible label for the action control. */
      label: string;
    }
  >;

/** Props for `Sidebar.Menu`. */
export type SidebarMenuProps<T extends ElementType = 'ul'> = PolymorphicProps<
  T,
  {
    /** Menu item structure. */
    children: ReactNode;

    /** Optional class name for menu styling hooks. */
    className?: string;

    /** Menu orientation. Currently supports vertical lists. */
    orientation?: 'vertical';
  }
>;

/** Props for `Sidebar.MenuItem`. */
export type SidebarMenuItemProps<T extends ElementType = 'li'> =
  PolymorphicProps<
    T,
    {
      /** Marks this item as active for inherited styling. */
      active?: boolean;

      /** Item structure and child controls. */
      children: ReactNode;

      /** Optional class name for item styling hooks. */
      className?: string;

      /** Icon used by the collapse toggle. Defaults to a chevron-right icon. */
      collapseIcon?: ReactNode | ((open: boolean) => ReactNode);

      /** Accessible name for the collapse toggle button. */
      collapseToggleLabel?: string;

      /** Enables inline expand/collapse behavior for nested menu content. */
      collapsible?: boolean;

      /** Initial open state for uncontrolled usage when collapsible. */
      defaultOpen?: boolean;

      /** Disables interactive descendants through context-aware styles. */
      disabled?: boolean;

      /** Called when collapsible open state changes. */
      onOpenChange?: (open: boolean) => void;

      /** Controlled open state when collapsible. */
      open?: boolean;
    }
  >;

/** Props for `Sidebar.MenuButton`. */
export type SidebarMenuButtonProps<T extends ElementType = 'button'> =
  PolymorphicProps<
    T,
    {
      /** Marks this menu button as active. */
      active?: boolean;

      /** Optional trailing badge content rendered within the button row. */
      badge?: ReactNode;

      /** Button label and optional icon content. */
      children: ReactNode;

      /** Optional class name for button styling hooks. */
      className?: string;

      /** Disables interaction and applies disabled styles. */
      disabled?: boolean;

      /** Accessible label for icon-only or collapsed button states. */
      iconOnlyLabel?: string;

      /** Opacity applied to icon content rendered inside the button. */
      iconOpacity?: number;

      /** Size preset for button spacing and height. */
      size?: 'small' | 'medium' | 'large';

      /** Visual button variant. */
      variant?: 'default' | 'subtle' | 'ghost';
    }
  >;

/** Props for `Sidebar.MenuBadge`. */
export type SidebarMenuBadgeProps<T extends ElementType = 'span'> =
  PolymorphicProps<
    T,
    {
      /** Badge content, such as counts or short status text. */
      children: ReactNode;

      /** Optional class name for badge styling hooks. */
      className?: string;

      /** Semantic tone preset for badge styling. */
      tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
    }
  >;

/** Props for `Sidebar.MenuAction`. */
export type SidebarMenuActionProps<T extends ElementType = 'button'> =
  PolymorphicProps<
    T,
    {
      /** Action icon or custom content. */
      children: ReactNode;

      /** Optional class name for action styling hooks. */
      className?: string;

      /** Opacity applied to icon content rendered by this action. */
      iconOpacity?: number;

      /** Required accessible label for the action control. */
      label: string;

      /** Shows the action primarily on hover/focus affordances. */
      showOnHover?: boolean;
    }
  >;

/** Props for `Sidebar.SubMenu`. */
export type SidebarSubMenuProps<T extends ElementType = 'ul'> =
  PolymorphicProps<
    T,
    {
      /** Nested menu item structure. */
      children: ReactNode;

      /** Optional class name for submenu styling hooks. */
      className?: string;

      /** Initial open state for uncontrolled usage. */
      defaultOpen?: boolean;

      /** Called when submenu open state changes. */
      onOpenChange?: (open: boolean) => void;

      /** Controlled open state. */
      open?: boolean;
    }
  >;

/** Props for `Sidebar.SubMenuItem`. */
export type SidebarSubMenuItemProps<T extends ElementType = 'li'> =
  PolymorphicProps<
    T,
    {
      /** Marks this submenu item as active. */
      active?: boolean;

      /** Submenu item content. */
      children: ReactNode;

      /** Optional class name for submenu item styling hooks. */
      className?: string;

      /** Disables this submenu item. */
      disabled?: boolean;
    }
  >;

/** Props for `Sidebar.Separator`. */
export type SidebarSeparatorProps<T extends ElementType = 'hr'> =
  PolymorphicProps<
    T,
    {
      /** Optional class name for separator styling hooks. */
      className?: string;

      /** Marks separator as decorative and hides it from assistive tech. */
      decorative?: boolean;
    }
  >;

/** Props for `Sidebar.Rail`. */
export type SidebarRailProps<T extends ElementType = 'button'> =
  PolymorphicProps<
    T,
    {
      /** Optional custom rail content. */
      children?: ReactNode;

      /** Optional class name for rail styling hooks. */
      className?: string;

      /** Accessible label for rail toggle behavior. */
      label?: string;
    }
  >;

/** Props for `Sidebar.Trigger`. */
export type SidebarTriggerProps<T extends ElementType = 'button'> =
  PolymorphicProps<
    T,
    {
      /** Trigger action behavior. */
      action?: SidebarTriggerAction;

      /** Optional trigger content. */
      children?: ReactNode;

      /** Optional class name for trigger styling hooks. */
      className?: string;

      /** Controls trigger visibility. */
      isVisible?: boolean | ((collapsed: boolean) => boolean);

      /** Opacity applied to icon content rendered by the trigger. */
      iconOpacity?: number;

      /** Accessible label for assistive technologies. */
      label?: string;

      /** Trigger positioning strategy. */
      placement?: 'inside' | 'manual' | 'outside';
    }
  >;

/** Props for `Sidebar.Inset`. */
export type SidebarInsetProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  {
    /** Main app/content region rendered beside the sidebar. */
    children: ReactNode;

    /** Optional class name for inset styling hooks. */
    className?: string;

    /** Applies default content padding to the inset area. */
    padded?: boolean;
  }
>;

/** Compound component contract for the Sidebar export. */
export type SidebarCompoundComponent = {
  /** Scrollable middle content region. */
  Content: <T extends ElementType = 'div'>(
    props: SidebarContentProps<T>
  ) => ReactElement;

  /** Footer region for account and utility actions. */
  Footer: <T extends ElementType = 'footer'>(
    props: SidebarFooterProps<T>
  ) => ReactElement;

  /** Optional grouped navigation section. */
  Group: <T extends ElementType = 'section'>(
    props: SidebarGroupProps<T>
  ) => ReactElement;

  /** Group-level compact action control. */
  GroupAction: <T extends ElementType = 'button'>(
    props: SidebarGroupActionProps<T>
  ) => ReactElement;

  /** Group heading label. */
  GroupLabel: <T extends ElementType = 'h3'>(
    props: SidebarGroupLabelProps<T>
  ) => ReactElement;

  /** Header region for branding and global controls. */
  Header: <T extends ElementType = 'header'>(
    props: SidebarHeaderProps<T>
  ) => ReactElement;

  /** Main content wrapper rendered beside the sidebar. */
  Inset: <T extends ElementType = 'div'>(
    props: SidebarInsetProps<T>
  ) => ReactElement;

  /** Semantic list wrapper for primary menu items. */
  Menu: <T extends ElementType = 'ul'>(
    props: SidebarMenuProps<T>
  ) => ReactElement;

  /** Trailing action control inside a menu row. */
  MenuAction: <T extends ElementType = 'button'>(
    props: SidebarMenuActionProps<T>
  ) => ReactElement;

  /** Compact status/count badge for menu rows. */
  MenuBadge: <T extends ElementType = 'span'>(
    props: SidebarMenuBadgeProps<T>
  ) => ReactElement;

  /** Primary interactive control for a menu item. */
  MenuButton: <T extends ElementType = 'button'>(
    props: SidebarMenuButtonProps<T>
  ) => ReactElement;

  /** Structural wrapper for each menu row. */
  MenuItem: <T extends ElementType = 'li'>(
    props: SidebarMenuItemProps<T>
  ) => ReactElement;

  /** Shared sidebar state provider. */
  Provider: (props: SidebarProviderProps) => ReactElement;

  /** Optional collapsible rail/toggle strip. */
  Rail: <T extends ElementType = 'button'>(
    props: SidebarRailProps<T>
  ) => ReactElement;

  /** Decorative or semantic section separator. */
  Separator: <T extends ElementType = 'hr'>(
    props: SidebarSeparatorProps<T>
  ) => ReactElement;

  /** Nested submenu list. */
  SubMenu: <T extends ElementType = 'ul'>(
    props: SidebarSubMenuProps<T>
  ) => ReactElement;

  /** Nested submenu row wrapper. */
  SubMenuItem: <T extends ElementType = 'li'>(
    props: SidebarSubMenuItemProps<T>
  ) => ReactElement;

  /** Shared control for toggling sidebar state. */
  Trigger: <T extends ElementType = 'button'>(
    props: SidebarTriggerProps<T>
  ) => ReactElement;
} & (<T extends ElementType = 'aside'>(props: SidebarProps<T>) => ReactElement);

/** Shared native element props used by low-level sidebar helpers. */
export type SidebarElementProps = HTMLAttributes<HTMLElement>;
