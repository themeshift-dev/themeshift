import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCopyToClipboard } from './index';

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('copies text and resets wasCopied after clearDelay', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const { result } = renderHook(() =>
      useCopyToClipboard({
        clearDelay: 150,
      })
    );

    expect(result.current[0]).toBe(false);

    await act(async () => {
      const copied = await result.current[1]('theme-shift');
      expect(copied).toBe(true);
    });

    expect(writeText).toHaveBeenCalledWith('theme-shift');
    expect(result.current[0]).toBe(true);

    act(() => {
      vi.advanceTimersByTime(149);
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current[0]).toBe(false);
  });

  it('returns false and warns when clipboard API is unavailable', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      const copied = await result.current[1]('theme-shift');
      expect(copied).toBe(false);
    });

    expect(warnSpy).toHaveBeenCalledWith('Clipboard not supported');
    expect(result.current[0]).toBe(false);
  });

  it('returns false and warns when clipboard write fails', async () => {
    const writeText = vi.fn(async () => {
      throw new Error('Permission denied');
    });
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      const copied = await result.current[1]('theme-shift');
      expect(copied).toBe(false);
    });

    expect(writeText).toHaveBeenCalledWith('theme-shift');
    expect(warnSpy).toHaveBeenCalledWith('Copy failed', expect.any(Error));
    expect(result.current[0]).toBe(false);
  });

  it('clears pending timeout when unmounted', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { result, unmount } = renderHook(() =>
      useCopyToClipboard({
        clearDelay: 500,
      })
    );

    await act(async () => {
      await result.current[1]('theme-shift');
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
