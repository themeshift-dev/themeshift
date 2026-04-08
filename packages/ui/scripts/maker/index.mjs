import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import prompts from 'prompts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const templatesDir = path.join(__dirname, 'templates');

const mode = process.argv[2];

const MODE_CONFIG = {
  component: {
    message: 'Component name',
    validate: validatePascalCase,
    run: makeComponent,
  },
  icon: {
    message: 'Icon name',
    validate: validatePascalCase,
    run: makeIcon,
  },
  tokens: {
    message: 'Token path',
    validate: validateTokenPath,
    run: makeTokens,
  },
};

async function main() {
  const config = MODE_CONFIG[mode];

  if (!config) {
    exitWithError(`Unknown maker mode: ${mode}`);
  }

  const response = await prompts(
    {
      type: 'text',
      name: 'value',
      message: config.message,
      validate: config.validate,
    },
    {
      onCancel: () => {
        exitWithError('No name provided.');
      },
    },
  );

  const value = response.value?.trim();

  if (!value) {
    exitWithError('No name provided.');
  }

  const changedPaths = await config.run(value);

  console.log(`Created ${mode} scaffold: ${value}`);

  for (const changedPath of changedPaths) {
    console.log(path.resolve(changedPath));
  }
}

function validatePascalCase(value) {
  if (!value?.trim()) {
    return 'A name is required.';
  }

  if (!/^[A-Z][A-Za-z0-9]*$/.test(value.trim())) {
    return 'Use PascalCase with letters and numbers only.';
  }

  return true;
}

function validateTokenPath(value) {
  if (!value?.trim()) {
    return 'A token path is required.';
  }

  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(value.trim())) {
    return 'Use lowercase path segments with letters, numbers, or hyphens.';
  }

  return true;
}

async function makeComponent(name) {
  const componentDir = path.join(rootDir, 'src/components', name);
  const componentIndexPath = path.join(componentDir, 'index.tsx');
  const componentStylesPath = path.join(componentDir, `${name}.module.scss`);
  const entrypointDir = path.join(rootDir, 'src/entrypoints/components');
  const entrypointPath = path.join(entrypointDir, `${name}.ts`);

  await ensureDoesNotExist(componentDir, `Component already exists: ${name}`);
  await ensureDoesNotExist(entrypointPath, `Component entrypoint already exists: ${name}`);

  await fs.mkdir(componentDir, { recursive: true });
  await fs.mkdir(entrypointDir, { recursive: true });

  const componentTemplate = await readTemplate('component-index.tsx.template');
  const componentSource = componentTemplate
    .replaceAll('__NAME__', name)
    .replaceAll('__SCSS_FILE__', `${name}.module.scss`);

  await fs.writeFile(componentIndexPath, componentSource);
  await fs.writeFile(componentStylesPath, '');
  await fs.writeFile(entrypointPath, `export * from '../../components/${name}';\n`);

  await rewriteComponentsBarrel();
  await rewritePackageExports();
  await rewriteComponentEntries();

  return [
    componentIndexPath,
    componentStylesPath,
    entrypointPath,
    path.join(rootDir, 'src/components/index.ts'),
    path.join(rootDir, 'package.json'),
    path.join(rootDir, 'vite.config.components.ts'),
  ];
}

async function makeIcon(name) {
  const iconPath = path.join(rootDir, 'src/icons', `Icon${name}.tsx`);

  await ensureDoesNotExist(iconPath, `Icon already exists: Icon${name}`);

  const iconTemplate = await readTemplate('icon.tsx.template');
  const iconSource = iconTemplate.replaceAll('__NAME__', name);

  await fs.writeFile(iconPath, iconSource);
  await rewriteIconsBarrel();
  await ensureIconsPackageExport();
  await ensureIconsEntry();
  await ensureIconsTypeDeclarations();

  return [
    iconPath,
    path.join(rootDir, 'src/icons/index.ts'),
    path.join(rootDir, 'package.json'),
    path.join(rootDir, 'vite.config.components.ts'),
    path.join(rootDir, 'tsconfig.build.json'),
  ];
}

