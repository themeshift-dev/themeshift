import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '@/components/Checkbox';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';

import { Field } from './index';
import styles from './Field.module.scss';

describe('Field', () => {
  it('exposes the compound API members', () => {
    expect(Field.Label).toBeDefined();
    expect(Field.Description).toBeDefined();
    expect(Field.Error).toBeDefined();
  });

  it('renders shorthand label, description, and error around children', () => {
    render(
      <Field
        description="We only use this for account updates."
        error="Enter a valid email address."
        label="Email"
        validationState="invalid"
      >
        <Input />
      </Field>
    );

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription(
      'We only use this for account updates. Enter a valid email address.'
    );
  });

  it('supports fully composable usage', () => {
    render(
      <Field validationState="invalid">
        <Field.Label>Username</Field.Label>
        <Input />
        <Field.Description>Use your work username.</Field.Description>
        <Field.Error forceMount>This username is taken.</Field.Error>
      </Field>
    );

    expect(
      screen.getByRole('textbox', { name: 'Username' })
    ).toBeInTheDocument();
    expect(screen.getByText('Use your work username.')).toBeInTheDocument();
    expect(screen.getByText('This username is taken.')).toBeInTheDocument();
  });

  it('uses a stable custom id when provided', () => {
    render(
      <Field id="email-field" label="Email">
        <Input />
      </Field>
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    const label = screen.getByText('Email').closest('label');

    expect(input).toHaveAttribute('id', 'email-field-control');
    expect(label).toHaveAttribute('for', 'email-field-control');
  });

  it('renders required and optional indicators from shared state', () => {
    const { rerender } = render(
      <Field label="Email" required>
        <Input />
      </Field>
    );

    expect(screen.getByText('*')).toBeInTheDocument();

    rerender(
      <Field label="Company" optional>
        <Input />
      </Field>
    );

    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('hides label visually when hideLabel is set', () => {
    render(
      <Field hideLabel label="Secret code">
        <Input />
      </Field>
    );

    expect(
      screen.getByRole('textbox', { name: 'Secret code' })
    ).toBeInTheDocument();
  });

  it('renders FieldError only when invalid unless forceMount is true', () => {
    const { rerender } = render(
      <Field validationState="none">
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error>Hidden error</Field.Error>
      </Field>
    );

    expect(screen.queryByText('Hidden error')).not.toBeInTheDocument();

    rerender(
      <Field validationState="none">
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error forceMount>Visible error</Field.Error>
      </Field>
    );

    expect(screen.getByText('Visible error')).toBeInTheDocument();

    rerender(
      <Field validationState="invalid">
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error>Invalid email</Field.Error>
      </Field>
    );

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('uses non-aggressive default role for FieldError and allows overrides', () => {
    const { rerender } = render(
      <Field validationState="invalid">
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error>Status role</Field.Error>
      </Field>
    );

    expect(screen.getByText('Status role')).toHaveAttribute('role', 'status');

    rerender(
      <Field validationState="invalid">
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error role="alert">Alert role</Field.Error>
      </Field>
    );

    expect(screen.getByText('Alert role')).toHaveAttribute('role', 'alert');
  });

  it('warns and renders fallback markup for subcomponents outside Field', () => {
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    render(
      <>
        <Field.Label>Outside label</Field.Label>
        <Field.Description>Outside description</Field.Description>
        <Field.Error forceMount>Outside error</Field.Error>
      </>
    );

    expect(screen.getByText('Outside label')).toBeInTheDocument();
    expect(screen.getByText('Outside description')).toBeInTheDocument();
    expect(screen.getByText('Outside error')).toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('passes shared context defaults to Input and Textarea', () => {
    render(
      <>
        <Field
          description="Input helper"
          error="Input error"
          label="Email"
          required
          validationState="invalid"
        >
          <Input />
        </Field>

        <Field
          description="Textarea helper"
          error="Textarea error"
          label="Message"
          readOnly
          validationState="invalid"
        >
          <Textarea />
        </Field>
      </>
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Input helper Input error');

    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription(
      'Textarea helper Textarea error'
    );
  });

  it('renders inline-control shorthand with checkbox semantics', () => {
    render(
      <Field
        description="We only send important updates."
        label="Enable notifications"
        layout="inline-control"
      >
        <Checkbox />
      </Field>
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Enable notifications',
    });
    const container = checkbox.closest(`.${styles.container}`);
    const inlineContent = screen
      .getByText('Enable notifications')
      .closest(`.${styles.inlineContent}`);

    expect(container).toHaveAttribute('data-layout', 'inline-control');
    expect(container).toHaveAttribute('data-align', 'start');
    expect(inlineContent).toHaveClass(styles.inlineContent);
    expect(checkbox).toHaveAccessibleDescription(
      'We only send important updates.'
    );
  });

  it('supports composable inline-control layout and alignment', () => {
    render(
      <Field align="center" layout="inline-control" validationState="invalid">
        <Checkbox required />
        <div>
          <Field.Label>I agree to the terms</Field.Label>
          <Field.Error>You must accept the terms to continue.</Field.Error>
        </div>
      </Field>
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'I agree to the terms',
    });
    const container = checkbox.closest(`.${styles.container}`);

    expect(container).toHaveAttribute('data-layout', 'inline-control');
    expect(container).toHaveAttribute('data-align', 'center');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('You must accept the terms to continue.')
    ).toBeInTheDocument();
  });

  it('has no accessibility violations for representative shorthand and composable renders', async () => {
    const { container, rerender } = render(
      <Field
        description="Shown below the control"
        label="Email"
        validationState="none"
      >
        <Input />
      </Field>
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Field validationState="invalid">
        <Field.Label>Message</Field.Label>
        <Textarea />
        <Field.Description>Keep this concise.</Field.Description>
        <Field.Error forceMount>A message is required.</Field.Error>
      </Field>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
