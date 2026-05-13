import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
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
  test: {
    css: true,
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/design-tokens/**',
        'src/css/tokens.css',
        'src/sass/_tokens.static.scss',
      ],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
