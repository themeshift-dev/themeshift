import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { themeShift } from '@themeshift/vite-plugin';
import type { OutputAsset, OutputBundle, OutputChunk } from 'rollup';

const cssGroups = [
  { label: 'Colors', match: (n: string) => n.startsWith('color-') },
  {
    label: 'Typography',
    match: (n: string) => n.startsWith('font-') || n.startsWith('typography-'),
  },
  {
    label: 'Accessibility',
    match: (n: string) =>
      n.startsWith('accessibility-') || n.startsWith('a11y-'),
  },
  {
    label: 'Layout',
    match: (n: string) => n.startsWith('grid-') || n.startsWith('layout-'),
  },
  { label: 'Border Radius', match: (n: string) => n.startsWith('radius-') },
  { label: 'Theme', match: (n: string) => n.startsWith('theme-') },
  {
    label: 'Components',
    match: (n: string) =>
      n.startsWith('component-') || n.startsWith('components-'),
  },
  { label: 'Other', match: () => true },
];

function injectComponentCss(): Plugin {
  return {
    name: 'inject-component-css',
    generateBundle(_options: unknown, bundle: OutputBundle) {
      const cssAssetsToRemove = new Set<string>();

      const collectImportedCss = (
        chunk: OutputChunk,
        visited = new Set<string>()
      ): string[] => {
        if (visited.has(chunk.fileName)) {
          return [];
        }

        visited.add(chunk.fileName);

        const importedCss = Array.from(chunk.viteMetadata?.importedCss ?? []);
        const transitiveCss = chunk.imports.flatMap((importedChunkFileName) => {
          const importedChunk = bundle[importedChunkFileName];

          if (!importedChunk || importedChunk.type !== 'chunk') {
            return [];
          }

          return collectImportedCss(importedChunk, visited);
        });

        return [...importedCss, ...transitiveCss];
      };

      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.isEntry) {
          continue;
        }

        const isComponentEntry =
          chunk.fileName.startsWith('components/') &&
          chunk.fileName.endsWith('/index.js');
        const isTemplateEntry =
          chunk.fileName.startsWith('templates/') &&
          chunk.fileName.endsWith('/index.js');
        const isStyleInjectableEntry = isComponentEntry || isTemplateEntry;

        if (!isStyleInjectableEntry) {
          continue;
        }

        const importedCss = collectImportedCss(chunk);

        if (importedCss.length === 0) {
          continue;
        }

        const styleFileName = `${path.posix.dirname(chunk.fileName)}/style.css`;

        if (isComponentEntry) {
          // For component entries, reference CSS assets via @import so
          // transitive styles are not duplicated into every component style
          // file, while still preserving automatic style loading.
          const cssImports = [...new Set(importedCss)]
            .map((cssFileName) => {
              const relativePath = path.posix.relative(
                path.posix.dirname(styleFileName),
                cssFileName
              );

              return relativePath.startsWith('.')
                ? relativePath
                : `./${relativePath}`;
            })
            .map((relativePath) => `@import "${relativePath}";`);

          this.emitFile({
            type: 'asset',
            fileName: styleFileName,
            source: `${cssImports.join('\n')}\n`,
          });

          chunk.code = `import "./style.css";\n${chunk.code}`;
          continue;
        }

        const cssParts: string[] = [];

        for (const cssFileName of importedCss) {
          const asset = bundle[cssFileName] as
            | OutputAsset
            | OutputChunk
            | undefined;

          if (!asset || asset.type !== 'asset') {
            continue;
          }

          cssParts.push(
            typeof asset.source === 'string'
              ? asset.source
              : asset.source.toString()
          );
          cssAssetsToRemove.add(cssFileName);
        }

        if (cssParts.length === 0) {
          continue;
        }

        this.emitFile({
          type: 'asset',
          fileName: styleFileName,
          source: cssParts.join('\n'),
        });

        chunk.code = `import "./style.css";\n${chunk.code}`;
      }

      for (const cssFileName of cssAssetsToRemove) {
        delete bundle[cssFileName];
      }
    },
  };
}

