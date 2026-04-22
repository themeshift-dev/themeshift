import { afterEach, describe, expect, it, vi } from 'vitest';

import { token, tokenValue } from '../src/token';

describe('token runtime helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads computed CSS variable values from document.documentElement by default', () => {
    const documentElement = {} as Element;
    const getPropertyValue = vi.fn((name: string) =>
      name === '--themeshift-text-primary' ? ' #0f172a ' : ''
    );

    vi.stubGlobal('document', { documentElement });
    vi.stubGlobal('Element', class {});
    vi.stubGlobal('Document', class {});
    vi.stubGlobal('ShadowRoot', class {});
    vi.stubGlobal(
      'getComputedStyle',
      vi.fn(() => ({ getPropertyValue }))
    );

    expect(token('text.primary', { prefix: 'themeshift' })).toBe('#0f172a');
  });

  it('supports an explicit element target', () => {
    class TestElement {}
    const element = new TestElement() as unknown as Element;
    const getPropertyValue = vi.fn((name: string) =>
      name === '--text-primary' ? ' #111 ' : ''
    );

    vi.stubGlobal('document', { documentElement: {} });
    vi.stubGlobal('Element', TestElement);
    vi.stubGlobal('Document', class {});
    vi.stubGlobal('ShadowRoot', class {});
    vi.stubGlobal(
      'getComputedStyle',
      vi.fn((target: Element) => {
        expect(target).toBe(element);
        return { getPropertyValue };
      })
    );

    expect(token('text.primary', { target: element })).toBe('#111');
  });

  it('supports an explicit document target', () => {
    class TestDocument {
      documentElement = { id: 'root-element' } as Element;
    }

    const documentTarget = new TestDocument() as unknown as Document;
    const getPropertyValue = vi.fn((name: string) =>
      name === '--text-primary' ? ' #222 ' : ''
    );

    vi.stubGlobal('document', { documentElement: {} });
    vi.stubGlobal('Element', class {});
    vi.stubGlobal('Document', TestDocument);
    vi.stubGlobal('ShadowRoot', class {});
    vi.stubGlobal(
      'getComputedStyle',
      vi.fn((target: Element) => {
        expect(target).toBe(documentTarget.documentElement);
        return { getPropertyValue };
      })
    );

    expect(token('text.primary', { target: documentTarget })).toBe('#222');
  });

  it('supports a shadow root target by reading from its host element', () => {
    class TestElement {}
    class TestShadowRoot {
      constructor(public host: Element) {}
    }

    const host = new TestElement() as unknown as Element;
    const shadowRoot = new TestShadowRoot(host) as unknown as ShadowRoot;
    const getPropertyValue = vi.fn((name: string) =>
      name === '--text-primary' ? ' #333 ' : ''
    );

    vi.stubGlobal('document', { documentElement: {} });
    vi.stubGlobal('Element', TestElement);
    vi.stubGlobal('Document', class {});
    vi.stubGlobal('ShadowRoot', TestShadowRoot);
    vi.stubGlobal(
      'getComputedStyle',
      vi.fn((target: Element) => {
        expect(target).toBe(host);
        return { getPropertyValue };
      })
    );

    expect(token('text.primary', { target: shadowRoot })).toBe('#333');
  });

  it('returns undefined for missing computed CSS variable values', () => {
    const documentElement = {} as Element;

    vi.stubGlobal('document', { documentElement });
    vi.stubGlobal('Element', class {});
    vi.stubGlobal('Document', class {});
    vi.stubGlobal('ShadowRoot', class {});
    vi.stubGlobal(
      'getComputedStyle',
      vi.fn(() => ({ getPropertyValue: vi.fn(() => '   ') }))
    );

    expect(token('text.primary')).toBeUndefined();
  });

  it('returns undefined when no DOM target is available', () => {
    vi.stubGlobal('Element', class {});
    vi.stubGlobal('Document', class {});
    vi.stubGlobal('ShadowRoot', class {});

    expect(token('text.primary')).toBeUndefined();
  });

  it('returns authored token values from the provided manifest', () => {
    const values = {
      'color.brand.primary': '#005fcc',
      'text.style.title': {
        fontFamily: '"Roboto Slab", Georgia, serif',
        fontSize: '1.25rem',
        lineHeight: '1.3',
        fontWeight: '400',
      },
    };

    expect(tokenValue('color.brand.primary', { values })).toBe('#005fcc');
    expect(tokenValue('text.style.title', { values })).toEqual(
      values['text.style.title']
    );
  });

  it('returns undefined for missing authored token values', () => {
    expect(tokenValue('missing.path', { values: {} })).toBeUndefined();
  });
});
