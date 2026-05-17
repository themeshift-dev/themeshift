import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react';

import type {
  MenuDir,
  MenuItemDisabledBehavior,
  MenuOrientation,
  MenuRootProps,
} from '@/components/Menu/types';

export type ItemKind = 'item' | 'checkbox' | 'radio' | 'sub-trigger';

export type MenuItemRecord = {
  closeOnSelect?: boolean;
  disabled: boolean;
  disabledBehavior: MenuItemDisabledBehavior;
  id: string;
  kind: ItemKind;
  ref: HTMLElement | null;
  textValue: string;
};

export type MenuRootContextValue = {
  closeAll: () => void;
  closeOnSelect: boolean;
  density: NonNullable<MenuRootProps['density']>;
  dir: MenuDir;
  disabled: boolean;
  loop: boolean;
  modal: boolean;
  onEscapeKeyDown?: MenuRootProps['onEscapeKeyDown'];
  onFocusOutside?: MenuRootProps['onFocusOutside'];
  onInteractOutside?: MenuRootProps['onInteractOutside'];
  onPointerDownOutside?: MenuRootProps['onPointerDownOutside'];
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  orientation: MenuOrientation;
  registerTrigger: (node: HTMLElement | null) => void;
  selectionMode: NonNullable<MenuRootProps['selectionMode']>;
  size: NonNullable<MenuRootProps['size']>;
  triggerRef: RefObject<HTMLElement | null>;
  typeahead: boolean;
};

export type MenuContentContextValue = {
  contentId: string;
  focusByDelta: (delta: number) => void;
  focusFirst: () => void;
  focusLast: () => void;
  getItems: () => MenuItemRecord[];
  highlightedId: string | null;
  registerItem: (record: MenuItemRecord) => () => void;
  requestClose: () => void;
  selectByTypeahead: (query: string) => void;
  setHighlightedId: (id: string | null) => void;
};

export type MenuSubContextValue = {
  closeDelay: number;
  contentRef: RefObject<HTMLElement | null>;
  disabled: boolean;
  open: boolean;
  openDelay: number;
  openOnHover: boolean;
  setContentNode: (node: HTMLElement | null) => void;
  setOpen: (open: boolean) => void;
  setTriggerNode: (node: HTMLElement | null) => void;
  triggerRef: RefObject<HTMLElement | null>;
};

export type MenuItemStateContextValue = {
  checked?: boolean;
};

export type RadioGroupContextValue = {
  disabled: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
};

export type MenuContentStateOptions = {
  closeOnTab?: boolean;
  defaultHighlighted?: 'first' | 'last';
  onEscape?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  open: boolean;
  requestClose: () => void;
};

export const DEFAULT_COLLISION_PADDING = 8;
export const DEFAULT_TYPEAHEAD_TIMEOUT = 750;
