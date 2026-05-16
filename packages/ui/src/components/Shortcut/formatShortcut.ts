import type {
  FormattedShortcut,
  FormatShortcutOptions,
  ShortcutFormat,
  ShortcutPlatform,
} from './types';

const keyAliases: Record<string, string> = {
  command: 'cmd',
  cmd: 'cmd',
  control: 'ctrl',
  ctrl: 'ctrl',
  mod: 'mod',
  meta: 'mod',
  alt: 'alt',
  option: 'alt',
  shift: 'shift',
  enter: 'enter',
  return: 'enter',
  esc: 'escape',
  escape: 'escape',
  backspace: 'backspace',
  delete: 'delete',
  del: 'delete',
  space: 'space',
  spacebar: 'space',
  tab: 'tab',
  up: 'arrowup',
  arrowup: 'arrowup',
  down: 'arrowdown',
  arrowdown: 'arrowdown',
  left: 'arrowleft',
  arrowleft: 'arrowleft',
  right: 'arrowright',
  arrowright: 'arrowright',
};

const textLabelMap: Record<string, string> = {
  alt: 'Alt',
  arrowdown: 'Down Arrow',
  arrowleft: 'Left Arrow',
  arrowright: 'Right Arrow',
  arrowup: 'Up Arrow',
  backspace: 'Backspace',
  cmd: 'Command',
  ctrl: 'Ctrl',
  delete: 'Delete',
  enter: 'Enter',
  escape: 'Escape',
  shift: 'Shift',
  space: 'Space',
  tab: 'Tab',
};

const macSymbolMap: Record<string, string> = {
  alt: '⌥',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  arrowup: '↑',
  backspace: '⌫',
  cmd: '⌘',
  ctrl: '⌃',
  delete: '⌦',
  enter: '↵',
  escape: '⎋',
  shift: '⇧',
  space: '␣',
  tab: '⇥',
};

const nonMacHybridSymbolMap: Record<string, string> = {
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  arrowup: '↑',
  enter: '↵',
};

function normalizeRawKey(key: string) {
  const trimmed = key.trim();

  if (!trimmed) {
    return '';
  }

  const lowered = trimmed.toLowerCase();

  return keyAliases[lowered] ?? lowered;
}

function resolvePlatform(platform: ShortcutPlatform = 'auto') {
  if (platform !== 'auto') {
    return platform;
  }

  if (typeof navigator === 'undefined') {
    return 'windows';
  }

  const signature =
    `${navigator.userAgent} ${navigator.platform}`.toLowerCase();

  if (signature.includes('mac')) {
    return 'mac';
  }

  if (signature.includes('linux')) {
    return 'linux';
  }

  return 'windows';
}

function resolveModKey(platform: Exclude<ShortcutPlatform, 'auto'>) {
  return platform === 'mac' ? 'cmd' : 'ctrl';
}

function normalizeInput(
  input: string | string[],
  platform: Exclude<ShortcutPlatform, 'auto'>
) {
  const parts = Array.isArray(input)
    ? input
    : input
        .split('+')
        .map((part) => part.trim())
        .filter(Boolean);

  return parts
    .map((part) => normalizeRawKey(part))
    .filter(Boolean)
    .map((part) => (part === 'mod' ? resolveModKey(platform) : part));
}

function toUnknownKeyDisplay(key: string, uppercase: boolean) {
  if (key.length === 1) {
    return uppercase ? key.toUpperCase() : key;
  }

  return key
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function toDisplayKey(
  key: string,
  format: ShortcutFormat,
  platform: Exclude<ShortcutPlatform, 'auto'>,
  uppercase: boolean
) {
  if (format === 'text') {
    return textLabelMap[key] ?? toUnknownKeyDisplay(key, uppercase);
  }

  if (platform === 'mac') {
    return macSymbolMap[key] ?? toUnknownKeyDisplay(key, uppercase);
  }

  return (
    nonMacHybridSymbolMap[key] ??
    textLabelMap[key] ??
    toUnknownKeyDisplay(key, uppercase)
  );
}

/**
 * Normalizes and formats shortcut input into render and accessibility values.
 */
export function formatShortcut(
  keys: string | string[],
  {
    format = 'symbols',
    platform = 'auto',
    uppercase = true,
  }: FormatShortcutOptions = {}
): FormattedShortcut {
  const resolvedPlatform = resolvePlatform(platform);
  const normalizedKeys = normalizeInput(keys, resolvedPlatform);

  const display = normalizedKeys.map((key) =>
    toDisplayKey(key, format, resolvedPlatform, uppercase)
  );
  const label = normalizedKeys
    .map((key) => textLabelMap[key] ?? toUnknownKeyDisplay(key, true))
    .join(' ');

  return { display, label };
}
