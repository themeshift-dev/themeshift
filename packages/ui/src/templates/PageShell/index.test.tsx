import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import styles from './PageShell.module.scss';
import { PageShell } from './index';

describe('PageShell', () => {
  it('defaults the main landmark id and skip-link label', () => {
    render(<PageShell>Page content</PageShell>);

    expect(
      screen.getByRole('link', { name: 'Skip to main content' }),
    ).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('can omit the skip link while preserving the main landmark defaults', () => {
    render(<PageShell showSkipLink={false}>Page content</PageShell>);

    expect(
      screen.queryByRole('link', { name: 'Skip to main content' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('renders children inside the main landmark', () => {
    render(<PageShell>Page content</PageShell>);

    const main = screen.getByRole('main');

    expect(main).toContainElement(screen.getByText('Page content'));
  });

  it('renders optional structural regions only when provided', () => {
    render(
      <PageShell
        aside={<p>Related help</p>}
        footer={<p>Footer content</p>}
        header={<p>Header content</p>}
        navigation={<a href="/docs">Documentation</a>}
      >
        Page content
      </PageShell>,
    );

    expect(screen.getByRole('banner')).toHaveTextContent('Header content');
    expect(screen.getByRole('navigation')).toHaveTextContent('Documentation');
    expect(screen.getByRole('complementary')).toHaveTextContent('Related help');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Footer content');
  });

  it('applies landmark labels when provided', () => {
    render(
      <PageShell
        mainLabel="Documentation content"
        navLabel="Section navigation"
        navigation={<a href="/intro">Introduction</a>}
      >
        Page content
      </PageShell>,
    );

    expect(
      screen.getByRole('main', { name: 'Documentation content' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Section navigation' }),
    ).toBeInTheDocument();
  });

  it('applies layout, padding, sticky-header, and divider classes predictably', () => {
    render(
      <PageShell
        aside={<p>Aside</p>}
        divider
        header={<p>Header content</p>}
        navigation={<p>Navigation content</p>}
        stickyHeader
      >
        Page content
      </PageShell>,
    );

    expect(screen.getByRole('banner')).toHaveClass(
      styles.header,
      styles.stickyHeader,
      styles.headerDivider,
    );
    expect(screen.getByRole('navigation')).toHaveClass(
      styles.navigation,
      styles.navigationDivider,
    );
    expect(screen.getByRole('main')).toHaveClass(styles.main);
    expect(screen.getByRole('complementary')).toHaveClass(
      styles.aside,
      styles.asideDivider,
    );

    expect(screen.getByText('Page content').closest('[class]')).toHaveClass(
      styles.regionInner,
    );
  });

  it('applies token-driven outer container layout styles', () => {
    const { container } = render(<PageShell>Page content</PageShell>);

    expect(container.firstElementChild).toHaveClass(styles.container);
  });

  it('applies the two-column content grid modifier only when an aside is present', () => {
    const { rerender } = render(<PageShell>Page content</PageShell>);

    expect(screen.getByRole('main').parentElement).toHaveClass(styles.contentGrid);
    expect(screen.getByRole('main').parentElement).not.toHaveClass(styles.withAside);

    rerender(<PageShell aside={<p>Aside</p>}>Page content</PageShell>);

    expect(screen.getByRole('main').parentElement).toHaveClass(
      styles.contentGrid,
      styles.withAside,
    );
  });

  it('supports polymorphic outer and main elements', () => {
    render(
      <PageShell as="section" mainAs="div" mainLabel="Embedded content">
        Page content
      </PageShell>,
    );

    expect(screen.getByText('Page content').closest('section')).toBeInTheDocument();
    expect(screen.getByLabelText('Embedded content')).toHaveProperty(
      'tagName',
      'DIV',
    );
  });

  it('has no accessibility violations for representative page variants', async () => {
    const { container, rerender } = render(
      <PageShell
        header={<h1>ThemeShift docs</h1>}
        navigation={
          <ul>
            <li>
              <a href="/docs/getting-started">Getting started</a>
            </li>
          </ul>
        }
      >
        <article>
          <h2>PageShell</h2>
          <p>Documentation content.</p>
        </article>
      </PageShell>,
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <PageShell
        footer={<a href="/contact">Contact</a>}
        header={<h1>Launch with ThemeShift</h1>}
      >
        <p>Marketing page content.</p>
      </PageShell>,
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <PageShell
        aside={
          <div>
            <h2>Need help?</h2>
            <p>Read the support guide.</p>
          </div>
        }
        header={<h1>Settings</h1>}
        mainLabel="Settings content"
      >
        <form>
          <label htmlFor="timezone">Timezone</label>
          <input id="timezone" name="timezone" />
        </form>
      </PageShell>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
