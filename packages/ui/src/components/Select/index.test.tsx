import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Field } from '@/components/Field';

import styles from './Select.module.scss';
import { Select } from './index';

describe('Select', () => {
  it('renders a select with the provided accessible name', () => {
    render(
      <label htmlFor="country-select">
        Country
        <Select id="country-select">
          <option value="">Choose one</option>
          <option value="ca">Canada</option>
        </Select>
      </label>
    );

    expect(
      screen.getByRole('combobox', { name: 'Country' })
    ).toBeInTheDocument();
  });

  it('forwards native select props', () => {
    render(
      <Select disabled name="country" required>
        <option value="">Choose one</option>
        <option value="ca">Canada</option>
      </Select>
    );

    const select = screen.getByRole('combobox');

    expect(select).toBeDisabled();
    expect(select).toHaveAttribute('name', 'country');
    expect(select).toHaveAttribute('required');
  });

  it('applies default classes', () => {
    render(
      <Select aria-label="Country">
        <option value="">Choose one</option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Country' });
    const wrapper = select.parentElement;

    expect(select).toHaveClass(styles.select);
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
    render(
      <Select aria-label="Sized select" size={size}>
        <option value="">Choose one</option>
      </Select>
    );

    expect(
      screen.getByRole('combobox', { name: 'Sized select' }).parentElement
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
        <Select
          aria-label="Validation select"
          validationState={validationState}
        >
          <option value="">Choose one</option>
        </Select>
      );

      expect(
        screen.getByRole('combobox', { name: 'Validation select' })
          .parentElement
      ).toHaveClass(className);
    }
  );

  it('allows turning off fullWidth', () => {
    render(
      <Select aria-label="Inline select" fullWidth={false}>
        <option value="">Choose one</option>
      </Select>
    );

    expect(
      screen.getByRole('combobox', { name: 'Inline select' }).parentElement
    ).not.toHaveClass(styles.fullWidth);
  });

  it('renders default chevron icon', () => {
    render(
      <Select aria-label="Chevron select">
        <option value="">Choose one</option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Chevron select' });
    const wrapper = select.parentElement;

    expect(wrapper?.querySelector(`.${styles.chevron}`)).toBeInTheDocument();
    expect(
      wrapper?.querySelector(`.${styles.chevron} svg`)
    ).toBeInTheDocument();
  });

  it('supports custom chevron icon and class name', () => {
    render(
      <Select
        aria-label="Custom chevron"
        chevronClassName="custom-chevron"
        chevronIcon={<span data-testid="custom-chevron">v</span>}
      >
        <option value="">Choose one</option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Custom chevron' });
    const wrapper = select.parentElement;

    expect(wrapper?.querySelector('.custom-chevron')).toBeInTheDocument();
    expect(screen.getByTestId('custom-chevron')).toBeInTheDocument();
  });

  it('renders options from the options prop', () => {
    render(
      <Select
        aria-label="Options select"
        options={[
          { label: 'Canada', value: 'ca' },
          { label: 'United States', value: 'us' },
        ]}
      />
    );

    expect(screen.getByRole('option', { name: 'Canada' })).toHaveValue('ca');
    expect(screen.getByRole('option', { name: 'United States' })).toHaveValue(
      'us'
    );
  });

  it('prioritizes options over children when both are provided', () => {
    render(
      <Select
        aria-label="Options precedence"
        options={[{ label: 'Canada', value: 'ca' }]}
      >
        <option value="child">Child option</option>
      </Select>
    );

    expect(
      screen.queryByRole('option', { name: 'Child option' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument();
  });

  it('renders placeholder as a disabled empty option', () => {
    render(
      <Select aria-label="Placeholder select" placeholder="Choose a country">
        <option value="ca">Canada</option>
      </Select>
    );

    const option = screen.getByRole('option', { name: 'Choose a country' });

    expect(option).toHaveValue('');
    expect(option).toBeDisabled();
  });

  it('forwards refs to the native select', () => {
    const ref = createRef<HTMLSelectElement>();

    render(
      <Select aria-label="Ref select" ref={ref}>
        <option value="">Choose one</option>
      </Select>
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current).toBe(
      screen.getByRole('combobox', { name: 'Ref select' })
    );
  });

  it('derives aria-invalid from validationState for invalid and valid', () => {
    const { rerender } = render(
      <Select aria-label="Validation aria" validationState="invalid">
        <option value="">Choose one</option>
      </Select>
    );

    expect(
      screen.getByRole('combobox', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'true');

    rerender(
      <Select aria-label="Validation aria" validationState="valid">
        <option value="">Choose one</option>
      </Select>
    );

    expect(
      screen.getByRole('combobox', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not set aria-invalid for warning or none by default', () => {
    const { rerender } = render(
      <Select aria-label="Warning aria" validationState="warning">
        <option value="">Choose one</option>
      </Select>
    );

    expect(
      screen.getByRole('combobox', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');

    rerender(
      <Select aria-label="Warning aria" validationState="none">
        <option value="">Choose one</option>
      </Select>
    );

    expect(
      screen.getByRole('combobox', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');
  });

  it('preserves caller-provided aria-invalid', () => {
    render(
      <Select
        aria-invalid={false}
        aria-label="Explicit aria"
        validationState="invalid"
      >
        <option value="">Choose one</option>
      </Select>
    );

    expect(
      screen.getByRole('combobox', { name: 'Explicit aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('uses Field defaults for ids and shared accessibility wiring', () => {
    render(
      <Field
        description="Field description"
        error="Field error"
        id="country-field"
        label="Country"
        required
        validationState="invalid"
      >
        <Select>
          <option value="">Choose one</option>
          <option value="ca">Canada</option>
        </Select>
      </Field>
    );

    const select = screen.getByRole('combobox', { name: 'Country' });

    expect(select).toHaveAttribute('id', 'country-field-control');
    expect(select).toHaveAttribute('required');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('country-field-description')
    );
    expect(select).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('country-field-error')
    );
  });

  it('lets explicit Select props override Field defaults', () => {
    render(
      <Field disabled label="Country" required validationState="invalid">
        <Select
          aria-invalid={false}
          disabled={false}
          required={false}
          validationState="valid"
        >
          <option value="">Choose one</option>
        </Select>
      </Field>
    );

    const select = screen.getByRole('combobox', { name: 'Country' });

    expect(select).not.toBeDisabled();
    expect(select).not.toHaveAttribute('required');
    expect(select).toHaveAttribute('aria-invalid', 'false');
    expect(select.parentElement).toHaveClass(styles.valid);
  });

  it('does not adopt readOnly from Field context', () => {
    render(
      <Field label="Country" readOnly>
        <Select>
          <option value="">Choose one</option>
        </Select>
      </Field>
    );

    expect(
      screen.getByRole('combobox', { name: 'Country' })
    ).not.toHaveAttribute('readonly');
  });

  it('has no accessibility violations for representative states', async () => {
    const { container, rerender } = render(
      <Select aria-label="Accessible select">
        <option value="">Choose one</option>
      </Select>
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Select aria-label="Accessible select" validationState="invalid">
        <option value="">Choose one</option>
      </Select>
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Select aria-label="Accessible select" validationState="warning">
        <option value="">Choose one</option>
      </Select>
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Select aria-label="Accessible select" validationState="valid">
        <option value="">Choose one</option>
      </Select>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