export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    injectComponentCss(),
    themeShift({
      cssVarPrefix: 'themeshift',
      platforms: ['css', 'meta', 'scss'],
      groups: cssGroups,
      filters: {
        scss: {
          includePrefixes: [
            'radius-',
            'spacing-',
            'space-',
            'font-',
            'typography-',
            'layout-',
            'grid-',
          ],
          excludePrefixes: ['theme-', 'components-'],
        },
      },
      defaultTheme: 'dark',
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: true,
    lib: {
      entry: {
        'components/Badge/index': fileURLToPath(
          new URL('./src/entrypoints/components/Badge.ts', import.meta.url)
        ),
        'components/Box/index': fileURLToPath(
          new URL('./src/entrypoints/components/Box.ts', import.meta.url)
        ),
        'components/Button/index': fileURLToPath(
          new URL('./src/entrypoints/components/Button.ts', import.meta.url)
        ),
        'components/Card/index': fileURLToPath(
          new URL('./src/entrypoints/components/Card.ts', import.meta.url)
        ),
        'components/Checkbox/index': fileURLToPath(
          new URL('./src/entrypoints/components/Checkbox.ts', import.meta.url)
        ),
        'components/CopyButton/index': fileURLToPath(
          new URL('./src/entrypoints/components/CopyButton.ts', import.meta.url)
        ),
        'components/ErrorMessage/index': fileURLToPath(
          new URL(
            './src/entrypoints/components/ErrorMessage.ts',
            import.meta.url
          )
        ),
        'components/Field/index': fileURLToPath(
          new URL('./src/entrypoints/components/Field.ts', import.meta.url)
        ),
        'components/Flex/index': fileURLToPath(
          new URL('./src/entrypoints/components/Flex.ts', import.meta.url)
        ),
        'components/FocusLock/index': fileURLToPath(
          new URL('./src/entrypoints/components/FocusLock.ts', import.meta.url)
        ),
        'components/Grid/index': fileURLToPath(
          new URL('./src/entrypoints/components/Grid.ts', import.meta.url)
        ),
        'components/Heading/index': fileURLToPath(
          new URL('./src/entrypoints/components/Heading.ts', import.meta.url)
        ),
        'components/Input/index': fileURLToPath(
          new URL('./src/entrypoints/components/Input.ts', import.meta.url)
        ),
        'components/Label/index': fileURLToPath(
          new URL('./src/entrypoints/components/Label.ts', import.meta.url)
        ),
        'components/Link/index': fileURLToPath(
          new URL('./src/entrypoints/components/Link.ts', import.meta.url)
        ),
        'components/Navbar/index': fileURLToPath(
          new URL('./src/entrypoints/components/Navbar.ts', import.meta.url)
        ),
        'components/ProgressBar/index': fileURLToPath(
          new URL(
            './src/entrypoints/components/ProgressBar.ts',
            import.meta.url
          )
        ),
        'components/Radio/index': fileURLToPath(
          new URL('./src/entrypoints/components/Radio.ts', import.meta.url)
        ),
        'components/Responsive/index': fileURLToPath(
          new URL('./src/entrypoints/components/Responsive.ts', import.meta.url)
        ),
        'components/SafetyButton/index': fileURLToPath(
          new URL(
            './src/entrypoints/components/SafetyButton.ts',
            import.meta.url
          )
        ),
        'components/Select/index': fileURLToPath(
          new URL('./src/entrypoints/components/Select.ts', import.meta.url)
        ),
        'components/Skeleton/index': fileURLToPath(
          new URL('./src/entrypoints/components/Skeleton.ts', import.meta.url)
        ),
        'components/SkipLink/index': fileURLToPath(
          new URL('./src/entrypoints/components/SkipLink.ts', import.meta.url)
        ),
        'components/Spinner/index': fileURLToPath(
          new URL('./src/entrypoints/components/Spinner.ts', import.meta.url)
        ),
        'components/Tabs/index': fileURLToPath(
          new URL('./src/entrypoints/components/Tabs.ts', import.meta.url)
        ),
        'components/Textarea/index': fileURLToPath(
          new URL('./src/entrypoints/components/Textarea.ts', import.meta.url)
        ),
        'components/ToggleSwitch/index': fileURLToPath(
          new URL(
            './src/entrypoints/components/ToggleSwitch.ts',
            import.meta.url
          )
        ),
        'templates/index': fileURLToPath(
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
          new URL(
            './src/entrypoints/templates/CenteredShell.ts',
            import.meta.url
          )
        ),
        'templates/PageShell/index': fileURLToPath(
          new URL('./src/entrypoints/templates/PageShell.ts', import.meta.url)
        ),
        'templates/SplitPaneShell/index': fileURLToPath(
          new URL(
            './src/entrypoints/templates/SplitPaneShell.ts',
            import.meta.url
          )
        ),
        'icons/index': fileURLToPath(
          new URL('./src/entrypoints/icons.ts', import.meta.url)
        ),
        'contexts/index': fileURLToPath(
          new URL('./src/entrypoints/contexts.ts', import.meta.url)
        ),
        'hooks/index': fileURLToPath(
          new URL('./src/entrypoints/hooks.ts', import.meta.url)
        ),
        'hooks/useCopyToClipboard/index': fileURLToPath(
          new URL('./src/hooks/useCopyToClipboard/index.ts', import.meta.url)
        ),
        'hooks/useForm/index': fileURLToPath(
          new URL('./src/hooks/useForm/index.ts', import.meta.url)
        ),
        'hooks/useHoldToConfirm/index': fileURLToPath(
          new URL('./src/hooks/useHoldToConfirm/index.ts', import.meta.url)
        ),
        'hooks/useOnClickOutside/index': fileURLToPath(
          new URL('./src/hooks/useOnClickOutside/index.ts', import.meta.url)
        ),
        'hooks/useResizeObserver/index': fileURLToPath(
          new URL('./src/hooks/useResizeObserver/index.ts', import.meta.url)
        ),
        'hooks/useScrollLock/index': fileURLToPath(
          new URL('./src/hooks/useScrollLock/index.ts', import.meta.url)
        ),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
