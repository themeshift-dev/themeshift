/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type TableOfContentsLevel = 1 | 2;

type TableOfContentsMarker = {
  id: string;
  label: string;
  level: TableOfContentsLevel;
  order: number;
};

type TableOfContentsContextValue = {
  activeId: string | null;
  items: TableOfContentsMarker[];
  offsetTopStyle: string;
  registerMarker: (
    marker: Omit<TableOfContentsMarker, 'order'>,
    element: HTMLElement | null
  ) => void;
  unregisterMarker: (id: string) => void;
};

const DEFAULT_OFFSET_TOP =
  'calc(var(--themeshift-components-navbar-min-height) + 1rem)';
const DEFAULT_OFFSET_TOP_PX = 88;
const DEFAULT_VIEWPORT_TARGET_RATIO = 0.2;

const TableOfContentsContext =
  createContext<TableOfContentsContextValue | null>(null);

const isResolvedPosition = (
  value: { distance: number; id: string } | null
): value is { distance: number; id: string } => Boolean(value);

const resolveOffsetTopStyle = (value?: number | string) => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  return DEFAULT_OFFSET_TOP;
};

const resolveOffsetTopPixels = (value?: number | string) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);

    if (!Number.isNaN(parsed) && value.includes('px')) {
      return parsed;
    }
  }

  return DEFAULT_OFFSET_TOP_PX;
};

const resolveActiveMarker = (
  items: TableOfContentsMarker[],
  elements: Map<string, HTMLElement>,
  offsetTopPixels: number
) => {
  if (!items.length) {
    return null;
  }

  const viewportCenter =
    offsetTopPixels +
    (window.innerHeight - offsetTopPixels) * DEFAULT_VIEWPORT_TARGET_RATIO;

  const positions = items
    .map((item) => {
      const element = elements.get(item.id);

      if (!element) {
        return null;
      }

      return {
        distance: Math.abs(
          element.getBoundingClientRect().top - viewportCenter
        ),
        id: item.id,
      };
    })
    .filter(isResolvedPosition);

  if (!positions.length) {
    return null;
  }

  positions.sort((a, b) => a.distance - b.distance);

  return positions[0]?.id ?? null;
};

export type TableOfContentsRootProps = {
  children: ReactNode;
  offsetTop?: number | string;
};

export const TableOfContentsProvider = ({
  children,
  offsetTop,
}: TableOfContentsRootProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<TableOfContentsMarker[]>([]);
  const elementsRef = useRef(new Map<string, HTMLElement>());
  const orderRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const offsetTopPixels = resolveOffsetTopPixels(offsetTop);
  const offsetTopStyle = resolveOffsetTopStyle(offsetTop);

  const updateActiveMarker = useCallback(() => {
    setActiveId((currentActiveId) => {
      const nextActiveId = resolveActiveMarker(
        items,
        elementsRef.current,
        offsetTopPixels
      );

      return nextActiveId ?? currentActiveId ?? items[0]?.id ?? null;
    });
  }, [items, offsetTopPixels]);

  const registerMarker = useCallback(
    (
      marker: Omit<TableOfContentsMarker, 'order'>,
      element: HTMLElement | null
    ) => {
      if (element) {
        elementsRef.current.set(marker.id, element);
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === marker.id);

        if (existingItem) {
          return currentItems
            .map((item) =>
              item.id === marker.id ? { ...item, ...marker } : item
            )
            .sort((a, b) => a.order - b.order);
        }

        return [
          ...currentItems,
          {
            ...marker,
            order: orderRef.current++,
          },
        ].sort((a, b) => a.order - b.order);
      });
    },
    []
  );

  const unregisterMarker = useCallback((id: string) => {
    elementsRef.current.delete(id);
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    setActiveId((currentActiveId) =>
      currentActiveId === id ? null : currentActiveId
    );
  }, []);

  useEffect(() => {
    if (!items.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(updateActiveMarker, {
      root: null,
      rootMargin: `-${offsetTopPixels}px 0px -65% 0px`,
      threshold: [0, 1],
    });

    for (const item of items) {
      const element = elementsRef.current.get(item.id);

      if (element) {
        observer.observe(element);
      }
    }

    updateActiveMarker();

    const handleScroll = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateActiveMarker();
      });
    };

    const handleResize = () => {
      updateActiveMarker();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [items, offsetTopPixels, updateActiveMarker]);

  const value = useMemo(
    () => ({
      activeId,
      items,
      offsetTopStyle,
      registerMarker,
      unregisterMarker,
    }),
    [activeId, items, offsetTopStyle, registerMarker, unregisterMarker]
  );

  return (
    <TableOfContentsContext.Provider value={value}>
      {children}
    </TableOfContentsContext.Provider>
  );
};

export const useTableOfContents = () => {
  const context = useContext(TableOfContentsContext);

  if (!context) {
    throw new Error(
      'TableOfContents components must be used within TableOfContents.Root.'
    );
  }

  return context;
};
