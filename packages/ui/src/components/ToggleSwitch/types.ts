import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * ToggleSwitch size options.
 */
export type ToggleSwitchSize = 'small' | 'medium' | 'large';

/**
 * ToggleSwitch intent options.
 */
export type ToggleSwitchIntent =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'constructive'
  | 'destructive';

/**
 * ToggleSwitch label placement options.
 */
export type ToggleSwitchLabelPosition = 'start' | 'end';

type ToggleSwitchBaseProps = {
  /**
   * Allows the visible switch text to be selected.
   */
  allowTextSelection?: boolean;

  /**
   * Additional class name for the outer wrapper.
   */
  className?: string;

  /**
   * Helper text shown below the label.
   */
  description?: ReactNode;

  /**
   * Error text shown below the description.
   */
  errorMessage?: ReactNode;

  /**
   * Icon shown when the switch is off.
   */
  iconOff?: ReactNode;

  /**
   * Icon shown when the switch is on.
   */
  iconOn?: ReactNode;

  /**
   * Visible label content for the switch.
   */
  label?: ReactNode;

  /**
   * Additional class name for the visible label element.
   */
  labelClassName?: string;

  /**
   * Controls whether the label content appears before or after the switch.
   */
  labelPosition?: ToggleSwitchLabelPosition;

  /**
   * Called with the next checked state after user interaction.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Visual style used for the thumb color.
   */
  intent?: ToggleSwitchIntent;

  /**
   * Size option for the track, thumb, and label spacing.
   */
  size?: ToggleSwitchSize;

  /**
   * Additional class name for the thumb element.
   */
  thumbClassName?: string;

  /**
   * Additional class name for the track element.
   */
  trackClassName?: string;
};

type NativeToggleSwitchProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  keyof ToggleSwitchBaseProps | 'children' | 'onChange' | 'size' | 'type'
>;

/**
 * Props for the ThemeShift toggle switch component.
 */
export type ToggleSwitchProps = ToggleSwitchBaseProps & NativeToggleSwitchProps;
