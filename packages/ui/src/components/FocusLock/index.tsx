import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type RefObject,
} from 'react';

import type {
  FocusLockProps,
  FocusLockShard,
  UseFocusLockOptions,
} from './types';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let activeLocks: string[] = [];
const stackListeners = new Set<() => void>();

function emitStackChange() {
  for (const listener of stackListeners) {
    listener();
  }
}

function subscribeToStack(listener: () => void) {
  stackListeners.add(listener);

  return () => {
    stackListeners.delete(listener);
  };
}

function readStackSnapshot() {
  return activeLocks.join('|');
}

function pushLock(lockId: string) {
  if (activeLocks.at(-1) === lockId) {
    return;
  }

  activeLocks = activeLocks.filter((value) => value !== lockId);
  activeLocks.push(lockId);
  emitStackChange();
}

function removeLock(lockId: string) {
  const nextStack = activeLocks.filter((value) => value !== lockId);

  if (nextStack.length === activeLocks.length) {
    return;
  }

  activeLocks = nextStack;
  emitStackChange();
}

function resolveShardElement(shard: FocusLockShard): HTMLElement | null {
  if (!shard) {
    return null;
  }

  if (shard instanceof HTMLElement) {
    return shard;
  }

  return shard.current;
}

function getLockRoots(
  containerRef: RefObject<HTMLElement | null>,
  shards: FocusLockShard[]
): HTMLElement[] {
  const roots: HTMLElement[] = [];
  const container = containerRef.current;

  if (container) {
    roots.push(container);
  }

  for (const shard of shards) {
    const resolved = resolveShardElement(shard);

    if (!resolved || roots.includes(resolved)) {
      continue;
    }

    roots.push(resolved);
  }

  return roots;
}

function isElementVisible(element: HTMLElement): boolean {
  if (element.hidden) {
    return false;
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  if (element.hasAttribute('inert')) {
    return false;
  }

  const style = window.getComputedStyle(element);

  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  return element.getClientRects().length > 0;
}

function isTabbable(element: HTMLElement): boolean {
  if (!isElementVisible(element)) {
    return false;
  }

  if (element.getAttribute('aria-disabled') === 'true') {
    return false;
  }

  return element.tabIndex >= 0;
}

function getTabbables(roots: HTMLElement[]): HTMLElement[] {
  return roots.flatMap((root) => {
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );

    if (root.matches(FOCUSABLE_SELECTOR)) {
      nodes.unshift(root);
    }

    return nodes.filter(isTabbable);
  });
}

function focusNode(node: HTMLElement | null | undefined) {
  if (!node) {
    return;
  }

  try {
    node.focus({ preventScroll: true });
  } catch {
    node.focus();
  }
}

function focusFirst(roots: HTMLElement[]) {
  const tabbables = getTabbables(roots);
  const fallback = roots[0] ?? null;

  focusNode(tabbables[0] ?? fallback);
}

function focusEdge(roots: HTMLElement[], edge: 'first' | 'last') {
  const tabbables = getTabbables(roots);

  if (tabbables.length === 0) {
    focusNode(roots[0]);
    return;
  }

  if (edge === 'first') {
    focusNode(tabbables[0]);
    return;
  }

  focusNode(tabbables[tabbables.length - 1]);
}

function targetInsideRoots(target: EventTarget | null, roots: HTMLElement[]) {
  return (
    target instanceof Node &&
    roots.some((root) => root === target || root.contains(target))
  );
}

/**
 * Manages focus trapping behavior for one lock scope.
 */
export function useFocusLock({
  active,
  autoFocus = true,
  containerRef,
  returnFocus = false,
  shards = [],
}: UseFocusLockOptions) {
  const generatedId = useId();
  const lockId = useRef(`focus-lock-${generatedId}`);
  const previousFocusedElement = useRef<HTMLElement | null>(null);
  const wasActive = useRef(active);

  useSyncExternalStore(subscribeToStack, readStackSnapshot, readStackSnapshot);

  const isTopMost = active && activeLocks.at(-1) === lockId.current;

  useEffect(() => {
    if (!active) {
      removeLock(lockId.current);
      return;
    }

    pushLock(lockId.current);

    return () => {
      removeLock(lockId.current);
    };
  }, [active]);

  useEffect(() => {
    if (active && !wasActive.current) {
      previousFocusedElement.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }

    if (!active && wasActive.current && returnFocus) {
      const previousElement = previousFocusedElement.current;

      if (previousElement?.isConnected) {
        focusNode(previousElement);
      }
    }

    wasActive.current = active;
  }, [active, returnFocus]);

  useEffect(() => {
    if (!active || !isTopMost || !autoFocus) {
      return;
    }

    queueMicrotask(() => {
      if (!activeLocks.includes(lockId.current)) {
        return;
      }

      const roots = getLockRoots(containerRef, shards);

      if (roots.length === 0) {
        return;
      }

      if (targetInsideRoots(document.activeElement, roots)) {
        return;
      }

      focusFirst(roots);
    });
  }, [active, autoFocus, containerRef, isTopMost, shards]);

  useEffect(() => {
    if (!active || !isTopMost) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.defaultPrevented) {
        return;
      }

      const roots = getLockRoots(containerRef, shards);

      if (roots.length === 0) {
        return;
      }

      const tabbables = getTabbables(roots);

      if (tabbables.length === 0) {
        event.preventDefault();
        focusNode(roots[0]);
        return;
      }

      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];

      if (!targetInsideRoots(activeElement, roots)) {
        event.preventDefault();
        focusEdge(roots, event.shiftKey ? 'last' : 'first');
        return;
      }

      if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        focusNode(first);
        return;
      }

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        focusNode(last);
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      const roots = getLockRoots(containerRef, shards);

      if (roots.length === 0) {
        return;
      }

      if (targetInsideRoots(event.target, roots)) {
        return;
      }

      focusFirst(roots);
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocusIn, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn, true);
    };
  }, [active, containerRef, isTopMost, shards]);
}

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

export type {
  FocusLockAdapterComponent,
  FocusLockAdapterProps,
  FocusLockProps,
  FocusLockShard,
  UseFocusLockOptions,
} from './types';
