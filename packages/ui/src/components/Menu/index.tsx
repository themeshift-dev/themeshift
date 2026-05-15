/* eslint-disable react-refresh/only-export-components */
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type MutableRefObject,
  type Ref,
} from 'react';

import { Portal } from '@/components/Portal';
import { IconChevronRight } from '@/icons';
import {
  useAnchoredPosition,
  type Placement,
} from '@/hooks/useAnchoredPosition';

import styles from './Menu.module.scss';
import type {
  MenuAlign,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuDir,
  MenuGroupProps,
  MenuItemDisabledBehavior,
  MenuItemIconProps,
  MenuItemIndicatorProps,
  MenuItemMetaProps,
  MenuItemProps,
  MenuItemTextProps,
  MenuLabelProps,
  MenuOrientation,
  MenuPlacement,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuRootProps,
  MenuSelectEvent,
  MenuSeparatorProps,
  MenuStyleVars,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
  MenuViewportProps,
} from './types';

type ItemKind = 'item' | 'checkbox' | 'radio' | 'sub-trigger';

type MenuItemRecord = {
  closeOnSelect?: boolean;
  disabled: boolean;
  disabledBehavior: MenuItemDisabledBehavior;
  id: string;
  kind: ItemKind;
  ref: HTMLElement | null;
  textValue: string;
};

type MenuRootContextValue = {
  closeAll: () => void;
  closeOnSelect: boolean;
  density: NonNullable<MenuRootProps['density']>;
  dir: MenuDir;
  disabled: boolean;
  loop: boolean;
  modal: boolean;
  onEscapeKeyDown?: MenuRootProps['onEscapeKeyDown'];
  onFocusOutside?: MenuRootProps['onFocusOutside'];
  onInteractOutside?: MenuRootProps['onInteractOutside'];
  onPointerDownOutside?: MenuRootProps['onPointerDownOutside'];
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  orientation: MenuOrientation;
  registerTrigger: (node: HTMLElement | null) => void;
  selectionMode: NonNullable<MenuRootProps['selectionMode']>;
  size: NonNullable<MenuRootProps['size']>;
  triggerRef: MutableRefObject<HTMLElement | null>;
  typeahead: boolean;
};

type MenuContentContextValue = {
  contentId: string;
  focusByDelta: (delta: number) => void;
  focusFirst: () => void;
  focusLast: () => void;
  getItems: () => MenuItemRecord[];
  highlightedId: string | null;
  registerItem: (record: MenuItemRecord) => () => void;
  requestClose: () => void;
  selectByTypeahead: (query: string) => void;
  setHighlightedId: (id: string | null) => void;
};

type MenuSubContextValue = {
  closeDelay: number;
  contentRef: MutableRefObject<HTMLElement | null>;
  disabled: boolean;
  open: boolean;
  openOnHover: boolean;
  openDelay: number;
  setOpen: (open: boolean) => void;
  triggerRef: MutableRefObject<HTMLElement | null>;
};

type MenuItemStateContextValue = {
  checked?: boolean;
};

const DEFAULT_COLLISION_PADDING = 8;
const DEFAULT_TYPEAHEAD_TIMEOUT = 750;

const MenuRootContext = createContext<MenuRootContextValue | null>(null);
const MenuContentContext = createContext<MenuContentContextValue | null>(null);
const MenuSubContext = createContext<MenuSubContextValue | null>(null);
const MenuItemStateContext = createContext<MenuItemStateContextValue | null>(
  null
);

const sideToPlacement = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
} satisfies Record<MenuPlacement, Placement>;

const orientationClassMap = {
  vertical: styles.orientationVertical,
  horizontal: styles.orientationHorizontal,
} satisfies Record<MenuOrientation, string>;

const densityClassMap = {
  compact: styles.densityCompact,
  normal: styles.densityNormal,
  spacious: styles.densitySpacious,
} satisfies Record<NonNullable<MenuRootProps['density']>, string>;

const sizeClassMap = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} satisfies Record<NonNullable<MenuRootProps['size']>, string>;

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      (ref as MutableRefObject<T | null>).current = node;
    });
  };
}

function isDisabled(record: MenuItemRecord) {
  return record.disabled && record.disabledBehavior !== 'focusable';
}

function isTypeaheadKey(event: ReactKeyboardEvent) {
  return (
    event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey
  );
}

function resolveAlign(align: MenuAlign) {
  if (align === 'center') {
    return 'center';
  }

  return align;
}

function resolvePlacement(side: MenuPlacement, align: MenuAlign) {
  const base = sideToPlacement[side];
  const alignPart = resolveAlign(align);

  if (alignPart === 'center') {
    return base;
  }

  return `${base}-${alignPart}` as Placement;
}

function deriveTextValue(node: HTMLElement | null) {
  const value = node?.textContent?.trim() ?? '';

  return value.replace(/\s+/g, ' ');
}

function scrollItemIntoView(node: HTMLElement | null) {
  if (typeof node?.scrollIntoView === 'function') {
    node.scrollIntoView({ block: 'nearest' });
  }
}

function useMenuRootContext(component: string) {
  const context = useContext(MenuRootContext);

  if (!context) {
    throw new Error(`${component} must be used within Menu.Root.`);
  }

  return context;
}

