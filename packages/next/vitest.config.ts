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
        statements: 85,
        branches: 70,
        functions: 92,
        lines: 85,
      },
    },
  },
});
