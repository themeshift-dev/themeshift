import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/Button';

import { Status } from './index';
import styles from './Status.module.scss';

describe('Status', () => {
  it('supports the compound API including presets', () => {
    expect(Status.Root).toBeDefined();
    expect(Status.Icon).toBeDefined();
    expect(Status.Content).toBeDefined();
    expect(Status.Title).toBeDefined();
    expect(Status.Description).toBeDefined();
    expect(Status.Actions).toBeDefined();
    expect(Status.Empty).toBeDefined();
    expect(Status.Error).toBeDefined();
    expect(Status.PageNotFound).toBeDefined();
    expect(Status.Disconnected).toBeDefined();
    expect(Status.NoResults).toBeDefined();
    expect(Status.PermissionDenied).toBeDefined();
  });

  it('renders as section by default with default classes', () => {
    render(<Status data-testid="status">Empty</Status>);

    const root = screen.getByTestId('status');

    expect(root.tagName).toBe('SECTION');
    expect(root).toHaveClass(
      styles.root,
      styles.alignCenter,
      styles.densityComfortable,
      styles.variantPlain,
      styles.intentNeutral
    );
  });

  it('applies align, density, variant, and intent classes', () => {
    render(
      <Status
        align="start"
        data-testid="status"
        density="spacious"
        intent="danger"
        variant="panel"
      />
    );

    expect(screen.getByTestId('status')).toHaveClass(
      styles.alignStart,
      styles.densitySpacious,
      styles.variantPanel,
      styles.intentDanger
    );
  });

  it('passes role and aria-live through to the root element', () => {
    render(
      <Status aria-live="polite" data-testid="status" role="status">
        Syncing
      </Status>
    );

    expect(screen.getByTestId('status')).toHaveAttribute('role', 'status');
    expect(screen.getByTestId('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('supports asChild on Icon, Title, Description, and Actions', () => {
    render(
      <Status>
        <Status.Icon asChild>
          <span data-testid="icon-child">i</span>
        </Status.Icon>
        <Status.Content>
          <Status.Title asChild>
            <h1 data-testid="title-child">Page not found</h1>
          </Status.Title>
          <Status.Description asChild>
            <div data-testid="description-child">Try going home.</div>
          </Status.Description>
        </Status.Content>
        <Status.Actions asChild>
          <nav data-testid="actions-child">
            <Button>Retry</Button>
          </nav>
        </Status.Actions>
      </Status>
    );

    expect(screen.getByTestId('icon-child')).toHaveClass(styles.icon);
    expect(screen.getByTestId('title-child')).toHaveClass(styles.title);
    expect(screen.getByTestId('description-child')).toHaveClass(
      styles.description
    );
    expect(screen.getByTestId('actions-child')).toHaveClass(styles.actions);
  });

  it('maps Status.Root to Status for DX aliasing', () => {
    const { rerender } = render(<Status data-testid="status">A</Status>);

    expect(screen.getByTestId('status')).toBeInTheDocument();

    rerender(<Status.Root data-testid="status">B</Status.Root>);

    expect(screen.getByTestId('status')).toBeInTheDocument();
  });

  it('renders presets with defaults and supports overrides', () => {
    const { rerender } = render(<Status.Empty data-testid="status-empty" />);

    expect(screen.getByText('No content yet')).toBeInTheDocument();
    expect(
      screen.getByText('There is nothing to show here yet.')
    ).toBeInTheDocument();

    rerender(
      <Status.Error
        data-testid="status-error"
        description="Custom description"
        title="Custom title"
      />
    );

    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('renders all remaining presets with default copy and default intents', () => {
    const { rerender } = render(<Status.PageNotFound data-testid="preset" />);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText(
        "The page you're looking for doesn't exist or has moved."
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('preset')).toHaveClass(styles.intentNeutral);

    rerender(<Status.Disconnected data-testid="preset" />);

    expect(screen.getByText("You're disconnected")).toBeInTheDocument();
    expect(
      screen.getByText('You appear to be offline. Reconnect and try again.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('preset')).toHaveClass(styles.intentWarning);

    rerender(<Status.NoResults data-testid="preset" />);

    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(
      screen.getByText(
        'No matching items were found. Adjust filters and try again.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('preset')).toHaveClass(styles.intentNeutral);

    rerender(<Status.PermissionDenied data-testid="preset" />);

    expect(screen.getByText('Permission denied')).toBeInTheDocument();
    expect(
      screen.getByText("You don't have permission to view this content.")
    ).toBeInTheDocument();
    expect(screen.getByTestId('preset')).toHaveClass(styles.intentWarning);
  });

  it('uses description, then children, then default description precedence', () => {
    const { rerender } = render(
      <Status.Empty children="Child copy" description="Description copy" />
    );

    expect(screen.getByText('Description copy')).toBeInTheDocument();
    expect(screen.queryByText('Child copy')).not.toBeInTheDocument();

    rerender(<Status.Empty>Child copy</Status.Empty>);

    expect(screen.getByText('Child copy')).toBeInTheDocument();
    expect(
      screen.queryByText('There is nothing to show here yet.')
    ).not.toBeInTheDocument();

    rerender(<Status.Empty />);

    expect(
      screen.getByText('There is nothing to show here yet.')
    ).toBeInTheDocument();
  });

  it('applies logical alignment classes in LTR and RTL contexts', () => {
    const { rerender } = render(
      <div dir="ltr">
        <Status align="start" data-testid="status-ltr" />
      </div>
    );

    expect(screen.getByTestId('status-ltr')).toHaveClass(styles.alignStart);

    rerender(
      <div dir="rtl">
        <Status align="end" data-testid="status-rtl" />
      </div>
    );

    expect(screen.getByTestId('status-rtl')).toHaveClass(styles.alignEnd);
  });

  it('has no basic accessibility regressions', async () => {
    const { container } = render(
      <Status>
        <Status.Content>
          <Status.Title>No projects yet</Status.Title>
          <Status.Description>Create your first project.</Status.Description>
        </Status.Content>
      </Status>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('throws a clear error when asChild receives a non-element child', () => {
    expect(() =>
      render(
        <Status>
          <Status.Title asChild>{'invalid-child'}</Status.Title>
        </Status>
      )
    ).toThrow(
      'ThemeShift Status.Title with asChild expects a single React element child.'
    );
  });
});
