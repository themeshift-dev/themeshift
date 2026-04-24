import { useEffect, useRef, type RefObject } from 'react';

export type EventType =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout';

export type UseOnClickOutsideHandler = (event: Event) => void;

/**
 * Calls a handler when the configured document event fires outside of `ref`.
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: UseOnClickOutsideHandler,
  eventType: EventType = 'mousedown'
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const listener = (event: Event) => {
      const element = ref.current;
      const target = event.target as Node | null;

      if (!element || !target || element.contains(target)) {
        return;
      }

      handlerRef.current(event);
    };

    document.addEventListener(eventType, listener);

    return () => {
      document.removeEventListener(eventType, listener);
    };
  }, [eventType, ref]);
}
