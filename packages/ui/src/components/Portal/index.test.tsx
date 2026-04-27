import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Portal } from './index';

describe('Portal', () => {
  it('renders into document.body by default', () => {
    render(
      <Portal>
        <div data-testid="portal-content">Portaled content</div>
      </Portal>
    );

    expect(screen.getByTestId('portal-content')).toBeInTheDocument();
    expect(document.body).toContainElement(
      screen.getByTestId('portal-content')
    );
  });

  it('renders into a custom container when provided', () => {
    const target = document.createElement('div');
    target.setAttribute('data-testid', 'custom-target');
    document.body.appendChild(target);

    render(
      <Portal container={target}>
        <span data-testid="custom-content">Custom target content</span>
      </Portal>
    );

    expect(target).toContainElement(screen.getByTestId('custom-content'));
  });

  it('renders inline when disabled', () => {
    const { container } = render(
      <div data-testid="wrapper">
        <Portal disabled>
          <span data-testid="inline-content">Inline content</span>
        </Portal>
      </div>
    );

    const wrapper = screen.getByTestId('wrapper');

    expect(wrapper).toContainElement(screen.getByTestId('inline-content'));
    expect(container).toContainElement(screen.getByTestId('inline-content'));
  });

  it('renders inline when no portal target is available', () => {
    const { container } = render(
      <div data-testid="fallback-wrapper">
        <Portal container={0 as unknown as HTMLElement}>
          <span data-testid="fallback-content">Fallback content</span>
        </Portal>
      </div>
    );

    const wrapper = screen.getByTestId('fallback-wrapper');

    expect(wrapper).toContainElement(screen.getByTestId('fallback-content'));
    expect(container).toContainElement(screen.getByTestId('fallback-content'));
  });
});