function useMenuContentContext(component: string) {
  const context = useContext(MenuContentContext);

  if (!context) {
    throw new Error(
      `${component} must be used within Menu.Content or Menu.SubContent.`
    );
  }

  return context;
}

function useControllableBooleanState({
  value,
  defaultValue,
  onChange,
}: {
  value?: boolean;
  defaultValue: boolean;
  onChange?: (next: boolean) => void;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? value : uncontrolledValue;

  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }

      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [resolvedValue, setValue] as const;
}

/**
 * Root menu primitive that provides state, direction, and interaction context
 * for all menu descendants.
 */
const MenuRoot = ({
  children,
  closeOnSelect = true,
  defaultOpen = false,
  density = 'normal',
  dir = 'ltr',
  disabled = false,
  loop = true,
  modal = true,
  onEscapeKeyDown,
  onFocusOutside,
  onInteractOutside,
  onOpenChange,
  onPointerDownOutside,
  open,
  orientation = 'vertical',
  selectionMode = 'none',
  size = 'md',
  typeahead = true,
  ...rootProps
}: MenuRootProps) => {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [resolvedOpen, setResolvedOpen] = useControllableBooleanState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const registerTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  const closeAll = useCallback(() => {
    setResolvedOpen(false);
  }, [setResolvedOpen]);

  const contextValue = useMemo<MenuRootContextValue>(
    () => ({
      closeAll,
      closeOnSelect,
      density,
      dir,
      disabled,
      loop,
      modal,
      onEscapeKeyDown,
      onFocusOutside,
      onInteractOutside,
      onOpenChange: setResolvedOpen,
      onPointerDownOutside,
      open: resolvedOpen,
      orientation,
      registerTrigger,
      selectionMode,
      size,
      triggerRef,
      typeahead,
    }),
    [
      closeAll,
      closeOnSelect,
      density,
      dir,
      disabled,
      loop,
      modal,
      onEscapeKeyDown,
      onFocusOutside,
      onInteractOutside,
      onPointerDownOutside,
      orientation,
      registerTrigger,
      resolvedOpen,
      selectionMode,
      setResolvedOpen,
      size,
      typeahead,
    ]
  );

  return (
    <MenuRootContext.Provider value={contextValue}>
      <div
        {...rootProps}
        className={classNames(
          styles.root,
          orientationClassMap[orientation],
          densityClassMap[density],
          sizeClassMap[size],
          rootProps.className
        )}
        data-disabled={disabled ? '' : undefined}
        data-selection-mode={selectionMode}
        dir={dir}
      >
        {children}
      </div>
    </MenuRootContext.Provider>
  );
};

function useContentInteractions({
  onCloseAutoFocus,
  onOpenAutoFocus,
  open,
  triggerRef,
}: {
  onCloseAutoFocus?: (event: Event) => void;
  onOpenAutoFocus?: (event: Event) => void;
  open: boolean;
  triggerRef: MutableRefObject<HTMLElement | null>;
}) {
  const previousOpenRef = useRef(open);

  useEffect(() => {
    if (!open || previousOpenRef.current === open) {
      previousOpenRef.current = open;
      return;
    }

    const event = new Event('menuopenautofocus', {
      bubbles: true,
      cancelable: true,
    });

    onOpenAutoFocus?.(event);
    previousOpenRef.current = open;
  }, [onOpenAutoFocus, open]);

  useEffect(() => {
    if (open || previousOpenRef.current === open) {
      previousOpenRef.current = open;
      return;
    }

    const event = new Event('menucloseautofocus', {
      bubbles: true,
      cancelable: true,
    });

    onCloseAutoFocus?.(event);

    if (!event.defaultPrevented) {
      triggerRef.current?.focus();
    }

    previousOpenRef.current = open;
  }, [onCloseAutoFocus, open, triggerRef]);
}

function useMenuCollection() {
  const itemsRef = useRef<Map<string, MenuItemRecord>>(new Map());
  const [version, setVersion] = useState(0);

  const registerItem = useCallback((record: MenuItemRecord) => {
    itemsRef.current.set(record.id, record);
    setVersion((current) => current + 1);

    return () => {
      itemsRef.current.delete(record.id);
      setVersion((current) => current + 1);
    };
  }, []);

  const getItems = useCallback(() => {
    version;
    return [...itemsRef.current.values()];
  }, [version]);

  return {
    getItems,
    registerItem,
  };
}

