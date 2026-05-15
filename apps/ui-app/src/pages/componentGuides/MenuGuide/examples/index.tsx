import { Menu } from '@themeshift/ui/components/Menu';

export const basicComposition = {
  label: 'Basic composition',
  code: `<Menu.Root closeOnSelect={false} defaultOpen>
  <Menu.Content aria-label="User settings">
    <Menu.Label>Account</Menu.Label>
    <Menu.Item>Profile</Menu.Item>
    <Menu.Item>Billing</Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root closeOnSelect={false} defaultOpen>
      <Menu.Content aria-label="User settings">
        <Menu.Label>Account</Menu.Label>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Billing</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const inlineAndFloating = {
  label: 'Inline and floating modes',
  code: `<div style={{ display: 'grid', gap: '1rem' }}>
  <Menu.Root closeOnSelect={false} defaultOpen>
    <Menu.Content aria-label="Inline menu" mode="inline">
      <Menu.Item>Inline item</Menu.Item>
    </Menu.Content>
  </Menu.Root>

  <Menu.Root closeOnSelect={false} defaultOpen>
    <Menu.Content aria-label="Floating menu anchor" mode="inline">
      <Menu.Sub>
        <Menu.SubTrigger>Floating trigger</Menu.SubTrigger>
        <Menu.SubContent aria-label="Floating menu" portal={false}>
          <Menu.Item style={{ minWidth: '9rem' }}>Floating item</Menu.Item>
        </Menu.SubContent>
      </Menu.Sub>
    </Menu.Content>
  </Menu.Root>
</div>`,
  sample: (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Inline menu" mode="inline">
          <Menu.Item>Inline item</Menu.Item>
        </Menu.Content>
      </Menu.Root>
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Floating menu anchor" mode="inline">
          <Menu.Sub>
            <Menu.SubTrigger>Floating trigger</Menu.SubTrigger>
            <Menu.SubContent aria-label="Floating menu" portal={false}>
              <Menu.Item style={{ minWidth: '9rem' }}>Floating item</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    </div>
  ),
};

export const checkboxRadioIndicator = {
  label: 'Checkbox, radio, and indicator',
  code: `<Menu.Root closeOnSelect={false} defaultOpen>
  <Menu.Content aria-label="Preferences">
    <Menu.CheckboxItem defaultChecked>
      <Menu.ItemIndicator forceMount>✓</Menu.ItemIndicator>
      <Menu.ItemText>Dense mode</Menu.ItemText>
    </Menu.CheckboxItem>
    <Menu.RadioGroup defaultValue="system">
      <Menu.RadioItem value="system">
        <Menu.ItemIndicator forceMount>•</Menu.ItemIndicator>
        <Menu.ItemText>System</Menu.ItemText>
      </Menu.RadioItem>
      <Menu.RadioItem value="light">
        <Menu.ItemIndicator forceMount>•</Menu.ItemIndicator>
        <Menu.ItemText>Light</Menu.ItemText>
      </Menu.RadioItem>
    </Menu.RadioGroup>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root closeOnSelect={false} defaultOpen>
      <Menu.Content aria-label="Preferences">
        <Menu.CheckboxItem defaultChecked>
          <Menu.ItemIndicator forceMount>✓</Menu.ItemIndicator>
          <Menu.ItemText>Dense mode</Menu.ItemText>
        </Menu.CheckboxItem>
        <Menu.RadioGroup defaultValue="system">
          <Menu.RadioItem value="system">
            <Menu.ItemIndicator forceMount>•</Menu.ItemIndicator>
            <Menu.ItemText>System</Menu.ItemText>
          </Menu.RadioItem>
          <Menu.RadioItem value="light">
            <Menu.ItemIndicator forceMount>•</Menu.ItemIndicator>
            <Menu.ItemText>Light</Menu.ItemText>
          </Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const submenuIntent = {
  label: 'Submenu intent handling',
  code: `<Menu.Root closeOnSelect={false} defaultOpen>
  <Menu.Content aria-label="Actions">
    <Menu.Sub>
      <Menu.SubTrigger>More tools</Menu.SubTrigger>
      <Menu.SubContent aria-label="More tools">
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root closeOnSelect={false} defaultOpen>
      <Menu.Content aria-label="Actions">
        <Menu.Sub>
          <Menu.SubTrigger>More tools</Menu.SubTrigger>
          <Menu.SubContent aria-label="More tools">
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const rtlBehavior = {
  label: 'RTL behavior',
  code: `<Menu.Root closeOnSelect={false} defaultOpen dir="rtl">
  <Menu.Content aria-label="RTL actions">
    <Menu.Sub>
      <Menu.SubTrigger>עוד</Menu.SubTrigger>
      <Menu.SubContent aria-label="RTL nested actions">
        <Menu.Item>שנה שם</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root closeOnSelect={false} defaultOpen dir="rtl">
      <Menu.Content aria-label="RTL actions">
        <Menu.Sub>
          <Menu.SubTrigger>עוד</Menu.SubTrigger>
          <Menu.SubContent aria-label="RTL nested actions">
            <Menu.Item>שנה שם</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const asChildLink = {
  label: 'asChild link item',
  code: `<Menu.Root closeOnSelect={false} defaultOpen>
  <Menu.Content aria-label="Navigation">
    <Menu.Item asChild>
      <a href="/settings">Settings</a>
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root closeOnSelect={false} defaultOpen>
      <Menu.Content aria-label="Navigation">
        <Menu.Item asChild>
          <a href="/settings">Settings</a>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const typeaheadTextValue = {
  label: 'Typeahead with textValue',
  code: `<Menu.Root closeOnSelect={false} defaultOpen>
  <Menu.Content aria-label="Commands">
    <Menu.Item textValue="Account settings">
      <Menu.ItemText>Account settings</Menu.ItemText>
      <Menu.ItemMeta>⌘,</Menu.ItemMeta>
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root closeOnSelect={false} defaultOpen>
      <Menu.Content aria-label="Commands">
        <Menu.Item textValue="Account settings">
          <Menu.ItemText>Account settings</Menu.ItemText>
          <Menu.ItemMeta>⌘,</Menu.ItemMeta>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const disabledItemBehavior = {
  label: 'Disabled item behavior',
  code: `<Menu.Root closeOnSelect={false} defaultOpen>
  <Menu.Content aria-label="Disabled item behavior">
    <Menu.Item>Open project</Menu.Item>
    <Menu.Item disabled>Archive project (disabled)</Menu.Item>
    <Menu.Item disabled disabledBehavior="focusable">
      Delete project (focusable disabled)
    </Menu.Item>
    <Menu.Sub>
      <Menu.SubTrigger>Advanced actions</Menu.SubTrigger>
      <Menu.SubContent aria-label="Advanced actions">
        <Menu.Item disabled>Convert format (disabled)</Menu.Item>
        <Menu.Item disabled disabledBehavior="focusable">
          Reset permissions (focusable disabled)
        </Menu.Item>
        <Menu.Item>Export report</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
    <Menu.Item>Rename project</Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root closeOnSelect={false} defaultOpen>
      <Menu.Content aria-label="Disabled item behavior">
        <Menu.Item>Open project</Menu.Item>
        <Menu.Item disabled>Archive project (disabled)</Menu.Item>
        <Menu.Item disabled disabledBehavior="focusable">
          Delete project (focusable disabled)
        </Menu.Item>
        <Menu.Sub>
          <Menu.SubTrigger>Advanced actions</Menu.SubTrigger>
          <Menu.SubContent aria-label="Advanced actions">
            <Menu.Item disabled>Convert format (disabled)</Menu.Item>
            <Menu.Item disabled disabledBehavior="focusable">
              Reset permissions (focusable disabled)
            </Menu.Item>
            <Menu.Item>Export report</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
        <Menu.Item>Rename project</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const clickFocusSubmenu = {
  label: 'Click/focus-only submenu',
  code: `<Menu.Root
  closeOnSelect={false}
  defaultOpen
  onEscapeKeyDown={(event) => event.preventDefault()}
>
  <Menu.Content aria-label="Actions">
    <Menu.Sub openOnHover={false}>
      <Menu.SubTrigger>More tools</Menu.SubTrigger>
      <Menu.SubContent aria-label="More tools">
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root
      closeOnSelect={false}
      defaultOpen
      onEscapeKeyDown={(event) => event.preventDefault()}
    >
      <Menu.Content aria-label="Actions">
        <Menu.Sub openOnHover={false}>
          <Menu.SubTrigger>More tools</Menu.SubTrigger>
          <Menu.SubContent aria-label="More tools">
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const introExamples = [
  basicComposition,
  inlineAndFloating,
  checkboxRadioIndicator,
  submenuIntent,
  rtlBehavior,
  asChildLink,
  typeaheadTextValue,
];
