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
      screen.getByRole('button', { name: 'Save changes' })
    ).toBeInTheDocument();
  });

  it('forwards native button props', () => {
    render(
      <Button type="submit" disabled>
        Submit
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Submit' });

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
  });

  it('renders a child element instead of a native button when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/login">Login</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Login' });

    expect(link).toHaveAttribute('href', '/login');
    expect(link).toHaveClass(styles.container);
    expect(
      screen.queryByRole('button', { name: 'Login' })
    ).not.toBeInTheDocument();
  });

  it('supports polymorphic rendering via the as prop', () => {
    render(
      <Button as="a" href="/dashboard">
        Dashboard
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });

    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveClass(styles.container);
  });

  it('throws when asChild is set without a valid React element child', () => {
    expect(() => render(<Button asChild>Login</Button>)).toThrowError(
      'ThemeShift Button with asChild expects a single React element child.'
    );
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
    ['hero', styles.hero],
  ] as const)('applies the %s size class', (size, className) => {
    render(<Button size={size}>Sized</Button>);

    expect(screen.getByRole('button', { name: 'Sized' })).toHaveClass(
      className
    );
  });

  it.each([
    ['primary', styles.primary],
    ['secondary', styles.secondary],
    ['constructive', styles.constructive],
    ['destructive', styles.destructive],
  ] as const)('applies the %s intent class', (intent, className) => {
    render(<Button intent={intent}>Intent</Button>);

    expect(screen.getByRole('button', { name: 'Intent' })).toHaveClass(
      className
    );
  });

  it.each([
    ['solid', styles.variantSolid],
    ['outline', styles.variantOutline],
    ['link', styles.variantLink],
  ] as const)('applies the %s variant class', (variant, className) => {
    render(<Button variant={variant}>Variant</Button>);

    expect(screen.getByRole('button', { name: 'Variant' })).toHaveClass(
      className
    );
  });

  it('appends a caller-provided className', () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'custom-class'
    );
  });

  it('renders start and end icon slots around the label', () => {
    render(
      <Button
        startIcon={
          <svg
            aria-hidden="true"
            data-testid="start-icon"
            viewBox="0 0 16 16"
          />
        }
        endIcon={
          <svg aria-hidden="true" data-testid="end-icon" viewBox="0 0 16 16" />
        }
      >
        With icons
      </Button>
    );

    const button = screen.getByRole('button', { name: 'With icons' });
    const startIcon = screen.getByTestId('start-icon');
    const endIcon = screen.getByTestId('end-icon');

    expect(button).toContainElement(startIcon);
    expect(button).toContainElement(endIcon);
    expect(startIcon.parentElement).toHaveClass(styles.iconSlot);
    expect(endIcon.parentElement).toHaveClass(styles.iconSlot);
  });

  it('supports icon-only buttons with a caller-provided aria-label', () => {
    render(
      <Button
        aria-label="Toggle theme"
        icon={
          <svg
            aria-hidden="true"
            data-testid="theme-icon"
            viewBox="0 0 16 16"
          />
        }
      />
    );

    expect(
      screen.getByRole('button', { name: 'Toggle theme' })
    ).toContainElement(screen.getByTestId('theme-icon'));
  });

  it('supports icon-only buttons with a caller-provided aria-labelledby', () => {
    render(
      <>
        <span id="label-id">Open settings</span>
        <Button
          aria-labelledby="label-id"
          icon={
            <svg
              aria-hidden="true"
              data-testid="settings-icon"
              viewBox="0 0 16 16"
            />
          }
        />
      </>
    );

    expect(
      screen.getByRole('button', { name: 'Open settings' })
    ).toContainElement(screen.getByTestId('settings-icon'));
  });

  it('renders the busy spinner instead of the icon for icon-only busy buttons', () => {
    render(
      <Button
        aria-label="Loading theme"
        icon={
          <svg
            aria-hidden="true"
            data-testid="theme-icon"
            viewBox="0 0 16 16"
          />
        }
        isBusy
        size="large"
      />
    );

    const button = screen.getByRole('button', { name: 'Loading theme' });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveClass(styles.iconOnly);
    expect(screen.queryByTestId('theme-icon')).not.toBeInTheDocument();
    expect(button.querySelector('svg')).toHaveAttribute('width', '20');
  });

  it('uses the hero spinner size for icon-only busy buttons', () => {
    render(
      <Button
        aria-label="Loading docs"
        icon={
          <svg aria-hidden="true" data-testid="docs-icon" viewBox="0 0 16 16" />
        }
        isBusy
        size="hero"
      />
    );

    const button = screen.getByRole('button', { name: 'Loading docs' });

    expect(screen.queryByTestId('docs-icon')).not.toBeInTheDocument();
    expect(button.querySelector('svg')).toHaveAttribute('width', '24');
  });

  it('ignores children when the icon prop is provided', () => {
    render(
      <Button
        aria-label="Search"
        icon={
          <svg
            aria-hidden="true"
            data-testid="search-icon"
            viewBox="0 0 16 16"
          />
        }
      >
        Ignored child label
      </Button>
    );

    expect(screen.getByRole('button', { name: 'Search' })).toContainElement(
      screen.getByTestId('search-icon')
    );
    expect(screen.queryByText('Ignored child label')).not.toBeInTheDocument();
  });

  it('does not treat a null icon value as an icon-only button', () => {
    render(<Button icon={null}>Fallback label</Button>);

    expect(
      screen.getByRole('button', { name: 'Fallback label' })
    ).not.toHaveClass(styles.iconOnly);
  });

  it('does not render a label wrapper when children is null', () => {
    const { container } = render(<Button>{null}</Button>);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(container.querySelector(`.${styles.label}`)).toBeNull();
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
      </Button>
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
      </Button>
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
      <Button intent="secondary" variant="outline">
        Secondary outline button
      </Button>
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Button intent="constructive" variant="link">
        Constructive link button
      </Button>
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Button disabled intent="destructive">
        Disabled destructive button
      </Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
