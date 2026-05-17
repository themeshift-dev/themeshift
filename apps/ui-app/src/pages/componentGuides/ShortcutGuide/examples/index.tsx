import { Input } from '@themeshift/ui/components/Input';
import { Menu } from '@themeshift/ui/components/Menu';
import { Shortcut, formatShortcut } from '@themeshift/ui/components/Shortcut';

export const basicUsage = {
  label: 'Basic usage',
  code: `<Shortcut keys="mod+k" />
<Shortcut keys="ctrl+shift+p" />
<Shortcut keys={["Ctrl", "B"]} />
<Shortcut keys={["mod", "Enter"]} />`,
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <Shortcut keys="mod+k" />
      <Shortcut keys="ctrl+shift+p" separator="plus" />
      <Shortcut keys={['Ctrl', 'B']} separator="plus" />
      <Shortcut keys={['mod', 'Enter']} />
    </div>
  ),
};

export const platformFormatting = {
  label: 'Platform-aware mod key',
  code: `<Shortcut keys="mod+k" platform="auto" />
<Shortcut keys="mod+k" platform="mac" />
<Shortcut keys="mod+k" platform="windows" />`,
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <Shortcut keys="mod+k" platform="auto" />
      <Shortcut keys="mod+k" platform="mac" />
      <Shortcut keys="mod+k" platform="windows" separator="plus" />
    </div>
  ),
};

export const separatorsAndFormats = {
  label: 'Separators and formats',
  code: `<Shortcut keys="ctrl+shift+p" platform="windows" separator="none" />
<Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />
<Shortcut keys="ctrl+shift+p" platform="windows" separator="space" format="text" />`,
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <Shortcut keys="ctrl+shift+p" platform="windows" separator="none" />
      <Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />
      <Shortcut
        keys="ctrl+shift+p"
        format="text"
        platform="windows"
        separator="space"
      />
    </div>
  ),
};

export const visualVariants = {
  label: 'Size, variant, and tone',
  code: `<Shortcut keys="mod+k" size="xSmall" variant="soft" />
<Shortcut keys="mod+k" size="small" variant="solid" />
<Shortcut keys="mod+k" size="medium" variant="outline" tone="muted" />
<Shortcut keys="mod+k" size="large" variant="ghost" tone="inverse" />`,
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <Shortcut keys="mod+k" size="xSmall" variant="soft" />
      <Shortcut keys="mod+k" size="small" variant="solid" />
      <Shortcut keys="mod+k" size="medium" tone="muted" variant="outline" />
      <Shortcut keys="mod+k" size="large" tone="inverse" variant="ghost" />
    </div>
  ),
};

export const enabledAndDisabled = {
  label: 'Enabled and disabled',
  code: `<Shortcut keys="mod+k" />
<Shortcut disabled keys="mod+k" />`,
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <Shortcut keys="mod+k" />
      <Shortcut disabled keys="mod+k" />
    </div>
  ),
};

export const compactSpacing = {
  label: 'Compact spacing',
  code: `<Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />
<Shortcut compact keys="ctrl+shift+p" platform="windows" separator="plus" />`,
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />
      <Shortcut
        compact
        keys="ctrl+shift+p"
        platform="windows"
        separator="plus"
      />
    </div>
  ),
};

const directionCode = `<Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: <Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />,
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />
    </div>
  ),
};

export const directionExamples = [directionLTR, directionRTL];

export const menuAndInputUsage = {
  label: 'Menu and Input composition',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
  <Menu.Content aria-label="Commands">
    <Menu.Item>
      <Menu.ItemText>Command palette</Menu.ItemText>
      <Menu.ItemMeta>
        <Shortcut keys="mod+k" />
      </Menu.ItemMeta>
    </Menu.Item>
  </Menu.Content>
</Menu.Root>

<Input
  aria-label="Search"
  placeholder="Search"
  endAdornment={<Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />}
/>`,
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <Menu.Root
        closeOnSelect={false}
        defaultOpen
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <Menu.Content aria-label="Commands" mode="inline">
          <Menu.Item>
            <Menu.ItemText>Command palette</Menu.ItemText>
            <Menu.ItemMeta>
              <Shortcut keys="mod+k" />
            </Menu.ItemMeta>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Input
        aria-label="Search"
        endAdornment={
          <Shortcut keys="ctrl+shift+p" platform="windows" separator="plus" />
        }
        fullWidth={false}
        placeholder="Search"
      />
    </div>
  ),
};

const formattedMac = formatShortcut('mod+shift+p', { platform: 'mac' });

export const formatterUtility = {
  label: 'formatShortcut utility',
  code: `const result = formatShortcut('mod+shift+p', { platform: 'mac' });
// { display: ['⌘', '⇧', 'P'], label: 'Command Shift P' }`,
  sample: (
    <div style={{ display: 'grid', gap: '0.5rem', justifyItems: 'center' }}>
      <Shortcut keys="mod+shift+p" platform="mac" />
      <code>
        {`display: [${formattedMac.display.join(', ')}], label: "${formattedMac.label}"`}
      </code>
    </div>
  ),
};

export const introExamples = [
  basicUsage,
  platformFormatting,
  menuAndInputUsage,
];
