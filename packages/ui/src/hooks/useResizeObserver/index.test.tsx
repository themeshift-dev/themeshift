import { render, screen, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useResizeObserver } from './index';

type MockObserverInstance = {
  callback: ResizeObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
  observe: ReturnType<typeof vi.fn>;
};

const observerInstances: MockObserverInstance[] = [];

function createRect(width: number, height: number) {
  return {
    x: 0,
    y: 0,
    width,
    height,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    toJSON: () => ({}),
  } as DOMRectReadOnly;
}

function emitResize(target: Element, width: number, height: number) {
  const instance = observerInstances.at(-1);

  if (!instance) {
    return;
  }

  const entry = {
    borderBoxSize: [],
    contentBoxSize: [],
    contentRect: createRect(width, height),
    devicePixelContentBoxSize: [],
    target,
  } as unknown as ResizeObserverEntry;

  instance.callback([entry], {} as ResizeObserver);
}

function installResizeObserverStub({
  throwOnBox,
}: {
  throwOnBox?: boolean;
} = {}) {
  observerInstances.length = 0;

  class ResizeObserverMock {
    private readonly instance: MockObserverInstance;

    constructor(callback: ResizeObserverCallback) {
      const observe = vi.fn((_: Element, options?: ResizeObserverOptions) => {
        if (throwOnBox && options?.box) {
          throw new Error('Unsupported box option');
        }
      });

      this.instance = {
        callback,
        disconnect: vi.fn(),
        observe,
      };

      observerInstances.push(this.instance);
    }

    disconnect() {
      this.instance.disconnect();
    }

    observe(target: Element, options?: ResizeObserverOptions) {
      this.instance.observe(target, options);
    }

    unobserve() {
      // no-op for tests
    }
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
}

afterEach(() => {
  vi.unstubAllGlobals();
  observerInstances.length = 0;
});

const HookProbe = ({
  box,
  disabled = false,
}: {
  box?: 'content-box' | 'border-box' | 'device-pixel-content-box';
  disabled?: boolean;
}) => {
  const [changeCount, setChangeCount] = useState(0);
  const { isSupported, rect, ref } = useResizeObserver({
    box,
    disabled,
  });

  useEffect(() => {
    if (!rect) {
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setChangeCount((value) => value + 1);
    });

    return () => {
      cancelled = true;
    };
  }, [rect]);

  return (
    <div>
      <div data-testid="support">{`${isSupported}`}</div>
      <div data-testid="change-count">{changeCount}</div>
      <div data-testid="size">
        {rect ? `${rect.width}x${rect.height}` : 'none'}
      </div>
      <div data-testid="target" ref={ref} />
    </div>
  );
};

describe('useResizeObserver', () => {
  it('returns unsupported state without throwing when ResizeObserver is unavailable', () => {
    render(<HookProbe />);

    expect(screen.getByTestId('support')).toHaveTextContent('false');
    expect(screen.getByTestId('size')).toHaveTextContent('none');
  });

  it('observes and disconnects element lifecycle', () => {
    installResizeObserverStub();

    const { unmount } = render(<HookProbe />);

    const target = screen.getByTestId('target');
    const instance = observerInstances[0];

    expect(instance.observe).toHaveBeenCalledWith(target, {
      box: 'content-box',
    });

    unmount();

    expect(instance.disconnect).toHaveBeenCalled();
  });

  it('updates rect state and avoids repeated updates for identical sizes', async () => {
    installResizeObserverStub();

    render(<HookProbe />);

    const target = screen.getByTestId('target');

    emitResize(target, 120, 48);
    emitResize(target, 120, 48);

    await waitFor(() => {
      expect(screen.getByTestId('size')).toHaveTextContent('120x48');
      expect(screen.getByTestId('change-count')).toHaveTextContent('1');
    });
  });

  it('falls back when box observation options are not supported', () => {
    installResizeObserverStub({ throwOnBox: true });

    render(<HookProbe box="device-pixel-content-box" />);

    const target = screen.getByTestId('target');
    const instance = observerInstances[0];

    expect(instance.observe).toHaveBeenNthCalledWith(1, target, {
      box: 'device-pixel-content-box',
    });
    expect(instance.observe).toHaveBeenNthCalledWith(2, target, undefined);
  });

  it('does not observe while disabled', () => {
    installResizeObserverStub();

    render(<HookProbe disabled />);

    expect(observerInstances).toHaveLength(0);
  });
});
