/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';

import {
  MenuCheckboxItem as HeadlessMenuCheckboxItem,
  MenuContent as HeadlessMenuContent,
  MenuGroup as HeadlessMenuGroup,
  MenuItem as HeadlessMenuItem,
  MenuItemIcon as HeadlessMenuItemIcon,
  MenuItemIndicator as HeadlessMenuItemIndicator,
  MenuItemMeta as HeadlessMenuItemMeta,
  MenuItemText as HeadlessMenuItemText,
  MenuLabel as HeadlessMenuLabel,
  MenuRadioGroup as HeadlessMenuRadioGroup,
  MenuRadioItem as HeadlessMenuRadioItem,
  MenuRoot as HeadlessMenuRoot,
  MenuSeparator as HeadlessMenuSeparator,
  MenuSub as HeadlessMenuSub,
  MenuSubContent as HeadlessMenuSubContent,
  MenuSubTrigger as HeadlessMenuSubTrigger,
  MenuViewport as HeadlessMenuViewport,
  type MenuAlign,
  type MenuCheckboxItemProps,
  type MenuContentMode,
  type MenuContentProps,
  type MenuDensity,
  type MenuDir,
  type MenuGroupProps,
  type MenuItemDisabledBehavior,
  type MenuItemIconProps,
  type MenuItemIndicatorProps,
  type MenuItemMetaProps,
  type MenuItemProps,
  type MenuItemTextProps,
  type MenuLabelProps,
  type MenuOrientation,
  type MenuPlacement,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
  type MenuRootProps,
  type MenuSelectEvent,
  type MenuSelectionMode,
  type MenuSeparatorProps,
  type MenuSize,
  type MenuSubContentProps,
  type MenuSubProps,
  type MenuSubTriggerProps,
  type MenuViewportProps,
} from '@themeshift/headless/components/Menu';

import styles from './Menu.module.scss';

const densityClassMap = {
  compact: styles.densityCompact,
  spacious: styles.densitySpacious,
} satisfies Record<'compact' | 'spacious', string>;

const sizeClassMap = {
  small: styles.sizeSm,
  medium: styles.sizeMd,
  large: styles.sizeLg,
} satisfies Record<MenuSize, string>;

export const MenuRoot = ({
  className,
  density = 'normal',
  orientation = 'vertical',
  size = 'medium',
  ...rootProps
}: MenuRootProps) => (
  <HeadlessMenuRoot
    {...({
      ...rootProps,
      className: classNames(
        styles.root,
        orientation === 'horizontal' && styles.orientationHorizontal,
        density !== 'normal' && densityClassMap[density],
        sizeClassMap[size],
        className
      ),
      density,
      orientation,
      size,
    } as unknown as MenuRootProps)}
  />
);

export const MenuContent = ({
  className,
  mode = 'inline',
  ...contentProps
}: MenuContentProps) => (
  <HeadlessMenuContent
    {...({
      ...contentProps,
      className: classNames(
        styles.content,
        mode === 'floating' && styles.floating,
        className
      ),
      mode,
    } as unknown as MenuContentProps)}
  />
);

export const MenuViewport = ({
  className,
  scrollable = true,
  ...viewportProps
}: MenuViewportProps) => (
  <HeadlessMenuViewport
    {...({
      ...viewportProps,
      className: classNames(
        styles.viewport,
        scrollable && styles.scrollable,
        className
      ),
      scrollable,
    } as unknown as MenuViewportProps)}
  />
);

export const MenuGroup = ({
  className,
  disabled = false,
  inset,
  ...groupProps
}: MenuGroupProps) => (
  <HeadlessMenuGroup
    {...({
      ...groupProps,
      className: classNames(
        styles.group,
        inset && styles.inset,
        disabled && styles.disabled,
        className
      ),
      disabled,
      inset,
    } as unknown as MenuGroupProps)}
  />
);

export const MenuLabel = ({
  className,
  inset = false,
  muted = false,
  ...labelProps
}: MenuLabelProps) => (
  <HeadlessMenuLabel
    {...({
      ...labelProps,
      className: classNames(
        styles.label,
        inset && styles.inset,
        muted && styles.muted,
        className
      ),
      inset,
      muted,
    } as unknown as MenuLabelProps)}
  />
);

export const MenuItem = ({
  className,
  destructive = false,
  highlighted,
  inset = false,
  ...itemProps
}: MenuItemProps) => (
  <HeadlessMenuItem
    {...({
      ...itemProps,
      className: classNames(
        styles.item,
        destructive && styles.destructive,
        inset && styles.inset,
        highlighted && styles.highlighted,
        className
      ),
      destructive,
      highlighted,
      inset,
    } as unknown as MenuItemProps)}
  />
);

export const MenuItemText = ({
  className,
  truncate = false,
  ...textProps
}: MenuItemTextProps) => (
  <HeadlessMenuItemText
    {...({
      ...textProps,
      className: classNames(
        styles.itemText,
        truncate && styles.truncate,
        className
      ),
      truncate,
    } as unknown as MenuItemTextProps)}
  />
);

