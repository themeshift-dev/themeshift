import type { ComponentType, ReactNode, RefObject } from 'react';

export type FocusLockShard = HTMLElement | null | RefObject<HTMLElement | null>;

/**
 * Adapter props consumed by focus lock implementations used by ThemeShift
 * components.
 */
export type FocusLockAdapterProps = {
  /**
   * Whether focus locking behavior is currently active.
   */
  active: boolean;

  /**
   * Whether focus should move inside the lock when it becomes active.
   */
  autoFocus?: boolean;

  /**
   * The lock container used as the primary focus scope root.
   */
  containerRef: RefObject<HTMLElement | null>;

  /**
   * Content rendered within the focus scope.
   */
  children: ReactNode;

  /**
   * Whether focus should return to the previously focused element when the lock
   * deactivates.
   */
  returnFocus?: boolean;

  /**
   * Additional elements or refs that should be treated as part of the same
   * focus scope (for example, portal content).
   */
  shards?: FocusLockShard[];
};

/**
 * Reusable focus lock adapter component contract for ThemeShift components.
 */
export type FocusLockAdapterComponent = ComponentType<FocusLockAdapterProps>;

/**
 * Props for the built-in FocusLock component.
 */
export type FocusLockProps = FocusLockAdapterProps & {
  /**
   * Disables locking behavior while preserving rendered content.
   */
  disabled?: boolean;
};

/**
 * Options for the low-level useFocusLock hook.
 */
export type UseFocusLockOptions = {
  /**
   * Whether locking behavior is active.
   */
  active: boolean;

  /**
   * Whether focus should move inside on activation.
   */
  autoFocus?: boolean;

  /**
   * Primary container ref that bounds the lock.
   */
  containerRef: RefObject<HTMLElement | null>;

  /**
   * Whether focus should be restored when deactivating.
   */
  returnFocus?: boolean;

  /**
   * Additional elements treated as part of the lock.
   */
  shards?: FocusLockShard[];
};
