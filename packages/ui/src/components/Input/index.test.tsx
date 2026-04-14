import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import styles from './Input.module.scss';
import { Input } from './index';

describe('Input', () => {
  it('renders a textbox with the provided accessible name', () => {
    render(
      <label htmlFor="email-input">
        Email
        <Input id="email-input" />
      </label>
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('forwards native input props', () => {
    render(
      <Input disabled name="email" placeholder="Email address" type="email" />
    );

    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('placeholder', 'Email address');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('applies default classes', () => {
    render(<Input aria-label="Default input" />);

    const input = screen.getByRole('textbox', { name: 'Default input' });
    const wrapper = input.parentElement;

    expect(wrapper).toHaveClass(styles.container);
    expect(wrapper).toHaveClass(styles.medium);
    expect(wrapper).toHaveClass(styles.none);
    expect(wrapper).toHaveClass(styles.fullWidth);
  });

  it.each([
    ['small', styles.small],
    ['medium', styles.medium],
    ['large', styles.large],
  ] as const)('applies the %s size class', (size, className) => {
    render(<Input aria-label="Sized input" size={size} />);

    expect(
      screen.getByRole('textbox', { name: 'Sized input' }).parentElement
    ).toHaveClass(className);
  });

  it.each([
    ['none', styles.none],
    ['invalid', styles.invalid],
    ['valid', styles.valid],
    ['warning', styles.warning],
  ] as const)(
    'applies the %s validation state class',
    (validationState, className) => {
      render(
        <Input
          aria-label="Validation input"
          validationState={validationState}
        />
      );

      expect(
        screen.getByRole('textbox', { name: 'Validation input' }).parentElement
      ).toHaveClass(className);
    }
  );

  it('allows turning off fullWidth', () => {
    render(<Input aria-label="Inline input" fullWidth={false} />);

    expect(
      screen.getByRole('textbox', { name: 'Inline input' }).parentElement
    ).not.toHaveClass(styles.fullWidth);
  });

  it('renders adornments and keeps them in dedicated slots', () => {
    render(
      <Input
        aria-label="Search"
        endAdornment={<span data-testid="end">.com</span>}
        startAdornment={
          <svg aria-hidden="true" data-testid="start" viewBox="0 0 16 16" />
        }
      />
    );

    const input = screen.getByRole('textbox', { name: 'Search' });
    const wrapper = input.parentElement;

    expect(wrapper).toContainElement(screen.getByTestId('start'));
    expect(wrapper).toContainElement(screen.getByTestId('end'));
    expect(wrapper).toHaveClass(styles.withStartAdornment);
    expect(wrapper).toHaveClass(styles.withEndAdornment);
    expect(wrapper).not.toHaveClass(styles.withStartAdornmentInteractive);
    expect(wrapper).not.toHaveClass(styles.withEndAdornmentInteractive);
    expect(screen.getByTestId('start').parentElement).toHaveClass(
      styles.adornment
    );
    expect(screen.getByTestId('end').parentElement).toHaveClass(
      styles.adornment
    );
  });

  it('does not mark adornment edge classes for null adornments', () => {
    render(
      <Input
        aria-label="Null adornments"
        endAdornment={null}
        startAdornment={null}
      />
    );

    const wrapper = screen.getByRole('textbox', {
      name: 'Null adornments',
    }).parentElement;

    expect(wrapper).not.toHaveClass(styles.withStartAdornment);
    expect(wrapper).not.toHaveClass(styles.withEndAdornment);
    expect(wrapper).not.toHaveClass(styles.withStartAdornmentInteractive);
    expect(wrapper).not.toHaveClass(styles.withEndAdornmentInteractive);
  });

  it('uses interactive adornment spacing when adornment content is interactive', () => {
    render(
      <Input
        aria-label="Interactive adornments"
        endAdornment={
          <button data-testid="end-button" type="button">
            Go
          </button>
        }
        startAdornment={
          <a data-testid="start-link" href="/docs">
            Docs
          </a>
        }
      />
    );

    const wrapper = screen.getByRole('textbox', {
      name: 'Interactive adornments',
    }).parentElement;

    expect(wrapper).toHaveClass(styles.withStartAdornment);
    expect(wrapper).toHaveClass(styles.withEndAdornment);
    expect(wrapper).toHaveClass(styles.withStartAdornmentInteractive);
    expect(wrapper).toHaveClass(styles.withEndAdornmentInteractive);
  });

  it('applies className to wrapper and inputClassName to the native input', () => {
    render(
      <Input
        aria-label="Classed input"
        className="wrapper"
        inputClassName="native-input"
      />
    );

    const input = screen.getByRole('textbox', { name: 'Classed input' });

    expect(input.parentElement).toHaveClass('wrapper');
    expect(input).toHaveClass('native-input');
  });

  it('forwards refs to the native input', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input aria-label="Focusable input" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(
      screen.getByRole('textbox', { name: 'Focusable input' })
    );
  });

  it('derives aria-invalid from validationState for invalid and valid', () => {
    const { rerender } = render(
      <Input aria-label="Validation aria" validationState="invalid" />
    );

    expect(
      screen.getByRole('textbox', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'true');

    rerender(<Input aria-label="Validation aria" validationState="valid" />);

    expect(
      screen.getByRole('textbox', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not set aria-invalid for warning or none by default', () => {
    const { rerender } = render(
      <Input aria-label="Warning aria" validationState="warning" />
    );

    expect(
      screen.getByRole('textbox', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');

    rerender(<Input aria-label="Warning aria" validationState="none" />);

    expect(
      screen.getByRole('textbox', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');
  });

  it('preserves caller-provided aria-invalid', () => {
    render(
      <Input
        aria-invalid={false}
        aria-label="Explicit aria"
        validationState="invalid"
      />
    );

    expect(
      screen.getByRole('textbox', { name: 'Explicit aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('has no accessibility violations for representative states', async () => {
    const { container, rerender } = render(
      <Input aria-label="Accessible input" />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(<Input aria-label="Accessible input" validationState="invalid" />);
    expect(await axe(container)).toHaveNoViolations();

    rerender(<Input aria-label="Accessible input" validationState="warning" />);
    expect(await axe(container)).toHaveNoViolations();

    rerender(<Input aria-label="Accessible input" validationState="valid" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
