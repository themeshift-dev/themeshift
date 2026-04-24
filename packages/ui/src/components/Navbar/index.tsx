/* eslint-disable react-refresh/only-export-components */
import FocusLock from 'react-focus-lock';
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useScrollLock } from '@/hooks/useScrollLock';

import styles from './Navbar.module.scss';
import type {
  NavbarActionsProps,
  NavbarBreakpoint,
  NavbarBrandProps,
  NavbarContainerProps,
  NavbarContentProps,
  NavbarHeight,
  NavbarItemProps,
  NavbarLinkProps,
  NavbarListOrientation,
  NavbarListProps,
  NavbarMaxWidth,
  NavbarMenuPlacement,
  NavbarMenuProps,
  NavbarPadding,
  NavbarPlacement,
  NavbarPosition,
  NavbarProps,
  NavbarShadow,
  NavbarSurface,
  NavbarToggleProps,
  NavbarVisibilityProps,
  NavbarWidth,
} from './types';

type NavbarStyleVars = CSSProperties & {
  '--navbar-max-width'?: string;
};

type MenuRecord = {
  id: string;
  menuElement: HTMLElement | null;
  open: boolean;
  placement: NavbarMenuPlacement;
  setOpen: (open: boolean) => void;
  setToggleElement: (node: HTMLElement | null) => void;
  toggleElement: HTMLElement | null;
};

type NavbarContextValue = {
  getNearestMenu: (toggleElement: HTMLElement | null) => MenuRecord | null;
  registerOrUpdateMenu: (menu: MenuRecord) => void;
  rootElement: HTMLElement | null;
  unregisterMenu: (id: string) => void;
};

const NavbarContext = createContext<NavbarContextValue | null>(null);
const NavbarMenuScopeContext = createContext<boolean>(false);

const positionClassMap = {
  static: styles.positionStatic,
  sticky: styles.positionSticky,
  fixed: styles.positionFixed,
} satisfies Record<NavbarPosition, string>;

const placementClassMap = {
  top: styles.placementTop,
  bottom: styles.placementBottom,
} satisfies Record<NavbarPlacement, string>;

const widthClassMap = {
  full: styles.widthFull,
  contained: styles.widthContained,
} satisfies Record<NavbarWidth, string>;

const maxWidthClassMap = {
  small: styles.maxWidthSmall,
  medium: styles.maxWidthMedium,
  large: styles.maxWidthLarge,
  xLarge: styles.maxWidthXLarge,
  full: styles.maxWidthFull,
} satisfies Record<NavbarMaxWidth, string>;

const heightClassMap = {
  small: styles.heightSmall,
  medium: styles.heightMedium,
  large: styles.heightLarge,
} satisfies Record<NavbarHeight, string>;

const paddingClassMap = {
  none: styles.paddingNone,
  small: styles.paddingSmall,
  medium: styles.paddingMedium,
  large: styles.paddingLarge,
} satisfies Record<NavbarPadding, string>;

const surfaceClassMap = {
  default: styles.surfaceDefault,
  subtle: styles.surfaceSubtle,
  elevated: styles.surfaceElevated,
  transparent: styles.surfaceTransparent,
} satisfies Record<NavbarSurface, string>;

const shadowClassMap = {
  none: styles.shadowNone,
  small: styles.shadowSmall,
  medium: styles.shadowMedium,
  large: styles.shadowLarge,
} satisfies Record<NavbarShadow, string>;

const menuPlacementClassMap = {
  belowNavbar: styles.menuPlacementBelowNavbar,
  overlay: styles.menuPlacementOverlay,
  drawer: styles.menuPlacementDrawer,
} satisfies Record<NavbarMenuPlacement, string>;

const listOrientationClassMap = {
  horizontal: styles.listHorizontal,
  vertical: styles.listVertical,
} satisfies Record<NavbarListOrientation, string>;

const hideBelowClassMap = {
  mobile: undefined,
  tablet: styles.hideBelowTablet,
  desktop: styles.hideBelowDesktop,
} satisfies Record<NavbarBreakpoint, string | undefined>;

const showBelowClassMap = {
  mobile: styles.showBelowMobile,
  tablet: styles.showBelowTablet,
  desktop: styles.showBelowDesktop,
} satisfies Record<NavbarBreakpoint, string>;

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function useNavbarContext(component: string) {
  const context = useContext(NavbarContext);

  if (!context) {
    throw new Error(`${component} must be used within Navbar.`);
  }

  return context;
}

