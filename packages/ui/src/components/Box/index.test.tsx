import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import styles from './Box.module.scss';
import { Box } from './index';

describe('Box', () => {
  it('renders a div by default', () => {
    render(<Box>Content</Box>);

    expect(screen.getByText('Content')).toHaveProperty('tagName', 'DIV');
    expect(screen.getByText('Content')).toHaveClass(styles.root);
  });

  it('supports polymorphic rendering', () => {
    render(
      <Box as="section" data-testid="box">
        Content
      </Box>
    );

    expect(screen.getByTestId('box')).toHaveProperty('tagName', 'SECTION');
  });

  it('passes through className and native props', () => {
    render(
      <Box
        aria-label="Layout region"
        className="custom-box"
        data-testid="box"
        id="box-id"
      >
        Content
      </Box>
    );

    const box = screen.getByTestId('box');

    expect(box).toHaveClass('custom-box');
    expect(box).toHaveAttribute('aria-label', 'Layout region');
    expect(box).toHaveAttribute('id', 'box-id');
  });

  it('resolves spacing token values to CSS variables', () => {
    render(
      <Box data-testid="box" marginBottom="6" padding="4">
        Content
      </Box>
    );

    const box = screen.getByTestId('box');

    expect(box).toHaveStyle({
      '--ts-margin-bottom-base': 'var(--themeshift-space-6)',
      '--ts-padding-base': 'var(--themeshift-space-4)',
    });
  });

  it('supports raw css escape hatches for spacing and size props', () => {
    render(
      <Box data-testid="box" padding="1rem" width={320}>
        Content
      </Box>
    );

    const box = screen.getByTestId('box');

    expect(box).toHaveStyle({
      '--ts-padding-base': '1rem',
      '--ts-width-base': '320',
    });
  });

  it('writes responsive values into tablet and desktop style vars', () => {
    render(
      <Box
        data-testid="box"
        display={{ base: 'block', tablet: 'flex', desktop: 'grid' }}
        padding={{ base: '2', tablet: '4', desktop: '6' }}
      >
        Content
      </Box>
    );

    const box = screen.getByTestId('box');

    expect(box).toHaveStyle({
      '--ts-display-base': 'block',
      '--ts-display-tablet': 'flex',
      '--ts-display-desktop': 'grid',
      '--ts-padding-base': 'var(--themeshift-space-2)',
      '--ts-padding-tablet': 'var(--themeshift-space-4)',
      '--ts-padding-desktop': 'var(--themeshift-space-6)',
    });
  });

  it('has no accessibility violations for representative content', async () => {
    const { container } = render(
      <Box as="section" padding="4">
        <h2>Layout heading</h2>
        <p>Layout content</p>
      </Box>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
