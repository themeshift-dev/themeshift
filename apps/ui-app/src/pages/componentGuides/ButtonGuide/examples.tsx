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
    <ResponsiveStackInline from="desktop">
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
    <ResponsiveStackInline from="desktop">
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
    <ResponsiveStackInline from="desktop">
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
    <ResponsiveStackInline from="desktop">
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
    <ResponsiveStackInline from="desktop">
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

export const propHighlights = [
  basicUsage,
  sizes,
  intents,

  {
    code: `<>
  <Button
    size="small"
    aria-label="Toggle theme"
    icon={<IconMoon size={12} aria-hidden />}
  />
  <Button aria-label="Toggle theme" icon={<IconMoon aria-hidden />} />
  <Button
    size="large"
    aria-label="Toggle theme"
    icon={<IconMoon size={20} aria-hidden />}
  />
</>`,
    label: 'Icon',
    sample: (
      <ResponsiveStackInline from="desktop">
        <Button
          size="small"
          aria-label="Toggle theme"
          icon={<IconMoon size={12} aria-hidden />}
        />
        <Button aria-label="Toggle theme" icon={<IconMoon aria-hidden />} />
        <Button
          size="large"
          aria-label="Toggle theme"
          icon={<IconMoon size={20} aria-hidden />}
        />
      </ResponsiveStackInline>
    ),
  },

  busy,

  {
    code: `<>
  <Button size="small">Small</Button>
  <Button>Medium</Button>
  <Button size="large">Large</Button>

  <Button disabled size="small">
    Small
  </Button>
  <Button disabled>Medium</Button>
  <Button disabled size="large">
    Large
  </Button>

  <Button size="small" isBusy>
    Small
  </Button>
  <Button isBusy>Medium</Button>
  <Button size="large" isBusy>
    Large
  </Button>

  <Button disabled size="small" isBusy>
    Small
  </Button>
  <Button disabled isBusy>
    Medium
  </Button>
  <Button disabled size="large" isBusy>
    Large
  </Button>


  <Button>Primary</Button>
  <Button intent="secondary">Secondary</Button>
  <Button intent="tertiary">Tertiary</Button>
  <Button intent="constructive">Constructive</Button>
  <Button intent="destructive">Destructive</Button>

  <Button disabled>Primary</Button>
  <Button disabled intent="secondary">
    Secondary
  </Button>
  <Button disabled intent="tertiary">
    Tertiary
  </Button>
  <Button disabled intent="constructive">
    Constructive
  </Button>
  <Button disabled intent="destructive">
    Destructive
  </Button>


  <Button isBusy>Primary</Button>
  <Button intent="secondary" isBusy>
    Secondary
  </Button>
  <Button intent="tertiary" isBusy>
    Tertiary
  </Button>
  <Button intent="constructive" isBusy>
    Constructive
  </Button>
  <Button intent="destructive" isBusy>
    Destructive
  </Button>


  <Button disabled isBusy>
    Primary
  </Button>
  <Button disabled intent="secondary" isBusy>
    Secondary
  </Button>
  <Button disabled intent="tertiary" isBusy>
    Tertiary
  </Button>
  <Button disabled intent="constructive" isBusy>
    Constructive
  </Button>
  <Button disabled intent="destructive" isBusy>
    Destructive
  </Button>
</>`,
    label: 'Matrix',
    sample: (
      <>
        <div className={styles.matrixButtonGroup}>
          <Button size="small">Small</Button>
          <Button>Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div className={styles.matrixButtonGroup}>
          <Button disabled size="small">
            Small
          </Button>
          <Button disabled>Medium</Button>
          <Button disabled size="large">
            Large
          </Button>
        </div>

        <div className={styles.matrixButtonGroup}>
          <Button size="small" isBusy>
            Small
          </Button>
          <Button isBusy>Medium</Button>
          <Button size="large" isBusy>
            Large
          </Button>
        </div>
        <div className={styles.matrixButtonGroup}>
          <Button disabled size="small" isBusy>
            Small
          </Button>
          <Button disabled isBusy>
            Medium
          </Button>
          <Button disabled size="large" isBusy>
            Large
          </Button>
        </div>

        <div className={styles.matrixButtonGroup}>
          <Button>Primary</Button>
          <Button intent="secondary">Secondary</Button>
          <Button intent="tertiary">Tertiary</Button>
          <Button intent="constructive">Constructive</Button>
          <Button intent="destructive">Destructive</Button>
        </div>
        <div className={styles.matrixButtonGroup}>
          <Button disabled>Primary</Button>
          <Button disabled intent="secondary">
            Secondary
          </Button>
          <Button disabled intent="tertiary">
            Tertiary
          </Button>
          <Button disabled intent="constructive">
            Constructive
          </Button>
          <Button disabled intent="destructive">
            Destructive
          </Button>
        </div>

        <div className={styles.matrixButtonGroup}>
          <Button isBusy>Primary</Button>
          <Button intent="secondary" isBusy>
            Secondary
          </Button>
          <Button intent="tertiary" isBusy>
            Tertiary
          </Button>
          <Button intent="constructive" isBusy>
            Constructive
          </Button>
          <Button intent="destructive" isBusy>
            Destructive
          </Button>
        </div>
        <div className={styles.matrixButtonGroup}>
          <Button disabled isBusy>
            Primary
          </Button>
          <Button disabled intent="secondary" isBusy>
            Secondary
          </Button>
          <Button disabled intent="tertiary" isBusy>
            Tertiary
          </Button>
          <Button disabled intent="constructive" isBusy>
            Constructive
          </Button>
          <Button disabled intent="destructive" isBusy>
            Destructive
          </Button>
        </div>
      </>
    ),
  },
];