function getNodeOrderIndex(root: HTMLElement, node: Node) {
  if (root === node) {
    return 0;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let index = 0;

  while (walker.nextNode()) {
    index += 1;

    if (walker.currentNode === node) {
      return index;
    }
  }

  return Number.POSITIVE_INFINITY;
}

function getVisibilityClasses({
  hideBelow,
  showBelow,
}: NavbarVisibilityProps): string[] {
  const classes: string[] = [];

  if (hideBelow) {
    const hideClass = hideBelowClassMap[hideBelow];

    if (hideClass) {
      classes.push(hideClass);
    }
  }

  if (showBelow) {
    classes.push(showBelowClassMap[showBelow]);
  }

  return classes;
}

function callEventHandler<EventType>(
  handler: ((event: EventType) => void) | undefined,
  event: EventType
) {
  handler?.(event);
}

function resolveDynamicValue<T>(
  value: T | ((isOpen: boolean) => T) | undefined,
  isOpen: boolean
) {
  if (typeof value === 'function') {
    return (value as (isOpen: boolean) => T)(isOpen);
  }

  return value;
}

function getMenuAriaLabel(
  ariaLabel: string | undefined,
  labelledBy: string | undefined
) {
  if (labelledBy) {
    return undefined;
  }

  return ariaLabel;
}

function isAnchorDisabledCandidate(element: HTMLElement | null) {
  return Boolean(element?.closest('a[href]'));
}

/**
 * Root wrapper for the ThemeShift compound navbar API.
 */
const NavbarRoot = <T extends ElementType = 'nav'>({
  as,
  border = false,
  children,
  className,
  floating = false,
  height = 'medium',
  maxWidth = 'large',
  padding = 'medium',
  placement = 'top',
  position = 'static',
  shadow = 'none',
  style,
  surface = 'default',
  width = 'full',
  ...rootProps
}: NavbarProps<T>) => {
  const Component = as ?? 'nav';
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [menus, setMenus] = useState<MenuRecord[]>([]);

  const registerOrUpdateMenu = useCallback((menu: MenuRecord) => {
    setMenus((currentMenus) => {
      const existingIndex = currentMenus.findIndex(
        (currentMenu) => currentMenu.id === menu.id
      );

      if (existingIndex === -1) {
        return [...currentMenus, menu];
      }

      const nextMenus = [...currentMenus];
      nextMenus[existingIndex] = menu;

      return nextMenus;
    });
  }, []);

  const unregisterMenu = useCallback((id: string) => {
    setMenus((currentMenus) =>
      currentMenus.filter((currentMenu) => currentMenu.id !== id)
    );
  }, []);

  const getNearestMenu = useCallback(
    (toggleElement: HTMLElement | null) => {
      if (menus.length === 0) {
        return null;
      }

      if (!toggleElement || !rootElement) {
        return menus[menus.length - 1] ?? null;
      }

      const containingMenu = menus.find((menu) =>
        menu.menuElement?.contains(toggleElement)
      );

      if (containingMenu) {
        return containingMenu;
      }

      const toggleIndex = getNodeOrderIndex(rootElement, toggleElement);

      if (!Number.isFinite(toggleIndex)) {
        return menus[menus.length - 1] ?? null;
      }

      let nearestMenu: MenuRecord | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const menu of menus) {
        if (!menu.menuElement) {
          continue;
        }

        const menuIndex = getNodeOrderIndex(rootElement, menu.menuElement);

        if (!Number.isFinite(menuIndex)) {
          continue;
        }

        const distance = Math.abs(menuIndex - toggleIndex);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestMenu = menu;
        }
      }

      return nearestMenu ?? menus[menus.length - 1] ?? null;
    },
    [menus, rootElement]
  );

  const contextValue = useMemo(
    () => ({
      getNearestMenu,
      registerOrUpdateMenu,
      rootElement,
      unregisterMenu,
    }),
    [getNearestMenu, registerOrUpdateMenu, rootElement, unregisterMenu]
  );

  const styleVars: NavbarStyleVars = { ...style };

  return (
    <NavbarContext.Provider value={contextValue}>
      <Component
        {...rootProps}
        className={classNames(
          styles.root,
          positionClassMap[position],
          placementClassMap[placement],
          widthClassMap[width],
          maxWidthClassMap[maxWidth],
          heightClassMap[height],
          paddingClassMap[padding],
          surfaceClassMap[surface],
          shadowClassMap[shadow],
          border && styles.withBorder,
          floating && styles.floating,
          className
        )}
        ref={setRootElement}
        style={styleVars}
      >
        {children}
      </Component>
    </NavbarContext.Provider>
  );
};

