import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import boxStyles from '@/components/Box/Box.module.scss';

import { Grid } from './index';

describe('Grid', () => {
  it('renders grid display by default', () => {
    render(<Grid data-testid="grid">Content</Grid>);

    const grid = screen.getByTestId('grid');

    expect(grid).toHaveClass(boxStyles.root);
    expect(grid).toHaveStyle({ '--ts-display-base': 'grid' });
  });

  it('supports polymorphic rendering and native prop passthrough', () => {
    render(
      <Grid
        aria-label="Dashboard layout"
        as="section"
        className="custom-grid"
        data-testid="grid"
      >
        Content
      </Grid>
    );

    const grid = screen.getByTestId('grid');

    expect(grid).toHaveProperty('tagName', 'SECTION');
    expect(grid).toHaveAttribute('aria-label', 'Dashboard layout');
    expect(grid).toHaveClass('custom-grid');
  });

  it('maps numeric columns to equal tracks', () => {
    render(
      <Grid columns={3} data-testid="grid">
        Content
      </Grid>
    );

    expect(screen.getByTestId('grid')).toHaveStyle({
      '--ts-grid-template-columns-base': 'repeat(3, minmax(0, 1fr))',
    });
  });

  it('uses templateColumns when both columns and templateColumns are provided', () => {
    render(
      <Grid columns={3} data-testid="grid" templateColumns="200px 1fr auto">
        Content
      </Grid>
    );

    expect(screen.getByTestId('grid')).toHaveStyle({
      '--ts-grid-template-columns-base': '200px 1fr auto',
    });
  });

  it('resolves responsive grid tracks and spacing tokens', () => {
    render(
      <Grid
        columns={{ base: 1, tablet: 2, desktop: 4 }}
        data-testid="grid"
        gap={{ base: '3', tablet: '4', desktop: '6' }}
        inline={{ base: false, desktop: true }}
      >
        Content
      </Grid>
    );

    expect(screen.getByTestId('grid')).toHaveStyle({
      '--ts-display-base': 'grid',
      '--ts-display-desktop': 'inline-grid',
      '--ts-gap-base': 'var(--themeshift-space-3)',
      '--ts-gap-tablet': 'var(--themeshift-space-4)',
      '--ts-gap-desktop': 'var(--themeshift-space-6)',
      '--ts-grid-template-columns-base': 'repeat(1, minmax(0, 1fr))',
      '--ts-grid-template-columns-tablet': 'repeat(2, minmax(0, 1fr))',
      '--ts-grid-template-columns-desktop': 'repeat(4, minmax(0, 1fr))',
    });
  });

  it('exposes Grid.Item as a compound member and maps placement props', () => {
    render(
      <Grid columns={12} data-testid="grid">
        <Grid.Item
          alignSelf="start"
          columnSpan={{ base: 12, desktop: 8 }}
          data-testid="item"
          justifySelf="end"
          rowSpan={2}
        >
          Panel
        </Grid.Item>
      </Grid>
    );

    const item = screen.getByTestId('item');

    expect(typeof Grid.Item).toBe('function');
    expect(item).toHaveClass(boxStyles.item);
    expect(item).toHaveStyle({
      '--ts-align-self-base': 'flex-start',
      '--ts-grid-column-end-base': 'span 12',
      '--ts-grid-column-end-desktop': 'span 8',
      '--ts-grid-row-end-base': 'span 2',
      '--ts-justify-self-base': 'flex-end',
    });
  });

  it('supports Grid.Item full column span shortcut', () => {
    render(
      <Grid columns={12}>
        <Grid.Item columnSpan="full" data-testid="item">
          Full width
        </Grid.Item>
      </Grid>
    );

    expect(screen.getByTestId('item')).toHaveStyle({
      '--ts-grid-column-end-base': '-1',
      '--ts-grid-column-start-base': '1',
    });
  });

  it('maps 2/1/1 responsive column spans for common dashboard layouts', () => {
    render(
      <Grid columns={{ base: 1, desktop: 4 }} data-testid="grid" gap="4">
        <Grid.Item columnSpan={{ base: 1, desktop: 2 }} data-testid="item-main">
          Main
        </Grid.Item>
        <Grid.Item
          columnSpan={{ base: 1, desktop: 1 }}
          data-testid="item-actions"
        >
          Actions
        </Grid.Item>
        <Grid.Item
          columnSpan={{ base: 1, desktop: 1 }}
          data-testid="item-status"
        >
          Status
        </Grid.Item>
      </Grid>
    );

    expect(screen.getByTestId('grid')).toHaveStyle({
      '--ts-grid-template-columns-base': 'repeat(1, minmax(0, 1fr))',
      '--ts-grid-template-columns-desktop': 'repeat(4, minmax(0, 1fr))',
    });

    expect(screen.getByTestId('item-main')).toHaveStyle({
      '--ts-grid-column-end-base': 'span 1',
      '--ts-grid-column-end-desktop': 'span 2',
    });

    expect(screen.getByTestId('item-actions')).toHaveStyle({
      '--ts-grid-column-end-base': 'span 1',
      '--ts-grid-column-end-desktop': 'span 1',
    });

    expect(screen.getByTestId('item-status')).toHaveStyle({
      '--ts-grid-column-end-base': 'span 1',
      '--ts-grid-column-end-desktop': 'span 1',
    });
  });

  it('maps full + 6/6 spans for full-width row followed by two half-width items', () => {
    render(
      <Grid columns={12} data-testid="grid" gap="4">
        <Grid.Item columnSpan="full" data-testid="item-full">
          Full
        </Grid.Item>
        <Grid.Item
          columnSpan={{ base: 12, desktop: 6 }}
          data-testid="item-left"
        >
          Left
        </Grid.Item>
        <Grid.Item
          columnSpan={{ base: 12, desktop: 6 }}
          data-testid="item-right"
        >
          Right
        </Grid.Item>
      </Grid>
    );

    expect(screen.getByTestId('item-full')).toHaveStyle({
      '--ts-grid-column-start-base': '1',
      '--ts-grid-column-end-base': '-1',
    });

    expect(screen.getByTestId('item-left')).toHaveStyle({
      '--ts-grid-column-end-base': 'span 12',
      '--ts-grid-column-end-desktop': 'span 6',
    });

    expect(screen.getByTestId('item-right')).toHaveStyle({
      '--ts-grid-column-end-base': 'span 12',
      '--ts-grid-column-end-desktop': 'span 6',
    });
  });

  it('has no accessibility violations for representative content', async () => {
    const { container } = render(
      <Grid columns={{ base: 1, tablet: 2 }} gap="4">
        <Grid.Item>First</Grid.Item>
        <Grid.Item>Second</Grid.Item>
      </Grid>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
