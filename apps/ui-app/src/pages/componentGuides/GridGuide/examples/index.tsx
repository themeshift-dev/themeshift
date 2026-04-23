import { Box } from '@themeshift/ui/components/Box';
import { Button } from '@themeshift/ui/components/Button';
import { Card } from '@themeshift/ui/components/Card';
import { Grid } from '@themeshift/ui/components/Grid';
import { Heading } from '@themeshift/ui/components/Heading';
import { Input } from '@themeshift/ui/components/Input';
import { Label } from '@themeshift/ui/components/Label';
import { Select } from '@themeshift/ui/components/Select';

export const basicUsage = {
  code: `<Grid columns={3} gap="4">
  <Card>
    <Card.Header>
      <Card.Title>Sprint planning</Card.Title>
      <Card.Description>Product team</Card.Description>
    </Card.Header>
    <Card.Body>12 stories ready for grooming</Card.Body>
  </Card>
  <Card>
    <Card.Header>
      <Card.Title>QA regression</Card.Title>
      <Card.Description>Release train</Card.Description>
    </Card.Header>
    <Card.Body>5 critical tests pending</Card.Body>
  </Card>
  <Card>
    <Card.Header>
      <Card.Title>Customer feedback</Card.Title>
      <Card.Description>Research</Card.Description>
    </Card.Header>
    <Card.Body>3 themes surfaced this week</Card.Body>
  </Card>
</Grid>`,
  label: 'Basic usage',
  sample: (
    <Grid columns={3} gap="4">
      <Card>
        <Card.Header>
          <Card.Title>Sprint planning</Card.Title>
          <Card.Description>Product team</Card.Description>
        </Card.Header>
        <Card.Body>12 stories ready for grooming</Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>QA regression</Card.Title>
          <Card.Description>Release train</Card.Description>
        </Card.Header>
        <Card.Body>5 critical tests pending</Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Customer feedback</Card.Title>
          <Card.Description>Research</Card.Description>
        </Card.Header>
        <Card.Body>3 themes surfaced this week</Card.Body>
      </Card>
    </Grid>
  ),
};

