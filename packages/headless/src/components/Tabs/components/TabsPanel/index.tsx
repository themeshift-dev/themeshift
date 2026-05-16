import { useContext, type ElementType } from 'react';

import { TabsPanelsContext, useTabsContext } from '../../internal/context';
import type { TabsPanelProps } from '../../types';

/** Panel region associated to a trigger via matching `value`. */
export const TabsPanel = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  forceMount = false,
  value,
  ...panelProps
}: TabsPanelProps<T>) => {
  const context = useTabsContext('Tabs.Panel');
  const panelContext = useContext(TabsPanelsContext);
  const Component = as ?? 'div';

  const isSelected = context.selectedValue === value;
  const resolvedLazyMount = panelContext?.lazyMount ?? context.lazyMount;
  const resolvedUnmountOnExit =
    panelContext?.unmountOnExit ?? context.unmountOnExit;
  const hasMounted = context.mountedPanelValues.has(value);
  const shouldMount =
    forceMount || !resolvedLazyMount || isSelected || hasMounted;

  if (!shouldMount) {
    return null;
  }

  if (!forceMount && resolvedUnmountOnExit && !isSelected) {
    return null;
  }

  return (
    <Component
      {...panelProps}
      aria-labelledby={context.getTriggerId(value)}
      className={className}
      data-orientation={context.orientation}
      data-slot="panel"
      data-state={isSelected ? 'active' : 'inactive'}
      data-value={value}
      hidden={!isSelected}
      id={context.getPanelId(value)}
      role="tabpanel"
    >
      {children}
    </Component>
  );
};
