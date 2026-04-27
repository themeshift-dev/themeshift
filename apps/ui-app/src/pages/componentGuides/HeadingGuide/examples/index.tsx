import { Heading } from '@themeshift/ui/components/Heading';

export const basicUsage = {
  code: '<Heading level={2}>Account settings</Heading>',
  label: 'Basic usage',
  sample: <Heading level={2}>Account settings</Heading>,
};

export const levels = {
  code: `<Heading level={1}>Heading level 1</Heading>
<Heading level={2}>Heading level 2</Heading>
<Heading level={3}>Heading level 3</Heading>
<Heading level={4}>Heading level 4</Heading>
<Heading level={5}>Heading level 5</Heading>
<Heading level={6}>Heading level 6</Heading>`,
  label: 'Levels',
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
      <Heading level={5}>Heading level 5</Heading>
      <Heading level={6}>Heading level 6</Heading>
    </div>
  ),
};

export const muted = {
  code: `<Heading level={3}>Primary heading</Heading>
<Heading level={3} muted>
  Supporting heading
</Heading>`,
  label: 'Muted style',
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Heading level={3}>Primary heading</Heading>
      <Heading level={3} muted>
        Supporting heading
      </Heading>
    </div>
  ),
};

export const nativeProps = {
  code: '<Heading id="usage" level={2}>Usage</Heading>',
  label: 'Native props',
  sample: (
    <Heading id="usage" level={2}>
      Usage
    </Heading>
  ),
};

export const propHighlights = [basicUsage, levels, muted];