export const responsiveColumns = {
  code: `<Grid columns={{ base: 1, tablet: 2, desktop: 4 }} gap="4">
  <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Card.Header>
      <Card.Title>Q2 Growth Report</Card.Title>
      <Card.Description>Marketing analytics</Card.Description>
    </Card.Header>
    <Card.Body style={{ flex: 1 }}>Updated 2h ago by Mia Chen</Card.Body>
    <Card.Footer justify="end">
      <Card.Actions>
        <Button size="small">Open</Button>
      </Card.Actions>
    </Card.Footer>
  </Card>
  <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Card.Header>
      <Card.Title>Release Checklist</Card.Title>
      <Card.Description>Engineering operations</Card.Description>
    </Card.Header>
    <Card.Body style={{ flex: 1 }}>8 tasks remaining before deploy</Card.Body>
    <Card.Footer justify="end">
      <Card.Actions>
        <Button size="small">Review</Button>
      </Card.Actions>
    </Card.Footer>
  </Card>
  <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Card.Header>
      <Card.Title>Support Queue</Card.Title>
      <Card.Description>Customer success</Card.Description>
    </Card.Header>
    <Card.Body style={{ flex: 1 }}>
      14 open tickets, 3 high priority
    </Card.Body>
    <Card.Footer justify="end">
      <Card.Actions>
        <Button size="small">Triage</Button>
      </Card.Actions>
    </Card.Footer>
  </Card>
  <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Card.Header>
      <Card.Title>Hiring Pipeline</Card.Title>
      <Card.Description>People team</Card.Description>
    </Card.Header>
    <Card.Body style={{ flex: 1 }}>
      5 candidates in final interviews
    </Card.Body>
    <Card.Footer justify="end">
      <Card.Actions>
        <Button size="small">View</Button>
      </Card.Actions>
    </Card.Footer>
  </Card>
</Grid>`,
  label: 'Responsive columns',
  sample: (
    <Grid columns={{ base: 1, tablet: 2, desktop: 4 }} gap="4">
      <Card
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Card.Header>
          <Card.Title>Q2 Growth Report</Card.Title>
          <Card.Description>Marketing analytics</Card.Description>
        </Card.Header>
        <Card.Body style={{ flex: 1 }}>Updated 2h ago by Mia Chen</Card.Body>
        <Card.Footer justify="end">
          <Card.Actions>
            <Button size="small">Open</Button>
          </Card.Actions>
        </Card.Footer>
      </Card>
      <Card
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Card.Header>
          <Card.Title>Release Checklist</Card.Title>
          <Card.Description>Engineering operations</Card.Description>
        </Card.Header>
        <Card.Body style={{ flex: 1 }}>
          8 tasks remaining before deploy
        </Card.Body>
        <Card.Footer justify="end">
          <Card.Actions>
            <Button size="small">Review</Button>
          </Card.Actions>
        </Card.Footer>
      </Card>
      <Card
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Card.Header>
          <Card.Title>Support Queue</Card.Title>
          <Card.Description>Customer success</Card.Description>
        </Card.Header>
        <Card.Body style={{ flex: 1 }}>
          14 open tickets, 3 high priority
        </Card.Body>
        <Card.Footer justify="end">
          <Card.Actions>
            <Button size="small">Triage</Button>
          </Card.Actions>
        </Card.Footer>
      </Card>
      <Card
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Card.Header>
          <Card.Title>Hiring Pipeline</Card.Title>
          <Card.Description>People team</Card.Description>
        </Card.Header>
        <Card.Body style={{ flex: 1 }}>
          5 candidates in final interviews
        </Card.Body>
        <Card.Footer justify="end">
          <Card.Actions>
            <Button size="small">View</Button>
          </Card.Actions>
        </Card.Footer>
      </Card>
    </Grid>
  ),
};

export const customTracks = {
  code: `<Grid columns="16rem minmax(0, 1fr) auto" gap="4">
  <Card as="aside">
    <Card.Header>
      <Card.Title>Filters</Card.Title>
    </Card.Header>
    <Card.Body>Owner, status, and milestone</Card.Body>
  </Card>
  <Card as="section">
    <Card.Header>
      <Card.Title>Open issues</Card.Title>
      <Card.Description>Repository: ui-platform</Card.Description>
    </Card.Header>
    <Card.Body>Showing 42 issues across 7 projects</Card.Body>
  </Card>
  <Button size="small">New issue</Button>
</Grid>`,
  label: 'Custom tracks',
  sample: (
    <Grid columns="16rem minmax(0, 1fr) auto" gap="4">
      <Card as="aside">
        <Card.Header>
          <Card.Title>Filters</Card.Title>
        </Card.Header>
        <Card.Body>Owner, status, and milestone</Card.Body>
      </Card>
      <Card as="section">
        <Card.Header>
          <Card.Title>Open issues</Card.Title>
          <Card.Description>Repository: ui-platform</Card.Description>
        </Card.Header>
        <Card.Body>Showing 42 issues across 7 projects</Card.Body>
      </Card>
      <Button size="small">New issue</Button>
    </Grid>
  ),
};