function useMenuContentState({
  closeOnTab = true,
  defaultHighlighted,
  open,
  onEscape,
  requestClose,
}: {
  closeOnTab?: boolean;
  defaultHighlighted?: 'first' | 'last';
  open: boolean;
  onEscape?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  requestClose: () => void;
}) {
  const root = useMenuRootContext('Menu.Content');
  const { getItems, registerItem } = useMenuCollection();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const typeaheadBufferRef = useRef('');
  const typeaheadTimerRef = useRef<number | null>(null);
  const previousOpenRef = useRef(open);

  const getEnabledItems = useCallback(() => {
    return getItems().filter((item) => !isDisabled(item));
  }, [getItems]);

  const focusFirst = useCallback(() => {
    const items = getEnabledItems();

    if (items.length === 0) {
      return;
    }

    setHighlightedId(items[0].id);
    items[0].ref?.focus();
    scrollItemIntoView(items[0].ref);
  }, [getEnabledItems]);

  const focusLast = useCallback(() => {
    const items = getEnabledItems();

    if (items.length === 0) {
      return;
    }

    const last = items[items.length - 1];

    setHighlightedId(last.id);
    last.ref?.focus();
    scrollItemIntoView(last.ref);
  }, [getEnabledItems]);

  const focusByDelta = useCallback(
    (delta: number) => {
      const items = getEnabledItems();

      if (items.length === 0) {
        return;
      }

      const currentIndex = highlightedId
        ? items.findIndex((item) => item.id === highlightedId)
        : -1;
      const nextIndex = currentIndex + delta;

      if (nextIndex < 0) {
        if (!root.loop) {
          return;
        }

        const last = items[items.length - 1];
        setHighlightedId(last.id);
        last.ref?.focus();
        scrollItemIntoView(last.ref);
        return;
      }

      if (nextIndex >= items.length) {
        if (!root.loop) {
          return;
        }

        const first = items[0];
        setHighlightedId(first.id);
        first.ref?.focus();
        scrollItemIntoView(first.ref);
        return;
      }

      const next = items[nextIndex];

      setHighlightedId(next.id);
      next.ref?.focus();
      scrollItemIntoView(next.ref);
    },
    [getEnabledItems, highlightedId, root.loop]
  );

  const selectByTypeahead = useCallback(
    (query: string) => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        return;
      }

      const items = getEnabledItems();

      if (items.length === 0) {
        return;
      }

      const currentIndex = highlightedId
        ? items.findIndex((item) => item.id === highlightedId)
        : -1;

      for (let offset = 1; offset <= items.length; offset += 1) {
        const candidateIndex =
          (currentIndex + offset + items.length) % items.length;
        const candidate = items[candidateIndex];

        if (candidate.textValue.toLowerCase().startsWith(normalizedQuery)) {
          setHighlightedId(candidate.id);
          candidate.ref?.focus();
          scrollItemIntoView(candidate.ref);
          break;
        }
      }
    },
    [getEnabledItems, highlightedId]
  );

  useEffect(() => {
    if (!open) {
      previousOpenRef.current = false;
      setHighlightedId(null);
      return;
    }

    if (previousOpenRef.current) {
      return;
    }

    previousOpenRef.current = true;

    if (defaultHighlighted === 'last') {
      focusLast();
      return;
    }

    focusFirst();
  }, [defaultHighlighted, focusFirst, focusLast, open]);

  useEffect(() => {
    if (!open || highlightedId !== null) {
      return;
    }

    const items = getEnabledItems();

    if (items.length === 0) {
      return;
    }

    setHighlightedId(items[0].id);
  }, [getEnabledItems, highlightedId, open]);

  useEffect(() => {
    if (highlightedId === null) {
      return;
    }

    const items = getItems();
    const stillPresent = items.some((item) => item.id === highlightedId);

    if (!stillPresent) {
      setHighlightedId(null);
    }
  }, [getItems, highlightedId]);

  useEffect(
    () => () => {
      if (typeof window !== 'undefined' && typeaheadTimerRef.current !== null) {
        window.clearTimeout(typeaheadTimerRef.current);
      }
    },
    []
  );

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape') {
        onEscape?.(event);
        root.onEscapeKeyDown?.(event);

        if (!event.defaultPrevented) {
          requestClose();
        }

        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        focusFirst();
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        focusLast();
        return;
      }

      const isVertical = root.orientation === 'vertical';
      const nextKey = isVertical
        ? 'ArrowDown'
        : root.dir === 'rtl'
          ? 'ArrowLeft'
          : 'ArrowRight';
      const prevKey = isVertical
        ? 'ArrowUp'
        : root.dir === 'rtl'
          ? 'ArrowRight'
          : 'ArrowLeft';

      if (event.key === nextKey) {
        event.preventDefault();
        focusByDelta(1);
        return;
      }

      if (event.key === prevKey) {
        event.preventDefault();
        focusByDelta(-1);
        return;
      }

      if (event.key === 'Tab') {
        if (closeOnTab) {
          requestClose();
        }

        return;
      }

      if (!root.typeahead || !isTypeaheadKey(event)) {
        return;
      }

      typeaheadBufferRef.current += event.key.toLowerCase();
      selectByTypeahead(typeaheadBufferRef.current);

      if (typeof window !== 'undefined') {
        if (typeaheadTimerRef.current !== null) {
          window.clearTimeout(typeaheadTimerRef.current);
        }

        typeaheadTimerRef.current = window.setTimeout(() => {
          typeaheadBufferRef.current = '';
          typeaheadTimerRef.current = null;
        }, DEFAULT_TYPEAHEAD_TIMEOUT);
      }
    },
    [
      focusByDelta,
      focusFirst,
      focusLast,
      onEscape,
      requestClose,
      root,
      selectByTypeahead,
      closeOnTab,
    ]
  );

  return {
    getItems,
    highlightedId,
    onKeyDown,
    registerItem,
    selectByTypeahead,
    setHighlightedId,
    focusByDelta,
    focusFirst,
    focusLast,
  };
}

type MenuContentPrimitiveProps = MenuContentProps & {
  defaultHighlighted?: 'first' | 'last';
  open?: boolean;
  onEscape?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  requestClose: () => void;
  triggerRef: MutableRefObject<HTMLElement | null>;
};

