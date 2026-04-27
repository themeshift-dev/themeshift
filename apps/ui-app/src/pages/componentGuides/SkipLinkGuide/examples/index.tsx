import { SkipLink } from '@themeshift/ui/components/SkipLink';

export const basicUsage = {
  code: `<>
  <SkipLink href="#main-content">Skip to main content</SkipLink>
  <main id="main-content">Page content</main>
</>`,
  label: 'Basic usage',
  sample: (
    <div>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <main id="main-content">Page content</main>
    </div>
  ),
};

export const labelProp = {
  code: '<SkipLink href="#main-content" label="Skip navigation" />',
  label: 'label prop',
  sample: <SkipLink href="#main-content" label="Skip navigation" />,
};

export const withCustomAttributes = {
  code: `<SkipLink
  href="#main-content"
  id="primary-skip-link"
  title="Jump to the main region"
>
  Skip to content
</SkipLink>`,
  label: 'Native anchor props',
  sample: (
    <SkipLink
      href="#main-content"
      id="primary-skip-link"
      title="Jump to the main region"
    >
      Skip to content
    </SkipLink>
  ),
};

export const multipleTargets = {
  code: `<>
  <SkipLink href="#main-content">Skip to main content</SkipLink>
  <SkipLink href="#search">Skip to search</SkipLink>
</>`,
  label: 'Multiple skip links',
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#search">Skip to search</SkipLink>
    </div>
  ),
};

const directionCode = `<>
  <SkipLink href="#main-content">Skip to main content</SkipLink>
  <main id="main-content">Page content</main>
</>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: (
    <div>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <main id="main-content">Page content</main>
    </div>
  ),
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <main id="main-content">Page content</main>
    </div>
  ),
};

export const propHighlights = [basicUsage, labelProp, withCustomAttributes];

export const directionExamples = [directionLTR, directionRTL];
