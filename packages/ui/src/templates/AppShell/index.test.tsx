import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppShell } from './index';

describe('AppShell', () => {
  it('renders children inside the shell container', () => {
    const { container } = render(
      <AppShell>
        <p>Workspace content</p>
      </AppShell>
    );

    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild).toContainElement(
      screen.getByText('Workspace content')
    );
  });

  it('renders multiple structural children without dropping them', () => {
    render(
      <AppShell>
        <header>Top chrome</header>
        <main>Primary view</main>
      </AppShell>
    );

    expect(screen.getByText('Top chrome')).toBeInTheDocument();
    expect(screen.getByText('Primary view')).toBeInTheDocument();
  });
});
