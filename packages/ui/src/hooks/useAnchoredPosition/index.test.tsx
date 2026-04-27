import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  useAnchoredPosition,
  type Placement,
  type UseAnchoredPositionOptions,
} from './index';

function setRect(
  element: HTMLElement,
  rect: {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
  }
) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      ...rect,
      x: rect.left,
      y: rect.top,
      toJSON: () => rect,
    }),
  });
}

function triggerPositionUpdate() {
  window.dispatchEvent(new Event('resize'));
}

type TestHarnessProps = {
  options: Omit<UseAnchoredPositionOptions, 'open'>;
};

const TestHarness = ({ options }: TestHarnessProps) => {
  const { actualPlacement, anchorRef, arrowStyle, floatingRef, style } =
    useAnchoredPosition({
      ...options,
      open: true,
    });

  return (
    <>
      <div data-testid="anchor" ref={anchorRef} />
      <div
        data-placement={actualPlacement}
        data-testid="floating"
        ref={floatingRef}
        style={style}
      >
        <div data-testid="arrow" style={arrowStyle} />
      </div>
    </>
  );
};

describe('useAnchoredPosition', () => {
  it('positions content on top by default', async () => {
    render(<TestHarness options={{}} />);

    const anchor = screen.getByTestId('anchor');
    const floating = screen.getByTestId('floating');

    setRect(anchor, {
      bottom: 140,
      height: 40,
      left: 100,
      right: 180,
      top: 100,
      width: 80,
    });
    setRect(floating, {
      bottom: 0,
      height: 30,
      left: 0,
      right: 0,
      top: 0,
      width: 120,
    });
    triggerPositionUpdate();

    await waitFor(() => {
      expect(floating.style.top).toBe('62px');
      expect(floating.style.left).toBe('80px');
      expect(floating.getAttribute('data-placement')).toBe('top');
    });
  });

  it('flips placement when preferred side collides', async () => {
    render(
      <TestHarness
        options={{
          placement: 'top',
        }}
      />
    );

    const anchor = screen.getByTestId('anchor');
    const floating = screen.getByTestId('floating');

    setRect(anchor, {
      bottom: 26,
      height: 16,
      left: 50,
      right: 90,
      top: 10,
      width: 40,
    });
    setRect(floating, {
      bottom: 0,
      height: 40,
      left: 0,
      right: 0,
      top: 0,
      width: 80,
    });
    triggerPositionUpdate();

    await waitFor(() => {
      expect(floating.getAttribute('data-placement')).toBe('bottom');
      expect(floating.style.top).toBe('34px');
    });
  });

  it('shifts the floating element to stay in viewport bounds', async () => {
    render(
      <TestHarness options={{ boundaryPadding: 8, placement: 'bottom-end' }} />
    );

    const anchor = screen.getByTestId('anchor');
    const floating = screen.getByTestId('floating');

    setRect(anchor, {
      bottom: 80,
      height: 20,
      left: 10,
      right: 40,
      top: 60,
      width: 30,
    });
    setRect(floating, {
      bottom: 0,
      height: 30,
      left: 0,
      right: 0,
      top: 0,
      width: 120,
    });
    triggerPositionUpdate();

    await waitFor(() => {
      expect(floating.style.left).toBe('8px');
    });
  });

  it('supports matching trigger width', async () => {
    render(<TestHarness options={{ matchTriggerWidth: true }} />);

    const anchor = screen.getByTestId('anchor');
    const floating = screen.getByTestId('floating');

    setRect(anchor, {
      bottom: 200,
      height: 40,
      left: 160,
      right: 260,
      top: 160,
      width: 100,
    });
    setRect(floating, {
      bottom: 0,
      height: 32,
      left: 0,
      right: 0,
      top: 0,
      width: 40,
    });
    triggerPositionUpdate();

    await waitFor(() => {
      expect(floating.style.width).toBe('100px');
    });
  });

  it('returns arrow placement style using provided arrow ref', async () => {
    const arrowRef = { current: null as HTMLElement | null };

    const ArrowHarness = ({ placement = 'right' as Placement }) => {
      const { anchorRef, arrowStyle, floatingRef } = useAnchoredPosition({
        arrowRef,
        open: true,
        placement,
      });

      return (
        <>
          <div data-testid="anchor" ref={anchorRef} />
          <div data-testid="floating" ref={floatingRef}>
            <div
              data-testid="arrow"
              ref={(node) => (arrowRef.current = node)}
              style={arrowStyle}
            />
          </div>
        </>
      );
    };

    render(<ArrowHarness />);

    const anchor = screen.getByTestId('anchor');
    const floating = screen.getByTestId('floating');
    const arrow = screen.getByTestId('arrow');

    setRect(anchor, {
      bottom: 220,
      height: 40,
      left: 100,
      right: 180,
      top: 180,
      width: 80,
    });
    setRect(floating, {
      bottom: 0,
      height: 80,
      left: 0,
      right: 0,
      top: 0,
      width: 120,
    });
    setRect(arrow, {
      bottom: 0,
      height: 10,
      left: 0,
      right: 0,
      top: 0,
      width: 10,
    });
    triggerPositionUpdate();

    await waitFor(() => {
      expect(arrow.style.left).toBe('-5px');
      expect(arrow.style.top).not.toBe('');
    });
  });

  it('uses absolute coordinates when strategy is absolute', async () => {
    const scrollXSpy = vi.spyOn(window, 'scrollX', 'get').mockReturnValue(50);
    const scrollYSpy = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(80);

    render(<TestHarness options={{ strategy: 'absolute' }} />);

    const anchor = screen.getByTestId('anchor');
    const floating = screen.getByTestId('floating');

    setRect(anchor, {
      bottom: 120,
      height: 20,
      left: 100,
      right: 160,
      top: 100,
      width: 60,
    });
    setRect(floating, {
      bottom: 0,
      height: 20,
      left: 0,
      right: 0,
      top: 0,
      width: 80,
    });
    triggerPositionUpdate();

    await waitFor(() => {
      expect(floating.style.position).toBe('absolute');
      expect(floating.style.left).toBe('140px');
      expect(floating.style.top).toBe('152px');
    });

    scrollXSpy.mockRestore();
    scrollYSpy.mockRestore();
  });
});
