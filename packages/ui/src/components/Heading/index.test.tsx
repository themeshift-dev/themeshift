import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import styles from './Heading.module.scss';
import { Heading } from './index';

describe('Heading', () => {
  it('renders children as a heading', () => {
    render(<Heading>Page title</Heading>);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Page title' })
    ).toBeInTheDocument();
  });

  it('defaults to an h1', () => {
    render(<Heading>Default heading</Heading>);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveProperty('tagName', 'H1');
    expect(heading).toHaveClass(styles.heading);
    expect(heading).toHaveClass(styles.h1);
    expect(heading).not.toHaveClass(styles.muted);
  });

  it.each([
    [1, 'H1', styles.h1],
    [2, 'H2', styles.h2],
    [3, 'H3', styles.h3],
    [4, 'H4', styles.h4],
    [5, 'H5', styles.h5],
    [6, 'H6', styles.h6],
  ] as const)('renders level %i as %s', (level, tagName, className) => {
    render(<Heading level={level}>Heading level {level}</Heading>);

    const heading = screen.getByRole('heading', {
      level,
      name: `Heading level ${level}`,
    });

    expect(heading).toHaveProperty('tagName', tagName);
    expect(heading).toHaveClass(styles.heading);
    expect(heading).toHaveClass(className);
  });

  it('forwards native heading props', () => {
    render(
      <Heading
        level={2}
        id="section-heading"
        className="heading-class"
        aria-describedby="heading-description"
      >
        Section title
      </Heading>
    );

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Section title',
    });

    expect(heading).toHaveAttribute('id', 'section-heading');
    expect(heading).toHaveAttribute('aria-describedby', 'heading-description');
    expect(heading).toHaveClass('heading-class');
  });

  it('applies the muted class when muted is true', () => {
    render(
      <Heading muted level={2}>
        Muted heading
      </Heading>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Muted heading' })).toHaveClass(
      styles.muted
    );
  });

  it('does not apply the muted class when muted is false', () => {
    render(
      <Heading muted={false} level={2}>
        Default tone
      </Heading>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Default tone' })).not.toHaveClass(
      styles.muted
    );
  });

  it('renders without children', () => {
    render(<Heading aria-label="Empty heading" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Empty heading' })).toBeEmptyDOMElement();
  });

  it('has no accessibility violations for representative levels', async () => {
    const { container, rerender } = render(<Heading>Accessible title</Heading>);

    expect(await axe(container)).toHaveNoViolations();

    rerender(<Heading level={3}>Accessible subsection</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
