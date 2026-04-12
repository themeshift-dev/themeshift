# Branching

This repo uses `develop` as the integration branch and `main` as the production release branch.

Normal work flows like this:

```text
feature branch -> develop -> main -> release-please PR -> publish/deploy
```

Feature branches merge into `develop`. When the current batch of work is ready to ship, `develop` is merged into `main`. After that, release-please opens or updates a release PR on `main`.

## Check out `develop`

For a fresh clone, install dependencies and check out `develop`:

```bash
git clone git@github.com:themeshift-dev/themeshift.git
cd themeshift
git fetch origin
git checkout develop
pnpm install
```

If you already have the repo locally:

```bash
git fetch origin
git checkout develop
git pull --ff-only origin develop
pnpm install
```

## Create a branch

Create feature and fix branches from `develop`:

```bash
git checkout develop
git pull --ff-only origin develop
git checkout -b feat/TS-123-button-loading-state
```

Use `feat/` for new features:

```bash
git checkout -b feat/TS-123-button-loading-state
```

Use `fix/` for bug fixes:

```bash
git checkout -b fix/TS-124-skiplink-css
```

Branch names must match:

```text
^(feat|fix)/[A-Z]+-[0-9]+-[a-z0-9][a-z0-9-]*$
```

The ticket number goes immediately after `feat/` or `fix/`:

```text
feat/TS-123-short-description
fix/ABC-42-short-description
```

Do not use `fix!` or `feat!` in branch names. Breaking changes are marked in the PR title or squash commit title instead:

```text
feat(ui)!: change Button variant API
```

## Commit your work

Commit messages can be simple while you are working locally:

```bash
git add .
git commit -m "Build Button loading state"
```

Before opening the PR, make sure the PR title uses Conventional Commit syntax. The PR title matters because feature PRs should be squash-merged into `develop`, and release-please reads the squash commit title later.

Good PR titles:

```text
feat(ui): add Button loading state
fix(ui): hide SkipLink until focused
feat(vite-plugin): support token defaults
feat(ui)!: change Button variant API
```

Release-please treats:

- `fix:` as a patch release
- `feat:` as a minor release
- `!` as a breaking change and major release

## Push and open a PR

Push your branch:

```bash
git push -u origin feat/TS-123-button-loading-state
```

Open a PR into `develop`:

```bash
gh pr create \
  --base develop \
  --head feat/TS-123-button-loading-state \
  --title "feat(ui): add Button loading state" \
  --body "Adds a loading state to the Button component."
```

For a fix:

```bash
git push -u origin fix/TS-124-skiplink-css

gh pr create \
  --base develop \
  --head fix/TS-124-skiplink-css \
  --title "fix(ui): hide SkipLink until focused" \
  --body "Restores the expected SkipLink production styles."
```

CI checks the branch name and PR title for PRs targeting `develop`.

## Merge into `develop`

When the PR is approved and CI passes, squash-merge it into `develop`.

The squash commit title should match the PR title:

```text
feat(ui): add Button loading state
```

After merge, update your local `develop` branch:

```bash
git checkout develop
git pull --ff-only origin develop
```

## Ship to production

When the current batch of `develop` work is ready, open a PR from `develop` into `main`:

```bash
gh pr create \
  --base main \
  --head develop \
  --title "chore: merge develop into main" \
  --body "Promotes the current develop branch to main."
```

After that PR merges, release-please runs on `main` and opens or updates a release PR. Continue with the release process in [RELEASES.md](./RELEASES.md).
