import { forwardRef, useState } from 'react';

import { RadioGroupContext } from '@/components/Menu/internal/contexts';
import type { MenuRadioGroupProps } from '@/components/Menu/types';

/** Container that coordinates radio-style menu item selection. */
export const MenuRadioGroup = forwardRef<HTMLDivElement, MenuRadioGroupProps>(
  (
    {
      children,
      defaultValue,
      disabled = false,
      onValueChange,
      value,
      ...groupProps
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const resolvedValue = isControlled ? value : uncontrolledValue;

    return (
      <RadioGroupContext.Provider
        value={{
          disabled,
          onValueChange: (nextValue) => {
            if (!isControlled) {
              setUncontrolledValue(nextValue);
            }
            onValueChange?.(nextValue);
          },
          value: resolvedValue,
        }}
      >
        <div {...groupProps} ref={ref} role="group">
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

MenuRadioGroup.displayName = 'Menu.RadioGroup';
