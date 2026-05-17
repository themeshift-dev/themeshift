/* eslint-disable react-refresh/only-export-components */
import { TabsIndicator } from './components/TabsIndicator';
import { TabsList } from './components/TabsList';
import { TabsPanel } from './components/TabsPanel';
import { TabsPanels } from './components/TabsPanels';
import { TabsRoot } from './components/TabsRoot';
import { TabsTrigger } from './components/TabsTrigger';

export const Tabs = Object.assign(TabsRoot, {
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabsPanel,
  Panels: TabsPanels,
  Trigger: TabsTrigger,
});

export {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsPanels,
  TabsRoot,
  TabsTrigger,
};

export type {
  PolymorphicProps,
  TabsActivationMode,
  TabsIndicatorInset,
  TabsIndicatorOwnProps,
  TabsIndicatorProps,
  TabsIndicatorSize,
  TabsListOwnProps,
  TabsListProps,
  TabsOrientation,
  TabsOwnProps,
  TabsPanelOwnProps,
  TabsPanelProps,
  TabsPanelsOwnProps,
  TabsPanelsProps,
  TabsProps,
  TabsRootProps,
  TabsTriggerOwnProps,
  TabsTriggerProps,
} from './types';
