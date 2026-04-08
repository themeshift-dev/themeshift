import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import styles from './SkipLink.module.scss';
import { SkipLink } from './index';

describe('SkipLink', () => {
  it('renders an anchor with the provided target and accessible name', () => {
    render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

    const link = screen.getByRole('link', { name: 'Skip to main content' });

    expect(link).toHaveAttribute('href', '#main-content');
    expect(link).toHaveClass(styles.container);
  });

  it('uses the label prop when children are not provided', () => {
    render(<SkipLink href="#main-content" label="Skip past chrome" />);

    expect(
      screen.getByRole('link', { name: 'Skip past chrome' }),
    ).toBeInTheDocument();
  });

  it('is keyboard focusable', async () => {
    const user = userEvent.setup();

    render(<SkipLink href="#main-content">Skip to content</SkipLink>);

    await user.tab();

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus();
  });

  it('has no accessibility violations for a representative render', async () => {
    const { container } = render(
      <div>
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <main id="main-content">Page body</main>
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
