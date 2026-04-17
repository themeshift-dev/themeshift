import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Field } from '@/components/Field';

import { Radio } from './index';

describe('Radio', () => {
  it('exposes the compound API members', () => {
    expect(Radio.Group).toBeDefined();
  });

  it('supports uncontrolled usage with defaultValue', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Radio.Group
        defaultValue="email"
        name="contact-method"
        onValueChange={onValueChange}
      >
        <Radio value="email">Email</Radio>
        <Radio value="phone">Phone</Radio>
        <Radio value="sms">SMS</Radio>
      </Radio.Group>
    );

    const email = screen.getByRole('radio', { name: 'Email' });
    const phone = screen.getByRole('radio', { name: 'Phone' });

    expect(email).toBeChecked();
    expect(phone).not.toBeChecked();

    await user.click(phone);

    expect(onValueChange).toHaveBeenCalledWith('phone');
    expect(phone).toBeChecked();
  });

  it('supports controlled usage with value and onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { rerender } = render(
      <Radio.Group name="size" onValueChange={onValueChange} value="s">
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
        <Radio value="l">Large</Radio>
      </Radio.Group>
    );

    const small = screen.getByRole('radio', { name: 'Small' });
    const medium = screen.getByRole('radio', { name: 'Medium' });

    expect(small).toBeChecked();

    await user.click(medium);

    expect(onValueChange).toHaveBeenCalledWith('m');
    expect(small).toBeChecked();

    rerender(
      <Radio.Group name="size" onValueChange={onValueChange} value="m">
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
        <Radio value="l">Large</Radio>
      </Radio.Group>
    );

    expect(medium).toBeChecked();
  });

  it('propagates a shared name and generates a stable fallback name', () => {
    render(
      <Radio.Group>
        <Radio value="email">Email</Radio>
        <Radio value="phone">Phone</Radio>
      </Radio.Group>
    );

    const radios = screen.getAllByRole('radio');

    const groupName = radios[0]?.getAttribute('name');

    expect(groupName).toBeTruthy();
    expect(radios[1]).toHaveAttribute('name', groupName);
  });

  it('disables all options when the group is disabled and supports per-option disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { rerender } = render(
      <Radio.Group disabled name="size" onValueChange={onValueChange}>
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
      </Radio.Group>
    );

    const small = screen.getByRole('radio', { name: 'Small' });

    expect(small).toBeDisabled();
    await user.click(small);
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <Radio.Group name="size">
        <Radio disabled value="s">
          Small
        </Radio>
        <Radio value="m">Medium</Radio>
      </Radio.Group>
    );

    expect(screen.getByRole('radio', { name: 'Small' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Medium' })).not.toBeDisabled();
  });

  it('uses Field defaults for required, invalid, and shared aria-describedby wiring', async () => {
    render(
      <Field id="contact-field" required validationState="invalid">
        <Radio.Group name="contact-method">
          <Field.Label as="legend">Preferred contact method</Field.Label>

          <Radio value="email">Email</Radio>
          <Radio value="phone">Phone</Radio>
          <Radio value="sms">SMS</Radio>

          <Field.Description>
            Choose how you&apos;d like us to contact you.
          </Field.Description>
          <Field.Error>Please select a contact method.</Field.Error>
        </Radio.Group>
      </Field>
    );

    const email = screen.getByRole('radio', { name: 'Email' });

    expect(email).toHaveAttribute('required');
    expect(email).toHaveAttribute('aria-invalid', 'true');

    await waitFor(() => {
      expect(email).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('contact-field-description')
      );
      expect(email).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('contact-field-error')
      );
    });
  });

  it('has no obvious a11y violations', async () => {
    const { container } = render(
      <Radio.Group name="contact-method">
        <legend>Preferred contact method</legend>
        <Radio value="email">Email</Radio>
        <Radio value="phone">Phone</Radio>
      </Radio.Group>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports standalone radio onChange and preserves preventDefault semantics in groups', async () => {
    const user = userEvent.setup();
    const standaloneOnChange = vi.fn();
    const groupOnValueChange = vi.fn();

    render(
      <>
        <Radio
          aria-label="Standalone"
          name="standalone"
          onChange={standaloneOnChange}
          value="alone"
        >
          Standalone
        </Radio>

        <Radio.Group name="grouped" onValueChange={groupOnValueChange}>
          <Radio
            onChange={(event) => {
              event.preventDefault();
            }}
            value="blocked"
          >
            Blocked
          </Radio>
        </Radio.Group>
      </>
    );

    await user.click(screen.getByRole('radio', { name: 'Standalone' }));
    expect(standaloneOnChange).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('radio', { name: 'Blocked' }));
    expect(groupOnValueChange).not.toHaveBeenCalled();
  });

  it('derives aria-invalid false for valid groups', () => {
    render(
      <Radio.Group name="valid-group" validationState="valid">
        <Radio value="email">Email</Radio>
      </Radio.Group>
    );

    expect(screen.getByRole('radio', { name: 'Email' })).toHaveAttribute(
      'aria-invalid',
      'false'
    );
  });
});
