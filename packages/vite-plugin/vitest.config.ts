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
        'src/colorExpressions.ts',
        'src/cssVar.ts',
        'src/sd.ts',
        'src/token.ts',
      ],
      thresholds: {
        statements: 89,
        branches: 80,
        functions: 97,
        lines: 90,
      },
    },
  },
});
