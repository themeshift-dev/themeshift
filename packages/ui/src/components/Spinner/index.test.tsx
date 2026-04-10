import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import styles from './Spinner.module.scss';
import { Spinner } from './index';

describe('Spinner', () => {
  it('renders an svg with a default size', () => {
    render(<Spinner aria-label="Loading" />);

    const spinner = screen.getByLabelText('Loading');

    expect(spinner.tagName).toBe('svg');
    expect(spinner).toHaveAttribute('width', '24');
    expect(spinner).toHaveAttribute('height', '24');
    expect(spinner).toHaveClass(styles.container);
  });

  it('applies a custom size', () => {
    render(<Spinner aria-label="Loading" size={40} />);

    const spinner = screen.getByLabelText('Loading');

    expect(spinner).toHaveAttribute('width', '40');
    expect(spinner).toHaveAttribute('height', '40');
  });

  it('appends a caller-provided className', () => {
    render(<Spinner aria-label="Loading" className="custom-spinner" />);

    expect(screen.getByLabelText('Loading')).toHaveClass(
      styles.container,
      'custom-spinner'
    );
  });

  it('forwards svg props to the root element', () => {
    render(
      <Spinner
        aria-label="Saving"
        aria-hidden="true"
        data-testid="spinner"
        focusable="false"
      />
    );

    expect(screen.getByTestId('spinner')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    expect(screen.getByTestId('spinner')).toHaveAttribute('focusable', 'false');
  });
});
