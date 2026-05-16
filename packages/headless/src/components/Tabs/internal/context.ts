import { createContext, useContext } from 'react';

import type { TabsActivationMode, TabsOrientation } from '../types';

export type TriggerRecord = {
  disabled: boolean;
  id: string;
  node: HTMLElement | null;
  panelId: string;
  value: string;
};

export type TabsContextValue = {
  activationMode: TabsActivationMode;
  fitted: boolean;
  getFirstEnabledValue: () => string | undefined;
  getPanelId: (value: string) => string;
  getSelectedTrigger: () => HTMLElement | null;
  getTriggerId: (value: string) => string;
  lazyMount: boolean;
  listElement: HTMLElement | null;
  loop: boolean;
  mountedPanelValues: Set<string>;
  moveFocus: (
    currentValue: string,
    direction: 'first' | 'last' | 'next' | 'previous'
  ) => string | undefined;
  orientation: TabsOrientation;
  registerListElement: (node: HTMLElement | null) => void;
  registerTrigger: (record: TriggerRecord) => void;
  registrationVersion: number;
  selectedValue: string | undefined;
  setValue: (value: string) => void;
  unmountOnExit: boolean;
  unregisterTrigger: (value: string) => void;
  updateTriggerNode: (value: string, node: HTMLElement | null) => void;
};

export type PanelsContextValue = {
  lazyMount?: boolean;
  unmountOnExit?: boolean;
};

export const TabsContext = createContext<TabsContextValue | null>(null);
export const TabsPanelsContext = createContext<PanelsContextValue | null>(null);

export function useTabsContext(component: string) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`${component} must be used within Tabs.`);
  }

  return context;
}
