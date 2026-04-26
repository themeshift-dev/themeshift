# Releases

This repo releases public packages with release-please and GitHub Actions.

## What gets released

This repo has four public npm packages:

- `@themeshift/cli`
- `@themeshift/core`
- `@themeshift/ui`
- `@themeshift/vite-plugin`

The private docs app, `@themeshift/ui-app`, is not versioned by release automation and does not publish to npm. App deployments track the commit deployed from `main`.

## Branch flow

Use this flow for normal work:

```text
feature branch -> develop -> main -> release-please PR -> publish/deploy
```

Feature branches target `develop`. When a batch of work is ready for production, open a normal PR from `develop` into `main`.

After that PR merges, the Release workflow runs release-please on `main`. Release-please opens or updates a release PR with package version bumps and changelog entries. Merging the release PR creates GitHub releases and publishes only the packages that changed.

## Branch names and PR titles

Feature branches into `develop` must use one of these forms:

```text
feat/TS-123-button-loading-state
fix/TS-124-skiplink-css
```

The accepted pattern is:

```text
^(feat|fix)/[A-Z]+-[0-9]+-[a-z0-9][a-z0-9-]*$
```

PR titles into `develop` must use Conventional Commit syntax because squash merge commit titles become release-please input.

Examples:

```text
fix(ui): hide SkipLink until focused
feat(ui): add loading state to Button
feat(vite-plugin): support token defaults
feat(ui)!: change Button variant API
```

Release-please treats:

- `fix:` as a patch release
- `feat:` as a minor release
- `!` or `BREAKING CHANGE:` as a major release

## Before release

Make sure these things are ready:

- npm trusted publishing is enabled for `@themeshift/cli`
- npm trusted publishing is enabled for `@themeshift/core`
- npm trusted publishing is enabled for `@themeshift/ui`
- npm trusted publishing is enabled for `@themeshift/vite-plugin`
- both npm packages trust the GitHub Actions workflow named `release.yml`
- the repo secret `AUTOMATION_TOKEN` is set to a PAT that can create release PRs and releases
- CI is passing on the release PR and on `develop`

Useful checks:

```bash
pnpm release:preflight
```

## Useful commands

Run the release preflight checks:

```bash
pnpm release:preflight
```

Run the same checks with full command output:

```bash
pnpm release:preflight:verbose
```

Run the main validation pipeline:

```bash
pnpm ci:validate
```

Build everything:

```bash
pnpm build
```

Check generated README badges:

```bash
pnpm docs:check-badges
```

Update generated README badges:

```bash
pnpm docs:update-badges
```

## Troubleshooting

### Release-please does not open a release PR

Check:

- the change was merged into `main`
- the squash commit title uses Conventional Commit syntax
- the change affected a configured release package
- GitHub Actions is enabled
- `AUTOMATION_TOKEN` is valid

### The release PR opens, but npm publish does not happen

Check:

- the release PR was merged
- release-please created a GitHub release for the changed package
- npm trusted publishing is enabled for each public package
- each npm package trusts `themeshift-dev/themeshift` and the `release.yml` workflow filename
- the package names and npm access are correct

### Versions look wrong in the release PR

Check:

- the squash commit title uses `fix:`, `feat:`, or `!` correctly
- the package path is listed in `release-please-config.json`
- the current version is listed in `.release-please-manifest.json`
