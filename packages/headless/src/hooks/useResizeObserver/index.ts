import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefCallback,
} from 'react';

export type ResizeObserverBox =
  | 'content-box'
  | 'border-box'
  | 'device-pixel-content-box';

export type UseResizeObserverOptions = {
  /**
   * Selects which box size should drive resize updates.
   *
   * Defaults to `content-box`.
   */
  box?: ResizeObserverBox;

  /**
   * Disables observation while keeping the same return shape.
   */
  disabled?: boolean;
};

export type UseResizeObserverReturn = {
  /**
   * Latest resize observer entry for the observed element.
   */
  entry?: ResizeObserverEntry;

  /**
   * `true` when the current environment supports `ResizeObserver`.
   */
  isSupported: boolean;

  /**
   * Latest observed content rectangle.
   */
  rect?: DOMRectReadOnly;

  /**
   * Ref callback used to attach the observed element.
   */
  ref: RefCallback<Element>;
};

function areRectsEqual(
  left: DOMRectReadOnly | undefined,
  right: DOMRectReadOnly
) {
  if (!left) {
    return false;
  }

  return (
    left.x === right.x &&
    left.y === right.y &&
    left.width === right.width &&
    left.height === right.height &&
    left.top === right.top &&
    left.right === right.right &&
    left.bottom === right.bottom &&
    left.left === right.left
  );
}

/**
 * Observes element size changes and returns the latest `ResizeObserver` data.
 */
export function useResizeObserver({
  box = 'content-box',
  disabled = false,
}: UseResizeObserverOptions = {}): UseResizeObserverReturn {
  const targetRef = useRef<Element | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const [state, setState] = useState<{
    entry?: ResizeObserverEntry;
    rect?: DOMRectReadOnly;
  }>({});

  const isSupported = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.ResizeObserver !== 'undefined',
    []
  );

  const disconnect = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  const observeTarget = useCallback(
    (node: Element | null) => {
      if (!node || disabled || !isSupported) {
        return;
      }

      const observer = new ResizeObserver((entries) => {
        const nextEntry = entries[0];

        if (!nextEntry) {
          return;
        }

        const nextRect = nextEntry.contentRect;

        setState((current) => {
          if (
            current.entry === nextEntry &&
            areRectsEqual(current.rect, nextRect)
          ) {
            return current;
          }

          if (areRectsEqual(current.rect, nextRect)) {
            return {
              ...current,
              entry: nextEntry,
            };
          }

          return {
            entry: nextEntry,
            rect: nextRect,
          };
        });
      });

      observerRef.current = observer;

      try {
        observer.observe(node, { box });
      } catch {
        observer.observe(node);
      }
    },
    [box, disabled, isSupported]
  );

  const ref = useCallback<RefCallback<Element>>(
    (node) => {
      if (targetRef.current === node) {
        return;
      }

      disconnect();
      targetRef.current = node;
      observeTarget(node);
    },
    [disconnect, observeTarget]
  );

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    disconnect();
    observeTarget(targetRef.current);
  }, [box, disabled, disconnect, observeTarget]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    entry: state.entry,
    isSupported,
    rect: state.rect,
    ref,
  };
}
