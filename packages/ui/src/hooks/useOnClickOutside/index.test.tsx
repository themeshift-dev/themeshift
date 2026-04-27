import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useOnClickOutside } from './index';

function useTestHook(
  handler: (event: Event) => void,
  eventType:
    | 'mousedown'
    | 'mouseup'
    | 'touchstart'
    | 'touchend'
    | 'focusin'
    | 'focusout' = 'mousedown'
) {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, handler, eventType);

  return ref;
}

describe('useOnClickOutside', () => {
  it('calls the handler when the event target is outside the referenced element', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useTestHook(handler));
    const container = document.createElement('div');
    const inside = document.createElement('button');
    const outside = document.createElement('button');

    container.append(inside);
    document.body.append(container, outside);
    result.current.current = container;

    act(() => {
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it('does not call the handler when the event target is inside the referenced element', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useTestHook(handler));
    const container = document.createElement('div');
    const inside = document.createElement('button');

    container.append(inside);
    document.body.append(container);
    result.current.current = container;

    act(() => {
      inside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('listens to the configured event type', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useTestHook(handler, 'focusin'));
    const container = document.createElement('div');
    const outside = document.createElement('button');

    document.body.append(container, outside);
    result.current.current = container;

    act(() => {
      outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it('cleans up listeners when unmounted and when event type changes', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const handler = vi.fn();

    const { rerender, unmount } = renderHook(
      ({ eventType }: { eventType: 'mousedown' | 'mouseup' }) => {
        const ref = useRef<HTMLDivElement>(null);
        useOnClickOutside(ref, handler, eventType);
        return ref;
      },
      {
        initialProps: { eventType: 'mousedown' },
      }
    );

    rerender({ eventType: 'mouseup' });
    unmount();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function)
    );
  });
});
