import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Navbar } from '../../index';
import { NavbarRoot } from './index';
import styles from './NavbarRoot.module.scss';

describe('NavbarRoot', () => {
  it('renders a nav element by default', () => {
    render(<NavbarRoot aria-label="Site navigation">Navigation</NavbarRoot>);

    expect(
      screen.getByRole('navigation', { name: 'Site navigation' }),
    ).toHaveProperty('tagName', 'NAV');
  });

  it.each([
    ['static', styles.static],
    ['absolute', styles.absolute],
    ['fixed', styles.fixed],
    ['sticky', styles.sticky],
  ] as const)('applies the %s position class', (position, className) => {
    render(
      <NavbarRoot aria-label="Positioned navigation" position={position}>
        Positioned
      </NavbarRoot>,
    );

    expect(
      screen.getByRole('navigation', { name: 'Positioned navigation' }),
    ).toHaveClass(className);
  });

  it('supports polymorphic rendering', () => {
    render(<NavbarRoot as="header" data-testid="navbar" />);

    expect(screen.getByTestId('navbar')).toHaveProperty('tagName', 'HEADER');
  });

  it('preserves caller-provided className values', () => {
    render(
      <NavbarRoot aria-label="Custom navbar" className="navbar-custom">
        Nav
      </NavbarRoot>,
    );

    expect(screen.getByRole('navigation', { name: 'Custom navbar' })).toHaveClass(
      'navbar-custom',
    );
  });

  it('stitches the compound API together', () => {
    expect(Navbar.Container).toBeDefined();
    expect(Navbar.Section).toBeDefined();
  });

  it('has no accessibility violations for a representative compound render', async () => {
    const { container } = render(
      <Navbar aria-label="Primary navigation" position="sticky">
        <Navbar.Container>
          <Navbar.Section align="start">
            <a href="/">ThemeShift</a>
          </Navbar.Section>
          <Navbar.Section align="center">
            <a href="/docs">Docs</a>
            <a href="/tokens">Tokens</a>
          </Navbar.Section>
          <Navbar.Section align="end">
            <button type="button">Sign in</button>
          </Navbar.Section>
        </Navbar.Container>
      </Navbar>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
