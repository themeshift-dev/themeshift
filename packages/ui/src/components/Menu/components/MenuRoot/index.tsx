import classNames from 'classnames';
import { useCallback, useMemo, useRef } from 'react';

import styles from '@/components/Menu/Menu.module.scss';
import { MenuRootContext } from '@/components/Menu/internal/contexts';
import { useControllableBooleanState } from '@/components/Menu/internal/hooks';
import type { MenuRootContextValue } from '@/components/Menu/internal/types';
import type { MenuRootProps } from '@/components/Menu/types';

const densityClassMap = {
  compact: styles.densityCompact,
  spacious: styles.densitySpacious,
} satisfies Record<'compact' | 'spacious', string>;

const sizeClassMap = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} satisfies Record<NonNullable<MenuRootProps['size']>, string>;

/**
 * Root menu primitive that provides state, direction, and interaction context
 * for all menu descendants.
 */
export const MenuRoot = ({
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
  size = 'medium',
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
          orientation === 'horizontal' && styles.orientationHorizontal,
          density !== 'normal' && densityClassMap[density],
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
