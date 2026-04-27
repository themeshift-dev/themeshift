import { render, screen, waitFor } from '@testing-library/react';
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

  it('implements validateOn="blur-submit" semantics', async () => {
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

  it('supports controller fields with change-time validation', async () => {
    const user = userEvent.setup();

    function Example() {
      const form = useForm<{ role: string }>({
        defaultValues: { role: 'user' },
        validate: {
          role: (value) => (value ? undefined : 'Role is required'),
        },
        validateOn: 'change',
      });
      const role = form.controller('role');

      return (
        <>
          <p data-testid="value">{String(role.value)}</p>
          <p data-testid="error">{role.error ?? ''}</p>
          <p data-testid="dirty">{String(role.dirty)}</p>
          <p data-testid="touched">{String(role.touched)}</p>
          <button
            type="button"
            onClick={() => {
              role.onChange('');
            }}
          >
            Clear role
          </button>
          <button
            type="button"
            onClick={() => {
              role.setValue('admin');
            }}
          >
            Set admin
          </button>
          <button
            type="button"
            onClick={() => {
              role.onBlur();
            }}
          >
            Blur role
          </button>
        </>
      );
    }

    render(<Example />);

    expect(screen.getByTestId('value')).toHaveTextContent('user');
    expect(screen.getByTestId('dirty')).toHaveTextContent('false');
    expect(screen.getByTestId('touched')).toHaveTextContent('false');

    await user.click(screen.getByRole('button', { name: 'Clear role' }));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Role is required');
    });
    expect(screen.getByTestId('dirty')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'Blur role' }));
    expect(screen.getByTestId('touched')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'Set admin' }));
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('');
    });
    expect(screen.getByTestId('value')).toHaveTextContent('admin');
  });

  it('supports setValue flags and reset for DOM-backed fields', async () => {
    const user = userEvent.setup();

    function Example() {
      const form = useForm<{ enabled: boolean; email: string }>({
        defaultValues: { enabled: false, email: '' },
      });

      return (
        <>
          <label>
            Enabled
            <input
              aria-label="Enabled"
              type="checkbox"
              {...form.register('enabled')}
            />
          </label>
          <input aria-label="Email" type="email" {...form.register('email')} />
          <p data-testid="dirty-email">{String(form.field('email').dirty)}</p>
          <p data-testid="touched-email">
            {String(form.field('email').touched)}
          </p>
          <button
            type="button"
            onClick={() => {
              form.setValue('email', 'forced@example.com', {
                shouldDirty: false,
                shouldTouch: true,
              });
            }}
          >
            Force value
          </button>
          <button
            type="button"
            onClick={() => {
              form.reset({ enabled: true, email: 'reset@example.com' });
            }}
          >
            Reset form
          </button>
        </>
      );
    }

    render(<Example />);

    expect(screen.getByLabelText('Enabled')).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Force value' }));
    expect(screen.getByLabelText('Email')).toHaveValue('forced@example.com');
    expect(screen.getByTestId('dirty-email')).toHaveTextContent('false');
    expect(screen.getByTestId('touched-email')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'Reset form' }));
    expect(screen.getByLabelText('Enabled')).toBeChecked();
    expect(screen.getByLabelText('Email')).toHaveValue('reset@example.com');
    expect(screen.getByTestId('dirty-email')).toHaveTextContent('false');
    expect(screen.getByTestId('touched-email')).toHaveTextContent('false');
  });

  it('routes invalid submit to onInvalid and merges unregistered FormData fields', async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    const onInvalid = vi.fn();

    function Example() {
      const form = useForm<{
        email: string;
        labels: string[] | string;
        meta: string[] | string;
      }>({
        defaultValues: { email: '', labels: '', meta: 'default-meta' },
        validate: {
          email: (value) => (!value ? 'Email is required' : undefined),
        },
      });

      return (
        <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
          <input aria-label="Email" type="email" {...form.register('email')} />
          <input defaultValue="alpha" name="labels" readOnly />
          <input defaultValue="beta" name="labels" readOnly />
          <input defaultValue="gamma" name="labels" readOnly />
          <input defaultValue="override-meta" name="meta" readOnly />
          <button type="submit">Submit</button>
          <p data-testid="submit-count">{form.formState.submitCount}</p>
          <p data-testid="is-submitted">{String(form.formState.isSubmitted)}</p>
          <p data-testid="is-valid">{String(form.formState.isValid)}</p>
        </form>
      );
    }

    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onInvalid).toHaveBeenCalledWith({
        email: 'Email is required',
      });
    });
    expect(onValid).not.toHaveBeenCalled();
    expect(screen.getByTestId('submit-count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-submitted')).toHaveTextContent('true');
    expect(screen.getByTestId('is-valid')).toHaveTextContent('false');

    await user.type(screen.getByLabelText('Email'), 'valid@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onValid).toHaveBeenCalledWith(
        {
          email: 'valid@example.com',
          labels: ['', 'alpha', 'beta', 'gamma'],
          meta: ['default-meta', 'override-meta'],
        },
        expect.any(Object)
      );
    });
    expect(screen.getByTestId('submit-count')).toHaveTextContent('2');
  });
});
