/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import { useResizeObserver } from '@/hooks/useResizeObserver';

import styles from './Tabs.module.scss';
import type {
  TabsActivationMode,
  TabsIndicatorProps,
  TabsListProps,
  TabsOrientation,
  TabsPanelProps,
  TabsPanelsProps,
  TabsRootProps,
  TabsTriggerProps,
} from './types';

type TriggerRecord = {
  disabled: boolean;
  id: string;
  node: HTMLElement | null;
  panelId: string;
  value: string;
};

type IndicatorStyle = CSSProperties & {
  '--tabs-indicator-offset'?: string;
  '--tabs-indicator-size'?: string;
};

type TabsContextValue = {
  activationMode: TabsActivationMode;
  fitted: boolean;
  getFirstEnabledValue: () => string | undefined;
  getPanelId: (value: string) => string;
  getSelectedTrigger: () => HTMLElement | null;
  getTriggerId: (value: string) => string;
  listElement: HTMLElement | null;
  loop: boolean;
  moveFocus: (
    currentValue: string,
    direction: 'first' | 'last' | 'next' | 'previous'
  ) => string | undefined;
  mountedPanelValues: Set<string>;
  orientation: TabsOrientation;
  registerListElement: (node: HTMLElement | null) => void;
  registerTrigger: (record: TriggerRecord) => void;
  registrationVersion: number;
  selectedValue: string | undefined;
  setValue: (value: string) => void;
  unmountOnExit: boolean;
  unregisterTrigger: (value: string) => void;
  updateTriggerNode: (value: string, node: HTMLElement | null) => void;
  lazyMount: boolean;
};

type PanelsContextValue = {
  lazyMount?: boolean;
  unmountOnExit?: boolean;
};

const DEFAULT_ORIENTATION: TabsOrientation = 'horizontal';
const DEFAULT_ACTIVATION_MODE: TabsActivationMode = 'automatic';
const DEFAULT_LOOP = true;

const TabsContext = createContext<TabsContextValue | null>(null);
const TabsPanelsContext = createContext<PanelsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`${component} must be used within Tabs.`);
  }

  return context;
}

function callHandler<EventType>(
  handler: ((event: EventType) => void) | undefined,
  event: EventType
) {
  handler?.(event);
}

function sanitizeIdSegment(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return 'tab';
  }

  return normalized.replace(/[^a-z0-9_-]+/g, '-');
}

function getEnabledTriggerValues(
  triggerOrder: string[],
  triggers: Map<string, TriggerRecord>
) {
  return triggerOrder.filter((value) => {
    const record = triggers.get(value);

    return Boolean(record && !record.disabled);
  });
}

function getHorizontalDirectionKey(
  event: KeyboardEvent,
  node: HTMLElement | null
): 'next' | 'previous' | undefined {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return undefined;
  }

  const direction =
    node && typeof window !== 'undefined'
      ? window.getComputedStyle(node).direction
      : typeof document !== 'undefined'
        ? document.documentElement.dir
        : 'ltr';

  const isRtl = direction === 'rtl';

  if (event.key === 'ArrowRight') {
    return isRtl ? 'previous' : 'next';
  }

  return isRtl ? 'next' : 'previous';
}

