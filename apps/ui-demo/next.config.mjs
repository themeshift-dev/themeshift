import { withThemeShift } from '@themeshift/next';

export default withThemeShift(
  {
    reactStrictMode: true,
  },
  {
    cssVarPrefix: 'themeshift',
    extends: ['@themeshift/ui'],
  }
);
