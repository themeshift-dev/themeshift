import { Field } from '@themeshift/ui/components/Field';
import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';
import { IconMoon, IconSun } from '@themeshift/ui/icons';

import { Stack } from '@/app/components';

import { ResponsiveStackInline } from '../../components';
import { ControlledToggleSwitch } from './ControlledToggleSwitch';

export const basicUsage = {
  code: `<label htmlFor="email-notifications">
  Email notifications
  <ToggleSwitch id="email-notifications" />
</label>`,
  label: 'Basic usage',
  sample: (
    <label
      htmlFor="email-notifications"
      style={{ alignItems: 'center', display: 'inline-flex', gap: '0.75rem' }}
    >
      Email notifications
      <ToggleSwitch id="email-notifications" />
    </label>
  ),
};

export const sizes = {
  code: `<>
  <Field layout="inline-control">
    <ToggleSwitch size="small" />
    <Field.Label>Small</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch />
    <Field.Label>Medium</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch size="large" />
    <Field.Label>Large</Field.Label>
  </Field>
</>`,
  label: 'Sizes',
  sample: (
    <Stack>
      <Field layout="inline-control">
        <ToggleSwitch size="small" />
        <Field.Label>Small</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch />
        <Field.Label>Medium</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch size="large" />
        <Field.Label>Large</Field.Label>
      </Field>
    </Stack>
  ),
};

export const intents = {
  code: `<>
  <Field layout="inline-control">
    <ToggleSwitch defaultChecked intent="primary" />
    <Field.Label>Primary</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch defaultChecked intent="secondary" />
    <Field.Label>Secondary</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch defaultChecked intent="tertiary" />
    <Field.Label>Tertiary</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch defaultChecked intent="constructive" />
    <Field.Label>Constructive</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch defaultChecked intent="destructive" />
    <Field.Label>Destructive</Field.Label>
  </Field>
</>`,
  label: 'Intents',
  sample: (
    <Stack>
      <Field layout="inline-control">
        <ToggleSwitch defaultChecked intent="primary" />
        <Field.Label>Primary</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch defaultChecked intent="secondary" />
        <Field.Label>Secondary</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch defaultChecked intent="tertiary" />
        <Field.Label>Tertiary</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch defaultChecked intent="constructive" />
        <Field.Label>Constructive</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch defaultChecked intent="destructive" />
        <Field.Label>Destructive</Field.Label>
      </Field>
    </Stack>
  ),
};

export const withFieldInline = {
  code: `<Field layout="inline-control">
  <ToggleSwitch name="notifications" />
  <Field.Label>Enable notifications</Field.Label>
</Field>`,
  label: 'With Field',
  sample: (
    <Field layout="inline-control">
      <ToggleSwitch name="notifications" />
      <Field.Label>Enable notifications</Field.Label>
    </Field>
  ),
};

export const withDescriptionAndError = {
  code: `<Field align="start" layout="inline-control" validationState="invalid">
  <ToggleSwitch name="themeSync" required />
  <div>
    <Field.Label>Sync with system theme</Field.Label>
    <Field.Description>
      Keep your app theme aligned with system settings.
    </Field.Description>
    <Field.Error>Theme sync could not be enabled for this account.</Field.Error>
  </div>
</Field>`,
  label: 'Description and error',
  sample: (
    <Field align="start" layout="inline-control" validationState="invalid">
      <ToggleSwitch name="themeSync" required />
      <div>
        <Field.Label>Sync with system theme</Field.Label>
        <Field.Description>
          Keep your app theme aligned with system settings.
        </Field.Description>
        <Field.Error>
          Theme sync could not be enabled for this account.
        </Field.Error>
      </div>
    </Field>
  ),
};

export const checkedChange = {
  code: `const [checked, setChecked] = useState(false);

<Field layout="inline-control">
  <ToggleSwitch checked={checked} onCheckedChange={setChecked} />
  <Field.Label>{checked ? 'Backups on' : 'Backups off'}</Field.Label>
</Field>`,
  label: 'onCheckedChange',
  sample: <ControlledToggleSwitch />,
};

export const icons = {
  code: `<>
  <Field layout="inline-control">
    <ToggleSwitch
      defaultChecked
      trackIconOff={<IconMoon aria-hidden />}
      trackIconOn={<IconSun aria-hidden />}
    />
    <Field.Label>Track icons</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch
      defaultChecked
      thumbIconOff={<IconMoon aria-hidden />}
      thumbIconOn={<IconSun aria-hidden />}
    />
    <Field.Label>Thumb icons</Field.Label>
  </Field>
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
      <Field layout="inline-control">
        <ToggleSwitch
          defaultChecked
          trackIconOff={<IconMoon aria-hidden />}
          trackIconOn={<IconSun aria-hidden />}
        />
        <Field.Label>Track icons</Field.Label>
      </Field>

      <Field layout="inline-control">
        <ToggleSwitch
          defaultChecked
          thumbIconOff={<IconMoon aria-hidden />}
          thumbIconOn={<IconSun aria-hidden />}
        />
        <Field.Label>Thumb icons</Field.Label>
      </Field>
    </div>
  ),
};

export const validationStates = {
  code: `<>
  <Field layout="inline-control" validationState="invalid">
    <ToggleSwitch />
    <Field.Label>Invalid</Field.Label>
  </Field>
  <Field layout="inline-control" validationState="valid">
    <ToggleSwitch />
    <Field.Label>Valid</Field.Label>
  </Field>
  <Field layout="inline-control" validationState="warning">
    <ToggleSwitch />
    <Field.Label>Warning</Field.Label>
  </Field>
</>`,
  label: 'Validation states',
  sample: (
    <Stack>
      <Field layout="inline-control" validationState="invalid">
        <ToggleSwitch />
        <Field.Label>Invalid</Field.Label>
      </Field>
      <Field layout="inline-control" validationState="valid">
        <ToggleSwitch />
        <Field.Label>Valid</Field.Label>
      </Field>
      <Field layout="inline-control" validationState="warning">
        <ToggleSwitch />
        <Field.Label>Warning</Field.Label>
      </Field>
    </Stack>
  ),
};

export const states = {
  code: `<>
  <Field layout="inline-control">
    <ToggleSwitch defaultChecked />
    <Field.Label>Checked</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch defaultChecked disabled />
    <Field.Label>Disabled</Field.Label>
  </Field>
  <Field layout="inline-control">
    <ToggleSwitch defaultChecked readOnly />
    <Field.Label>Read only</Field.Label>
  </Field>
</>`,
  label: 'States',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'start', justify: 'center', wrap: true }}
      stackProps={{ align: 'stretch' }}
    >
      <Field layout="inline-control">
        <ToggleSwitch defaultChecked />
        <Field.Label>Checked</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch defaultChecked disabled />
        <Field.Label>Disabled</Field.Label>
      </Field>
      <Field layout="inline-control">
        <ToggleSwitch defaultChecked readOnly />
        <Field.Label>Read only</Field.Label>
      </Field>
    </ResponsiveStackInline>
  ),
};

export const propHighlights = [
  basicUsage,
  withFieldInline,
  withDescriptionAndError,
  icons,
  states,
];
