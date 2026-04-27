import { Button } from '@themeshift/ui/components/Button';
import { Tooltip } from '@themeshift/ui/components/Tooltip';

import { ControlledTooltipSample, ProviderToolbarSample } from './samples';

export const basicUsage = {
  code: `<Tooltip content="Delete project">
  <Button type="button">Delete</Button>
</Tooltip>`,
  label: 'Basic usage',
  sample: (
    <Tooltip content="Delete project">
      <Button type="button">Delete</Button>
    </Tooltip>
  ),
};

export const primitives = {
  code: `<Tooltip.Root delay={600}>
  <Tooltip.Trigger asChild>
    <Button type="button">Notifications</Button>
  </Tooltip.Trigger>

  <Tooltip.Content placement="top">
    View notifications
    <Tooltip.Arrow />
  </Tooltip.Content>
</Tooltip.Root>`,
  label: 'Primitives',
  sample: (
    <Tooltip.Root delay={600}>
      <Tooltip.Trigger asChild>
        <Button type="button">Notifications</Button>
      </Tooltip.Trigger>

      <Tooltip.Content placement="top">
        View notifications
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Root>
  ),
};

export const providerTiming = {
  code: `<Tooltip.Provider delay={700} closeDelay={100} skipDelayDuration={300}>
  <Tooltip content="Bold"><Button>B</Button></Tooltip>
  <Tooltip content="Italic"><Button>I</Button></Tooltip>
  <Tooltip content="Underline"><Button>U</Button></Tooltip>
</Tooltip.Provider>`,
  label: 'Provider timing',
  sample: <ProviderToolbarSample />,
};

export const controlled = {
  code: `const [open, setOpen] = useState(false);

<Tooltip content="Controlled tooltip" open={open} onOpenChange={setOpen}>
  <Button type="button">Controlled trigger</Button>
</Tooltip>`,
  label: 'Controlled',
  sample: <ControlledTooltipSample />,
};

export const placementExamples = {
  code: `<Tooltip content="Top" placement="top"><Button>Top</Button></Tooltip>
<Tooltip content="Right" placement="right"><Button>Right</Button></Tooltip>
<Tooltip content="Bottom" placement="bottom"><Button>Bottom</Button></Tooltip>
<Tooltip content="Left" placement="left"><Button>Left</Button></Tooltip>`,
  label: 'Placements',
  sample: (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Tooltip.Provider>
        <Tooltip content="Top" placement="top">
          <Button type="button">Top</Button>
        </Tooltip>
        <Tooltip content="Right" placement="right">
          <Button type="button">Right</Button>
        </Tooltip>
        <Tooltip content="Bottom" placement="bottom">
          <Button type="button">Bottom</Button>
        </Tooltip>
        <Tooltip content="Left" placement="left">
          <Button type="button">Left</Button>
        </Tooltip>
      </Tooltip.Provider>
    </div>
  ),
};

export const localPortal = {
  code: `<Tooltip content="Local tooltip" portal={false}>
  <Button type="button">Local container</Button>
</Tooltip>`,
  label: 'No portal',
  sample: (
    <Tooltip content="Local tooltip" portal={false}>
      <Button type="button">Local container</Button>
    </Tooltip>
  ),
};

export const propHighlights = [
  basicUsage,
  primitives,
  providerTiming,
  localPortal,
];
