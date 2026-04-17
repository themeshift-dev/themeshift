import { Radio } from '@themeshift/ui/components/Radio';
import { useId, useState } from 'react';

const options = [
  {
    label: 'Small',
    value: 's',
    description: 'Compact for tight layouts.',
  },
  {
    label: 'Medium',
    value: 'm',
    description: 'Balanced default sizing.',
  },
  {
    label: 'Large',
    value: 'l',
    description: 'Spacious for touch-friendly UIs.',
  },
] as const;

export const ControlledRadioGroup = () => {
  const [value, setValue] = useState<(typeof options)[number]['value']>('m');
  const reactId = useId();
  const name = `size-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <Radio.Group name={name} onValueChange={setValue} value={value}>
      <legend>Size</legend>
      {options.map((option) => (
        <Radio key={option.value} value={option.value}>
          <div style={{ display: 'grid', gap: '0.125rem' }}>
            <strong>{option.label}</strong>
            <span style={{ opacity: 0.75 }}>{option.description}</span>
          </div>
        </Radio>
      ))}
    </Radio.Group>
  );
};
