import { Link } from '@themeshift/ui/components/Link';
import { Menu } from '@themeshift/ui/components/Menu';
import { Shortcut } from '@themeshift/ui/components/Shortcut';

export const basicUsage = {
  label: 'Basic usage',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
  <Menu.Content aria-label="User settings">
    <Menu.Label>Account</Menu.Label>
    <Menu.Item>Profile</Menu.Item>
    <Menu.Item>Billing</Menu.Item>
    <Menu.Item>Settings</Menu.Item>
    <Menu.Separator />
    <Menu.Item>
      <Menu.ItemText>Log out</Menu.ItemText>
      <Menu.ItemMeta><Shortcut keys="mod+q" /></Menu.ItemMeta>
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root
      closeOnSelect={false}
      defaultOpen
      onEscapeKeyDown={(event) => event.preventDefault()}
    >
      <Menu.Content aria-label="User settings">
        <Menu.Label>Account</Menu.Label>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Billing</Menu.Item>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Separator />
        <Menu.Item>
          <Menu.ItemText>Log out</Menu.ItemText>
          <Menu.ItemMeta>
            <Shortcut keys="mod+q" />
          </Menu.ItemMeta>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const fullComposition = {
  label: 'Full composition',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
  <Menu.Content aria-label="Workspace actions">
    <Menu.Label>Workspace</Menu.Label>
    <Menu.Group>
      <Menu.Item>
        <Menu.ItemIcon>📁</Menu.ItemIcon>
        <Menu.ItemText>Open project</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="enter" /></Menu.ItemMeta>
      </Menu.Item>
      <Menu.Item>
        <Menu.ItemIcon>✏️</Menu.ItemIcon>
        <Menu.ItemText>Edit details</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="mod+e" /></Menu.ItemMeta>
      </Menu.Item>
      <Menu.Item disabled>Export as PDF</Menu.Item>
    </Menu.Group>
    <Menu.Separator />
    <Menu.Group>
      <Menu.CheckboxItem defaultChecked>
        <Menu.ItemIndicator forceMount>✓</Menu.ItemIndicator>
        <Menu.ItemText>Dense mode</Menu.ItemText>
      </Menu.CheckboxItem>
      <Menu.RadioGroup defaultValue="system">
        <Menu.RadioItem value="system">
          <Menu.ItemIndicator forceMount>•</Menu.ItemIndicator>
          <Menu.ItemText>System theme</Menu.ItemText>
        </Menu.RadioItem>
        <Menu.RadioItem value="light">
          <Menu.ItemIndicator forceMount>•</Menu.ItemIndicator>
          <Menu.ItemText>Light theme</Menu.ItemText>
        </Menu.RadioItem>
      </Menu.RadioGroup>
    </Menu.Group>
    <Menu.Separator />
    <Menu.Sub>
      <Menu.SubTrigger>Share</Menu.SubTrigger>
      <Menu.SubContent aria-label="Share actions">
        <Menu.Item>Copy link</Menu.Item>
        <Menu.Item>Email invite</Menu.Item>
        <Menu.Item>Slack channel</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
    <Menu.Sub>
      <Menu.SubTrigger>More tools</Menu.SubTrigger>
      <Menu.SubContent aria-label="More tools">
        <Menu.Item textValue="Rename project">
          <Menu.ItemText>Rename</Menu.ItemText>
          <Menu.ItemMeta><Shortcut keys="mod+r" /></Menu.ItemMeta>
        </Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item>Move to folder</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
    <Menu.Separator />
    <Menu.Item destructive>
      <Menu.ItemText>Archive project</Menu.ItemText>
      <Menu.ItemMeta><Shortcut keys="mod+backspace" /></Menu.ItemMeta>
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root
      closeOnSelect={false}
      defaultOpen
      onEscapeKeyDown={(event) => event.preventDefault()}
    >
      <Menu.Content aria-label="Workspace actions">
        <Menu.Label>Workspace</Menu.Label>
        <Menu.Group>
          <Menu.Item>
            <Menu.ItemIcon>📁</Menu.ItemIcon>
            <Menu.ItemText>Open project</Menu.ItemText>
            <Menu.ItemMeta>
              <Shortcut keys="enter" />
            </Menu.ItemMeta>
          </Menu.Item>
          <Menu.Item>
            <Menu.ItemIcon>✏️</Menu.ItemIcon>
            <Menu.ItemText>Edit details</Menu.ItemText>
            <Menu.ItemMeta>
              <Shortcut keys="mod+e" />
            </Menu.ItemMeta>
          </Menu.Item>
          <Menu.Item disabled>Export as PDF</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Group>
          <Menu.CheckboxItem defaultChecked>
            <Menu.ItemIndicator forceMount>✓</Menu.ItemIndicator>
            <Menu.ItemText>Dense mode</Menu.ItemText>
          </Menu.CheckboxItem>
          <Menu.RadioGroup defaultValue="system">
            <Menu.RadioItem value="system">
              <Menu.ItemIndicator forceMount>•</Menu.ItemIndicator>
              <Menu.ItemText>System theme</Menu.ItemText>
            </Menu.RadioItem>
            <Menu.RadioItem value="light">
              <Menu.ItemIndicator forceMount>•</Menu.ItemIndicator>
              <Menu.ItemText>Light theme</Menu.ItemText>
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Sub>
          <Menu.SubTrigger>Share</Menu.SubTrigger>
          <Menu.SubContent aria-label="Share actions">
            <Menu.Item>Copy link</Menu.Item>
            <Menu.Item>Email invite</Menu.Item>
            <Menu.Item>Slack channel</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
        <Menu.Sub>
          <Menu.SubTrigger>More tools</Menu.SubTrigger>
          <Menu.SubContent aria-label="More tools">
            <Menu.Item textValue="Rename project">
              <Menu.ItemText>Rename</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="mod+r" />
              </Menu.ItemMeta>
            </Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Item>Move to folder</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
        <Menu.Separator />
        <Menu.Item destructive>
          <Menu.ItemText>Archive project</Menu.ItemText>
          <Menu.ItemMeta>
            <Shortcut keys="mod+backspace" />
          </Menu.ItemMeta>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const inlineAndFloating = {
  label: 'Inline and floating modes',
  code: `<div style={{ display: 'grid', gap: '1rem' }}>
  <Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
    <Menu.Content aria-label="Inline menu" mode="inline">
      <Menu.Item>Inline item</Menu.Item>
    </Menu.Content>
  </Menu.Root>

  <Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
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
      <Menu.Root
        closeOnSelect={false}
        defaultOpen
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <Menu.Content aria-label="Inline menu" mode="inline">
          <Menu.Item>Inline item</Menu.Item>
        </Menu.Content>
      </Menu.Root>
      <Menu.Root
        closeOnSelect={false}
        defaultOpen
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
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
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
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
    <Menu.Root
      closeOnSelect={false}
      defaultOpen
      onEscapeKeyDown={(event) => event.preventDefault()}
    >
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

export const subMenus = {
  label: 'Submenus',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
  <Menu.Content aria-label="Actions">
    <Menu.Item>
      <Menu.ItemText>Open project</Menu.ItemText>
      <Menu.ItemMeta><Shortcut keys="enter" /></Menu.ItemMeta>
    </Menu.Item>
    <Menu.Item>
      <Menu.ItemText>Edit details</Menu.ItemText>
      <Menu.ItemMeta><Shortcut keys="mod+e" /></Menu.ItemMeta>
    </Menu.Item>
    <Menu.Separator />
    <Menu.Sub>
      <Menu.SubTrigger>Share</Menu.SubTrigger>
      <Menu.SubContent aria-label="Share actions">
        <Menu.Item>Copy link</Menu.Item>
        <Menu.Item>Email invite</Menu.Item>
        <Menu.Item>Slack channel</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
    <Menu.Sub>
      <Menu.SubTrigger>More tools</Menu.SubTrigger>
      <Menu.SubContent aria-label="More tools">
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item>Move to folder</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
    <Menu.Separator />
    <Menu.Item destructive>
      <Menu.ItemText>Archive project</Menu.ItemText>
      <Menu.ItemMeta><Shortcut keys="mod+backspace" /></Menu.ItemMeta>
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root
      closeOnSelect={false}
      defaultOpen
      onEscapeKeyDown={(event) => event.preventDefault()}
    >
      <Menu.Content aria-label="Actions">
        <Menu.Item>
          <Menu.ItemText>Open project</Menu.ItemText>
          <Menu.ItemMeta>
            <Shortcut keys="enter" />
          </Menu.ItemMeta>
        </Menu.Item>
        <Menu.Item>
          <Menu.ItemText>Edit details</Menu.ItemText>
          <Menu.ItemMeta>
            <Shortcut keys="mod+e" />
          </Menu.ItemMeta>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Sub>
          <Menu.SubTrigger>Share</Menu.SubTrigger>
          <Menu.SubContent aria-label="Share actions">
            <Menu.Item>Copy link</Menu.Item>
            <Menu.Item>Email invite</Menu.Item>
            <Menu.Item>Slack channel</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
        <Menu.Sub>
          <Menu.SubTrigger>More tools</Menu.SubTrigger>
          <Menu.SubContent aria-label="More tools">
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Item>Move to folder</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
        <Menu.Separator />
        <Menu.Item destructive>
          <Menu.ItemText>Archive project</Menu.ItemText>
          <Menu.ItemMeta>
            <Shortcut keys="mod+backspace" />
          </Menu.ItemMeta>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const rtlBehavior = {
  label: 'RTL behavior',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()} dir="rtl">
  <Menu.Content aria-label="RTL actions">
    <Menu.Sub>
      <Menu.SubTrigger>More</Menu.SubTrigger>
      <Menu.SubContent aria-label="RTL nested actions">
        <Menu.Item>Change name</Menu.Item>
      </Menu.SubContent>
    </Menu.Sub>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root
      closeOnSelect={false}
      defaultOpen
      onEscapeKeyDown={(event) => event.preventDefault()}
      dir="rtl"
    >
      <Menu.Content aria-label="RTL actions">
        <Menu.Sub>
          <Menu.SubTrigger>More</Menu.SubTrigger>
          <Menu.SubContent aria-label="RTL nested actions">
            <Menu.Item>Change name</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const directionLTR = {
  label: 'LTR',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()} dir="ltr">
  <Menu.Content aria-label="Direction demo">
    <Menu.Label>Account</Menu.Label>
    <Menu.Item>Profile</Menu.Item>
    <Menu.Item>Billing</Menu.Item>
    <Menu.Sub>
      <Menu.SubTrigger>More actions</Menu.SubTrigger>
      <Menu.SubContent aria-label="More actions">
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
      dir="ltr"
    >
      <Menu.Content aria-label="Direction demo">
        <Menu.Label>Account</Menu.Label>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Billing</Menu.Item>
        <Menu.Sub>
          <Menu.SubTrigger>More actions</Menu.SubTrigger>
          <Menu.SubContent aria-label="More actions">
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const directionRTL = {
  label: 'RTL',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()} dir="rtl">
  <Menu.Content aria-label="Direction demo">
    <Menu.Label>Account</Menu.Label>
    <Menu.Item>Profile</Menu.Item>
    <Menu.Item>Billing</Menu.Item>
    <Menu.Sub>
      <Menu.SubTrigger>More actions</Menu.SubTrigger>
      <Menu.SubContent aria-label="More actions">
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
      dir="rtl"
    >
      <Menu.Content aria-label="Direction demo">
        <Menu.Label>Account</Menu.Label>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Billing</Menu.Item>
        <Menu.Sub>
          <Menu.SubTrigger>More actions</Menu.SubTrigger>
          <Menu.SubContent aria-label="More actions">
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const directionExamples = [directionLTR, directionRTL];

export const asChildLink = {
  label: 'asChild link item',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
  <Menu.Content aria-label="Navigation">
    <Menu.Item asChild>
      <a href="/settings">Settings</a>
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  sample: (
    <Menu.Root
      closeOnSelect={false}
      defaultOpen
      onEscapeKeyDown={(event) => event.preventDefault()}
    >
      <Menu.Content aria-label="Navigation">
        <Menu.Item asChild>
          <Link href="/settings" onClick={(e) => e.preventDefault()}>
            Settings
          </Link>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const typeaheadTextValue = {
  label: 'Typeahead with textValue',
  code: `<div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
  <Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
    <Menu.Content aria-label="Commands">
      <Menu.Item textValue="Activity feed">
        <Menu.ItemText>Activity</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="g+a" format="text" separator="space" /></Menu.ItemMeta>
      </Menu.Item>
      <Menu.Item textValue="Account settings">
        <Menu.ItemText>Account settings</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="mod+," /></Menu.ItemMeta>
      </Menu.Item>
      <Menu.Item textValue="Billing portal">
        <Menu.ItemText>Billing</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="g+b" format="text" separator="space" /></Menu.ItemMeta>
      </Menu.Item>
      <Menu.Item textValue="Command palette">
        <Menu.ItemText>Quick actions</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="mod+k" /></Menu.ItemMeta>
      </Menu.Item>
      <Menu.Item textValue="Invite collaborators">
        <Menu.ItemText>Invite team</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="g+i" format="text" separator="space" /></Menu.ItemMeta>
      </Menu.Item>
      <Menu.Item textValue="Project settings">
        <Menu.ItemText>Project</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="g+p" format="text" separator="space" /></Menu.ItemMeta>
      </Menu.Item>
      <Menu.Item textValue="Workspace preferences">
        <Menu.ItemText>Preferences</Menu.ItemText>
        <Menu.ItemMeta><Shortcut keys="g+w" format="text" separator="space" /></Menu.ItemMeta>
      </Menu.Item>
    </Menu.Content>
  </Menu.Root>
</div>`,
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <div style={{ width: 'fit-content' }}>
        <Menu.Root
          closeOnSelect={false}
          defaultOpen
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <Menu.Content aria-label="Commands">
            <Menu.Item textValue="Activity feed">
              <Menu.ItemText>Activity</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="g+a" format="text" separator="space" />
              </Menu.ItemMeta>
            </Menu.Item>
            <Menu.Item textValue="Account settings">
              <Menu.ItemText>Account settings</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="mod+," />
              </Menu.ItemMeta>
            </Menu.Item>
            <Menu.Item textValue="Billing portal">
              <Menu.ItemText>Billing</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="g+b" format="text" separator="space" />
              </Menu.ItemMeta>
            </Menu.Item>
            <Menu.Item textValue="Command palette">
              <Menu.ItemText>Quick actions</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="mod+k" />
              </Menu.ItemMeta>
            </Menu.Item>
            <Menu.Item textValue="Invite collaborators">
              <Menu.ItemText>Invite team</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="g+i" format="text" separator="space" />
              </Menu.ItemMeta>
            </Menu.Item>
            <Menu.Item textValue="Project settings">
              <Menu.ItemText>Project</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="g+p" format="text" separator="space" />
              </Menu.ItemMeta>
            </Menu.Item>
            <Menu.Item textValue="Workspace preferences">
              <Menu.ItemText>Preferences</Menu.ItemText>
              <Menu.ItemMeta>
                <Shortcut keys="g+w" format="text" separator="space" />
              </Menu.ItemMeta>
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </div>
      <p style={{ fontSize: '0.875rem', margin: 0, opacity: 0.8 }}>
        Focus the menu, then start typing to jump to matching commands.
      </p>
    </div>
  ),
};

export const disabledItemBehavior = {
  label: 'Disabled item behavior',
  code: `<Menu.Root closeOnSelect={false} defaultOpen onEscapeKeyDown={(event) => event.preventDefault()}>
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
    <Menu.Root
      closeOnSelect={false}
      defaultOpen
      onEscapeKeyDown={(event) => event.preventDefault()}
    >
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
  basicUsage,
  fullComposition,
  subMenus,
  asChildLink,
  typeaheadTextValue,
];
