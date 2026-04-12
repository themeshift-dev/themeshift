import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import styles from './ToggleSwitch.module.scss';
import { ToggleSwitch } from './index';

describe('ToggleSwitch', () => {
  it('renders a switch with the provided visible label', () => {
    render(<ToggleSwitch label="Notifications" />);

    expect(
      screen.getByRole('switch', { name: 'Notifications' })
    ).toBeInTheDocument();
  });

  it('supports ariaLabel naming when no visible label is rendered', () => {
    render(<ToggleSwitch ariaLabel="Enable dark mode" />);

    expect(
      screen.getByRole('switch', { name: 'Enable dark mode' })
    ).toBeInTheDocument();
  });

  it('supports ariaLabelledBy naming when no visible label is rendered', () => {
    render(
      <>
        <span id="toggle-title">Email updates</span>
        <ToggleSwitch ariaLabelledBy="toggle-title" />
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

  it('applies default size and intent styles', () => {
    render(<ToggleSwitch ariaLabel="Default switch" />);

    const container = screen
      .getByRole('switch', { name: 'Default switch' })
      .closest(`.${styles.container}`);

    expect(container).toHaveClass(styles.medium);
    expect(container).toHaveClass(styles.primary);
  });

  it.each([
    ['small', styles.small],
    ['medium', styles.medium],
    ['large', styles.large],
  ] as const)('applies the %s size class', (size, className) => {
    render(<ToggleSwitch ariaLabel="Sized switch" size={size} />);

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
    render(<ToggleSwitch ariaLabel="Intent switch" intent={intent} />);

    expect(
      screen
        .getByRole('switch', { name: 'Intent switch' })
        .closest(`.${styles.container}`)
    ).toHaveClass(className);
  });

  it('supports uncontrolled usage with defaultChecked', async () => {
    const user = userEvent.setup();

    render(<ToggleSwitch defaultChecked label="Wi-Fi" />);

    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });

    expect(toggle).toBeChecked();

    await user.click(toggle);

    expect(toggle).not.toBeChecked();
  });

  it('fires onCheckedChange with the next value', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <ToggleSwitch label="Bluetooth" onCheckedChange={onCheckedChange} />
    );

    await user.click(screen.getByRole('switch', { name: 'Bluetooth' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports controlled usage without mutating internal state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <ToggleSwitch
        checked={false}
        label="Airplane mode"
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
        disabled
        label="Disabled switch"
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
        label="Read only"
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

  it('wires invalid and described-by state', () => {
    render(
      <>
        <span id="external-help">External help</span>
        <ToggleSwitch
          ariaDescribedBy="external-help"
          description="Uses your system theme."
          errorMessage="Choose a supported setting."
          invalid
          label="Theme mode"
        />
      </>
    );

    const toggle = screen.getByRole('switch', { name: 'Theme mode' });

    expect(toggle).toHaveAttribute('aria-invalid', 'true');
    expect(toggle).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('external-help')
    );
    expect(toggle).toHaveAccessibleDescription(
      'External help Uses your system theme. Choose a supported setting.'
    );
  });

  it('changes the content order when labelPosition is start', () => {
    render(<ToggleSwitch label="Location" labelPosition="start" />);

    const container = screen
      .getByRole('switch', { name: 'Location' })
      .closest(`.${styles.container}`);

    expect(container?.firstElementChild).toHaveTextContent('Location');
  });

  it('renders only the icon for the current state', () => {
    const { rerender } = render(
      <ToggleSwitch
        ariaLabel="Toggle icons"
        iconOff={
          <svg aria-hidden="true" data-testid="icon-off" viewBox="0 0 16 16" />
        }
        iconOn={
          <svg aria-hidden="true" data-testid="icon-on" viewBox="0 0 16 16" />
        }
      />
    );

    expect(screen.getByTestId('icon-off')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-on')).not.toBeInTheDocument();

    rerender(
      <ToggleSwitch
        ariaLabel="Toggle icons"
        checked
        iconOff={
          <svg aria-hidden="true" data-testid="icon-off" viewBox="0 0 16 16" />
        }
        iconOn={
          <svg aria-hidden="true" data-testid="icon-on" viewBox="0 0 16 16" />
        }
      />
    );

    expect(screen.queryByTestId('icon-off')).not.toBeInTheDocument();
    expect(screen.getByTestId('icon-on')).toBeInTheDocument();
  });

  it('appends caller-provided class names to the expected nodes', () => {
    render(
      <ToggleSwitch
        ariaLabel="Styled switch"
        className="wrapper"
        label="Styled"
        labelClassName="label"
        thumbClassName="thumb"
        trackClassName="track"
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Styled' });
    const container = toggle.closest(`.${styles.container}`);

    expect(container).toHaveClass('wrapper');
    expect(container?.querySelector(`.${styles.track}`)).toHaveClass('track');
    expect(container?.querySelector(`.${styles.thumb}`)).toHaveClass('thumb');
    expect(screen.getByText('Styled')).toHaveClass('label');
  });

  it('has no basic accessibility violations', async () => {
    const { container } = render(
      <ToggleSwitch
        description="Applies a compact navigation layout."
        errorMessage="Resolve the conflicting preference."
        invalid
        label="Compact mode"
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
