import { Link } from '@themeshift/ui/components/Link';
import { Link as RouterLink } from 'react-router';

export const basicUsage = {
  code: '<Link href="/ui/button">Read Button docs</Link>',
  label: 'Basic usage',
  sample: <Link href="/ui/button">Read Button docs</Link>,
};

export const external = {
  code: `<Link
  href="https://github.com/themeshift-dev/themeshift"
  rel="noreferrer noopener"
  target="_blank"
>
  Open ThemeShift on GitHub
</Link>`,
  label: 'External links',
  sample: (
    <Link
      href="https://github.com/themeshift-dev/themeshift"
      rel="noreferrer noopener"
      target="_blank"
    >
      Open ThemeShift on GitHub
    </Link>
  ),
};

export const asChild = {
  code: `<Link asChild>
  <RouterLink to="/ui/input">Open Input guide</RouterLink>
</Link>`,
  label: 'asChild',
  sample: (
    <Link asChild>
      <RouterLink to="/ui/input">Open Input guide</RouterLink>
    </Link>
  ),
};

export const groupedLinks = {
  code: `<Link href="/ui/input">Input</Link>
<Link href="/ui/select">Select</Link>
<Link href="/ui/textarea">Textarea</Link>`,
  label: 'Grouped links',
  sample: (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <Link href="/ui/input">Input</Link>
      <Link href="/ui/select">Select</Link>
      <Link href="/ui/textarea">Textarea</Link>
    </div>
  ),
};

export const propHighlights = [basicUsage, external, asChild];
