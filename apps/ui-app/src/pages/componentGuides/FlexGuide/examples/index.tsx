import { Badge } from '@themeshift/ui/components/Badge';
import { Button } from '@themeshift/ui/components/Button';
import { Flex } from '@themeshift/ui/components/Flex';
import { Heading } from '@themeshift/ui/components/Heading';
import { Input } from '@themeshift/ui/components/Input';

export const basicUsage = {
  code: `<Flex gap="4" align="center" justify="between">
  <Heading level={2}>Quarterly revenue</Heading>
  <Button>Export report</Button>
</Flex>`,
  label: 'Basic usage',
  sample: (
    <Flex align="center" gap="4" justify="between">
      <Heading level={2}>Quarterly revenue</Heading>
      <Button>Export report</Button>
    </Flex>
  ),
};

export const responsiveDirection = {
  code: `<Flex direction={{ base: 'column', tablet: 'row' }} gap="4">
  <Input aria-label="Search customers" placeholder="Search customers" />
  <Button>Apply filters</Button>
</Flex>`,
  label: 'Responsive direction',
  sample: (
    <Flex direction={{ base: 'column', tablet: 'row' }} gap="4">
      <Input aria-label="Search customers" placeholder="Search customers" />
      <Button>Apply filters</Button>
    </Flex>
  ),
};

export const inlineLayout = {
  code: `<Flex inline align="center" gap="2">
  <Badge tone="info">Pro plan</Badge>
  <Badge tone="success">Sync healthy</Badge>
</Flex>`,
  label: 'Inline flex',
  sample: (
    <Flex align="center" gap="2" inline>
      <Badge tone="info">Pro plan</Badge>
      <Badge tone="success">Sync healthy</Badge>
    </Flex>
  ),
};

export const wrappingRows = {
  code: `<Flex gap="3" rowGap="4" wrap="wrap">
  <Button>Assign owner</Button>
  <Button>Set due date</Button>
  <Button>Request review</Button>
  <Button>Mark complete</Button>
</Flex>`,
  label: 'Wrapping rows',
  sample: (
    <Flex gap="3" rowGap="4" wrap="wrap">
      <Button>Assign owner</Button>
      <Button>Set due date</Button>
      <Button>Request review</Button>
      <Button>Mark complete</Button>
    </Flex>
  ),
};

export const keepDomOrderMeaningful = {
  code: `<Flex align="center" gap="3" justify="between">
  <Heading level={3}>Billing and usage</Heading>
  <Button>Manage subscription</Button>
</Flex>`,
  label: 'Keep DOM order meaningful',
  sample: (
    <Flex align="center" gap="3" justify="between">
      <Heading level={3}>Billing and usage</Heading>
      <Button>Manage subscription</Button>
    </Flex>
  ),
};

export const semanticWrappers = {
  code: `<Flex as="nav" aria-label="Project sections" gap="2">
  <Button intent="secondary">Overview</Button>
  <Button intent="secondary">Roadmap</Button>
  <Button intent="secondary">Team</Button>
</Flex>`,
  label: 'Use semantic wrappers',
  sample: (
    <Flex as="nav" aria-label="Project sections" gap="2">
      <Button intent="secondary">Overview</Button>
      <Button intent="secondary">Roadmap</Button>
      <Button intent="secondary">Team</Button>
    </Flex>
  ),
};

export const testFocusAtEachBreakpoint = {
  code: `<Flex direction={{ base: 'column', tablet: 'row' }} gap="3">
  <Input aria-label="First name" placeholder="First name" />
  <Input aria-label="Last name" placeholder="Last name" />
  <Input aria-label="Work email" placeholder="Work email" />
  <Button>Save contact</Button>
</Flex>`,
  label: 'Test focus at each breakpoint',
  sample: (
    <Flex direction={{ base: 'column', tablet: 'row' }} gap="3">
      <Input aria-label="First name" placeholder="First name" />
      <Input aria-label="Last name" placeholder="Last name" />
      <Input aria-label="Work email" placeholder="Work email" />
      <Button>Save contact</Button>
    </Flex>
  ),
};

export const propHighlights = [basicUsage, responsiveDirection, inlineLayout];