async function makeTokens(tokenPath) {
  const filePath = path.join(rootDir, 'tokens', `${tokenPath}.json`);

  await ensureDoesNotExist(filePath, `Token file already exists: ${tokenPath}.json`);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(makeTokenObject(tokenPath), null, 2)}\n`);

  return [filePath];
}

async function rewriteComponentsBarrel() {
  const componentsRoot = path.join(rootDir, 'src/components');
  const entries = await fs.readdir(componentsRoot, { withFileTypes: true });
  const exports = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => `export * from './${entry.name}';`)
    .sort();

  await fs.writeFile(path.join(componentsRoot, 'index.ts'), `${exports.join('\n')}\n`);
}

async function rewriteIconsBarrel() {
  const iconsRoot = path.join(rootDir, 'src/icons');
  const entries = await fs.readdir(iconsRoot, { withFileTypes: true });
  const exports = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        /^Icon[A-Z][A-Za-z0-9]*\.tsx$/.test(entry.name),
    )
    .map((entry) => `export * from './${entry.name.replace(/\.tsx$/, '')}';`)
    .sort();

  await fs.writeFile(path.join(iconsRoot, 'index.ts'), `${exports.join('\n')}\n`);
}

async function ensureIconsPackageExport() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const existingExports = packageJson.exports ?? {};

  existingExports['./icons'] = {
    types: './dist/icons/index.d.ts',
    import: './dist/icons/index.js',
  };

  packageJson.exports = Object.fromEntries(
    Object.entries(existingExports).sort(([left], [right]) => left.localeCompare(right)),
  );

  await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function ensureIconsEntry() {
  const configPath = path.join(rootDir, 'vite.config.components.ts');
  const source = await fs.readFile(configPath, 'utf8');

  if (source.includes("'icons/index': fileURLToPath(")) {
    return;
  }

  const nextSource = source.replace(
    /('components\/Responsive\/index': fileURLToPath\([\s\S]*?\),\n)/,
    `$1        'icons/index': fileURLToPath(\n          new URL('./src/entrypoints/icons.ts', import.meta.url)\n        ),\n`,
  );

  await fs.writeFile(configPath, nextSource);
}

async function ensureIconsTypeDeclarations() {
  const configPath = path.join(rootDir, 'tsconfig.build.json');
  const source = await fs.readFile(configPath, 'utf8');

  let nextSource = source;

  if (!nextSource.includes('"src/icons/**/*.ts"')) {
    nextSource = nextSource.replace(
      '"src/components/**/*.ts",\n',
      '"src/components/**/*.ts",\n    "src/icons/**/*.ts",\n',
    );
  }

  if (!nextSource.includes('"src/icons/**/*.tsx"')) {
    nextSource = nextSource.replace(
      '"src/icons/**/*.ts",\n',
      '"src/icons/**/*.ts",\n    "src/icons/**/*.tsx",\n',
    );
  }

  nextSource = nextSource.replace(/,\n\s*"src\/icons\/\*\*"/, '');

  await fs.writeFile(configPath, nextSource);
}

async function rewritePackageExports() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const componentNames = await listComponentNames();

  const existingExports = packageJson.exports ?? {};
  const nextExports = {};

  for (const name of componentNames) {
    nextExports[`./components/${name}`] = {
      types: `./dist/components/${name}/index.d.ts`,
      import: `./dist/components/${name}/index.js`,
    };
  }

  for (const [key, value] of Object.entries(existingExports)) {
    if (!key.startsWith('./components/')) {
      nextExports[key] = value;
    }
  }

  packageJson.exports = Object.fromEntries(
    Object.entries(nextExports).sort(([left], [right]) => left.localeCompare(right)),
  );

  await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function rewriteComponentEntries() {
  const configPath = path.join(rootDir, 'vite.config.components.ts');
  const source = await fs.readFile(configPath, 'utf8');
  const componentNames = await listComponentNames();

  const entryBlock = componentNames
    .map(
      (name) => `        'components/${name}/index': fileURLToPath(
          new URL('./src/entrypoints/components/${name}.ts', import.meta.url),
        ),`,
    )
    .join('\n');

  const staticEntries = `        'templates/index': fileURLToPath(
          new URL('./src/entrypoints/templates/index.ts', import.meta.url)
        ),
        'templates/AppShell/index': fileURLToPath(
          new URL('./src/entrypoints/templates/AppShell.ts', import.meta.url)
        ),
        'templates/AuthShell/index': fileURLToPath(
          new URL('./src/entrypoints/templates/AuthShell.ts', import.meta.url)
        ),
        'templates/BlankShell/index': fileURLToPath(
          new URL('./src/entrypoints/templates/BlankShell.ts', import.meta.url)
        ),
        'templates/CenteredShell/index': fileURLToPath(
          new URL('./src/entrypoints/templates/CenteredShell.ts', import.meta.url)
        ),
        'templates/PageShell/index': fileURLToPath(
          new URL('./src/entrypoints/templates/PageShell.ts', import.meta.url)
        ),
        'templates/SplitPaneShell/index': fileURLToPath(
          new URL('./src/entrypoints/templates/SplitPaneShell.ts', import.meta.url)
        ),
        'icons/index': fileURLToPath(
          new URL('./src/entrypoints/icons.ts', import.meta.url)
        ),
        'contexts/index': fileURLToPath(
          new URL('./src/entrypoints/contexts.ts', import.meta.url)
        ),`;

  const nextSource = source.replace(
    /entry:\s*\{[\s\S]*?\n\s*\},\n\s*formats:/,
    `entry: {\n${entryBlock}\n${staticEntries}\n      },\n      formats:`,
  );

  await fs.writeFile(configPath, nextSource);
}

async function listComponentNames() {
  const componentsRoot = path.join(rootDir, 'src/components');
  const entries = await fs.readdir(componentsRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function makeTokenObject(tokenPath) {
  const segments = tokenPath.split('/');
  const leafKey = segments.pop();

  let current = { [leafKey]: { '': '' } };

  while (segments.length > 0) {
    const segment = segments.pop();
    current = { [segment]: current };
  }

  return current;
}

async function readTemplate(templateName) {
  return fs.readFile(path.join(templatesDir, templateName), 'utf8');
}

async function ensureDoesNotExist(targetPath, message) {
  try {
    await fs.access(targetPath);
    exitWithError(message);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

await main();
