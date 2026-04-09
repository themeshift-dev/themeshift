import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import StyleDictionary from 'style-dictionary';
import { afterEach, describe, expect, it } from 'vitest';

import {
  makeStyleDictionaryConfig,
  registerStyleDictionaryThings,
} from '../src/sd';

function makeStyleDictionaryMock() {
  const formats = new Map<string, ({ dictionary }: any) => string>();

  return {
    __hd_registered: false,
    registerTransform() {},
    registerFormat({
      name,
      format,
    }: {
      name: string;
      format: ({ dictionary }: any) => string;
    }) {
      formats.set(name, format);
    },
    getFormat(name: string) {
      return formats.get(name);
    },
  };
}

const tempRoots: string[] = [];

describe('registerStyleDictionaryThings', () => {
  afterEach(async () => {
    await Promise.all(
      tempRoots
        .splice(0)
        .map((root) => fs.rm(root, { recursive: true, force: true }))
    );
  });

  it('emits unprefixed CSS variables by default', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          { name: 'components-button-font', value: '600 1rem/1.2 Inter' },
        ],
      },
    });

    expect(output).toContain('--components-button-font: 600 1rem/1.2 Inter;');
  });

  it('emits prefixed CSS variables when cssVarPrefix is set', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          { name: 'components-button-font', value: '600 1rem/1.2 Inter' },
        ],
      },
    });

    expect(output).toContain(
      '--themeshift-components-button-font: 600 1rem/1.2 Inter;'
    );
    expect(output).not.toContain(
      '--components-button-font: 600 1rem/1.2 Inter;'
    );
  });

  it('serializes typography object values into valid CSS variable values', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'text-style-title',
            type: 'typography',
            value: {
              fontFamily: '"Roboto Slab", Georgia, serif',
              fontSize: '1.25rem',
              lineHeight: '1.3',
              fontWeight: '400',
            },
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain(
      '--themeshift-text-style-title: 400 1.25rem/1.3 "Roboto Slab", Georgia, serif;'
    );
    expect(output).not.toContain('[object Object]');
  });

  it('keeps grouped CSS output valid for primitive and typography tokens together', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'components-button-padding',
            value: '1rem 2rem',
            attributes: {},
          },
          {
            name: 'text-style-title',
            type: 'typography',
            value: {
              fontFamily: '"Roboto Slab", Georgia, serif',
              fontSize: '1.25rem',
              lineHeight: '1.3',
              fontWeight: '400',
            },
            attributes: { theme: 'light' },
          },
          {
            name: 'text-style-title',
            type: 'typography',
            value: {
              fontFamily: '"Roboto Slab", Georgia, serif',
              fontSize: '1.25rem',
              lineHeight: '1.3',
              fontWeight: '500',
            },
            attributes: { theme: 'dark' },
          },
        ],
      },
    });

    expect(output).toContain(
      ':root {\n  /* Components */\n  --themeshift-components-button-padding: 1rem 2rem;'
    );
    expect(output).toContain(
      `:root[data-theme='light'] {\n  /* Other */\n  --themeshift-text-style-title: 400 1.25rem/1.3 "Roboto Slab", Georgia, serif;`
    );
    expect(output).toContain(
      `:root[data-theme='dark'] {\n  /* Other */\n  --themeshift-text-style-title: 500 1.25rem/1.3 "Roboto Slab", Georgia, serif;`
    );
  });

  it('does not emit token description comments by default', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
    });

    const cssFormat = StyleDictionary.getFormat('css/variables-modes-grouped');
    const scssFormat = StyleDictionary.getFormat('scss/static-tokens');
    const dictionary = {
      allTokens: [
        {
          name: 'space-4',
          value: '1rem',
          description: '16px',
          attributes: {},
        },
      ],
    };

    expect(cssFormat?.({ dictionary })).not.toContain('/* 16px */');
    expect(scssFormat?.({ dictionary })).not.toContain('/* 16px */');
  });

  it('emits token description comments in css output when outputComments is enabled', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
      outputComments: true,
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'space-4',
            value: '1rem',
            description: '16px',
            attributes: {},
          },
          {
            name: 'grid-gutter-desktop',
            value: '1.5rem',
            $description: '24px',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain('  /* 16px */\n  --themeshift-space-4: 1rem;');
    expect(output).toContain(
      '  /* 24px */\n  --themeshift-grid-gutter-desktop: 1.5rem;'
    );
  });

  it('emits a token values manifest with primitive and object values', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('token/values-ts');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            path: ['color', 'brand', 'primary'],
            value: '#005fcc',
          },
          {
            path: ['text', 'style', 'title'],
            value: {
              fontFamily: '"Roboto Slab", Georgia, serif',
              fontSize: '1.25rem',
              lineHeight: '1.3',
              fontWeight: '400',
            },
          },
        ],
      },
    });

    expect(output).toContain('"color.brand.primary": "#005fcc"');
    expect(output).toContain('"text.style.title": {');
    expect(output).toContain(
      '"fontFamily": "\\"Roboto Slab\\", Georgia, serif"'
    );
  });

  it('resolves references to nested sub-values inside composite token originals', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'color-white',
            path: ['color', 'white'],
            value: '#fff',
            original: {
              $value: '#fff',
              $type: 'color',
            },
            attributes: {},
          },
          {
            name: 'color-blue-400',
            path: ['color', 'blue', '400'],
            value: '#5C6BC0',
            original: {
              $value: '#5C6BC0',
              fg: {
                $value: '{color.white}',
                $type: 'color',
              },
              $type: 'color',
            },
            attributes: {},
          },
          {
            name: 'components-button-light-intents-primary-fg',
            path: ['components', 'button', 'light', 'intents', 'primary', 'fg'],
            value: '{color.blue.400.fg}',
            original: {
              $value: '{color.blue.400.fg}',
            },
            attributes: {
              theme: 'light',
            },
          },
        ],
      },
    });

    expect(output).toContain(
      '--themeshift-components-button-light-intents-primary-fg: #fff;'
    );
  });

  it('emits hybrid parent and child tokens across css, scss, and token manifests', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
      filters: {
        scss: {
          includePrefixes: ['components-'],
        },
      },
    });

    const cssFormat = StyleDictionary.getFormat('css/variables-modes-grouped');
    const scssFormat = StyleDictionary.getFormat('scss/static-tokens');
    const pathsFormat = StyleDictionary.getFormat('token/paths-ts');
    const valuesFormat = StyleDictionary.getFormat('token/values-ts');
    const dictionary = {
      allTokens: [
        {
          name: 'color-blue-400',
          path: ['color', 'blue', '400'],
          value: '#5C6BC0',
          original: {
            $value: '#5C6BC0',
            $type: 'color',
          },
          attributes: {},
        },
        {
          name: 'components-button-light-intents-primary-bg',
          path: ['components', 'button', 'light', 'intents', 'primary', 'bg'],
          value: '{color.blue.400}',
          original: {
            $value: '{color.blue.400}',
            hover: {
              $value:
                'lighten({components.button.light.intents.primary.bg}, 0.1)',
            },
            disabled: {
              $value:
                'alpha({components.button.light.intents.primary.bg.hover}, 0.3)',
            },
          },
          attributes: {
            theme: 'light',
          },
        },
      ],
    };

    const cssOutput = cssFormat?.({ dictionary });
    const scssOutput = scssFormat?.({ dictionary });
    const pathsOutput = pathsFormat?.({ dictionary });
    const valuesOutput = valuesFormat?.({ dictionary });

    expect(cssOutput).toContain(
      '--themeshift-components-button-light-intents-primary-bg: #5C6BC0;'
    );
    expect(cssOutput).toContain(
      '--themeshift-components-button-light-intents-primary-bg-hover: #6c7ac6;'
    );
    expect(cssOutput).toContain(
      '--themeshift-components-button-light-intents-primary-bg-disabled: rgba(108, 122, 198, 0.3);'
    );
    expect(scssOutput).toContain(
      '$components_button_light_intents_primary_bg: #5C6BC0;'
    );
    expect(scssOutput).toContain(
      '$components_button_light_intents_primary_bg_hover: #6c7ac6;'
    );
    expect(pathsOutput).toContain(
      '"components.button.light.intents.primary.bg.hover"'
    );
    expect(valuesOutput).toContain(
      '"components.button.light.intents.primary.bg.disabled": "rgba(108, 122, 198, 0.3)"'
    );
  });

  it('supports nested hybrid child paths without flattening ordinary composite values', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
    });

    const pathsFormat = StyleDictionary.getFormat('token/paths-ts');
    const valuesFormat = StyleDictionary.getFormat('token/values-ts');
    const dictionary = {
      allTokens: [
        {
          name: 'color-blue-300',
          path: ['color', 'blue', '300'],
          value: '#7986CB',
          original: {
            $value: '#7986CB',
            $type: 'color',
          },
          attributes: {},
        },
        {
          name: 'components-button-bg',
          path: ['components', 'button', 'bg'],
          value: '{color.blue.300}',
          original: {
            $value: '{color.blue.300}',
            hover: {
              $value: 'lighten({components.button.bg}, 0.1)',
              subtle: {
                $value: 'alpha({components.button.bg.hover}, 0.5)',
              },
            },
          },
          attributes: {},
        },
        {
          name: 'text-style-title',
          path: ['text', 'style', 'title'],
          type: 'typography',
          original: {
            $type: 'typography',
            $value: {
              fontFamily: '"Roboto Slab", Georgia, serif',
              fontSize: '1.25rem',
              lineHeight: '1.3',
              fontWeight: '400',
            },
          },
          value: {
            fontFamily: '"Roboto Slab", Georgia, serif',
            fontSize: '1.25rem',
            lineHeight: '1.3',
            fontWeight: '400',
          },
          attributes: {},
        },
      ],
    };

    const pathsOutput = pathsFormat?.({ dictionary });
    const valuesOutput = valuesFormat?.({ dictionary });

    expect(pathsOutput).toContain('"components.button.bg.hover.subtle"');
    expect(valuesOutput).toContain(
      '"components.button.bg.hover.subtle": "rgba(134, 146, 208, 0.5)"'
    );
    expect(pathsOutput).not.toContain('"text.style.title.fontFamily"');
    expect(valuesOutput).not.toContain('"text.style.title.fontFamily"');
  });

  it('keeps css color functions like rgba() as literal token values', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'color-white-70',
            path: ['color', 'white', '70'],
            value: 'rgba(255, 255, 255, .7)',
            original: {
              $value: 'rgba(255, 255, 255, .7)',
              $type: 'color',
            },
            attributes: {},
          },
          {
            name: 'theme-dark-text-muted',
            path: ['theme', 'dark', 'text', 'muted'],
            value: '{color.white.70}',
            original: {
              $value: '{color.white.70}',
            },
            attributes: {
              theme: 'dark',
            },
          },
        ],
      },
    });

    expect(output).toContain(
      '--themeshift-theme-dark-text-muted: rgba(255, 255, 255, .7);'
    );
  });

  it('keeps hsl() and hsla() css color functions as literal token values', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'color-brand-hsl',
            path: ['color', 'brand', 'hsl'],
            value: 'hsl(220, 45%, 40%)',
            original: {
              $value: 'hsl(220, 45%, 40%)',
              $type: 'color',
            },
            attributes: {},
          },
          {
            name: 'color-brand-hsla',
            path: ['color', 'brand', 'hsla'],
            value: 'hsla(220, 45%, 40%, 0.5)',
            original: {
              $value: 'hsla(220, 45%, 40%, 0.5)',
              $type: 'color',
            },
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain(
      '--themeshift-color-brand-hsl: hsl(220, 45%, 40%);'
    );
    expect(output).toContain(
      '--themeshift-color-brand-hsla: hsla(220, 45%, 40%, 0.5);'
    );
  });

  it('resolves nested references inside typography object values', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      filters: {
        scss: {
          includePrefixes: ['font-', 'typography-'],
        },
      },
    });

    const format = StyleDictionary.getFormat('scss/static-tokens');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'font-family-sans',
            path: ['font', 'family', 'sans'],
            value: "'Noto Sans Variable', sans-serif",
          },
          {
            name: 'font-weight-bold',
            path: ['font', 'weight', 'bold'],
            value: '700',
          },
          {
            name: 'typography-metrics-1-font-size',
            path: ['typography', 'metrics', '1', 'fontSize'],
            value: '1rem',
          },
          {
            name: 'typography-metrics-1-line-height',
            path: ['typography', 'metrics', '1', 'lineHeight'],
            value: '1.375rem',
          },
          {
            name: 'typography-scales-1-bold',
            path: ['typography', 'scales', '1', 'bold'],
            type: 'typography',
            original: {
              $type: 'typography',
              $value: {
                fontFamily: '{font.family.sans}',
                fontSize: '{typography.metrics.1.fontSize}',
                lineHeight: '{typography.metrics.1.lineHeight}',
                fontWeight: '{font.weight.bold}',
              },
            },
            value: {
              fontFamily: '{font.family.sans}',
              fontSize: '{typography.metrics.1.fontSize}',
              lineHeight: '{typography.metrics.1.lineHeight}',
              fontWeight: '{font.weight.bold}',
            },
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain(
      "$typography_scales_1_bold: 700 1rem/1.375rem 'Noto Sans Variable', sans-serif;"
    );
  });

  it('resolves color expressions consistently across css, scss, and token manifests', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
      filters: {
        scss: {
          includePrefixes: ['components-', 'space-'],
        },
      },
    });

    const cssFormat = StyleDictionary.getFormat('css/variables-modes-grouped');
    const scssFormat = StyleDictionary.getFormat('scss/static-tokens');
    const valuesFormat = StyleDictionary.getFormat('token/values-ts');
    const dictionary = {
      allTokens: [
        {
          name: 'color-blue-300',
          path: ['color', 'blue', '300'],
          value: '#7986CB',
        },
        {
          name: 'color-blue-400',
          path: ['color', 'blue', '400'],
          value: '#5C6BC0',
        },
        {
          name: 'color-blue-500',
          path: ['color', 'blue', '500'],
          value: '#3F51B5',
        },
        {
          name: 'color-white',
          path: ['color', 'white'],
          value: '#fff',
        },
        {
          name: 'components-button-padding',
          path: ['components', 'button', 'padding'],
          value: '0 {space.4}',
          original: {
            value: '0 {space.4}',
          },
          attributes: {},
        },
        {
          name: 'space-4',
          path: ['space', '4'],
          value: '1rem',
          attributes: {},
        },
        {
          name: 'components-button-intents-primary-hover',
          path: ['components', 'button', 'intents', 'primary', 'hover'],
          value: 'lighten({color.blue.300}, 0.1)',
          original: {
            value: 'lighten({color.blue.300}, 0.1)',
          },
          attributes: {},
        },
        {
          name: 'components-button-intents-primary-pressed',
          path: ['components', 'button', 'intents', 'primary', 'pressed'],
          value: 'darken({color.blue.500}, 0.1)',
          original: {
            value: 'darken({color.blue.500}, 0.1)',
          },
          attributes: {},
        },
        {
          name: 'components-button-intents-primary-border',
          path: ['components', 'button', 'intents', 'primary', 'border'],
          value: 'mix({color.blue.400}, {color.white}, 0.25)',
          original: {
            value: 'mix({color.blue.400}, {color.white}, 0.25)',
          },
          attributes: {},
        },
        {
          name: 'components-button-intents-primary-overlay',
          path: ['components', 'button', 'intents', 'primary', 'overlay'],
          value: 'alpha(mix({color.blue.400}, {color.white}, 0.25), 0.5)',
          original: {
            value: 'alpha(mix({color.blue.400}, {color.white}, 0.25), 0.5)',
          },
          attributes: {},
        },
      ],
    };

    const cssOutput = cssFormat?.({ dictionary });
    const scssOutput = scssFormat?.({ dictionary });
    const valuesOutput = valuesFormat?.({ dictionary });

    expect(cssOutput).toContain(
      '--themeshift-components-button-intents-primary-hover: #8692d0;'
    );
    expect(cssOutput).toContain(
      '--themeshift-components-button-intents-primary-pressed: #3949a3;'
    );
    expect(cssOutput).toContain(
      '--themeshift-components-button-intents-primary-border: #8590d0;'
    );
    expect(cssOutput).toContain(
      '--themeshift-components-button-intents-primary-overlay: rgba(133, 144, 208, 0.5);'
    );
    expect(scssOutput).toContain(
      '$components_button_intents_primary_hover: #8692d0;'
    );
    expect(scssOutput).toContain('$components_button_padding: 0 1rem;');
    expect(valuesOutput).toContain(
      '"components.button.intents.primary.hover": "#8692d0"'
    );
    expect(valuesOutput).toContain(
      '"components.button.intents.primary.overlay": "rgba(133, 144, 208, 0.5)"'
    );
  });

  it('throws helpful errors for malformed or unsupported color expressions', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');

    expect(() =>
      format?.({
        dictionary: {
          allTokens: [
            {
              name: 'color-blue-300',
              path: ['color', 'blue', '300'],
              value: '#7986CB',
            },
            {
              name: 'components-button-hover',
              path: ['components', 'button', 'hover'],
              value: 'lighten({color.blue.300}, 0.1',
              original: {
                value: 'lighten({color.blue.300}, 0.1',
              },
              attributes: {},
            },
          ],
        },
      })
    ).toThrow(
      'Failed to resolve token "components.button.hover": invalid expression syntax "lighten({color.blue.300}, 0.1".'
    );

    expect(() =>
      format?.({
        dictionary: {
          allTokens: [
            {
              name: 'color-blue-300',
              path: ['color', 'blue', '300'],
              value: '#7986CB',
            },
            {
              name: 'components-button-hover',
              path: ['components', 'button', 'hover'],
              value: 'saturate({color.blue.300}, 0.1)',
              original: {
                value: 'saturate({color.blue.300}, 0.1)',
              },
              attributes: {},
            },
          ],
        },
      })
    ).toThrow(
      'Failed to resolve token "components.button.hover": unsupported color function "saturate()".'
    );
  });

  it('throws a specific error for malformed css color functions', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');

    expect(() =>
      format?.({
        dictionary: {
          allTokens: [
            {
              name: 'theme-text-muted',
              path: ['theme', 'text', 'muted'],
              value: 'rgba(255, 255, 255, 2)',
              original: {
                value: 'rgba(255, 255, 255, 2)',
              },
              attributes: {},
            },
          ],
        },
      })
    ).toThrow(
      'Failed to resolve token "theme.text.muted": "rgba(255, 255, 255, 2)" looks like a CSS color function but is not a valid color value.'
    );
  });

  it('throws helpful errors for invalid color arguments, missing references, and cycles', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('token/values-ts');

    expect(() =>
      format?.({
        dictionary: {
          allTokens: [
            {
              name: 'space-4',
              path: ['space', '4'],
              value: '1rem',
            },
            {
              name: 'components-button-hover',
              path: ['components', 'button', 'hover'],
              value: 'lighten({space.4}, 0.1)',
              original: {
                value: 'lighten({space.4}, 0.1)',
              },
            },
          ],
        },
      })
    ).toThrow(
      'Failed to resolve token "components.button.hover": "1rem" is not a supported color value.'
    );

    expect(() =>
      format?.({
        dictionary: {
          allTokens: [
            {
              name: 'components-button-hover',
              path: ['components', 'button', 'hover'],
              value: 'lighten({color.blue.300}, 0.1)',
              original: {
                value: 'lighten({color.blue.300}, 0.1)',
              },
            },
          ],
        },
      })
    ).toThrow(
      'Failed to resolve token "components.button.hover": unknown token reference "color.blue.300".'
    );

    expect(() =>
      format?.({
        dictionary: {
          allTokens: [
            {
              name: 'color-brand-a',
              path: ['color', 'brand', 'a'],
              value: '{color.brand.b}',
              original: {
                value: '{color.brand.b}',
              },
            },
            {
              name: 'color-brand-b',
              path: ['color', 'brand', 'b'],
              value: '{color.brand.a}',
              original: {
                value: '{color.brand.a}',
              },
            },
          ],
        },
      })
    ).toThrow(
      'Failed to resolve token "color.brand.a": circular token reference "color.brand.a -> color.brand.b -> color.brand.a".'
    );
  });

  it('throws helpful errors for duplicate hybrid child paths and hybrid cycles', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const valuesFormat = StyleDictionary.getFormat('token/values-ts');

    expect(() =>
      valuesFormat?.({
        dictionary: {
          allTokens: [
            {
              name: 'components-button-bg',
              path: ['components', 'button', 'bg'],
              value: '#111',
              original: {
                $value: '#111',
                hover: {
                  $value: '#222',
                },
              },
            },
            {
              name: 'components-button-bg-hover',
              path: ['components', 'button', 'bg', 'hover'],
              value: '#333',
              original: {
                $value: '#333',
              },
            },
          ],
        },
      })
    ).toThrow(
      'Duplicate token path "components.button.bg.hover" generated by explicit token "components.button.bg.hover"; it conflicts with synthesized nested token "components.button.bg.hover" from "components.button.bg".'
    );

    expect(() =>
      valuesFormat?.({
        dictionary: {
          allTokens: [
            {
              name: 'components-button-bg',
              path: ['components', 'button', 'bg'],
              value: '#111',
              original: {
                $value: '#111',
                hover: {
                  $value: '{components.button.bg.disabled}',
                },
                disabled: {
                  $value: '{components.button.bg.hover}',
                },
              },
            },
          ],
        },
      })
    ).toThrow(
      'Failed to resolve token "components.button.bg.hover": circular token reference "components.button.bg.hover -> components.button.bg.disabled -> components.button.bg.hover".'
    );
  });

  it('includes layout tokens in static Sass output with predictable variable names', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('scss/static-tokens');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'layout-breakpoints-mobile',
            value: '0px',
            attributes: {},
          },
          {
            name: 'layout-breakpoints-tablet',
            value: '768px',
            attributes: {},
          },
          {
            name: 'layout-breakpoints-desktop',
            value: '1024px',
            attributes: {},
          },
          {
            name: 'layout-site-max-width',
            value: '1200px',
            attributes: {},
          },
          {
            name: 'theme-surface-base',
            value: '#fff',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain('$layout_breakpoints_mobile: 0px;');
    expect(output).toContain('$layout_breakpoints_tablet: 768px;');
    expect(output).toContain('$layout_breakpoints_desktop: 1024px;');
    expect(output).toContain('$layout_site_max_width: 1200px;');
    expect(output).not.toContain('$theme_surface_base: #fff;');
  });

  it('emits token description comments in scss output when outputComments is enabled', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      outputComments: true,
    });

    const format = StyleDictionary.getFormat('scss/static-tokens');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'layout-site-max-width',
            value: '1200px',
            description: 'Default page container width',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain(
      '/* Default page container width */\n$layout_site_max_width: 1200px;'
    );
  });

  it('supports declarative scss include/exclude prefix filters', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      filters: {
        scss: {
          includePrefixes: ['layout-', 'theme-'],
          excludePrefixes: ['theme-'],
        },
      },
    });

    const format = StyleDictionary.getFormat('scss/static-tokens');
    const output = format?.({
      dictionary: {
        allTokens: [
          { name: 'layout-breakpoints-tablet', value: '768px', attributes: {} },
          { name: 'theme-surface-base', value: '#fff', attributes: {} },
          { name: 'spacing-md', value: '1rem', attributes: {} },
        ],
      },
    });

    expect(output).toContain('$layout_breakpoints_tablet: 768px;');
    expect(output).not.toContain('$theme_surface_base: #fff;');
    expect(output).not.toContain('$spacing_md: 1rem;');
  });

  it('supports predicate scss filters', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      filters: {
        scss: (token) => token.name.startsWith('layout-'),
      },
    });

    const format = StyleDictionary.getFormat('scss/static-tokens');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'layout-breakpoints-desktop',
            value: '1024px',
            attributes: {},
          },
          { name: 'spacing-md', value: '1rem', attributes: {} },
        ],
      },
    });

    expect(output).toContain('$layout_breakpoints_desktop: 1024px;');
    expect(output).not.toContain('$spacing_md: 1rem;');
  });

  it('supports css filters without changing variable naming', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
      filters: {
        css: {
          includePrefixes: ['layout-'],
        },
      },
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          { name: 'layout-site-max-width', value: '1200px', attributes: {} },
          { name: 'spacing-md', value: '1rem', attributes: {} },
        ],
      },
    });

    expect(output).toContain('--themeshift-layout-site-max-width: 1200px;');
    expect(output).not.toContain('--themeshift-spacing-md: 1rem;');
  });

  it('supports meta filters consistently for paths and values manifests', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      filters: {
        meta: {
          includePrefixes: ['layout-'],
        },
      },
    });

    const pathsFormat = StyleDictionary.getFormat('token/paths-ts');
    const valuesFormat = StyleDictionary.getFormat('token/values-ts');
    const dictionary = {
      allTokens: [
        {
          name: 'layout-site-max-width',
          path: ['layout', 'site', 'maxWidth'],
          value: '1200px',
          attributes: {},
        },
        {
          name: 'spacing-md',
          path: ['spacing', 'md'],
          value: '1rem',
          attributes: {},
        },
      ],
    };

    const pathsOutput = pathsFormat?.({ dictionary });
    const valuesOutput = valuesFormat?.({ dictionary });

    expect(pathsOutput).toContain('"layout.site.maxWidth"');
    expect(pathsOutput).not.toContain('"spacing.md"');
    expect(valuesOutput).toContain('"layout.site.maxWidth": "1200px"');
    expect(valuesOutput).not.toContain('"spacing.md": "1rem"');
  });

  it('does not emit print theme output by default', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'theme-surface-base',
            value: '#fff',
            attributes: { theme: 'light' },
          },
          {
            name: 'theme-surface-base',
            value: '#f5f5f5',
            attributes: { theme: 'print' },
          },
        ],
      },
    });

    expect(output).not.toContain(":root[data-theme='print']");
    expect(output).not.toContain('@media print');
  });

  it('does not duplicate themed tokens into :root when defaultTheme is unset', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'theme-surface-base',
            value: '#fff',
            attributes: { theme: 'light' },
          },
        ],
      },
    });

    expect(output).not.toContain(':root {\n  /* Theme */');
    expect(output).toContain(":root[data-theme='light'] {\n  /* Theme */");
  });

  it('duplicates light theme tokens into :root when defaultTheme is light', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      defaultTheme: 'light',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'theme-surface-base',
            value: '#fff',
            attributes: { theme: 'light' },
          },
          {
            name: 'theme-surface-base',
            value: '#111',
            attributes: { theme: 'dark' },
          },
        ],
      },
    });

    expect(output).toContain(
      ':root {\n  /* Theme */\n  --theme-surface-base: #fff;'
    );
    expect(output).toContain(
      ":root[data-theme='light'] {\n  /* Theme */\n  --theme-surface-base: #fff;"
    );
    expect(output).toContain(
      ":root[data-theme='dark'] {\n  /* Theme */\n  --theme-surface-base: #111;"
    );
  });

  it('duplicates dark theme tokens into :root when defaultTheme is dark', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      defaultTheme: 'dark',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'theme-surface-base',
            value: '#fff',
            attributes: { theme: 'light' },
          },
          {
            name: 'theme-surface-base',
            value: '#111',
            attributes: { theme: 'dark' },
          },
        ],
      },
    });

    expect(output).toContain(
      ':root {\n  /* Theme */\n  --theme-surface-base: #111;'
    );
    expect(output).toContain(
      ":root[data-theme='light'] {\n  /* Theme */\n  --theme-surface-base: #fff;"
    );
    expect(output).toContain(
      ":root[data-theme='dark'] {\n  /* Theme */\n  --theme-surface-base: #111;"
    );
  });

  it('lets the selected default theme win in :root when names collide with base tokens', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      defaultTheme: 'dark',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'components-button-surface-base',
            value: '#eee',
            attributes: {},
          },
          {
            name: 'components-button-surface-base',
            value: '#111',
            attributes: { theme: 'dark' },
          },
        ],
      },
    });

    expect(output).toContain(
      ':root {\n  /* Components */\n  --components-button-surface-base: #eee;\n  --components-button-surface-base: #111;'
    );
  });

  it('respects cssVarPrefix for defaultTheme fallback output', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
      defaultTheme: 'light',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'components-button-surface-base',
            value: '#eee',
            attributes: { theme: 'light' },
          },
        ],
      },
    });

    expect(output).toContain(
      ':root {\n  /* Components */\n  --themeshift-components-button-surface-base: #eee;'
    );
  });

  it('does not emit print fallback blocks when only defaultTheme is set', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      defaultTheme: 'light',
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'theme-surface-base',
            value: '#fff',
            attributes: { theme: 'light' },
          },
          {
            name: 'theme-surface-base',
            value: '#f5f5f5',
            attributes: { theme: 'print' },
          },
        ],
      },
    });

    expect(output).not.toContain(":root[data-theme='print']");
    expect(output).not.toContain('@media print');
  });

  it('emits print theme output when outputPrintTheme is true', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      outputPrintTheme: true,
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'theme-surface-base',
            value: '#fff',
            attributes: { theme: 'light' },
          },
          {
            name: 'theme-surface-base',
            value: '#f5f5f5',
            attributes: { theme: 'print' },
          },
        ],
      },
    });

    expect(output).toContain(":root[data-theme='print']");
    expect(output).toContain('@media print');
  });

  it('groups accessibility tokens into the Accessibility bucket', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'a11y-focus-ring-color',
            value: '#005fcc',
            attributes: {},
          },
          {
            name: 'accessibility-outline-width',
            value: '2px',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain('/* Accessibility */');
    expect(output).toContain('--a11y-focus-ring-color: #005fcc;');
    expect(output).toContain('--accessibility-outline-width: 2px;');
  });

  it('groups color tokens into the Colors bucket by default', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'color-brand-primary',
            value: '#005fcc',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain('/* Colors */');
    expect(output).toContain('--color-brand-primary: #005fcc;');
  });

  it('groups typography-prefixed tokens into the Typography bucket by default', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'typography-body-md',
            value: '400 1rem/1.5 Inter',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain('/* Typography */');
    expect(output).toContain('--typography-body-md: 400 1rem/1.5 Inter;');
  });

  it('groups component and components namespaces into the Components bucket', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    expect(format).toBeTypeOf('function');

    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'theme-surface-base',
            value: '#fff',
            attributes: { theme: 'light' },
          },
          {
            name: 'component-button-text',
            value: '#111',
            attributes: { theme: 'light' },
          },
          {
            name: 'components-button-surface-base',
            value: '#ccc',
            attributes: { theme: 'light' },
          },
        ],
      },
    });

    expect(output).toContain('/* Theme */');
    expect(output).toContain('/* Components */');
    expect(output).toContain('--component-button-text: #111;');
    expect(output).toContain('--components-button-surface-base: #ccc;');
    expect(output).not.toContain(
      '/* Other */\n  --components-button-surface-base'
    );
  });

  it('groups unmatched tokens into the Other bucket by default', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'text-style-title',
            value: '400 1.25rem/1.3 Inter',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain('/* Other */');
    expect(output).toContain('--text-style-title: 400 1.25rem/1.3 Inter;');
  });

  it('supports custom css groups with first-match-wins ordering', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      groups: [
        {
          label: 'Buttons',
          match: (name) => name.startsWith('components-button-'),
        },
        {
          label: 'Components',
          match: (name) => name.startsWith('components-'),
        },
        { label: 'Other', match: (_name) => true },
      ],
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'components-button-text',
            value: '#111',
            attributes: {},
          },
          {
            name: 'components-card-surface',
            value: '#fff',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain(
      '/* Buttons */\n  --components-button-text: #111;'
    );
    expect(output).toContain(
      '/* Components */\n  --components-card-surface: #fff;'
    );
    expect(output).not.toContain(
      '/* Components */\n  --components-button-text: #111;'
    );
  });

  it('keeps grouping based on raw token names when cssVarPrefix is set', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary, {
      cssVarPrefix: 'themeshift',
      groups: [
        {
          label: 'Components',
          match: (name) => name.startsWith('components-'),
        },
        { label: 'Other', match: (_name) => true },
      ],
    });

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'components-button-text',
            value: '#111',
            attributes: {},
          },
        ],
      },
    });

    expect(output).toContain('/* Components */');
    expect(output).toContain('--themeshift-components-button-text: #111;');
    expect(output).not.toContain('--components-button-text: #111;');
  });

  it('emits mixed component namespaces into base and themed blocks', () => {
    const StyleDictionary = makeStyleDictionaryMock();
    registerStyleDictionaryThings(StyleDictionary);

    const format = StyleDictionary.getFormat('css/variables-modes-grouped');
    expect(format).toBeTypeOf('function');

    const output = format?.({
      dictionary: {
        allTokens: [
          {
            name: 'components-button-padding',
            value: '1rem 2rem 0',
            attributes: {},
          },
          {
            name: 'components-button-surface-base',
            value: '#ccc',
            attributes: { theme: 'light' },
          },
          {
            name: 'components-button-surface-base',
            value: 'hotpink',
            attributes: { theme: 'dark' },
          },
        ],
      },
    });

    expect(output).toContain(
      ':root {\n  /* Components */\n  --components-button-padding: 1rem 2rem 0;'
    );
    expect(output).toContain(
      ":root[data-theme='light'] {\n  /* Components */\n  --components-button-surface-base: #ccc;"
    );
    expect(output).toContain(
      ":root[data-theme='dark'] {\n  /* Components */\n  --components-button-surface-base: hotpink;"
    );
    expect(output).not.toContain(
      ":root[data-theme='light'] {\n  /* Components */\n  --components-button-padding: 1rem 2rem 0;"
    );
    expect(output).not.toContain(
      ":root[data-theme='print'] {\n    --components-button-padding: 1rem 2rem 0;"
    );
  });

  it('emits hybrid token paths from authored json through real Style Dictionary builds', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'themeshift-sd-'));
    tempRoots.push(root);

    await fs.mkdir(path.join(root, 'tokens'), { recursive: true });
    await fs.writeFile(
      path.join(root, 'tokens', 'theme.json'),
      JSON.stringify(
        {
          color: {
            blue: {
              300: { $value: '#7986CB', $type: 'color' },
              400: { $value: '#5C6BC0', $type: 'color' },
            },
          },
          components: {
            button: {
              light: {
                intents: {
                  primary: {
                    bg: {
                      $value: '{color.blue.400}',
                      hover: {
                        $value:
                          'lighten({components.button.light.intents.primary.bg}, 0.1)',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        null,
        2
      )
    );

    const previousCwd = process.cwd();
    process.chdir(root);

    try {
      registerStyleDictionaryThings(StyleDictionary, {
        cssVarPrefix: 'themeshift',
      });

      const sd = new StyleDictionary(makeStyleDictionaryConfig());
      await sd.buildPlatform('css');
      await sd.buildPlatform('meta');

      const cssOutput = await fs.readFile(
        path.join(root, 'src', 'css', 'tokens.css'),
        'utf8'
      );
      const valuesOutput = await fs.readFile(
        path.join(root, 'src', 'design-tokens', 'token-values.json'),
        'utf8'
      );

      expect(cssOutput).toContain(
        '--themeshift-components-button-intents-primary-bg: #5C6BC0;'
      );
      expect(cssOutput).toContain(
        '--themeshift-components-button-intents-primary-bg-hover: #6c7ac6;'
      );
      expect(valuesOutput).toContain(
        '"components.button.light.intents.primary.bg.hover": "#6c7ac6"'
      );
    } finally {
      process.chdir(previousCwd);
    }
  });
});
