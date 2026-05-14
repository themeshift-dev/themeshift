import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Avatar } from './index';
import styles from './Avatar.module.scss';

describe('Avatar', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('supports the compound API', () => {
    expect(Avatar.Root).toBeDefined();
    expect(Avatar.Image).toBeDefined();
    expect(Avatar.Fallback).toBeDefined();
    expect(Avatar.Badge).toBeDefined();
    expect(Avatar.Group).toBeDefined();
    expect(Avatar.GroupItem).toBeDefined();
    expect(Avatar.Overflow).toBeDefined();
  });

  it('renders shorthand usage with deterministic fallback initials', () => {
    render(<Avatar data-testid="avatar" name="Mae Jemison" />);

    const root = screen.getByTestId('avatar');

    expect(root).toHaveClass(
      styles.root,
      styles.sizeMedium,
      styles.shapeCircle
    );
    expect(root).toHaveAttribute('aria-label', 'Mae Jemison');
    expect(screen.getByText('MJ')).toBeInTheDocument();
  });

  it('uses decorative semantics when decorative is true', () => {
    const { container } = render(
      <Avatar decorative name="Mae Jemison" src="/avatar.png" />
    );
    const image = container.querySelector('img');

    expect(image).not.toBeNull();
    expect(image).toHaveAttribute('alt', '');
    expect(screen.queryByLabelText('Mae Jemison')).not.toBeInTheDocument();
  });

  it('calls onLoadingStatusChange across image transitions', () => {
    const onLoadingStatusChange = vi.fn();

    const { container } = render(
      <Avatar.Root>
        <Avatar.Image
          alt="Neil Armstrong"
          onLoadingStatusChange={onLoadingStatusChange}
          src="/neil.png"
        />
        <Avatar.Fallback>NA</Avatar.Fallback>
      </Avatar.Root>
    );

    const image = container.querySelector('img');
    expect(image).not.toBeNull();

    expect(onLoadingStatusChange).toHaveBeenCalledWith('loading');

    image?.dispatchEvent(new Event('load'));

    expect(onLoadingStatusChange).toHaveBeenCalledWith('loaded');
  });

  it('shows fallback when image errors', () => {
    const { container } = render(
      <Avatar.Root name="Neil Armstrong">
        <Avatar.Image src="/broken.png" />
        <Avatar.Fallback />
      </Avatar.Root>
    );

    const image = container.querySelector('img');
    expect(image).not.toBeNull();

    image?.dispatchEvent(new Event('error'));

    expect(screen.getByText('NA')).toBeInTheDocument();
  });

  it('supports explicit initials and custom fallback content precedence', () => {
    const { rerender } = render(
      <Avatar.Root name="Sally Ride">
        <Avatar.Fallback initials="SR" />
      </Avatar.Root>
    );

    expect(screen.getByText('SR')).toBeInTheDocument();

    rerender(
      <Avatar.Root name="Sally Ride">
        <Avatar.Fallback initials="SR">Custom</Avatar.Fallback>
      </Avatar.Root>
    );

    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('renders group overflow and accessible label', () => {
    render(
      <Avatar.Group aria-label="Crew members" max={3} total={5}>
        <Avatar name="Neil Armstrong" />
        <Avatar name="Buzz Aldrin" />
        <Avatar name="Michael Collins" />
        <Avatar name="Mae Jemison" />
      </Avatar.Group>
    );

    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-label',
      'Crew members'
    );
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByLabelText('2 more members')).toBeInTheDocument();
  });

  it('supports custom overlap on Avatar.Group', () => {
    render(
      <Avatar.Group data-testid="group" overlap={14}>
        <Avatar name="Neil Armstrong" />
        <Avatar name="Buzz Aldrin" />
      </Avatar.Group>
    );

    expect(screen.getByTestId('group')).toHaveStyle({
      '--avatar-group-overlap': '14px',
    });
  });

  it('applies separator styling by default and supports opt-out', () => {
    const { rerender } = render(
      <Avatar.Group data-testid="group">
        <Avatar name="Neil Armstrong" />
        <Avatar name="Buzz Aldrin" />
      </Avatar.Group>
    );

    expect(screen.getByTestId('group')).toHaveClass(styles.groupSeparated);

    rerender(
      <Avatar.Group data-testid="group" separated={false}>
        <Avatar name="Neil Armstrong" />
        <Avatar name="Buzz Aldrin" />
      </Avatar.Group>
    );

    expect(screen.getByTestId('group')).not.toHaveClass(styles.groupSeparated);
  });

  it('renders badge with placement and custom label', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>MJ</Avatar.Fallback>
        <Avatar.Badge aria-label="Online" placement="bottom-end">
          <span data-testid="dot">•</span>
        </Avatar.Badge>
      </Avatar.Root>
    );

    expect(screen.getByLabelText('Online')).toHaveClass(
      styles.badge,
      styles.bottomEnd
    );
    expect(screen.getByTestId('dot')).toBeInTheDocument();
  });

  it('maps Avatar.Root to Avatar shorthand for DX aliasing', () => {
    const { rerender } = render(<Avatar data-testid="avatar" name="A" />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();

    rerender(
      <Avatar.Root data-testid="avatar" name="B">
        <Avatar.Fallback />
      </Avatar.Root>
    );

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('has no basic accessibility regressions', async () => {
    const { container } = render(
      <Avatar.Group aria-label="Project members" max={2} total={3}>
        <Avatar name="Mae Jemison" src="/mae.png" />
        <Avatar name="Sally Ride" src="/sally.png" />
        <Avatar name="Neil Armstrong" src="/neil.png" />
      </Avatar.Group>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
