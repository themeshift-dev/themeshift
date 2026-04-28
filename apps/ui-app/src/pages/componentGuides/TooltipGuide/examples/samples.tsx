import { useState } from 'react';
import { Button } from '@themeshift/ui/components/Button';
import { Tooltip } from '@themeshift/ui/components/Tooltip';
import { FiBold, FiUnderline, FiItalic } from 'react-icons/fi';

export const ControlledTooltipSample = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button
        intent="secondary"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Toggle tooltip
      </Button>

      <Tooltip
        content="Controlled tooltip content"
        onOpenChange={setOpen}
        open={open}
      >
        <Button type="button">Controlled trigger</Button>
      </Tooltip>
    </div>
  );
};

export const ProviderToolbarSample = () => {
  return (
    <Tooltip.Provider closeDelay={100} delay={700} skipDelayDuration={300}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Tooltip content="Bold">
          <Button type="button" aria-label="Bold" icon={<FiBold />} />
        </Tooltip>
        <Tooltip content="Italic">
          <Button type="button" aria-label="Italic" icon={<FiItalic />} />
        </Tooltip>
        <Tooltip content="Underline">
          <Button type="button" aria-label="Underline" icon={<FiUnderline />} />
        </Tooltip>
      </div>
    </Tooltip.Provider>
  );
};