export const MenuItemIcon = ({
  className,
  size = 'medium',
  ...iconProps
}: MenuItemIconProps) => (
  <HeadlessMenuItemIcon
    {...({
      ...iconProps,
      className: classNames(
        styles.itemIcon,
        size === 'small' && styles.itemIconSM,
        size === 'medium' && styles.itemIconMD,
        size === 'large' && styles.itemIconLG,
        className
      ),
      size,
    } as unknown as MenuItemIconProps)}
  />
);

export const MenuItemMeta = ({
  align = 'end',
  className,
  muted = false,
  ...metaProps
}: MenuItemMetaProps) => (
  <HeadlessMenuItemMeta
    {...({
      ...metaProps,
      align,
      className: classNames(
        styles.itemMeta,
        align === 'start' ? styles.metaStart : styles.metaEnd,
        muted && styles.muted,
        className
      ),
      muted,
    } as unknown as MenuItemMetaProps)}
  />
);

export const MenuSeparator = ({
  className,
  orientation = 'horizontal',
  spacing = 'medium',
  ...separatorProps
}: MenuSeparatorProps) => (
  <HeadlessMenuSeparator
    {...({
      ...separatorProps,
      className: classNames(
        styles.separator,
        orientation === 'vertical' && styles.separatorVertical,
        spacing === 'none' && styles.separatorSpacingNONE,
        spacing === 'small' && styles.separatorSpacingSM,
        spacing === 'medium' && styles.separatorSpacingMD,
        spacing === 'large' && styles.separatorSpacingLG,
        className
      ),
      orientation,
      spacing,
    } as unknown as MenuSeparatorProps)}
  />
);

export const MenuCheckboxItem = ({
  className,
  disabled,
  destructive = false,
  highlighted,
  inset = false,
  ...itemProps
}: MenuCheckboxItemProps) => (
  <HeadlessMenuCheckboxItem
    {...({
      ...itemProps,
      className: classNames(
        styles.item,
        destructive && styles.destructive,
        inset && styles.inset,
        highlighted && styles.highlighted,
        disabled && styles.disabled,
        className
      ),
      disabled,
      destructive,
      highlighted,
      inset,
    } as unknown as MenuCheckboxItemProps)}
  />
);

export const MenuRadioGroup = (props: MenuRadioGroupProps) => (
  <HeadlessMenuRadioGroup {...props} />
);

export const MenuRadioItem = ({
  className,
  disabled,
  destructive = false,
  highlighted,
  inset = false,
  ...itemProps
}: MenuRadioItemProps) => (
  <HeadlessMenuRadioItem
    {...({
      ...itemProps,
      className: classNames(
        styles.item,
        destructive && styles.destructive,
        inset && styles.inset,
        highlighted && styles.highlighted,
        disabled && styles.disabled,
        className
      ),
      disabled,
      destructive,
      highlighted,
      inset,
    } as unknown as MenuRadioItemProps)}
  />
);

export const MenuItemIndicator = ({
  className,
  position = 'start',
  ...indicatorProps
}: MenuItemIndicatorProps) => (
  <HeadlessMenuItemIndicator
    {...({
      ...indicatorProps,
      className: classNames(
        styles.itemIndicator,
        position === 'end' ? styles.indicatorEnd : styles.indicatorStart,
        className
      ),
      position,
    } as unknown as MenuItemIndicatorProps)}
  />
);

export const MenuSub = (props: MenuSubProps) => <HeadlessMenuSub {...props} />;

export const MenuSubTrigger = ({
  className,
  disabled,
  destructive = false,
  highlighted,
  inset = false,
  ...triggerProps
}: MenuSubTriggerProps) => (
  <HeadlessMenuSubTrigger
    {...({
      ...triggerProps,
      className: classNames(
        styles.item,
        destructive && styles.destructive,
        inset && styles.inset,
        highlighted && styles.highlighted,
        disabled && styles.disabled,
        className
      ),
      disabled,
      destructive,
      highlighted,
      inset,
    } as unknown as MenuSubTriggerProps)}
  />
);

export const MenuSubContent = ({
  className,
  ...subContentProps
}: MenuSubContentProps) => (
  <HeadlessMenuSubContent
    {...({
      ...subContentProps,
      className: classNames(styles.content, styles.floating, className),
    } as unknown as MenuSubContentProps)}
  />
);

export const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Content: MenuContent,
  Viewport: MenuViewport,
  Group: MenuGroup,
  Label: MenuLabel,
  Item: MenuItem,
  ItemText: MenuItemText,
  ItemIcon: MenuItemIcon,
  ItemMeta: MenuItemMeta,
  Separator: MenuSeparator,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  ItemIndicator: MenuItemIndicator,
  Sub: MenuSub,
  SubTrigger: MenuSubTrigger,
  SubContent: MenuSubContent,
});

export type {
  MenuAlign,
  MenuCheckboxItemProps,
  MenuContentMode,
  MenuContentProps,
  MenuDensity,
  MenuDir,
  MenuGroupProps,
  MenuItemDisabledBehavior,
  MenuItemIconProps,
  MenuItemIndicatorProps,
  MenuItemMetaProps,
  MenuItemProps,
  MenuItemTextProps,
  MenuLabelProps,
  MenuOrientation,
  MenuPlacement,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuRootProps,
  MenuSelectEvent,
  MenuSelectionMode,
  MenuSeparatorProps,
  MenuSize,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
  MenuViewportProps,
};
