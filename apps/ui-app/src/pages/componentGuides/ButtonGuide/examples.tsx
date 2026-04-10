import { Button } from '@themeshift/ui/components/Button';
import { IconMoon } from '@themeshift/ui/icons/IconMoon';

import styles from './ButtonGuide.module.scss';

export const sizes = {
  code: `<>
  <Button size="small">Small</Button>
  <Button>Medium</Button>
  <Button size="large">Large</Button>
</>`,
  label: 'Sizes',
  sample: (
    <>
      <Button size="small">Small</Button>
      <Button>Medium</Button>
      <Button size="large">Large</Button>
    </>
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
    <>
      <Button>Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="tertiary">Tertiary</Button>
      <Button intent="constructive">Constructive</Button>
      <Button intent="destructive">Destructive</Button>
    </>
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
    <>
      <Button startIcon={<IconMoon aria-hidden />}>Start Icon</Button>
      <Button aria-label="Toggle theme" icon={<IconMoon aria-hidden />} />
      <Button endIcon={<IconMoon aria-hidden />}>End icon</Button>
    </>
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
    <>
      <Button disabled>Disabled</Button>
      <Button visuallyDisabled>Visually disabled</Button>
    </>
  ),
};

export const propHighlights = [
  {
    code: '<Button>Click me</Button>',
    label: 'Basic usage',
    sample: <Button>Click me</Button>,
  },

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
      <>
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
      </>
    ),
  },
  {
    code: `<>
  <Button isBusy size="small">
    Working
  </Button>
  <Button isBusy>Working</Button>
  <Button isBusy size="large">
    Working
  </Button>
</>`,
    label: 'Busy',
    sample: (
      <>
        <Button isBusy size="small">
          Working
        </Button>
        <Button isBusy>Working</Button>
        <Button isBusy size="large">
          Working
        </Button>
      </>
    ),
  },
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
        <div className={styles.buttonGroup}>
          <Button size="small">Small</Button>
          <Button>Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div className={styles.buttonGroup}>
          <Button disabled size="small">
            Small
          </Button>
          <Button disabled>Medium</Button>
          <Button disabled size="large">
            Large
          </Button>
        </div>

        <div className={styles.buttonGroup}>
          <Button size="small" isBusy>
            Small
          </Button>
          <Button isBusy>Medium</Button>
          <Button size="large" isBusy>
            Large
          </Button>
        </div>
        <div className={styles.buttonGroup}>
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

        <div className={styles.buttonGroup}>
          <Button>Primary</Button>
          <Button intent="secondary">Secondary</Button>
          <Button intent="tertiary">Tertiary</Button>
          <Button intent="constructive">Constructive</Button>
          <Button intent="destructive">Destructive</Button>
        </div>
        <div className={styles.buttonGroup}>
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

        <div className={styles.buttonGroup}>
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
        <div className={styles.buttonGroup}>
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
