import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Card } from './index';
import styles from './Card.module.scss';

describe('Card', () => {
  it('renders a div by default with default visual classes', () => {
    render(<Card data-testid="card">Simple content</Card>);

    const card = screen.getByTestId('card');

    expect(card).toHaveProperty('tagName', 'DIV');
    expect(card).toHaveClass(
      styles.root,
      styles.withBorder,
      styles.paddingMedium,
      styles.radiusMedium,
      styles.shadowNone,
      styles.surfaceDefault,
      styles.alignStart,
      styles.justifyStart
    );
  });

  it('supports polymorphic rendering on root and key slots', () => {
    render(
      <Card as="article" data-testid="card">
        <Card.Header as="header" data-testid="header">
          <Card.Title as="h2" data-testid="title">
            Analytics
          </Card.Title>
          <Card.Description as="p" data-testid="description">
            Last 7 days
          </Card.Description>
        </Card.Header>
        <Card.Body as="section" data-testid="body">
          Content
        </Card.Body>
        <Card.Footer as="footer" data-testid="footer">
          <Card.Actions as="nav" data-testid="actions">
            <button type="button">View</button>
          </Card.Actions>
        </Card.Footer>
        <Card.Media as="figure" data-testid="media">
          <img alt="Chart" src="https://example.com/chart.png" />
        </Card.Media>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveProperty('tagName', 'ARTICLE');
    expect(screen.getByTestId('header')).toHaveProperty('tagName', 'HEADER');
    expect(screen.getByTestId('title')).toHaveProperty('tagName', 'H2');
    expect(screen.getByTestId('description')).toHaveProperty('tagName', 'P');
    expect(screen.getByTestId('body')).toHaveProperty('tagName', 'SECTION');
    expect(screen.getByTestId('footer')).toHaveProperty('tagName', 'FOOTER');
    expect(screen.getByTestId('actions')).toHaveProperty('tagName', 'NAV');
    expect(screen.getByTestId('media')).toHaveProperty('tagName', 'FIGURE');
  });

  it('passes through className and aria/data props to native elements', () => {
    render(
      <Card
        aria-label="Stats card"
        className="custom-card"
        data-state="ready"
        data-testid="card"
      >
        Metrics
      </Card>
    );

    const card = screen.getByTestId('card');

    expect(card).toHaveClass('custom-card');
    expect(card).toHaveAttribute('aria-label', 'Stats card');
    expect(card).toHaveAttribute('data-state', 'ready');
  });

  it('suppresses root content padding when immediate children are card slots', () => {
    const { rerender } = render(<Card data-testid="card">Plain content</Card>);

    expect(screen.getByTestId('card')).toHaveClass(styles.paddingMedium);

    rerender(
      <Card data-testid="card">
        <Card.Body>Slot content</Card.Body>
      </Card>
    );

    expect(screen.getByTestId('card')).not.toHaveClass(
      styles.paddingSmall,
      styles.paddingMedium,
      styles.paddingLarge
    );
  });

  it('inherits root section padding and supports slot-level overrides', () => {
    render(
      <Card padding="large">
        <Card.Header data-testid="header">Header</Card.Header>
        <Card.Body data-testid="body" padding="small">
          Body
        </Card.Body>
        <Card.Footer data-testid="footer">Footer</Card.Footer>
      </Card>
    );

    expect(screen.getByTestId('header')).toHaveClass(styles.paddingLarge);
    expect(screen.getByTestId('body')).toHaveClass(styles.paddingSmall);
    expect(screen.getByTestId('footer')).toHaveClass(styles.paddingLarge);
  });

  it('uses align as a justify fallback in footer when justify is omitted', () => {
    render(
      <Card>
        <Card.Footer align="center" data-testid="footer">
          <Card.Actions data-testid="actions">
            <button type="button">View</button>
          </Card.Actions>
        </Card.Footer>
      </Card>
    );

    expect(screen.getByTestId('footer')).toHaveClass(
      styles.alignCenter,
      styles.justifyCenter
    );
    expect(screen.getByTestId('actions')).not.toHaveStyle({ width: '100%' });
  });

  it('applies media classes for aspect ratio, fit, and position', () => {
    render(
      <Card>
        <Card.Media
          aspectRatio="video"
          data-testid="media"
          fit="contain"
          position="bottom"
        >
          <img alt="Preview" src="https://example.com/preview.png" />
        </Card.Media>
      </Card>
    );

    expect(screen.getByTestId('media')).toHaveClass(
      styles.media,
      styles.aspectVideo,
      styles.fitContain,
      styles.mediaBottom
    );
  });

  it('applies actions layout classes for direction, gap, wrapping, and alignment', () => {
    render(
      <Card align="end" justify="space-between">
        <Card.Actions data-testid="actions" direction="column" gap="large" wrap>
          <button type="button">A</button>
          <button type="button">B</button>
        </Card.Actions>
      </Card>
    );

    expect(screen.getByTestId('actions')).toHaveClass(
      styles.actions,
      styles.actionsColumn,
      styles.actionsGapLarge,
      styles.actionsWrap,
      styles.alignEnd,
      styles.justifySpaceBetween
    );
  });

  it('applies start/end logical alignment classes consistently in LTR and RTL', () => {
    const { rerender } = render(
      <div dir="ltr">
        <Card.Header align="start" data-testid="header-ltr">
          LTR
        </Card.Header>
      </div>
    );

    expect(screen.getByTestId('header-ltr')).toHaveClass(styles.alignStart);

    rerender(
      <div dir="rtl">
        <Card.Header align="end" data-testid="header-rtl">
          RTL
        </Card.Header>
      </div>
    );

    expect(screen.getByTestId('header-rtl')).toHaveClass(styles.alignEnd);
  });

  it('renders Card.LinkOverlay as an anchor by default and supports polymorphic rendering', () => {
    const { rerender } = render(
      <Card>
        <Card.LinkOverlay aria-label="Open analytics" href="/analytics" />
      </Card>
    );

    const anchor = screen.getByRole('link', { name: 'Open analytics' });

    expect(anchor).toHaveProperty('tagName', 'A');
    expect(anchor).toHaveAttribute('href', '/analytics');
    expect(anchor).toHaveClass(styles.linkOverlay);

    rerender(
      <Card>
        <Card.LinkOverlay as="button" aria-label="Open analytics" />
      </Card>
    );

    expect(screen.getByRole('button', { name: 'Open analytics' })).toHaveClass(
      styles.linkOverlay
    );
  });

  it('renders Card.Divider with orientation and inset classes', () => {
    const { rerender } = render(
      <Card.Divider data-testid="divider" inset orientation="horizontal" />
    );

    expect(screen.getByTestId('divider')).toHaveClass(
      styles.divider,
      styles.dividerHorizontal,
      styles.dividerInset
    );
    expect(screen.getByTestId('divider')).toHaveAttribute(
      'aria-orientation',
      'horizontal'
    );

    rerender(<Card.Divider data-testid="divider" orientation="vertical" />);

    expect(screen.getByTestId('divider')).toHaveClass(styles.dividerVertical);
    expect(screen.getByTestId('divider')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    );
  });

  it('renders Card.Badge with default position/offset and passes Badge props through', () => {
    const { rerender } = render(
      <Card>
        <Card.Badge data-testid="badge-root" tone="info" variant="solid">
          Status
        </Card.Badge>
      </Card>
    );

    expect(screen.getByTestId('badge-root').parentElement).toHaveClass(
      styles.badgeContainer,
      styles.badgeTopEnd,
      styles.badgeOffsetSmall
    );
    expect(screen.getByText('Status').closest('span')).toBeInTheDocument();

    rerender(
      <Card>
        <Card.Badge
          as="a"
          data-testid="badge-root"
          href="/status"
          offset="medium"
          position="bottom-start"
          tone="warning"
        >
          Pending
        </Card.Badge>
      </Card>
    );

    expect(screen.getByRole('link', { name: 'Pending' })).toHaveAttribute(
      'href',
      '/status'
    );
    expect(screen.getByTestId('badge-root').parentElement).toHaveClass(
      styles.badgeBottomStart,
      styles.badgeOffsetMedium
    );
  });

  it('stitches the compound API together', () => {
    expect(Card.Header).toBeDefined();
    expect(Card.Title).toBeDefined();
    expect(Card.Description).toBeDefined();
    expect(Card.Body).toBeDefined();
    expect(Card.Footer).toBeDefined();
    expect(Card.Media).toBeDefined();
    expect(Card.Actions).toBeDefined();
    expect(Card.LinkOverlay).toBeDefined();
    expect(Card.Divider).toBeDefined();
    expect(Card.Badge).toBeDefined();
  });

  it('has no accessibility violations for representative renders', async () => {
    const { container, rerender } = render(
      <Card>
        <Card.Header>
          <Card.Title>Simple Card</Card.Title>
          <Card.Description>Card description</Card.Description>
        </Card.Header>
        <Card.Body>Body content</Card.Body>
      </Card>
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Card as="article" aria-labelledby="card-title">
        <Card.Header>
          <Card.Title as="h2" id="card-title">
            Semantic Article Card
          </Card.Title>
          <Card.Description as="p">Secondary details</Card.Description>
        </Card.Header>
        <Card.Body>
          <p>Body details</p>
        </Card.Body>
        <Card.Footer>
          <Card.Actions>
            <button type="button">Action</button>
          </Card.Actions>
        </Card.Footer>
      </Card>
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Card>
        <Card.LinkOverlay aria-label="Open skyline details" href="/details" />
        <Card.Media aspectRatio="wide" fit="cover" position="top">
          <img alt="Decorative skyline" src="https://example.com/hero.png" />
        </Card.Media>
        <Card.Body>Media card body</Card.Body>
        <Card.Footer>
          <Card.Actions data-card-interactive justify="end">
            <a href="/details">Read more</a>
          </Card.Actions>
        </Card.Footer>
      </Card>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
