import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NavbarSection } from './index';
import styles from './NavbarSection.module.scss';

describe('NavbarSection', () => {
  it('renders a div by default', () => {
    render(<NavbarSection>Section</NavbarSection>);

    expect(screen.getByText('Section')).toHaveProperty('tagName', 'DIV');
    expect(screen.getByText('Section')).toHaveClass(styles.section);
  });

  it('supports polymorphic rendering', () => {
    render(<NavbarSection as="aside" data-testid="section" />);

    expect(screen.getByTestId('section')).toHaveProperty('tagName', 'ASIDE');
  });

  it.each([
    ['start', styles.start],
    ['center', styles.center],
    ['end', styles.end],
  ] as const)('applies the %s section alignment class', (align, className) => {
    render(<NavbarSection align={align}>Aligned</NavbarSection>);

    expect(screen.getByText('Aligned')).toHaveClass(className);
  });

  it('preserves caller-provided className values', () => {
    render(<NavbarSection className="section-custom">Section</NavbarSection>);

    expect(screen.getByText('Section')).toHaveClass('section-custom');
  });

  it('applies inline style and modifier overrides', () => {
    render(
      <NavbarSection direction="column" gap="0.75rem" wrap>
        Section
      </NavbarSection>,
    );

    expect(screen.getByText('Section')).toHaveStyle({
      '--navbar-section-gap': '0.75rem',
    });
    expect(screen.getByText('Section')).toHaveClass(styles.column);
    expect(screen.getByText('Section')).toHaveClass(styles.wrap);
  });
});
