import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useScrollLock } from './index';

describe('useScrollLock', () => {
  it('locks and restores body scroll styles', () => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const { rerender, unmount } = renderHook(
      ({ locked }) => useScrollLock(locked),
      {
        initialProps: { locked: false },
      }
    );

    rerender({ locked: true });

    expect(document.body.style.overflow).toBe('hidden');

    rerender({ locked: false });

    expect(document.body.style.overflow).toBe(originalOverflow);
    expect(document.body.style.paddingRight).toBe(originalPaddingRight);

    unmount();
  });

  it('keeps the lock active until all consumers unmount', () => {
    const hookA = renderHook(() => useScrollLock(true));
    const hookB = renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe('hidden');

    hookA.unmount();

    expect(document.body.style.overflow).toBe('hidden');

    hookB.unmount();

    expect(document.body.style.overflow).toBe('');
  });
});
