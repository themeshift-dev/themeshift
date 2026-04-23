import { describe, expect, it } from 'vitest';

import {
  makeSassTokenInjection,
  mergeScssAdditionalData,
} from '../src/sassTokenInjection';

describe('sass token injection helpers', () => {
  it('normalizes css var prefix for injected token defaults', () => {
    const injection = makeSassTokenInjection('--theme_shift--');

    expect(injection.prelude).toContain(
      '$theme-shift-default-css-var-prefix: "theme-shift"'
    );
    expect(injection.body).toContain(
      '@function token($path, $cssVarPrefix: null)'
    );
  });

  it('merges with existing additionalData function', () => {
    const injection = makeSassTokenInjection('themeshift');
    const existing = (source: string, filename: string) => {
      expect(filename).toBe('Button.module.scss');
      return `@use 'sass:map';\n${source}`;
    };

    const merge = mergeScssAdditionalData(existing, injection);
    const output = merge(
      '.button { color: token("text.primary"); }\n',
      'Button.module.scss'
    );

    expect(output).toContain('@use "sass:string" as _themeShiftString;');
    expect(output).toContain("@use 'sass:map';");
    expect(output).toContain('.button { color: token("text.primary"); }');
  });

  it('merges with existing additionalData string', () => {
    const injection = makeSassTokenInjection();
    const merge = mergeScssAdditionalData("@use 'sass:color';\n", injection);

    const output = merge(
      '.button { color: token("text.primary"); }\n',
      'x.scss'
    );

    expect(output).toContain('@use "sass:string" as _themeShiftString;');
    expect(output).toContain("@use 'sass:color';");
    expect(output).toContain('.button { color: token("text.primary"); }');
  });
});
