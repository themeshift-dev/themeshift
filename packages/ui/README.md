# ThemeShift UI

ThemeShift UI is a React UI framework built around design tokens and theme-aware styling. ThemeShift makes creating your own theme-aware components easy as pie.

This package now lives inside the ThemeShift monorepo. Use the root workspace for local development and the docs app in `apps/ui-app` for richer examples and integration guides.

## Overview

ThemeShift UI is designed for apps that want:

- React components with sensible defaults
- themeable styles powered by CSS variables
- design-token-driven customization
- per-component imports instead of a single all-in bundle

ThemeShift UI includes:

- React components from `@themeshift/ui/components/*`
- optional default font-face definitions from `@themeshift/ui/css/fonts.css`
- base styles from `@themeshift/ui/css/base.css`
- default token values from `@themeshift/ui/css/tokens.css`
- token source files and `theme-contract.json` for ThemeShift-aware overrides

## Installation

```bash
npm install @themeshift/ui react react-dom
```

If you want to override the default token values with your own ThemeShift tokens, also install the Vite plugin:

```bash
npm install -D @themeshift/vite-plugin-themeshift
```

## Usage

Import the components you need directly:

```tsx
import { Button } from '@themeshift/ui/components/Button';
import '@themeshift/ui/css/fonts.css';
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';

export function Example() {
  return <Button>Click me</Button>;
}
```

Each component loads its own CSS automatically. You only need to import:

- `@themeshift/ui/css/fonts.css` if you want ThemeShift's default Noto Sans font files
- `@themeshift/ui/css/base.css` for shared base styles
- `@themeshift/ui/css/tokens.css` for the package's default token values

`fonts.css` is intentionally separate from `base.css`. If you want to use your own font-face setup, omit `fonts.css` and override the typography tokens with your own font families.

For `light` and `dark` theme-specific token values to apply, set `data-theme` on the document root (`<html>`), not on your React app container:

```tsx
import { useEffect } from 'react';
import { Button } from '@themeshift/ui/components/Button';
import '@themeshift/ui/css/fonts.css';
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';

export function Example() {
  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
  }, []);

  return <Button>Click me</Button>;
}
```

If you set `data-theme` on a `<div id="root">`, the generated selectors will not match because ThemeShift emits theme variables under `:root[data-theme='...']`.

## Theming

ThemeShift UI uses CSS variables for theming. Things like typography, spacing, and component colors are all driven by token-based custom properties.

If you are happy with the default theme, import:

```tsx
import '@themeshift/ui/css/fonts.css';
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';
```

If you want ThemeShift styles but not the default Noto Sans font, import `base.css` and `tokens.css` but skip `fonts.css`.

## Fonts

ThemeShift UI publishes its default font assets separately so applications can choose whether to adopt them.

To use the packaged default fonts:

```tsx
import '@themeshift/ui/css/fonts.css';
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';
```

To provide your own fonts instead:

```tsx
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';
```

Then define your own font-face rules and override the relevant typography tokens in your app token files.

If you want to override the defaults, generate your own token CSS in your app with `@themeshift/vite-plugin-themeshift` and use `@themeshift/ui` as the starting point:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { themeShift } from '@themeshift/vite-plugin-themeshift';

export default defineConfig({
  plugins: [
    react(),
    themeShift({
      extends: ['@themeshift/ui'],
      cssVarPrefix: 'themeshift',
    }),
  ],
});
```

In that setup, your app-level `tokens/*.json` files override the default values from ThemeShift UI without needing to rebuild this package’s Sass.

## Available Imports

ThemeShift UI currently includes:

- `@themeshift/ui/components/Button`
- `@themeshift/ui/components/Heading`
- `@themeshift/ui/components/Navbar`
- `@themeshift/ui/components/Responsive`
- `@themeshift/ui/css/fonts.css`
- `@themeshift/ui/css/base.css`
- `@themeshift/ui/css/tokens.css`
- `@themeshift/ui/theme-contract.json`
- `@themeshift/ui/tokens/*`

CSS variable names use the `--themeshift-*` namespace to avoid collisions with application-level custom properties.

## Accessibility

Interactive components in ThemeShift UI should use the shared focus mixins from
[`src/sass/mixins/accessibility.scss`](./src/sass/mixins/accessibility.scss)
instead of removing focus styles directly.

- Use `focusVisible` when a component needs custom `:focus-visible` behavior.
- Use `focusVisibleRing` for the standard tokenized focus ring.
- Use `buttonFocus` when you want the standard button treatment with clearer intent.

These mixins standardize the safer pattern below so keyboard and assistive-technology users keep a visible focus indicator, while most pointer-triggered focus avoids extra visual noise:

```scss
&:focus:not(:focus-visible) {
  outline: none;
}

&:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

## Responsive

ThemeShift UI includes a `Responsive` primitive for CSS-only conditional visibility.

```tsx
import { Responsive } from '@themeshift/ui/components/Responsive';

export function ExampleResponsive() {
  return (
    <>
      <Responsive when={{ below: 'tablet' }} data-testid="mobile-only">
        Mobile only
      </Responsive>

      <Responsive when={{ from: 'tablet' }}>Tablet and up</Responsive>

      <Responsive when={{ from: 'tablet', to: 'desktop' }}>
        Tablet through desktop
      </Responsive>

      <Responsive when={{ below: 'desktop' }}>Below desktop</Responsive>
    </>
  );
}
```

Breakpoint semantics:

- `from` is inclusive
- `to` is inclusive
- `above` is exclusive
- `below` is exclusive

Breakpoint values are token-driven through `layout.breakpoints.*`.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
