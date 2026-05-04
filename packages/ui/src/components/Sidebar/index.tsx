/* eslint-disable react-refresh/only-export-components */
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import {
  type FocusLockAdapterComponent,
  type FocusLockAdapterProps,
} from '@/components/FocusLock';
import { Tooltip } from '@/components/Tooltip';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useScrollLock } from '@/hooks/useScrollLock';

import styles from './Sidebar.module.scss';
import type {
  SidebarCompoundComponent,
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupActionProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarInsetProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMode,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarSide,
  SidebarSubMenuItemProps,
  SidebarSubMenuProps,
  SidebarTriggerAction,
  SidebarTriggerProps,
  SidebarVariant,
} from './types';

type SidebarStyleVars = CSSProperties & {
  '--sidebar-collapsed-width'?: string;
  '--sidebar-width'?: string;
};

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
  open: boolean;
  setOpen: (next: boolean) => void;
  side: SidebarSide;
  collapseMode: NonNullable<SidebarProviderProps['collapseMode']>;
  collapsible: boolean;
  registerTrigger: (element: HTMLElement | null) => void;
  triggerElement: HTMLElement | null;
};

type SidebarRootContextValue = {
  mode: SidebarMode;
  side: SidebarSide;
  isCollapsed: boolean;
};

type SidebarItemContextValue = {
  active: boolean;
  disabled: boolean;
};

const DEFAULT_WIDTH = '16rem';
const DEFAULT_COLLAPSED_WIDTH = '4rem';
const STORAGE_KEY = 'themeshift.sidebar.collapsed';

const SidebarContext = createContext<SidebarContextValue | null>(null);
const SidebarRootContext = createContext<SidebarRootContextValue | null>(null);
const SidebarItemContext = createContext<SidebarItemContextValue | null>(null);

const LazyFocusLock = lazy(async () => {
  const module = await import('@/components/FocusLock');

  return {
    default: module.FocusLock,
  };
});

const LazyFocusLockAdapter: FocusLockAdapterComponent = (
  props: FocusLockAdapterProps
) => (
  <Suspense fallback={props.children}>
    <LazyFocusLock {...props} />
  </Suspense>
);

const modeClassMap = {
  static: styles.modeStatic,
  collapsible: styles.modeCollapsible,
  offcanvas: styles.modeOffcanvas,
} satisfies Record<SidebarMode, string>;

const sideClassMap = {
  start: styles.sideStart,
  end: styles.sideEnd,
} satisfies Record<SidebarSide, string>;

const variantClassMap = {
  default: styles.variantDefault,
  inset: styles.variantInset,
  floating: styles.variantFloating,
  rail: styles.variantRail,
} satisfies Record<SidebarVariant, string>;

const menuButtonSizeClassMap = {
  small: styles.menuButtonSmall,
  medium: styles.menuButtonMedium,
  large: styles.menuButtonLarge,
} satisfies Record<NonNullable<SidebarMenuButtonProps['size']>, string>;

const menuButtonVariantClassMap = {
  default: styles.menuButtonVariantDefault,
  subtle: styles.menuButtonVariantSubtle,
  ghost: styles.menuButtonVariantGhost,
} satisfies Record<NonNullable<SidebarMenuButtonProps['variant']>, string>;

const menuBadgeToneClassMap = {
  neutral: styles.menuBadgeNeutral,
  info: styles.menuBadgeInfo,
  success: styles.menuBadgeSuccess,
  warning: styles.menuBadgeWarning,
  danger: styles.menuBadgeDanger,
} satisfies Record<NonNullable<SidebarMenuBadgeProps['tone']>, string>;

function useSidebarContext(component: string) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(`${component} must be used within Sidebar.Provider.`);
  }

  return context;
}

function useSidebarRootContext(component: string) {
  const context = useContext(SidebarRootContext);

  if (!context) {
    throw new Error(`${component} must be used within Sidebar.`);
  }

  return context;
}

