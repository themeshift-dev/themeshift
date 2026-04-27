import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Badge } from './index';
import styles from './Badge.module.scss';

describe('Badge', () => {
  it('renders a span by default', () => {
    render(<Badge>Active</Badge>);

    const label = screen.getByText('Active');
    const badge = label.closest(`.${styles.root}`);

    expect(badge).toHaveProperty('tagName', 'SPAN');
    expect(badge).toHaveClass(styles.root);
  });

  it('supports asChild and merges classes onto the child element', () => {
    render(
      <Badge asChild className="custom-badge" tone="warning">
        <a href="/pending">Pending</a>
      </Badge>
    );

    const link = screen.getByRole('link', { name: 'Pending' });

    expect(link).toHaveClass(
      styles.root,
      styles.toneWarningSoft,
      'custom-badge'
    );
    expect(link).toHaveAttribute('href', '/pending');
  });

  it('supports polymorphic rendering via the as prop', () => {
    render(
      <Badge as="a" href="/pending" tone="warning">
        Pending
      </Badge>
    );

    const link = screen.getByRole('link', { name: 'Pending' });

    expect(link).toHaveAttribute('href', '/pending');
    expect(link).toHaveClass(styles.root, styles.toneWarningSoft);
  });

  it('throws when asChild is set without a valid React element child', () => {
    expect(() => render(<Badge asChild>Pending</Badge>)).toThrowError(
      'ThemeShift Badge with asChild expects a single React element child.'
    );
  });

  it('supports semantic tone and variant combinations', () => {
    render(
      <>
        <Badge data-testid="success-soft" tone="success" variant="soft">
          Active
        </Badge>
        <Badge data-testid="warning-solid" tone="warning" variant="solid">
          Pending
        </Badge>
        <Badge data-testid="danger-outline" tone="danger" variant="outline">
          Failed
        </Badge>
      </>
    );

    expect(screen.getByTestId('success-soft')).toHaveClass(
      styles.toneSuccessSoft
    );
    expect(screen.getByTestId('warning-solid')).toHaveClass(
      styles.toneWarningSolid
    );
    expect(screen.getByTestId('danger-outline')).toHaveClass(
      styles.toneDangerOutline
    );
  });

  it('supports curated color mode', () => {
    render(
      <>
        <Badge color="blue">Frontend</Badge>
        <Badge color="purple">Design</Badge>
      </>
    );

    expect(screen.getByText('Frontend').closest(`.${styles.root}`)).toHaveClass(
      styles.colorBlue
    );
    expect(screen.getByText('Design').closest(`.${styles.root}`)).toHaveClass(
      styles.colorPurple
    );
  });

  it('renders icons before or after label text based on iconPosition', () => {
    render(
      <>
        <Badge icon={<svg aria-label="start icon" />} iconPosition="start">
          Start
        </Badge>
        <Badge icon={<svg aria-label="end icon" />} iconPosition="end">
          End
        </Badge>
      </>
    );

    expect(screen.getByLabelText('start icon')).toBeInTheDocument();
    expect(screen.getByLabelText('end icon')).toBeInTheDocument();
  });

  it('exposes the Badge.Count compound member', () => {
    expect(Badge.Count).toBeDefined();
  });

  it('has no accessibility violations for representative root renders', async () => {
    const { container, rerender } = render(
      <Badge icon={<svg aria-hidden="true" />} tone="success" variant="soft">
        Active
      </Badge>
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Badge asChild tone="warning" variant="solid">
        <a href="/pending">Pending</a>
      </Badge>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Badge.Count', () => {
  it('always renders a span element', () => {
    render(<Badge.Count count={3} data-testid="count" />);

    expect(screen.getByTestId('count')).toHaveProperty('tagName', 'SPAN');
  });

  it('renders numeric count when provided', () => {
    render(<Badge.Count count={3} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('supports max overflow formatting', () => {
    render(<Badge.Count count={120} max={99} />);

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('hides zero count by default and can show it with showZero', () => {
    const { rerender } = render(<Badge.Count count={0} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();

    rerender(<Badge.Count count={0} showZero />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders dot mode without numeric text', () => {
    render(<Badge.Count dot data-testid="dot" />);

    const count = screen.getByTestId('dot');

    expect(count.querySelector(`.${styles.dot}`)).toBeInTheDocument();
    expect(count).not.toHaveTextContent('0');
  });

  it('renders textDot mode as a centered text bullet', () => {
    render(<Badge.Count data-testid="text-dot" textDot />);

    const count = screen.getByTestId('text-dot');
    const textContent = count.textContent ?? '';

    expect(count.querySelector(`.${styles.textDot}`)).toBeInTheDocument();
    expect(textContent === '•' || textContent === '·').toBe(true);
  });

  it('positions the indicator around anchor content with logical placement', () => {
    render(
      <Badge.Count count={5} placement="bottom-start" data-testid="count">
        <span>Anchor</span>
      </Badge.Count>
    );

    const count = screen.getByTestId('count');

    expect(count).toHaveClass(styles.anchored, styles.bottomStart);
    expect(count).toHaveAttribute('data-placement', 'bottom-start');
    expect(screen.getByText('Anchor')).toBeInTheDocument();
  });

  it('is static by default without live region announcements', () => {
    render(<Badge.Count count={3} data-testid="count" />);

    expect(screen.getByTestId('count')).not.toHaveAttribute('aria-live');
  });

  it('has no accessibility violations for representative count renders', async () => {
    const { container, rerender } = render(<Badge.Count count={9} />);

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Badge.Count count={12} placement="top-start">
        <button aria-label="Notifications" type="button">
          Inbox
        </button>
      </Badge.Count>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
