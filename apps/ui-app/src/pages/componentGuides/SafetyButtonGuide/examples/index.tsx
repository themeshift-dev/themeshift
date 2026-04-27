import { SafetyButton } from '@themeshift/ui/components/SafetyButton';
import { LuCheck, LuTrash } from 'react-icons/lu';
import { ResponsiveStackInline } from '../../components';

export const countdownLabel = {
  code: `<SafetyButton
  confirmationDelay={2500}
  onCancel={() => {
    console.log('Cancelled');
  }}
  onConfirm={() => {
    console.log('Confirmed delete');
  }}
>
  {({ timeRemaining }) =>
    timeRemaining > 0
      ? \`Deleting in \${Math.ceil(timeRemaining / 1000)}s...\`
      : 'Press and hold to delete'
  }
</SafetyButton>`,
  label: 'Countdown label',
  sample: () => (
    <SafetyButton confirmationDelay={2500}>
      {({ timeRemaining }) =>
        timeRemaining > 0
          ? `Deleting in ${Math.ceil(timeRemaining / 1000)}s...`
          : 'Press and hold to delete'
      }
    </SafetyButton>
  ),
};

export const visualOnly = {
  code: `<SafetyButton onConfirm={removeRow} variant="outline">
  Press and hold to delete
</SafetyButton>`,
  label: 'Visual feedback only',
  sample: () => (
    <SafetyButton confirmationDelay={2000} variant="outline">
      Press and hold to delete
    </SafetyButton>
  ),
};

export const iconOnly = {
  code: `<SafetyButton
  intent="destructive"
  aria-label={({ wasConfirmed }) =>
    wasConfirmed ? 'Removed' : 'Press and hold to remove'
  }
  icon={({ wasConfirmed }) =>
    wasConfirmed ? <LuCheck aria-hidden size={16} /> : <LuTrash aria-hidden size={16} />
  }
/>`,
  label: 'Icon only',
  sample: () => (
    <SafetyButton
      intent="destructive"
      aria-label={({ wasConfirmed }) =>
        wasConfirmed ? 'Removed' : 'Press and hold to remove'
      }
      confirmationDelay={1800}
      icon={({ wasConfirmed }) =>
        wasConfirmed ? (
          <LuCheck aria-hidden size={16} />
        ) : (
          <LuTrash aria-hidden size={16} />
        )
      }
    />
  ),
};

export const intents = {
  code: `<SafetyButton icon={<LuTrash />} aria-label="Hold to confirm" />
<SafetyButton intent="secondary" icon={<LuTrash />} aria-label="Hold to confirm" />
<SafetyButton intent="constructive" variant="outline" icon={<LuTrash />} aria-label="Hold to confirm" />
<SafetyButton intent="destructive" variant="link" icon={<LuTrash />} aria-label="Hold to confirm" />
`,
  label: 'Intents',
  sample: () => (
    <ResponsiveStackInline>
      <SafetyButton icon={<LuTrash />} aria-label="Hold to confirm" />
      <SafetyButton
        intent="secondary"
        icon={<LuTrash />}
        aria-label="Hold to confirm"
      />
      <SafetyButton
        intent="constructive"
        variant="outline"
        icon={<LuTrash />}
        aria-label="Hold to confirm"
      />
      <SafetyButton
        intent="destructive"
        variant="link"
        icon={<LuTrash />}
        aria-label="Hold to confirm"
      />
    </ResponsiveStackInline>
  ),
};

const directionCode = `<SafetyButton confirmationDelay={2200}>
  Press and hold to delete
</SafetyButton>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: () => (
    <SafetyButton confirmationDelay={2200}>
      Press and hold to delete
    </SafetyButton>
  ),
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: () => (
    <div dir="rtl">
      <SafetyButton confirmationDelay={2200}>
        Press and hold to delete
      </SafetyButton>
    </div>
  ),
};

export const keyboardHold = {
  code: `<SafetyButton announceProgress confirmationDelay={2200}>
  {({ timeRemaining }) =>
    timeRemaining > 0
      ? \`Release to cancel • Confirming in \${Math.ceil(timeRemaining / 1000)}s\`
      : 'Hold Space or Enter to confirm delete'
  }
</SafetyButton>`,
  label: 'Keyboard hold',
  sample: () => (
    <SafetyButton announceProgress confirmationDelay={2200}>
      {({ timeRemaining }) =>
        timeRemaining > 0
          ? `Release to cancel • Confirming in ${Math.ceil(timeRemaining / 1000)}s`
          : 'Hold Space or Enter to confirm delete'
      }
    </SafetyButton>
  ),
};

export const propHighlights = [countdownLabel, visualOnly, iconOnly, intents];
export const directionExamples = [directionLTR, directionRTL];
