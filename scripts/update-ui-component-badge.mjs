import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { syncUiComponentBadges } from './update-ui-component-badge.shared.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
const componentCount = await syncUiComponentBadges({ check, rootDir });

console.log(
  check
    ? `UI component badges are up to date: ${componentCount}`
    : `Updated UI component badges to ${componentCount}`
);
