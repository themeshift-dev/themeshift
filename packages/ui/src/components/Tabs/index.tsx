/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import type { ElementType } from 'react';

import {
  TabsIndicator as HeadlessTabsIndicator,
  TabsList as HeadlessTabsList,
  TabsPanel as HeadlessTabsPanel,
  TabsPanels as HeadlessTabsPanels,
  TabsRoot as HeadlessTabsRoot,
  TabsTrigger as HeadlessTabsTrigger,
  type TabsActivationMode,
  type TabsIndicatorInset,
  type TabsIndicatorProps,
  type TabsIndicatorSize,
  type TabsListProps,
  type TabsOrientation,
  type TabsPanelProps,
  type TabsPanelsProps,
  type TabsProps,
  type TabsRootProps,
  type TabsTriggerProps,
} from '@themeshift/headless/components/Tabs';

import styles from './Tabs.module.scss';

/** Root wrapper for composable Tabs interactions and state. */
export const TabsRoot = <T extends ElementType = 'div'>({
  className,
  ...rootProps
}: TabsRootProps<T>) => (
  <HeadlessTabsRoot
    {...({
      ...rootProps,
      className: classNames(styles.root, className),
    } as unknown as TabsRootProps<T>)}
  />
);

/** Container for triggers and indicator with `role="tablist"`. */
export const TabsList = <T extends ElementType = 'div'>({
  className,
  ...listProps
}: TabsListProps<T>) => (
  <HeadlessTabsList
    {...({
      ...listProps,
      className: classNames(styles.list, className),
    } as unknown as TabsListProps<T>)}
  />
);

/** Selectable trigger linked to a panel by shared `value`. */
export const TabsTrigger = <T extends ElementType = 'button'>({
  className,
  ...triggerProps
}: TabsTriggerProps<T>) => (
  <HeadlessTabsTrigger
    {...({
      ...triggerProps,
      className: classNames(styles.trigger, className),
    } as unknown as TabsTriggerProps<T>)}
  />
);

/** Optional wrapper for panels with local lazy/unmount overrides. */
export const TabsPanels = <T extends ElementType = 'div'>({
  className,
  ...panelsProps
}: TabsPanelsProps<T>) => (
  <HeadlessTabsPanels
    {...({
      ...panelsProps,
      className: classNames(styles.panels, className),
    } as unknown as TabsPanelsProps<T>)}
  />
);

/** Panel region associated to a trigger via matching `value`. */
export const TabsPanel = <T extends ElementType = 'div'>({
  className,
  ...panelProps
}: TabsPanelProps<T>) => (
  <HeadlessTabsPanel
    {...({
      ...panelProps,
      className: classNames(styles.panel, className),
    } as unknown as TabsPanelProps<T>)}
  />
);

/** Decorative active-tab indicator that follows selected trigger bounds. */
export const TabsIndicator = <T extends ElementType = 'div'>({
  className,
  inset = 'none',
  size = 'small',
  transition = true,
  ...indicatorProps
}: TabsIndicatorProps<T>) => (
  <HeadlessTabsIndicator
    {...({
      ...indicatorProps,
      className: classNames(
        styles.indicator,
        transition && styles.indicatorTransition,
        inset === 'small' && styles.indicatorInsetSmall,
        inset === 'medium' && styles.indicatorInsetMedium,
        size === 'small' && styles.indicatorSizeSmall,
        size === 'medium' && styles.indicatorSizeMedium,
        size === 'large' && styles.indicatorSizeLarge,
        className
      ),
      inset,
      size,
      transition,
    } as unknown as TabsIndicatorProps<T>)}
  />
);

export const Tabs = Object.assign(TabsRoot, {
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabsPanel,
  Panels: TabsPanels,
  Trigger: TabsTrigger,
});

export type {
  TabsActivationMode,
  TabsIndicatorInset,
  TabsIndicatorProps,
  TabsIndicatorSize,
  TabsListProps,
  TabsOrientation,
  TabsPanelProps,
  TabsPanelsProps,
  TabsProps,
  TabsRootProps,
  TabsTriggerProps,
};
