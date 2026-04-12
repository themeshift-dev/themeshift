import { Button } from '@themeshift/ui/components/Button';
import { IconMoon } from '@themeshift/ui/icons/IconMoon';

import styles from './ButtonGuide.module.scss';
import { ResponsiveStackInline } from '../components';

export const basicUsage = {
  code: '<Button>Click me</Button>',
  label: 'Basic usage',
  sample: <Button>Click me</Button>,
};

export const sizes = {
  code: `<>
  <Button size="small">Small</Button>
  <Button>Medium</Button>
  <Button size="large">Large</Button>
</>`,
  label: 'Sizes',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ justify: 'center' }}
      stackProps={{ align: 'center' }}
    >
      <Button size="small">Small</Button>
      <Button>Medium</Button>
      <Button size="large">Large</Button>
    </ResponsiveStackInline>
  ),
};

export const intents = {
  code: `<>
  <Button>Primary</Button>
  <Button intent="secondary">Secondary</Button>
  <Button intent="tertiary">Tertiary</Button>
  <Button intent="constructive">Constructive</Button>
  <Button intent="destructive">Destructive</Button>
</>`,
  label: 'Intents',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ justify: 'center' }}
      stackProps={{ align: 'center' }}
    >
      <Button>Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="tertiary">Tertiary</Button>
      <Button intent="constructive">Constructive</Button>
      <Button intent="destructive">Destructive</Button>
    </ResponsiveStackInline>
  ),
};

export const icons = {
  code: `<>
  <Button startIcon={<IconMoon aria-hidden />}>Start Icon</Button>
  <Button aria-label="Toggle theme" icon={<IconMoon aria-hidden />} />
  <Button endIcon={<IconMoon aria-hidden />}>End icon</Button>
</>`,
  label: 'Icons',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ justify: 'center' }}
      stackProps={{ align: 'center' }}
    >
      <Button startIcon={<IconMoon aria-hidden />}>Start Icon</Button>
      <Button aria-label="Toggle theme" icon={<IconMoon aria-hidden />} />
      <Button endIcon={<IconMoon aria-hidden />}>End icon</Button>
    </ResponsiveStackInline>
  ),
};

export const asChild = {
  code: `<Button asChild>
  <a href="https://google.com">
    Open Google
  </a>
</Button>`,
  label: 'As Child',
  sample: (
    <Button asChild>
      <a href="https://google.com" target="__google">
        Open Google
      </a>
    </Button>
  ),
};

export const extraClassName = {
  code: `<Button className="pink-button">Pink button</Button>`,
  label: 'Class names',
  sample: <Button className={styles.pinkButton}>Pink button</Button>,
};

export const disabled = {
  code: `<>
  <Button disabled>Disabled</Button>
  <Button visuallyDisabled>Visually disabled</Button>
</>`,
  label: 'Disabled',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ justify: 'center' }}
      stackProps={{ align: 'center' }}
    >
      <Button disabled>Disabled</Button>
      <Button visuallyDisabled>Visually disabled</Button>
    </ResponsiveStackInline>
  ),
};

export const busy = {
  code: `<>
  <Button isBusy>Working</Button>
  <Button isBusy disabled>Working</Button>
  <Button isBusy visuallyDisabled>Working</Button>
</>`,
  label: 'Busy',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ justify: 'center' }}
      stackProps={{ align: 'center' }}
    >
      <Button isBusy>Working</Button>
      <Button isBusy disabled>
        Working
      </Button>
      <Button isBusy visuallyDisabled>
        Working
      </Button>
    </ResponsiveStackInline>
  ),
};

export const propHighlights = [basicUsage, sizes, intents, icons, busy];
