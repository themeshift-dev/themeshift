import {
  useCallback,
  useEffect,
  useRef,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import { useTabsContext } from '../../internal/context';
import { callHandler, getHorizontalDirectionKey } from '../../internal/utils';
import type { TabsTriggerProps } from '../../types';

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
      className={className}
      data-disabled={disabled ? '' : undefined}
      data-orientation={orientation}
      data-slot="trigger"
      data-state={isSelected ? 'active' : 'inactive'}
      data-value={value}
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
