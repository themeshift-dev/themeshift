import { createContext } from 'react';

import type { ApiReferenceContextValue } from './types';

export const ApiReferenceContext =
  createContext<ApiReferenceContextValue | null>(null);
