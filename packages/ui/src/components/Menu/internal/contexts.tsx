import { createContext, useContext } from 'react';

import type {
  MenuContentContextValue,
  MenuItemStateContextValue,
  MenuRootContextValue,
  MenuSubContextValue,
  RadioGroupContextValue,
} from './types';

export const MenuRootContext = createContext<MenuRootContextValue | null>(null);
export const MenuContentContext = createContext<MenuContentContextValue | null>(
  null
);
export const MenuSubContext = createContext<MenuSubContextValue | null>(null);
export const MenuItemStateContext =
  createContext<MenuItemStateContextValue | null>(null);
export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null
);

export function useMenuRootContext(component: string) {
  const context = useContext(MenuRootContext);

  if (!context) {
    throw new Error(`${component} must be used within Menu.Root.`);
  }

  return context;
}

export function useMenuContentContext(component: string) {
  const context = useContext(MenuContentContext);

  if (!context) {
    throw new Error(
      `${component} must be used within Menu.Content or Menu.SubContent.`
    );
  }

  return context;
}