/** Root wrapper for composable Tabs interactions and state. */
export const TabsRoot = <T extends ElementType = 'div'>({
  activationMode = DEFAULT_ACTIVATION_MODE,
  as,
  children,
  className,
  defaultValue,
  fitted = false,
  lazyMount = false,
  loop = DEFAULT_LOOP,
  onValueChange,
  orientation = DEFAULT_ORIENTATION,
  unmountOnExit = false,
  value,
  ...rootProps
}: TabsRootProps<T>) => {
  const Component = as ?? 'div';
  const reactId = useId();
  const baseId = useMemo(
    () => `tabs-${reactId.replaceAll(':', '')}`,
    [reactId]
  );

  const triggerOrderRef = useRef<string[]>([]);
  const triggerMapRef = useRef<Map<string, TriggerRecord>>(new Map());

  const [triggerVersion, setTriggerVersion] = useState(0);
  const [listElement, setListElement] = useState<HTMLElement | null>(null);
  const [mountedPanelValues, setMountedPanelValues] = useState<Set<string>>(
    () => {
      if (!defaultValue) {
        return new Set();
      }

      return new Set([defaultValue]);
    }
  );

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const isControlledRef = useRef(isControlled);
  const selectedValueRef = useRef(selectedValue);

  const getTriggerId = useCallback(
    (triggerValue: string) =>
      `${baseId}-trigger-${sanitizeIdSegment(triggerValue)}`,
    [baseId]
  );

  const getPanelId = useCallback(
    (panelValue: string) => `${baseId}-panel-${sanitizeIdSegment(panelValue)}`,
    [baseId]
  );

  const registerListElement = useCallback((node: HTMLElement | null) => {
    setListElement(node);
  }, []);

  const getFirstEnabledValue = useCallback(() => {
    const enabledValues = getEnabledTriggerValues(
      triggerOrderRef.current,
      triggerMapRef.current
    );

    return enabledValues[0];
  }, []);

  const registerTrigger = useCallback((record: TriggerRecord) => {
    const current = triggerMapRef.current.get(record.value);

    if (!current) {
      triggerOrderRef.current.push(record.value);
    }

    triggerMapRef.current.set(record.value, record);
    setTriggerVersion((currentVersion) => currentVersion + 1);

    if (isControlledRef.current) {
      return;
    }

    const currentSelectedValue = selectedValueRef.current;
    const selectedTrigger =
      currentSelectedValue !== undefined
        ? triggerMapRef.current.get(currentSelectedValue)
        : undefined;

    if (currentSelectedValue !== undefined && !selectedTrigger) {
      return;
    }

    if (selectedTrigger && !selectedTrigger.disabled) {
      return;
    }

    const firstEnabledValue = getEnabledTriggerValues(
      triggerOrderRef.current,
      triggerMapRef.current
    )[0];

    if (!firstEnabledValue || firstEnabledValue === currentSelectedValue) {
      return;
    }

    setUncontrolledValue(firstEnabledValue);
  }, []);

  const updateTriggerNode = useCallback(
    (valueKey: string, node: HTMLElement | null) => {
      const existing = triggerMapRef.current.get(valueKey);

      if (!existing || existing.node === node) {
        return;
      }

      triggerMapRef.current.set(valueKey, {
        ...existing,
        node,
      });

      setTriggerVersion((currentVersion) => currentVersion + 1);
    },
    []
  );

  const unregisterTrigger = useCallback((valueKey: string) => {
    const removed = triggerMapRef.current.delete(valueKey);

    if (!removed) {
      return;
    }

    triggerOrderRef.current = triggerOrderRef.current.filter(
      (valueEntry) => valueEntry !== valueKey
    );

    setTriggerVersion((currentVersion) => currentVersion + 1);
  }, []);

  const setValue = useCallback(
    (nextValue: string) => {
      if (!nextValue || nextValue === selectedValue) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange, selectedValue]
  );

  const moveFocus = useCallback(
    (
      currentValue: string,
      direction: 'first' | 'last' | 'next' | 'previous'
    ) => {
      const enabledValues = getEnabledTriggerValues(
        triggerOrderRef.current,
        triggerMapRef.current
      );

      if (enabledValues.length === 0) {
        return undefined;
      }

      let nextIndex = 0;

      if (direction === 'first') {
        nextIndex = 0;
      } else if (direction === 'last') {
        nextIndex = enabledValues.length - 1;
      } else {
        const currentIndex = Math.max(enabledValues.indexOf(currentValue), 0);

        if (direction === 'next') {
          if (currentIndex === enabledValues.length - 1) {
            nextIndex = loop ? 0 : currentIndex;
          } else {
            nextIndex = currentIndex + 1;
          }
        } else if (currentIndex === 0) {
          nextIndex = loop ? enabledValues.length - 1 : currentIndex;
        } else {
          nextIndex = currentIndex - 1;
        }
      }

      const nextValue = enabledValues[nextIndex];
      const nextNode = triggerMapRef.current.get(nextValue)?.node;

      nextNode?.focus();

      return nextValue;
    },
    [loop]
  );

  const getSelectedTrigger = useCallback(() => {
    if (!selectedValue) {
      return null;
    }

    return triggerMapRef.current.get(selectedValue)?.node ?? null;
  }, [selectedValue]);

  useEffect(() => {
    isControlledRef.current = isControlled;
    selectedValueRef.current = selectedValue;
  }, [isControlled, selectedValue]);

  useEffect(() => {
    if (selectedValue === undefined) {
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setMountedPanelValues((currentValues) => {
        if (currentValues.has(selectedValue)) {
          return currentValues;
        }

        const nextValues = new Set(currentValues);
        nextValues.add(selectedValue);

        return nextValues;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [selectedValue]);

  const contextValue = useMemo(
    () => ({
      activationMode,
      fitted,
      getFirstEnabledValue,
      getPanelId,
      getSelectedTrigger,
      getTriggerId,
      lazyMount,
      listElement,
      loop,
      mountedPanelValues,
      moveFocus,
      orientation,
      registerListElement,
      registerTrigger,
      registrationVersion: triggerVersion,
      selectedValue,
      setValue,
      unmountOnExit,
      unregisterTrigger,
      updateTriggerNode,
    }),
    [
      activationMode,
      fitted,
      getFirstEnabledValue,
      getPanelId,
      getSelectedTrigger,
      getTriggerId,
      lazyMount,
      listElement,
      loop,
      mountedPanelValues,
      moveFocus,
      orientation,
      registerListElement,
      registerTrigger,
      triggerVersion,
      selectedValue,
      setValue,
      unmountOnExit,
      unregisterTrigger,
      updateTriggerNode,
    ]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <Component
        {...rootProps}
        className={classNames(styles.root, className)}
        data-orientation={orientation}
        data-slot="root"
      >
        {children}
      </Component>
    </TabsContext.Provider>
  );
};

/** Container for triggers and indicator with `role="tablist"`. */
export const TabsList = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...listProps
}: TabsListProps<T>) => {
  const context = useTabsContext('Tabs.List');
  const Component = as ?? 'div';
  const { fitted, orientation, registerListElement } = context;

  const setListNode = useCallback(
    (node: Element | null) => {
      registerListElement(node instanceof HTMLElement ? node : null);
    },
    [registerListElement]
  );

  return (
    <Component
      {...listProps}
      className={classNames(
        styles.list,
        fitted && styles.listFitted,
        className
      )}
      data-orientation={orientation}
      data-slot="list"
      ref={setListNode}
      role="tablist"
    >
      {children}
    </Component>
  );
};

/** Selectable trigger linked to a panel by shared `value`. */
export const TabsTrigger = <T extends ElementType = 'button'>({
  as,
  children,
  className,
  disabled = false,
  onClick,
  onKeyDown,
  value,
  ...triggerProps
}: TabsTriggerProps<T>) => {
  const context = useTabsContext('Tabs.Trigger');
  const Component = as ?? 'button';
  const nodeRef = useRef<HTMLElement | null>(null);
  const {
    activationMode,
    getFirstEnabledValue,
    getPanelId,
    getTriggerId,
    moveFocus,
    orientation,
    registerTrigger,
    selectedValue,
    setValue,
    unregisterTrigger,
    updateTriggerNode,
  } = context;

  const triggerId = getTriggerId(value);
  const panelId = getPanelId(value);
  const isSelected = selectedValue === value;
  const fallbackFocusableValue = getFirstEnabledValue();
  const tabIndex = disabled
    ? -1
    : isSelected ||
        (selectedValue === undefined && fallbackFocusableValue === value)
      ? 0
      : -1;

  useEffect(() => {
    registerTrigger({
      disabled,
      id: triggerId,
      node: nodeRef.current,
      panelId,
      value,
    });

    return () => {
      unregisterTrigger(value);
    };
  }, [disabled, panelId, registerTrigger, triggerId, unregisterTrigger, value]);

  const setNode = useCallback(
    (node: Element | null) => {
      nodeRef.current = node instanceof HTMLElement ? node : null;
      updateTriggerNode(value, nodeRef.current);
    },
    [updateTriggerNode, value]
  );

  const activate = useCallback(() => {
    if (disabled) {
      return;
    }

    setValue(value);
  }, [disabled, setValue, value]);

  const onTriggerClick = useCallback(
    (event: MouseEvent) => {
      callHandler(onClick, event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      activate();
    },
    [activate, disabled, onClick]
  );

  const onTriggerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      callHandler(onKeyDown, event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      if (
        activationMode === 'manual' &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault();
        activate();
        return;
      }

      let moveDirection: 'first' | 'last' | 'next' | 'previous' | undefined;

      if (event.key === 'Home') {
        moveDirection = 'first';
      } else if (event.key === 'End') {
        moveDirection = 'last';
      } else if (orientation === 'horizontal') {
        moveDirection = getHorizontalDirectionKey(event, nodeRef.current);
      } else if (event.key === 'ArrowDown') {
        moveDirection = 'next';
      } else if (event.key === 'ArrowUp') {
        moveDirection = 'previous';
      }

      if (!moveDirection) {
        return;
      }

      event.preventDefault();
      const nextValue = moveFocus(value, moveDirection);

      if (
        nextValue &&
        activationMode === 'automatic' &&
        nextValue !== selectedValue
      ) {
        setValue(nextValue);
      }
    },
    [
      activate,
      activationMode,
      disabled,
      moveFocus,
      onKeyDown,
      orientation,
      selectedValue,
      setValue,
      value,
    ]
  );

  return (
    <Component
      {...triggerProps}
      aria-controls={panelId}
      aria-disabled={disabled ? true : undefined}
      aria-selected={isSelected}
      className={classNames(styles.trigger, className)}
      data-disabled={disabled ? '' : undefined}
      data-orientation={orientation}
      data-slot="trigger"
      data-state={isSelected ? 'active' : 'inactive'}
      disabled={Component === 'button' ? disabled : undefined}
      id={triggerId}
      onClick={onTriggerClick}
      onKeyDown={onTriggerKeyDown}
      ref={setNode}
      role="tab"
      tabIndex={tabIndex}
      type={Component === 'button' ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};

/** Optional wrapper for panels with local lazy/unmount overrides. */
export const TabsPanels = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  lazyMount,
  unmountOnExit,
  ...panelsProps
}: TabsPanelsProps<T>) => {
  const context = useTabsContext('Tabs.Panels');
  const Component = as ?? 'div';

  return (
    <TabsPanelsContext.Provider value={{ lazyMount, unmountOnExit }}>
      <Component
        {...panelsProps}
        className={classNames(styles.panels, className)}
        data-orientation={context.orientation}
        data-slot="panels"
      >
        {children}
      </Component>
    </TabsPanelsContext.Provider>
  );
};

/** Panel region associated to a trigger via matching `value`. */
export const TabsPanel = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  forceMount = false,
  value,
  ...panelProps
}: TabsPanelProps<T>) => {
  const context = useTabsContext('Tabs.Panel');
  const panelContext = useContext(TabsPanelsContext);
  const Component = as ?? 'div';

  const isSelected = context.selectedValue === value;
  const resolvedLazyMount = panelContext?.lazyMount ?? context.lazyMount;
  const resolvedUnmountOnExit =
    panelContext?.unmountOnExit ?? context.unmountOnExit;
  const hasMounted = context.mountedPanelValues.has(value);
  const shouldMount =
    forceMount || !resolvedLazyMount || isSelected || hasMounted;

  if (!shouldMount) {
    return null;
  }

  if (!forceMount && resolvedUnmountOnExit && !isSelected) {
    return null;
  }

  return (
    <Component
      {...panelProps}
      aria-labelledby={context.getTriggerId(value)}
      className={classNames(styles.panel, className)}
      data-orientation={context.orientation}
      data-slot="panel"
      data-state={isSelected ? 'active' : 'inactive'}
      hidden={!isSelected}
      id={context.getPanelId(value)}
      role="tabpanel"
    >
      {children}
    </Component>
  );
};

