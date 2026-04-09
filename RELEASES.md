# Releases

This file explains how to publish packages from the ThemeShift monorepo.

## What gets released

This repo has two public npm packages:

- `@themeshift/ui`
- `@themeshift/vite-plugin-themeshift`

This repo also has one private app:

- `@themeshift/ui-app`

`@themeshift/ui-app` does not publish to npm, but it does share version numbers with `@themeshift/ui`.

That is controlled in [.changeset/config.json](/Users/hutch/Web/@themeshift/.changeset/config.json):

```json
"fixed": [["@themeshift/ui", "@themeshift/ui-app"]]
```

This means:

- `@themeshift/ui` and `@themeshift/ui-app` always get the same version number
- `@themeshift/ui-app` stays private
- `@themeshift/vite-plugin-themeshift` can version independently

## Before release

Make sure these things are ready:

- Your npm user or org has permission to publish `@themeshift/ui`
- Your npm user or org has permission to publish `@themeshift/vite-plugin-themeshift`
- CI is passing on `main`

Useful checks:

```bash
pnpm release:preflight
```

## How releases work in this repo

Releases are handled by Changesets and GitHub Actions.

The release workflow lives in [.github/workflows/release.yml](/Users/hutch/Web/@themeshift/.github/workflows/release.yml).

When you push to `main`, the workflow:

1. Installs dependencies
2. Runs `pnpm build`
3. Runs `changesets/action`

That action does one of two things:

1. If there are unreleased changesets, it opens or updates a Release PR
2. If the Release PR has already been merged, it publishes the versioned packages to npm

## Normal release flow

This is the standard workflow for a new release.

### 1. Create a changeset

Run:

```bash
pnpm changeset
```

Changesets will ask which packages changed and what type of bump they need.

For example:

- `patch` for bug fixes and small improvements
- `minor` for backward-compatible features
- `major` for breaking changes

Because `@themeshift/ui` and `@themeshift/ui-app` are fixed together, selecting `@themeshift/ui` will keep those versions aligned.

### 2. Commit the changeset

Changesets creates a new markdown file in `.changeset/`.

Commit it with your code changes:

```bash
git add .
git commit -m "Add release changeset"
```

### 3. Push to `main`

Push your branch and merge it to `main`, or push directly if that is your workflow.

Once the changeset reaches `main`, the Release workflow will open or update a Release PR.

### 4. Review the Release PR

The Release PR usually includes:

- version bumps in package manifests
- changelog updates

Check that:

- `@themeshift/ui` has the expected new version
- `@themeshift/ui-app` matches the `ui` version
- `@themeshift/vite-plugin-themeshift` only changes if it was included in the changeset

### 5. Merge the Release PR

When you merge the Release PR, GitHub Actions runs the release workflow again.

This time Changesets publishes the versioned public packages to npm.

## Publishing from your machine

The repo includes a local publish command:

```bash
pnpm release
```

That runs:

```bash
changeset publish
```

In this repo, the normal and safer path is to let GitHub Actions publish from `main` instead of publishing manually from a local machine.

## Useful commands

Create a changeset:

```bash
pnpm changeset
```

Apply version bumps locally:

```bash
pnpm version
```

Run the release preflight checks:

```bash
pnpm release:preflight
```

Run the same checks with full command output:

```bash
pnpm release:preflight:verbose
```

Publish locally:

```bash
pnpm release
```

Run the main validation pipeline:

```bash
pnpm ci:validate
```

Build everything:

```bash
pnpm build
```

## Notes for maintainers

- `workspace:*` dependencies are correct in this monorepo. They should not be replaced with hard-coded package versions for local workspace links.
- `@themeshift/ui-app` is private, so it will not publish to npm even though its version changes.
- `@themeshift/vite-plugin-themeshift` is not fixed to `@themeshift/ui`, so it can release on its own schedule.
- If there is no new changeset file, the release workflow has nothing new to publish.

## Troubleshooting

### The release workflow does not open a Release PR

Check:

- the changeset file was committed
- the change reached `main`
- GitHub Actions is enabled

### The Release PR opens, but npm publish does not happen

Check:

- `NPM_TOKEN` exists in GitHub secrets
- the Release PR was merged
- the package names and npm access are correct

### Versions look wrong in the Release PR

Check:

- which packages were selected when you ran `pnpm changeset`
- whether the package is part of a `fixed` group in `.changeset/config.json`
