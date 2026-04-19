import { useCallback, useEffect, useRef, useState } from 'react';

type UseHoldToConfirmOptions = {
  /**
   * Duration in milliseconds the user must hold before confirming.
   */
  confirmationDelay?: number;

  /**
   * Time in milliseconds before the `wasConfirmed` state resets to `false`.
   */
  confirmResetDelay?: number;

  /**
   * Called when an in-progress hold is cancelled before confirmation.
   */
  onCancel?: () => void;

  /**
   * Called once the hold duration completes successfully.
   */
  onConfirm?: () => void;

  /**
   * Called during active holds with progress (`0..100`) and milliseconds
   * remaining. Called with `undefined` values when the hook returns to idle.
   */
  onProgress?: (progress?: number, timeRemaining?: number) => void;
};

type UseHoldToConfirmReturn = {
  /**
   * Cancels the current hold attempt.
   */
  cancel: () => void;

  /**
   * Forces immediate confirmation when a hold is active.
   */
  confirm: () => void;

  /**
   * `true` while a hold attempt is currently active.
   */
  isPressing: boolean;

  /**
   * Current progress from `0` to `100` during an active hold.
   */
  progress: number;

  /**
   * Resets all interaction state back to idle.
   */
  reset: () => void;

  /**
   * Starts a hold attempt.
   */
  start: () => void;

  /**
   * Milliseconds remaining before confirmation while pressing.
   */
  timeRemaining: number;

  /**
   * `true` after a progressed hold was cancelled before confirmation.
   */
  wasCancelled: boolean;

  /**
   * `true` immediately after confirmation succeeds.
   */
  wasConfirmed: boolean;
};

/**
 * Tracks a press-and-hold confirmation lifecycle with progress updates.
 */
export function useHoldToConfirm({
  confirmationDelay = 2500,
  confirmResetDelay = 1000,
  onCancel,
  onConfirm,
  onProgress,
}: UseHoldToConfirmOptions = {}): UseHoldToConfirmReturn {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [wasCancelled, setWasCancelled] = useState(false);
  const [wasConfirmed, setWasConfirmed] = useState(false);

  const isPressingRef = useRef(false);
  const hasProgressedRef = useRef(false);
  const onCancelRef = useRef(onCancel);
  const onConfirmRef = useRef(onConfirm);
  const onProgressRef = useRef(onProgress);
  const rafRef = useRef<number | undefined>(undefined);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const startedAtRef = useRef(0);

  onCancelRef.current = onCancel;
  onConfirmRef.current = onConfirm;
  onProgressRef.current = onProgress;

  const clearRaf = useCallback(() => {
    if (rafRef.current !== undefined) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  }, []);

  const clearResetTimeout = useCallback(() => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = undefined;
    }
  }, []);

  const emitIdleProgress = useCallback(() => {
    onProgressRef.current?.(undefined, undefined);
  }, []);

  const scheduleResetAfterConfirm = useCallback(() => {
    clearResetTimeout();

    resetTimeoutRef.current = setTimeout(() => {
      setProgress(0);
      setTimeRemaining(0);
      setWasConfirmed(false);
    }, confirmResetDelay);
  }, [clearResetTimeout, confirmResetDelay]);

  const confirm = useCallback(() => {
    if (!isPressingRef.current) {
      return;
    }

    clearRaf();
    isPressingRef.current = false;
    hasProgressedRef.current = true;

    setIsPressing(false);
    setProgress(100);
    setTimeRemaining(0);
    setWasCancelled(false);
    setWasConfirmed(true);

    emitIdleProgress();
    onConfirmRef.current?.();
    scheduleResetAfterConfirm();
  }, [clearRaf, emitIdleProgress, scheduleResetAfterConfirm]);

  const step = useCallback(
    (now: number) => {
      if (!isPressingRef.current) {
        return;
      }

      const elapsed = Math.max(0, now - startedAtRef.current);
      const total = Math.max(0, confirmationDelay);
      const clampedElapsed = Math.min(elapsed, total);
      const nextProgress =
        total === 0 ? 100 : Math.min(100, (clampedElapsed / total) * 100);
      const nextTimeRemaining = Math.max(total - clampedElapsed, 0);

      if (clampedElapsed > 0) {
        hasProgressedRef.current = true;
      }

      setProgress(nextProgress);
      setTimeRemaining(nextTimeRemaining);
      onProgressRef.current?.(nextProgress, nextTimeRemaining);

      if (clampedElapsed >= total) {
        confirm();
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    },
    [confirmationDelay, confirm]
  );

  const start = useCallback(() => {
    if (isPressingRef.current) {
      return;
    }

    clearRaf();
    clearResetTimeout();

    isPressingRef.current = true;
    hasProgressedRef.current = false;
    startedAtRef.current = performance.now();

    setIsPressing(true);
    setProgress(0);
    setTimeRemaining(Math.max(0, confirmationDelay));
    setWasCancelled(false);
    setWasConfirmed(false);

    rafRef.current = requestAnimationFrame(step);
  }, [clearRaf, clearResetTimeout, confirmationDelay, step]);

  const cancel = useCallback(() => {
    if (!isPressingRef.current) {
      return;
    }

    clearRaf();
    isPressingRef.current = false;

    const didProgress = hasProgressedRef.current;

    hasProgressedRef.current = false;

    setIsPressing(false);
    setProgress(0);
    setTimeRemaining(0);
    setWasCancelled(didProgress);
    setWasConfirmed(false);

    emitIdleProgress();

    if (didProgress) {
      onCancelRef.current?.();
    }
  }, [clearRaf, emitIdleProgress]);

  const reset = useCallback(() => {
    clearRaf();
    clearResetTimeout();
    isPressingRef.current = false;
    hasProgressedRef.current = false;

    setIsPressing(false);
    setProgress(0);
    setTimeRemaining(0);
    setWasCancelled(false);
    setWasConfirmed(false);

    emitIdleProgress();
  }, [clearRaf, clearResetTimeout, emitIdleProgress]);

  useEffect(() => {
    return () => {
      clearRaf();
      clearResetTimeout();
    };
  }, [clearRaf, clearResetTimeout]);

  return {
    cancel,
    confirm,
    isPressing,
    progress,
    reset,
    start,
    timeRemaining,
    wasCancelled,
    wasConfirmed,
  };
}

export type { UseHoldToConfirmOptions, UseHoldToConfirmReturn };