/** Decorative active-tab indicator that follows selected trigger bounds. */
export const TabsIndicator = <T extends ElementType = 'div'>({
  as,
  className,
  forceMount = false,
  inset = 'none',
  size = 'small',
  transition = true,
  ...indicatorProps
}: TabsIndicatorProps<T>) => {
  const context = useTabsContext('Tabs.Indicator');
  const Component = as ?? 'div';
  const [style, setStyle] = useState<IndicatorStyle>({});
  const {
    getSelectedTrigger,
    listElement,
    orientation,
    registrationVersion,
    selectedValue,
  } = context;

  const listObserver = useResizeObserver();
  const triggerObserver = useResizeObserver();

  const selectedTrigger = getSelectedTrigger();
  const visible = Boolean(listElement && selectedTrigger);

  useEffect(() => {
    listObserver.ref(listElement);

    return () => {
      listObserver.ref(null);
    };
  }, [listElement, listObserver]);

  useEffect(() => {
    triggerObserver.ref(selectedTrigger);

    return () => {
      triggerObserver.ref(null);
    };
  }, [selectedTrigger, triggerObserver]);

  useLayoutEffect(() => {
    if (!listElement || !selectedTrigger) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (!listElement || !selectedTrigger) {
        return;
      }

      if (orientation === 'horizontal') {
        const listRect = listElement.getBoundingClientRect();
        const triggerRect = selectedTrigger.getBoundingClientRect();
        const offset = triggerRect.left - listRect.left;
        const size = triggerRect.width;

        setStyle({
          '--tabs-indicator-offset': `${Math.max(offset, 0)}px`,
          '--tabs-indicator-size': `${Math.max(size, 0)}px`,
        });
      } else {
        const listRect = listElement.getBoundingClientRect();
        const triggerRect = selectedTrigger.getBoundingClientRect();
        const offset = triggerRect.top - listRect.top;
        const size = triggerRect.height;

        setStyle({
          '--tabs-indicator-offset': `${Math.max(offset, 0)}px`,
          '--tabs-indicator-size': `${Math.max(size, 0)}px`,
        });
      }
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [
    listElement,
    orientation,
    registrationVersion,
    listObserver.rect,
    selectedTrigger,
    triggerObserver.rect,
  ]);

  if (!forceMount && selectedValue === undefined) {
    return null;
  }

  const debugIndicatorData =
    import.meta.env.DEV && selectedValue !== undefined
      ? {
          'data-debug-indicator-offset': style['--tabs-indicator-offset'] ?? '',
          'data-debug-indicator-size': style['--tabs-indicator-size'] ?? '',
          'data-debug-selected-value': selectedValue,
          'data-debug-selected-trigger': selectedTrigger
            ? 'present'
            : 'missing',
          'data-debug-visible': visible ? 'true' : 'false',
        }
      : {};

  return (
    <Component
      {...indicatorProps}
      aria-hidden="true"
      className={classNames(
        styles.indicator,
        transition && styles.indicatorTransition,
        inset === 'small' && styles.indicatorInsetSmall,
        inset === 'medium' && styles.indicatorInsetMedium,
        size === 'small' && styles.indicatorSizeSmall,
        size === 'medium' && styles.indicatorSizeMedium,
        size === 'large' && styles.indicatorSizeLarge,
        orientation === 'horizontal'
          ? styles.indicatorHorizontal
          : styles.indicatorVertical,
        className
      )}
      data-orientation={orientation}
      data-slot="indicator"
      data-state={visible ? 'visible' : 'hidden'}
      style={style}
      {...debugIndicatorData}
    />
  );
};

export const Tabs = Object.assign(TabsRoot, {
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabsPanel,
  Panels: TabsPanels,
  Trigger: TabsTrigger,
});

export type {
  TabsActivationMode,
  TabsIndicatorInset,
  TabsIndicatorSize,
  TabsIndicatorProps,
  TabsListProps,
  TabsOrientation,
  TabsPanelProps,
  TabsPanelsProps,
  TabsProps,
  TabsRootProps,
  TabsTriggerProps,
} from './types';
