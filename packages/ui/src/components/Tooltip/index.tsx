/* eslint-disable react-refresh/only-export-components */
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import {
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MutableRefObject,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';

import { Portal } from '@/components/Portal';
import {
  useAnchoredPosition,
  type Placement,
} from '@/hooks/useAnchoredPosition';

import styles from './Tooltip.module.scss';
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPlacement,
  TooltipProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from './types';

type TooltipProviderContextValue = {
  closeDelay: number;
  delay: number;
  getOpenDelay: (delay: number) => number;
  markClosed: () => void;
  markOpened: () => void;
  skipDelayDuration: number;
};

type TooltipRootContextValue = {
  anchorRef: RefObject<HTMLElement | null>;
  arrowRef: RefObject<HTMLElement | null>;
  arrowStyle: CSSProperties;
  closeImmediate: () => void;
  closeWithDelay: (delayOverride?: number) => void;
  contentClassName?: string;
  contentId: string;
  contentPlacement: Placement;
  contentRef: RefObject<HTMLElement | null>;
  contentStyle: CSSProperties;
  disabled: boolean;
  open: boolean;
  openWithDelay: (delayOverride?: number) => void;
  portal: boolean;
  portalContainer: HTMLElement | null;
};

const DEFAULT_BOUNDARY_PADDING = 8;
const DEFAULT_CLOSE_DELAY = 100;
const DEFAULT_DELAY = 500;
const DEFAULT_OFFSET = 8;
const DEFAULT_PLACEMENT: TooltipPlacement = 'top';
const DEFAULT_SKIP_DELAY_DURATION = 300;

const TooltipProviderContext =
  createContext<TooltipProviderContextValue | null>(null);
const TooltipRootContext = createContext<TooltipRootContextValue | null>(null);

function callEventHandler<EventType>(
  handler: ((event: EventType) => void) | undefined,
  event: EventType
) {
  handler?.(event);
}

function mergeRefs<T>(
  refs: Array<Ref<T> | undefined>
): (node: T | null) => void {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };
}

function setRefValue<T>(ref: RefObject<T | null>, node: T | null) {
  (ref as MutableRefObject<T | null>).current = node;
}

function useTooltipRootContext(component: string) {
  const context = useContext(TooltipRootContext);

  if (!context) {
    throw new Error(`${component} must be used within Tooltip.`);
  }

  return context;
}

function useTooltipProviderContext() {
  return useContext(TooltipProviderContext);
}

/** Shares tooltip timing behavior for nearby tooltip interactions. */
export const TooltipProvider = ({
  children,
  closeDelay = DEFAULT_CLOSE_DELAY,
  delay = DEFAULT_DELAY,
  skipDelayDuration = DEFAULT_SKIP_DELAY_DURATION,
}: TooltipProviderProps) => {
  const isOpenDelayedRef = useRef(true);
  const openTooltipCountRef = useRef(0);
  const skipDelayTimerRef = useRef<number | null>(null);

  const clearSkipDelayTimer = useCallback(() => {
    if (typeof window === 'undefined' || skipDelayTimerRef.current === null) {
      return;
    }

    window.clearTimeout(skipDelayTimerRef.current);
    skipDelayTimerRef.current = null;
  }, []);

  const markOpened = useCallback(() => {
    clearSkipDelayTimer();
    openTooltipCountRef.current += 1;
    isOpenDelayedRef.current = false;
  }, [clearSkipDelayTimer]);

  const markClosed = useCallback(() => {
    clearSkipDelayTimer();
    openTooltipCountRef.current = Math.max(0, openTooltipCountRef.current - 1);

    if (openTooltipCountRef.current > 0) {
      isOpenDelayedRef.current = false;
      return;
    }

    if (typeof window === 'undefined') {
      isOpenDelayedRef.current = true;
      return;
    }

    skipDelayTimerRef.current = window.setTimeout(() => {
      skipDelayTimerRef.current = null;
      isOpenDelayedRef.current = true;
    }, skipDelayDuration);
  }, [clearSkipDelayTimer, skipDelayDuration]);

  const getOpenDelay = useCallback((localDelay: number) => {
    return isOpenDelayedRef.current ? localDelay : 0;
  }, []);

  useEffect(
    () => () => {
      clearSkipDelayTimer();
    },
    [clearSkipDelayTimer]
  );

  const value = useMemo(
    () => ({
      closeDelay,
      delay,
      getOpenDelay,
      markClosed,
      markOpened,
      skipDelayDuration,
    }),
    [closeDelay, delay, getOpenDelay, markClosed, markOpened, skipDelayDuration]
  );

  return (
    <TooltipProviderContext.Provider value={value}>
      {children}
    </TooltipProviderContext.Provider>
  );
};

