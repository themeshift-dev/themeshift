type ThemeShiftToken = {
  path?: string[];
  value?: unknown;
  $value?: unknown;
  original?: {
    value?: unknown;
    $value?: unknown;
  };
};

type ColorChannel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type ExpressionNode =
  | { kind: 'reference'; path: string }
  | { kind: 'function'; name: string; args: ExpressionNode[] }
  | { kind: 'literal'; value: string };

type NestedTokenValue = {
  $value?: unknown;
  value?: unknown;
  $type?: unknown;
  type?: unknown;
  [key: string]: unknown;
};

const SUPPORTED_COLOR_FUNCTION_NAMES = new Set([
  'mix',
  'lighten',
  'darken',
  'alpha',
]);

/**
 * Matches a token reference that occupies the entire string.
 *
 * Examples:
 * - `{color.blue.400}`
 * - `{components.button.intents.primary.hover}`
 *
 * Used by `parseExpression()` to distinguish a standalone token reference from
 * a literal string or function call expression.
 */
const REFERENCE_PATTERN = /^\{([^}]+)\}$/;

/**
 * Matches a function-like expression with a lowercase identifier followed by a
 * parenthesized argument list.
 *
 * Examples:
 * - `lighten({color.blue.300}, 0.1)`
 * - `mix({color.blue.400}, {color.white}, 0.25)`
 * - `rgba(0, 0, 0, 0.5)`
 *
 * Used by `parseExpression()` and `isExpressionString()` as a first-pass shape
 * check before the resolver narrows that match down to ThemeShift's supported
 * helper names. CSS color functions like `rgba(...)` match this pattern but
 * are intentionally treated as plain literals later.
 */
const FUNCTION_PATTERN = /^([a-z]+)\((.*)\)$/;

/**
 * Matches token references embedded anywhere inside a larger string.
 *
 * Examples:
 * - `0 {space.4}`
 * - `1px solid {color.blue.400}`
 *
 * Used by `resolveString()` to replace inline references inside composite
 * values without treating the whole string as a color-expression function.
 */
const INLINE_REFERENCE_PATTERN = /\{([^}]+)\}/g;

/**
 * Matches strings that look like the start of a function call.
 *
 * Examples:
 * - `lighten(`
 * - `mix({color.blue.400}, {color.white}, 0.25`
 *
 * Used by `looksLikeSupportedExpressionStart()` to detect malformed uses of
 * ThemeShift's custom helper names. CSS functions like `rgba(...)` are not
 * considered malformed expressions and should continue to pass through as
 * literal color strings.
 */
