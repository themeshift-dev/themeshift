import { Badge } from '@themeshift/ui/components/Badge';
import { Button } from '@themeshift/ui/components/Button';
import { FaBell } from 'react-icons/fa';
import { ResponsiveStackInline } from '../../components';

export const basicUsage = {
  code: '<Badge tone="success" variant="soft">Active</Badge>',
  label: 'Basic usage',
  sample: (
    <Badge tone="success" variant="soft">
      Active
    </Badge>
  ),
};

export const tonesAndVariants = {
  code: `<>
  <Badge tone="success" variant="soft">Active</Badge>
  <Badge tone="warning" variant="solid">Pending</Badge>
  <Badge tone="danger" variant="outline">Failed</Badge>
</>`,
  label: 'Tones and variants',
  sample: (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Badge tone="success" variant="soft">
        Active
      </Badge>
      <Badge tone="warning" variant="solid">
        Pending
      </Badge>
      <Badge tone="danger" variant="outline">
        Failed
      </Badge>
    </div>
  ),
};

export const colors = {
  code: `<>
  <Badge color="blue">Frontend</Badge>
  <Badge color="purple">Design</Badge>
  <Badge color="pink">Marketing</Badge>
</>`,
  label: 'Curated colors',
  sample: (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Badge color="blue">Frontend</Badge>
      <Badge color="purple">Design</Badge>
      <Badge color="pink">Marketing</Badge>
    </div>
  ),
};

export const interactiveAsChild = {
  code: `<>
  <Badge asChild tone="warning">
    <a aria-label="View pending" href="/pending">Pending</a>
  </Badge>

  <Badge asChild tone="danger">
    <button aria-label="Sort by failed jobs" type="button">Failed</button>
  </Badge>
</>`,
  label: 'Interactive with asChild',
  sample: (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Badge asChild tone="warning">
        <a aria-label="View pending" href="/pending">
          Pending
        </a>
      </Badge>

      <Badge asChild tone="danger">
        <button aria-label="Sort by failed jobs" type="button">
          Failed
        </button>
      </Badge>
    </div>
  ),
};

export const withIcon = {
  code: `<Badge icon={<BellIcon />} tone="info">Updates</Badge>`,
  label: 'With icon',
  sample: (
    <Badge icon={<FaBell />} tone="info">
      Updates
    </Badge>
  ),
};

export const countAnchored = {
  code: `<Badge.Count count={3}>
  <Button icon={<BellIcon />} aria-label="Notifications, 3 unread" type="button" />
</Badge.Count>

<Badge.Count aria-hidden count={3}>
  <Button icon={<BellIcon />} aria-label="Notifications, 3 unread" type="button" />
</Badge.Count>`,
  label: 'Anchored count',
  sample: (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <Badge.Count count={3}>
        <Button
          icon={<FaBell />}
          aria-label="Notifications, 3 unread"
          type="button"
        />
      </Badge.Count>

      <Badge.Count aria-hidden count={3}>
        <Button
          icon={<FaBell />}
          aria-label="Notifications, 3 unread"
          type="button"
        />
      </Badge.Count>
    </div>
  ),
};

export const countStandalone = {
  code: `<>
  <Badge.Count count={3} />
  <Badge.Count count={120} max={99} />
  <Badge.Count textDot />
  <Badge.Count dot />
</>`,
  label: 'Standalone count and dot',
  sample: (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Badge.Count count={3} />
      <Badge.Count count={120} max={99} />
      <Badge.Count textDot />
      <Badge.Count dot />
    </div>
  ),
};

export const countLiveAnnouncements = {
  code: `<Badge.Count aria-live="polite" count={3} role="status" />
<Badge.Count aria-live="polite" count={120} max={99} role="status" />`,
  label: 'Live announcements',
  sample: (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Badge.Count aria-live="polite" count={3} role="status" />
      <Badge.Count aria-live="polite" count={120} max={99} role="status" />
    </div>
  ),
};

const placementCode = `<>
  <Badge.Count count={2} placement="top-start">
    <Button>Top start</Button>
  </Badge.Count>
  <Badge.Count count={2} placement="top-end">
    <Button>Top end</Button>
  </Badge.Count>
  <Badge.Count count={2} placement="bottom-start">
    <Button>Bottom start</Button>
  </Badge.Count>
  <Badge.Count count={2} placement="bottom-end">
    <Button>Bottom end</Button>
  </Badge.Count>
</>`;

export const placementLTR = {
  code: placementCode,
  label: 'LTR',
  sample: (
    <ResponsiveStackInline>
      <Badge.Count count={2} placement="top-start">
        <Button>Top start</Button>
      </Badge.Count>
      <Badge.Count count={2} placement="top-end">
        <Button>Top end</Button>
      </Badge.Count>
      <Badge.Count count={2} placement="bottom-start">
        <Button>Bottom start</Button>
      </Badge.Count>
      <Badge.Count count={2} placement="bottom-end">
        <Button>Bottom end</Button>
      </Badge.Count>
    </ResponsiveStackInline>
  ),
};

export const placementRTL = {
  code: placementCode,
  label: 'RTL ',
  sample: (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }} dir="rtl">
      <Badge.Count count={2} placement="top-start">
        <Button>Top start</Button>
      </Badge.Count>
      <Badge.Count count={2} placement="top-end">
        <Button>Top end</Button>
      </Badge.Count>
      <Badge.Count count={2} placement="bottom-start">
        <Button>Bottom start</Button>
      </Badge.Count>
      <Badge.Count count={2} placement="bottom-end">
        <Button>Bottom end</Button>
      </Badge.Count>
    </div>
  ),
};

export const propHighlights = [basicUsage, tonesAndVariants, countAnchored];
export const placementExamples = [placementLTR, placementRTL];
