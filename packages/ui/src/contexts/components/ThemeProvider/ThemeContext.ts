import { createContext } from 'react';

import type { ThemeMode } from '../../types';

/** Public value exposed by the ThemeShift theme context. */
export type ThemeContextValue = {
  /** The currently active theme mode. */
  theme: ThemeMode;
  /** Sets the active theme directly. */
  setTheme: (mode: ThemeMode) => void;
  /** Toggles between light and dark themes. */
  toggleTheme: () => void;
};

/** React context used by ThemeProvider and useTheme. */
export const ThemeContext = createContext<ThemeContextValue | null>(null);
