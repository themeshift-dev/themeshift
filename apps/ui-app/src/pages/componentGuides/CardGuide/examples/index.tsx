import { Badge } from '@themeshift/ui/components/Badge';
import { Button } from '@themeshift/ui/components/Button';
import { Card } from '@themeshift/ui/components/Card';
import { Field } from '@themeshift/ui/components/Field';
import { Heading } from '@themeshift/ui/components/Heading';
import { Input } from '@themeshift/ui/components/Input';
import { NavLink } from 'react-router';

import { ResponsiveStackInline } from '../../components';
import styles from './CardGuideExamples.module.scss';

const astronautImageSrc = '/images/samples/spaceman_m_optimized.png';

export const basicUsage = {
  code: `<Card>
  Simple content
</Card>`,
  label: 'Basic usage',
  sample: <Card>Simple content</Card>,
};

export const structuredUsage = {
  code: `<Card>
  <Card.Header>
    <Card.Title>Analytics</Card.Title>
    <Card.Description>Summary for the last 7 days</Card.Description>
  </Card.Header>
  <Card.Body>
    24,520 active users
  </Card.Body>
</Card>`,
  label: 'Structured usage',
  sample: (
    <Card>
      <Card.Header>
        <Card.Title>Analytics</Card.Title>
        <Card.Description>Summary for the last 7 days</Card.Description>
      </Card.Header>
      <Card.Body>24,520 active users</Card.Body>
    </Card>
  ),
};

export const settingsPanel = {
  code: `<Card as="section" aria-labelledby="profile-card-title">
  <Card.Header>
    <Card.Title as="h2" id="profile-card-title">Profile settings</Card.Title>
    <Card.Description>Update account details and notification preferences.</Card.Description>
  </Card.Header>

  <Card.Body>
    <Field label="Display name">
      <Input placeholder="Ada Lovelace" />
    </Field>
  </Card.Body>

  <Card.Footer justify="end">
    <Card.Actions gap="small">
    <Button intent="secondary">Cancel</Button>
    <Button>Save changes</Button>
    </Card.Actions>
  </Card.Footer>
</Card>`,
  label: 'Settings panel',
  sample: (
    <Card as="section" aria-labelledby="profile-card-title">
      <Card.Header>
        <Card.Title as="h2" id="profile-card-title">
          Profile settings
        </Card.Title>
        <Card.Description>
          Update account details and notification preferences.
        </Card.Description>
      </Card.Header>

      <Card.Body>
        <Field label="Display name">
          <Input placeholder="Ada Lovelace" />
        </Field>
      </Card.Body>

      <Card.Footer justify="end">
        <Card.Actions gap="small">
          <Button intent="secondary">Cancel</Button>
          <Button>Save changes</Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  ),
};

export const metricCard = {
  code: `<Card padding="large" shadow="small" surface="elevated">
  <Card.Header>
    <Card.Title>Monthly revenue</Card.Title>
    <Card.Description>Compared with previous month</Card.Description>
  </Card.Header>

  <Card.Body>
    <Heading level={2}>$128,400</Heading>
  </Card.Body>

  <Card.Footer>
    <Card.Actions gap="small" justify="space-between">
      <Badge tone="success">+12.4%</Badge>
      <Button intent="secondary" size="small">View report</Button>
    </Card.Actions>
  </Card.Footer>
</Card>`,
  label: 'Metric card',
  sample: (
    <Card padding="large" shadow="small" surface="elevated">
      <Card.Header>
        <Card.Title>Monthly revenue</Card.Title>
        <Card.Description>Compared with previous month</Card.Description>
      </Card.Header>

      <Card.Body>
        <Heading level={2}>$128,400</Heading>
      </Card.Body>

      <Card.Footer>
        <Card.Actions gap="small" justify="space-between">
          <Badge tone="success">+12.4%</Badge>
          <Button intent="secondary" size="small">
            View report
          </Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  ),
};

export const headerActions = {
  code: `<Card>
  <Card.Header justify="space-between">
    <div>
      <Card.Title>Team access</Card.Title>
      <Card.Description>Manage collaborator permissions.</Card.Description>
    </div>
    <Card.Actions gap="small">
      <Button intent="secondary" size="small">Invite</Button>
      <Button size="small">Manage</Button>
    </Card.Actions>
  </Card.Header>
</Card>`,
  label: 'Header actions',
  sample: (
    <Card>
      <Card.Header justify="space-between">
        <div>
          <Card.Title>Team access</Card.Title>
          <Card.Description>Manage collaborator permissions.</Card.Description>
        </div>
        <Card.Actions gap="small">
          <Button intent="secondary" size="small">
            Invite
          </Button>
          <Button size="small">Manage</Button>
        </Card.Actions>
      </Card.Header>
    </Card>
  ),
};