type TooltipRootPrimitiveProps = TooltipRootProps;

function TooltipRootPrimitive({
  boundaryPadding = DEFAULT_BOUNDARY_PADDING,
  children,
  className,
  closeDelay,
  defaultOpen = false,
  delay,
  disabled = false,
  id,
  offset = DEFAULT_OFFSET,
  onOpenChange,
  open,
  placement = DEFAULT_PLACEMENT,
  portal = true,
  portalContainer = null,
}: TooltipRootPrimitiveProps) {
  const provider = useTooltipProviderContext();
  const generatedId = useId();
  const tooltipId = id ?? `tooltip-${generatedId.replaceAll(':', '')}`;
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const resolvedOpen = disabled
    ? false
    : isControlled
      ? open
      : uncontrolledOpen;
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const arrowRef = useRef<HTMLElement | null>(null);

  const resolvedDelay = delay ?? provider?.delay ?? DEFAULT_DELAY;
  const resolvedCloseDelay =
    closeDelay ?? provider?.closeDelay ?? DEFAULT_CLOSE_DELAY;
  const previousResolvedOpenRef = useRef(resolvedOpen);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) {
        return;
      }

      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [disabled, isControlled, onOpenChange]
  );

  const clearOpenTimer = useCallback(() => {
    if (typeof window === 'undefined' || openTimerRef.current === null) {
      return;
    }

    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = null;
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (typeof window === 'undefined' || closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const closeImmediate = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer, clearOpenTimer, setOpen]);

  const closeWithDelay = useCallback(
    (delayOverride?: number) => {
      clearOpenTimer();
      clearCloseTimer();

      const timeout = delayOverride ?? resolvedCloseDelay;

      if (timeout <= 0 || typeof window === 'undefined') {
        setOpen(false);
        return;
      }

      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        setOpen(false);
      }, timeout);
    },
    [clearCloseTimer, clearOpenTimer, resolvedCloseDelay, setOpen]
  );

  const openWithDelay = useCallback(
    (delayOverride?: number) => {
      if (disabled) {
        return;
      }

      clearOpenTimer();
      clearCloseTimer();

      const delayValue =
        delayOverride ?? provider?.getOpenDelay(resolvedDelay) ?? resolvedDelay;

      if (delayValue <= 0 || typeof window === 'undefined') {
        setOpen(true);
        return;
      }

      openTimerRef.current = window.setTimeout(() => {
        openTimerRef.current = null;
        setOpen(true);
      }, delayValue);
    },
    [
      clearCloseTimer,
      clearOpenTimer,
      disabled,
      provider,
      resolvedDelay,
      setOpen,
    ]
  );

  const {
    actualPlacement,
    anchorRef,
    arrowStyle,
    floatingRef,
    style: contentStyle,
  } = useAnchoredPosition({
    arrowRef,
    boundaryPadding,
    flip: true,
    offset,
    open: resolvedOpen,
    placement,
    shift: true,
    strategy: 'fixed',
  });

  useEffect(() => {
    if (!resolvedOpen || typeof document === 'undefined') {
      return;
    }

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeImmediate();
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [closeImmediate, resolvedOpen]);

  useEffect(() => {
    if (!provider || previousResolvedOpenRef.current === resolvedOpen) {
      return;
    }

    if (resolvedOpen) {
      provider.markOpened();
    } else {
      provider.markClosed();
    }

    previousResolvedOpenRef.current = resolvedOpen;
  }, [provider, resolvedOpen]);

  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearCloseTimer, clearOpenTimer]);

  const value = useMemo(
    () => ({
      anchorRef,
      arrowRef,
      arrowStyle,
      closeImmediate,
      closeWithDelay,
      contentClassName: className,
      contentId: tooltipId,
      contentPlacement: actualPlacement,
      contentRef: floatingRef,
      contentStyle,
      disabled,
      open: resolvedOpen,
      openWithDelay,
      portal,
      portalContainer,
    }),
    [
      actualPlacement,
      anchorRef,
      arrowStyle,
      className,
      closeImmediate,
      closeWithDelay,
      contentStyle,
      disabled,
      floatingRef,
      openWithDelay,
      portal,
      portalContainer,
      resolvedOpen,
      tooltipId,
    ]
  );

  return (
    <TooltipRootContext.Provider value={value}>
      {children}
    </TooltipRootContext.Provider>
  );
}

