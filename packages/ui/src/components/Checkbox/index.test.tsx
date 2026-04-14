import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Field } from '@/components/Field';

import styles from './Checkbox.module.scss';
import { Checkbox } from './index';

describe('Checkbox', () => {
  it('renders a checkbox with the provided accessible name', () => {
    render(
      <label htmlFor="checkbox">
        Accept terms
        <Checkbox id="checkbox" />
      </label>
    );

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' })
    ).toBeInTheDocument();
  });

  it('forwards native checkbox props', () => {
    render(<Checkbox defaultChecked disabled name="terms" required />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('name', 'terms');
    expect(checkbox).toHaveAttribute('required');
  });

  it('toggles checked state when clicked', async () => {
    const user = userEvent.setup();

    render(<Checkbox aria-label="Toggle checkbox" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Toggle checkbox' });

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('applies default classes', () => {
    render(<Checkbox aria-label="Default checkbox" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Default checkbox' });
    const wrapper = checkbox.closest(`.${styles.container}`);

    expect(wrapper).toHaveClass(styles.container);
    expect(wrapper).toHaveClass(styles.medium);
    expect(wrapper).toHaveClass(styles.none);
    expect(wrapper).not.toHaveClass(styles.fullWidth);
    expect(checkbox).toHaveClass(styles.input);
  });

  it.each([
    ['small', styles.small],
    ['medium', styles.medium],
    ['large', styles.large],
  ] as const)('applies the %s size class', (size, className) => {
    render(<Checkbox aria-label="Sized checkbox" size={size} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Sized checkbox' });

    expect(checkbox.closest(`.${styles.container}`)).toHaveClass(className);
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
        <Checkbox
          aria-label="Validation checkbox"
          validationState={validationState}
        />
      );

      const checkbox = screen.getByRole('checkbox', {
        name: 'Validation checkbox',
      });

      expect(checkbox.closest(`.${styles.container}`)).toHaveClass(className);
    }
  );

  it('allows turning on fullWidth', () => {
    render(<Checkbox aria-label="Full width checkbox" fullWidth />);

    const checkbox = screen.getByRole('checkbox', {
      name: 'Full width checkbox',
    });

    expect(checkbox.closest(`.${styles.container}`)).toHaveClass(
      styles.fullWidth
    );
  });

  it('forwards refs to the native input', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Checkbox aria-label="Focusable checkbox" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(
      screen.getByRole('checkbox', { name: 'Focusable checkbox' })
    );
  });

  it('sets indeterminate state via JS and exposes mixed aria state by default', () => {
    render(<Checkbox aria-label="Mixed checkbox" indeterminate />);

    const checkbox = screen.getByRole('checkbox', {
      name: 'Mixed checkbox',
    }) as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
  });

  it('preserves caller-provided aria-checked when indeterminate is set', () => {
    render(
      <Checkbox
        aria-checked="false"
        aria-label="Explicit aria checked"
        indeterminate
      />
    );

    expect(
      screen.getByRole('checkbox', { name: 'Explicit aria checked' })
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('derives aria-invalid from validationState for invalid and valid', () => {
    const { rerender } = render(
      <Checkbox aria-label="Validation aria" validationState="invalid" />
    );

    expect(
      screen.getByRole('checkbox', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'true');

    rerender(<Checkbox aria-label="Validation aria" validationState="valid" />);

    expect(
      screen.getByRole('checkbox', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not set aria-invalid for warning or none by default', () => {
    const { rerender } = render(
      <Checkbox aria-label="Warning aria" validationState="warning" />
    );

    expect(
      screen.getByRole('checkbox', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');

    rerender(<Checkbox aria-label="Warning aria" validationState="none" />);

    expect(
      screen.getByRole('checkbox', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');
  });

  it('preserves caller-provided aria-invalid', () => {
    render(
      <Checkbox
        aria-invalid={false}
        aria-label="Explicit aria"
        validationState="invalid"
      />
    );

    expect(
      screen.getByRole('checkbox', { name: 'Explicit aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('uses Field defaults for ids and shared accessibility wiring', () => {
    render(
      <Field
        description="Field description"
        error="Field error"
        id="terms-field"
        label="Accept terms"
        required
        validationState="invalid"
      >
        <Checkbox />
      </Field>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    expect(checkbox).toHaveAttribute('id', 'terms-field-control');
    expect(checkbox).toHaveAttribute('required');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('terms-field-description')
    );
    expect(checkbox).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('terms-field-error')
    );
  });

  it('lets explicit Checkbox props override Field defaults', () => {
    render(
      <Field disabled label="Accept terms" required validationState="invalid">
        <Checkbox
          aria-invalid={false}
          disabled={false}
          required={false}
          validationState="valid"
        />
      </Field>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    expect(checkbox).not.toBeDisabled();
    expect(checkbox).not.toHaveAttribute('required');
    expect(checkbox).toHaveAttribute('aria-invalid', 'false');
    expect(checkbox.closest(`.${styles.container}`)).toHaveClass(styles.valid);
  });

  it('has no accessibility violations for representative states', async () => {
    const { container, rerender } = render(
      <Checkbox aria-label="Accessible checkbox" />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Checkbox aria-label="Accessible checkbox" validationState="invalid" />
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Checkbox aria-label="Accessible checkbox" validationState="warning" />
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Checkbox aria-label="Accessible checkbox" validationState="valid" />
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(<Checkbox aria-label="Accessible checkbox" indeterminate />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
