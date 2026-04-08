import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import styles from './Link.module.scss';
import { Link } from './index';

describe('Link', () => {
  it('renders an anchor with the provided href', () => {
    render(<Link href="/docs">Documentation</Link>);

    const link = screen.getByRole('link', { name: 'Documentation' });

    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveClass(styles.container);
  });

  it('can apply its styles to a child element when asChild is set', () => {
    render(
      <Link asChild>
        <a className="custom-link" href="/docs">
          Documentation
        </a>
      </Link>
    );

    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveClass(
      styles.container,
      'custom-link'
    );
  });
});