const FUNCTION_LIKE_PATTERN = /^[a-z]+\(/;
const CSS_COLOR_FUNCTION_NAMES = new Set(['rgb', 'rgba', 'hsl', 'hsla']);

/**
 * Returns a stable dot-path for a token when path segments are available.
 *
 * This is used as the canonical lookup key for reference resolution, caching,
 * and error reporting throughout the resolver.
 *
 * Examples:
 * - `['color', 'blue', '400']` -> `color.blue.400`
 * - `undefined` -> `null`
 */
function getTokenPath(token: ThemeShiftToken) {
  return Array.isArray(token.path) ? token.path.join('.') : null;
}

/**
 * Returns the best raw token value to use as the resolver input.
 *
 * The resolver prefers `original` string values so expressions like
 * `lighten({color.blue.300}, 0.1)` can be parsed before any upstream
 * transformation strips that intent away. For object values such as typography
 * tokens, it preserves the already-shaped object so existing non-color tokens
 * continue to work unchanged.
 *
 * Examples:
 * - original string expression -> `lighten({color.blue.300}, 0.1)`
 * - typography token object -> `{ fontFamily: 'Inter', fontSize: '1rem' }`
 */
function getRawTokenValue(token: ThemeShiftToken) {
  const originalValue =
    token.original?.$value !== undefined
      ? token.original.$value
      : token.original?.value;

  if (typeof originalValue === 'string') {
    return originalValue;
  }

  if (typeof token.value === 'object' && token.value !== null) {
    return token.value;
  }

  if (token.original && typeof token.original === 'object') {
    if ('$value' in token.original) {
      return token.original.$value;
    }

    if ('value' in token.original) {
      return token.original.value;
    }
  }

  if ('$value' in token) {
    return token.$value;
  }

  return token.value;
}

/**
 * Serializes a normalized RGBA color into the output format used by generated
 * token artifacts.
 *
 * Fully opaque colors are emitted as lowercase hex strings. Colors with
 * transparency are emitted as `rgba(...)` strings with a trimmed alpha value.
 *
 * Examples:
 * - `{ r: 92, g: 107, b: 192, a: 1 }` -> `#5c6bc0`
 * - `{ r: 133, g: 144, b: 208, a: 0.5 }` -> `rgba(133, 144, 208, 0.5)`
 */
function formatColor(color: ColorChannel) {
  const r = Math.round(color.r);
  const g = Math.round(color.g);
  const b = Math.round(color.b);
  const alpha = clamp(color.a, 0, 1);

  if (alpha >= 1) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(alpha)})`;
}

/**
 * Converts a channel value into a two-character hexadecimal string.
 *
 * Examples:
 * - `0` -> `00`
 * - `255` -> `ff`
 */
function toHex(value: number) {
  return Math.round(value).toString(16).padStart(2, '0');
}

/**
 * Formats an alpha value for stable CSS output.
 *
 * The output keeps up to three decimal places and trims trailing zeroes so
 * generated values stay compact and predictable.
 *
 * Examples:
 * - `0.5` -> `0.5`
 * - `0.125` -> `0.125`
 * - `1` -> `1`
 */
function formatAlpha(value: number) {
  return value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Converts an HSL color to normalized RGB channels.
 *
 * This is used so CSS `hsl(...)` and `hsla(...)` literals can be accepted by
 * the same color guard path as hex and RGB colors.
 *
 * Examples:
 * - `hslToRgb(0, 1, 0.5)` -> `{ r: 255, g: 0, b: 0 }`
 * - `hslToRgb(240, 1, 0.5)` -> `{ r: 0, g: 0, b: 255 }`
 */
function hslToRgb(h: number, s: number, l: number) {
  const hue = ((h % 360) + 360) % 360;
  const saturation = clamp(s, 0, 1);
  const lightness = clamp(l, 0, 1);

  if (saturation === 0) {
    const gray = lightness * 255;
    return { r: gray, g: gray, b: gray };
  }

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (huePrime >= 0 && huePrime < 1) {
    r1 = chroma;
    g1 = x;
  } else if (huePrime >= 1 && huePrime < 2) {
    r1 = x;
    g1 = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    g1 = chroma;
    b1 = x;
  } else if (huePrime >= 3 && huePrime < 4) {
    g1 = x;
    b1 = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    r1 = x;
    b1 = chroma;
  } else {
    r1 = chroma;
    b1 = x;
  }

  const match = lightness - chroma / 2;

  return {
    r: (r1 + match) * 255,
    g: (g1 + match) * 255,
    b: (b1 + match) * 255,
  };
}

/**
 * Clamps a number into the provided inclusive range.
 *
 * This keeps color channels inside `0..255` and alpha values inside `0..1`
 * even if an intermediate calculation overshoots slightly.
 *
 * Examples:
 * - `clamp(300, 0, 255)` -> `255`
 * - `clamp(-0.2, 0, 1)` -> `0`
 */
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Linearly interpolates one numeric channel toward another by the given amount.
 *
 * Examples:
 * - `mixChannel(0, 255, 0.5)` -> `127.5`
 * - `mixChannel(92, 255, 0.25)` -> `132.75`
 */
function mixChannel(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

/**
 * Mixes two RGBA colors by linearly interpolating each channel.
 *
 * This is the core primitive used by `mix()`, and also by `lighten()` and
 * `darken()` which mix toward white and black respectively.
 *
 * Examples:
 * - mix blue toward white by `0.25`
 * - mix a semi-transparent color toward black by `0.1`
 */
function mixColors(
  a: ColorChannel,
  b: ColorChannel,
  amount: number
): ColorChannel {
  return {
    r: mixChannel(a.r, b.r, amount),
    g: mixChannel(a.g, b.g, amount),
    b: mixChannel(a.b, b.b, amount),
    a: mixChannel(a.a, b.a, amount),
  };
}

/**
 * Parses a CSS color string into normalized RGBA channels.
 *
 * Supported formats are:
 * - `#rgb`
 * - `#rrggbb`
 * - `#rrggbbaa`
 * - `rgb(...)`
 * - `rgba(...)`
 * - `hsl(...)`
 * - `hsla(...)`
 * - `transparent`
 *
 * Invalid channel or percentage values cause the parse to fail. Unsupported
 * formats also return `null` so callers can raise a token-specific error.
 *
 * Examples:
 * - `#5C6BC0` -> `{ r: 92, g: 107, b: 192, a: 1 }`
 * - `rgba(255, 255, 255, .5)` -> `{ r: 255, g: 255, b: 255, a: 0.5 }`
 */
