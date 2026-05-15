import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  UIEventHandler,
} from 'react';

/** Supported menu orientation options. */
export type MenuOrientation = 'vertical' | 'horizontal';

/** Reading direction used for directional keyboard and submenu behavior. */
export type MenuDir = 'ltr' | 'rtl';

/** Visual size options for menu primitives. */
export type MenuSize = 'sm' | 'md' | 'lg';

/** Density scale used for item spacing. */
export type MenuDensity = 'compact' | 'normal' | 'spacious';

/** Selection intent metadata for convenience wrappers. */
export type MenuSelectionMode = 'none' | 'single' | 'multiple';

/** Side placement for floating menu content. */
export type MenuPlacement = 'top' | 'right' | 'bottom' | 'left';

/** Cross-axis alignment for floating content. */
export type MenuAlign = 'start' | 'center' | 'end';

/** Render mode for menu content containers. */
export type MenuContentMode = 'inline' | 'floating';

/** Shared event shape emitted for menu item selection. */
export type MenuSelectEvent = Event & {
  /** Prevents default close behavior for the current selection. */
  preventDefault: () => void;
};

/** Props for `Menu.Root`. */
export type MenuRootProps = {
  /** Menu primitives composed under this root. */
  children?: ReactNode;

  /** Controlled open state. */
  open?: boolean;

  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;

  /** Called whenever open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Reading direction used for submenu side and arrow-key behavior. */
  dir?: MenuDir;

  /** Navigation orientation for arrow-key behavior. */
  orientation?: MenuOrientation;

  /** Enables modal focus/outside-interaction behavior in floating mode. */
  modal?: boolean;

  /** Loops keyboard navigation when reaching list boundaries. */
  loop?: boolean;

  /** Enables character typeahead navigation. */
  typeahead?: boolean;

  /** Default close behavior for selectable items. */
  closeOnSelect?: boolean;

  /** Disables all interactive descendants. */
  disabled?: boolean;

  /** Visual size for descendant primitives. */
  size?: MenuSize;

  /** Visual density for descendant primitives. */
  density?: MenuDensity;

  /** Selection intent metadata for future wrapper conveniences. */
  selectionMode?: MenuSelectionMode;

  /** Called when Escape is pressed from active content. */
  onEscapeKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;

  /** Called when pointer interaction happens outside floating content. */
  onPointerDownOutside?: (event: PointerEvent<HTMLElement>) => void;

  /** Called when focus moves outside floating content. */
  onFocusOutside?: (event: FocusEvent<HTMLElement>) => void;

  /** Called when pointer or focus interaction happens outside. */
  onInteractOutside?: (event: Event) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Props for `Menu.Content`. */
export type MenuContentProps = {
  /** Menu body content. */
  children?: ReactNode;

  /** Optional DOM id. */
  id?: string;

  /** Accessible label for standalone menu content. */
  'aria-label'?: string;

  /** External labeling target for accessible naming. */
  'aria-labelledby'?: string;

  /** Semantic role used for this content container. */
  role?: 'menu' | 'menubar';

  /** Renders behavior into a child element. */
  asChild?: boolean;

  /** Rendering strategy for this content instance. */
  mode?: MenuContentMode;

  /** Floating side placement preference. */
  side?: MenuPlacement;

  /** Floating cross-axis alignment preference. */
  align?: MenuAlign;

  /** Main-axis offset for floating mode. */
  sideOffset?: number;

  /** Cross-axis offset for floating mode. */
  alignOffset?: number;

  /** Enables collision handling for floating mode. */
  avoidCollisions?: boolean;

  /** Viewport padding used by collision handling. */
  collisionPadding?: number;

  /** Sticky strategy for future floating behavior variants. */
  sticky?: 'partial' | 'always';

  /** Renders floating content into a portal when enabled. */
  portal?: boolean | HTMLElement;

  /** Explicit portal container override. */
  container?: HTMLElement | null;

  /** Forces mounted content even when closed. */
  forceMount?: boolean;

  /** Explicit width override. */
  width?: number | string;

  /** Explicit min-width override. */
  minWidth?: number | string;

  /** Explicit max-width override. */
  maxWidth?: number | string;

  /** Explicit max-height override. */
  maxHeight?: number | string;

  /** Called before focus is moved when opening content. */
  onOpenAutoFocus?: (event: Event) => void;

  /** Called before focus is restored when closing content. */
  onCloseAutoFocus?: (event: Event) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role'>;

/** Props for `Menu.Viewport`. */
export type MenuViewportProps = {
  /** Viewport children, usually items/groups/labels. */
  children?: ReactNode;

  /** Renders behavior into a child element. */
  asChild?: boolean;

  /** Enables vertical scrolling for long lists. */
  scrollable?: boolean;

  /** Maximum viewport block size. */
  maxHeight?: number | string;

  /** Overscroll behavior used for touch and wheel input. */
  overscrollBehavior?: 'auto' | 'contain' | 'none';

  /** Scroll event callback from the viewport element. */
  onScroll?: UIEventHandler<HTMLElement>;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onScroll'>;

/** Props for `Menu.Group`. */
export type MenuGroupProps = {
  children?: ReactNode;
  id?: string;
  asChild?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  disabled?: boolean;
  inset?: boolean;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Props for `Menu.Label`. */
export type MenuLabelProps = {
  children?: ReactNode;
  id?: string;
  asChild?: boolean;
  inset?: boolean;
  muted?: boolean;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Shared disabled behavior configuration for focus management. */
export type MenuItemDisabledBehavior = 'skip' | 'focusable';

/** Props for `Menu.Item`. */
export type MenuItemProps = {
  children?: ReactNode;
  id?: string;
  value?: string;
  asChild?: boolean;
  disabled?: boolean;
  disabledBehavior?: MenuItemDisabledBehavior;
  destructive?: boolean;
  highlighted?: boolean;
  inset?: boolean;
  closeOnSelect?: boolean;
  textValue?: string;
  onSelect?: (event: MenuSelectEvent) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onSelect'>;

/** Props for `Menu.ItemText`. */
export type MenuItemTextProps = {
  children?: ReactNode;
  asChild?: boolean;
  truncate?: boolean;
  description?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/** Props for `Menu.ItemIcon`. */
export type MenuItemIconProps = {
  children?: ReactNode;
  asChild?: boolean;
  decorative?: boolean;
  'aria-label'?: string;
  size?: 'sm' | 'md' | 'lg';
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/** Props for `Menu.ItemMeta`. */
export type MenuItemMetaProps = {
  children?: ReactNode;
  asChild?: boolean;
  align?: 'start' | 'end';
  muted?: boolean;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/** Props for `Menu.Separator`. */
export type MenuSeparatorProps = {
  asChild?: boolean;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Props for `Menu.CheckboxItem`. */
export type MenuCheckboxItemProps = {
  children?: ReactNode;
  id?: string;
  value?: string;
  asChild?: boolean;
  checked?: boolean | 'indeterminate';
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  disabledBehavior?: MenuItemDisabledBehavior;
  closeOnSelect?: boolean;
  textValue?: string;
  onSelect?: (event: MenuSelectEvent) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onSelect'>;

/** Props for `Menu.RadioGroup`. */
export type MenuRadioGroupProps = {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Props for `Menu.RadioItem`. */
export type MenuRadioItemProps = {
  children?: ReactNode;
  id?: string;
  value: string;
  asChild?: boolean;
  disabled?: boolean;
  disabledBehavior?: MenuItemDisabledBehavior;
  closeOnSelect?: boolean;
  textValue?: string;
  onSelect?: (event: MenuSelectEvent) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onSelect'>;

/** Props for `Menu.ItemIndicator`. */
export type MenuItemIndicatorProps = {
  children?: ReactNode;
  asChild?: boolean;
  forceMount?: boolean;
  position?: 'start' | 'end';
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/** Props for `Menu.Sub`. */
export type MenuSubProps = {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Enables hover-driven submenu open/close intent handling. */
  openOnHover?: boolean;
  openDelay?: number;
  closeDelay?: number;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Props for `Menu.SubTrigger`. */
export type MenuSubTriggerProps = {
  children?: ReactNode;
  id?: string;
  value?: string;
  asChild?: boolean;
  disabled?: boolean;
  disabledBehavior?: MenuItemDisabledBehavior;
  inset?: boolean;
  textValue?: string;
  /**
   * Optional submenu indicator content.
   * Defaults to `IconChevronRight`; pass `null` to hide it.
   */
  indicator?: ReactNode;
  onSelect?: (event: MenuSelectEvent) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onSelect'>;

/** Props for `Menu.SubContent`. */
export type MenuSubContentProps = {
  children?: ReactNode;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  asChild?: boolean;
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: number;
  portal?: boolean | HTMLElement;
  container?: HTMLElement | null;
  forceMount?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/** Shared inline style helpers used by Menu primitives. */
export type MenuStyleVars = CSSProperties & {
  '--menu-content-available-height'?: string;
  '--menu-trigger-width'?: string;
};
