import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import styles from './Responsive.module.scss';
import { Responsive } from './index';

describe('Responsive', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a div by default', () => {
    render(<Responsive when={{ below: 'tablet' }}>Content</Responsive>);

    expect(screen.getByText('Content')).toHaveProperty('tagName', 'DIV');
  });

  it('supports polymorphic rendering', () => {
    render(
      <Responsive as="section" data-testid="responsive" when={{ from: 'tablet' }}>
        Content
      </Responsive>,
    );

    expect(screen.getByTestId('responsive')).toHaveProperty('tagName', 'SECTION');
  });

  it('forwards className and native props', () => {
    render(
      <Responsive
        aria-label="Responsive region"
        className="custom-class"
        data-testid="below-tablet"
        id="responsive-id"
        when={{ below: 'tablet' }}
      >
        Content
      </Responsive>,
    );

    const region = screen.getByTestId('below-tablet');

    expect(region).toHaveAttribute('id', 'responsive-id');
    expect(region).toHaveAttribute('aria-label', 'Responsive region');
    expect(region).toHaveClass('custom-class');
  });

  it.each([
    [{ below: 'tablet' }, styles.mobileOnly],
    [{ from: 'tablet' }, styles.fromTablet],
    [{ from: 'tablet', to: 'desktop' }, styles.fromTablet],
    [{ below: 'desktop' }, styles.belowDesktop],
    [{ above: 'mobile' }, styles.fromTablet],
  ] as const)('applies the correct class for %o', (when, expectedClass) => {
    render(<Responsive when={when}>Content</Responsive>);

    expect(screen.getByText('Content')).toHaveClass(expectedClass);
  });

  it('renders desktop-only content when above tablet', () => {
    render(<Responsive when={{ above: 'tablet' }}>Desktop only</Responsive>);

    expect(screen.getByText('Desktop only')).toHaveClass(styles.desktopOnly);
  });

  it('renders tablet-only content for an exact tablet range', () => {
    render(
      <Responsive when={{ from: 'tablet', to: 'tablet' }}>
        Tablet only
      </Responsive>,
    );

    expect(screen.getByText('Tablet only')).toHaveClass(styles.tabletOnly);
  });

  it.each([
    [{ from: 'tablet', above: 'mobile' }],
    [{ to: 'desktop', below: 'tablet' }],
    [{ from: 'desktop', to: 'tablet' }],
    [{ above: 'desktop' }],
    [{ below: 'mobile' }],
  ] as const)(
    'warns and leaves content visible for invalid input %o',
    (when) => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Responsive when={when}>Invalid</Responsive>);

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Invalid')).not.toHaveClass(styles.mobileOnly);
      expect(screen.getByText('Invalid')).not.toHaveClass(styles.tabletOnly);
      expect(screen.getByText('Invalid')).not.toHaveClass(styles.desktopOnly);
      expect(screen.getByText('Invalid')).not.toHaveClass(styles.belowDesktop);
      expect(screen.getByText('Invalid')).not.toHaveClass(styles.fromTablet);
    },
  );

  it('has no accessibility violations for representative content', async () => {
    const { container, rerender } = render(
      <Responsive when={{ below: 'tablet' }}>Mobile only</Responsive>,
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Responsive data-testid="tablet-up" when={{ from: 'tablet' }}>
        Tablet and up
      </Responsive>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
