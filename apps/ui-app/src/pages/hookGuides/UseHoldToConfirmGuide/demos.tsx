import { Button } from '@themeshift/ui/components/Button';
import { ProgressBar } from '@themeshift/ui/components/ProgressBar';
import { useHoldToConfirm } from '@themeshift/ui/hooks/useHoldToConfirm';
import { type ReactNode, useState } from 'react';

const HOLD_KEYS = new Set([' ', 'Enter', 'NumpadEnter', 'Space', 'Spacebar']);

type HoldButtonProps = {
  children: ReactNode;
  confirmationDelay?: number;
  onCancel?: () => void;
  onConfirm?: () => void;
  onProgress?: (progress?: number, timeRemaining?: number) => void;
};

const HoldButton = ({
  children,
  confirmationDelay,
  onCancel,
  onConfirm,
  onProgress,
}: HoldButtonProps) => {
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

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 340 }}>
      <Button
        aria-label="Hold to confirm"
        onBlur={cancel}
        onKeyDown={(event) => {
          if (event.repeat || !HOLD_KEYS.has(event.key)) {
            return;
          }

          event.preventDefault();
          start();
        }}
        onKeyUp={(event) => {
          if (!HOLD_KEYS.has(event.key)) {
            return;
          }

          event.preventDefault();
          cancel();
        }}
        onPointerCancel={cancel}
        onPointerDown={(event) => {
          if (event.button !== 0) {
            return;
          }

          event.currentTarget.setPointerCapture(event.pointerId);
          start();
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }

          cancel();
        }}
        style={{ width: '100%' }}
        type="button"
      >
        {children}
      </Button>

      <ProgressBar
        aria-label="Hold confirmation progress"
        max={100}
        value={progress}
      />

      <p style={{ margin: 0 }}>
        {isPressing
          ? `Confirming in ${Math.ceil(timeRemaining / 1000)}s`
          : wasConfirmed
            ? 'Confirmed'
            : wasCancelled
              ? 'Cancelled'
              : 'Idle'}
      </p>
    </div>
  );
};

export const BasicUsageDemo = () => {
  return (
    <HoldButton confirmationDelay={2200}>
      Hold pointer, Space, or Enter to confirm
    </HoldButton>
  );
};

export const CallbackDemo = () => {
  const [lastEvent, setLastEvent] = useState('Idle');

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <HoldButton
        confirmationDelay={1800}
        onCancel={() => setLastEvent('Cancelled before confirm')}
        onConfirm={() => setLastEvent('Confirmed destructive action')}
      >
        Hold to delete draft
      </HoldButton>

      <p style={{ margin: 0 }}>{lastEvent}</p>
    </div>
  );
};

export const ProgressDemo = () => {
  const [progressState, setProgressState] = useState<{
    progress: number | null;
    timeRemaining: number | null;
  }>({
    progress: null,
    timeRemaining: null,
  });

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <HoldButton
        confirmationDelay={2500}
        onProgress={(progress, timeRemaining) => {
          setProgressState({
            progress:
              progress === undefined ? null : Number(progress.toFixed(1)),
            timeRemaining:
              timeRemaining === undefined ? null : Math.ceil(timeRemaining),
          });
        }}
      >
        Hold to archive project
      </HoldButton>

      <pre
        style={{
          margin: 0,
          minHeight: 96,
          overflowX: 'auto',
          padding: '0.5rem',
          width: 340,
        }}
      >
        {JSON.stringify(progressState, null, 2)}
      </pre>
    </div>
  );
};
