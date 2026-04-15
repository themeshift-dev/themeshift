import { Button } from '@themeshift/ui/components/Button';
import { Spinner } from '@themeshift/ui/components/Spinner';

export const basicUsage = {
  code: '<Spinner aria-label="Loading" />',
  label: 'Basic usage',
  sample: <Spinner aria-label="Loading" />,
};

export const sizes = {
  code: `<>
  <Spinner aria-label="Loading small" size={16} />
  <Spinner aria-label="Loading medium" size={24} />
  <Spinner aria-label="Loading large" size={40} />
</>`,
  label: 'Sizes',
  sample: (
    <div style={{ alignItems: 'center', display: 'flex', gap: '1rem' }}>
      <Spinner aria-label="Loading small" size={16} />
      <Spinner aria-label="Loading medium" size={24} />
      <Spinner aria-label="Loading large" size={40} />
    </div>
  ),
};

export const inButtons = {
  code: `<>
  <Button isBusy>Saving</Button>
  <Button intent="secondary" isBusy>
    Updating
  </Button>
  <Button aria-label="Loading" icon={<Spinner aria-hidden />} />
</>`,
  label: 'In buttons',
  sample: (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      <Button isBusy>Saving</Button>
      <Button intent="secondary" isBusy>
        Updating
      </Button>
      <Button aria-label="Loading" icon={<Spinner aria-hidden />} />
    </div>
  ),
};

export const customColor = {
  code: `<Spinner
  aria-label="Loading"
  size={28}
  style={{ color: 'var(--theme-text-muted)' }}
/>`,
  label: 'Custom color',
  sample: (
    <Spinner
      aria-label="Loading"
      size={28}
      style={{ color: 'var(--theme-text-muted)' }}
    />
  ),
};

export const hiddenDecorative = {
  code: '<Spinner aria-hidden size={18} />',
  label: 'Decorative spinner',
  sample: <Spinner aria-hidden size={18} />,
};

export const propHighlights = [basicUsage, sizes, inButtons];
