import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { themeShift } from '@themeshift/vite-plugin';

const cssGroups = [
  { label: 'Colors', match: (n: string) => n.startsWith('color-') },
  {
    label: 'Typography',
    match: (n: string) => n.startsWith('font-') || n.startsWith('typography-'),
  },
  {
    label: 'Accessibility',
    match: (n: string) =>
      n.startsWith('accessibility-') || n.startsWith('a11y-'),
  },
  {
    label: 'Layout',
    match: (n: string) => n.startsWith('grid-') || n.startsWith('layout-'),
  },
  { label: 'Border Radius', match: (n: string) => n.startsWith('radius-') },
  { label: 'Theme', match: (n: string) => n.startsWith('theme-') },
  {
    label: 'Components',
    match: (n: string) =>
      n.startsWith('component-') || n.startsWith('components-'),
  },
  { label: 'Other', match: () => true },
];
const isVitest = Boolean(process.env.VITEST);

// https://vite.dev/config/
export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    themeShift({
      cssVarPrefix: 'themeshift',
      watch: !isVitest,
      platforms: ['css', 'meta', 'scss'],
      groups: cssGroups,
      filters: {
        scss: {
          includePrefixes: [
            'radius-',
            'spacing-',
            'font-',
            'typography-',
            'layout-',
          ],
          excludePrefixes: ['theme-', 'components-'],
        },
      },
      defaultTheme: 'dark',
    }),
  ],
  build: {
    outDir: 'dist-app',
    emptyOutDir: true,
  },
});