function ensureTriggerElement(children: ReactNode): ReactElement {
  if (!isValidElement(children)) {
    throw new Error(
      'Tooltip convenience usage expects a single React element child trigger.'
    );
  }

  return children;
}

/**
 * Tooltip root state container.
 *
 * Supports both compound composition and convenience `content` usage.
 */
export const TooltipRoot = ({
  children,
  content,
  showArrow = true,
  ...rootProps
}: TooltipRootProps) => {
  if (content === undefined) {
    return (
      <TooltipRootPrimitive {...rootProps}>{children}</TooltipRootPrimitive>
    );
  }

  const triggerChild = ensureTriggerElement(children);

  return (
    <TooltipRootPrimitive {...rootProps}>
      <TooltipTrigger asChild>{triggerChild}</TooltipTrigger>
      <TooltipContent>
        {content}
        {showArrow ? <TooltipArrow /> : null}
      </TooltipContent>
    </TooltipRootPrimitive>
  );
};

/** Tooltip trigger that controls open/close interactions. */
export const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(
  (
    {
      asChild = false,
      children,
      onBlur,
      onFocus,
      onMouseEnter,
      onMouseLeave,
      onPointerEnter,
      onPointerLeave,
      ...triggerProps
    },
    forwardedRef
  ) => {
    const context = useTooltipRootContext('Tooltip.Trigger');

    const setTriggerRef = useMemo(
      () =>
        mergeRefs<HTMLElement>([
          forwardedRef,
          (node) => {
            setRefValue(context.anchorRef, node);
          },
        ]),
      [context.anchorRef, forwardedRef]
    );

    const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
      callEventHandler(
        onPointerEnter as
          | ((event: PointerEvent<HTMLElement>) => void)
          | undefined,
        event
      );

      if (event.defaultPrevented || event.pointerType === 'touch') {
        return;
      }

      context.openWithDelay();
    };

    const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
      callEventHandler(
        onPointerLeave as
          | ((event: PointerEvent<HTMLElement>) => void)
          | undefined,
        event
      );

      if (event.defaultPrevented || event.pointerType === 'touch') {
        return;
      }

      const relatedTarget =
        event.relatedTarget instanceof Node ? event.relatedTarget : null;

      if (
        relatedTarget &&
        context.contentRef.current?.contains(relatedTarget)
      ) {
        return;
      }

      context.closeWithDelay();
    };

    const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
      callEventHandler(
        onMouseEnter as ((event: MouseEvent<HTMLElement>) => void) | undefined,
        event
      );
    };

    const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
      callEventHandler(
        onMouseLeave as ((event: MouseEvent<HTMLElement>) => void) | undefined,
        event
      );
    };

    const handleFocus = (event: FocusEvent<HTMLElement>) => {
      callEventHandler(
        onFocus as ((event: FocusEvent<HTMLElement>) => void) | undefined,
        event
      );

      if (event.defaultPrevented) {
        return;
      }

      context.openWithDelay();
    };

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
      callEventHandler(
        onBlur as ((event: FocusEvent<HTMLElement>) => void) | undefined,
        event
      );

      if (event.defaultPrevented) {
        return;
      }

      const relatedTarget =
        event.relatedTarget instanceof Node ? event.relatedTarget : null;

      if (
        relatedTarget &&
        context.contentRef.current?.contains(relatedTarget)
      ) {
        return;
      }

      context.closeImmediate();
    };

    const Comp = asChild ? Slot : 'button';

    if (asChild && !children) {
      throw new Error(
        'Tooltip.Trigger with asChild expects a single child element.'
      );
    }

    return (
      <Comp
        {...triggerProps}
        aria-describedby={context.open ? context.contentId : undefined}
        data-disabled={context.disabled ? '' : undefined}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        ref={setTriggerRef}
        type={asChild ? undefined : 'button'}
      >
        {children}
      </Comp>
    );
  }
);

