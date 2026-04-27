import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

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
    watchTokens: vi.fn(async () => ({
      close: vi.fn(async () => {}),
    })),
  };
});

vi.mock('@themeshift/core', () => ({
  auditTokens: coreMocks.auditTokens,
  buildTokens: coreMocks.buildTokens,
  watchTokens: coreMocks.watchTokens,
}));

const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

afterEach(() => {
  coreMocks.auditTokens.mockClear();
  coreMocks.buildTokens.mockClear();
  coreMocks.watchTokens.mockClear();
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

  it('prints relative config path in build output when a config file is provided', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-cli-'));

    try {
      await fs.writeFile(
        path.join(cwd, 'themeshift.config.js'),
        `export default { cssVarPrefix: 'themeshift' };`,
        'utf8'
      );

      await runBuild({ configPath: 'themeshift.config.js', cwd });

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('themeshift.config.js')
      );
    } finally {
      await fs.rm(cwd, { recursive: true, force: true });
    }
  });
});