export const withGridItem = {
  code: `<Grid columns={{ base: 1, desktop: 4 }} gap="4" width="100%">
  <Grid.Item columnSpan={{ base: 1, desktop: 2 }}>
    <Box
      as="section"
      aria-labelledby="roadmap-title"
      padding="4"
      style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}
    >
      <Heading id="roadmap-title" level={3}>Roadmap priorities</Heading>
      <p>API reliability improvements, onboarding polish, and usage analytics.</p>
      <Button size="small">View roadmap</Button>
    </Box>
  </Grid.Item>
  <Grid.Item columnSpan={{ base: 1, desktop: 1 }}>
    <Box
      as="aside"
      aria-labelledby="actions-title"
      padding="4"
      style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}
    >
      <Heading id="actions-title" level={3}>Quick actions</Heading>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Button intent="secondary">Create task</Button>
        <Button intent="secondary">Share update</Button>
      </Box>
    </Box>
  </Grid.Item>
  <Grid.Item columnSpan={{ base: 1, desktop: 1 }}>
    <Box
      as="section"
      aria-labelledby="release-title"
      padding="4"
      style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}
    >
      <Heading id="release-title" level={3}>Release status</Heading>
      <p>Staging verified. Production rollout scheduled for tomorrow.</p>
      <Button intent="secondary" size="small">Open checklist</Button>
    </Box>
  </Grid.Item>
</Grid>`,
  label: 'Grid.Item spans',
  sample: (
    <Grid columns={{ base: 1, desktop: 4 }} gap="4" width="100%">
      <Grid.Item columnSpan={{ base: 1, desktop: 2 }}>
        <Box
          as="section"
          aria-labelledby="roadmap-title"
          padding="4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '0.5rem',
          }}
        >
          <Heading id="roadmap-title" level={3}>
            Roadmap priorities
          </Heading>
          <p>
            API reliability improvements, onboarding polish, and usage
            analytics.
          </p>
          <Button size="small">View roadmap</Button>
        </Box>
      </Grid.Item>
      <Grid.Item columnSpan={{ base: 1, desktop: 1 }}>
        <Box
          as="aside"
          aria-labelledby="actions-title"
          padding="4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '0.5rem',
          }}
        >
          <Heading id="actions-title" level={3}>
            Quick actions
          </Heading>
          <Box
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <Button intent="secondary">Create task</Button>
            <Button intent="secondary">Share update</Button>
          </Box>
        </Box>
      </Grid.Item>
      <Grid.Item columnSpan={{ base: 1, desktop: 1 }}>
        <Box
          as="section"
          aria-labelledby="release-title"
          padding="4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '0.5rem',
          }}
        >
          <Heading id="release-title" level={3}>
            Release status
          </Heading>
          <p>Staging verified. Production rollout scheduled for tomorrow.</p>
          <Button intent="secondary" size="small">
            Open checklist
          </Button>
        </Box>
      </Grid.Item>
    </Grid>
  ),
};

export const fullBleedItem = {
  code: `<Grid columns={{ base: 1, desktop: 12 }} gap="4" width="100%">
  <Grid.Item columnSpan="full">
    <Box as="section" padding="4">
      <Heading level={3}>Quarter-end freeze starts Friday</Heading>
      <p>Merge window closes at 6:00 PM ET.</p>
      <Button size="small">Read policy</Button>
    </Box>
  </Grid.Item>
  <Grid.Item columnSpan={{ base: 12, desktop: 6 }}>
    <Box as="section" padding="4">
      <Heading level={3}>Deployment checklist</Heading>
      <p>Schema migration, smoke tests, and rollback plan.</p>
    </Box>
  </Grid.Item>
  <Grid.Item columnSpan={{ base: 12, desktop: 6 }}>
    <Box as="section" padding="4">
      <Heading level={3}>Incident prep</Heading>
      <p>On-call rotations and status page runbook are current.</p>
    </Box>
  </Grid.Item>
</Grid>`,
  label: 'Full-span shortcut',
  sample: (
    <Grid columns={{ base: 1, desktop: 12 }} gap="4" width="100%">
      <Grid.Item columnSpan="full">
        <Box as="section" padding="4">
          <Heading level={3}>Quarter-end freeze starts Friday</Heading>
          <p>Merge window closes at 6:00 PM ET.</p>
          <Button size="small">Read policy</Button>
        </Box>
      </Grid.Item>
      <Grid.Item columnSpan={{ base: 12, desktop: 6 }}>
        <Box as="section" padding="4">
          <Heading level={3}>Deployment checklist</Heading>
          <p>Schema migration, smoke tests, and rollback plan.</p>
        </Box>
      </Grid.Item>
      <Grid.Item columnSpan={{ base: 12, desktop: 6 }}>
        <Box as="section" padding="4">
          <Heading level={3}>Incident prep</Heading>
          <p>On-call rotations and status page runbook are current.</p>
        </Box>
      </Grid.Item>
    </Grid>
  ),
};