export const footerActions = {
  code: `<Card>
  <Card.Header>
    <Card.Title>Delete project</Card.Title>
    <Card.Description>This action cannot be undone.</Card.Description>
  </Card.Header>

  <Card.Footer justify="end">
    <Card.Actions gap="small">
      <Button intent="secondary">Cancel</Button>
      <Button intent="destructive">Delete</Button>
    </Card.Actions>
  </Card.Footer>
</Card>`,
  label: 'Footer actions',
  sample: (
    <Card>
      <Card.Header>
        <Card.Title>Delete project</Card.Title>
        <Card.Description>This action cannot be undone.</Card.Description>
      </Card.Header>

      <Card.Footer justify="end">
        <Card.Actions gap="small">
          <Button intent="secondary">Cancel</Button>
          <Button intent="destructive">Delete</Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  ),
};

const mediaCardCode = `<Card border radius="large" shadow="small" surface="default">
  <Card.Media aspectRatio="video" fit="cover" position="top">
    <img
      alt="Astronaut floating in starry space with a cosmos reflection in the visor"
      src="/images/samples/spaceman.png"
    />
  </Card.Media>

  <Card.Header>
    <Card.Title>Astronaut portrait</Card.Title>
    <Card.Description>Place images inside of cards using Card.Media</Card.Description>
  </Card.Header>

  <Card.Footer justify="end">
    <Card.Actions>
      <Button size="small">View gallery</Button>
    </Card.Actions>
  </Card.Footer>
</Card>`;

export const mediaTop = {
  code: mediaCardCode,
  label: 'Media top',
  sample: (
    <Card border radius="large" shadow="small" surface="default">
      <Card.Media aspectRatio="video" fit="cover" position="top">
        <img
          alt="Astronaut floating in starry space with a cosmos reflection in the visor"
          src={astronautImageSrc}
        />
      </Card.Media>

      <Card.Header align="center">
        <Card.Title>Astronaut portrait</Card.Title>
        <Card.Description>
          Place images inside of cards using <code>Card.Media</code>.
        </Card.Description>
      </Card.Header>

      <Card.Footer align="center">
        <Card.Actions>
          <Button size="small">View gallery</Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  ),
};

export const mediaBottom = {
  code: mediaCardCode.replace('position="top"', 'position="bottom"'),
  label: 'Media bottom',
  sample: (
    <Card border radius="large" shadow="small" surface="default">
      <Card.Header>
        <Card.Title>Astronaut portrait</Card.Title>
        <Card.Description>
          Place images inside of cards using <code>Card.Media</code>.
        </Card.Description>
      </Card.Header>

      <Card.Footer justify="end">
        <Card.Actions>
          <Button size="small">View gallery</Button>
        </Card.Actions>
      </Card.Footer>

      <Card.Media aspectRatio="video" fit="cover" position="bottom">
        <img
          alt="Astronaut floating in starry space with a cosmos reflection in the visor"
          src={astronautImageSrc}
        />
      </Card.Media>
    </Card>
  ),
};

export const linkOverlay = {
  code: `<Card as="article" border radius="large">
  <Card.LinkOverlay
    as={NavLink}
    aria-label="Open automation card"
    to="/ui/component/card"
  />

  <Card.Header>
    <Card.Title>Task automation</Card.Title>
    <Card.Description>Content labeling workflow.</Card.Description>
  </Card.Header>

  <Card.Divider inset />

  <Card.Footer justify="space-between">
    <Card.Actions data-card-interactive>
      <Button intent="secondary" size="small">Details</Button>
      <Button size="small">Run now</Button>
    </Card.Actions>
  </Card.Footer>
</Card>`,
  label: 'Link overlay',
  sample: (
    <Card as="article" border radius="large">
      <Card.LinkOverlay
        as={NavLink}
        aria-label="Open automation card"
        to="/ui/component/card"
      />

      <Card.Header>
        <Card.Title>Task automation</Card.Title>
        <Card.Description>Content labeling workflow.</Card.Description>
      </Card.Header>

      <Card.Divider inset />

      <Card.Footer justify="space-between">
        <Card.Actions data-card-interactive>
          <Button intent="secondary" size="small">
            Details
          </Button>
          <Button size="small">Run now</Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  ),
};

