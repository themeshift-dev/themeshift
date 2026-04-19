# ThemeShift Monorepo

ThemeShift is now managed as a single monorepo so the Vite plugin, UI library, and docs app can evolve together without publishing intermediate npm versions.

## Status

### Plugin

![Build](https://github.com/themeshift-dev/themeshift/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/themeshift-dev/themeshift/graph/badge.svg?flag=vite-plugin-themeshift)
![npm](https://img.shields.io/npm/v/@themeshift/vite-plugin-themeshift)

### UI

![Build](https://github.com/themeshift-dev/themeshift/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/themeshift-dev/themeshift/graph/badge.svg?flag=ui)
![npm](https://img.shields.io/npm/v/@themeshift/ui)
![Components](https://img.shields.io/badge/components-22-blue.svg)

## Workspace layout

- `packages/vite-plugin-themeshift`: publishes `@themeshift/vite-plugin-themeshift`
- `packages/ui`: publishes `@themeshift/ui`
- `apps/ui-app`: private docs/tooling app deployed through Netlify

## Local development

```bash
pnpm install
pnpm dev:ui-app
```

Useful workspace commands:

```bash
pnpm build
pnpm build:ui
pnpm test:packages
pnpm lint
pnpm typecheck
```

## Releases and deploys

- Use [`BRANCHES.md`](./BRANCHES.md) for the development branch flow.
- Use [`RELEASES.md`](./RELEASES.md) for release-please and publishing details.
- Use [`COMPONENT_LIBRARY_AUDIT_CHECKLIST.md`](./COMPONENT_LIBRARY_AUDIT_CHECKLIST.md) when adding or updating UI components.
- Public packages in `packages/*` are versioned with release-please and published from GitHub Actions.
- `apps/*` stay private and are deployed through Netlify.
- `apps/ui-app` is configured to build from the monorepo root with `pnpm turbo run build --filter=@themeshift/ui-app...`.
- `@themeshift/ui` publishes fonts separately via `@themeshift/ui/css/fonts.css` so consumers can opt into the default Noto Sans assets or provide their own fonts.

## Open a PR

- Feature PR to `develop` (replace `YOUR_BRANCH`):  
  https://github.com/themeshift-dev/themeshift/compare/develop...YOUR_BRANCH?expand=1&template=feature.md
- Release PR `develop` -> `main`:  
  https://github.com/themeshift-dev/themeshift/compare/main...develop?expand=1&template=release.md

## README strategy

- Keep this root README focused on repository structure and contributor workflows.
- Keep package READMEs focused on installation and usage.
- Keep long-form guides and interactive examples in `apps/ui-app`.
