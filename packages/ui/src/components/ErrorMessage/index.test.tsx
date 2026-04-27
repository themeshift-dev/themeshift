import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ErrorMessage } from './index';
import styles from './ErrorMessage.module.scss';

describe('ErrorMessage', () => {
  it('renders alert role by default and merges className', () => {
    render(<ErrorMessage className="custom">Invalid value</ErrorMessage>);

    const message = screen.getByRole('alert');

    expect(message).toHaveClass(styles.container, 'custom');
    expect(message).toHaveTextContent('Invalid value');
  });

  it('supports overriding the role prop', () => {
    render(<ErrorMessage role="status">Saved</ErrorMessage>);

    const message = screen.getByRole('status');

    expect(message).toHaveTextContent('Saved');
  });
});
