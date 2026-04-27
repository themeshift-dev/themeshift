import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { themeShift } from '@themeshift/vite-plugin';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    // axe-core is lazy-loaded for docs accessibility checks.
    chunkSizeWarningLimit: 700,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@themeshift/ui/contexts': fileURLToPath(
        new URL('../../packages/ui/src/contexts/index.ts', import.meta.url)
      ),
      '@themeshift/ui/sass': fileURLToPath(
        new URL('../../packages/ui/dist/sass', import.meta.url)
      ),
    },
  },
  plugins: [
    react(),
    themeShift({
      extends: [
        {
          package: '@themeshift/ui',
          tokensGlob: 'tokens/**/*.json',
        },
      ],
      cssVarPrefix: 'themeshift',
    }),
  ],
});
