import { Badge } from '@themeshift/ui/components/Badge';
import { Button } from '@themeshift/ui/components/Button';
import { Input } from '@themeshift/ui/components/Input';
import { Select } from '@themeshift/ui/components/Select';
import { Skeleton } from '@themeshift/ui/components/Skeleton';
import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';
import { useState } from 'react';

import styles from './componentPreviews.module.scss';

export const ComponentsAuthPreview = () => (
  <div className={styles.previewStack}>
    <div className={styles.previewInlineBetween}>
      <span>Two-factor authentication</span>
      <Button intent="secondary" size="small">
        Enable
      </Button>
    </div>
    <div className={styles.previewInlineBetween}>
      <span>Backup codes</span>
      <Button intent="tertiary" size="small">
        View
      </Button>
    </div>
    <Input aria-label="Domain" placeholder="https://" />
  </div>
);

export const ComponentsLoadingPreview = () => (
  <div className={styles.previewStack}>
    <div className={styles.skeletonRow}>
      <Skeleton.Avatar animation="shimmer" aria-hidden size="2.75rem" />
      <div className={styles.skeletonText}>
        <Skeleton aria-hidden animation="shimmer" height="1rem" width="90%" />
        <Skeleton aria-hidden animation="shimmer" height="1rem" width="60%" />
      </div>
    </div>
    <Skeleton aria-hidden animation="shimmer" height="2.25rem" width="100%" />
  </div>
);

export const ComponentsPaymentPreview = () => (
  <div className={styles.previewStack}>
    <Input aria-label="Cardholder name" placeholder="Name on card" />
    <Input aria-label="Card number" placeholder="Card number" />
    <div className={styles.previewSplit}>
      <Select aria-label="Month" defaultValue="" placeholder="MM" />
      <Input aria-label="Year" placeholder="YYYY" />
    </div>
    <Button size="small">Submit payment</Button>
  </div>
);

export const ComponentsSurveyPreview = () => (
  <div className={styles.previewStack}>
    <div className={styles.badgeRow}>
      <Badge tone="info" variant="outline">
        Social
      </Badge>
      <Badge tone="info" variant="outline">
        Search
      </Badge>
      <Badge tone="warning" variant="soft">
        Referral
      </Badge>
    </div>
    <Select
      aria-label="How did you hear about us?"
      defaultValue=""
      options={[
        { label: 'Social media', value: 'social' },
        { label: 'Search engine', value: 'search' },
        { label: 'Referral', value: 'referral' },
      ]}
      placeholder="How did you hear about us?"
    />
  </div>
);

export const ComponentsTeamPreview = () => (
  <div className={styles.previewStack}>
    <div className={styles.badgeRow}>
      <Badge tone="success" variant="soft">
        Synced
      </Badge>
      <Badge tone="info" variant="outline">
        Active
      </Badge>
      <Badge.Count count={3} max={99} />
    </div>
    <Input aria-label="Invite member" placeholder="Send an invite..." />
    <Button intent="secondary" size="small">
      Invite members
    </Button>
  </div>
);

export const ComponentsTogglePreview = () => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [statusEnabled, setStatusEnabled] = useState(false);

  return (
    <div className={styles.previewStack}>
      <div className={styles.previewInlineBetween}>
        <span>Deployment alerts</span>
        <ToggleSwitch
          checked={alertsEnabled}
          onCheckedChange={setAlertsEnabled}
        />
      </div>
      <div className={styles.previewInlineBetween}>
        <span>Status updates</span>
        <ToggleSwitch
          checked={statusEnabled}
          onCheckedChange={setStatusEnabled}
        />
      </div>
      <div className={styles.badgeRow}>
        <Badge tone="success" variant="soft">
          52% used
        </Badge>
      </div>
    </div>
  );
};
