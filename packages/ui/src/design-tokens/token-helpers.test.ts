import { describe, expect, it } from 'vitest';
import { token, tokenValue } from '@themeshift/vite-plugin-themeshift/token';

import { tokenValues } from './token-values';

describe('ThemeShift token helpers', () => {
  it('reads authored token values from the generated manifest', () => {
    expect(tokenValue('space.4', { values: tokenValues })).toBe('1rem');
    expect(tokenValue('grid.gutter.desktop', { values: tokenValues })).toBe(
      '1.5rem'
    );
    expect(
      tokenValue('layout.breakpoints.tablet', { values: tokenValues })
    ).toBe('768px');
    expect(
      tokenValue('typography.scales.7.bold', { values: tokenValues })
    ).toEqual({
      fontFamily:
        "'Noto Sans Variable', 'Helvetica Neue', Arial, system-ui, sans-serif",
      fontSize: '3rem',
      lineHeight: '3.375rem',
      fontWeight: '700',
    });
    expect(
      tokenValue('typography.scales.1.regular', { values: tokenValues })
    ).toEqual({
      fontFamily:
        "'Noto Sans Variable', 'Helvetica Neue', Arial, system-ui, sans-serif",
      fontSize: '1rem',
      lineHeight: '1.375rem',
      fontWeight: '400',
    });
    expect(
      tokenValue('typography.scales.-1.semiBold', { values: tokenValues })
    ).toEqual({
      fontFamily:
        "'Noto Sans Variable', 'Helvetica Neue', Arial, system-ui, sans-serif",
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '600',
    });
    expect(
      tokenValue('typography.styles.body.default.font', { values: tokenValues })
    ).toEqual({
      fontFamily:
        "'Noto Sans Variable', 'Helvetica Neue', Arial, system-ui, sans-serif",
      fontSize: '1rem',
      lineHeight: '1.375rem',
      fontWeight: '400',
    });
    expect(
      tokenValue('typography.styles.heading.h1.display.font', {
        values: tokenValues,
      })
    ).toEqual({
      fontFamily: 'Georgia, serif',
      fontSize: '1.5rem',
      lineHeight: '2.25rem',
      fontWeight: '700',
    });
    expect(
      tokenValue('typography.styles.body.italic.fontStyle', {
        values: tokenValues,
      })
    ).toBe('italic');
  });

  it('returns undefined for missing authored token values', () => {
    expect(
      tokenValue('theme.text.base', { values: tokenValues })
    ).toBeUndefined();
    expect(tokenValue('layout.breakpoints.tablet')).toBeUndefined();
  });

  it('reads computed CSS variable values from the document root by default', () => {
    document.documentElement.style.setProperty(
      '--themeshift-theme-text-base',
      '#123456'
    );

    expect(token('theme.text.base', { prefix: 'themeshift' })).toBe('#123456');
  });

  it('reads computed CSS variable values from an explicit element target', () => {
    const element = document.createElement('div');
    element.style.setProperty(
      '--themeshift-layout-breakpoints-desktop',
      '1024px'
    );
    document.body.appendChild(element);

    expect(
      token('layout.breakpoints.desktop', {
        prefix: 'themeshift',
        target: element,
      })
    ).toBe('1024px');
  });

  it('resolves a shadow root target through its host element', () => {
    const host = document.createElement('div');
    host.style.setProperty(
      '--themeshift-accessibility-focus-ring-width',
      '3px'
    );
    document.body.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: 'open' });

    expect(
      token('accessibility.focus.ringWidth', {
        prefix: 'themeshift',
        target: shadowRoot,
      })
    ).toBe('3px');
  });

  it('supports consuming typography shorthand and matching letter spacing tokens together', () => {
    document.documentElement.style.setProperty(
      '--themeshift-typography-scales-1-regular',
      "400 1rem/1.375rem 'Noto Sans Variable', 'Helvetica Neue', Arial, system-ui, sans-serif"
    );
    document.documentElement.style.setProperty(
      '--themeshift-typography-metrics-1-letter-spacing',
      '0.01em'
    );

    const element = document.createElement('p');
    element.style.font = token('typography.scales.1.regular', {
      prefix: 'themeshift',
    });
    element.style.letterSpacing = token('typography.metrics.1.letterSpacing', {
      prefix: 'themeshift',
    });

    expect(element.style.font).toContain('1rem');
    expect(element.style.letterSpacing).toBe('0.01em');
  });

  it('supports semantic typography style tokens including font style', () => {
    document.documentElement.style.setProperty(
      '--themeshift-typography-styles-body-default-font',
      "400 1rem/1.375rem 'Noto Sans Variable', 'Helvetica Neue', Arial, system-ui, sans-serif"
    );
    document.documentElement.style.setProperty(
      '--themeshift-typography-styles-body-default-letter-spacing',
      '0.01em'
    );
    document.documentElement.style.setProperty(
      '--themeshift-typography-styles-body-default-font-style',
      'normal'
    );

    const element = document.createElement('p');
    element.style.font = token('typography.styles.body.default.font', {
      prefix: 'themeshift',
    });
    element.style.letterSpacing = token(
      'typography.styles.body.default.letterSpacing',
      {
        prefix: 'themeshift',
      }
    );
    element.style.fontStyle = token(
      'typography.styles.body.default.fontStyle',
      {
        prefix: 'themeshift',
      }
    );

    expect(element.style.font).toContain('1rem');
    expect(element.style.letterSpacing).toBe('0.01em');
    expect(element.style.fontStyle).toBe('normal');
  });
});
