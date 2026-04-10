import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const componentsDir = 'packages/ui/src/components';
const readmePaths = ['README.md', 'packages/ui/README.md'];
const badgePattern =
  /!\[Components\]\(https:\/\/img\.shields\.io\/badge\/components-\d+-blue\.svg\)/;

async function hasIndexFile(rootDir, componentName) {
  try {
    const indexPath = path.join(
      rootDir,
      componentsDir,
      componentName,
      'index.tsx'
    );
    const indexStat = await stat(indexPath);

    return indexStat.isFile();
  } catch {
    return false;
  }
}

async function countComponents(rootDir) {
  const entries = await readdir(path.join(rootDir, componentsDir), {
    withFileTypes: true,
  });
  const componentDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const componentChecks = await Promise.all(
    componentDirectories.map((componentName) =>
      hasIndexFile(rootDir, componentName)
    )
  );

  return componentChecks.filter(Boolean).length;
}

export async function syncUiComponentBadges({ check = false, rootDir }) {
  const componentCount = await countComponents(rootDir);
  const nextBadge = `![Components](https://img.shields.io/badge/components-${componentCount}-blue.svg)`;

  for (const readmePath of readmePaths) {
    const absoluteReadmePath = path.join(rootDir, readmePath);
    const readme = await readFile(absoluteReadmePath, 'utf8');

    if (!badgePattern.test(readme)) {
      throw new Error(`Could not find the components badge in ${readmePath}`);
    }

    const nextReadme = readme.replace(badgePattern, nextBadge);

    if (check) {
      if (nextReadme !== readme) {
        throw new Error(
          `${readmePath} has a stale components badge. Expected: ${nextBadge}`
        );
      }

      continue;
    }

    await writeFile(absoluteReadmePath, nextReadme);
  }

  return componentCount;
}
