import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { auditTokens } from '../src/audit';

const tempRoots: string[] = [];

async function createAuditWorkspace() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-audit-'));
  tempRoots.push(root);

  await fs.mkdir(path.join(root, 'apps', 'sandbox', 'src'), {
    recursive: true,
  });
  await fs.mkdir(path.join(root, 'packages', 'feature', 'src'), {
    recursive: true,
  });
  await fs.mkdir(path.join(root, 'packages', 'ui', 'src', 'design-tokens'), {
    recursive: true,
  });

  await fs.writeFile(
    path.join(root, 'packages', 'ui', 'src', 'design-tokens', 'token-paths.ts'),
    `
export const tokenPaths = [
  'color.brand.primary',
  'space.4',
  'layout.maxWidth',
] as const;
`.trim(),
    'utf8'
  );

  await fs.writeFile(
    path.join(
      root,
      'packages',
      'ui',
      'src',
      'design-tokens',
      'token-values.ts'
    ),
    `
export const tokenValues = {
  'color.brand.primary': '#005fcc',
  'space.4': '1rem',
  'layout.maxWidth': '1200px',
} as const;
`.trim(),
    'utf8'
  );

  await fs.writeFile(
    path.join(root, 'apps', 'sandbox', 'src', 'theme.ts'),
    `
const buttonColor = token('color.brand.primary');
const spacing = themeShift.token("space.4");
`.trim(),
    'utf8'
  );

  await fs.writeFile(
    path.join(root, 'packages', 'feature', 'src', 'styles.scss'),
    `
.card {
  color: var(--themeshift-color-brand-primary);
  padding: token('space.4');
}
`.trim(),
    'utf8'
  );

  await fs.writeFile(
    path.join(root, 'packages', 'feature', 'src', 'theme.json'),
    JSON.stringify({
      card: {
        maxWidth: '{layout.maxWidth}',
      },
    }),
    'utf8'
  );

  return root;
}

afterEach(async () => {
  await Promise.all(
    tempRoots
      .splice(0)
      .map((root) => fs.rm(root, { force: true, recursive: true }))
  );
});

describe('auditTokens', () => {
  it('scans workspace targets and writes a CSV report with usage counts', async () => {
    const root = await createAuditWorkspace();

    const result = await auditTokens({
      outputFile: 'token-audit.csv',
      root,
      target: 'all',
    });

    expect(result.scannedTargets).toEqual([
      'apps/sandbox',
      'packages/feature',
      'packages/ui',
    ]);

    const csv = await fs.readFile(result.outputFile, 'utf8');

    expect(csv).toContain(
      'tokenPath,value,usageCountJS,usageCountCSS,usageInJson,usageCountTotal'
    );
    expect(csv).toContain('color.brand.primary,#005fcc,1,1,0,2');
    expect(csv).toContain('space.4,1rem,1,1,0,2');
    expect(csv).toContain('layout.maxWidth,1200px,0,0,1,1');
  });

  it('supports explicit scanRoots and validates target selection', async () => {
    const root = await createAuditWorkspace();

    await expect(
      auditTokens({
        root,
        scanRoots: ['apps/sandbox'],
        target: 'packages/feature',
      })
    ).rejects.toThrow('Invalid target "packages/feature"');
  });

  it('fails when the token path manifest cannot be parsed', async () => {
    const root = await createAuditWorkspace();

    await fs.writeFile(
      path.join(
        root,
        'packages',
        'ui',
        'src',
        'design-tokens',
        'token-paths.ts'
      ),
      'export const other = [] as const;',
      'utf8'
    );

    await expect(
      auditTokens({
        root,
      })
    ).rejects.toThrow('Could not find "tokenPaths"');
  });
});