const MenuContentPrimitive = forwardRef<HTMLElement, MenuContentPrimitiveProps>(
  (
    {
      align = 'start',
      asChild = false,
      avoidCollisions = true,
      children,
      className,
      collisionPadding = DEFAULT_COLLISION_PADDING,
      container,
      defaultHighlighted,
      forceMount = false,
      maxHeight,
      maxWidth,
      minWidth,
      mode = 'inline',
      open,
      onCloseAutoFocus,
      onEscape,
      onKeyDown,
      onOpenAutoFocus,
      portal = false,
      requestClose,
      role = 'menu',
      side = 'bottom',
      sideOffset = 8,
      style,
      triggerRef,
      width,
      ...contentProps
    },
    forwardedRef
  ) => {
    const root = useMenuRootContext('Menu.Content');
    const generatedId = useId();
    const id =
      contentProps.id ?? `menu-content-${generatedId.replaceAll(':', '')}`;
    const Component = asChild ? Slot : 'div';
    const contentRef = useRef<HTMLElement | null>(null);
    const placement = resolvePlacement(side, align);
    const resolvedOpen = open ?? root.open;
    const shouldRender = forceMount || resolvedOpen;

    const anchored = useAnchoredPosition({
      boundaryPadding: collisionPadding,
      flip: avoidCollisions,
      matchTriggerWidth: false,
      offset: sideOffset,
      open: shouldRender && mode === 'floating',
      placement,
      shift: avoidCollisions,
    });

    useEffect(() => {
      if (mode !== 'floating') {
        return;
      }

      anchored.anchorRef.current = triggerRef.current;
    }, [anchored.anchorRef, mode, triggerRef]);

    const state = useMenuContentState({
      closeOnTab: mode === 'floating',
      defaultHighlighted,
      open: resolvedOpen,
      onEscape,
      requestClose,
    });

    useContentInteractions({
      onCloseAutoFocus,
      onOpenAutoFocus,
      open: resolvedOpen,
      triggerRef,
    });

    useEffect(() => {
      if (!root.open || mode !== 'floating') {
        return;
      }

      const onDocumentPointerDown = (event: PointerEvent) => {
        const target = event.target instanceof Node ? event.target : null;

        if (!target) {
          return;
        }

        const insideContent = contentRef.current?.contains(target);
        const insideTrigger = triggerRef.current?.contains(target);

        if (insideContent || insideTrigger) {
          return;
        }

        root.onPointerDownOutside?.(
          event as unknown as React.PointerEvent<HTMLElement>
        );
        root.onInteractOutside?.(event);

        if (root.modal) {
          requestClose();
        }
      };

      const onDocumentFocusIn = (event: FocusEvent) => {
        const target = event.target instanceof Node ? event.target : null;

        if (!target) {
          return;
        }

        const insideContent = contentRef.current?.contains(target);
        const insideTrigger = triggerRef.current?.contains(target);

        if (insideContent || insideTrigger) {
          return;
        }

        root.onFocusOutside?.(
          event as unknown as React.FocusEvent<HTMLElement>
        );
        root.onInteractOutside?.(event);

        if (root.modal) {
          requestClose();
        }
      };

      document.addEventListener('pointerdown', onDocumentPointerDown);
      document.addEventListener('focusin', onDocumentFocusIn);

      return () => {
        document.removeEventListener('pointerdown', onDocumentPointerDown);
        document.removeEventListener('focusin', onDocumentFocusIn);
      };
    }, [mode, requestClose, resolvedOpen, root, triggerRef]);

    useEffect(() => {
      if (import.meta.env.PROD) {
        return;
      }

      if (!shouldRender) {
        return;
      }

      const hasAriaLabel = typeof contentProps['aria-label'] === 'string';
      const hasAriaLabelledBy =
        typeof contentProps['aria-labelledby'] === 'string';

      if (!hasAriaLabel && !hasAriaLabelledBy) {
        console.warn(
          'Menu.Content should include aria-label or aria-labelledby when not labelled by a trigger.'
        );
      }
    }, [contentProps, shouldRender]);

    const contextValue = useMemo<MenuContentContextValue>(
      () => ({
        contentId: id,
        focusByDelta: state.focusByDelta,
        focusFirst: state.focusFirst,
        focusLast: state.focusLast,
        getItems: state.getItems,
        highlightedId: state.highlightedId,
        registerItem: state.registerItem,
        requestClose,
        selectByTypeahead: state.selectByTypeahead,
        setHighlightedId: state.setHighlightedId,
      }),
      [
        id,
        requestClose,
        state.focusByDelta,
        state.focusFirst,
        state.focusLast,
        state.getItems,
        state.highlightedId,
        state.registerItem,
        state.selectByTypeahead,
        state.setHighlightedId,
      ]
    );

    if (!shouldRender) {
      return null;
    }

    const styleVars = {
      ...style,
      ...(mode === 'floating'
        ? {
            ...anchored.style,
            '--menu-content-available-height': `${
              typeof window === 'undefined' ? 0 : window.innerHeight
            }px`,
            '--menu-trigger-width': `${anchored.anchorRef.current?.getBoundingClientRect().width ?? 0}px`,
          }
        : {}),
      maxHeight,
      maxWidth,
      minWidth,
      width,
    } as MenuStyleVars;

    const content = (
      <MenuContentContext.Provider value={contextValue}>
        <Component
          {...contentProps}
          aria-orientation={root.orientation}
          className={classNames(
            styles.content,
            mode === 'floating' && styles.floating,
            className
          )}
          data-menu-content-id={id}
          data-open={resolvedOpen ? '' : undefined}
          id={id}
          onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
            const target =
              event.target instanceof Element ? event.target : null;
            const owner = target?.closest('[data-menu-content-id]');

            if (owner && owner !== event.currentTarget) {
              onKeyDown?.(event);
              return;
            }

            state.onKeyDown(event);
            onKeyDown?.(event);
          }}
          ref={mergeRefs(
            forwardedRef as Ref<HTMLElement>,
            (node: HTMLElement | null) => {
              contentRef.current = node;
              if (mode === 'floating') {
                anchored.floatingRef.current = node;
              }
            }
          )}
          role={role}
          style={styleVars as CSSProperties}
          tabIndex={-1}
        >
          {children}
        </Component>
      </MenuContentContext.Provider>
    );

    if (mode !== 'floating') {
      return content;
    }

    const portalProps = {
      container:
        container ??
        (typeof portal === 'object' && portal instanceof HTMLElement
          ? portal
          : null),
      disabled: portal === false,
    } as ComponentPropsWithoutRef<typeof Portal>;

    return <Portal {...portalProps}>{content}</Portal>;
  }
);

