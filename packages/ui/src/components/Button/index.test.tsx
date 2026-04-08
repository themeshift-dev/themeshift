import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import styles from './Button.module.scss';
import { Button } from './index';

describe('Button', () => {
  it('renders a button with the provided accessible name', () => {
    render(<Button>Save changes</Button>);

    expect(
      screen.getByRole('button', { name: 'Save changes' }),
    ).toBeInTheDocument();
  });

  it('forwards native button props', () => {
    render(
      <Button type="submit" disabled>
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit' });

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
  });

  it('applies default size and intent styles', () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole('button', { name: 'Default' });

    expect(button).toHaveClass(styles.container);
    expect(button).toHaveClass(styles.medium);
    expect(button).toHaveClass(styles.primary);
  });

  it.each([
    ['small', styles.small],
    ['medium', styles.medium],
    ['large', styles.large],
  ] as const)('applies the %s size class', (size, className) => {
    render(<Button size={size}>Sized</Button>);

    expect(screen.getByRole('button', { name: 'Sized' })).toHaveClass(className);
  });

  it.each([
    ['primary', styles.primary],
    ['secondary', styles.secondary],
    ['tertiary', styles.tertiary],
    ['constructive', styles.constructive],
    ['destructive', styles.destructive],
  ] as const)('applies the %s intent class', (intent, className) => {
    render(<Button intent={intent}>Intent</Button>);

    expect(screen.getByRole('button', { name: 'Intent' })).toHaveClass(className);
  });

  it('appends a caller-provided className', () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'custom-class',
    );
  });

  it('applies the visually disabled style without native disabled semantics', () => {
    render(<Button visuallyDisabled>Visually disabled</Button>);

    const button = screen.getByRole('button', { name: 'Visually disabled' });

    expect(button).toHaveClass(styles.visuallyDisabled);
    expect(button).not.toBeDisabled();
  });

  it('fires onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when natively disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Cannot click
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Cannot click' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('remains interactive when visuallyDisabled is set', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button visuallyDisabled onClick={onClick}>
        Still interactive
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Still interactive' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations for representative variants', async () => {
    const { container, rerender } = render(<Button>Accessible button</Button>);

    expect(await axe(container)).toHaveNoViolations();

    rerender(<Button intent="secondary">Secondary button</Button>);
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Button disabled intent="destructive">
        Disabled destructive button
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
