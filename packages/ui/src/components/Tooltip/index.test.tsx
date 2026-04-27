import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from './index';

function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

describe('Tooltip', () => {
  it('exposes compound members', () => {
    expect(Tooltip.Root).toBeDefined();
    expect(Tooltip.Trigger).toBeDefined();
    expect(Tooltip.Content).toBeDefined();
    expect(Tooltip.Arrow).toBeDefined();
    expect(Tooltip.Provider).toBeDefined();
  });

  it('opens on hover after delay and closes after closeDelay', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Delete project" delay={40} closeDelay={30}>
        <button type="button">Delete</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Delete' });

    await user.hover(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Delete project');
    });

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('opens on focus after delay and closes on blur', async () => {
    render(
      <Tooltip content="Focused tooltip" delay={30}>
        <button type="button">Focusable trigger</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Focusable trigger' });

    trigger.focus();

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    trigger.blur();

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('keeps tooltip visible when pointer enters content before close delay', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Hoverable tooltip" closeDelay={80} delay={0}>
        <button type="button">Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Hover me' });

    await user.hover(trigger);
    const content = await screen.findByRole('tooltip');

    await user.unhover(trigger);
    await user.hover(content);
    await wait(120);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(content);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('wires aria-describedby and role/id semantics', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Aria tooltip" delay={0} id="tooltip-id">
        <button type="button">Aria trigger</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Aria trigger' });

    expect(trigger).not.toHaveAttribute('aria-describedby');

    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');

    expect(tooltip).toHaveAttribute('id', 'tooltip-id');
    expect(trigger).toHaveAttribute('aria-describedby', 'tooltip-id');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Esc tooltip" delay={0}>
        <button type="button">Esc trigger</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Esc trigger' }));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('supports controlled mode', async () => {
    const ControlledTooltip = () => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button onClick={() => setOpen((value) => !value)} type="button">
            Toggle
          </button>
          <Tooltip
            content="Controlled tooltip"
            delay={0}
            open={open}
            onOpenChange={setOpen}
          >
            <button type="button">Controlled trigger</button>
          </Tooltip>
        </>
      );
    };

    const user = userEvent.setup();
    render(<ControlledTooltip />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('supports provider skip-delay behavior for nearby tooltips', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delay={60} skipDelayDuration={300}>
        <Tooltip content="One">
          <button type="button">Trigger one</button>
        </Tooltip>
        <Tooltip content="Two">
          <button type="button">Trigger two</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const one = screen.getByRole('button', { name: 'Trigger one' });
    const two = screen.getByRole('button', { name: 'Trigger two' });

    await user.hover(one);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('One');

    await user.unhover(one);
    await user.hover(two);

    await waitFor(() => {
      expect(
        screen
          .getAllByRole('tooltip')
          .some((tooltipElement) => tooltipElement.textContent?.includes('Two'))
      ).toBe(true);
    });
  });

  it('keeps provider skip-delay active across chained trigger hovers', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider closeDelay={80} delay={250} skipDelayDuration={500}>
        <Tooltip content="Bold">
          <button type="button">B</button>
        </Tooltip>
        <Tooltip content="Italic">
          <button type="button">I</button>
        </Tooltip>
        <Tooltip content="Underline">
          <button type="button">U</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const bTrigger = screen.getByRole('button', { name: 'B' });
    const iTrigger = screen.getByRole('button', { name: 'I' });
    const uTrigger = screen.getByRole('button', { name: 'U' });

    await user.hover(bTrigger);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Bold');

    await user.unhover(bTrigger);
    await user.hover(iTrigger);

    await waitFor(() => {
      expect(
        screen
          .getAllByRole('tooltip')
          .some((tooltipElement) =>
            tooltipElement.textContent?.includes('Italic')
          )
      ).toBe(true);
    });

    await user.unhover(iTrigger);
    await user.hover(uTrigger);

    await waitFor(() => {
      expect(
        screen
          .getAllByRole('tooltip')
          .some((tooltipElement) =>
            tooltipElement.textContent?.includes('Underline')
          )
      ).toBe(true);
    });
  });

  it('keeps provider skip-delay active after a long first hover', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider closeDelay={80} delay={250} skipDelayDuration={300}>
        <Tooltip content="Bold">
          <button type="button">B</button>
        </Tooltip>
        <Tooltip content="Italic">
          <button type="button">I</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const bTrigger = screen.getByRole('button', { name: 'B' });
    const iTrigger = screen.getByRole('button', { name: 'I' });

    await user.hover(bTrigger);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Bold');

    await wait(450);

    await user.unhover(bTrigger);
    await user.hover(iTrigger);

    await waitFor(() => {
      expect(
        screen
          .getAllByRole('tooltip')
          .some((tooltipElement) =>
            tooltipElement.textContent?.includes('Italic')
          )
      ).toBe(true);
    });
  });

  it('keeps provider skip-delay active while another tooltip remains open', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider closeDelay={80} delay={250} skipDelayDuration={300}>
        <Tooltip content="Bold">
          <button type="button">B</button>
        </Tooltip>
        <Tooltip content="Italic">
          <button type="button">I</button>
        </Tooltip>
        <Tooltip content="Underline">
          <button type="button">U</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const bTrigger = screen.getByRole('button', { name: 'B' });
    const iTrigger = screen.getByRole('button', { name: 'I' });
    const uTrigger = screen.getByRole('button', { name: 'U' });

    await user.hover(bTrigger);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Bold');

    await user.unhover(bTrigger);
    await user.hover(iTrigger);

    await waitFor(() => {
      expect(
        screen
          .getAllByRole('tooltip')
          .some((tooltipElement) =>
            tooltipElement.textContent?.includes('Italic')
          )
      ).toBe(true);
    });

    await wait(420);

    await user.unhover(iTrigger);
    await user.hover(uTrigger);

    await waitFor(
      () => {
        expect(
          screen
            .getAllByRole('tooltip')
            .some((tooltipElement) =>
              tooltipElement.textContent?.includes('Underline')
            )
        ).toBe(true);
      },
      { timeout: 100 }
    );
  });

  it('supports portal={false}', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <div data-testid="local-container">
        <Tooltip content="Local tooltip" delay={0} portal={false}>
          <button type="button">Local trigger</button>
        </Tooltip>
      </div>
    );

    await user.hover(screen.getByRole('button', { name: 'Local trigger' }));

    const tooltip = await screen.findByRole('tooltip');

    expect(container).toContainElement(tooltip);
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Disabled tooltip" delay={0} disabled>
        <button type="button">Disabled trigger</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Disabled trigger' }));
    await wait(80);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('has no accessibility violations for a simple render', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Tooltip content="Accessible tooltip" delay={0}>
        <button type="button">Accessibility trigger</button>
      </Tooltip>
    );

    await user.hover(
      screen.getByRole('button', { name: 'Accessibility trigger' })
    );

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