export const dividers = {
  code: `<Card>
  <Card.Header>
    <Card.Title>Divider examples</Card.Title>
  </Card.Header>

  <Card.Divider />
  <Card.Body>Default horizontal divider.</Card.Body>
  <Card.Divider inset />

  <Card.Footer justify="space-between">
    <span>Left</span>
    <Card.Divider inset orientation="vertical" />
    <span>Right</span>
  </Card.Footer>
</Card>`,
  label: 'Dividers',
  sample: (
    <Card>
      <Card.Header>
        <Card.Title>Divider examples</Card.Title>
      </Card.Header>

      <Card.Divider />
      <Card.Body>Default horizontal divider.</Card.Body>
      <Card.Divider inset />

      <Card.Footer justify="space-between">
        <span>Left</span>
        <Card.Divider inset orientation="vertical" />
        <span>Right</span>
      </Card.Footer>
    </Card>
  ),
};

const badgePlacementCode = `<Card>
  <Card.Badge position="top-start" tone="warning">New</Card.Badge>
  <Card.Badge position="top-end" tone="success">Live</Card.Badge>
  <Card.Badge offset="medium" position="bottom-start" tone="info">Info</Card.Badge>
  <Card.Badge position="bottom-end" tone="danger">Alert</Card.Badge>
  <Card.Body>Card with positioned badges</Card.Body>
</Card>`;

export const badgePlacementsLTR = {
  code: badgePlacementCode,
  label: 'Badge placements (LTR)',
  sample: (
    <Card>
      <Card.Badge position="top-start" tone="warning">
        New
      </Card.Badge>
      <Card.Badge position="top-end" tone="success">
        Live
      </Card.Badge>
      <Card.Badge offset="medium" position="bottom-start" tone="info">
        Info
      </Card.Badge>
      <Card.Badge position="bottom-end" tone="danger">
        Alert
      </Card.Badge>
      <Card.Body className={styles.placementDemo}>
        Card with positioned badges
      </Card.Body>
    </Card>
  ),
};

export const badgePlacementsRTL = {
  code: badgePlacementCode,
  label: 'Badge placements (RTL)',
  sample: (
    <div dir="rtl">
      <Card>
        <Card.Badge position="top-start" tone="warning">
          New
        </Card.Badge>
        <Card.Badge position="top-end" tone="success">
          Live
        </Card.Badge>
        <Card.Badge offset="medium" position="bottom-start" tone="info">
          Info
        </Card.Badge>
        <Card.Badge position="bottom-end" tone="danger">
          Alert
        </Card.Badge>
        <Card.Body className={styles.placementDemo}>
          Card with positioned badges
        </Card.Body>
      </Card>
    </div>
  ),
};

export const badgeAsVsAsChild = {
  code: `<Card.Badge as={NavLink} to="/ui/component/badge" tone="info">
  Badge docs
</Card.Badge>

<Card.Badge asChild tone="warning">
  <a href="/pending">Pending</a>
</Card.Badge>`,
  label: 'Badge as vs asChild',
  sample: (
    <Card>
      <Card.Header>
        <Card.Title>Card.Badge composition</Card.Title>
      </Card.Header>
      <Card.Badge
        as={NavLink}
        offset="medium"
        to="/ui/component/badge"
        tone="info"
      >
        Badge docs
      </Card.Badge>
      <Card.Badge asChild position="bottom-end" tone="warning">
        <a href="/docs">Docs</a>
      </Card.Badge>
      <Card.Body className={styles.badgeCompositionBody}>
        Use <code>as</code> for direct polymorphism and <code>asChild</code> for
        child preservation.
      </Card.Body>
    </Card>
  ),
};

const directionCode = `<Card>
  <Card.Header align="start" justify="space-between">
    <Card.Title>Start and end alignment</Card.Title>
    <Card.Actions>
      <Button size="small">Primary</Button>
      <Button intent="secondary" size="small">Secondary</Button>
    </Card.Actions>
  </Card.Header>
</Card>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: (
    <ResponsiveStackInline>
      <Card>
        <Card.Header align="start" justify="space-between">
          <Card.Title>Start and end alignment</Card.Title>
          <Card.Actions>
            <Button size="small">Primary</Button>
            <Button intent="secondary" size="small">
              Secondary
            </Button>
          </Card.Actions>
        </Card.Header>
      </Card>
    </ResponsiveStackInline>
  ),
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <ResponsiveStackInline>
        <Card>
          <Card.Header align="start" justify="space-between">
            <Card.Title>Start and end alignment</Card.Title>
            <Card.Actions>
              <Button size="small">Primary</Button>
              <Button intent="secondary" size="small">
                Secondary
              </Button>
            </Card.Actions>
          </Card.Header>
        </Card>
      </ResponsiveStackInline>
    </div>
  ),
};

export const propHighlights = [
  basicUsage,
  structuredUsage,
  metricCard,
  {
    ...mediaTop,
    label: 'Media',
  },
  linkOverlay,
];
export const directionExamples = [directionLTR, directionRTL];
export const badgePlacementExamples = [badgePlacementsLTR, badgePlacementsRTL];
