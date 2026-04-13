import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';
import { IconMoon, IconSun } from '@themeshift/ui/icons';
import { useState } from 'react';

import { ResponsiveStackInline } from '../components';
import { Stack } from '@/app/components';

const ControlledToggleSwitch = () => {
  const [checked, setChecked] = useState(false);

  return (
    <ToggleSwitch
      checked={checked}
      label={checked ? 'Backups on' : 'Backups off'}
      onCheckedChange={setChecked}
    />
  );
};

export const basicUsage = {
  code: '<ToggleSwitch label="Email notifications" />',
  label: 'Basic usage',
  sample: <ToggleSwitch label="Email notifications" />,
};

export const sizes = {
  code: `<>
  <ToggleSwitch label="Small" size="small" />
  <ToggleSwitch label="Medium" />
  <ToggleSwitch label="Large" size="large" />
</>`,
  label: 'Sizes',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <ToggleSwitch label="Small" size="small" />
      <ToggleSwitch label="Medium" />
      <ToggleSwitch label="Large" size="large" />
    </ResponsiveStackInline>
  ),
};

export const intents = {
  code: `<>
  <ToggleSwitch defaultChecked label="Primary" />
  <ToggleSwitch defaultChecked intent="secondary" label="Secondary" />
  <ToggleSwitch defaultChecked intent="tertiary" label="Tertiary" />
  <ToggleSwitch defaultChecked intent="constructive" label="Constructive" />
  <ToggleSwitch defaultChecked intent="destructive" label="Destructive" />
</>`,
  label: 'Intents',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <ToggleSwitch defaultChecked label="Primary" />
      <ToggleSwitch defaultChecked intent="secondary" label="Secondary" />
      <ToggleSwitch defaultChecked intent="tertiary" label="Tertiary" />
      <ToggleSwitch defaultChecked intent="constructive" label="Constructive" />
      <ToggleSwitch defaultChecked intent="destructive" label="Destructive" />
    </ResponsiveStackInline>
  ),
};

export const labelPositions = {
  code: `<>
  <ToggleSwitch label="Label at end" labelPosition="end" />
  <ToggleSwitch label="Label at start" labelPosition="start" />
</>`,
  label: 'Label positions',
  sample: (
    <Stack>
      <ToggleSwitch label="Label at end" labelPosition="end" />
      <ToggleSwitch label="Label at start" labelPosition="start" />
    </Stack>
  ),
};

export const descriptions = {
  code: `<ToggleSwitch
  label="Automatic updates"
  description="Install updates in the background."
/>`,
  label: 'Description',
  sample: (
    <ToggleSwitch
      description="Install updates in the background."
      label="Automatic updates"
    />
  ),
};

export const errorMessages = {
  code: `<ToggleSwitch
  aria-invalid
  label="Beta features"
  description="Join the opt-in beta channel."
  errorMessage="Beta access is not enabled for this account."
/>`,
  label: 'Error message',
  sample: (
    <ToggleSwitch
      aria-invalid
      description="Join the opt-in beta channel."
      errorMessage="Beta access is not enabled for this account."
      label="Beta features"
    />
  ),
};

export const checkedChange = {
  code: `const [checked, setChecked] = useState(false);

<ToggleSwitch
  checked={checked}
  label={checked ? 'Backups on' : 'Backups off'}
  onCheckedChange={setChecked}
/>`,
  label: 'onCheckedChange',
  sample: <ControlledToggleSwitch />,
};

export const icons = {
  code: `<>
  <ToggleSwitch
    defaultChecked
    label="Theme mode"
    iconOff={<IconMoon aria-hidden />}
    iconOn={<IconSun aria-hidden />}
  />
  <ToggleSwitch
    aria-label="Theme mode"
    iconOff={<IconMoon aria-hidden />}
    iconOn={<IconSun aria-hidden />}
  />
</>`,
  label: 'Icons',
  sample: (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        justifyItems: 'center',
      }}
    >
      <ToggleSwitch
        defaultChecked
        label="Theme mode"
        iconOff={<IconMoon aria-hidden />}
        iconOn={<IconSun aria-hidden />}
      />
      <ToggleSwitch
        aria-label="Theme mode"
        iconOff={<IconMoon aria-hidden />}
        iconOn={<IconSun aria-hidden />}
      />
    </div>
  ),
};

export const states = {
  code: `<>
  <ToggleSwitch defaultChecked label="Checked" />
  <ToggleSwitch disabled defaultChecked label="Disabled" />
  <ToggleSwitch readOnly defaultChecked label="Read only" />
</>`,
  label: 'States',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <ToggleSwitch defaultChecked label="Checked" />
      <ToggleSwitch disabled defaultChecked label="Disabled" />
      <ToggleSwitch readOnly defaultChecked label="Read only" />
    </ResponsiveStackInline>
  ),
};

export const propHighlights = [basicUsage, sizes, intents, icons, states];