MenuContentPrimitive.displayName = 'MenuContentPrimitive';

/**
 * Primary container for menu items and composed content.
 */
const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  (props, ref) => {
    const root = useMenuRootContext('Menu.Content');

    return (
      <MenuContentPrimitive
        {...props}
        ref={ref}
        requestClose={() => root.onOpenChange?.(false)}
        triggerRef={root.triggerRef}
      />
    );
  }
);

MenuContent.displayName = 'Menu.Content';

/** Scrollable viewport wrapper for long menu lists. */
const MenuViewport = forwardRef<HTMLDivElement, MenuViewportProps>(
  (
    {
      asChild = false,
      children,
      className,
      maxHeight,
      onScroll,
      overscrollBehavior = 'contain',
      scrollable = true,
      style,
      ...viewportProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...viewportProps}
        className={classNames(
          styles.viewport,
          scrollable && styles.scrollable,
          className
        )}
        onScroll={onScroll}
        ref={ref}
        style={{
          ...style,
          maxHeight,
          overscrollBehavior,
        }}
      >
        {children}
      </Component>
    );
  }
);

MenuViewport.displayName = 'Menu.Viewport';

/** Group container for related menu items. */
const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(
  (
    { asChild = false, children, className, inset = false, ...groupProps },
    ref
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...groupProps}
        className={classNames(styles.group, inset && styles.inset, className)}
        ref={ref}
        role="group"
      >
        {children}
      </Component>
    );
  }
);

MenuGroup.displayName = 'Menu.Group';

