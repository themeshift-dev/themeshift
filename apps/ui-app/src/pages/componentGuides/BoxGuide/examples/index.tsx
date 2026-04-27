import { Box } from '@themeshift/ui/components/Box';

export const basicUsage = {
  code: `<Box padding="4" marginBottom="6">
  <h3>Team update</h3>
  <p>Platform migration is 70% complete and on schedule.</p>
</Box>`,
  label: 'Basic usage',
  sample: (
    <Box marginBottom="6" padding="4">
      <h3>Team update</h3>
      <p>Platform migration is 70% complete and on schedule.</p>
    </Box>
  ),
};

export const responsiveSpacing = {
  code: `<Box
  padding={{ base: '3', tablet: '5', desktop: '8' }}
  width={{ base: '100%', desktop: '48rem' }}
>
  <h3>Release summary</h3>
  <p>Compare rollout health and incident volume by environment.</p>
</Box>`,
  label: 'Responsive spacing + sizing',
  sample: (
    <Box
      padding={{ base: '3', tablet: '5', desktop: '8' }}
      width={{ base: '100%', desktop: '48rem' }}
    >
      <h3>Release summary</h3>
      <p>Compare rollout health and incident volume by environment.</p>
    </Box>
  ),
};

export const asSemanticElement = {
  code: `<Box as="section" aria-labelledby="box-title" padding="4">
  <h3 id="box-title">Billing overview</h3>
  <p>Invoices, payment methods, and plan limits.</p>
</Box>`,
  label: 'Polymorphic as',
  sample: (
    <Box as="section" aria-labelledby="box-title" padding="4">
      <h3 id="box-title">Billing overview</h3>
      <p>Invoices, payment methods, and plan limits.</p>
    </Box>
  ),
};

export const rawCssEscapeHatch = {
  code: `<Box padding="1.25rem" maxWidth="72ch" overflow="auto">
  Long stack trace and request payload details…
</Box>`,
  label: 'Raw CSS escape hatch',
  sample: (
    <Box maxWidth="72ch" overflow="auto" padding="1.25rem">
      Long stack trace and request payload details…
    </Box>
  ),
};

export const meaningfulStructure = {
  code: `<article>
  <Box as="header" paddingBottom="2">
    <h3>Incident retrospective</h3>
  </Box>
  <Box as="section" paddingTop="2">
    <p>Root cause, mitigation, and follow-up actions.</p>
  </Box>
</article>`,
  label: 'Meaningful structure',
  sample: (
    <article>
      <Box as="header" paddingBottom="2">
        <h3>Incident retrospective</h3>
      </Box>
      <Box as="section" paddingTop="2">
        <p>Root cause, mitigation, and follow-up actions.</p>
      </Box>
    </article>
  ),
};

export const labeledRegion = {
  code: `<Box as="nav" aria-label="Primary actions" padding="3">
  <a href="#">Overview</a>
  <a href="#">Deployments</a>
  <a href="#">Alerts</a>
</Box>`,
  label: 'Labeled region',
  sample: (
    <Box as="nav" aria-label="Primary actions" padding="3">
      <a href="#">Overview</a> <a href="#">Deployments</a>{' '}
      <a href="#">Alerts</a>
    </Box>
  ),
};

export const propHighlights = [
  basicUsage,
  responsiveSpacing,
  asSemanticElement,
];