function useSidebarItemContext() {
  return useContext(SidebarItemContext);
}

function useSidebarRootContextOptional() {
  return useContext(SidebarRootContext);
}

function resolveMode({
  collapsible,
  mode,
}: {
  collapsible: boolean | undefined;
  mode: SidebarMode | undefined;
}) {
  if (mode) {
    return mode;
  }

  if (collapsible === false) {
    return 'static';
  }

  return 'collapsible';
}

function useControllableState({
  defaultValue,
  onChange,
  value,
}: {
  defaultValue: boolean;
  onChange?: (next: boolean) => void;
  value?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const controlled = value !== undefined;
  const resolved = controlled ? value : uncontrolled;

  const setValue = useCallback(
    (next: boolean) => {
      if (!controlled) {
        setUncontrolled(next);
      }

      onChange?.(next);
    },
    [controlled, onChange]
  );

  return [resolved, setValue] as const;
}

/** Manages shared sidebar state such as collapsed/open behavior for descendant primitives. */
export const SidebarProvider = ({
  children,
  closeOnRouteChange = false,
  collapsible = true,
  collapseMode = 'icon',
  collapsed,
  defaultCollapsed = false,
  defaultOpen = false,
  locationKey,
  onCollapsedChange,
  onOpenChange,
  open,
  persistCollapsed = false,
  side = 'start',
  storageKey = STORAGE_KEY,
}: SidebarProviderProps) => {
  const initialCollapsed = useMemo(() => {
    if (!persistCollapsed || typeof window === 'undefined') {
      return defaultCollapsed;
    }

    const saved = window.localStorage.getItem(storageKey);

    if (saved === 'true') {
      return true;
    }

    if (saved === 'false') {
      return false;
    }

    return defaultCollapsed;
  }, [defaultCollapsed, persistCollapsed, storageKey]);

  const [resolvedCollapsed, setCollapsed] = useControllableState({
    defaultValue: initialCollapsed,
    onChange: onCollapsedChange,
    value: collapsed,
  });
  const [resolvedOpen, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: open,
  });
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const previousLocationKeyRef = useRef(locationKey);
  const warnedLocationKeyRef = useRef(false);

  const registerTrigger = useCallback((element: HTMLElement | null) => {
    triggerElementRef.current = element;
  }, []);

  useEffect(() => {
    if (!persistCollapsed || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, String(resolvedCollapsed));
  }, [persistCollapsed, resolvedCollapsed, storageKey]);

  useEffect(() => {
    if (!closeOnRouteChange) {
      return;
    }

    if (!locationKey) {
      if (!warnedLocationKeyRef.current) {
        warnedLocationKeyRef.current = true;
        console.warn(
          'Sidebar.Provider: closeOnRouteChange is enabled but locationKey is not provided.'
        );
      }

      return;
    }

    if (previousLocationKeyRef.current === undefined) {
      previousLocationKeyRef.current = locationKey;
      return;
    }

    if (previousLocationKeyRef.current !== locationKey) {
      setOpen(false);
    }

    previousLocationKeyRef.current = locationKey;
  }, [closeOnRouteChange, locationKey, setOpen]);

  const value = useMemo(
    () => ({
      collapseMode,
      collapsed: resolvedCollapsed,
      collapsible,
      open: resolvedOpen,
      registerTrigger,
      setCollapsed,
      setOpen,
      side,
      triggerElement: triggerElementRef.current,
    }),
    [
      collapseMode,
      collapsible,
      registerTrigger,
      resolvedCollapsed,
      resolvedOpen,
      setCollapsed,
      setOpen,
      side,
    ]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

/** Renders the main sidebar container and applies mode, side, variant, and accessibility behavior. */
const SidebarRoot = <T extends ElementType = 'aside'>({
  ariaLabel,
  as,
  children,
  className,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  collapsible,
  labelledBy,
  mode,
  side,
  style,
  variant = 'default',
  width = DEFAULT_WIDTH,
  ...props
}: SidebarProps<T>) => {
  const provider = useSidebarContext('Sidebar');
  const Component = (as ?? 'aside') as ElementType;
  const resolvedMode = resolveMode({ collapsible, mode });
  const resolvedSide = side ?? provider.side;
  const isCollapsed =
    resolvedMode === 'collapsible' &&
    provider.collapsible &&
    provider.collapsed;
  const isOffcanvasOpen = resolvedMode === 'offcanvas' && provider.open;
  const rootRef = useRef<HTMLElement | null>(null);

  useScrollLock(resolvedMode === 'offcanvas' && isOffcanvasOpen);

  useOnClickOutside(rootRef, () => {
    if (!isOffcanvasOpen) {
      return;
    }

    provider.setOpen(false);
  });

  useEffect(() => {
    if (!isOffcanvasOpen) {
      return;
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      provider.setOpen(false);
      provider.triggerElement?.focus();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOffcanvasOpen, provider]);

  const styleVars = {
    ...style,
    '--sidebar-collapsed-width': collapsedWidth,
    '--sidebar-width': width,
  } satisfies SidebarStyleVars;

  const landmarkProps = labelledBy
    ? { 'aria-labelledby': labelledBy }
    : { 'aria-label': ariaLabel ?? 'Primary navigation' };

  const content = (
    <SidebarRootContext.Provider
      value={{ isCollapsed, mode: resolvedMode, side: resolvedSide }}
    >
      <Component
        {...props}
        {...landmarkProps}
        className={classNames(
          styles.root,
          modeClassMap[resolvedMode],
          sideClassMap[resolvedSide],
          variantClassMap[variant],
          isCollapsed && styles.collapsed,
          isOffcanvasOpen && styles.offcanvasOpen,
          className
        )}
        data-collapsed={isCollapsed || undefined}
        data-mode={resolvedMode}
        data-side={resolvedSide}
        ref={rootRef}
        style={styleVars}
      >
        {children}
      </Component>
    </SidebarRootContext.Provider>
  );

  if (resolvedMode !== 'offcanvas') {
    return content;
  }

  return (
    <Suspense fallback={content}>
      <LazyFocusLockAdapter
        active={isOffcanvasOpen}
        autoFocus={isOffcanvasOpen}
        containerRef={rootRef}
        returnFocus={!isOffcanvasOpen}
      >
        {content}
      </LazyFocusLockAdapter>
    </Suspense>
  );
};

/** Places content in a header region at the top of the sidebar. */
const SidebarHeader = <T extends ElementType = 'header'>({
  as,
  children,
  className,
  sticky = true,
  ...props
}: SidebarHeaderProps<T>) => {
  const Component = (as ?? 'header') as ElementType;

  return (
    <Component
      {...props}
      className={classNames(styles.header, sticky && styles.sticky, className)}
    >
      {children}
    </Component>
  );
};

/** Hosts the primary scrollable content area for navigation groups and menu items. */
const SidebarContent = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  scrollable = true,
  ...props
}: SidebarContentProps<T>) => {
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      {...props}
      className={classNames(
        styles.content,
        scrollable && styles.contentScrollable,
        className
      )}
    >
      {children}
    </Component>
  );
};