function parseColor(value: string): ColorChannel | null {
  const normalized = value.trim().toLowerCase();

  if (normalized === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  const hexMatch = normalized.match(
    /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
  );
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return {
        r: Number.parseInt(`${hex[0]}${hex[0]}`, 16),
        g: Number.parseInt(`${hex[1]}${hex[1]}`, 16),
        b: Number.parseInt(`${hex[2]}${hex[2]}`, 16),
        a: 1,
      };
    }

    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgbMatch = normalized.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*((?:\d+|\d*\.\d+)))?\s*\)$/
  );
  if (rgbMatch) {
    const [, r, g, b, a] = rgbMatch;
    const red = Number(r);
    const green = Number(g);
    const blue = Number(b);
    const alpha = a === undefined ? 1 : Number(a);

    if (
      red < 0 ||
      red > 255 ||
      green < 0 ||
      green > 255 ||
      blue < 0 ||
      blue > 255 ||
      alpha < 0 ||
      alpha > 1
    ) {
      return null;
    }

    return {
      r: red,
      g: green,
      b: blue,
      a: alpha,
    };
  }

  const hslMatch = normalized.match(
    /^hsla?\(\s*(-?(?:\d+|\d*\.\d+))(?:deg)?\s*,\s*((?:\d+|\d*\.\d+))%\s*,\s*((?:\d+|\d*\.\d+))%(?:\s*,\s*((?:\d+|\d*\.\d+)))?\s*\)$/
  );
  if (!hslMatch) {
    return null;
  }

  const [, h, s, l, a] = hslMatch;
  const saturation = Number(s);
  const lightness = Number(l);
  const alpha = a === undefined ? 1 : Number(a);

  if (
    saturation < 0 ||
    saturation > 100 ||
    lightness < 0 ||
    lightness > 100 ||
    alpha < 0 ||
    alpha > 1
  ) {
    return null;
  }

  const rgb = hslToRgb(Number(h), saturation / 100, lightness / 100);

  return {
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
    a: alpha,
  };
}

/**
 * Parses a raw expression string into a small expression tree.
 *
 * The parser recognizes three node types:
 * - standalone token references like `{color.blue.400}`
 * - function calls like `lighten({color.blue.300}, 0.1)`
 * - literal values such as `0.1` or `#fff`
 *
 * This parser is intentionally small and only supports the expression shapes
 * needed for ThemeShift color functions.
 *
 * Examples:
 * - `mix({color.blue.400}, {color.white}, 0.25)` -> function node
 * - `{color.blue.400}` -> reference node
 * - `0.25` -> literal node
 */
function parseExpression(input: string): ExpressionNode {
  const trimmed = input.trim();
  const referenceMatch = trimmed.match(REFERENCE_PATTERN);

  if (referenceMatch) {
    return { kind: 'reference', path: referenceMatch[1].trim() };
  }

  const functionMatch = trimmed.match(FUNCTION_PATTERN);
  if (functionMatch && isBalancedFunctionCall(trimmed)) {
    const [, name, argsSource] = functionMatch;
    return {
      kind: 'function',
      name,
      args: splitArguments(argsSource).map(parseExpression),
    };
  }

  return { kind: 'literal', value: trimmed };
}

