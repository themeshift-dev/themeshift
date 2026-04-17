import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useForm } from './index';

describe('useForm', () => {
  it('registers an uncontrolled input and gathers values on submit', async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();

    function Example() {
      const form = useForm<{ email: string }>({
        defaultValues: { email: '' },
      });

      return (
        <form onSubmit={form.handleSubmit(onValid)}>
          <input aria-label="Email" type="email" {...form.register('email')} />
          <button type="submit">Submit</button>
        </form>
      );
    }

    render(<Example />);

    await user.type(screen.getByLabelText('Email'), 'adam@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onValid).toHaveBeenCalledWith(
      { email: 'adam@example.com' },
      expect.any(Object)
    );
  });

  it('supports dot-path field names and produces nested values', async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();

    function Example() {
      const form = useForm<{ user: { email: string } }>({
        defaultValues: { user: { email: '' } },
      });

      return (
        <form onSubmit={form.handleSubmit(onValid)}>
          <input
            aria-label="Email"
            type="email"
            {...form.register('user.email')}
          />
          <button type="submit">Submit</button>
        </form>
      );
    }

    render(<Example />);

    await user.type(screen.getByLabelText('Email'), 'nested@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onValid).toHaveBeenCalledWith(
      { user: { email: 'nested@example.com' } },
      expect.any(Object)
    );
  });

  it('implements validateOn=\"blur-submit\" semantics', async () => {
    const user = userEvent.setup();

    function Example() {
      const form = useForm<{ email: string }>({
        defaultValues: { email: '' },
        validate: {
          email: (value) => {
            if (!value) return 'Email is required';
            if (typeof value === 'string' && !value.includes('@')) {
              return 'Enter a valid email';
            }
          },
        },
        validateOn: 'blur-submit',
      });

      return (
        <form onSubmit={form.handleSubmit(() => undefined)}>
          <input aria-label="Email" type="email" {...form.register('email')} />
          <div data-testid="error">{form.field('email').error ?? ''}</div>
          <button type="submit">Submit</button>
        </form>
      );
    }

    render(<Example />);

    const input = screen.getByLabelText('Email');

    await user.click(input);
    await user.tab();
    expect(screen.getByTestId('error')).toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByTestId('error')).toHaveTextContent('Email is required');

    await user.type(input, 'not-an-email');
    await user.tab();
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Enter a valid email'
    );

    await user.clear(input);
    await user.type(input, 'valid@example.com');
    await user.tab();
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('setValue updates a registered DOM input', async () => {
    const user = userEvent.setup();

    function Example() {
      const form = useForm<{ email: string }>({
        defaultValues: { email: '' },
      });

      return (
        <>
          <button
            type="button"
            onClick={() => {
              form.setValue('email', 'set@example.com');
            }}
          >
            Set
          </button>
          <input aria-label="Email" type="email" {...form.register('email')} />
        </>
      );
    }

    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Set' }));
    expect(screen.getByLabelText('Email')).toHaveValue('set@example.com');
  });
});
