import { createContext } from 'react';

import type { ComponentDataContextValue } from './types';

export const ComponentDataContext =
  createContext<ComponentDataContextValue | null>(null);