/** Places content in a footer region at the bottom of the sidebar. */
const SidebarFooter = <T extends ElementType = 'footer'>({
  as,
  children,
  className,
  sticky = true,
  ...props
}: SidebarFooterProps<T>) => {
  const Component = (as ?? 'footer') as ElementType;

  return (
    <Component
      {...props}
      className={classNames(styles.footer, sticky && styles.sticky, className)}
    >
      {children}
    </Component>
  );
};

/** Groups related sidebar content and can optionally toggle visibility of its children. */
const SidebarGroup = <T extends ElementType = 'section'>({
  as,
  children,
  className,
  collapsible = false,
  defaultOpen = true,
  onOpenChange,
  open,
  ...props
}: SidebarGroupProps<T>) => {
  const Component = (as ?? 'section') as ElementType;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const resolvedOpen = open ?? uncontrolledOpen;

  return (
    <Component
      {...props}
      className={classNames(styles.group, className)}
      data-open={resolvedOpen || undefined}
    >
      {collapsible && (
        <button
          aria-expanded={resolvedOpen}
          className={styles.groupToggle}
          onClick={() => {
            const next = !resolvedOpen;

            if (open === undefined) {
              setUncontrolledOpen(next);
            }

            onOpenChange?.(next);
          }}
          type="button"
        >
          Toggle group
        </button>
      )}
      {resolvedOpen && children}
    </Component>
  );
};

