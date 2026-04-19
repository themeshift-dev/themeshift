import { BasicUsageDemo, CallbackDemo, ProgressDemo } from './demos';

export const basicUsage = {
  code: `import { useHoldToConfirm } from '@themeshift/ui/hooks/useHoldToConfirm';

export const HoldToConfirmExample = () => {
  const {
    start,
    cancel,
    progress,
    timeRemaining,
    wasConfirmed,
  } = useHoldToConfirm({ confirmationDelay: 2200 });

  return (
    <>
      <button
        type="button"
        onPointerDown={() => start()}
        onPointerUp={() => cancel()}
        onPointerLeave={() => cancel()}
        onPointerCancel={() => cancel()}
      >
        Hold to confirm
      </button>
      <p>{timeRemaining > 0 ? \`\${Math.ceil(timeRemaining / 1000)}s\` : wasConfirmed ? 'Confirmed' : 'Idle'}</p>
      <p>{progress.toFixed(0)}%</p>
    </>
  );
};`,
  label: 'Basic usage',
  sample: () => <BasicUsageDemo />,
};

export const callbackHandling = {
  code: `const hold = useHoldToConfirm({
  confirmationDelay: 1800,
  onCancel: () => {
    setLastEvent('Cancelled before confirm');
  },
  onConfirm: () => {
    setLastEvent('Confirmed destructive action');
  },
});`,
  label: 'Confirm and cancel callbacks',
  sample: () => <CallbackDemo />,
};

export const progressReporting = {
  code: `const hold = useHoldToConfirm({
  confirmationDelay: 2500,
  onProgress: (progress, timeRemaining) => {
    setProgressState({ progress, timeRemaining });
  },
});`,
  label: 'Progress reporting',
  sample: () => <ProgressDemo />,
};

export const commonUseCases = [basicUsage, callbackHandling, progressReporting];
