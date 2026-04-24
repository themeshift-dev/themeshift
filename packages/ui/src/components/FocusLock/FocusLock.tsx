import type { FocusLockProps } from './types';
import { useFocusLock } from './useFocusLock';

/**
 * Traps keyboard focus inside a set of focus scope roots while active.
 */
export const FocusLock = ({
  active,
  autoFocus = true,
  children,
  containerRef,
  disabled = false,
  returnFocus = false,
  shards = [],
}: FocusLockProps) => {
  useFocusLock({
    active: active && !disabled,
    autoFocus,
    containerRef,
    returnFocus,
    shards,
  });

  return children;
};