/** Text label for item groups and menu sections. */
const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(
  (
    {
      asChild = false,
      children,
      className,
      inset = false,
      muted = false,
      ...labelProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...labelProps}
        className={classNames(
          styles.label,
          inset && styles.inset,
          muted && styles.muted,
          className
        )}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

MenuLabel.displayName = 'Menu.Label';

type MenuItemBaseOptions = {
  checkedState?: boolean | 'mixed';
  closeOnSelect?: boolean;
  disabled?: boolean;
  disabledBehavior?: MenuItemDisabledBehavior;
  kind: ItemKind;
  onSelect?: (event: MenuSelectEvent) => void;
  textValue?: string;
};

function createMenuSelectEvent() {
  const nativeEvent = new Event('menuselect', {
    bubbles: true,
    cancelable: true,
  }) as MenuSelectEvent;

  return nativeEvent;
}

const MenuItemBase = forwardRef<
  HTMLDivElement,
  MenuItemProps & MenuItemBaseOptions
>(
  (
    {
      asChild = false,
      children,
      checkedState,
      className,
      closeOnSelect,
      destructive = false,
      disabled = false,
      disabledBehavior = 'skip',
      highlighted,
      id,
      inset = false,
      kind,
      onKeyDown,
      onMouseMove,
      onSelect,
      textValue,
      ...itemProps
    },
    ref
  ) => {
    const root = useMenuRootContext('Menu.Item');
    const content = useMenuContentContext('Menu.Item');
    const generatedId = useId();
    const resolvedId = id ?? `menu-item-${generatedId.replaceAll(':', '')}`;
    const Component = asChild ? Slot : 'div';
    const localRef = useRef<HTMLElement | null>(null);
    const resolvedDisabled = root.disabled || disabled;

    const registerItem = content.registerItem;
    const enabledItems = content.getItems().filter((item) => !isDisabled(item));
    const firstEnabledId = enabledItems[0]?.id;
    const hasValidHighlight =
      content.highlightedId !== null &&
      content.getItems().some((item) => item.id === content.highlightedId);
    const isNonFocusableDisabled =
      resolvedDisabled && disabledBehavior !== 'focusable';
    useEffect(() => {
      const node = localRef.current;

      return registerItem({
        closeOnSelect,
        disabled: resolvedDisabled,
        disabledBehavior,
        id: resolvedId,
        kind,
        ref: node,
        textValue: textValue || deriveTextValue(node),
      });
    }, [
      closeOnSelect,
      disabledBehavior,
      kind,
      registerItem,
      resolvedDisabled,
      resolvedId,
      textValue,
    ]);

    const resolvedTabIndex = isNonFocusableDisabled
      ? -1
      : !hasValidHighlight
        ? firstEnabledId === resolvedId
          ? 0
          : -1
        : content.highlightedId === resolvedId
          ? 0
          : -1;

    const invokeSelect = useCallback(() => {
      if (resolvedDisabled && disabledBehavior !== 'focusable') {
        return;
      }

      const event = createMenuSelectEvent();

      onSelect?.(event);

      const shouldClose = closeOnSelect ?? root.closeOnSelect;

      if (!event.defaultPrevented && shouldClose) {
        content.requestClose();
      }
    }, [
      closeOnSelect,
      content,
      disabledBehavior,
      onSelect,
      resolvedDisabled,
      root.closeOnSelect,
    ]);

    return (
      <Component
        {...itemProps}
        aria-checked={
          itemProps.role === 'menuitemcheckbox' ||
          itemProps.role === 'menuitemradio'
            ? checkedState
            : undefined
        }
        aria-disabled={resolvedDisabled ? true : undefined}
        className={classNames(
          styles.item,
          destructive && styles.destructive,
          inset && styles.inset,
          highlighted && styles.highlighted,
          resolvedDisabled && styles.disabled,
          className
        )}
        data-disabled={resolvedDisabled ? '' : undefined}
        data-highlighted={content.highlightedId === resolvedId ? '' : undefined}
        id={resolvedId}
        onClick={() => invokeSelect()}
        onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            invokeSelect();
            return;
          }

          onKeyDown?.(event);
        }}
        onFocus={() => {
          if (isNonFocusableDisabled) {
            return;
          }

          content.setHighlightedId(resolvedId);
        }}
        onMouseMove={(event: ReactMouseEvent<HTMLDivElement>) => {
          if (!isNonFocusableDisabled) {
            content.setHighlightedId(resolvedId);
          }

          onMouseMove?.(event);
        }}
        ref={mergeRefs(ref, (node: HTMLElement | null) => {
          localRef.current = node;
        })}
        role={itemProps.role ?? 'menuitem'}
        tabIndex={resolvedTabIndex}
      >
        {children}
      </Component>
    );
  }
);

MenuItemBase.displayName = 'MenuItemBase';

/** Action item primitive for standard menu commands. */
const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>((props, ref) => {
  return <MenuItemBase {...props} kind="item" ref={ref} />;
});

MenuItem.displayName = 'Menu.Item';

