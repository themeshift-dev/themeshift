# @themeshift/vite-plugin-themeshift

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://github.com/themeshift-dev/themeshift/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/themeshift-dev/themeshift/graph/badge.svg?flag=vite-plugin-themeshift)
![npm](https://img.shields.io/npm/v/@themeshift/vite-plugin-themeshift)

ThemeShift is a Vite plugin that makes working with Style Dictionary easy as pie 🥧

It watches your token files, rebuilds generated outputs, and gives you a simple `token()` helper for Sass. It can also start from tokens published by a UI package and layer app-level overrides on top.

This package lives inside the ThemeShift monorepo. Use the repo root for local development and `apps/ui-app` to test the full flow with `@themeshift/ui`.

## What it does

- Watches `tokens/**/*.json`
- Builds CSS variables, Sass tokens, and token manifests
- Supports `light`, `dark`, and optional `print` themes
- Injects a global Sass `token()` helper
- Ships a standalone Sass and JavaScript `token` module
- Lets apps extend tokens from installed packages such as `@themeshift/ui`

## Quick start

Install the package and the tools it needs:

```bash
npm install --save-dev @themeshift/vite-plugin-themeshift style-dictionary sass
```

Add the plugin to `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { themeShift } from '@themeshift/vite-plugin-themeshift';

export default defineConfig({
  plugins: [react(), themeShift()],
});
```

Create `tokens/theme.json`:

```json
{
  "theme": {
    "text": {
      "base": { "$value": "#0f172a" }
    }
  }
}
```

Import the generated CSS:

```ts
import './css/tokens.css';
```

By default, ThemeShift writes:

- `src/css/tokens.css`
- `src/sass/_tokens.static.scss`
- `src/design-tokens/token-paths.{json,ts}`
- `src/design-tokens/token-values.{json,ts}`

## Common Sass usage

ThemeShift injects a global `token()` helper by default, so this works in app styles:

```scss
.button {
  color: token('theme.text.base');
}
```

If you prefer an explicit import, use the published Sass module:

```scss
@use '@themeshift/vite-plugin-themeshift/token' as themeShift;

.button {
  color: themeShift.token('theme.text.base');
}
```

If you use `cssVarPrefix`, you can pass it per call:

```scss
@use '@themeshift/vite-plugin-themeshift/token' as themeShift;

.button {
  color: themeShift.token('components.button.font', 'themeshift');
}
```

For shared mixins and partials, prefer the namespaced import:

```scss
@use '@themeshift/vite-plugin-themeshift/token' as themeShift;

@mixin text-style($path) {
  font: themeShift.token('typography.styles.#{$path}.font');
}
```

## JavaScript helpers

ThemeShift ships a JavaScript helper on the same `./token` path.

Use `token()` to read the current CSS variable value in the browser:

```ts
import { token } from '@themeshift/vite-plugin-themeshift/token';

const textColor = token('theme.text.base', { prefix: 'themeshift' });
```

Use `tokenValue()` to read a value from the generated token manifest:

```ts
import { tokenValue } from '@themeshift/vite-plugin-themeshift/token';
import { tokenValues } from './design-tokens/token-values';

const titleStyle = tokenValue('text.style.title', { values: tokenValues });
```

## Color functions

ThemeShift also provides functions for modifying colours.

Supported functions:

- `mix(color1, color2, amount)`
- `lighten(color, amount)`
- `darken(color, amount)`
- `alpha(color, amount)`

Example:

```json
{
  "components": {
    "button": {
      "light": {
        "intents": {
          "primary": {
            "bg": { "$value": "{color.blue.400}" },
            "hover": { "$value": "lighten({color.blue.300}, 0.1)" },
            "pressed": { "$value": "darken({color.blue.500}, 0.1)" }
          }
        }
      }
    }
  }
}
```

`amount` must be between `0` and `1`.

## Hybrid token nodes

ThemeShift supports token nodes with both a main value and nested child token values. This is useful for state tokens such as `bg.hover` and `fg.disabled`.

Example:

```json
{
  "components": {
    "button": {
      "light": {
        "intents": {
          "primary": {
            "bg": {
              "$value": "{color.blue.400}",
              "hover": { "$value": "{color.blue.300}" },
              "disabled": { "$value": "alpha({color.blue.300}, 0.3)" }
            },
            "fg": {
              "$value": "{color.blue.400.fg}",
              "disabled": { "$value": "alpha({color.blue.400.fg}, 0.5)" }
            }
          }
        }
      }
    }
  }
}
```

This gives you token paths like:

- `components.button.light.intents.primary.bg`
- `components.button.light.intents.primary.bg.hover`
- `components.button.light.intents.primary.fg`
- `components.button.light.intents.primary.fg.disabled`

## Theme modes

To support theme modes, split your token files by theme:

`tokens/theme.light.json`

```json
{
  "theme": {
    "light": {
      "text": {
        "base": { "$value": "#0f172a" }
      },
      "surface": {
        "base": { "$value": "#ecf0f1" }
      }
    }
  }
}
```

`tokens/theme.dark.json`

```json
{
  "theme": {
    "dark": {
      "text": {
        "base": { "$value": "#e2e8f0" }
      },
      "surface": {
        "base": { "$value": "#2c3e50" }
      }
    }
  }
}
```

Then set `data-theme` on the document root:

```html
<html lang="en" data-theme="dark">
  ...
</html>
```

## Plugin options

These are the options most apps use.

### `extends`

Use `extends` to load token files from an installed package before local tokens. Local files still win.

Simple example:

```ts
themeShift({
  extends: ['@themeshift/ui'],
  cssVarPrefix: 'themeshift',
});
```

Explicit package config:

```ts
themeShift({
  extends: [
    {
      package: '@themeshift/ui',
      tokensGlob: 'dist/tokens/**/*.json',
    },
  ],
});
```

### `cssVarPrefix`

Use `cssVarPrefix` to prefix generated CSS variables.

```ts
themeShift({
  cssVarPrefix: 'themeshift',
});
```

This changes:

- `--components-button-font`
- to `--themeshift-components-button-font`

### `groups`

Use `groups` to control comment sections in generated `tokens.css`.

```ts
themeShift({
  groups: [
    { label: 'Colors', match: (name) => name.startsWith('color-') },
    { label: 'Theme', match: (name) => name.startsWith('theme-') },
    { label: 'Components', match: (name) => name.startsWith('components-') },
    { label: 'Other', match: () => true },
  ],
});
```

### `defaultTheme`

Use `defaultTheme` when you want one theme copied into plain `:root` as a fallback.

```ts
themeShift({
  defaultTheme: 'light',
});
```

### `outputPrintTheme`

Set `outputPrintTheme: true` if you want print theme output.

```ts
themeShift({
  outputPrintTheme: true,
});
```

### `outputComments`

Set `outputComments: true` to include token descriptions in generated CSS and Sass.

```ts
themeShift({
  outputComments: true,
});
```

Example token:

```json
{
  "space": {
    "4": {
      "$value": "1rem",
      "$description": "16px"
    }
  }
}
```

### `filters`

Use `filters` to choose which tokens are written to each output.

```ts
themeShift({
  filters: {
    scss: {
      includePrefixes: ['radius-', 'spacing-', 'font-', 'text-', 'layout-'],
      excludePrefixes: ['theme-', 'components-'],
    },
  },
});
```

You can also use a function:

```ts
themeShift({
  filters: {
    scss: (token) => !token.attributes?.theme,
  },
});
```

### `reloadStrategy`

Use `reloadStrategy: 'full'` if you want a full page reload instead of HMR when token files change.

```ts
themeShift({
  reloadStrategy: 'full',
});
```

### `log`

Use `log` to show or hide Style Dictionary output.

Show warnings:

```ts
themeShift({
  log: { warnings: 'warn' },
});
```

Keep output quiet:

```ts
themeShift({
  log: { verbosity: 'silent', warnings: 'disabled' },
});
```

## Playground

This repo includes a small playground in `playground/`.

```bash
npm install
npm -C playground install
npm run playground
```

## Development

Run the package in watch mode:

```bash
npm run dev
```

Build the package:

```bash
npm run build
```

## License

MIT
