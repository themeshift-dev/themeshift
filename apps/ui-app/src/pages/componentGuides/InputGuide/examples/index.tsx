import { Button } from '@themeshift/ui/components/Button';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { IconMoon } from '@themeshift/ui/icons';
import { FaSearch } from 'react-icons/fa';

import styles from '../InputGuide.module.scss';
import { ResponsiveStackInline } from '../../components';

export const basicUsage = {
  code: '<Input aria-label="Email address" placeholder="you@example.com" />',
  label: 'Basic usage',
  sample: <Input aria-label="Email address" placeholder="you@example.com" />,
};

export const sizes = {
  code: `<Input aria-label="Small" placeholder="Small" size="small" />
<Input aria-label="Medium" placeholder="Medium" />
<Input aria-label="Large" placeholder="Large" size="large" />`,
  label: 'Sizes',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Input aria-label="Small" placeholder="Small" size="small" />
      <Input aria-label="Medium" placeholder="Medium" />
      <Input aria-label="Large" placeholder="Large" size="large" />
    </ResponsiveStackInline>
  ),
};

export const validationStates = {
  code: `<Input aria-label="Default state" placeholder="Default" />
<Input aria-label="Invalid state" placeholder="Invalid" validationState="invalid" />
<Input aria-label="Valid state" placeholder="Valid" validationState="valid" />
<Input aria-label="Warning state" placeholder="Warning" validationState="warning" />`,
  label: 'Validation states',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Input aria-label="Default state" placeholder="Default" />
      <Input
        aria-label="Invalid state"
        placeholder="Invalid"
        validationState="invalid"
      />
      <Input
        aria-label="Valid state"
        placeholder="Valid"
        validationState="valid"
      />
      <Input
        aria-label="Warning state"
        placeholder="Warning"
        validationState="warning"
      />
    </ResponsiveStackInline>
  ),
};

export const adornments = {
  code: `<Input
  aria-label="Search"
  placeholder="Search docs"
  startAdornment={<IconMoon aria-hidden />}
/>
<Input
  aria-label="Domain"
  placeholder="your-handle"
  endAdornment={<span>.com</span>}
/>`,
  label: 'Adornments',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Input
        aria-label="Search"
        placeholder="Search docs"
        startAdornment={<IconMoon aria-hidden />}
      />
      <Input
        aria-label="Domain"
        placeholder="your-handle"
        endAdornment={<span>.com</span>}
      />
    </ResponsiveStackInline>
  ),
};

const directionCode = `<Input
  aria-label="Search"
  placeholder="Search docs"
  startAdornment={<IconMoon aria-hidden />}
/>
<Input
  aria-label="Domain"
  placeholder="your-handle"
  endAdornment={<span>.com</span>}
/>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Input
        aria-label="Search"
        placeholder="Search docs"
        startAdornment={<IconMoon aria-hidden />}
      />
      <Input
        aria-label="Domain"
        placeholder="your-handle"
        endAdornment={<span>.com</span>}
      />
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
        inlineProps={{ align: 'center', justify: 'center', wrap: true }}
        stackProps={{ align: 'center' }}
      >
        <Input
          aria-label="Search"
          placeholder="Search docs"
          startAdornment={<IconMoon aria-hidden />}
        />
        <Input
          aria-label="Domain"
          placeholder="your-handle"
          endAdornment={<span>.com</span>}
        />
      </ResponsiveStackInline>
    </div>
  ),
};

export const widths = {
  code: `<Input aria-label="Full width input" placeholder="Full width (default)" />
<Input
  aria-label="Inline input"
  fullWidth={false}
  placeholder="Inline"
  size="small"
/>`,
  label: 'Widths',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Input aria-label="Full width input" placeholder="Full width (default)" />
      <Input
        aria-label="Inline input"
        fullWidth={false}
        placeholder="Inline"
        size="small"
      />
    </ResponsiveStackInline>
  ),
};

export const classNames = {
  code: `<Input
  aria-label="Custom classes"
  className="custom-input-wrapper"
  inputClassName="custom-input"
  placeholder="Custom classes"
/>`,
  label: 'Class names',
  sample: (
    <Input
      aria-label="Custom classes"
      className={styles.customInputWrapper}
      inputClassName={styles.customInput}
      placeholder="Custom classes"
    />
  ),
};

export const disabled = {
  code: `<Input aria-label="Disabled input" disabled placeholder="Disabled" />
<Input aria-label="Disabled with adornment" disabled placeholder="Disabled" startAdornment={<IconMoon aria-hidden />} />`,
  label: 'Disabled',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'center', justify: 'center', wrap: true }}
      stackProps={{ align: 'center' }}
    >
      <Input aria-label="Disabled input" disabled placeholder="Disabled" />
      <Input
        aria-label="Disabled with adornment"
        disabled
        placeholder="Disabled"
        startAdornment={<IconMoon aria-hidden />}
      />
    </ResponsiveStackInline>
  ),
};

export const withAction = {
  code: `<Input
  aria-label="Search with action"
  placeholder="Search by keyword"
  endAdornment={
    <Button
      aria-label="Search"
      icon={<FaSearch aria-hidden />}
      size="small"
      type="button"
    />
  }
/>`,
  label: 'Action adornment',
  sample: (
    <Input
      aria-label="Search with action"
      placeholder="Search by keyword"
      endAdornment={
        <Button
          aria-label="Search"
          icon={<FaSearch aria-hidden />}
          size="small"
          type="button"
        />
      }
    />
  ),
};

export const withField = {
  code: `<Field
  description="We'll only use this for account updates."
  label="Email address"
  required
>
  <Input placeholder="you@example.com" type="email" />
</Field>`,
  label: 'With Field',
  sample: (
    <Field
      description="We'll only use this for account updates."
      label="Email address"
      required
    >
      <Input placeholder="you@example.com" type="email" />
    </Field>
  ),
};

export const propHighlights = [
  basicUsage,
  sizes,
  validationStates,
  adornments,
  withField,
  withAction,
];

export const directionExamples = [directionLTR, directionRTL];
