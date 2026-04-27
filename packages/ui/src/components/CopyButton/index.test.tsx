import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import buttonStyles from '@/components/Button/Button.module.scss';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

import { CopyButton } from './index';

const hookState = vi.hoisted(() => ({
  copy: vi.fn<(value: string) => Promise<boolean>>(),
  wasCopied: false,
}));

vi.mock('@/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: vi.fn(() => [hookState.wasCopied, hookState.copy]),
}));

describe('CopyButton', () => {
  beforeEach(() => {
    hookState.wasCopied = false;
    hookState.copy.mockReset();
    hookState.copy.mockResolvedValue(true);
    vi.mocked(useCopyToClipboard).mockImplementation(() => [
      hookState.wasCopied,
      hookState.copy,
    ]);
  });

  it('calls copy with the provided value when clicked', async () => {
    const user = userEvent.setup();

    render(<CopyButton value="alpha">Copy</CopyButton>);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(hookState.copy).toHaveBeenCalledTimes(1);
    expect(hookState.copy).toHaveBeenCalledWith('alpha');
  });

  it('shows confirmationMessage while copied and restores children afterward', () => {
    const { rerender } = render(
      <CopyButton confirmationMessage="Copied" value="alpha">
        Copy
      </CopyButton>
    );

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();

    hookState.wasCopied = true;
    rerender(
      <CopyButton confirmationMessage="Copied" value="alpha">
        Copy
      </CopyButton>
    );

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

    hookState.wasCopied = false;
    rerender(
      <CopyButton confirmationMessage="Copied" value="alpha">
        Copy
      </CopyButton>
    );

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('shows errorMessage when copy fails', async () => {
    const user = userEvent.setup();
    hookState.copy.mockResolvedValue(false);

    render(
      <CopyButton errorMessage="Copy failed" value="alpha">
        Copy
      </CopyButton>
    );

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(
      screen.getByRole('button', { name: 'Copy failed' })
    ).toBeInTheDocument();
  });

  it('uses children resolver output over confirmation and error fallbacks', async () => {
    const user = userEvent.setup();
    hookState.copy.mockResolvedValue(false);
    const children = vi.fn((wasCopied: boolean) =>
      wasCopied ? 'Resolver copied' : 'Resolver idle'
    );
    const { rerender } = render(
      <CopyButton
        children={children}
        confirmationMessage="Copied"
        errorMessage="Failed"
        value="alpha"
      />
    );

    expect(
      screen.getByRole('button', { name: 'Resolver idle' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Resolver idle' }));

    expect(
      screen.getByRole('button', { name: 'Resolver idle' })
    ).toBeInTheDocument();

    hookState.wasCopied = true;
    rerender(
      <CopyButton
        children={children}
        confirmationMessage="Copied"
        errorMessage="Failed"
        value="alpha"
      />
    );

    expect(
      screen.getByRole('button', { name: 'Resolver copied' })
    ).toBeInTheDocument();
  });

  it('supports dynamic aria-label resolver for icon-only usage', () => {
    hookState.wasCopied = true;

    render(
      <CopyButton
        aria-label={(wasCopied) => (wasCopied ? 'Copied' : 'Copy')}
        icon={<span aria-hidden>icon</span>}
        value="alpha"
      />
    );

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('calls onCopySuccess and onCopyError callbacks for copy outcomes', async () => {
    const user = userEvent.setup();
    const onCopySuccess = vi.fn();
    const onCopyError = vi.fn();

    render(
      <CopyButton
        onCopyError={onCopyError}
        onCopySuccess={onCopySuccess}
        value="alpha"
      >
        Copy
      </CopyButton>
    );

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(onCopySuccess).toHaveBeenCalledTimes(1);
    expect(onCopySuccess).toHaveBeenCalledWith('alpha');
    expect(onCopyError).not.toHaveBeenCalled();

    hookState.copy.mockResolvedValue(false);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(onCopyError).toHaveBeenCalledTimes(1);
    expect(onCopyError).toHaveBeenCalledWith(expect.any(Error), 'alpha');
  });

  it('forwards non-click props to Button', () => {
    render(
      <CopyButton
        className="custom-copy-button"
        data-testid="copy-button"
        disabled
        intent="secondary"
        value="alpha"
      >
        Copy
      </CopyButton>
    );

    const button = screen.getByRole('button', { name: 'Copy' });

    expect(button).toHaveAttribute('data-testid', 'copy-button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('custom-copy-button');
  });

  it('forwards variant to Button', () => {
    render(
      <CopyButton value="alpha" variant="link">
        Copy
      </CopyButton>
    );

    expect(screen.getByRole('button', { name: 'Copy' })).toHaveClass(
      buttonStyles.variantLink
    );
  });

  it('has no detectable accessibility violations in a representative state', async () => {
    const { container } = render(
      <CopyButton confirmationMessage="Copied" value="alpha">
        Copy
      </CopyButton>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