export const preserveLogicalSourceOrder = {
  code: `<Grid
  as="section"
  aria-labelledby="orders-dashboard-title"
  columns={{ base: 1, desktop: 12 }}
  gap="4"
  width="100%"
>
  <Grid.Item as="header" columnSpan="full">
    <Box
      padding="4"
      style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}
    >
      <Heading id="orders-dashboard-title" level={3}>Orders dashboard</Heading>
      <p>Track fulfillment and triage delayed shipments.</p>
    </Box>
  </Grid.Item>
  <Grid.Item as="main" columnSpan={{ base: 12, desktop: 8 }}>
    <Box
      padding="4"
      style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}
    >
      <Heading level={3}>Recent orders</Heading>
      <p>Order #4832 — Ready to ship</p>
      <p>Order #4831 — Awaiting payment confirmation</p>
      <Button size="small">View all orders</Button>
    </Box>
  </Grid.Item>
  <Grid.Item as="aside" columnSpan={{ base: 12, desktop: 4 }}>
    <Box
      padding="4"
      style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}
    >
      <Heading level={3}>Sidebar filters</Heading>
      <Label htmlFor="order-status-filter">Status</Label>
      <Select id="order-status-filter" defaultValue="all">
        <option value="all">All statuses</option>
        <option value="ready">Ready to ship</option>
        <option value="delayed">Delayed</option>
      </Select>
      <Button intent="secondary" size="small">Apply filters</Button>
    </Box>
  </Grid.Item>
</Grid>`,
  label: 'Preserve logical source order',
  sample: (
    <Grid
      as="section"
      aria-labelledby="orders-dashboard-title"
      columns={{ base: 1, desktop: 12 }}
      gap="4"
      width="100%"
    >
      <Grid.Item as="header" columnSpan="full">
        <Box
          padding="4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '0.5rem',
          }}
        >
          <Heading id="orders-dashboard-title" level={3}>
            Orders dashboard
          </Heading>
          <p>Track fulfillment and triage delayed shipments.</p>
        </Box>
      </Grid.Item>
      <Grid.Item as="main" columnSpan={{ base: 12, desktop: 8 }}>
        <Box
          padding="4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '0.5rem',
          }}
        >
          <Heading level={3}>Recent orders</Heading>
          <p>Order #4832 — Ready to ship</p>
          <p>Order #4831 — Awaiting payment confirmation</p>
          <Button size="small">View all orders</Button>
        </Box>
      </Grid.Item>
      <Grid.Item as="aside" columnSpan={{ base: 12, desktop: 4 }}>
        <Box
          padding="4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '0.5rem',
          }}
        >
          <Heading level={3}>Sidebar filters</Heading>
          <Label htmlFor="order-status-filter">Status</Label>
          <Select id="order-status-filter" defaultValue="all">
            <option value="all">All statuses</option>
            <option value="ready">Ready to ship</option>
            <option value="delayed">Delayed</option>
          </Select>
          <Button intent="secondary" size="small">
            Apply filters
          </Button>
        </Box>
      </Grid.Item>
    </Grid>
  ),
};

