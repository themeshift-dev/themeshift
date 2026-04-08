import { useContext } from 'react';

import { ThemeContext } from '../../components/ThemeProvider/ThemeContext';

/** Returns the current theme state and theme update helpers. */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
