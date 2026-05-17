import { useMemo, useRef } from 'react';

import { MenuSubContext } from '@/components/Menu/internal/contexts';
import { useControllableBooleanState } from '@/components/Menu/internal/hooks';
import type { MenuSubContextValue } from '@/components/Menu/internal/types';
import type { MenuSubProps } from '@/components/Menu/types';

/** Submenu state boundary for nested menu interactions. */
export const MenuSub = ({
  children,
  closeDelay = 300,
  defaultOpen = false,
  disabled = false,
  onOpenChange,
  open,
  openDelay = 100,
  openOnHover = true,
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
      openDelay,
      openOnHover,
      setContentNode: (node: HTMLElement | null) => {
        contentRef.current = node;
      },
      setOpen: setResolvedOpen,
      setTriggerNode: (node: HTMLElement | null) => {
        triggerRef.current = node;
      },
      triggerRef,
    }),
    [
      closeDelay,
      disabled,
      openDelay,
      openOnHover,
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
