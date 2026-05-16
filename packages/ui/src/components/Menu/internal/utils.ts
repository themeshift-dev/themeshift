import type { KeyboardEvent as ReactKeyboardEvent, Ref } from 'react';

import type { Placement } from '@/hooks/useAnchoredPosition';

import type {
  MenuAlign,
  MenuPlacement,
  MenuSelectEvent,
} from '@/components/Menu/types';
import type { MenuItemRecord } from './types';

const sideToPlacement = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
} satisfies Record<MenuPlacement, Placement>;

/**
 * Merges callback and object refs into one stable ref setter.
 * Useful when a node must be tracked by multiple menu systems.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      (ref as { current: T | null }).current = node;
    });
  };
}

/**
 * Returns whether an item should be excluded from keyboard navigation.
 * Items marked `focusable` remain navigable even when disabled.
 */
export function isDisabled(record: MenuItemRecord) {
  return record.disabled && record.disabledBehavior !== 'focusable';
}

/**
 * Returns `true` for keys that should append to the typeahead buffer.
 * Modifier-assisted keys are ignored intentionally.
 */
export function isTypeaheadKey(event: ReactKeyboardEvent) {
  return (
    event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey
  );
}

/**
 * Normalizes align values for floating placement composition.
 */
export function resolveAlign(align: MenuAlign) {
  if (align === 'center') {
    return 'center';
  }

  return align;
}

/**
 * Combines side and cross-axis alignment into a floating-ui placement.
 */
export function resolvePlacement(side: MenuPlacement, align: MenuAlign) {
  const base = sideToPlacement[side];
  const alignPart = resolveAlign(align);

  if (alignPart === 'center') {
    return base;
  }

  return `${base}-${alignPart}` as Placement;
}

/**
 * Derives a normalized searchable text value from a rendered node.
 */
export function deriveTextValue(node: HTMLElement | null) {
  const value = node?.textContent?.trim() ?? '';

  return value.replace(/\s+/g, ' ');
}

/**
 * Scrolls the active item into view without forcing full container scroll.
 */
export function scrollItemIntoView(node: HTMLElement | null) {
  if (typeof node?.scrollIntoView === 'function') {
    node.scrollIntoView({ block: 'nearest' });
  }
}

/**
 * Creates a cancellable synthetic selection event used by menu items.
 */
export function createMenuSelectEvent(): MenuSelectEvent {
  const nativeEvent = new Event('menuselect', {
    bubbles: true,
    cancelable: true,
  });

  return nativeEvent as MenuSelectEvent;
}
