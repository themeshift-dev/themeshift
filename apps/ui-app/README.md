# ThemeShift UI App

`@themeshift/ui-app` is the private documentation and tooling app for the ThemeShift monorepo.

## Purpose

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

If you are already inside this workspace, `pnpm dev` still works.

## Deployment

- this app is private and is not published to npm
- Netlify is the primary deployment target
- Netlify should install from the repo root and build with `pnpm turbo run build --filter=@themeshift/ui-app...`

## Font model

`@themeshift/ui` now exposes fonts separately from its base styles:

- import `@themeshift/ui/css/fonts.css` to use the packaged default Noto Sans files
- omit that import if you want to provide your own font-face definitions
- keep `@themeshift/ui/css/base.css` and `@themeshift/ui/css/tokens.css` for the rest of the ThemeShift styling contract

## Token overrides

This app extends `@themeshift/ui` through `@themeshift/vite-plugin-themeshift`, so app-specific token files in [`tokens/`](./tokens) override the shared UI defaults without editing component styles.

The focus ring is customized this way in [`tokens/accessibility.json`](./tokens/accessibility.json), which lets the app keep the shared `:focus-visible` behavior from `@themeshift/ui` while changing the ring color to match the ThemeShift brand palette.