/**
 * Returns whether a function-like string uses one of ThemeShift's supported
 * color helper names.
 *
 * This separates custom build-time expressions from ordinary CSS function
 * syntax such as `rgba(...)`, which should remain literal token values.
 *
 * Examples:
 * - `lighten({color.blue.300}, 0.1)` -> `true`
 * - `rgba(0, 0, 0, 0.5)` -> `false`
 */
function isSupportedFunctionName(name: string) {
  return SUPPORTED_COLOR_FUNCTION_NAMES.has(name);
}

/**
 * Returns whether a string looks like a malformed use of a supported ThemeShift
 * helper name.
 *
 * This is used to preserve strict errors for values like `lighten(` or
 * `mix({color.blue.400}, 0.25` without misclassifying CSS color functions.
 *
 * Examples:
 * - `lighten({color.blue.300}, 0.1` -> `true`
 * - `rgba(0, 0, 0, 0.5)` -> `false`
 */
function looksLikeSupportedExpressionStart(value: string) {
  const trimmed = value.trim();
  if (!FUNCTION_LIKE_PATTERN.test(trimmed)) {
    return false;
  }

  const nameMatch = trimmed.match(/^([a-z]+)\(/);
  return Boolean(nameMatch && isSupportedFunctionName(nameMatch[1]));
}

/**
 * Returns the lowercase function name for a balanced function-like string.
 *
 * Examples:
 * - `lighten({color.blue.300}, 0.1)` -> `lighten`
 * - `rgba(255, 255, 255, .7)` -> `rgba`
 * - `#fff` -> `null`
 */
function getFunctionName(value: string) {
  const functionMatch = value.trim().match(FUNCTION_PATTERN);
  return functionMatch ? functionMatch[1] : null;
}

/**
 * Returns whether a string looks like a CSS color function call that should be
 * treated as a literal color rather than a ThemeShift helper expression.
 *
 * This is used both as a safety guard and to produce clearer errors when a
 * token value resembles `rgb(...)` / `rgba(...)` / `hsl(...)` / `hsla(...)`
 * but does not parse as a valid color.
 *
 * Examples:
 * - `rgba(255, 255, 255, .7)` -> `true`
 * - `hsla(220, 50%, 40%, 0.5)` -> `true`
 * - `lighten({color.blue.300}, 0.1)` -> `false`
 */
function looksLikeCssColorFunction(value: string) {
  const functionName = getFunctionName(value);
  return Boolean(functionName && CSS_COLOR_FUNCTION_NAMES.has(functionName));
}

/**
 * Verifies that a function-like string has balanced parentheses and no trailing
 * content after the outermost closing parenthesis.
 *
 * This prevents partially closed expressions from being treated as valid
 * function calls.
 *
 * Examples:
 * - `lighten({color.blue.300}, 0.1)` -> `true`
 * - `lighten({color.blue.300}, 0.1` -> `false`
 * - `lighten(x) extra` -> `false`
 */
function isBalancedFunctionCall(input: string) {
  let depth = 0;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (char === '(') depth += 1;
    if (char === ')') {
      depth -= 1;
      if (depth < 0) {
        return false;
      }

      if (depth === 0 && index !== input.length - 1) {
        return false;
      }
    }
  }

  return depth === 0;
}

/**
 * Splits a comma-separated argument list while respecting nested function calls
 * and token reference braces.
 *
 * This allows expressions such as `alpha(mix(...), 0.5)` to be parsed without
 * incorrectly splitting inside nested structures.
 *
 * Examples:
 * - `'{color.blue.400}, {color.white}, 0.25'`
 * - `'mix({color.blue.400}, {color.white}, 0.25), 0.5'`
 */