/** Labels a sidebar group and can hide visually when the sidebar is collapsed. */
const SidebarGroupLabel = <T extends ElementType = 'h3'>({
  as,
  children,
  className,
  visuallyHiddenWhenCollapsed = true,
  ...props
}: SidebarGroupLabelProps<T>) => {
  const Component = (as ?? 'h3') as ElementType;
  const root = useSidebarRootContext('Sidebar.GroupLabel');

  return (
    <Component
      {...props}
      className={classNames(
        styles.groupLabel,
        visuallyHiddenWhenCollapsed &&
          root.isCollapsed &&
          styles.visuallyHidden,
        className
      )}
    >
      {children}
    </Component>
  );
};

/** Renders an auxiliary action control associated with a sidebar group heading. */
const SidebarGroupAction = <T extends ElementType = 'button'>({
  as,
  asChild = false,
  children,
  className,
  label,
  ...props
}: SidebarGroupActionProps<T>) => {
  const Component = asChild ? Slot : ((as ?? 'button') as ElementType);

  return (
    <Component
      {...props}
      aria-label={label}
      className={classNames(styles.groupAction, className)}
      type={asChild ? undefined : 'button'}
    >
      {children}
    </Component>
  );
};

/** Wraps a list of sidebar menu items. */
const SidebarMenu = <T extends ElementType = 'ul'>({
  as,
  children,
  className,
  ...props
}: SidebarMenuProps<T>) => {
  const Component = (as ?? 'ul') as ElementType;

  return (
    <Component {...props} className={classNames(styles.menu, className)}>
      {children}
    </Component>
  );
};

/** Provides item-level active and disabled state for menu content. */
const SidebarMenuItem = <T extends ElementType = 'li'>({
  active = false,
  as,
  children,
  className,
  disabled = false,
  ...props
}: SidebarMenuItemProps<T>) => {
  const Component = (as ?? 'li') as ElementType;

  return (
    <SidebarItemContext.Provider value={{ active, disabled }}>
      <Component
        {...props}
        className={classNames(
          styles.menuItem,
          active && styles.menuItemActive,
          disabled && styles.menuItemDisabled,
          className
        )}
      >
        {children}
      </Component>
    </SidebarItemContext.Provider>
  );
};

/** Renders an interactive menu control with optional badge, sizing, variants, and collapsed tooltip support. */
const SidebarMenuButton = <T extends ElementType = 'button'>({
  active,
  as,
  asChild = false,
  badge,
  children,
  className,
  disabled,
  iconOnlyLabel,
  size = 'medium',
  tooltip,
  variant = 'default',
  ...props
}: SidebarMenuButtonProps<T>) => {
  const item = useSidebarItemContext();
  const root = useSidebarRootContext('Sidebar.MenuButton');
  const Component = asChild ? Slot : ((as ?? 'button') as ElementType);
  const isActive = active ?? item?.active ?? false;
  const isDisabled = disabled ?? item?.disabled ?? false;
  const isCollapsed = root.isCollapsed;

  const content = (
    <Component
      {...props}
      aria-current={isActive ? 'page' : undefined}
      aria-label={iconOnlyLabel}
      className={classNames(
        styles.menuButton,
        menuButtonSizeClassMap[size],
        menuButtonVariantClassMap[variant],
        isActive && styles.menuButtonActive,
        isDisabled && styles.menuButtonDisabled,
        className
      )}
      data-active={isActive || undefined}
      data-collapsed={isCollapsed || undefined}
      disabled={asChild ? undefined : isDisabled}
    >
      <span className={styles.menuButtonContent}>{children}</span>
      {badge ? <span className={styles.menuButtonBadge}>{badge}</span> : null}
    </Component>
  );

  if (isCollapsed && tooltip) {
    return <Tooltip content={tooltip}>{content as never}</Tooltip>;
  }

  return content;
};

