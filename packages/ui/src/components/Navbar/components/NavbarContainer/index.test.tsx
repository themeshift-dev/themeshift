import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NavbarContainer } from './index';
import styles from './NavbarContainer.module.scss';

describe('NavbarContainer', () => {
  it('renders a div by default', () => {
    render(<NavbarContainer data-testid="container">Container</NavbarContainer>);

    expect(screen.getByTestId('container')).toHaveProperty('tagName', 'DIV');
    expect(screen.getByTestId('container')).toHaveClass(styles.container);
  });

  it('supports polymorphic rendering', () => {
    render(<NavbarContainer as="section" data-testid="container" />);

    expect(screen.getByTestId('container')).toHaveProperty('tagName', 'SECTION');
  });

  it('preserves caller-provided className values', () => {
    render(<NavbarContainer className="container-custom">Container</NavbarContainer>);

    expect(screen.getByText('Container')).toHaveClass('container-custom');
  });

  it('applies inline style overrides for layout props', () => {
    render(
      <NavbarContainer gap="2rem" maxWidth="72rem">
        Container
      </NavbarContainer>,
    );

    expect(screen.getByText('Container')).toHaveStyle({
      '--navbar-container-gap': '2rem',
      '--navbar-max-width': '72rem',
    });
  });
});
