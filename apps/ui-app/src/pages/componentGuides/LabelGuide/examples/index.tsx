import { Checkbox } from '@themeshift/ui/components/Checkbox';
import { Input } from '@themeshift/ui/components/Input';
import { Label } from '@themeshift/ui/components/Label';

export const basicUsage = {
  code: `<>
  <Label htmlFor="email-input">Email address</Label>
  <Input id="email-input" placeholder="you@example.com" />
</>`,
  label: 'Basic usage',
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Label htmlFor="email-input">Email address</Label>
      <Input id="email-input" placeholder="you@example.com" />
    </div>
  ),
};

export const wrappingControl = {
  code: `<Label>
  <Checkbox name="terms" />
  <span style={{ marginLeft: '0.5rem' }}>I agree to the terms</span>
</Label>`,
  label: 'Wrapping controls',
  sample: (
    <Label>
      <Checkbox name="terms" />
      <span style={{ marginLeft: '0.5rem' }}>I agree to the terms</span>
    </Label>
  ),
};

export const requiredHint = {
  code: `<>
  <Label htmlFor="project-name">Project name (required)</Label>
  <Input id="project-name" required />
</>`,
  label: 'Required hint',
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Label htmlFor="project-name">Project name (required)</Label>
      <Input id="project-name" required />
    </div>
  ),
};

export const multiline = {
  code: `<Label htmlFor="bio-input">
  Tell us about your team and what you are building.
</Label>`,
  label: 'Multiline text',
  sample: (
    <Label htmlFor="bio-input">
      Tell us about your team and what you are building.
    </Label>
  ),
};

export const propHighlights = [basicUsage, wrappingControl, requiredHint];
