import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Input } from '@/components/Input';
import { Menu } from '@/components/Menu';

import { Shortcut, formatShortcut } from './index';
import styles from './Shortcut.module.scss';

describe('formatShortcut', () => {
  it('formats string input with mod resolution for mac symbols', () => {
    expect(formatShortcut('mod+shift+p', { platform: 'mac' })).toEqual({
      display: ['⌘', '⇧', 'P'],
      label: 'Command Shift P',
    });
  });

  it('formats string input with mod resolution for windows symbols using hybrid text', () => {
    expect(formatShortcut('mod+shift+p', { platform: 'windows' })).toEqual({
      display: ['Ctrl', 'Shift', 'P'],
      label: 'Ctrl Shift P',
    });
  });

  it('normalizes aliases and supports array input', () => {
    expect(
      formatShortcut(['cmd', 'option', 'arrowdown'], {
        format: 'text',
        platform: 'mac',
      })
    ).toEqual({
      display: ['Command', 'Alt', 'Down Arrow'],
      label: 'Command Alt Down Arrow',
    });
  });

  it('preserves unknown keys in a readable form', () => {
    expect(formatShortcut('mod+f13', { platform: 'windows' })).toEqual({
      display: ['Ctrl', 'F13'],
      label: 'Ctrl F13',
    });
  });
});

describe('Shortcut', () => {
  it('renders keycaps with default props and accessible label', () => {
    render(<Shortcut keys="mod+k" platform="mac" />);

    const root = screen.getByLabelText('Command K');
    const keys = screen.getAllByText(/⌘|K/);

    expect(root).toHaveClass(styles.root, styles.sizeSm, styles.variantSolid);
    expect(keys).toHaveLength(2);
    expect(screen.getByText('⌘')).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports plus separator rendering', () => {
    render(
      <Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />
    );

    expect(screen.getAllByText('+')).toHaveLength(2);
  });

  it('forwards pass-through props and class names', () => {
    render(
      <Shortcut
        className="outer-class"
        data-testid="shortcut"
        keyClassName="key-class"
        keys={['ctrl', 'b']}
        platform="windows"
      />
    );

    const root = screen.getByTestId('shortcut');
    const key = screen.getByText('Ctrl');

    expect(root).toHaveClass('outer-class');
    expect(key).toHaveClass('key-class');
  });

  it('supports disabled, compact, uppercase, and wrap styles', () => {
    render(
      <Shortcut
        compact
        disabled
        keys="ctrl+shift+arrowdown"
        platform="windows"
        uppercase={false}
        wrap
      />
    );

    const root = screen.getByLabelText('Ctrl Shift Down Arrow');

    expect(root).toHaveClass(
      styles.compact,
      styles.disabled,
      styles.uppercaseOff,
      styles.wrap
    );
    expect(root).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders cleanly inside Menu.ItemMeta and Input adornments', () => {
    render(
      <>
        <Menu.Root defaultOpen>
          <Menu.Content aria-label="Commands">
            <Menu.Item>
              <Menu.ItemText>Palette</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="mod+k" platform="mac" />
              </Menu.ItemMeta>
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
        <Input
          aria-label="Search"
          endAdornment={<Shortcut keys="ctrl+shift+p" platform="windows" />}
        />
      </>
    );

    expect(screen.getByLabelText('Command K')).toBeInTheDocument();
    expect(screen.getByLabelText('Ctrl Shift P')).toBeInTheDocument();
  });

  it('has no accessibility violations for representative states', async () => {
    const { container, rerender } = render(
      <Shortcut keys="mod+enter" platform="mac" />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Shortcut
        format="text"
        keys="ctrl+shift+p"
        platform="windows"
        separator="plus"
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
