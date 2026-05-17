import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from 'react';

import { TabsContext, type TriggerRecord } from '../../internal/context';
import {
  DEFAULT_ACTIVATION_MODE,
  DEFAULT_LOOP,
  DEFAULT_ORIENTATION,
} from '../../internal/constants';
import {
  getEnabledTriggerValues,
  sanitizeIdSegment,
} from '../../internal/utils';
import type { TabsRootProps } from '../../types';

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
      selectedValue,
      setValue,
      triggerVersion,
      unmountOnExit,
      unregisterTrigger,
      updateTriggerNode,
    ]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <Component
        {...rootProps}
        className={className}
        data-activation-mode={activationMode}
        data-controlled={isControlled ? '' : undefined}
        data-fitted={fitted ? '' : undefined}
        data-lazy-mount={lazyMount ? '' : undefined}
        data-loop={loop ? '' : undefined}
        data-orientation={orientation}
        data-selected-value={selectedValue}
        data-slot="root"
        data-unmount-on-exit={unmountOnExit ? '' : undefined}
      >
        {children}
      </Component>
    </TabsContext.Provider>
  );
};
