import { useRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { FocusLock } from './index';

describe('FocusLock', () => {
  it('traps forward and backward tab navigation when active', async () => {
    const user = userEvent.setup();
    const outsideRef = { current: null as HTMLButtonElement | null };

    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement | null>(null);

      return (
        <div>
          <button ref={(node) => (outsideRef.current = node)} type="button">
            Outside button
          </button>
          <div ref={containerRef}>
            <FocusLock active autoFocus={false} containerRef={containerRef}>
              <>
                <button type="button">First action</button>
                <button type="button">Second action</button>
              </>
            </FocusLock>
          </div>
        </div>
      );
    };

    render(<TestComponent />);

    const first = screen.getByRole('button', { name: 'First action' });
    const second = screen.getByRole('button', { name: 'Second action' });

    first.focus();
    await user.tab();
    expect(second).toHaveFocus();

    await user.tab();
    expect(first).toHaveFocus();

    await user.tab({ shift: true });
    expect(second).toHaveFocus();

    expect(outsideRef.current).not.toHaveFocus();
  });

  it('does not trap focus when inactive', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement | null>(null);

      return (
        <div>
          <button type="button">Outside button</button>
          <div ref={containerRef}>
            <FocusLock
              active={false}
              autoFocus={false}
              containerRef={containerRef}
            >
              <button type="button">Only lock action</button>
            </FocusLock>
          </div>
        </div>
      );
    };

    render(<TestComponent />);

    const onlyAction = screen.getByRole('button', { name: 'Only lock action' });
    const outside = screen.getByRole('button', { name: 'Outside button' });

    onlyAction.focus();
    await user.tab();

    expect(onlyAction).not.toHaveFocus();
    expect([outside, document.body]).toContain(document.activeElement);
  });

  it('autofocuses the first tabbable node when active', async () => {
    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement | null>(null);

      return (
        <div ref={containerRef}>
          <FocusLock active containerRef={containerRef}>
            <>
              <button type="button">First auto</button>
              <button type="button">Second auto</button>
            </>
          </FocusLock>
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'First auto' })).toHaveFocus();
    });
  });

  it('restores focus to the previously focused element when returnFocus is true', async () => {
    const user = userEvent.setup();

    const TestComponent = ({ active }: { active: boolean }) => {
      const containerRef = useRef<HTMLDivElement | null>(null);

      return (
        <div>
          <button type="button">Trigger</button>
          <div ref={containerRef}>
            <FocusLock
              active={active}
              autoFocus={false}
              containerRef={containerRef}
              returnFocus
            >
              <button type="button">Focusable content</button>
            </FocusLock>
          </div>
        </div>
      );
    };

    const { rerender } = render(<TestComponent active={false} />);
    const trigger = screen.getByRole('button', { name: 'Trigger' });

    await user.click(trigger);
    expect(trigger).toHaveFocus();

    rerender(<TestComponent active />);
    rerender(<TestComponent active={false} />);

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('prioritizes the most recently activated nested lock', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const outerRef = useRef<HTMLDivElement | null>(null);
      const innerRef = useRef<HTMLDivElement | null>(null);

      return (
        <div ref={outerRef}>
          <FocusLock active autoFocus={false} containerRef={outerRef}>
            <>
              <button type="button">Outer action</button>
              <div ref={innerRef}>
                <FocusLock active autoFocus={false} containerRef={innerRef}>
                  <>
                    <button type="button">Inner first</button>
                    <button type="button">Inner last</button>
                  </>
                </FocusLock>
              </div>
            </>
          </FocusLock>
        </div>
      );
    };

    render(<TestComponent />);

    const innerFirst = screen.getByRole('button', { name: 'Inner first' });
    const innerLast = screen.getByRole('button', { name: 'Inner last' });

    innerLast.focus();
    await user.tab();

    expect(innerFirst).toHaveFocus();
  });

  it('includes shard nodes in the focus cycle', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement | null>(null);
      const shardRef = useRef<HTMLDivElement | null>(null);

      return (
        <div>
          <div ref={containerRef}>
            <FocusLock
              active
              autoFocus={false}
              containerRef={containerRef}
              shards={[shardRef]}
            >
              <button type="button">Primary action</button>
            </FocusLock>
          </div>

          <div ref={shardRef}>
            <button type="button">Shard action</button>
          </div>

          <button type="button">Outside action</button>
        </div>
      );
    };

    render(<TestComponent />);

    const primary = screen.getByRole('button', { name: 'Primary action' });
    const shard = screen.getByRole('button', { name: 'Shard action' });

    shard.focus();
    await user.tab();

    expect(primary).toHaveFocus();
  });

  it('has no accessibility violations for an active lock render', async () => {
    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement | null>(null);

      return (
        <section aria-label="Menu dialog" ref={containerRef}>
          <FocusLock active containerRef={containerRef}>
            <>
              <button type="button">Close</button>
              <a href="/docs">Docs</a>
            </>
          </FocusLock>
        </section>
      );
    };

    const { container } = render(<TestComponent />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
