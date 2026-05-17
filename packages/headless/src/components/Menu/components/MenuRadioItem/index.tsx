import { forwardRef, useContext } from 'react';

import {
  MenuItemStateContext,
  RadioGroupContext,
} from '@/components/Menu/internal/contexts';
import type { MenuRadioItemProps } from '@/components/Menu/types';
import { MenuItemBase } from '../MenuItem';

/** Radio-like selectable menu item associated with `Menu.RadioGroup`. */
export const MenuRadioItem = forwardRef<HTMLDivElement, MenuRadioItemProps>(
  ({ closeOnSelect = false, onSelect, ...itemProps }, ref) => {
    const group = useContext(RadioGroupContext);
    const checked = group?.value === itemProps.value;

    return (
      <MenuItemStateContext.Provider value={{ checked }}>
        <MenuItemBase
          {...itemProps}
          checkedState={checked}
          closeOnSelect={closeOnSelect}
          disabled={group?.disabled || itemProps.disabled}
          kind="radio"
          onSelect={(event) => {
            group?.onValueChange?.(itemProps.value);
            onSelect?.(event);
          }}
          ref={ref}
          role="menuitemradio"
        />
      </MenuItemStateContext.Provider>
    );
  }
);

MenuRadioItem.displayName = 'Menu.RadioItem';
