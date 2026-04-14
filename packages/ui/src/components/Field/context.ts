import { createContext, useContext } from 'react';

import type { FieldContextInternalValue } from './types';

const warnedContextConsumers = new Set<string>();

export const FieldContext = createContext<FieldContextInternalValue | null>(
  null
);

export function mergeIds(...idGroups: Array<string | undefined>) {
  const values = new Set(
    idGroups
      .flatMap((idGroup) => idGroup?.split(/\s+/) ?? [])
      .map((value) => value.trim())
      .filter(Boolean)
  );

  return values.size > 0 ? Array.from(values).join(' ') : undefined;
}

function warnMissingContext(componentName: string) {
  if (!import.meta.env.DEV || warnedContextConsumers.has(componentName)) {
    return;
  }

  warnedContextConsumers.add(componentName);

  console.warn(
    `[${componentName}] was rendered outside <Field>. Rendering fallback markup without Field wiring.`
  );
}

export function useFieldContext(componentName: string) {
  const context = useContext(FieldContext);

  if (!context) {
    warnMissingContext(componentName);
  }

  return context;
}

export function useFieldContextOptional() {
  return useContext(FieldContext);
}
