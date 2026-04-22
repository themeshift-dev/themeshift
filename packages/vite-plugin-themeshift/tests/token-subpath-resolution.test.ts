import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);

function getViteBinPath(packageRoot: string) {
  const vitePackageJsonPath = require.resolve('vite/package.json', {
    paths: [packageRoot],
  });
  const vitePackageJson = JSON.parse(
    require('node:fs').readFileSync(vitePackageJsonPath, 'utf8')
  ) as { bin: { vite: string } };

  return path.join(path.dirname(vitePackageJsonPath), vitePackageJson.bin.vite);
}

describe('token subpath resolution', () => {
  const tempRoots: string[] = [];

  afterEach(async () => {
    await Promise.all(
      tempRoots
        .splice(0)
        .map((root) => fs.rm(root, { recursive: true, force: true }))
    );
  });

  it('works in a Vite consumer app without a custom Sass importer', async () => {
    const tempRoot = await fs.mkdtemp(
      path.join(os.tmpdir(), 'themeshift-vite-consumer-')
    );
    tempRoots.push(tempRoot);

    const packageRoot = process.cwd();
    const packageDir = path.join(
      tempRoot,
      'node_modules',
      '@themeshift',
      'vite-plugin-themeshift'
    );
    const tempPackageDist = path.join(packageDir, 'dist');

    await fs.mkdir(path.dirname(packageDir), { recursive: true });
    await fs.mkdir(path.join(tempRoot, 'node_modules'), { recursive: true });
    await fs.mkdir(path.join(tempRoot, 'src'), { recursive: true });
    await fs.mkdir(tempPackageDist, { recursive: true });
    await fs.symlink(
      path.join(packageRoot, 'playground', 'node_modules', 'sass'),
      path.join(tempRoot, 'node_modules', 'sass'),
      'dir'
    );
    await fs.writeFile(
      path.join(packageDir, 'package.json'),
      JSON.stringify(
        {
          name: '@themeshift/vite-plugin-themeshift',
          type: 'module',
          exports: {
            './token': {
              sass: './dist/token.scss',
              types: './dist/token.d.ts',
              import: './dist/token.js',
            },
            './_token': {
              sass: './dist/token.scss',
            },
            './token-defaults': {
              sass: './dist/token-defaults.scss',
            },
            './_token-defaults': {
              sass: './dist/token-defaults.scss',
            },
          },
        },
        null,
        2
      )
    );
    await fs.copyFile(
      path.join(packageRoot, 'src', 'token.scss'),
      path.join(tempPackageDist, 'token.scss')
    );
    await fs.copyFile(
      path.join(packageRoot, 'src', 'token-defaults.scss'),
      path.join(tempPackageDist, 'token-defaults.scss')
    );
    await fs.writeFile(path.join(tempPackageDist, 'token.js'), 'export {};');
    await fs.writeFile(path.join(tempPackageDist, 'token.d.ts'), 'export {};');

    await fs.writeFile(
      path.join(tempRoot, 'index.html'),
      '<!doctype html><html><body><script type="module" src="/src/main.js"></script></body></html>'
    );
    await fs.writeFile(
      path.join(tempRoot, 'src', 'main.js'),
      "import './style.scss';\n"
    );
    await fs.writeFile(
      path.join(tempRoot, 'src', 'style.scss'),
      `@use '@themeshift/vite-plugin-themeshift/token' as themeShift;

.test {
  color: themeShift.token('text.primary', 'themeshift');
}
`
    );

    await expect(
      execFileAsync(process.execPath, [getViteBinPath(packageRoot), 'build'], {
        cwd: tempRoot,
      })
    ).resolves.toMatchObject({
      stderr: expect.not.stringContaining("Can't find stylesheet to import"),
    });
  });

  it('works in a Node consumer app through the JS token subpath export', async () => {
    const tempRoot = await fs.mkdtemp(
      path.join(os.tmpdir(), 'themeshift-node-consumer-')
    );
    tempRoots.push(tempRoot);

    const packageRoot = process.cwd();
    const packageDir = path.join(
      tempRoot,
      'node_modules',
      '@themeshift',
      'vite-plugin-themeshift'
    );
    const tempPackageDist = path.join(packageDir, 'dist');

    await fs.mkdir(path.dirname(packageDir), { recursive: true });
    await fs.mkdir(path.join(tempRoot, 'node_modules'), { recursive: true });
    await fs.writeFile(
      path.join(tempRoot, 'package.json'),
      JSON.stringify({ type: 'module' }, null, 2)
    );
    await fs.mkdir(packageDir, { recursive: true });
    await fs.cp(path.join(packageRoot, 'dist'), tempPackageDist, {
      recursive: true,
    });
    await fs.writeFile(
      path.join(packageDir, 'package.json'),
      JSON.stringify(
        {
          name: '@themeshift/vite-plugin-themeshift',
          type: 'module',
          exports: {
            './token': {
              sass: './dist/token.scss',
              types: './dist/token.d.ts',
              import: './dist/token.js',
            },
          },
        },
        null,
        2
      )
    );
    await fs.writeFile(
      path.join(tempRoot, 'index.mjs'),
      `import { tokenValue } from '@themeshift/vite-plugin-themeshift/token';

console.log(
  tokenValue('text.primary', {
    values: { 'text.primary': '#0f172a' },
  })
);
`
    );

    await expect(
      execFileAsync(process.execPath, ['index.mjs'], {
        cwd: tempRoot,
      })
    ).resolves.toMatchObject({
      stdout: '#0f172a\n',
    });
  });

  it('publishes the token subpath contract for JS and Sass', async () => {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8')
    );
    const rootTokenScss = await fs.readFile(
      path.join(process.cwd(), 'token.scss'),
      'utf8'
    );
    const rootTokenDefaultsScss = await fs.readFile(
      path.join(process.cwd(), 'token-defaults.scss'),
      'utf8'
    );
    const sourceTokenScss = await fs.readFile(
      path.join(process.cwd(), 'src', 'token.scss'),
      'utf8'
    );
    const sourceTokenDefaultsScss = await fs.readFile(
      path.join(process.cwd(), 'src', 'token-defaults.scss'),
      'utf8'
    );

    expect(packageJson.exports['./token']).toEqual({
      sass: './dist/token.scss',
      types: './dist/token.d.ts',
      import: './dist/token.js',
    });
    expect(packageJson.exports['./_token']).toEqual({
      sass: './dist/token.scss',
    });
    expect(packageJson.exports['./token-defaults']).toEqual({
      sass: './dist/token-defaults.scss',
    });
    expect(packageJson.exports['./_token-defaults']).toEqual({
      sass: './dist/token-defaults.scss',
    });
    expect(packageJson.files).toContain('token.scss');
    expect(packageJson.files).toContain('token-defaults.scss');
    expect(rootTokenScss).toBe(sourceTokenScss);
    expect(rootTokenDefaultsScss).toBe(sourceTokenDefaultsScss);
  });
});