/**
 * Flex row used to align brand, navigation content, and actions.
 */
const NavbarContainer = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  hideBelow,
  maxWidth = 'large',
  showBelow,
  width = 'full',
  ...containerProps
}: NavbarContainerProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      {...containerProps}
      className={classNames(
        styles.container,
        widthClassMap[width],
        maxWidthClassMap[maxWidth],
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Branded slot for logos and product identity.
 */
const NavbarBrand = <T extends ElementType = 'span'>({
  as,
  asChild = false,
  children,
  className,
  hideBelow,
  href,
  showBelow,
  ...brandProps
}: NavbarBrandProps<T>) => {
  const childElement =
    asChild && isValidElement(children)
      ? (Children.only(children) as ReactElement<{ children?: ReactNode }>)
      : null;

  if (asChild && !childElement) {
    throw new Error(
      'ThemeShift Navbar.Brand with asChild expects a single React element child.'
    );
  }

  const Component = asChild ? Slot : (as ?? (href ? 'a' : 'span'));

  return (
    <Component
      {...brandProps}
      className={classNames(
        styles.brand,
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
      href={href}
    >
      {children}
    </Component>
  );
};

/**
 * Inline navigation content area, typically shown on larger breakpoints.
 */
const NavbarContent = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  hideBelow,
  showBelow,
  ...contentProps
}: NavbarContentProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      {...contentProps}
      className={classNames(
        styles.content,
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Semantic list container for grouped navigation links.
 */
const NavbarList = <T extends ElementType = 'ul'>({
  as,
  children,
  className,
  hideBelow,
  orientation,
  showBelow,
  ...listProps
}: NavbarListProps<T>) => {
  const Component = as ?? 'ul';
  const isInsideMenu = useContext(NavbarMenuScopeContext);
  const resolvedOrientation =
    orientation ?? (isInsideMenu ? 'vertical' : 'horizontal');

  return (
    <Component
      {...listProps}
      className={classNames(
        styles.list,
        listOrientationClassMap[resolvedOrientation],
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Semantic list item wrapper for navbar navigation entries.
 */
const NavbarItem = <T extends ElementType = 'li'>({
  as,
  children,
  className,
  hideBelow,
  showBelow,
  ...itemProps
}: NavbarItemProps<T>) => {
  const Component = as ?? 'li';

  return (
    <Component
      {...itemProps}
      className={classNames(
        styles.item,
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Styled navbar link with active and disabled states.
 */
const NavbarLink = <T extends ElementType = 'a'>({
  active = false,
  as,
  children,
  className,
  disabled = false,
  hideBelow,
  href,
  onClick,
  showBelow,
  ...linkProps
}: NavbarLinkProps<T>) => {
  const Component = as ?? 'a';

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    callEventHandler(
      onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined,
      event
    );
  };

  return (
    <Component
      {...linkProps}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      className={classNames(
        styles.link,
        active && styles.linkActive,
        disabled && styles.linkDisabled,
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
      href={href}
      onClick={handleClick}
      tabIndex={disabled ? -1 : linkProps.tabIndex}
    >
      {children}
    </Component>
  );
};

/**
 * End-aligned action area for controls such as authentication buttons.
 */
const NavbarActions = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  hideBelow,
  showBelow,
  ...actionsProps
}: NavbarActionsProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      {...actionsProps}
      className={classNames(
        styles.actions,
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Toggle control that opens/closes the nearest `Navbar.Menu`.
 */
const NavbarToggle = <T extends ElementType = 'button'>({
  'aria-label': ariaLabel,
  as,
  asChild = false,
  children,
  className,
  hideBelow,
  onClick,
  onKeyDown,
  showBelow,
  type,
  ...toggleProps
}: NavbarToggleProps<T>) => {
  const { getNearestMenu } = useNavbarContext('Navbar.Toggle');
  const [toggleElement, setToggleElement] = useState<HTMLElement | null>(null);

  const controlledMenu = getNearestMenu(toggleElement);
  const isOpen = controlledMenu?.open ?? false;
  const resolvedAriaLabel = resolveDynamicValue(ariaLabel, isOpen);
  const resolvedChildren = resolveDynamicValue(children, isOpen);

  useEffect(() => {
    controlledMenu?.setToggleElement(toggleElement);

    return () => {
      controlledMenu?.setToggleElement(null);
    };
  }, [controlledMenu, toggleElement]);

  const handleToggle = useCallback(() => {
    if (!controlledMenu) {
      return;
    }

    controlledMenu.setOpen(!controlledMenu.open);
  }, [controlledMenu]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    callEventHandler(
      onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined,
      event
    );

    if (event.defaultPrevented) {
      return;
    }

    handleToggle();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    callEventHandler(
      onKeyDown as ((event: KeyboardEvent<HTMLElement>) => void) | undefined,
      event
    );

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  const childElement =
    asChild && isValidElement(children)
      ? (Children.only(children) as ReactElement<{ children?: ReactNode }>)
      : null;

  if (asChild && !childElement) {
    throw new Error(
      'ThemeShift Navbar.Toggle with asChild expects a single React element child.'
    );
  }

  const Component = asChild ? Slot : (as ?? 'button');

  return (
    <Component
      {...toggleProps}
      aria-label={resolvedAriaLabel}
      aria-controls={controlledMenu?.id}
      aria-expanded={controlledMenu ? controlledMenu.open : undefined}
      className={classNames(
        styles.toggle,
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={setToggleElement}
      type={asChild ? undefined : (type ?? 'button')}
    >
      {resolvedChildren ?? <span className={styles.toggleLabel}>Menu</span>}
    </Component>
  );
};

/**
 * Responsive menu panel for compact navigation experiences.
 */
const NavbarMenu = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  closeOnLinkClick = true,
  defaultOpen = false,
  hideBelow,
  id,
  labelledBy,
  onClickOutside,
  onOpenChange,
  open,
  placement = 'belowNavbar',
  showBelow,
  ...menuProps
}: NavbarMenuProps<T>) => {
  const { registerOrUpdateMenu, unregisterMenu } =
    useNavbarContext('Navbar.Menu');
  const Component = as ?? 'div';
  const generatedId = useId();
  const menuId = id ?? `navbar-menu-${generatedId.replaceAll(':', '')}`;
  const ariaLabel = (menuProps as { 'aria-label'?: string })['aria-label'];

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [toggleElement, setToggleElement] = useState<HTMLElement | null>(null);
  const [menuElement, setMenuElement] = useState<HTMLElement | null>(null);
  const menuElementRef = useRef<HTMLElement | null>(null);
  const previousOpenRef = useRef<boolean>(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;
  const requiresFocusLock = placement === 'overlay' || placement === 'drawer';

  useScrollLock(isOpen && requiresFocusLock);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );
  const closeMenu = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const openMenu = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const toggleMenu = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);
  const setMenuElementRef = useCallback((node: HTMLElement | null) => {
    menuElementRef.current = node;
    setMenuElement(node);
  }, []);

  useOnClickOutside(
    menuElementRef,
    (event) => {
      if (!isOpen || !onClickOutside) {
        return;
      }

      const targetNode = event.target instanceof Node ? event.target : null;

      if (targetNode && toggleElement?.contains(targetNode)) {
        return;
      }

      if (typeof onClickOutside === 'function') {
        onClickOutside({
          close: closeMenu,
          event,
          isOpen,
          open: openMenu,
          toggle: toggleMenu,
        });

        return;
      }

      if (onClickOutside === 'toggle') {
        toggleMenu();
        return;
      }

      if (onClickOutside === 'open') {
        openMenu();
        return;
      }

      closeMenu();
    },
    'mousedown'
  );

  useEffect(() => {
    registerOrUpdateMenu({
      id: menuId,
      menuElement,
      open: isOpen,
      placement,
      setOpen,
      setToggleElement,
      toggleElement,
    });

    return () => {
      unregisterMenu(menuId);
    };
  }, [
    isOpen,
    menuElement,
    menuId,
    placement,
    registerOrUpdateMenu,
    setOpen,
    toggleElement,
    unregisterMenu,
  ]);

  useEffect(() => {
    if (!isOpen || !menuElement) {
      return;
    }

    const firstFocusable =
      menuElement.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();
  }, [isOpen, menuElement]);

  useEffect(() => {
    const previousOpen = previousOpenRef.current;

    if (previousOpen && !isOpen) {
      toggleElement?.focus();
    }

    previousOpenRef.current = isOpen;
  }, [isOpen, toggleElement]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      setOpen(false);
      return;
    }

    callEventHandler(
      menuProps.onKeyDown as
        | ((event: KeyboardEvent<HTMLElement>) => void)
        | undefined,
      event
    );
  };

  const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
    callEventHandler(
      menuProps.onClickCapture as
        | ((event: MouseEvent<HTMLElement>) => void)
        | undefined,
      event
    );

    if (!closeOnLinkClick || !isOpen || event.defaultPrevented) {
      return;
    }

    const targetElement =
      event.target instanceof HTMLElement ? event.target : null;

    if (!isAnchorDisabledCandidate(targetElement)) {
      return;
    }

    setOpen(false);
  };

  const menuRegion = (
    <Component
      {...menuProps}
      aria-hidden={!isOpen}
      aria-label={getMenuAriaLabel(ariaLabel, labelledBy)}
      aria-labelledby={labelledBy}
      className={classNames(
        styles.menu,
        menuPlacementClassMap[placement],
        isOpen ? styles.menuOpen : styles.menuClosed,
        ...getVisibilityClasses({ hideBelow, showBelow }),
        className
      )}
      id={menuId}
      onClickCapture={handleClickCapture}
      onKeyDown={handleKeyDown}
      ref={setMenuElementRef}
      role={menuProps.role ?? 'group'}
      tabIndex={menuProps.tabIndex ?? -1}
    >
      <NavbarMenuScopeContext.Provider value={true}>
        {children}
      </NavbarMenuScopeContext.Provider>
    </Component>
  );

  if (!requiresFocusLock) {
    return menuRegion;
  }

  return (
    <FocusLock disabled={!isOpen} returnFocus={false}>
      {menuRegion}
    </FocusLock>
  );
};

type NavbarComponent = (<T extends ElementType = 'nav'>(
  props: NavbarProps<T>
) => React.JSX.Element) & {
  Actions: typeof NavbarActions;
  Brand: typeof NavbarBrand;
  Container: typeof NavbarContainer;
  Content: typeof NavbarContent;
  Item: typeof NavbarItem;
  Link: typeof NavbarLink;
  List: typeof NavbarList;
  Menu: typeof NavbarMenu;
  Toggle: typeof NavbarToggle;
};

/** Compound navigation component with responsive content and menu primitives. */
export const Navbar = Object.assign(NavbarRoot, {
  Actions: NavbarActions,
  Brand: NavbarBrand,
  Container: NavbarContainer,
  Content: NavbarContent,
  Item: NavbarItem,
  Link: NavbarLink,
  List: NavbarList,
  Menu: NavbarMenu,
  Toggle: NavbarToggle,
}) as NavbarComponent;

export {
  NavbarActions,
  NavbarBrand,
  NavbarContainer,
  NavbarContent,
  NavbarItem,
  NavbarLink,
  NavbarMenu,
  NavbarRoot,
  NavbarToggle,
  NavbarList,
};
export type {
  NavbarActionsProps,
  NavbarBrandProps,
  NavbarContainerProps,
  NavbarContentProps,
  NavbarItemProps,
  NavbarLinkProps,
  NavbarListProps,
  NavbarMenuProps,
  NavbarProps,
  NavbarToggleProps,
};
export type {
  NavbarBreakpoint,
  NavbarHeight,
  NavbarListOrientation,
  NavbarMaxWidth,
  NavbarMenuPlacement,
  NavbarOnClickOutsideAction,
  NavbarOnClickOutsideCallback,
  NavbarOnClickOutsideCallbackArgs,
  NavbarPadding,
  NavbarPlacement,
  NavbarPosition,
  NavbarShadow,
  NavbarSurface,
  NavbarToggleDynamicValue,
  NavbarWidth,
} from './types';
