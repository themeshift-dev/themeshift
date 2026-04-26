# @themeshift/next

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://github.com/themeshift-dev/themeshift/actions/workflows/ci.yml/badge.svg)
![npm](https://img.shields.io/npm/v/@themeshift/next)

ThemeShift wrapper for Next.js apps.

`@themeshift/next` runs ThemeShift token builds for `next build` and starts token
watch mode during `next dev`, while preserving your existing Next config.

## Install

```bash
npm install --save-dev @themeshift/next sass
```

## Quick start

```ts
import { withThemeShift } from '@themeshift/next';

export default withThemeShift(
  {
    reactStrictMode: true,
  },
  {
    cssVarPrefix: 'themeshift',
  }
);
```

Curried form is also supported:

```ts
import { withThemeShift } from '@themeshift/next';

const withTokens = withThemeShift({ cssVarPrefix: 'themeshift' });

export default withTokens({ reactStrictMode: true });
```

## What it adds

- Runs a token build in `next build`
- Starts token watch mode in `next dev` (webpack and Turbopack)
- Injects a global Sass `token()` helper through `sassOptions.additionalData`
- Keeps your existing `webpack` and `sassOptions` behavior intact

## Token helpers

Import token helpers from `@themeshift/next/token`:

```ts
import { token, tokenValue } from '@themeshift/next/token';
```

Import Sass helper module:

```scss
@use '@themeshift/next/token' as themeShift;

.button {
  color: themeShift.token('text.primary');
}
```

## ThemeShift options

The second argument takes `@themeshift/core` options such as:

- `extends`
- `cssVarPrefix`
- `defaultTheme`
- `filters`
- `outputComments`

## License

MIT
