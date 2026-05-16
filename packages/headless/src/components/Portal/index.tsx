import { Fragment, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Props for rendering content in a DOM portal. */
export type PortalProps = {
  /** Content rendered either in-place or into the portal container. */
  children: ReactNode;

  /** Custom portal mount target. Defaults to `document.body` when available. */
  container?: HTMLElement | null;

  /** Renders children inline without using `createPortal`. */
  disabled?: boolean;
};

/** Renders children into a detached DOM container for overlay-style UI. */
export const Portal = ({
  children,
  container,
  disabled = false,
}: PortalProps) => {
  if (disabled || typeof document === 'undefined') {
    return <Fragment>{children}</Fragment>;
  }

  const target = container ?? document.body;

  if (!target) {
    return <Fragment>{children}</Fragment>;
  }

  return createPortal(children, target);
};
