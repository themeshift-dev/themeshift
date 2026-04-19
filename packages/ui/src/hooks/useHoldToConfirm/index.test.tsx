import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type RafId = ReturnType<typeof setTimeout>;

describe('useHoldToConfirm', () => {
  let rafCounter = 0;
  let rafHandles = new Map<number, RafId>();

  beforeEach(() => {
    vi.useFakeTimers();

    rafCounter = 0;
    rafHandles = new Map<number, RafId>();

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      const id = ++rafCounter;
      const handle = setTimeout(() => {
        callback(performance.now());
      }, 16);

      rafHandles.set(id, handle);

      return id;
    });

    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      const handle = rafHandles.get(id);

      if (handle) {
        clearTimeout(handle);
        rafHandles.delete(id);
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('confirms after holding for confirmationDelay', async () => {
    const { useHoldToConfirm } = await import('./index');
    const onConfirm = vi.fn();

    const { result } = renderHook(() =>
      useHoldToConfirm({ confirmationDelay: 200, onConfirm })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.isPressing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(result.current.isPressing).toBe(false);
    expect(result.current.wasConfirmed).toBe(true);
    expect(result.current.progress).toBe(100);
    expect(result.current.timeRemaining).toBe(0);
  });

  it('calls onCancel only when a hold had active progress', async () => {
    const { useHoldToConfirm } = await import('./index');
    const onCancel = vi.fn();

    const { result } = renderHook(() =>
      useHoldToConfirm({ confirmationDelay: 200, onCancel })
    );

    act(() => {
      result.current.start();
      result.current.cancel();
    });

    expect(onCancel).not.toHaveBeenCalled();
    expect(result.current.wasCancelled).toBe(false);

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(32);
      result.current.cancel();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.wasCancelled).toBe(true);
  });

  it('emits progress updates while active and undefined when idle', async () => {
    const { useHoldToConfirm } = await import('./index');
    const onProgress = vi.fn();

    const { result } = renderHook(() =>
      useHoldToConfirm({ confirmationDelay: 200, onProgress })
    );

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(50);
      result.current.cancel();
    });

    expect(onProgress).toHaveBeenCalled();
    expect(onProgress).toHaveBeenLastCalledWith(undefined, undefined);
  });

  it('resets confirmed state after confirmResetDelay', async () => {
    const { useHoldToConfirm } = await import('./index');

    const { result } = renderHook(() =>
      useHoldToConfirm({
        confirmationDelay: 100,
        confirmResetDelay: 300,
      })
    );

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(120);
    });

    expect(result.current.wasConfirmed).toBe(true);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current.wasConfirmed).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.timeRemaining).toBe(0);
  });

  it('ignores repeated start calls while a hold is already active', async () => {
    const { useHoldToConfirm } = await import('./index');
    const onConfirm = vi.fn();

    const { result } = renderHook(() =>
      useHoldToConfirm({ confirmationDelay: 200, onConfirm })
    );

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(100);
    });

    const progressBeforeSecondStart = result.current.progress;

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(120);
    });

    expect(result.current.progress).toBeGreaterThan(progressBeforeSecondStart);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(result.current.wasConfirmed).toBe(true);
  });

  it('reset clears lifecycle flags and emits idle progress state', async () => {
    const { useHoldToConfirm } = await import('./index');
    const onProgress = vi.fn();

    const { result } = renderHook(() =>
      useHoldToConfirm({ confirmationDelay: 200, onProgress })
    );

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(48);
      result.current.cancel();
    });

    expect(result.current.wasCancelled).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isPressing).toBe(false);
    expect(result.current.wasCancelled).toBe(false);
    expect(result.current.wasConfirmed).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.timeRemaining).toBe(0);
    expect(onProgress).toHaveBeenLastCalledWith(undefined, undefined);
  });
});
