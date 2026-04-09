import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlankShell } from './index';

describe('BlankShell', () => {
  it('renders children inside the shell container', () => {
    const { container } = render(
      <BlankShell>
        <p>Minimal content</p>
      </BlankShell>
    );

    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild).toContainElement(
      screen.getByText('Minimal content')
    );
  });

  it('accepts a custom mainId without changing current placeholder output', () => {
    render(
      <BlankShell mainId="canvas-root">
        <p>Canvas content</p>
      </BlankShell>
    );

    expect(screen.getByText('Canvas content')).toBeInTheDocument();
  });
});
