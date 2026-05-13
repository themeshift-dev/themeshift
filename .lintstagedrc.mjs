export default {
  '*.{css,js,json,jsx,md,scss,ts,tsx}': ['pnpm format --'],
  '*': ['pnpm precommit:ui-app-coverage'],
};
