import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SplitPaneShell } from './index';

describe('SplitPaneShell', () => {
  it('renders both panes inside the shell container', () => {
    const { container } = render(
      <SplitPaneShell endPane={<p>Inspector</p>} startPane={<p>Editor</p>} />
    );

    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText('Inspector')).toBeInTheDocument();
  });

  it('accepts a custom mainId while preserving current pane output', () => {
    render(
      <SplitPaneShell
        endPane={<p>Preview</p>}
        mainId="workspace-main"
        startPane={<p>Source</p>}
      />
    );

    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });
});
