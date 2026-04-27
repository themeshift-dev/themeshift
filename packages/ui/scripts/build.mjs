import { spawn } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import * as sass from 'sass';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const isSilent = process.argv.includes('--silent');
const cssTypeDeclaration = 'declare const css: string;\nexport default css;\n';

async function run(command, args) {
  await new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: isSilent ? 'pipe' : 'inherit',
      shell: process.platform === 'win32',
    });

    if (isSilent) {
      child.stdout?.setEncoding('utf8');
      child.stderr?.setEncoding('utf8');
      child.stdout?.on('data', (chunk) => {
        stdout += chunk;
      });
      child.stderr?.on('data', (chunk) => {
        stderr += chunk;
      });
    }

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      if (isSilent) {
        if (stdout) {
          process.stdout.write(stdout);
        }
        if (stderr) {
          process.stderr.write(stderr);
        }
      }

      reject(
        new Error(`${command} ${args.join(' ')} exited with code ${code}`)
      );
    });

    child.on('error', reject);
  });
}

async function compileBaseCss() {
  const baseCssPath = path.join(rootDir, 'src/css/base.scss');
  const baseCssSource = await readFile(baseCssPath, 'utf8');
  const result = sass.compileString(
    `@use "@themeshift/vite-plugin/token-defaults" as _themeShiftTokenDefaults with ($theme-shift-default-css-var-prefix: "themeshift");\n${baseCssSource}`,
    {
      url: pathToFileURL(baseCssPath),
      loadPaths: [
        path.join(rootDir, 'src'),
        path.join(rootDir, 'node_modules'),
      ],
      style: 'expanded',
    }
  );

  await mkdir(path.join(distDir, 'css'), { recursive: true });
  await writeFile(path.join(distDir, 'css/base.css'), `${result.css}\n`);
}

async function writeCssTypeDeclarations() {
  const cssDir = path.join(distDir, 'css');
  const cssFiles = ['base.css', 'tokens.css'];

  await Promise.all(
    cssFiles.map((filename) =>
      writeFile(path.join(cssDir, `${filename}.d.ts`), cssTypeDeclaration)
    )
  );
}

async function copyThemeAssets() {
  await cp(path.join(rootDir, 'tokens'), path.join(distDir, 'tokens'), {
    recursive: true,
  });

  await mkdir(path.join(distDir, 'sass'), { recursive: true });
  await cp(path.join(rootDir, 'src/sass/mixins'), path.join(distDir, 'sass'), {
    recursive: true,
  });
  await cp(
    path.join(rootDir, 'src/css/tokens.css'),
    path.join(distDir, 'css/tokens.css')
  );
  await cp(
    path.join(rootDir, 'src/sass/mixins/typography.scss'),
    path.join(distDir, 'sass/typography.scss')
  );
  await cp(
    path.join(rootDir, 'src/sass/mixins/typography.scss'),
    path.join(distDir, 'sass/_typography.scss')
  );

  const contractPath = path.join(rootDir, 'theme-contract.json');
  const rawContract = await readFile(contractPath, 'utf8');
  const contract = JSON.parse(rawContract);

  await writeFile(
    path.join(distDir, 'theme-contract.json'),
    `${JSON.stringify(contract, null, 2)}\n`
  );
}

async function removeNonPublishedArtifacts() {
  await rm(path.join(distDir, 'entrypoints'), { recursive: true, force: true });
}

await rm(distDir, { recursive: true, force: true });

const viteArgs = [
  'exec',
  'vite',
  'build',
  '--config',
  'vite.config.components.ts',
];

if (isSilent) {
  viteArgs.push('--logLevel', 'silent');
}

await run('pnpm', viteArgs);
await run('pnpm', ['exec', 'tsc', '-p', 'tsconfig.build.json']);
await removeNonPublishedArtifacts();
await compileBaseCss();
await copyThemeAssets();
await writeCssTypeDeclarations();
