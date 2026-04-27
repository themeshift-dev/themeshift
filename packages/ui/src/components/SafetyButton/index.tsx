import classNames from 'classnames';
import {
  type ElementType,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/Button';
import type { ButtonIntent, ButtonProps } from '@/components/Button/types';
import { useHoldToConfirm } from '@/hooks/useHoldToConfirm';

import styles from './SafetyButton.module.scss';
import type { SafetyButtonProps, SafetyButtonResolverState } from './types';

const intentClassMap = {
  constructive: styles.intentConstructive,
  destructive: styles.intentDestructive,
  primary: styles.intentPrimary,
  secondary: styles.intentSecondary,
} satisfies Record<ButtonIntent, string>;

const HOLD_KEYS = new Set([' ', 'Enter', 'NumpadEnter', 'Space', 'Spacebar']);
const DEFAULT_ANNOUNCE_INTERVAL_MS = 1000;

function resolveDynamicValue<T>(
  value: T | ((state: SafetyButtonResolverState) => T | void) | undefined,
  state: SafetyButtonResolverState
): T | undefined {
  if (typeof value === 'function') {
    const resolvedValue = (
      value as (nextState: SafetyButtonResolverState) => T | void
    )(state);

    return resolvedValue === undefined ? undefined : resolvedValue;
  }

  return value;
}

function hasResolvedContent(content: ReactNode) {
  return content !== null && content !== undefined;
}

export const SafetyButton = <T extends ElementType = 'button'>({
  'aria-label': ariaLabel,
  announceProgress = false,
  children,
  className,
  confirmationDelay = 2500,
  endIcon,
  icon,
  onAttemptStart,
  onCancel,
  onConfirm,
  onProgress,
  progressAnnounceIntervalMs = DEFAULT_ANNOUNCE_INTERVAL_MS,
  startIcon,
  ...buttonProps
}: SafetyButtonProps<T>) => {
  const {
    cancel,
    isPressing,
    progress,
    start,
    timeRemaining,
    wasCancelled,
    wasConfirmed,
  } = useHoldToConfirm({
    confirmationDelay,
    onCancel,
    onConfirm,
    onProgress,
  });

  const [progressAnnouncement, setProgressAnnouncement] = useState('');
  const announcementIntervalRef = useRef<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  const stateRef = useRef<SafetyButtonResolverState>({
    isPressing,
    progress,
    timeRemaining,
    wasCancelled,
    wasConfirmed,
  });

  const resolvedIntent: ButtonIntent =
    (buttonProps.intent as ButtonIntent | undefined) ?? 'primary';

  const resolverState = useMemo(
    () => ({
      isPressing,
      progress,
      timeRemaining,
      wasCancelled,
      wasConfirmed,
    }),
    [isPressing, progress, timeRemaining, wasCancelled, wasConfirmed]
  );

  useEffect(() => {
    stateRef.current = resolverState;
  }, [resolverState]);

  useEffect(() => {
    if (announcementIntervalRef.current) {
      clearInterval(announcementIntervalRef.current);
      announcementIntervalRef.current = undefined;
    }

    if (!announceProgress || !isPressing) {
      return;
    }

    const safeInterval = Math.max(250, progressAnnounceIntervalMs);

    announcementIntervalRef.current = setInterval(() => {
      const secondsRemaining = Math.max(
        0,
        Math.ceil(stateRef.current.timeRemaining / 1000)
      );

      setProgressAnnouncement(
        secondsRemaining <= 1
          ? 'Release now to cancel. Confirming in 1 second.'
          : `Release now to cancel. Confirming in ${secondsRemaining} seconds.`
      );
    }, safeInterval);

    return () => {
      if (announcementIntervalRef.current) {
        clearInterval(announcementIntervalRef.current);
        announcementIntervalRef.current = undefined;
      }
    };
  }, [announceProgress, isPressing, progressAnnounceIntervalMs]);

  const announcement = useMemo(() => {
    if (!announceProgress) {
      return '';
    }

    if (wasConfirmed) {
      return 'Action confirmed.';
    }

    if (wasCancelled) {
      return 'Confirmation cancelled.';
    }

    if (isPressing) {
      return progressAnnouncement;
    }

    return '';
  }, [
    announceProgress,
    isPressing,
    progressAnnouncement,
    wasCancelled,
    wasConfirmed,
  ]);

  const resolvedAriaLabel = resolveDynamicValue(ariaLabel, resolverState);
  const resolvedIcon = resolveDynamicValue(icon, resolverState);
  const resolvedStartIcon = resolveDynamicValue(startIcon, resolverState);
  const resolvedEndIcon = resolveDynamicValue(endIcon, resolverState);
  const resolvedChildren = resolveDynamicValue(children, resolverState);
  const hasChildrenResolver = typeof children === 'function';

  const buttonChildren =
    hasChildrenResolver && hasResolvedContent(resolvedChildren)
      ? resolvedChildren
      : hasChildrenResolver
        ? resolvedChildren
        : children;

  const shouldDefaultType =
    !('as' in buttonProps) &&
    !('asChild' in buttonProps) &&
    !('type' in buttonProps);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    buttonProps.onPointerDown?.(event);

    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    onAttemptStart?.(event);
    start();
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    buttonProps.onPointerUp?.(event);
    cancel();
  };

  const handlePointerCancel = (event: PointerEvent<HTMLButtonElement>) => {
    buttonProps.onPointerCancel?.(event);
    cancel();
  };

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    buttonProps.onPointerLeave?.(event);

    if (isPressing) {
      cancel();
    }
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    buttonProps.onBlur?.(event);

    if (isPressing) {
      cancel();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    buttonProps.onKeyDown?.(event);

    if (event.repeat || !HOLD_KEYS.has(event.key)) {
      return;
    }

    event.preventDefault();
    onAttemptStart?.(event);
    start();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    buttonProps.onKeyUp?.(event);

    if (!HOLD_KEYS.has(event.key)) {
      return;
    }

    event.preventDefault();
    cancel();
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const resolvedButtonProps = {
    ...buttonProps,
    'aria-label': resolvedAriaLabel,
    children: buttonChildren,
    className: classNames(
      styles.container,
      intentClassMap[resolvedIntent],
      isPressing && styles.pressing,
      className
    ),
    endIcon: resolvedEndIcon,
    icon: resolvedIcon,
    onBlur: handleBlur,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onPointerCancel: handlePointerCancel,
    onPointerDown: handlePointerDown,
    onPointerLeave: handlePointerLeave,
    onPointerUp: handlePointerUp,
    startIcon: resolvedStartIcon,
    style: {
      ...(buttonProps.style ?? {}),
      ['--safety-progress' as string]: `${progress}`,
      ['--safety-progress-scale' as string]: `${progress / 100}`,
    },
    ...(shouldDefaultType ? { type: 'button' } : {}),
  } as ButtonProps<T>;

  return (
    <>
      <Button<T> {...resolvedButtonProps} />
      {announceProgress && (
        <span
          aria-atomic="true"
          aria-live="polite"
          className={styles.visuallyHidden}
        >
          {announcement}
        </span>
      )}
    </>
  );
};

export type { SafetyButtonProps, SafetyButtonResolverState } from './types';
