import { describe, expect, it, vi } from 'vitest';

import {
  makeSassTokenInjection,
  mergeScssAdditionalData,
} from '../src/sassTokenInjection';

describe('makeSassTokenInjection', () => {
  it('normalizes the configured CSS variable prefix in the generated prelude', () => {
    const injection = makeSassTokenInjection('  --theme_shift--  ');

    expect(injection.prelude).toContain(
      '$theme-shift-default-css-var-prefix: "theme-shift"'
    );
    expect(injection.body).toContain(
      '@function token($path, $cssVarPrefix: null)'
    );
  });

  it('uses null as the default prefix when one is not provided', () => {
    const injection = makeSassTokenInjection();

    expect(injection.prelude).toContain(
      '$theme-shift-default-css-var-prefix: null'
    );
  });
});

describe('mergeScssAdditionalData', () => {
  it('prepends existing string additionalData before the source and merges directives', () => {
    const injection = makeSassTokenInjection('themeshift');
    const merge = mergeScssAdditionalData('@charset "UTF-8";\n', injection);

    const output = merge(
      '@use "sass:math";\n.button { color: red; }\n',
      'styles.scss'
    );

    expect(
      output.startsWith('@use "sass:string" as _themeShiftString;\n')
    ).toBe(true);
    expect(output).toContain('@charset "UTF-8";');
    expect(output).toContain('@use "sass:math";');
    expect(output).toContain('@function token($path, $cssVarPrefix: null)');
    expect(output).toContain('.button { color: red; }');
  });

  it('supports function additionalData and passes filename/source through', () => {
    const additionalData = vi.fn((source: string, filename: string) => {
      expect(filename).toBe('tokens.scss');
      return `// ${filename}\n${source}`;
    });

    const injection = makeSassTokenInjection('themeshift');
    const merge = mergeScssAdditionalData(additionalData, injection);
    const output = merge('.chip { color: blue; }\n', 'tokens.scss');

    expect(additionalData).toHaveBeenCalledWith(
      '.chip { color: blue; }\n',
      'tokens.scss'
    );
    expect(output).toContain('// tokens.scss');
    expect(output).toContain('.chip { color: blue; }');
  });

  it('returns merged output when no existing additionalData is configured', () => {
    const injection = makeSassTokenInjection('themeshift');
    const merge = mergeScssAdditionalData(undefined, injection);

    const output = merge('.stack { gap: 1rem; }\n', 'stack.scss');

    expect(output).toContain('@use "sass:string" as _themeShiftString;');
    expect(output).toContain('.stack { gap: 1rem; }');
  });
});
