import { Field } from '@themeshift/ui/components/Field';
import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';
import { useState } from 'react';

export const ControlledToggleSwitch = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Field layout="inline-control">
      <ToggleSwitch checked={checked} onCheckedChange={setChecked} />
      <Field.Label>{checked ? 'Backups on' : 'Backups off'}</Field.Label>
    </Field>
  );
};
