import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CenteredShell } from './index';

describe('CenteredShell', () => {
  it('renders children inside the shell container', () => {
    const { container } = render(
      <CenteredShell>
        <p>Focused content</p>
      </CenteredShell>
    );

    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild).toContainElement(
      screen.getByText('Focused content')
    );
  });

  it('renders optional regions passed through as children in the current scaffold', () => {
    render(
      <CenteredShell>
        <header>Intro</header>
        <footer>Actions</footer>
      </CenteredShell>
    );

    expect(screen.getByText('Intro')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
