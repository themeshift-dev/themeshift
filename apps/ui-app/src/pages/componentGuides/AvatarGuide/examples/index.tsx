import { Avatar } from '@themeshift/ui/components/Avatar';

const sample1 = '/images/samples/avatars/avatar1_o.png';
const sample2 = '/images/samples/avatars/avatar2_o.png';
const sample3 = '/images/samples/avatars/avatar3_o.png';
const sample4 = '/images/samples/avatars/avatar4_o.png';

export const basicUsage = {
  code: `<Avatar name="Neil Armstrong" src="/images/samples/avatars/avatar1_o.png" />`,
  label: 'Basic usage',
  sample: <Avatar name="Neil Armstrong" src={sample1} />,
};

export const composed = {
  code: `<Avatar.Root aria-label="Chris Hadfield" size="large">
  <Avatar.Image src="/images/samples/avatars/avatar2_o.png" alt="" />
  <Avatar.Fallback name="Chris Hadfield" />
  <Avatar.Badge aria-label="Online" placement="bottom-end">
    <span
      style={{
        background: 'var(--ts-intent-constructive-hover)',
        border: '2px solid var(--ts-components-card-surface-raised)',
        borderRadius: '9999px',
        display: 'inline-block',
        height: '0.625rem',
        width: '0.625rem',
      }}
    />
  </Avatar.Badge>
</Avatar.Root>`,
  label: 'Composition',
  sample: (
    <Avatar.Root aria-label="Chris Hadfield" size="large">
      <Avatar.Image alt="" src={sample2} />
      <Avatar.Fallback name="Chris Hadfield" />
      <Avatar.Badge aria-label="Online" placement="bottom-end">
        <span
          style={{
            background: 'var(--ts-intent-constructive-hover)',
            border: '2px solid var(--ts-components-card-surface-raised)',
            borderRadius: '9999px',
            display: 'inline-block',
            height: '0.625rem',
            width: '0.625rem',
          }}
        />
      </Avatar.Badge>
    </Avatar.Root>
  ),
};

export const sizesAndShapes = {
  code: `<Avatar name="Mae Jemison" shape="circle" size="xSmall" src="/images/samples/avatars/avatar1_o.png" />
<Avatar name="Mae Jemison" shape="rounded" size="small" src="/images/samples/avatars/avatar2_o.png" />
<Avatar name="Mae Jemison" shape="square" size="medium" src="/images/samples/avatars/avatar3_o.png" />
<Avatar name="Mae Jemison" shape="circle" size="large" src="/images/samples/avatars/avatar4_o.png" />
<Avatar name="Mae Jemison" shape="rounded" size="xLarge" src="/images/samples/avatars/avatar1_o.png" />`,
  label: 'Sizes and shapes',
  sample: (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <Avatar name="Mae Jemison" shape="circle" size="xSmall" src={sample1} />
      <Avatar name="Mae Jemison" shape="rounded" size="small" src={sample2} />
      <Avatar name="Mae Jemison" shape="square" size="medium" src={sample3} />
      <Avatar name="Mae Jemison" shape="circle" size="large" src={sample4} />
      <Avatar name="Mae Jemison" shape="rounded" size="xLarge" src={sample1} />
    </div>
  ),
};

export const groupOverflow = {
  code: `<Avatar.Group max={3} total={6} aria-label="Crew members" overflowLabel={(count) => \`\${count} more teammates\`}>
  <Avatar name="Neil Armstrong" src="/images/samples/avatars/avatar1_o.png" />
  <Avatar name="Buzz Aldrin" src="/images/samples/avatars/avatar2_o.png" />
  <Avatar name="Michael Collins" src="/images/samples/avatars/avatar3_o.png" />
  <Avatar name="Sally Ride" src="/images/samples/avatars/avatar4_o.png" />
</Avatar.Group>`,
  label: 'Group and overflow',
  sample: (
    <Avatar.Group
      aria-label="Crew members"
      max={3}
      overflowLabel={(count) => `${count} more teammates`}
      total={6}
    >
      <Avatar name="Neil Armstrong" src={sample1} />
      <Avatar name="Buzz Aldrin" src={sample2} />
      <Avatar name="Michael Collins" src={sample3} />
      <Avatar name="Sally Ride" src={sample4} />
    </Avatar.Group>
  ),
};

export const groupOverlap = {
  code: `<Avatar.Group aria-label="Mission team" overlap={16}>
  <Avatar name="Neil Armstrong" src="/images/samples/avatars/avatar1_o.png" />
  <Avatar name="Buzz Aldrin" src="/images/samples/avatars/avatar2_o.png" />
  <Avatar name="Michael Collins" src="/images/samples/avatars/avatar3_o.png" />
  <Avatar name="Sally Ride" src="/images/samples/avatars/avatar4_o.png" />
  <Avatar name="Mae Jemison" />
</Avatar.Group>`,
  label: 'Overlap',
  sample: (
    <Avatar.Group max={4} aria-label="Mission team" overlap={16}>
      <Avatar name="Neil Armstrong" src={sample1} />
      <Avatar name="Buzz Aldrin" src={sample2} />
      <Avatar name="Michael Collins" src={sample3} />
      <Avatar name="Sally Ride" src={sample4} />
      <Avatar name="Mae Jemison" />
    </Avatar.Group>
  ),
};

export const decorative = {
  code: `<div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
  <Avatar decorative name="Mae Jemison" src="/images/samples/avatars/avatar2_o.png" />
  <span>Mae Jemison</span>
</div>`,
  label: 'Decorative avatar',
  sample: (
    <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
      <Avatar decorative name="Mae Jemison" src={sample2} />
      <span>Mae Jemison</span>
    </div>
  ),
};

export const autoColorFallback = {
  code: `<Avatar color="auto" name="Prince" />
<Avatar color="auto" name="Neil Alden Armstrong" />
<Avatar color="auto" name="Mae Jemison" />`,
  label: 'Auto color fallback',
  sample: (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <Avatar color="auto" name="Prince" />
      <Avatar color="auto" name="Neil Alden Armstrong" />
      <Avatar color="auto" name="Mae Jemison" />
    </div>
  ),
};

export const introExamples = [
  basicUsage,
  composed,
  sizesAndShapes,
  groupOverflow,
  groupOverlap,
  autoColorFallback,
];
