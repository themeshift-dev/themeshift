import { useCallback, type ElementType } from 'react';

import { useTabsContext } from '../../internal/context';
import type { TabsListProps } from '../../types';

/** Container for triggers and indicator with `role="tablist"`. */
export const TabsList = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...listProps
}: TabsListProps<T>) => {
  const context = useTabsContext('Tabs.List');
  const Component = as ?? 'div';
  const { activationMode, fitted, orientation, registerListElement } = context;

  const setListNode = useCallback(
    (node: Element | null) => {
      registerListElement(node instanceof HTMLElement ? node : null);
    },
    [registerListElement]
  );

  return (
    <Component
      {...listProps}
      className={className}
      data-activation-mode={activationMode}
      data-fitted={fitted ? '' : undefined}
      data-orientation={orientation}
      data-slot="list"
      ref={setListNode}
      role="tablist"
    >
      {children}
    </Component>
  );
};
