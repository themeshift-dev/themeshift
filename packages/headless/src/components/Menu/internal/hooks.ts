import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react';

import { useMenuRootContext } from './contexts';
import {
  DEFAULT_TYPEAHEAD_TIMEOUT,
  type MenuContentStateOptions,
  type MenuItemRecord,
} from './types';
import { isDisabled, isTypeaheadKey, scrollItemIntoView } from './utils';

/**
 * Shared controlled/uncontrolled boolean state helper used by menu roots/subs.
 */
export function useControllableBooleanState({
  value,
  defaultValue,
  onChange,
}: {
  value?: boolean;
  defaultValue: boolean;
  onChange?: (next: boolean) => void;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? value : uncontrolledValue;

  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }

      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [resolvedValue, setValue] as const;
}

/**
 * Runs open/close autofocus lifecycle hooks for floating menu content.
 */
export function useContentInteractions({
  onCloseAutoFocus,
  onOpenAutoFocus,
  open,
  triggerRef,
}: {
  onCloseAutoFocus?: (event: Event) => void;
  onOpenAutoFocus?: (event: Event) => void;
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const previousOpenRef = useRef(open);

  useEffect(() => {
    if (!open || previousOpenRef.current === open) {
      previousOpenRef.current = open;
      return;
    }

    const event = new Event('menuopenautofocus', {
      bubbles: true,
      cancelable: true,
    });

    onOpenAutoFocus?.(event);
    previousOpenRef.current = open;
  }, [onOpenAutoFocus, open]);

  useEffect(() => {
    if (open || previousOpenRef.current === open) {
      previousOpenRef.current = open;
      return;
    }

    const event = new Event('menucloseautofocus', {
      bubbles: true,
      cancelable: true,
    });

    onCloseAutoFocus?.(event);

    if (!event.defaultPrevented) {
      triggerRef.current?.focus();
    }

    previousOpenRef.current = open;
  }, [onCloseAutoFocus, open, triggerRef]);
}

/**
 * Maintains a keyed collection of registered menu items.
 * A version counter is used to trigger consumers when the collection mutates.
 */
export function useMenuCollection() {
  const itemsRef = useRef<Map<string, MenuItemRecord>>(new Map());
  const [version, setVersion] = useState(0);

  const registerItem = useCallback((record: MenuItemRecord) => {
    itemsRef.current.set(record.id, record);
    setVersion((current) => current + 1);

    return () => {
      itemsRef.current.delete(record.id);
      setVersion((current) => current + 1);
    };
  }, []);

  const getItems = useCallback(() => {
    void version;
    return [...itemsRef.current.values()];
  }, [version]);

  return {
    getItems,
    registerItem,
  };
}

/**
 * Central keyboard/focus state machine for a menu content instance.
 * Handles roving tab index, arrow navigation, typeahead, and escape/tab close.
 */
export function useMenuContentState({
  closeOnTab = true,
  defaultHighlighted,
  open,
  onEscape,
  requestClose,
}: MenuContentStateOptions) {
  const root = useMenuRootContext('Menu.Content');
  const { getItems, registerItem } = useMenuCollection();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const typeaheadBufferRef = useRef('');
  const typeaheadTimerRef = useRef<number | null>(null);
  const previousOpenRef = useRef(open);

  /** Returns items that participate in navigation and typeahead. */
  const getEnabledItems = useCallback(() => {
    return getItems().filter((item) => !isDisabled(item));
  }, [getItems]);

  /** Moves focus/highlight to the first enabled item. */
  const focusFirst = useCallback(() => {
    const items = getEnabledItems();

    if (items.length === 0) {
      return;
    }

    setHighlightedId(items[0].id);
    items[0].ref?.focus();
    scrollItemIntoView(items[0].ref);
  }, [getEnabledItems]);

  /** Moves focus/highlight to the last enabled item. */
  const focusLast = useCallback(() => {
    const items = getEnabledItems();

    if (items.length === 0) {
      return;
    }

    const last = items[items.length - 1];

    setHighlightedId(last.id);
    last.ref?.focus();
    scrollItemIntoView(last.ref);
  }, [getEnabledItems]);

  /**
   * Moves focus by an item delta, honoring loop behavior at boundaries.
   */
  const focusByDelta = useCallback(
    (delta: number) => {
      const items = getEnabledItems();

      if (items.length === 0) {
        return;
      }

      const currentIndex = highlightedId
        ? items.findIndex((item) => item.id === highlightedId)
        : -1;
      const nextIndex = currentIndex + delta;

      if (nextIndex < 0) {
        if (!root.loop) {
          return;
        }

        const last = items[items.length - 1];
        setHighlightedId(last.id);
        last.ref?.focus();
        scrollItemIntoView(last.ref);
        return;
      }

      if (nextIndex >= items.length) {
        if (!root.loop) {
          return;
        }

        const first = items[0];
        setHighlightedId(first.id);
        first.ref?.focus();
        scrollItemIntoView(first.ref);
        return;
      }

      const next = items[nextIndex];

      setHighlightedId(next.id);
      next.ref?.focus();
      scrollItemIntoView(next.ref);
    },
    [getEnabledItems, highlightedId, root.loop]
  );

  /**
   * Typeahead selection relative to current highlight, wrapping through items.
   */
  const selectByTypeahead = useCallback(
    (query: string) => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        return;
      }

      const items = getEnabledItems();

      if (items.length === 0) {
        return;
      }

      const currentIndex = highlightedId
        ? items.findIndex((item) => item.id === highlightedId)
        : -1;

      for (let offset = 1; offset <= items.length; offset += 1) {
        const candidateIndex =
          (currentIndex + offset + items.length) % items.length;
        const candidate = items[candidateIndex];

        if (candidate.textValue.toLowerCase().startsWith(normalizedQuery)) {
          setHighlightedId(candidate.id);
          candidate.ref?.focus();
          scrollItemIntoView(candidate.ref);
          break;
        }
      }
    },
    [getEnabledItems, highlightedId]
  );

  useLayoutEffect(() => {
    if (!open) {
      previousOpenRef.current = false;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHighlightedId(null);
      return;
    }

    if (previousOpenRef.current) {
      return;
    }

    previousOpenRef.current = true;

    if (defaultHighlighted === 'last') {
      focusLast();
      return;
    }

    focusFirst();
  }, [defaultHighlighted, focusFirst, focusLast, open]);

  useLayoutEffect(() => {
    if (!open || highlightedId !== null) {
      return;
    }

    const items = getEnabledItems();

    if (items.length === 0) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlightedId(items[0].id);
  }, [getEnabledItems, highlightedId, open]);

  useLayoutEffect(() => {
    if (highlightedId === null) {
      return;
    }

    const items = getItems();
    const stillPresent = items.some((item) => item.id === highlightedId);

    if (!stillPresent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHighlightedId(null);
    }
  }, [getItems, highlightedId]);

  useEffect(
    () => () => {
      if (typeof window !== 'undefined' && typeaheadTimerRef.current !== null) {
        window.clearTimeout(typeaheadTimerRef.current);
      }
    },
    []
  );

  /** Handles keyboard navigation and selection shortcuts for content. */
  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape') {
        onEscape?.(event);
        root.onEscapeKeyDown?.(event);

        if (!event.defaultPrevented) {
          requestClose();
        }

        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        focusFirst();
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        focusLast();
        return;
      }

      const isVertical = root.orientation === 'vertical';
      const nextKey = isVertical
        ? 'ArrowDown'
        : root.dir === 'rtl'
          ? 'ArrowLeft'
          : 'ArrowRight';
      const prevKey = isVertical
        ? 'ArrowUp'
        : root.dir === 'rtl'
          ? 'ArrowRight'
          : 'ArrowLeft';

      if (event.key === nextKey) {
        event.preventDefault();
        focusByDelta(1);
        return;
      }

      if (event.key === prevKey) {
        event.preventDefault();
        focusByDelta(-1);
        return;
      }

      if (event.key === 'Tab') {
        if (closeOnTab) {
          requestClose();
        }

        return;
      }

      if (!root.typeahead || !isTypeaheadKey(event)) {
        return;
      }

      typeaheadBufferRef.current += event.key.toLowerCase();
      selectByTypeahead(typeaheadBufferRef.current);

      if (typeof window !== 'undefined') {
        if (typeaheadTimerRef.current !== null) {
          window.clearTimeout(typeaheadTimerRef.current);
        }

        typeaheadTimerRef.current = window.setTimeout(() => {
          typeaheadBufferRef.current = '';
          typeaheadTimerRef.current = null;
        }, DEFAULT_TYPEAHEAD_TIMEOUT);
      }
    },
    [
      closeOnTab,
      focusByDelta,
      focusFirst,
      focusLast,
      onEscape,
      requestClose,
      root,
      selectByTypeahead,
    ]
  );

  return {
    getItems,
    highlightedId,
    onKeyDown,
    registerItem,
    selectByTypeahead,
    setHighlightedId,
    focusByDelta,
    focusFirst,
    focusLast,
  };
}
