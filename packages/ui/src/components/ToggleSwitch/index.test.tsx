import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field } from '@/components/Field';

import styles from './ToggleSwitch.module.scss';
import { ToggleSwitch } from './index';

describe('ToggleSwitch', () => {
  it('supports external label association', () => {
    render(
      <label htmlFor="notifications">
        Notifications
        <ToggleSwitch id="notifications" />
      </label>
    );

    expect(
      screen.getByRole('switch', { name: 'Notifications' })
    ).toBeInTheDocument();
  });

  it('supports aria-label naming when no visible label is rendered', () => {
    render(<ToggleSwitch aria-label="Enable dark mode" />);

    expect(
      screen.getByRole('switch', { name: 'Enable dark mode' })
    ).toBeInTheDocument();
  });

  it('supports aria-labelledby naming', () => {
    render(
      <>
        <span id="toggle-title">Email updates</span>
        <ToggleSwitch aria-labelledby="toggle-title" />
      </>
    );

    expect(
      screen.getByRole('switch', { name: 'Email updates' })
    ).toBeInTheDocument();
  });

  it('forwards native form props to the input', () => {
    render(
      <ToggleSwitch
        autoFocus
        id="newsletter"
        name="newsletter"
        required
        value="yes"
      />
    );

    const toggle = screen.getByRole('switch');

    expect(toggle).toHaveAttribute('id', 'newsletter');
    expect(toggle).toHaveAttribute('name', 'newsletter');
    expect(toggle).toHaveAttribute('value', 'yes');
    expect(toggle).toHaveAttribute('required');
    expect(toggle).toHaveFocus();
  });

  it('applies default classes', () => {
    render(<ToggleSwitch aria-label="Default switch" />);

    const container = screen
      .getByRole('switch', { name: 'Default switch' })
      .closest(`.${styles.container}`);

    expect(container).toHaveClass(styles.medium);
    expect(container).toHaveClass(styles.none);
    expect(container).toHaveClass(styles.primary);
  });

  it.each([
    ['small', styles.small],
    ['medium', styles.medium],
    ['large', styles.large],
  ] as const)('applies the %s size class', (size, className) => {
    render(<ToggleSwitch aria-label="Sized switch" size={size} />);

    expect(
      screen
        .getByRole('switch', { name: 'Sized switch' })
        .closest(`.${styles.container}`)
    ).toHaveClass(className);
  });

  it.each([
    ['primary', styles.primary],
    ['secondary', styles.secondary],
    ['tertiary', styles.tertiary],
    ['constructive', styles.constructive],
    ['destructive', styles.destructive],
  ] as const)('applies the %s intent class', (intent, className) => {
    render(<ToggleSwitch aria-label="Intent switch" intent={intent} />);

    expect(
      screen
        .getByRole('switch', { name: 'Intent switch' })
        .closest(`.${styles.container}`)
    ).toHaveClass(className);
  });

  it.each([
    ['none', styles.none],
    ['invalid', styles.invalid],
    ['valid', styles.valid],
    ['warning', styles.warning],
  ] as const)(
    'applies the %s validation class',
    (validationState, className) => {
      render(
        <ToggleSwitch
          aria-label="Validation switch"
          validationState={validationState}
        />
      );

      expect(
        screen
          .getByRole('switch', { name: 'Validation switch' })
          .closest(`.${styles.container}`)
      ).toHaveClass(className);
    }
  );

  it('supports uncontrolled usage with defaultChecked', async () => {
    const user = userEvent.setup();

    render(<ToggleSwitch aria-label="Wi-Fi" defaultChecked />);

    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });

    expect(toggle).toBeChecked();

    await user.click(toggle);

    expect(toggle).not.toBeChecked();
  });

  it('fires onCheckedChange with the next value', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <ToggleSwitch aria-label="Bluetooth" onCheckedChange={onCheckedChange} />
    );

    await user.click(screen.getByRole('switch', { name: 'Bluetooth' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports controlled usage without mutating internal state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <ToggleSwitch
        aria-label="Airplane mode"
        checked={false}
        onCheckedChange={onCheckedChange}
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Airplane mode' });

    await user.click(toggle);

    expect(toggle).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <ToggleSwitch
        aria-label="Disabled switch"
        disabled
        onCheckedChange={onCheckedChange}
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Disabled switch' });

    await user.click(toggle);

    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('does not toggle when readOnly via click or keyboard', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <ToggleSwitch
        aria-label="Read only"
        onCheckedChange={onCheckedChange}
        readOnly
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Read only' });

    await user.click(toggle);
    await user.tab();
    await user.keyboard('[Space]');

    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveAttribute('aria-readonly', 'true');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('derives aria-invalid from validationState for invalid and valid', () => {
    const { rerender } = render(
      <ToggleSwitch aria-label="Validation aria" validationState="invalid" />
    );

    expect(
      screen.getByRole('switch', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'true');

    rerender(
      <ToggleSwitch aria-label="Validation aria" validationState="valid" />
    );

    expect(
      screen.getByRole('switch', { name: 'Validation aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not set aria-invalid for warning or none by default', () => {
    const { rerender } = render(
      <ToggleSwitch aria-label="Warning aria" validationState="warning" />
    );

    expect(
      screen.getByRole('switch', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');

    rerender(<ToggleSwitch aria-label="Warning aria" validationState="none" />);

    expect(
      screen.getByRole('switch', { name: 'Warning aria' })
    ).not.toHaveAttribute('aria-invalid');
  });

  it('preserves caller-provided aria-invalid', () => {
    render(
      <ToggleSwitch
        aria-invalid={false}
        aria-label="Explicit aria"
        validationState="invalid"
      />
    );

    expect(
      screen.getByRole('switch', { name: 'Explicit aria' })
    ).toHaveAttribute('aria-invalid', 'false');
  });

  it('merges caller provided aria-describedby with Field description and error ids', () => {
    render(
      <>
        <span id="external-help">External help</span>
        <Field
          description="Uses your system theme."
          error="Choose a supported setting."
          label="Theme mode"
          validationState="invalid"
        >
          <ToggleSwitch aria-describedby="external-help" />
        </Field>
      </>
    );

    const toggle = screen.getByRole('switch', { name: 'Theme mode' });

    expect(toggle).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('external-help')
    );
    expect(toggle).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('-description')
    );
    expect(toggle).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('-error')
    );
  });

  it('uses Field defaults for ids and shared state', () => {
    render(
      <Field
        description="Sync with your account"
        id="sync-toggle"
        label="Sync enabled"
        required
        validationState="invalid"
      >
        <ToggleSwitch />
      </Field>
    );

    const toggle = screen.getByRole('switch', { name: 'Sync enabled' });

    expect(toggle).toHaveAttribute('id', 'sync-toggle-control');
    expect(toggle).toHaveAttribute('required');
    expect(toggle).toHaveAttribute('aria-invalid', 'true');
    expect(toggle).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('sync-toggle-description')
    );
  });

  it('lets explicit props override Field defaults', () => {
    render(
      <Field disabled label="Allow backups" required validationState="invalid">
        <ToggleSwitch
          aria-invalid={false}
          disabled={false}
          required={false}
          validationState="valid"
        />
      </Field>
    );

    const toggle = screen.getByRole('switch', { name: 'Allow backups' });

    expect(toggle).not.toBeDisabled();
    expect(toggle).not.toHaveAttribute('required');
    expect(toggle).toHaveAttribute('aria-invalid', 'false');
    expect(toggle.closest(`.${styles.container}`)).toHaveClass(styles.valid);
  });

  it('renders only the track icon for the current state', () => {
    const { rerender } = render(
      <ToggleSwitch
        aria-label="Toggle icons"
        trackIconOff={
          <svg aria-hidden="true" data-testid="icon-off" viewBox="0 0 16 16" />
        }
        trackIconOn={
          <svg aria-hidden="true" data-testid="icon-on" viewBox="0 0 16 16" />
        }
      />
    );

    expect(screen.getByTestId('icon-off')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-on')).not.toBeInTheDocument();

    rerender(
      <ToggleSwitch
        aria-label="Toggle icons"
        checked
        trackIconOff={
          <svg aria-hidden="true" data-testid="icon-off" viewBox="0 0 16 16" />
        }
        trackIconOn={
          <svg aria-hidden="true" data-testid="icon-on" viewBox="0 0 16 16" />
        }
      />
    );

    expect(screen.queryByTestId('icon-off')).not.toBeInTheDocument();
    expect(screen.getByTestId('icon-on')).toBeInTheDocument();
  });

  it('renders only the thumb icon for the current state', () => {
    const { rerender } = render(
      <ToggleSwitch
        aria-label="Toggle thumb icons"
        thumbIconOff={
          <svg
            aria-hidden="true"
            data-testid="thumb-icon-off"
            viewBox="0 0 16 16"
          />
        }
        thumbIconOn={
          <svg
            aria-hidden="true"
            data-testid="thumb-icon-on"
            viewBox="0 0 16 16"
          />
        }
      />
    );

    expect(screen.getByTestId('thumb-icon-off')).toBeInTheDocument();
    expect(screen.queryByTestId('thumb-icon-on')).not.toBeInTheDocument();

    rerender(
      <ToggleSwitch
        aria-label="Toggle thumb icons"
        checked
        thumbIconOff={
          <svg
            aria-hidden="true"
            data-testid="thumb-icon-off"
            viewBox="0 0 16 16"
          />
        }
        thumbIconOn={
          <svg
            aria-hidden="true"
            data-testid="thumb-icon-on"
            viewBox="0 0 16 16"
          />
        }
      />
    );

    expect(screen.queryByTestId('thumb-icon-off')).not.toBeInTheDocument();
    expect(screen.getByTestId('thumb-icon-on')).toBeInTheDocument();
  });

  it('forwards refs to the native input', () => {
    const ref = createRef<HTMLInputElement>();

    render(<ToggleSwitch aria-label="Focusable switch" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(
      screen.getByRole('switch', { name: 'Focusable switch' })
    );
  });

  it('appends caller-provided class names to the expected nodes', () => {
    render(
      <ToggleSwitch
        aria-label="Styled switch"
        className="wrapper"
        thumbClassName="thumb"
        trackClassName="track"
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Styled switch' });
    const container = toggle.closest(`.${styles.container}`);

    expect(container).toHaveClass('wrapper');
    expect(container?.querySelector(`.${styles.track}`)).toHaveClass('track');
    expect(container?.querySelector(`.${styles.thumb}`)).toHaveClass('thumb');
  });

  it('forwards native input props and preserves explicit overrides', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ToggleSwitch
        aria-label="Forwarded switch"
        data-testid="forwarded-switch"
        onClick={onClick}
        title="Forwarded title"
      />
    );

    const toggle = screen.getByTestId('forwarded-switch');

    expect(toggle).toHaveAttribute('title', 'Forwarded title');
    expect(toggle).toHaveAttribute('type', 'checkbox');

    await user.click(toggle);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations for representative states', async () => {
    const { container, rerender } = render(
      <ToggleSwitch aria-label="Accessible switch" />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <ToggleSwitch aria-label="Accessible switch" validationState="invalid" />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <ToggleSwitch aria-label="Accessible switch" validationState="warning" />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <ToggleSwitch aria-label="Accessible switch" validationState="valid" />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Field
        description="Toggle guidance"
        error="Resolve the conflicting preference."
        label="Accessible field switch"
        validationState="invalid"
      >
        <ToggleSwitch />
      </Field>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
