# ThemeShift UI Demo App

`@themeshift/ui-demo` is a private Next.js demo app used to showcase live,
interactive `@themeshift/ui` experiences as a trust signal for developers.

## Purpose

- Host realistic UI demo routes under `demo.themeshift.dev`
- Validate `@themeshift/ui` + `@themeshift/next` integration in a Next.js app
- Provide a stable place for future scenario pages such as
  `/team-dashboard` and `/settings`

## Routing strategy

This app uses the built-in Next.js filesystem routing.

Current route coverage:

- `/` simple "Hello world" landing page

Planned additions:

- `/team-dashboard`
- `/settings`

## Local development

Run from the monorepo root:

```bash
pnpm install
pnpm dev:ui-demo
```

This root script prebuilds required ThemeShift workspace packages before
starting the Next.js dev server.
