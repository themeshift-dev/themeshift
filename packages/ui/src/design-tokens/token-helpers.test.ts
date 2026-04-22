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
      tokenValue('layout.breakpoint.tablet', { values: tokenValues })
    ).toBe('768px');
    expect(
      tokenValue('typography.heading.large.font', { values: tokenValues })
    ).toEqual({
      fontFamily:
        "'Inter Variable', 'Helvetica Neue', Arial, system-ui, sans-serif",
      fontSize: '1.5rem',
      lineHeight: '2.25rem',
      fontWeight: '700',
    });
    expect(
      tokenValue('typography.body.medium.font', { values: tokenValues })
    ).toEqual({
      fontFamily:
        "'Inter Variable', 'Helvetica Neue', Arial, system-ui, sans-serif",
      fontSize: '1rem',
      lineHeight: '1.375rem',
      fontWeight: '400',
    });
    expect(
      tokenValue('typography.heading.displayLarge.font', {
        values: tokenValues,
      })
    ).toEqual({
      fontFamily: 'Georgia, serif',
      fontSize: '1.5rem',
      lineHeight: '2.25rem',
      fontWeight: '700',
    });
    expect(
      tokenValue('typography.body.mediumItalic.fontStyle', {
        values: tokenValues,
      })
    ).toBe('italic');
  });

  it('returns undefined for missing authored token values', () => {
    expect(tokenValue('text.base', { values: tokenValues })).toBeUndefined();
    expect(tokenValue('layout.breakpoint.tablet')).toBeUndefined();
  });

  it('reads computed CSS variable values from the document root by default', () => {
    document.documentElement.style.setProperty(
      '--themeshift-text-primary',
      '#123456'
    );

    expect(token('text.primary', { prefix: 'themeshift' })).toBe('#123456');
  });

  it('reads computed CSS variable values from an explicit element target', () => {
    const element = document.createElement('div');
    element.style.setProperty(
      '--themeshift-layout-breakpoint-desktop',
      '1024px'
    );
    document.body.appendChild(element);

    expect(
      token('layout.breakpoint.desktop', {
        prefix: 'themeshift',
        target: element,
      })
    ).toBe('1024px');
  });

  it('resolves a shadow root target through its host element', () => {
    const host = document.createElement('div');
    host.style.setProperty('--themeshift-focus-ring-width', '3px');
    document.body.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: 'open' });

    expect(
      token('focus.ring.width', {
        prefix: 'themeshift',
        target: shadowRoot,
      })
    ).toBe('3px');
  });

  it('supports consuming typography shorthand and matching letter spacing tokens together', () => {
    document.documentElement.style.setProperty(
      '--themeshift-typography-body-medium-font',
      "400 1rem/1.375rem 'Inter Variable', 'Helvetica Neue', Arial, system-ui, sans-serif"
    );
    document.documentElement.style.setProperty(
      '--themeshift-typography-body-medium-letter-spacing',
      '0.01em'
    );

    const element = document.createElement('p');
    element.style.font = token('typography.body.medium.font', {
      prefix: 'themeshift',
    });
    element.style.letterSpacing = token(
      'typography.body.medium.letterSpacing',
      {
        prefix: 'themeshift',
      }
    );

    expect(element.style.font).toContain('1rem');
    expect(element.style.letterSpacing).toBe('0.01em');
  });

  it('supports semantic typography style tokens including font style', () => {
    document.documentElement.style.setProperty(
      '--themeshift-typography-body-medium-font',
      "400 1rem/1.375rem 'Inter Variable', 'Helvetica Neue', Arial, system-ui, sans-serif"
    );
    document.documentElement.style.setProperty(
      '--themeshift-typography-body-medium-letter-spacing',
      '0.01em'
    );
    document.documentElement.style.setProperty(
      '--themeshift-typography-body-medium-font-style',
      'normal'
    );

    const element = document.createElement('p');
    element.style.font = token('typography.body.medium.font', {
      prefix: 'themeshift',
    });
    element.style.letterSpacing = token(
      'typography.body.medium.letterSpacing',
      {
        prefix: 'themeshift',
      }
    );
    element.style.fontStyle = token('typography.body.medium.fontStyle', {
      prefix: 'themeshift',
    });

    expect(element.style.font).toContain('1rem');
    expect(element.style.letterSpacing).toBe('0.01em');
    expect(element.style.fontStyle).toBe('normal');
  });
});