function splitArguments(input: string) {
  if (!input.trim()) {
    return [];
  }

  const parts: string[] = [];
  let current = '';
  let parenDepth = 0;
  let braceDepth = 0;

  for (const char of input) {
    if (char === ',' && parenDepth === 0 && braceDepth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }

    if (char === '(') parenDepth += 1;
    if (char === ')') parenDepth -= 1;
    if (char === '{') braceDepth += 1;
    if (char === '}') braceDepth -= 1;
    current += char;
  }

  if (parenDepth !== 0 || braceDepth !== 0) {
    throw new Error(`Invalid expression syntax: ${input}`);
  }

  parts.push(current.trim());
  return parts;
}

/**
 * Returns whether a string represents a full supported function expression.
 *
 * This is stricter than "looks function-like": the string must match the
 * function pattern and have balanced parentheses.
 *
 * Examples:
 * - `lighten({color.blue.300}, 0.1)` -> `true`
 * - `lighten({color.blue.300}, 0.1` -> `false`
 * - `0 {space.4}` -> `false`
 */
function isExpressionString(value: string) {
  const trimmed = value.trim();
  const functionMatch = trimmed.match(FUNCTION_PATTERN);
  if (!functionMatch) {
    return false;
  }

  const [, name] = functionMatch;
  return isSupportedFunctionName(name) && isBalancedFunctionCall(trimmed);
}

/**
 * Parses an expression amount into a number constrained to ThemeShift's `0..1`
 * amount convention.
 *
 * Invalid or unsupported formats return `NaN`, allowing the caller to attach
 * a token-specific error message at the call site.
 *
 * Examples:
 * - `'0.25'` -> `0.25`
 * - `.1` -> `0.1`
 * - `'2'` -> `NaN`
 */
function parseAmount(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return Number.NaN;
  }

  const trimmed = value.trim();
  if (!/^(?:0|1|0?\.\d+|1\.0+)$/.test(trimmed)) {
    return Number.NaN;
  }

  return Number.parseFloat(trimmed);
}

/**
 * Recursively resolves token-like values so object-valued tokens such as
 * typography definitions can have their nested string references expanded.
 *
 * This is needed because Style Dictionary may expose composite `$value`
 * payloads as objects containing raw `{token.path}` strings rather than fully
 * resolved primitives.
 *
 * Examples:
 * - `{ fontWeight: '{font.weight.bold}' }` -> `{ fontWeight: '700' }`
 * - `['{color.white}', '{color.black}']` -> `['#fff', '#000']`
 */
function resolveNestedValue(
  value: unknown,
  resolveStringValue: (value: string) => string,
  originPath: string
): unknown {
  if (typeof value === 'string') {
    return resolveStringValue(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) =>
      resolveNestedValue(entry, resolveStringValue, originPath)
    );
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      resolveNestedValue(entry, resolveStringValue, originPath),
    ])
  );
}

/**
 * Returns whether an unknown value looks like a nested token node.
 *
 * Nested token nodes show up inside composite token `original` payloads, such
 * as `color.blue.400.fg`, even when Style Dictionary does not emit them as
 * separate entries in `allTokens`.
 *
 * Examples:
 * - `{ $value: '{color.white}' }` -> `true`
 * - `{ fontSize: '1rem' }` -> `false`
 */
function isNestedTokenValue(value: unknown): value is NestedTokenValue {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('$value' in value || 'value' in value)
  );
}

/**
 * Walks a token's `original` object and indexes nested sub-token values that
 * are addressable by path but are not emitted as standalone Style Dictionary
 * tokens.
 *
 * This preserves references like `color.blue.400.fg` by synthesizing lookup
 * entries for nested token nodes while leaving ordinary object payloads such as
 * typography values untouched.
 *
 * Examples:
 * - `color.blue.400` with nested `fg: { $value: '{color.white}' }`
 *   produces an indexed path for `color.blue.400.fg`
 */