/** Displays compact status or count metadata alongside a menu item. */
const SidebarMenuBadge = <T extends ElementType = 'span'>({
  as,
  children,
  className,
  tone = 'neutral',
  ...props
}: SidebarMenuBadgeProps<T>) => {
  const root = useSidebarRootContext('Sidebar.MenuBadge');
  const Component = (as ?? 'span') as ElementType;

  return (
    <Component
      {...props}
      aria-hidden={root.isCollapsed || undefined}
      className={classNames(
        styles.menuBadge,
        menuBadgeToneClassMap[tone],
        className
      )}
    >
      {children}
    </Component>
  );
};

/** Renders a secondary action for a menu item, optionally revealed on hover. */
const SidebarMenuAction = <T extends ElementType = 'button'>({
  as,
  asChild = false,
  children,
  className,
  label,
  showOnHover = true,
  ...props
}: SidebarMenuActionProps<T>) => {
  const Component = asChild ? Slot : ((as ?? 'button') as ElementType);

  return (
    <Component
      {...props}
      aria-label={label}
      className={classNames(
        styles.menuAction,
        showOnHover && styles.menuActionOnHover,
        className
      )}
      type={asChild ? undefined : 'button'}
    >
      {children}
    </Component>
  );
};

/** Renders a nested menu list with built-in expand and collapse behavior. */
const SidebarSubMenu = <T extends ElementType = 'ul'>({
  as,
  children,
  className,
  defaultOpen = true,
  onOpenChange,
  open,
  ...props
}: SidebarSubMenuProps<T>) => {
  const Component = (as ?? 'ul') as ElementType;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const resolvedOpen = open ?? uncontrolledOpen;

  return (
    <div className={styles.subMenuWrap}>
      <button
        aria-expanded={resolvedOpen}
        className={styles.subMenuToggle}
        onClick={() => {
          const next = !resolvedOpen;

          if (open === undefined) {
            setUncontrolledOpen(next);
          }

          onOpenChange?.(next);
        }}
        type="button"
      >
        Toggle submenu
      </button>

      {resolvedOpen && (
        <Component {...props} className={classNames(styles.subMenu, className)}>
          {children}
        </Component>
      )}
    </div>
  );
};

/** Renders a nested menu item within a sidebar submenu. */
const SidebarSubMenuItem = <T extends ElementType = 'li'>({
  active = false,
  as,
  children,
  className,
  disabled = false,
  ...props
}: SidebarSubMenuItemProps<T>) => {
  const Component = (as ?? 'li') as ElementType;

  return (
    <Component
      {...props}
      className={classNames(
        styles.subMenuItem,
        active && styles.subMenuItemActive,
        disabled && styles.subMenuItemDisabled,
        className
      )}
    >
      {children}
    </Component>
  );
};

/** Visually separates groups of sidebar content. */
const SidebarSeparator = <T extends ElementType = 'hr'>({
  as,
  className,
  decorative = true,
  ...props
}: SidebarSeparatorProps<T>) => {
  const Component = (as ?? 'hr') as ElementType;

  return (
    <Component
      {...props}
      aria-hidden={decorative || undefined}
      className={classNames(styles.separator, className)}
      role={decorative ? 'presentation' : undefined}
    />
  );
};

