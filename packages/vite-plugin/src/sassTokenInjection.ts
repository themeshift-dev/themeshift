import { fileURLToPath } from 'node:url';

import { normalizeCssVarPrefix } from './cssVar';

const tokenDefaultsPath = fileURLToPath(
  new URL('./token-defaults.scss', import.meta.url)
).replace(/\\/g, '/');

export type SassTokenInjection = {
  prelude: string;
  directives: string;
  body: string;
};

export function makeSassTokenInjection(
  cssVarPrefix?: string
): SassTokenInjection {
  const prefix = normalizeCssVarPrefix(cssVarPrefix) ?? null;
  const defaultPrefix = prefix === null ? 'null' : JSON.stringify(prefix);

  return {
    prelude:
      '@use "sass:string" as _themeShiftString;\n' +
      `@use "${tokenDefaultsPath}" as _themeShiftTokenDefaults with (\n  $theme-shift-default-css-var-prefix: ${defaultPrefix}\n);\n`,
    directives: '',
    body:
      `
$theme-shift-default-css-var-prefix: _themeShiftTokenDefaults.$theme-shift-default-css-var-prefix;

@function _sd_trim_leading_hyphens($value) {
  @if _themeShiftString.length($value) == 0 or _themeShiftString.slice($value, 1, 1) != "-" {
    @return $value;
  }

  @return _sd_trim_leading_hyphens(_themeShiftString.slice($value, 2));
}

@function _sd_trim_trailing_hyphens($value) {
  $length: _themeShiftString.length($value);

  @if $length == 0 or _themeShiftString.slice($value, $length, $length) != "-" {
    @return $value;
  }

  @return _sd_trim_trailing_hyphens(
    _themeShiftString.slice($value, 1, $length - 1)
  );
}

@function _sd_normalize_css_var_prefix($prefix) {
  @if $prefix == null {
    @return null;
  }

  $normalized: "";
  $length: _themeShiftString.length($prefix);

  @if $length == 0 {
    @return null;
  }

  @for $i from 1 through $length {
    $ch: _themeShiftString.slice($prefix, $i, $i);
    @if $ch == "_" {
      $normalized: $normalized + "-";
    } @else {
      $normalized: $normalized + $ch;
    }
  }

  $normalized: _sd_trim_leading_hyphens($normalized);
  $normalized: _sd_trim_trailing_hyphens($normalized);

  @if $normalized == "" {
    @return null;
  }

  @return $normalized;
}

@function _sd_resolve_css_var_prefix($cssVarPrefix: null) {
  @if $cssVarPrefix != null {
    @return _sd_normalize_css_var_prefix($cssVarPrefix);
  }

  @return _sd_normalize_css_var_prefix($theme-shift-default-css-var-prefix);
}

@function _sd_is_uppercase($ch) {
  @return $ch != _themeShiftString.to-lower-case($ch) and $ch == _themeShiftString.to-upper-case($ch);
}

@function _sd_to_css_var_name($path, $cssVarPrefix: null) {
  $resolved-prefix: _sd_resolve_css_var_prefix($cssVarPrefix);
  $out: "";

  @if $resolved-prefix != null {
    $out: $resolved-prefix + "-";
  }

  @for $i from 1 through _themeShiftString.length($path) {
    $ch: _themeShiftString.slice($path, $i, $i);
    @if $ch == "." {
      $out: $out + "-";
    } @else if $ch == "_" {
      $out: $out + "-";
    } @else if _sd_is_uppercase($ch) {
      @if $i > 1 {
        $prev: _themeShiftString.slice($path, $i - 1, $i - 1);
        @if $prev != "." and $prev != "_" and $prev != "-" {
          $out: $out + "-";
        }
      }
      $out: $out + _themeShiftString.to-lower-case($ch);
    } @else {
      $out: $out + $ch;
    }
  }

  @return "--" + $out;
}

@function token($path, $cssVarPrefix: null) {
  @return var(#{_sd_to_css_var_name($path, $cssVarPrefix)});
}
`.trim() + '\n',
  };
}

function splitLeadingScssDirectives(source: string) {
  const directivePattern =
    /^(?<prefix>(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*)(?<directive>@(?:charset|use|forward)\b[\s\S]*?;)/;
  let remaining = source;
  let leading = '';

  while (true) {
    const match = remaining.match(directivePattern);
    if (!match?.groups) {
      break;
    }

    leading += match.groups.prefix + match.groups.directive;
    remaining = remaining.slice(match[0].length);
  }

  return { leading, remaining };
}

function mergeScssStrings(existing: string, injection: SassTokenInjection) {
  const existingParts = splitLeadingScssDirectives(existing);

  const prelude = [injection.prelude]
    .filter(Boolean)
    .map((part) => part.trimEnd())
    .join('\n');

  const leading = [existingParts.leading, injection.directives]
    .filter(Boolean)
    .map((part) => part.trimEnd())
    .join('\n');

  return (
    prelude +
    (prelude ? '\n' : '') +
    leading +
    (leading ? '\n' : '') +
    injection.body +
    existingParts.remaining
  );
}

export function mergeScssAdditionalData(
  existing: unknown,
  injection: SassTokenInjection
) {
  const applyExisting = (source: string, filename: string) => {
    if (typeof existing === 'function') {
      return existing(source, filename);
    }

    if (typeof existing === 'string') {
      return existing + source;
    }

    return source;
  };

  return (source: string, filename: string) =>
    mergeScssStrings(applyExisting(source, filename), injection);
}
