import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';

import type { Placement } from '@/hooks/useAnchoredPosition';

/** Supported tooltip placements. */
export type TooltipPlacement = Placement;

/** Shared timing defaults for tooltips in the same interaction scope. */
export type TooltipProviderProps = {
  /** Tooltip trees that should share timing behavior. */
  children: ReactNode;

  /** Delay before opening tooltips. */
  delay?: number;

  /** Delay before closing tooltips on pointer leave. */
  closeDelay?: number;

  /** Duration where neighboring tooltips can open immediately after one opens. */
  skipDelayDuration?: number;
};

/** Props for tooltip root behavior and convenience composition. */
export type TooltipRootOwnProps = {
  /** Tooltip trigger/content composition or convenience child trigger element. */
  children: ReactNode;

  /**
   * Convenience content for `<Tooltip content="...">` usage.
   *
   * When provided, Tooltip automatically renders Trigger and Content internally.
   */
  content?: ReactNode;

  /** Preferred tooltip placement relative to trigger. */
  placement?: TooltipPlacement;

  /** Delay before opening tooltip. */
  delay?: number;

  /** Delay before closing tooltip on pointer leave. */
  closeDelay?: number;

  /** Gap between trigger and tooltip content. */
  offset?: number;

  /** Minimum viewport collision padding. */
  boundaryPadding?: number;

  /** Disables tooltip behavior and forces closed state. */
  disabled?: boolean;

  /** Shows arrow in convenience mode when `content` is used. */
  showArrow?: boolean;

  /** Renders content inside a portal by default. */
  portal?: boolean;

  /** Optional portal mount container. */
  portalContainer?: HTMLElement | null;

  /** Controlled open state. */
  open?: boolean;

  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;

  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Optional id used by tooltip content. */
  id?: string;

  /** Optional class name applied to convenience tooltip content. */
  className?: string;

  /** Skip-delay window override for this tooltip tree. */
  skipDelayDuration?: number;
};

/** Public props for `Tooltip.Root`. */
export type TooltipRootProps = TooltipRootOwnProps;

/** Public convenience props for `Tooltip`. */
export type TooltipProps = TooltipRootOwnProps & {
  /** Trigger element for convenience usage. */
  children: ReactElement;

  /** Convenience tooltip content. */
  content: ReactNode;
};

/** Props for `Tooltip.Trigger`. */
export type TooltipTriggerOwnProps = {
  /** Render trigger behavior onto a single child element. */
  asChild?: boolean;

  /** Trigger node or child element when `asChild` is enabled. */
  children: ReactNode;
};

/** Public props for `Tooltip.Trigger`. */
export type TooltipTriggerProps = TooltipTriggerOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof TooltipTriggerOwnProps>;

/** Props for `Tooltip.Content`. */
export type TooltipContentOwnProps = {
  /** Tooltip body content. */
  children: ReactNode;

  /** Optional placement override for this content instance. */
  placement?: TooltipPlacement;

  /** Optional class name override for content node. */
  className?: string;

  /** Optional id override for content node. */
  id?: string;

  /** Renders content without using a portal when true. */
  portal?: boolean;

  /** Optional portal mount container override. */
  portalContainer?: HTMLElement | null;
};

/** Public props for `Tooltip.Content`. */
export type TooltipContentProps = TooltipContentOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof TooltipContentOwnProps>;

/** Props for `Tooltip.Arrow`. */
export type TooltipArrowProps = HTMLAttributes<HTMLSpanElement>;