function runTriggerAction({
  action,
  context,
}: {
  action: SidebarTriggerAction;
  context: SidebarContextValue;
}) {
  if (action === 'expand') {
    context.setCollapsed(false);
    return;
  }

  if (action === 'collapse') {
    context.setCollapsed(true);
    return;
  }

  if (action === 'open') {
    context.setOpen(true);
    return;
  }

  if (action === 'close') {
    context.setOpen(false);
    return;
  }

  if (context.collapseMode === 'offcanvas') {
    context.setOpen(!context.open);
    return;
  }

  context.setCollapsed(!context.collapsed);
}

/** Provides a rail control that toggles sidebar expansion and collapse. */
const SidebarRail = <T extends ElementType = 'button'>({
  as,
  children,
  className,
  label = 'Expand sidebar',
  ...props
}: SidebarRailProps<T>) => {
  const provider = useSidebarContext('Sidebar.Rail');
  const Component = (as ?? 'button') as ElementType;

  return (
    <Component
      {...props}
      aria-label={label}
      className={classNames(styles.rail, className)}
      onClick={(event: MouseEvent<HTMLElement>) => {
        props.onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        runTriggerAction({ action: 'toggle', context: provider });
      }}
      type="button"
    >
      {children}
    </Component>
  );
};

/** Provides a trigger button that can toggle, open, close, expand, or collapse the sidebar. */
const SidebarTrigger = <T extends ElementType = 'button'>({
  action = 'toggle',
  as,
  asChild = false,
  children,
  className,
  label,
  ...props
}: SidebarTriggerProps<T>) => {
  const provider = useSidebarContext('Sidebar.Trigger');
  const root = useSidebarRootContextOptional();
  const Component = asChild ? Slot : ((as ?? 'button') as ElementType);
  const localRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    provider.registerTrigger(localRef.current);
  }, [provider]);

  const resolvedLabel =
    label ??
    (provider.collapsed || !provider.open ? 'Open sidebar' : 'Close sidebar');
  const isOffcanvas =
    root?.mode === 'offcanvas' || provider.collapseMode === 'offcanvas';
  const expanded = isOffcanvas ? provider.open : !provider.collapsed;

  return (
    <Component
      {...props}
      aria-expanded={expanded}
      aria-label={resolvedLabel}
      className={classNames(styles.trigger, className)}
      onClick={(event: MouseEvent<HTMLElement>) => {
        props.onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        runTriggerAction({ action, context: provider });
      }}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        props.onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          runTriggerAction({ action, context: provider });
        }
      }}
      ref={(node: HTMLElement | null) => {
        localRef.current = node;
      }}
      type={asChild ? undefined : 'button'}
    >
      {children ?? 'Toggle'}
    </Component>
  );
};

/** Wraps main page content that sits adjacent to the sidebar and optionally applies inset padding. */
const SidebarInset = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  padded = true,
  ...props
}: SidebarInsetProps<T>) => {
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      {...props}
      className={classNames(
        styles.inset,
        padded && styles.insetPadded,
        className
      )}
    >
      {children}
    </Component>
  );
};

export const Sidebar = Object.assign(SidebarRoot, {
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupAction: SidebarGroupAction,
  GroupLabel: SidebarGroupLabel,
  Header: SidebarHeader,
  Inset: SidebarInset,
  Menu: SidebarMenu,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuButton: SidebarMenuButton,
  MenuItem: SidebarMenuItem,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Separator: SidebarSeparator,
  SubMenu: SidebarSubMenu,
  SubMenuItem: SidebarSubMenuItem,
  Trigger: SidebarTrigger,
}) satisfies SidebarCompoundComponent;

export type {
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupActionProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarInsetProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMode,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarSide,
  SidebarState,
  SidebarSubMenuItemProps,
  SidebarSubMenuProps,
  SidebarTriggerProps,
  SidebarVariant,
} from './types';
