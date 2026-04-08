import type { ThemeMode } from '../types';

/** Returns the user's preferred color scheme from `prefers-color-scheme`. */
export function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}
