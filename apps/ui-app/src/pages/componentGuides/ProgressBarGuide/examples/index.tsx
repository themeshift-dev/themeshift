import { ProgressBar } from '@themeshift/ui/components/ProgressBar';

import { ResponsiveStackInline } from '../../components';

export const basicUsage = {
  code: '<ProgressBar value={48} />',
  label: 'Basic usage',
  sample: <ProgressBar value={48} />,
};

export const withLabelAndValue = {
  code: `<ProgressBar
  label="Uploading files"
  showValue
  value={48}
/>`,
  label: 'Label and value',
  sample: <ProgressBar label="Uploading files" showValue value={48} />,
};

export const indeterminate = {
  code: `<ProgressBar
  indeterminate
  label="Syncing data"
  description="This may take a few seconds"
/>`,
  label: 'Indeterminate',
  sample: (
    <ProgressBar
      description="This may take a few seconds"
      indeterminate
      label="Syncing data"
    />
  ),
};

export const customFormatter = {
  code: `<ProgressBar
  label="Step progress"
  max={5}
  showValue
  value={3}
  valueFormatter={(value, max) => \`\${value} / \${max}\`}
/>`,
  label: 'Custom formatter',
  sample: (
    <ProgressBar
      label="Step progress"
      max={5}
      showValue
      value={3}
      valueFormatter={(value, max) => `${value} / ${max}`}
    />
  ),
};

export const composition = {
  code: `<ProgressBar tone="constructive" value={72}>
  <ProgressBar.Label>Deployment</ProgressBar.Label>
  <ProgressBar.Track>
    <ProgressBar.Indicator striped />
  </ProgressBar.Track>
  <ProgressBar.Value />
  <ProgressBar.Description>
    Building production bundle
  </ProgressBar.Description>
</ProgressBar>`,
  label: 'Custom composition',
  sample: (
    <ProgressBar tone="constructive" value={72}>
      <ProgressBar.Label>Deployment</ProgressBar.Label>
      <ProgressBar.Track>
        <ProgressBar.Indicator striped />
      </ProgressBar.Track>
      <ProgressBar.Value />
      <ProgressBar.Description>
        Building production bundle
      </ProgressBar.Description>
    </ProgressBar>
  ),
};

export const vertical = {
  code: `<ProgressBar
  orientation="vertical"
  showValue
  size="large"
  value={68}
/>`,
  label: 'Vertical',
  sample: (
    <ProgressBar orientation="vertical" showValue size="large" value={68} />
  ),
};

const directionCode = `<div style={{ display: 'grid', gap: '1rem', minWidth: '18rem' }}>
  <ProgressBar
    label="Backup progress"
    showValue
    value={35}
  />
  <ProgressBar
    indeterminate
    label="Syncing backup"
  />
</div>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: (
    <div style={{ display: 'grid', gap: '1rem', minWidth: '18rem' }}>
      <ProgressBar label="Backup progress" showValue value={35} />
      <ProgressBar indeterminate label="Syncing backup" />
    </div>
  ),
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl" style={{ display: 'grid', gap: '1rem', minWidth: '18rem' }}>
      <ProgressBar label="Backup progress" showValue value={35} />
      <ProgressBar indeterminate label="Syncing backup" />
    </div>
  ),
};

export const tones = {
  code: `<ResponsiveStackInline>
  <ProgressBar tone="primary" value={40} />
  <ProgressBar tone="secondary" value={40} />
  <ProgressBar tone="constructive" value={40} />
  <ProgressBar tone="destructive" value={40} />
</ResponsiveStackInline>`,
  label: 'Tones',
  sample: (
    <ResponsiveStackInline>
      <ProgressBar tone="primary" value={40} />
      <ProgressBar tone="secondary" value={40} />
      <ProgressBar tone="constructive" value={40} />
      <ProgressBar tone="destructive" value={40} />
    </ResponsiveStackInline>
  ),
};

export const propHighlights = [basicUsage, withLabelAndValue, indeterminate];
export const directionExamples = [directionLTR, directionRTL];
