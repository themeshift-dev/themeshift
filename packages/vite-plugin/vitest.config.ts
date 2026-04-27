import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        'src/token.ts',
        'src/colorExpressions.ts',
        'src/cssVar.ts',
        'src/sd.ts',
      ],
      thresholds: {
        statements: 95,
        branches: 88,
        functions: 98,
        lines: 95,
      },
    },
  },
});
