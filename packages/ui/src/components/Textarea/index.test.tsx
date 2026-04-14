import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createRef, type ComponentPropsWithoutRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import styles from './Textarea.module.scss';
import { Textarea } from './index';

vi.mock('react-textarea-autosize', async () => {
  const react = await vi.importActual<typeof import('react')>('react');

  return {
    __esModule: true,
    default: react.forwardRef<
      HTMLTextAreaElement,
      ComponentPropsWithoutRef<'textarea'>
    >(({ children, ...props }, ref) => {
      return (
        <textarea {...props} data-autosize="true" ref={ref}>
          {children}
        </textarea>
      );
    }),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Textarea', () => {
  it('renders a textbox with the provided accessible name', () => {
    render(
      <label htmlFor="message-input">
        Message
        <Textarea id="message-input" />
      </label>
    );

    expect(
      screen.getByRole('textbox', { name: 'Message' })
    ).toBeInTheDocument();
  });

  it('forwards native textarea props', () => {
    render(
      <Textarea
        disabled
        name="message"
        placeholder="Write your message"
        required
      />
    );

    const textarea = screen.getByRole('textbox');

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('name', 'message');
    expect(textarea).toHaveAttribute('placeholder', 'Write your message');
    expect(textarea).toHaveAttribute('required');
  });

  it('applies default classes', () => {
    render(<Textarea aria-label="Default textarea" />);

    const textarea = screen.getByRole('textbox', { name: 'Default textarea' });

    expect(textarea).toHaveClass(styles.container);
    expect(textarea).toHaveClass(styles.medium);
    expect(textarea).toHaveClass(styles.none);
    expect(textarea).toHaveClass(styles.resizeVertical);
    expect(textarea).toHaveClass(styles.fullWidth);
  });

  it.each([
    ['small', styles.small],
    ['medium', styles.medium],
    ['large', styles.large],
  ] as const)('applies the %s size class', (size, className) => {
    render(<Textarea aria-label="Sized textarea" size={size} />);

    expect(screen.getByRole('textbox', { name: 'Sized textarea' })).toHaveClass(
      className
    );
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
        <Textarea
          aria-label="Validation textarea"
          validationState={validationState}
        />
      );

      expect(
        screen.getByRole('textbox', { name: 'Validation textarea' })
      ).toHaveClass(className);
    }
  );

  it.each([
    ['none', styles.resizeNone],
    ['vertical', styles.resizeVertical],
    ['horizontal', styles.resizeHorizontal],
    ['both', styles.resizeBoth],
    ['auto', styles.resizeAuto],
  ] as const)('applies the %s resize class', (resize, className) => {
    render(<Textarea aria-label="Resize textarea" resize={resize} />);

    expect(
      screen.getByRole('textbox', { name: 'Resize textarea' })
    ).toHaveClass(className);
  });

  it('allows turning off fullWidth', () => {
    render(<Textarea aria-label="Inline textarea" fullWidth={false} />);

    expect(
      screen.getByRole('textbox', { name: 'Inline textarea' })
    ).not.toHaveClass(styles.fullWidth);
  });

  it('uses autosize component when resize is auto', () => {
    render(
      <Textarea
        aria-label="Autosize textarea"
        maxRows={8}
        minRows={2}
        resize="auto"
      />
    );

    const textarea = screen.getByRole('textbox', { name: 'Autosize textarea' });

    expect(textarea).toHaveAttribute('data-autosize', 'true');
  });

  it('warns and ignores rows and style.height when resize is auto', () => {
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    render(
      <Textarea
        aria-label="Autosize conflict"
        resize="auto"
        rows={6}
        style={{ height: '120px', width: '320px' }}
      />
    );

    const textarea = screen.getByRole('textbox', { name: 'Autosize conflict' });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[Textarea] `resize="auto"` ignores `rows` and `style.height`. Use `minRows` and `maxRows` to control autosize bounds.'
    );
    expect(textarea).not.toHaveAttribute('rows');
    expect(textarea).not.toHaveStyle({ height: '120px' });
    expect(textarea).toHaveStyle({ width: '320px' });
  });

  it('does not warn when resize is auto without conflicting props', () => {
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    render(<Textarea aria-label="Autosize clean" minRows={3} resize="auto" />);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('forwards refs to the native textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(<Textarea aria-label="Ref textarea" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(
      screen.getByRole('textbox', { name: 'Ref textarea' })
    );
  });

  it('derives aria-invalid from validationState for invalid and valid', () => {
    const { rerender } = render(
      <Textarea aria-label="Validation aria" validationState="invalid" />
    );

    expect(
      screen.getByRole('textbox', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'true');

    rerender(<Textarea aria-label="Validation aria" validationState="valid" />);

    expect(
      screen.getByRole('textbox', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not set aria-invalid for warning or none by default', () => {
    const { rerender } = render(
      <Textarea aria-label="Warning aria" validationState="warning" />
    );

    expect(
      screen.getByRole('textbox', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');

    rerender(<Textarea aria-label="Warning aria" validationState="none" />);

    expect(
      screen.getByRole('textbox', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');
  });

  it('preserves caller-provided aria-invalid', () => {
    render(
      <Textarea
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
      <Textarea aria-label="Accessible textarea" />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Textarea aria-label="Accessible textarea" validationState="invalid" />
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Textarea aria-label="Accessible textarea" validationState="warning" />
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Textarea aria-label="Accessible textarea" validationState="valid" />
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(<Textarea aria-label="Accessible textarea" resize="auto" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
