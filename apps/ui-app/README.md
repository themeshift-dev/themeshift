# ThemeShift UI App

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://github.com/themeshift-dev/themeshift/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/themeshift-dev/themeshift/graph/badge.svg)
![npm](https://img.shields.io/badge/npm-private-lightgrey.svg)

`@themeshift/ui-app` is the private documentation and tooling app for the ThemeShift monorepo.

It is the main place to test `@themeshift/ui` and `@themeshift/vite-plugin-themeshift` together before publishing.

## What it is for

- document `@themeshift/ui`
- demonstrate token customization powered by `@themeshift/vite-plugin-themeshift`
- demonstrate the optional `@themeshift/ui/css/fonts.css` import and font customization path
- provide an integration target for local workspace changes before publishing packages

## Local development

Run the app from the repo root:

```bash
pnpm install
pnpm dev:ui-app
```

If you are already working in the repo, `pnpm dev` also works.

## Deployment

- this app is private and is not published to npm
- Netlify is the primary deployment target
- Netlify should install from the repo root and build with `pnpm turbo run build --filter=@themeshift/ui-app...`

## Font model

`@themeshift/ui` ships fonts separately from its base styles:

- import `@themeshift/ui/css/fonts.css` to use the packaged default Noto Sans files
- omit that import if you want to provide your own font-face definitions
- keep `@themeshift/ui/css/base.css` and `@themeshift/ui/css/tokens.css` for the rest of the ThemeShift styling contract

Simple example:

```ts
import '@themeshift/ui/css/fonts.css';
import '@themeshift/ui/css/base.css';
import '@themeshift/ui/css/tokens.css';
```

## Token overrides

This app extends `@themeshift/ui` through `@themeshift/vite-plugin-themeshift`, so token files in [`tokens/`](./tokens) can override the shared UI defaults without editing component styles.

Example:

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

The focus ring is customized this way in [`tokens/accessibility.json`](./tokens/accessibility.json). That lets the app keep the shared `:focus-visible` behavior from `@themeshift/ui` while changing the ring color to fit the ThemeShift brand palette.
