import { Textarea } from '@themeshift/ui/components/Textarea';

import { ResponsiveStackInline } from '../../components';

export const basicUsage = {
  code: '<Textarea aria-label="Project notes" placeholder="Write your notes..." />',
  label: 'Basic usage',
  sample: (
    <Textarea aria-label="Project notes" placeholder="Write your notes..." />
  ),
};

export const sizes = {
  code: `<>
  <Textarea aria-label="Small" placeholder="Small" size="small" />
  <Textarea aria-label="Medium" placeholder="Medium" />
  <Textarea aria-label="Large" placeholder="Large" size="large" />
</>`,
  label: 'Sizes',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'stretch', justify: 'center', wrap: true }}
      stackProps={{ align: 'stretch' }}
    >
      <Textarea aria-label="Small" placeholder="Small" size="small" />
      <Textarea aria-label="Medium" placeholder="Medium" />
      <Textarea aria-label="Large" placeholder="Large" size="large" />
    </ResponsiveStackInline>
  ),
};

export const validationStates = {
  code: `<>
  <Textarea aria-label="Default state" placeholder="Default" />
  <Textarea aria-label="Invalid state" placeholder="Invalid" validationState="invalid" />
  <Textarea aria-label="Valid state" placeholder="Valid" validationState="valid" />
  <Textarea aria-label="Warning state" placeholder="Warning" validationState="warning" />
</>`,
  label: 'Validation states',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'stretch', justify: 'center', wrap: true }}
      stackProps={{ align: 'stretch' }}
    >
      <Textarea aria-label="Default state" placeholder="Default" />
      <Textarea
        aria-label="Invalid state"
        placeholder="Invalid"
        validationState="invalid"
      />
      <Textarea
        aria-label="Valid state"
        placeholder="Valid"
        validationState="valid"
      />
      <Textarea
        aria-label="Warning state"
        placeholder="Warning"
        validationState="warning"
      />
    </ResponsiveStackInline>
  ),
};

export const resizeModes = {
  code: `<>
  <Textarea aria-label="None" placeholder="Resize none" resize="none" />
  <Textarea aria-label="Vertical" placeholder="Resize vertical" resize="vertical" />
  <Textarea aria-label="Horizontal" placeholder="Resize horizontal" resize="horizontal" />
  <Textarea aria-label="Both" placeholder="Resize both" resize="both" />
</>`,
  label: 'Resize modes',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'stretch', justify: 'center', wrap: true }}
      stackProps={{ align: 'stretch' }}
    >
      <Textarea aria-label="None" placeholder="Resize none" resize="none" />
      <Textarea
        aria-label="Vertical"
        placeholder="Resize vertical"
        resize="vertical"
      />
      <Textarea
        aria-label="Horizontal"
        placeholder="Resize horizontal"
        resize="horizontal"
      />
      <Textarea aria-label="Both" placeholder="Resize both" resize="both" />
    </ResponsiveStackInline>
  ),
};

export const autoResize = {
  code: `<Textarea
  aria-label="Auto resize"
  resize="auto"
  minRows={2}
  maxRows={6}
  placeholder="Type multiple lines to see autosize"
/>`,
  label: 'Auto resize',
  sample: (
    <Textarea
      aria-label="Auto resize"
      maxRows={6}
      minRows={2}
      placeholder="Type multiple lines to see autosize"
      resize="auto"
    />
  ),
};

export const widths = {
  code: `<>
  <Textarea aria-label="Full width textarea" placeholder="Full width (default)" />
  <Textarea
    aria-label="Inline textarea"
    fullWidth={false}
    placeholder="Inline"
    size="small"
  />
</>`,
  label: 'Widths',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'stretch', justify: 'center', wrap: true }}
      stackProps={{ align: 'stretch' }}
    >
      <Textarea
        aria-label="Full width textarea"
        placeholder="Full width (default)"
      />
      <Textarea
        aria-label="Inline textarea"
        fullWidth={false}
        placeholder="Inline"
        size="small"
      />
    </ResponsiveStackInline>
  ),
};

export const disabled = {
  code: `<>
  <Textarea aria-label="Disabled textarea" disabled placeholder="Disabled" />
  <Textarea
    aria-label="Disabled invalid"
    disabled
    validationState="invalid"
    placeholder="Disabled + invalid"
  />
</>`,
  label: 'Disabled',
  sample: (
    <ResponsiveStackInline
      from="desktop"
      inlineProps={{ align: 'stretch', justify: 'center', wrap: true }}
      stackProps={{ align: 'stretch' }}
    >
      <Textarea
        aria-label="Disabled textarea"
        disabled
        placeholder="Disabled"
      />
      <Textarea
        aria-label="Disabled invalid"
        disabled
        placeholder="Disabled + invalid"
        validationState="invalid"
      />
    </ResponsiveStackInline>
  ),
};

export const propHighlights = [
  basicUsage,
  sizes,
  validationStates,
  autoResize,
  resizeModes,
];
