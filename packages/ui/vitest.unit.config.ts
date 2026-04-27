import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: [
          'src/components/**/*.tsx',
          'src/templates/**/*.tsx',
          'src/hooks/**/*.ts',
        ],
        exclude: [
          'src/components/**/*.stories.tsx',
          'src/components/**/*.test.tsx',
          'src/hooks/**/*.meta.ts',
          'src/hooks/**/*.test.ts',
          'src/hooks/**/*.test.tsx',
          'src/hooks/index.ts',
          'src/templates/**/*.test.tsx',
        ],
        thresholds: {
          statements: 90,
          branches: 85,
          functions: 92,
          lines: 90,
        },
      },
    },
  })
);
