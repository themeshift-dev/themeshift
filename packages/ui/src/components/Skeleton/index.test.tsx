import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Skeleton, SkeletonAvatar, SkeletonRoot, SkeletonText } from './index';
import rootStyles from './components/SkeletonRoot/SkeletonRoot.module.scss';

describe('Skeleton', () => {
  it('forces aria-hidden on SkeletonRoot', () => {
    render(<SkeletonRoot aria-hidden={false} data-testid="root" />);

    expect(screen.getByTestId('root')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards container props on SkeletonText and isolates line props', () => {
    render(
      <SkeletonText
        data-testid="container"
        id="skeleton-text"
        lineProps={{ 'data-testid': 'line' }}
        lines={2}
      />
    );

    const container = screen.getByTestId('container');
    const lines = screen.getAllByTestId('line');

    expect(container).toHaveAttribute('id', 'skeleton-text');
    expect(container).toHaveAttribute('aria-hidden', 'true');

    for (const line of lines) {
      expect(line).toHaveAttribute('aria-hidden', 'true');
      expect(line).not.toHaveAttribute('id', 'skeleton-text');
    }
  });

  it('has no basic axe violations', async () => {
    const { container } = render(<SkeletonText lines={1} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('applies size and circle overrides on SkeletonRoot and supports no animation', () => {
    render(
      <SkeletonRoot animation="none" circle data-testid="root" size={40} />
    );

    const root = screen.getByTestId('root');

    expect(root).toHaveStyle({
      borderRadius: '9999px',
      height: '40px',
      width: '40px',
    });
    expect(root).toHaveClass(rootStyles.container);
    expect(root).not.toHaveClass(rootStyles.pulse);
    expect(root).not.toHaveClass(rootStyles.shimmer);
  });

  it('renders SkeletonAvatar defaults and exposes compound members', () => {
    render(<Skeleton.Avatar data-testid="avatar" />);

    expect(Skeleton.Text).toBeDefined();
    expect(Skeleton.Avatar).toBeDefined();
    expect(screen.getByTestId('avatar')).toHaveStyle({
      borderRadius: '9999px',
      height: '48px',
      width: '48px',
    });
  });

  it('lets SkeletonAvatar override defaults', () => {
    render(
      <SkeletonAvatar
        animation="shimmer"
        circle={false}
        data-testid="avatar"
        size={32}
      />
    );

    const avatar = screen.getByTestId('avatar');

    expect(avatar).toHaveClass(rootStyles.shimmer);
    expect(avatar).toHaveStyle({
      borderRadius: '0.5rem',
      height: '32px',
      width: '32px',
    });
  });
});
