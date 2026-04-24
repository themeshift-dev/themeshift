import { useEffect, useId, useState, useRef, type RefObject } from 'react';

import type { FocusLockShard, UseFocusLockOptions } from './types';

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
let activationCounter = 0;
const lockMetadata = new Map<string, { depth: number; order: number }>();

function pushLock(lockId: string, depth: number) {
  const existing = lockMetadata.get(lockId);
  const order = existing?.order ?? activationCounter++;
  lockMetadata.set(lockId, { depth, order });
  activeLocks = activeLocks.filter((value) => value !== lockId);
  activeLocks.push(lockId);
  activeLocks.sort((left, right) => {
    const leftMeta = lockMetadata.get(left) ?? { depth: 0, order: 0 };
    const rightMeta = lockMetadata.get(right) ?? { depth: 0, order: 0 };

    if (leftMeta.depth !== rightMeta.depth) {
      return leftMeta.depth - rightMeta.depth;
    }

    return leftMeta.order - rightMeta.order;
  });
}

function removeLock(lockId: string) {
  const nextStack = activeLocks.filter((value) => value !== lockId);

  if (nextStack.length === activeLocks.length) {
    return;
  }

  activeLocks = nextStack;
  lockMetadata.delete(lockId);
}

function isTopMostLock(lockId: string) {
  return activeLocks.at(-1) === lockId;
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

function getNodeDepth(element: Node): number {
  let depth = 0;
  let current: Node | null = element.parentNode;

  while (current) {
    depth += 1;
    current = current.parentNode;
  }

  return depth;
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

  if (element.getClientRects().length > 0) {
    return true;
  }

  // JSDOM does not perform layout, so client rects are often empty even when
  // elements are focusable in tests.
  if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
    return true;
  }

  return false;
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
  const [lockId] = useState(() => `focus-lock-${generatedId}`);
  const previousFocusedElement = useRef<HTMLElement | null>(null);
  const wasActive = useRef(active);

  useEffect(() => {
    if (!active) {
      removeLock(lockId);
      return;
    }

    const roots = getLockRoots(containerRef, shards);
    const primaryRoot = roots[0] ?? containerRef.current;
    const depth = primaryRoot ? getNodeDepth(primaryRoot) : 0;

    pushLock(lockId, depth);

    return () => {
      removeLock(lockId);
    };
  }, [active, containerRef, lockId, shards]);

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
    if (!active || !autoFocus) {
      return;
    }

    queueMicrotask(() => {
      if (!isTopMostLock(lockId)) {
        return;
      }

      if (!activeLocks.includes(lockId)) {
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
  }, [active, autoFocus, containerRef, lockId, shards]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTopMostLock(lockId)) {
        return;
      }

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
      if (!isTopMostLock(lockId)) {
        return;
      }

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
  }, [active, containerRef, lockId, shards]);
}
