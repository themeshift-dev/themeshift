import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LayoutViewer } from './index';

vi.mock('@/app/components', () => ({
  CopyButton: ({ text }: { text: string }) => (
    <button type="button">Copy {text}</button>
  ),
  ScrollFade: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SyntaxHighlighter: ({ code }: { code: string }) => <pre>{code}</pre>,
}));

const originalMatches = HTMLElement.prototype.matches;

afterEach(() => {
  HTMLElement.prototype.matches = originalMatches;
});

function createExamples() {
  return [
    {
      code: '<div>First</div>',
      id: 'first',
      label: 'First',
      render: <button type="button">First Content Button</button>,
    },
    {
      code: '<div>Second</div>',
      id: 'second',
      label: 'Second',
      render: <button type="button">Second Content Button</button>,
    },
  ];
}

describe('LayoutViewer', () => {
  it('renders first example by default and switches tabs', () => {
    render(
      <LayoutViewer
        examples={createExamples()}
        isolation="inline"
        title="Examples"
      />
    );

    expect(screen.getByText('First Content Button')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

    expect(screen.getByText('Second Content Button')).toBeInTheDocument();
  });

  it('toggles direction and viewport controls', () => {
    render(<LayoutViewer examples={createExamples()} isolation="inline" />);

    const frame = screen.getByRole('group', {
      name: /layout example preview/i,
    });
    expect(frame).toHaveAttribute('data-layout-viewer-mode', 'contained');

    fireEvent.click(screen.getByRole('button', { name: 'Switch to RTL' }));

    expect(
      screen.getByRole('button', { name: 'Switch to LTR' })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'mobile' },
    });

    const root = frame.closest('[data-layout-viewer]');
    expect(root).toHaveAttribute('data-layout-viewer-viewport', 'mobile');
  });

  it('shows code panel and expands with show code action', () => {
    render(<LayoutViewer examples={createExamples()} isolation="inline" />);

    const codeRegion = screen.getByText('<div>First</div>').closest('div');
    expect(codeRegion).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show code' }));

    expect(
      screen.getByRole('button', { name: /copy <div>first<\/div>/i })
    ).toBeInTheDocument();
  });

  it('enters interaction with Enter and exits with Escape', () => {
    render(<LayoutViewer examples={createExamples()} isolation="inline" />);

    const frame = screen.getByRole('group', {
      name: /layout example preview/i,
    });

    expect(
      screen.getByText('Press Enter to interact. Press Escape to return.')
    ).toBeInTheDocument();

    fireEvent.keyDown(frame, { key: 'Enter' });

    expect(
      screen.queryByText('Press Enter to interact. Press Escape to return.')
    ).not.toBeInTheDocument();
    expect(screen.getByText('Press Escape to return')).toBeInTheDocument();

    fireEvent.keyDown(frame, { key: 'Escape' });

    expect(
      screen.getByText('Press Enter to interact. Press Escape to return.')
    ).toBeInTheDocument();
  });

  it('applies inert and aria-hidden on preview content when not interacting with keyboard focus', () => {
    HTMLElement.prototype.matches = function matches(selector: string) {
      if (selector === ':focus-visible') {
        return true;
      }

      return originalMatches.call(this, selector);
    };

    render(<LayoutViewer examples={createExamples()} isolation="inline" />);

    const frame = screen.getByRole('group', {
      name: /layout example preview/i,
    });
    fireEvent.focus(frame);

    const frameContent = frame.querySelector('[inert]');

    expect(frameContent).toHaveAttribute('aria-hidden', 'true');
    expect(frameContent).toHaveAttribute('inert', '');
  });

  it('restores focus on escape when restoreFocusOnExit is true', () => {
    render(
      <LayoutViewer
        examples={createExamples()}
        isolation="inline"
        restoreFocusOnExit
      />
    );

    const frame = screen.getByRole('group', {
      name: /layout example preview/i,
    });
    fireEvent.keyDown(frame, { key: 'Enter' });

    const innerButton = screen.getByRole('button', {
      name: 'First Content Button',
    });
    innerButton.focus();

    fireEvent.keyDown(innerButton, { key: 'Escape' });

    expect(document.activeElement).toBe(frame);
  });

  it('does not restore focus on escape when restoreFocusOnExit is false', () => {
    render(
      <LayoutViewer
        examples={createExamples()}
        isolation="inline"
        restoreFocusOnExit={false}
      />
    );

    const frame = screen.getByRole('group', {
      name: /layout example preview/i,
    });
    fireEvent.keyDown(frame, { key: 'Enter' });

    const innerButton = screen.getByRole('button', {
      name: 'First Content Button',
    });
    innerButton.focus();

    fireEvent.keyDown(innerButton, { key: 'Escape' });

    expect(document.activeElement).not.toBe(frame);
  });

  it('handles iframe isolation exit message', () => {
    render(<LayoutViewer examples={createExamples()} isolation="iframe" />);

    const frame = screen.getByRole('group', {
      name: /layout example preview/i,
    });
    fireEvent.keyDown(frame, { key: 'Enter' });

    const iframe = screen.getByTitle(
      'Layout viewer iframe'
    ) as HTMLIFrameElement;
    const match = iframe.srcdoc?.match(/id: '([^']+)'/);
    expect(match?.[1]).toBeTruthy();

    fireEvent(
      window,
      new MessageEvent('message', {
        data: {
          id: match?.[1],
          type: 'layout-viewer:exit-preview',
        },
      })
    );

    expect(
      screen.getByText('Press Enter to interact. Press Escape to return.')
    ).toBeInTheDocument();
  });

  it('shows and hides escape hint from iframe focus-within messages', () => {
    render(<LayoutViewer examples={createExamples()} isolation="iframe" />);

    const frame = screen.getByRole('group', {
      name: /layout example preview/i,
    });
    fireEvent.keyDown(frame, { key: 'Enter' });

    const iframe = screen.getByTitle(
      'Layout viewer iframe'
    ) as HTMLIFrameElement;
    const match = iframe.srcdoc?.match(/id: '([^']+)'/);
    expect(match?.[1]).toBeTruthy();

    fireEvent(
      window,
      new MessageEvent('message', {
        data: {
          focusWithin: true,
          id: match?.[1],
          type: 'layout-viewer:focus-within',
        },
      })
    );

    expect(screen.getByText('Press Escape to return')).toBeInTheDocument();

    fireEvent(
      window,
      new MessageEvent('message', {
        data: {
          focusWithin: false,
          id: match?.[1],
          type: 'layout-viewer:focus-within',
        },
      })
    );

    expect(
      screen.queryByText('Press Escape to return')
    ).not.toBeInTheDocument();
  });

  it('throws when context subcomponent is rendered outside root', () => {
    expect(() => render(<LayoutViewer.Tabs />)).toThrow(
      'LayoutViewer.Tabs must be used within LayoutViewer.Root.'
    );
  });

  it('supports Space key to enter interaction', () => {
    render(<LayoutViewer examples={createExamples()} isolation="inline" />);

    const frame = screen.getByRole('group', {
      name: /layout example preview/i,
    });

    fireEvent.keyDown(frame, { key: ' ' });

    expect(screen.getByText('Press Escape to return')).toBeInTheDocument();
  });

  it('supports direct focus mode without enter hint', () => {
    render(
      <LayoutViewer
        examples={createExamples()}
        focusMode="direct"
        isolation="inline"
      />
    );

    expect(
      screen.queryByText('Press Enter to interact. Press Escape to return.')
    ).not.toBeInTheDocument();
  });

  it('renders open-in-new-tab link from state callback', () => {
    render(
      <LayoutViewer
        allowOpenInNewTab
        examples={createExamples()}
        isolation="inline"
        openInNewTabHref={({ dir, exampleId, viewport }) =>
          `/preview?d=${dir}&e=${exampleId}&v=${viewport}`
        }
      />
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'tablet' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Switch to RTL' }));

    const openLink = screen.getByRole('link', { name: 'Open' });
    expect(openLink).toHaveAttribute(
      'href',
      '/preview?d=rtl&e=second&v=tablet'
    );
  });

  it('renders region placeholders in region mode', () => {
    render(
      <LayoutViewer
        examples={createExamples()}
        isolation="inline"
        mode="region"
        region="top"
      />
    );

    expect(screen.getByText('First Content Button')).toBeInTheDocument();
    const placeholders = document.querySelectorAll('div[class*="placeholder"]');
    expect(placeholders.length).toBe(4);
  });

  it('resolves examples from LayoutViewer.Example children', () => {
    render(
      <LayoutViewer.Root isolation="inline" title="Child examples">
        <LayoutViewer.Example code="<div>A</div>" id="a" label="A">
          <button type="button">Child A</button>
        </LayoutViewer.Example>
        <LayoutViewer.Example code="<div>B</div>" id="b" label="B">
          <button type="button">Child B</button>
        </LayoutViewer.Example>
        <LayoutViewer.Toolbar>
          <LayoutViewer.Tabs />
        </LayoutViewer.Toolbar>
        <LayoutViewer.Viewport>
          <LayoutViewer.Frame />
        </LayoutViewer.Viewport>
        <LayoutViewer.Code />
      </LayoutViewer.Root>
    );

    expect(screen.getByText('Child A')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByText('Child B')).toBeInTheDocument();
  });

  it('toggles code with compound CodeToggle control', () => {
    render(
      <LayoutViewer.Root examples={createExamples()} isolation="inline">
        <LayoutViewer.Toolbar>
          <LayoutViewer.CodeToggle />
        </LayoutViewer.Toolbar>
        <LayoutViewer.Viewport>
          <LayoutViewer.Frame />
        </LayoutViewer.Viewport>
        <LayoutViewer.Code />
      </LayoutViewer.Root>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Code' }));
    expect(
      screen.getByRole('button', { name: 'Hide code' })
    ).toBeInTheDocument();
  });

  it('hides code panel when showCode is false', () => {
    render(
      <LayoutViewer
        examples={createExamples()}
        isolation="inline"
        showCode={false}
      />
    );

    expect(screen.queryByText('<div>First</div>')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Show code' })
    ).not.toBeInTheDocument();
  });

  it('renders safely when no examples are provided', () => {
    render(<LayoutViewer isolation="inline" />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Show code' })
    ).not.toBeInTheDocument();
  });
});
