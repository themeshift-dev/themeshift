import type { ElementType } from 'react';

import { TabsPanelsContext, useTabsContext } from '../../internal/context';
import type { TabsPanelsProps } from '../../types';

/** Optional wrapper for panels with local lazy/unmount overrides. */
export const TabsPanels = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  lazyMount,
  unmountOnExit,
  ...panelsProps
}: TabsPanelsProps<T>) => {
  const context = useTabsContext('Tabs.Panels');
  const Component = as ?? 'div';

  return (
    <TabsPanelsContext.Provider value={{ lazyMount, unmountOnExit }}>
      <Component
        {...panelsProps}
        className={className}
        data-lazy-mount={lazyMount ? '' : undefined}
        data-orientation={context.orientation}
        data-slot="panels"
        data-unmount-on-exit={unmountOnExit ? '' : undefined}
      >
        {children}
      </Component>
    </TabsPanelsContext.Provider>
  );
};
