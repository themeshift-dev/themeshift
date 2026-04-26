import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/token.ts'],
      thresholds: {
        statements: 90,
        branches: 82,
        functions: 95,
        lines: 90,
      },
    },
  },
});