/** Optional text slot with secondary description support. */
const MenuItemText = forwardRef<HTMLSpanElement, MenuItemTextProps>(
  (
    {
      asChild = false,
      children,
      className,
      description,
      truncate = false,
      ...textProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';

    return (
      <Component
        {...textProps}
        className={classNames(
          styles.itemText,
          truncate && styles.truncate,
          className
        )}
        ref={ref}
      >
        {children}
        {description ? (
          <span className={styles.itemDescription}>{description}</span>
        ) : null}
      </Component>
    );
  }
);

MenuItemText.displayName = 'Menu.ItemText';

/** Leading icon slot for menu items. */
const MenuItemIcon = forwardRef<HTMLSpanElement, MenuItemIconProps>(
  (
    {
      'aria-label': ariaLabel,
      asChild = false,
      children,
      className,
      decorative = true,
      size = 'md',
      ...iconProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';

    return (
      <Component
        {...iconProps}
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : ariaLabel}
        className={classNames(
          styles.itemIcon,
          styles[`itemIcon${size.toUpperCase()}`],
          className
        )}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

MenuItemIcon.displayName = 'Menu.ItemIcon';

/** Trailing metadata slot for shortcuts, badges, and hints. */
const MenuItemMeta = forwardRef<HTMLSpanElement, MenuItemMetaProps>(
  (
    {
      align = 'end',
      asChild = false,
      children,
      className,
      muted = false,
      ...metaProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'span';

    return (
      <Component
        {...metaProps}
        className={classNames(
          styles.itemMeta,
          align === 'start' ? styles.metaStart : styles.metaEnd,
          muted && styles.muted,
          className
        )}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

MenuItemMeta.displayName = 'Menu.ItemMeta';

/** Visual separator between menu regions. */
const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  (
    {
      asChild = false,
      className,
      decorative = true,
      orientation = 'horizontal',
      spacing = 'md',
      ...separatorProps
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...separatorProps}
        aria-hidden={decorative ? true : undefined}
        className={classNames(
          styles.separator,
          orientation === 'vertical' && styles.separatorVertical,
          styles[`separatorSpacing${spacing.toUpperCase()}`],
          className
        )}
        ref={ref}
        role={decorative ? 'presentation' : 'separator'}
      />
    );
  }
);

MenuSeparator.displayName = 'Menu.Separator';

/** Checkbox-like selectable menu item. */
const MenuCheckboxItem = forwardRef<HTMLDivElement, MenuCheckboxItemProps>(
  (
    {
      checked,
      closeOnSelect = false,
      defaultChecked = false,
      onCheckedChange,
      onSelect,
      ...itemProps
    },
    ref
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const isControlled = checked !== undefined;
    const resolvedChecked = isControlled ? checked : uncontrolledChecked;

    return (
      <MenuItemStateContext.Provider
        value={{
          checked:
            resolvedChecked === true || resolvedChecked === 'indeterminate',
        }}
      >
        <MenuItemBase
          {...itemProps}
          checkedState={
            resolvedChecked === 'indeterminate'
              ? 'mixed'
              : Boolean(resolvedChecked)
          }
          closeOnSelect={closeOnSelect}
          kind="checkbox"
          onSelect={(event) => {
            if (!isControlled) {
              setUncontrolledChecked((current) => !Boolean(current));
            }

            onCheckedChange?.(!Boolean(resolvedChecked));
            onSelect?.(event);
          }}
          ref={ref}
          role="menuitemcheckbox"
        />
      </MenuItemStateContext.Provider>
    );
  }
);

MenuCheckboxItem.displayName = 'Menu.CheckboxItem';

type RadioGroupContextValue = {
  disabled: boolean;
  onValueChange?: (value: string) => void;
  value: string | undefined;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/** Container that coordinates radio-style menu item selection. */
const MenuRadioGroup = ({
  children,
  defaultValue,
  disabled = false,
  onValueChange,
  value,
  ...groupProps
}: MenuRadioGroupProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const resolvedValue = value ?? uncontrolledValue;

  return (
    <RadioGroupContext.Provider
      value={{
        disabled,
        onValueChange: (next) => {
          if (value === undefined) {
            setUncontrolledValue(next);
          }

          onValueChange?.(next);
        },
        value: resolvedValue,
      }}
    >
      <div {...groupProps} role="group">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

/** Radio-like selectable menu item associated with `Menu.RadioGroup`. */
const MenuRadioItem = forwardRef<HTMLDivElement, MenuRadioItemProps>(
  ({ closeOnSelect = false, onSelect, value, ...itemProps }, ref) => {
    const group = useContext(RadioGroupContext);
    const checked = group?.value === value;

    return (
      <MenuItemStateContext.Provider value={{ checked }}>
        <MenuItemBase
          {...itemProps}
          checkedState={checked}
          closeOnSelect={closeOnSelect}
          disabled={itemProps.disabled || group?.disabled}
          kind="radio"
          onSelect={(event) => {
            group?.onValueChange?.(value);
            onSelect?.(event);
          }}
          ref={ref}
          role="menuitemradio"
        />
      </MenuItemStateContext.Provider>
    );
  }
);

MenuRadioItem.displayName = 'Menu.RadioItem';

/** Indicator slot for checkbox/radio/submenu state visuals. */
const MenuItemIndicator = forwardRef<HTMLSpanElement, MenuItemIndicatorProps>(
  (
    {
      asChild = false,
      children,
      className,
      forceMount = false,
      position = 'start',
      ...props
    },
    ref
  ) => {
    const state = useContext(MenuItemStateContext);
    const checked = Boolean(state?.checked);
    const visible = forceMount || checked;

    if (!visible) {
      return null;
    }

    const Component = asChild ? Slot : 'span';

    return (
      <Component
        {...props}
        className={classNames(
          styles.itemIndicator,
          forceMount && !checked && styles.itemIndicatorHidden,
          position === 'end' ? styles.indicatorEnd : styles.indicatorStart,
          className
        )}
        data-checked={checked ? 'true' : 'false'}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

MenuItemIndicator.displayName = 'Menu.ItemIndicator';

/** Submenu state boundary for nested menu interactions. */
const MenuSub = ({
  children,
  closeDelay = 300,
  defaultOpen = false,
  disabled = false,
  onOpenChange,
  open,
  openOnHover = true,
  openDelay = 100,
  ...subProps
}: MenuSubProps) => {
  const [resolvedOpen, setResolvedOpen] = useControllableBooleanState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  const value = useMemo<MenuSubContextValue>(
    () => ({
      closeDelay,
      contentRef,
      disabled,
      open: resolvedOpen,
      openOnHover,
      openDelay,
      setOpen: setResolvedOpen,
      triggerRef,
    }),
    [
      closeDelay,
      disabled,
      openOnHover,
      openDelay,
      resolvedOpen,
      setResolvedOpen,
    ]
  );

  return (
    <MenuSubContext.Provider value={value}>
      <div {...subProps}>{children}</div>
    </MenuSubContext.Provider>
  );
};

/** Item primitive that opens nested submenu content. */
const MenuSubTrigger = forwardRef<HTMLDivElement, MenuSubTriggerProps>(
  ({ indicator, onSelect, ...triggerProps }, ref) => {
    const sub = useContext(MenuSubContext);
    const root = useMenuRootContext('Menu.SubTrigger');
    const openTimerRef = useRef<number | null>(null);
    const closeTimerRef = useRef<number | null>(null);

    if (!sub) {
      throw new Error('Menu.SubTrigger must be used within Menu.Sub.');
    }

    const openWithDelay = useCallback(() => {
      if (sub.disabled) {
        return;
      }

      if (typeof window === 'undefined') {
        sub.setOpen(true);
        return;
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }

      openTimerRef.current = window.setTimeout(() => {
        openTimerRef.current = null;
        sub.setOpen(true);
      }, sub.openDelay);
    }, [sub]);

    const closeWithDelay = useCallback(() => {
      if (typeof window === 'undefined') {
        sub.setOpen(false);
        return;
      }

      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }

      closeTimerRef.current = window.setTimeout(() => {
        const triggerRect = sub.triggerRef.current?.getBoundingClientRect();
        const contentRect = sub.contentRef.current?.getBoundingClientRect();

        if (triggerRect && contentRect) {
          const movingTowardContent =
            root.dir === 'rtl'
              ? triggerRect.left >= contentRect.left
              : triggerRect.right <= contentRect.right;

          if (movingTowardContent && sub.open) {
            closeTimerRef.current = null;
            return;
          }
        }

        closeTimerRef.current = null;
        sub.setOpen(false);
      }, sub.closeDelay);
    }, [root.dir, sub]);

    useEffect(
      () => () => {
        if (typeof window === 'undefined') {
          return;
        }

        if (openTimerRef.current !== null) {
          window.clearTimeout(openTimerRef.current);
        }

        if (closeTimerRef.current !== null) {
          window.clearTimeout(closeTimerRef.current);
        }
      },
      []
    );

    const resolvedIndicator =
      indicator === undefined ? (
        <IconChevronRight
          aria-hidden
          style={root.dir === 'rtl' ? { transform: 'scaleX(-1)' } : undefined}
        />
      ) : (
        indicator
      );

    return (
      <MenuItemStateContext.Provider value={{ checked: sub.open }}>
        <MenuItemBase
          {...triggerProps}
          kind="sub-trigger"
          onKeyDown={(event) => {
            const openKey = root.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
            const closeKey = root.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

            if (event.key === openKey) {
              event.preventDefault();
              sub.setOpen(true);
              return;
            }

            if (event.key === closeKey) {
              event.preventDefault();
              sub.setOpen(false);
              sub.triggerRef.current?.focus();
              return;
            }

            triggerProps.onKeyDown?.(event);
          }}
          onMouseLeave={() => {
            if (!sub.openOnHover) {
              return;
            }

            closeWithDelay();
          }}
          onMouseMove={(event) => {
            if (sub.openOnHover) {
              openWithDelay();
            }

            triggerProps.onMouseMove?.(event);
          }}
          onSelect={(event) => {
            sub.setOpen(!sub.open);
            onSelect?.(event);
          }}
          ref={mergeRefs(ref, (node: HTMLElement | null) => {
            sub.triggerRef.current = node;
            root.registerTrigger(node);
          })}
        >
          {triggerProps.children}
          {resolvedIndicator !== null ? (
            <MenuItemMeta>{resolvedIndicator}</MenuItemMeta>
          ) : null}
        </MenuItemBase>
      </MenuItemStateContext.Provider>
    );
  }
);

MenuSubTrigger.displayName = 'Menu.SubTrigger';

/** Floating submenu content container rendered from a `Menu.Sub` scope. */
const MenuSubContent = forwardRef<HTMLDivElement, MenuSubContentProps>(
  (props, ref) => {
    const root = useMenuRootContext('Menu.SubContent');
    const sub = useContext(MenuSubContext);

    if (!sub) {
      throw new Error('Menu.SubContent must be used within Menu.Sub.');
    }

    const side: MenuPlacement = root.dir === 'rtl' ? 'left' : 'right';

    const { role: _role, ...subContentProps } = props;

    return (
      <MenuContentPrimitive
        {...subContentProps}
        align="start"
        defaultHighlighted="first"
        mode="floating"
        open={sub.open}
        onKeyDown={(event) => {
          const closeKey = root.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

          if (event.key === closeKey) {
            event.preventDefault();
            sub.setOpen(false);
            sub.triggerRef.current?.focus();
          }
        }}
        onEscape={(event) => {
          event.preventDefault();
          sub.setOpen(false);
          sub.triggerRef.current?.focus();
        }}
        ref={mergeRefs(ref, (node: HTMLElement | null) => {
          sub.contentRef.current = node;
        })}
        requestClose={() => sub.setOpen(false)}
        side={side}
        triggerRef={sub.triggerRef}
      />
    );
  }
);

MenuSubContent.displayName = 'Menu.SubContent';

export const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Content: MenuContent,
  Viewport: MenuViewport,
  Group: MenuGroup,
  Label: MenuLabel,
  Item: MenuItem,
  ItemText: MenuItemText,
  ItemIcon: MenuItemIcon,
  ItemMeta: MenuItemMeta,
  Separator: MenuSeparator,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  ItemIndicator: MenuItemIndicator,
  Sub: MenuSub,
  SubTrigger: MenuSubTrigger,
  SubContent: MenuSubContent,
});

export {
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuItemIcon,
  MenuItemIndicator,
  MenuItemMeta,
  MenuItemText,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuViewport,
};

export type {
  MenuAlign,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuDir,
  MenuGroupProps,
  MenuItemIconProps,
  MenuItemIndicatorProps,
  MenuItemMetaProps,
  MenuItemProps,
  MenuItemTextProps,
  MenuLabelProps,
  MenuOrientation,
  MenuPlacement,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuRootProps,
  MenuSelectEvent,
  MenuSeparatorProps,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
  MenuViewportProps,
};