TooltipTrigger.displayName = 'Tooltip.Trigger';

/** Tooltip body container with portal and positioning support. */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      children,
      className,
      id,
      onPointerEnter,
      onPointerLeave,
      portal,
      portalContainer,
      style,
      ...contentProps
    },
    forwardedRef
  ) => {
    const context = useTooltipRootContext('Tooltip.Content');
    const resolvedPortal = portal ?? context.portal;
    const resolvedPortalContainer = portalContainer ?? context.portalContainer;

    const setContentRef = useMemo(
      () =>
        mergeRefs<HTMLDivElement>([
          forwardedRef,
          (node) => {
            setRefValue(context.contentRef, node);
          },
        ]),
      [context.contentRef, forwardedRef]
    );

    const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
      callEventHandler(onPointerEnter, event);

      if (event.defaultPrevented || event.pointerType === 'touch') {
        return;
      }

      context.openWithDelay(0);
    };

    const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
      callEventHandler(onPointerLeave, event);

      if (event.defaultPrevented || event.pointerType === 'touch') {
        return;
      }

      const relatedTarget =
        event.relatedTarget instanceof Node ? event.relatedTarget : null;

      if (relatedTarget && context.anchorRef.current?.contains(relatedTarget)) {
        return;
      }

      context.closeWithDelay();
    };

    if (!context.open) {
      return null;
    }

    const contentNode = (
      <div
        {...contentProps}
        className={classNames(
          styles.content,
          context.contentClassName,
          className,
          context.disabled && styles.disabled
        )}
        data-placement={context.contentPlacement}
        id={id ?? context.contentId}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        ref={setContentRef}
        role="tooltip"
        style={{ ...context.contentStyle, ...style }}
      >
        {children}
      </div>
    );

    return (
      <Portal container={resolvedPortalContainer} disabled={!resolvedPortal}>
        {contentNode}
      </Portal>
    );
  }
);

TooltipContent.displayName = 'Tooltip.Content';

/** Decorative arrow aligned to tooltip placement. */
export const TooltipArrow = forwardRef<HTMLSpanElement, TooltipArrowProps>(
  ({ className, style, ...arrowProps }, forwardedRef) => {
    const context = useTooltipRootContext('Tooltip.Arrow');

    const setArrowRef = useMemo(
      () =>
        mergeRefs<HTMLSpanElement>([
          forwardedRef,
          (node) => {
            setRefValue(context.arrowRef, node);
          },
        ]),
      [context.arrowRef, forwardedRef]
    );

    if (!context.open) {
      return null;
    }

    return (
      <span
        {...arrowProps}
        aria-hidden="true"
        className={classNames(styles.arrow, className)}
        data-placement={context.contentPlacement}
        ref={setArrowRef}
        style={{ ...context.arrowStyle, ...style }}
      />
    );
  }
);

TooltipArrow.displayName = 'Tooltip.Arrow';

type TooltipComponent = ((props: TooltipRootProps) => ReactElement) & {
  Arrow: typeof TooltipArrow;
  Content: typeof TooltipContent;
  Provider: typeof TooltipProvider;
  Root: typeof TooltipRoot;
  Trigger: typeof TooltipTrigger;
};

/** Composable tooltip primitive with convenience `content` usage support. */
export const Tooltip = Object.assign(TooltipRoot, {
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
}) as TooltipComponent;

export type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPlacement,
  TooltipProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
};
