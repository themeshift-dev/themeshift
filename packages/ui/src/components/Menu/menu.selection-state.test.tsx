import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Menu } from './index';

describe('Menu - selection/state', () => {
  it('honors preventDefault on select to keep content open', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Item
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            Rename
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('checkbox and radio items default to closeOnSelect=false', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.CheckboxItem>Dense mode</Menu.CheckboxItem>
          <Menu.RadioGroup defaultValue="compact">
            <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
            <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Dense mode' })
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Comfortable' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('supports uncontrolled checkbox/radio state updates via click and Enter', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Preferences">
          <Menu.CheckboxItem defaultChecked>
            <Menu.ItemIndicator forceMount data-testid="dense-indicator">
              ✓
            </Menu.ItemIndicator>
            Dense mode
          </Menu.CheckboxItem>
          <Menu.RadioGroup defaultValue="system">
            <Menu.RadioItem value="system">
              <Menu.ItemIndicator forceMount data-testid="system-indicator">
                •
              </Menu.ItemIndicator>
              System
            </Menu.RadioItem>
            <Menu.RadioItem value="light">
              <Menu.ItemIndicator forceMount data-testid="light-indicator">
                •
              </Menu.ItemIndicator>
              Light
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>
    );

    const checkbox = screen.getByRole('menuitemcheckbox', {
      name: /Dense mode/,
    });
    const denseIndicator = screen.getByTestId('dense-indicator');
    const denseCheckedState = denseIndicator.getAttribute('data-state');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    const denseUncheckedState = denseIndicator.getAttribute('data-state');
    expect(denseUncheckedState).not.toBe(denseCheckedState);
    checkbox.focus();
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(denseIndicator).toHaveAttribute('data-state', denseCheckedState);

    const system = screen.getByRole('menuitemradio', { name: /System/ });
    const light = screen.getByRole('menuitemradio', { name: /Light/ });
    const systemIndicator = screen.getByTestId('system-indicator');
    const lightIndicator = screen.getByTestId('light-indicator');
    const checkedRadioState = systemIndicator.getAttribute('data-state');
    const uncheckedRadioState = lightIndicator.getAttribute('data-state');

    expect(system).toHaveAttribute('aria-checked', 'true');
    expect(light).toHaveAttribute('aria-checked', 'false');
    expect(checkedRadioState).not.toBe(uncheckedRadioState);
    fireEvent.click(light);
    expect(system).toHaveAttribute('aria-checked', 'false');
    expect(light).toHaveAttribute('aria-checked', 'true');
    expect(systemIndicator).toHaveAttribute('data-state', uncheckedRadioState);
    expect(lightIndicator).toHaveAttribute('data-state', checkedRadioState);
    system.focus();
    fireEvent.keyDown(system, { key: 'Enter' });
    expect(system).toHaveAttribute('aria-checked', 'true');
    expect(light).toHaveAttribute('aria-checked', 'false');
    expect(systemIndicator).toHaveAttribute('data-state', checkedRadioState);
    expect(lightIndicator).toHaveAttribute('data-state', uncheckedRadioState);
  });

  it('updates checkbox and radio checked states', () => {
    const SelectionHarness = () => {
      const [dense, setDense] = useState(false);
      const [theme, setTheme] = useState('compact');

      return (
        <Menu.Root defaultOpen>
          <Menu.Content aria-label="Actions">
            <Menu.CheckboxItem checked={dense} onCheckedChange={setDense}>
              Dense mode
            </Menu.CheckboxItem>
            <Menu.RadioGroup onValueChange={setTheme} value={theme}>
              <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
              <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Content>
        </Menu.Root>
      );
    };

    render(<SelectionHarness />);

    const checkbox = screen.getByRole('menuitemcheckbox', {
      name: 'Dense mode',
    });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    const compact = screen.getByRole('menuitemradio', { name: 'Compact' });
    const comfortable = screen.getByRole('menuitemradio', {
      name: 'Comfortable',
    });

    expect(compact).toHaveAttribute('aria-checked', 'true');
    expect(comfortable).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(comfortable);
    expect(compact).toHaveAttribute('aria-checked', 'false');
    expect(comfortable).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles indeterminate checkbox to checked on activation', () => {
    const SelectionHarness = () => {
      const [dense, setDense] = useState<boolean | 'indeterminate'>(
        'indeterminate'
      );

      return (
        <Menu.Root defaultOpen>
          <Menu.Content aria-label="Actions">
            <Menu.CheckboxItem
              checked={dense}
              onCheckedChange={(next) => setDense(next)}
            >
              Dense mode
            </Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Root>
      );
    };

    render(<SelectionHarness />);

    const checkbox = screen.getByRole('menuitemcheckbox', {
      name: 'Dense mode',
    });
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    fireEvent.keyDown(checkbox, { key: 'Enter' });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });
});
