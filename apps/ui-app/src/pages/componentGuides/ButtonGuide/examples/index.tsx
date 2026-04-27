import { Button } from '@themeshift/ui/components/Button';
import { IconMoon } from '@themeshift/ui/icons';
import { NavLink } from 'react-router';

import styles from '../ButtonGuide.module.scss';
import { ResponsiveStackInline } from '../../components';

export const asProp = {
  code: `<Button as={NavLink} to="/ui/component/button">
  View Button docs
</Button>`,
  label: 'as prop',
  sample: (
    <Button
      as={NavLink}
      to="/ui/component/button"
      onClick={(e) => e.preventDefault()}
    >
      View Button docs
    </Button>
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
    <Button asChild onClick={(e) => e.preventDefault()}>
      <a href="https://google.com" target="__google">
        Open Google
      </a>
    </Button>
  ),
};

export const basicUsage = {
  code: '<Button>Click me</Button>',
  label: 'Basic usage',
  sample: <Button>Click me</Button>,
};

export const busy = {
  code: `<Button isBusy>Working</Button>
<Button isBusy disabled>Working</Button>
<Button isBusy visuallyDisabled>Working</Button>`,
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

export const disabled = {
  code: `<Button disabled>Disabled</Button>
<Button visuallyDisabled>Visually disabled</Button>`,
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

export const extraClassName = {
  code: `<Button className="pink-button">Pink button</Button>`,
  label: 'Class names',
  sample: <Button className={styles.pinkButton}>Pink button</Button>,
};

export const icons = {
  code: `<Button startIcon={<IconMoon aria-hidden />}>Start Icon</Button>
<Button aria-label="Toggle theme" icon={<IconMoon aria-hidden />} />
<Button endIcon={<IconMoon aria-hidden />}>End icon</Button>`,
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

const directionCode = `<Button startIcon={<IconMoon aria-hidden />}>Start icon</Button>
<Button endIcon={<IconMoon aria-hidden />}>End icon</Button>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ justify: 'center' }}
      stackProps={{ align: 'center' }}
    >
      <Button startIcon={<IconMoon aria-hidden />}>Start icon</Button>
      <Button endIcon={<IconMoon aria-hidden />}>End icon</Button>
    </ResponsiveStackInline>
  ),
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <ResponsiveStackInline
        from="desktop"
        inlineProps={{ justify: 'center' }}
        stackProps={{ align: 'center' }}
      >
        <Button startIcon={<IconMoon aria-hidden />}>Start icon</Button>
        <Button endIcon={<IconMoon aria-hidden />}>End icon</Button>
      </ResponsiveStackInline>
    </div>
  ),
};

export const intents = {
  code: `<Button>Primary</Button>
<Button intent="secondary">Secondary</Button>
<Button intent="constructive">Constructive</Button>
<Button intent="destructive">Destructive</Button>`,
  label: 'Intents',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ justify: 'center' }}
      stackProps={{ align: 'center' }}
    >
      <Button>Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="constructive">Constructive</Button>
      <Button intent="destructive">Destructive</Button>
    </ResponsiveStackInline>
  ),
};

export const variants = {
  code: `<Button>Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="link">Link</Button>

<Button intent="secondary">Solid</Button>
<Button intent="secondary" variant="outline">Outline</Button>
<Button intent="secondary" variant="link">Link</Button>

<Button intent="constructive">Solid</Button>
<Button intent="constructive" variant="outline">Outline</Button>
<Button intent="constructive" variant="link">Link</Button>

<Button intent="destructive">Solid</Button>
<Button intent="destructive" variant="outline">Outline</Button>
<Button intent="destructive" variant="link">Link</Button>`,
  label: 'Variants',
  sample: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {(['primary', 'secondary', 'constructive', 'destructive'] as const).map(
        (intent) => (
          <ResponsiveStackInline
            from="desktop"
            inlineProps={{ justify: 'center' }}
            key={intent}
            stackProps={{ align: 'center' }}
          >
            <Button intent={intent}>Solid</Button>
            <Button intent={intent} variant="outline">
              Outline
            </Button>
            <Button intent={intent} variant="link">
              Link
            </Button>
          </ResponsiveStackInline>
        )
      )}
    </div>
  ),
};

export const sizes = {
  code: `<Button size="small">Small</Button>
<Button>Medium</Button>
<Button size="large">Large</Button>
<Button size="hero">Hero</Button>
`,
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
      <Button size="hero">Hero</Button>
    </ResponsiveStackInline>
  ),
};

export const heroSize = {
  code: `<Button size="hero">Start building</Button>
<Button size="hero" variant="link">Explore docs</Button>`,
  label: 'Hero size',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ justify: 'center' }}
      stackProps={{ align: 'center' }}
    >
      <Button size="hero">Start building</Button>
      <Button size="hero" variant="link">
        Explore docs
      </Button>
    </ResponsiveStackInline>
  ),
};

export const directionExamples = [directionLTR, directionRTL];

export const propHighlights = [basicUsage, sizes, asProp, icons, busy];
