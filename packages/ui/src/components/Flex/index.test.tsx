import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import styles from '@/components/Box/Box.module.scss';

import { Flex } from './index';

describe('Flex', () => {
  it('renders flex display by default', () => {
    render(<Flex data-testid="flex">Content</Flex>);

    const flex = screen.getByTestId('flex');

    expect(flex).toHaveClass(styles.root);
    expect(flex).toHaveStyle({ '--ts-display-base': 'flex' });
  });

  it('supports polymorphic rendering and native prop passthrough', () => {
    render(
      <Flex
        aria-label="Toolbar"
        as="nav"
        className="toolbar"
        data-testid="flex"
      >
        Content
      </Flex>
    );

    const flex = screen.getByTestId('flex');

    expect(flex).toHaveProperty('tagName', 'NAV');
    expect(flex).toHaveAttribute('aria-label', 'Toolbar');
    expect(flex).toHaveClass('toolbar');
  });

  it('maps inline and direction values responsively', () => {
    render(
      <Flex
        data-testid="flex"
        direction={{ base: 'column', tablet: 'row' }}
        inline={{ base: false, tablet: true }}
      >
        Content
      </Flex>
    );

    expect(screen.getByTestId('flex')).toHaveStyle({
      '--ts-display-base': 'flex',
      '--ts-display-tablet': 'inline-flex',
      '--ts-flex-direction-base': 'column',
      '--ts-flex-direction-tablet': 'row',
    });
  });

  it('maps justify and align aliases to ergonomic css values', () => {
    render(
      <Flex align="start" data-testid="flex" justify="between">
        Content
      </Flex>
    );

    expect(screen.getByTestId('flex')).toHaveStyle({
      '--ts-align-items-base': 'flex-start',
      '--ts-justify-content-base': 'space-between',
    });
  });

  it('resolves spacing tokens for gap props', () => {
    render(
      <Flex columnGap="5" data-testid="flex" gap="4" rowGap="6">
        Content
      </Flex>
    );

    expect(screen.getByTestId('flex')).toHaveStyle({
      '--ts-column-gap-base': 'var(--themeshift-space-5)',
      '--ts-gap-base': 'var(--themeshift-space-4)',
      '--ts-row-gap-base': 'var(--themeshift-space-6)',
    });
  });

  it('has no accessibility violations for representative content', async () => {
    const { container } = render(
      <Flex align="center" gap="4" justify="between">
        <button type="button">Primary action</button>
        <button type="button">Secondary action</button>
      </Flex>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
