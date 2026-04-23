import { afterEach, describe, expect, it, vi } from 'vitest';

import { runAudit } from '../src/commands/audit';
import { runBuild } from '../src/commands/build';

const coreMocks = vi.hoisted(() => {
  return {
    auditTokens: vi.fn(async () => ({
      outputFile: '/tmp/token-audit.csv',
      scannedTargets: ['apps/ui-app'],
      tokenCount: 1,
    })),
    buildTokens: vi.fn(async () => ({
      changedFiles: undefined,
      durationMs: 42,
      endedAt: 2,
      startedAt: 1,
      writtenFiles: ['/tmp/src/css/tokens.css'],
    })),
  };
});

vi.mock('@themeshift/core', () => ({
  auditTokens: coreMocks.auditTokens,
  buildTokens: coreMocks.buildTokens,
}));

const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

afterEach(() => {
  coreMocks.auditTokens.mockClear();
  coreMocks.buildTokens.mockClear();
  logSpy.mockClear();
});

describe('commands', () => {
  it('runs build command against core', async () => {
    await runBuild({ cwd: '/tmp' });

    expect(coreMocks.buildTokens).toHaveBeenCalledWith(
      expect.objectContaining({ root: '/tmp' })
    );
  });

  it('runs audit command against core', async () => {
    await runAudit({ cwd: '/tmp', target: 'apps/ui-app' });

    expect(coreMocks.auditTokens).toHaveBeenCalledWith(
      expect.objectContaining({ root: '/tmp', target: 'apps/ui-app' })
    );
  });
});
