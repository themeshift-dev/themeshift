import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { ProgressBar, ProgressBarTrack } from './index';
import styles from './ProgressBar.module.scss';

describe('ProgressBar', () => {
  it('exposes the compound API members', () => {
    expect(ProgressBar.Label).toBeDefined();
    expect(ProgressBar.Track).toBeDefined();
    expect(ProgressBar.Indicator).toBeDefined();
    expect(ProgressBar.Value).toBeDefined();
    expect(ProgressBar.Description).toBeDefined();
  });

  it('clamps determinate values and wires aria attributes', () => {
    render(<ProgressBar label="Uploading" max={80} min={20} value={120} />);

    const progressBar = screen.getByRole('progressbar', {
      name: 'Uploading',
    });

    expect(progressBar).toHaveAttribute('aria-valuemin', '20');
    expect(progressBar).toHaveAttribute('aria-valuemax', '80');
    expect(progressBar).toHaveAttribute('aria-valuenow', '80');
  });

  it('omits aria-valuenow in indeterminate mode', () => {
    render(<ProgressBar indeterminate label="Syncing data" />);

    const progressBar = screen.getByRole('progressbar', {
      name: 'Syncing data',
    });

    expect(progressBar).not.toHaveAttribute('aria-valuenow');
  });

  it('uses shorthand label and description wiring', () => {
    render(
      <ProgressBar
        description="About 10 seconds remaining"
        label="Deploying app"
        value={48}
      />
    );

    const progressBar = screen.getByRole('progressbar', {
      name: 'Deploying app',
    });

    expect(progressBar).toHaveAccessibleDescription(
      'About 10 seconds remaining'
    );
  });

  it('renders default value text with showValue and supports formatter', () => {
    const { rerender } = render(
      <ProgressBar label="Upload" showValue value={48} />
    );

    expect(screen.getByText('48%')).toBeInTheDocument();

    rerender(
      <ProgressBar
        label="Steps"
        max={5}
        min={0}
        showValue
        value={3}
        valueFormatter={(value, max) => `${value} / ${max}`}
      />
    );

    expect(screen.getByText('3 / 5')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Steps' })).toHaveAttribute(
      'aria-valuetext',
      '3 / 5'
    );
  });

  it('uses composition-only rendering when children are provided', () => {
    render(
      <ProgressBar
        description="Should not auto render"
        label="Should not auto render"
      >
        <ProgressBar.Track aria-label="Manual progress" />
      </ProgressBar>
    );

    expect(
      screen.getByRole('progressbar', { name: 'Manual progress' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Should not auto render')
    ).not.toBeInTheDocument();
  });

  it('allows indicator and value local state overrides', () => {
    const { container } = render(
      <ProgressBar label="Override example" value={10}>
        <ProgressBar.Track>
          <ProgressBar.Indicator value={75} />
        </ProgressBar.Track>
        <ProgressBar.Value value={75} />
      </ProgressBar>
    );

    const indicator = container.querySelector(`.${styles.indicator}`);

    expect(indicator).toHaveStyle('--progress-ratio: 0.75');
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('supports vertical orientation and tone classes', () => {
    const { container } = render(
      <ProgressBar orientation="vertical" tone="constructive" value={32} />
    );

    const root = container.firstElementChild;

    expect(root).toHaveClass(styles.vertical);
    expect(root).toHaveClass(styles.toneConstructive);
    expect(root).toHaveAttribute('data-orientation', 'vertical');
  });

  it('supports track role usage standalone', () => {
    render(<ProgressBarTrack aria-label="Standalone progress" />);

    expect(
      screen.getByRole('progressbar', { name: 'Standalone progress' })
    ).toBeInTheDocument();
  });

  it('has no accessibility violations for representative renders', async () => {
    const { container, rerender } = render(
      <ProgressBar
        description="Copying assets"
        label="Deployment"
        showValue
        value={72}
      />
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <div dir="rtl">
        <ProgressBar indeterminate label="Syncing data" tone="secondary" />
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
