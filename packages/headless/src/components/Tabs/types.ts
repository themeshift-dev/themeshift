import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/** Layout direction for the tab list and keyboard navigation model. */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Controls how keyboard navigation activates tabs.
 *
 * - `automatic`: moving focus with arrow keys also activates the tab.
 * - `manual`: arrow keys move focus only; Enter/Space activates.
 */
export type TabsActivationMode = 'automatic' | 'manual';

/** Inset presets used by the indicator to shrink from trigger bounds. */
export type TabsIndicatorInset = 'none' | 'small' | 'medium';

/** Thickness presets used by the indicator line/bar. */
export type TabsIndicatorSize = 'small' | 'medium' | 'large';

/** Shared helper for polymorphic parts. */
export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  /** HTML element or component to render instead of the default. */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

/** Props for the Tabs root component. */
export type TabsOwnProps = {
  /** Tab list, triggers, panels, and optional indicator composition. */
  children: ReactNode;

  /** Controlled selected tab value. */
  value?: string;

  /** Initial selected tab value for uncontrolled usage. */
  defaultValue?: string;

  /** Called when selection changes. */
  onValueChange?: (value: string) => void;

  /** Orientation used for layout and keyboard behavior. */
  orientation?: TabsOrientation;

  /** Keyboard activation model for arrow navigation. */
  activationMode?: TabsActivationMode;

  /** Delays inactive panel mounting until first activation. */
  lazyMount?: boolean;

  /** Unmounts inactive panels when they become hidden. */
  unmountOnExit?: boolean;

  /** Allows focus navigation to wrap from end-to-start and start-to-end. */
  loop?: boolean;

  /** Makes triggers share equal inline size in the list. */
  fitted?: boolean;
};

/** Props for `Tabs.List`. */
export type TabsListOwnProps = {
  /** Trigger items and optional `Tabs.Indicator`. */
  children: ReactNode;

  /** Accessible name for the tablist when no visible heading labels it. */
  'aria-label'?: string;
};

/** Props for `Tabs.Trigger`. */
export type TabsTriggerOwnProps = {
  /** Trigger label content. */
  children: ReactNode;

  /** Unique value associated with this tab and matching panel. */
  value: string;

  /** Disables pointer and keyboard activation for this trigger. */
  disabled?: boolean;
};

/** Props for `Tabs.Panels`. */
export type TabsPanelsOwnProps = {
  /** Panel children. */
  children: ReactNode;

  /** Optional local lazy-mount override for nested panels. */
  lazyMount?: boolean;

  /** Optional local unmount-on-exit override for nested panels. */
  unmountOnExit?: boolean;
};

/** Props for `Tabs.Panel`. */
export type TabsPanelOwnProps = {
  /** Panel content for the matching trigger value. */
  children: ReactNode;

  /** Value matching a `Tabs.Trigger`. */
  value: string;

  /** Forces panel to stay mounted regardless of lazy/unmount settings. */
  forceMount?: boolean;
};

/** Props for `Tabs.Indicator`. */
export type TabsIndicatorOwnProps = {
  /** Forces indicator to render even when no active trigger is available. */
  forceMount?: boolean;

  /** Enables transition motion between selected trigger positions. */
  transition?: boolean;

  /** Shrinks indicator bounds relative to the active trigger. */
  inset?: TabsIndicatorInset;

  /** Sets indicator line thickness. */
  size?: TabsIndicatorSize;
};

/** Public props for Tabs root. */
export type TabsProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  TabsOwnProps
>;

/** Public props for Tabs root alias. */
export type TabsRootProps<T extends ElementType = 'div'> = TabsProps<T>;

/** Public props for `Tabs.List`. */
export type TabsListProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  TabsListOwnProps
>;

/** Public props for `Tabs.Trigger`. */
export type TabsTriggerProps<T extends ElementType = 'button'> =
  PolymorphicProps<T, TabsTriggerOwnProps>;

/** Public props for `Tabs.Panels`. */
export type TabsPanelsProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  TabsPanelsOwnProps
>;

/** Public props for `Tabs.Panel`. */
export type TabsPanelProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  TabsPanelOwnProps
>;

/** Public props for `Tabs.Indicator`. */
export type TabsIndicatorProps<T extends ElementType = 'div'> =
  PolymorphicProps<T, TabsIndicatorOwnProps>;
