import { forwardRef, useState } from 'react';

import { MenuItemStateContext } from '@/components/Menu/internal/contexts';
import type { MenuCheckboxItemProps } from '@/components/Menu/types';
import { MenuItemBase } from '../MenuItem';

// Checkbox-like selectable menu item.
export const MenuCheckboxItem = forwardRef<
  HTMLDivElement,
  MenuCheckboxItemProps
>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      closeOnSelect = false,
      onSelect,
      ...itemProps
    },
    ref
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(!!defaultChecked);
    const isControlled = checked !== undefined;
    const resolvedChecked = isControlled ? checked : uncontrolledChecked;

    return (
      <MenuItemStateContext.Provider
        value={{ checked: resolvedChecked ? true : undefined }}
      >
        <MenuItemBase
          {...itemProps}
          checkedState={
            resolvedChecked === 'indeterminate' ? 'mixed' : !!resolvedChecked
          }
          closeOnSelect={closeOnSelect}
          kind="checkbox"
          onSelect={(event) => {
            const nextChecked =
              resolvedChecked === 'indeterminate' ? true : !resolvedChecked;
            if (!isControlled) {
              setUncontrolledChecked(nextChecked);
            }
            onCheckedChange?.(nextChecked);
            onSelect?.(event);
          }}
          ref={ref}
          role="menuitemcheckbox"
        />
      </MenuItemStateContext.Provider>
    );
  }
);

MenuCheckboxItem.displayName = 'Menu.CheckboxItem';