function collectNestedTokenEntries(
  token: ThemeShiftToken,
  basePath: string[]
): Array<[string, ThemeShiftToken]> {
  const entries: Array<[string, ThemeShiftToken]> = [];

  function visit(value: unknown, currentPath: string[]) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return;
    }

    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith('$') || key === 'value' || key === 'attributes') {
        continue;
      }

      const childPath = [...currentPath, key];

      if (isNestedTokenValue(child)) {
        entries.push([
          childPath.join('.'),
          {
            ...token,
            path: childPath,
            original: child,
            value:
              child.$value !== undefined
                ? child.$value
                : 'value' in child
                  ? child.value
                  : undefined,
            $value:
              child.$value !== undefined
                ? child.$value
                : 'value' in child
                  ? child.value
                  : undefined,
          },
        ]);
      }

      visit(child, childPath);
    }
  }

  const originalValue = token.original;
  if (originalValue && typeof originalValue === 'object') {
    visit(originalValue, basePath);
  }

  return entries;
}

/**
 * Resolves token references and supported color expressions across an entire
 * Style Dictionary token list.
 *
 * The returned array mirrors the input tokens but replaces `value` and `$value`
 * with resolved concrete values. Color expressions are evaluated at build time,
 * while non-color primitive and object tokens continue to flow through without
 * changing their public shape.
 *
 * Examples:
 * - `lighten({color.blue.300}, 0.1)` -> `#8692d0`
 * - `0 {space.4}` -> `0 1rem`
 * - `alpha(mix({color.blue.400}, {color.white}, 0.25), 0.5)` -> `rgba(...)`
 */
