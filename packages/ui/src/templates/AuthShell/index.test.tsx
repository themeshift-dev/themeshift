import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import styles from './AuthShell.module.scss';
import { AuthShell } from './index';

describe('AuthShell', () => {
  it('defaults the main landmark id and skip-link label', () => {
    render(<AuthShell>Auth content</AuthShell>);

    expect(
      screen.getByRole('link', { name: 'Skip to main content' }),
    ).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('renders the primary auth content inside the main landmark', () => {
    render(<AuthShell>Sign in form</AuthShell>);

    expect(screen.getByRole('main')).toContainElement(
      screen.getByText('Sign in form'),
    );
  });

  it('renders optional auth regions only when provided', () => {
    render(
      <AuthShell
        footer={<p>Need help?</p>}
        heading={<h1>Welcome back</h1>}
        logo={<span>ThemeShift</span>}
        supportingContent={<p>Use your work email to continue.</p>}
      >
        Sign in form
      </AuthShell>,
    );

    expect(screen.getByText('ThemeShift')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByText('Use your work email to continue.')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Need help?');
  });

  it('applies centered layout modifiers predictably', () => {
    render(
      <AuthShell alignment="start" card width="narrow">
        Sign in form
      </AuthShell>,
    );

    const main = screen.getByRole('main');
    const mainInner = main.firstElementChild;

    expect(screen.getByRole('main').parentElement?.parentElement).toHaveClass(
      styles.container,
      styles.centered,
      styles.alignStart,
      styles.fullHeight,
      styles.padded,
    );
    expect(main).toHaveClass(styles.main);
    expect(main.parentElement).toHaveClass(styles.layout);
    expect(mainInner).toHaveClass(styles.mainInner, styles.widthNarrow, styles.card);
  });

  it('renders the split visual region only when split mode and visual content are provided', () => {
    const { rerender } = render(<AuthShell split>Sign in form</AuthShell>);

    expect(screen.queryByText('Brand panel')).not.toBeInTheDocument();

    rerender(
      <AuthShell divider split visual={<div>Brand panel</div>}>
        Sign in form
      </AuthShell>,
    );

    expect(screen.getByText('Brand panel')).toBeInTheDocument();
    expect(screen.getByRole('main').parentElement).toHaveClass(
      styles.layout,
      styles.splitLayout,
      styles.splitDivider,
    );
  });

  it('supports polymorphic outer and main elements', () => {
    render(
      <AuthShell as="section" mainAs="div" mainLabel="Authentication content">
        Sign in form
      </AuthShell>,
    );

    expect(screen.getByText('Sign in form').closest('section')).toBeInTheDocument();
    expect(screen.getByLabelText('Authentication content')).toHaveProperty(
      'tagName',
      'DIV',
    );
  });

  it('has no accessibility violations for representative auth variants', async () => {
    const { container, rerender } = render(
      <AuthShell
        card
        heading={<h1>Sign in</h1>}
        logo={<span>ThemeShift</span>}
        supportingContent={<p>Use your account to continue.</p>}
      >
        <form>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" />
        </form>
      </AuthShell>,
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <AuthShell
        footer={<a href="/support">Support</a>}
        split
        visual={<div>Illustration</div>}
      >
        <form>
          <label htmlFor="code">Code</label>
          <input id="code" name="code" />
        </form>
      </AuthShell>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