export const labelMajorRegions = {
  code: `<Grid
  as="main"
  aria-label="Revenue dashboard"
  columns={{ base: 1, desktop: 12 }}
  gap="4"
  width="100%"
>
  <Grid.Item as="nav" aria-label="Dashboard sections" columnSpan={{ base: 12, desktop: 3 }}>
    <Box
      padding="4"
      style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}
    >
      <Heading level={3}>Dashboard sections</Heading>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Button intent="secondary" size="small">Overview</Button>
        <Button intent="secondary" size="small">Revenue</Button>
        <Button intent="secondary" size="small">Customers</Button>
      </Box>
    </Box>
  </Grid.Item>
  <Grid.Item as="section" aria-labelledby="kpi-summary-title" columnSpan={{ base: 12, desktop: 9 }}>
    <Box
      padding="4"
      style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}
    >
      <Heading id="kpi-summary-title" level={3}>KPI summary</Heading>
      <Grid columns={{ base: 1, desktop: 3 }} gap="3" width="100%">
        <Box padding="3" style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}>
          <Heading level={4}>MRR</Heading>
          <p>$128,400</p>
        </Box>
        <Box padding="3" style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}>
          <Heading level={4}>Churn</Heading>
          <p>2.1%</p>
        </Box>
        <Box padding="3" style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.5rem' }}>
          <Heading level={4}>New trials</Heading>
          <p>214</p>
        </Box>
      </Grid>
    </Box>
  </Grid.Item>
</Grid>`,
  label: 'Label major regions',
  sample: (
    <Grid
      as="main"
      aria-label="Revenue dashboard"
      columns={{ base: 1, desktop: 12 }}
      gap="4"
      width="100%"
    >
      <Grid.Item
        as="nav"
        aria-label="Dashboard sections"
        columnSpan={{ base: 12, desktop: 3 }}
      >
        <Box
          padding="4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '0.5rem',
          }}
        >
          <Heading level={3}>Dashboard sections</Heading>
          <Box
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <Button intent="secondary" size="small">
              Overview
            </Button>
            <Button intent="secondary" size="small">
              Revenue
            </Button>
            <Button intent="secondary" size="small">
              Customers
            </Button>
          </Box>
        </Box>
      </Grid.Item>
      <Grid.Item
        as="section"
        aria-labelledby="kpi-summary-title"
        columnSpan={{ base: 12, desktop: 9 }}
      >
        <Box
          padding="4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '0.5rem',
          }}
        >
          <Heading id="kpi-summary-title" level={3}>
            KPI summary
          </Heading>
          <Grid columns={{ base: 1, desktop: 3 }} gap="3" width="100%">
            <Box
              padding="3"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '0.5rem',
              }}
            >
              <Heading level={4}>MRR</Heading>
              <p>$128,400</p>
            </Box>
            <Box
              padding="3"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '0.5rem',
              }}
            >
              <Heading level={4}>Churn</Heading>
              <p>2.1%</p>
            </Box>
            <Box
              padding="3"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '0.5rem',
              }}
            >
              <Heading level={4}>New trials</Heading>
              <p>214</p>
            </Box>
          </Grid>
        </Box>
      </Grid.Item>
    </Grid>
  ),
};

export const testBreakpointTransitions = {
  code: `<Grid columns={{ base: 1, tablet: 2 }} gap="3">
  <Label htmlFor="grid-email">Email</Label>
  <Input id="grid-email" name="email" type="email" />
  <Label htmlFor="grid-team">Team</Label>
  <Select id="grid-team" name="team" defaultValue="">
    <option value="" disabled>Select a team</option>
    <option value="product">Product</option>
    <option value="design">Design</option>
  </Select>
  <Grid.Item columnSpan={{ base: 1, tablet: 2 }}>
    <Button type="button">Save settings</Button>
  </Grid.Item>
</Grid>`,
  label: 'Test breakpoint transitions',
  sample: (
    <Grid columns={{ base: 1, tablet: 2 }} gap="3">
      <Label htmlFor="grid-email">Email</Label>
      <Input id="grid-email" name="email" type="email" />
      <Label htmlFor="grid-team">Team</Label>
      <Select id="grid-team" name="team" defaultValue="">
        <option value="" disabled>
          Select a team
        </option>
        <option value="product">Product</option>
        <option value="design">Design</option>
      </Select>
      <Grid.Item columnSpan={{ base: 1, tablet: 2 }}>
        <Button type="button">Save settings</Button>
      </Grid.Item>
    </Grid>
  ),
};

export const propHighlights = [basicUsage, responsiveColumns, withGridItem];
