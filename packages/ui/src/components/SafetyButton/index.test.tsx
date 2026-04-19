import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SafetyButton } from './index';

type RafId = ReturnType<typeof setTimeout>;

describe('SafetyButton', () => {
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

  it('calls onConfirm after holding for the required delay', () => {
    const onConfirm = vi.fn();

    render(
      <SafetyButton confirmationDelay={200} onConfirm={onConfirm}>
        Delete
      </SafetyButton>
    );

    const button = screen.getByRole('button', { name: 'Delete' });

    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel only when an active hold was interrupted', () => {
    const onCancel = vi.fn();

    render(
      <SafetyButton confirmationDelay={200} onCancel={onCancel}>
        Delete
      </SafetyButton>
    );

    const button = screen.getByRole('button', { name: 'Delete' });

    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerUp(button);

    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(32);
    });
    fireEvent.pointerUp(button);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('fires onAttemptStart for pointer and keyboard attempts', () => {
    const onAttemptStart = vi.fn();

    render(<SafetyButton onAttemptStart={onAttemptStart}>Delete</SafetyButton>);

    const button = screen.getByRole('button', { name: 'Delete' });

    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerUp(button);

    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter' });

    expect(onAttemptStart).toHaveBeenCalledTimes(2);
  });

  it('confirms after keyboard hold duration', () => {
    const onConfirm = vi.fn();

    render(
      <SafetyButton confirmationDelay={200} onConfirm={onConfirm}>
        Delete
      </SafetyButton>
    );

    const button = screen.getByRole('button', { name: 'Delete' });

    fireEvent.keyDown(button, { key: 'Enter' });
    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('supports icon-only resolver labels and icons', () => {
    const onConfirm = vi.fn();

    render(
      <SafetyButton
        aria-label={({ wasConfirmed }) =>
          wasConfirmed ? 'Removed' : 'Press and hold to remove'
        }
        confirmationDelay={200}
        icon={({ wasConfirmed }) =>
          wasConfirmed ? (
            <span aria-hidden>check</span>
          ) : (
            <span aria-hidden>trash</span>
          )
        }
        onConfirm={onConfirm}
      />
    );

    const button = screen.getByRole('button', {
      name: 'Press and hold to remove',
    });

    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Removed' })).toBeInTheDocument();
  });

  it('emits progress values and resets to undefined on idle', () => {
    const onProgress = vi.fn();

    render(
      <SafetyButton confirmationDelay={200} onProgress={onProgress}>
        Delete
      </SafetyButton>
    );

    const button = screen.getByRole('button', { name: 'Delete' });

    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(48);
    });
    fireEvent.pointerUp(button);

    expect(onProgress).toHaveBeenCalled();
    expect(onProgress).toHaveBeenLastCalledWith(undefined, undefined);
  });

  it('has no detectable accessibility violations in a representative state', async () => {
    vi.useRealTimers();

    const { container } = render(
      <SafetyButton confirmationDelay={300}>
        Press and hold to delete
      </SafetyButton>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
