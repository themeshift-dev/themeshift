# ThemeShift UI

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![CI](https://github.com/themeshift-dev/themeshift/actions/workflows/ci.yml/badge.svg?branch=develop)
![Coverage](https://codecov.io/gh/themeshift-dev/themeshift/graph/badge.svg?flag=ui&branch=develop)
![npm](https://img.shields.io/npm/v/@themeshift/ui)
![Components](https://img.shields.io/badge/components-29-blue.svg)

ThemeShift UI is a React UI framework built around design tokens and theme-aware styling. ThemeShift makes creating your own theme-aware components easy as pie 🥧

This package now lives inside the ThemeShift monorepo. Use the root workspace for local development and the docs app in `apps/ui-app` for richer examples and integration guides.

## What it includes

ThemeShift UI is a good fit for apps that want:

- React components with sensible defaults
- themeable styles powered by CSS variables
- design-token-driven customization
- per-component imports instead of a single all-in bundle

This package includes:

- React components from `@themeshift/ui/components/*`
- base styles from `@themeshift/ui/css/base.css`
- default token values from `@themeshift/ui/css/tokens.css`
- token source files and `theme-contract.json` for ThemeShift-aware overrides

## Installation

```bash
npm install @themeshift/ui react react-dom
```

If you want to override the default token values with your own ThemeShift tokens, also install the Vite plugin:

```bash
npm install -D @themeshift/vite-plugin
```

## Quick start

Import the components you need directly:

```tsx
import { Button } from '@themeshift/ui/components/Button';
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';

export function Example() {
  return <Button>Click me</Button>;
}
```

Each component loads its own CSS automatically. In most apps, you only need to import:

- `@themeshift/ui/css/base.css` for shared base styles
- `@themeshift/ui/css/tokens.css` for the package's default token values

ThemeShift UI does not ship font files. Define your own fonts in your app and
override typography tokens as needed.

To use `light` and `dark` token values, set `data-theme` on the document root (`<html>`), not on your React app container:

```tsx
import { useEffect } from 'react';
import { Button } from '@themeshift/ui/components/Button';
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';

export function Example() {
  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
  }, []);

  return <Button>Click me</Button>;
}
```

If you set `data-theme` on `<div id="root">`, the generated selectors will not match because ThemeShift writes theme variables under `:root[data-theme='...']`.

## Theming

ThemeShift UI uses CSS variables for theming. Typography, spacing, and component colors all come from token-based custom properties.

If you want the default theme, import:

```tsx
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';
```

Add your own `@font-face` rules (or platform fonts) in your app and override typography tokens in app token files when needed.

## Token overrides

If you want to override the defaults, generate your own token CSS in your app with `@themeshift/vite-plugin` and use `@themeshift/ui` as the starting point:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { themeShift } from '@themeshift/vite-plugin';

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

In that setup, your app-level `tokens/*.json` files override the default values from ThemeShift UI without rebuilding this package.

## Available Imports

ThemeShift UI currently includes:

- `@themeshift/ui/components/Button`
- `@themeshift/ui/components/Heading`
- `@themeshift/ui/components/Navbar`
- `@themeshift/ui/components/Responsive`
- `@themeshift/ui/css/base.css`
- `@themeshift/ui/css/tokens.css`
- `@themeshift/ui/theme-contract.json`
- `@themeshift/ui/tokens/*`

CSS variable names use the `--themeshift-*` namespace to avoid collisions with application-level custom properties.

## Accessibility

Interactive components in ThemeShift UI should use the shared focus mixins from [`src/sass/mixins/accessibility.scss`](./src/sass/mixins/accessibility.scss) instead of removing focus styles directly.

- Use `focusVisible` when a component needs custom `:focus-visible` behavior.
- Use `focusVisibleRing` for the standard tokenized focus ring.
- Use `buttonFocus` when you want the standard button treatment with clearer intent.

These mixins help keep a visible focus style for keyboard and assistive-technology users:

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

Breakpoint values are token-driven through `breakpoint.*`.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