export function resolveDictionaryTokenValues(tokens: ThemeShiftToken[]) {
  const byPath = new Map<string, ThemeShiftToken>();

  for (const token of tokens) {
    const tokenPath = getTokenPath(token);
    if (tokenPath) {
      byPath.set(tokenPath, token);
      for (const [nestedPath, nestedToken] of collectNestedTokenEntries(
        token,
        token.path ?? []
      )) {
        if (!byPath.has(nestedPath)) {
          byPath.set(nestedPath, nestedToken);
        }
      }
    }
  }

  const cache = new Map<string, unknown>();

  function resolveReference(
    path: string,
    originPath: string,
    stack: string[]
  ): unknown {
    const target = byPath.get(path);

    if (!target) {
      throw new Error(
        `Failed to resolve token "${originPath}": unknown token reference "${path}".`
      );
    }

    if (stack.includes(path)) {
      throw new Error(
        `Failed to resolve token "${originPath}": circular token reference "${[...stack, path].join(' -> ')}".`
      );
    }

    return resolveToken(target, [...stack, path], originPath);
  }

  function resolveNumber(
    node: ExpressionNode,
    originPath: string,
    stack: string[]
  ) {
    const value = resolveNode(node, originPath, stack);
    const asNumber = parseAmount(value);

    if (!Number.isFinite(asNumber) || asNumber < 0 || asNumber > 1) {
      throw new Error(
        `Failed to resolve token "${originPath}": expected a numeric amount between 0 and 1.`
      );
    }

    return asNumber;
  }

  function resolveColor(
    node: ExpressionNode,
    originPath: string,
    stack: string[]
  ) {
    const value = resolveNode(node, originPath, stack);

    if (typeof value !== 'string') {
      throw new Error(
        `Failed to resolve token "${originPath}": expected a color string argument.`
      );
    }

    const color = parseColor(value);
    if (!color) {
      throw new Error(
        `Failed to resolve token "${originPath}": "${value}" is not a supported color value.`
      );
    }

    return color;
  }

  function resolveFunction(
    node: Extract<ExpressionNode, { kind: 'function' }>,
    originPath: string,
    stack: string[]
  ) {
    switch (node.name) {
      case 'mix': {
        if (node.args.length !== 3) {
          throw new Error(
            `Failed to resolve token "${originPath}": mix() expects 3 arguments.`
          );
        }

        return formatColor(
          mixColors(
            resolveColor(node.args[0], originPath, stack),
            resolveColor(node.args[1], originPath, stack),
            resolveNumber(node.args[2], originPath, stack)
          )
        );
      }

      case 'lighten': {
        if (node.args.length !== 2) {
          throw new Error(
            `Failed to resolve token "${originPath}": lighten() expects 2 arguments.`
          );
        }

        return formatColor(
          mixColors(
            resolveColor(node.args[0], originPath, stack),
            { r: 255, g: 255, b: 255, a: 1 },
            resolveNumber(node.args[1], originPath, stack)
          )
        );
      }

      case 'darken': {
        if (node.args.length !== 2) {
          throw new Error(
            `Failed to resolve token "${originPath}": darken() expects 2 arguments.`
          );
        }

        return formatColor(
          mixColors(
            resolveColor(node.args[0], originPath, stack),
            { r: 0, g: 0, b: 0, a: 1 },
            resolveNumber(node.args[1], originPath, stack)
          )
        );
      }

      case 'alpha': {
        if (node.args.length !== 2) {
          throw new Error(
            `Failed to resolve token "${originPath}": alpha() expects 2 arguments.`
          );
        }

        const color = resolveColor(node.args[0], originPath, stack);
        return formatColor({
          ...color,
          a: resolveNumber(node.args[1], originPath, stack),
        });
      }

      default:
        throw new Error(
          `Failed to resolve token "${originPath}": unsupported color function "${node.name}()".`
        );
    }
  }

  function resolveNode(
    node: ExpressionNode,
    originPath: string,
    stack: string[]
  ): unknown {
    switch (node.kind) {
      case 'reference':
        return resolveReference(node.path, originPath, stack);
      case 'function':
        return resolveFunction(node, originPath, stack);
      case 'literal':
        return node.value;
    }
  }

  function resolveString(value: string, originPath: string, stack: string[]) {
    const trimmed = value.trim();

    const parsedColor = parseColor(trimmed);
    if (parsedColor) {
      return trimmed;
    }

    if (looksLikeCssColorFunction(trimmed)) {
      throw new Error(
        `Failed to resolve token "${originPath}": "${trimmed}" looks like a CSS color function but is not a valid color value.`
      );
    }

    if (isExpressionString(trimmed)) {
      return resolveFunction(
        parseExpression(trimmed) as Extract<
          ExpressionNode,
          { kind: 'function' }
        >,
        originPath,
        stack
      );
    }

    const functionName = getFunctionName(trimmed);
    if (functionName && isBalancedFunctionCall(trimmed)) {
      throw new Error(
        `Failed to resolve token "${originPath}": unsupported color function "${functionName}()".`
      );
    }

    if (looksLikeSupportedExpressionStart(trimmed)) {
      throw new Error(
        `Failed to resolve token "${originPath}": invalid expression syntax "${trimmed}".`
      );
    }

    return value.replace(
      INLINE_REFERENCE_PATTERN,
      (_match, referencePath: string) => {
        const resolved = resolveReference(
          referencePath.trim(),
          originPath,
          stack
        );

        if (typeof resolved === 'object') {
          throw new Error(
            `Failed to resolve token "${originPath}": token reference "${referencePath}" does not resolve to a primitive value.`
          );
        }

        return String(resolved);
      }
    );
  }

  function resolveToken(
    token: ThemeShiftToken,
    stack: string[],
    originPath?: string
  ): unknown {
    const tokenPath = getTokenPath(token);
    const cacheKey = tokenPath ?? '';
    const currentOriginPath = originPath ?? tokenPath ?? 'unknown';

    if (tokenPath && cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const rawValue = getRawTokenValue(token);
    const resolved = resolveNestedValue(
      rawValue,
      (entry) => resolveString(entry, currentOriginPath, stack),
      currentOriginPath
    );

    if (tokenPath) {
      cache.set(cacheKey, resolved);
    }

    return resolved;
  }

  return tokens.map((token) => {
    const resolvedValue = resolveToken(
      token,
      getTokenPath(token) ? [getTokenPath(token) as string] : [],
      getTokenPath(token) ?? undefined
    );

    return {
      ...token,
      value: resolvedValue,
      $value: resolvedValue,
    };
  });
}
