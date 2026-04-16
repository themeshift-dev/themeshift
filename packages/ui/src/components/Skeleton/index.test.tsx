import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { SkeletonRoot, SkeletonText } from './index';

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
});
