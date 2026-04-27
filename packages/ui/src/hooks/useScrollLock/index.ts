import { useEffect } from 'react';

let lockCount = 0;
let previousBodyOverflow = '';
let previousBodyPaddingRight = '';

/**
 * Prevents background page scrolling while active.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (
      !locked ||
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return;
    }

    const { body, documentElement } = document;

    if (lockCount === 0) {
      previousBodyOverflow = body.style.overflow;
      previousBodyPaddingRight = body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      body.style.overflow = 'hidden';

      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);

      if (lockCount === 0) {
        body.style.overflow = previousBodyOverflow;
        body.style.paddingRight = previousBodyPaddingRight;
      }
    };
  }, [locked]);
}
