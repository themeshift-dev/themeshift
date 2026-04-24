# PageShell

For general public-facing or standard pages. `PageShell` is intentionally plain.

## Use it for:

- marketing pages
- docs pages
- blog/article pages
- simple app pages without heavy persistent UI

## Do not use it for:

- dense authenticated workspace layouts
- multi-region app chrome with persistent navigation rails
- application sidebar orchestration

Use `AppShell` for those cases.

## Typical structure:

- skip link
- header
- optional nav
- main
- optional aside
- footer

`PageShell` supports page-level `navigation` and complementary `aside`.
Persistent `sidebar` behavior belongs in `AppShell`.

The skip link renders by default and can be disabled with `showSkipLink` when
the page is embedded in a larger shell that already provides bypass navigation.

## What it solves:

- standard page chrome
- consistent landmarks
- content width control

This is probably your most generic shell.
