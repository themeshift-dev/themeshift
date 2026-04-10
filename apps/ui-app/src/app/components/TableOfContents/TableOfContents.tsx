import classNames from 'classnames';
import { Link as ThemeShiftLink } from '@themeshift/ui/components/Link';
import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';

import {
  TableOfContentsProvider,
  useTableOfContents,
  type TableOfContentsRootProps,
} from './useTableOfContents';
import styles from './TableOfContents.module.scss';

type TableOfContentsLevel = 1 | 2;

type TableOfContentsMarkerProps = {
  id: string;
  label: string;
  level?: TableOfContentsLevel;
};

type TableOfContentsNavProps = {
  className?: string;
  emptyState?: ReactNode;
  title?: ReactNode;
};

type TableOfContentsItem = {
  children: TableOfContentsItem[];
  id: string;
  label: string;
};

const buildItems = (
  items: Array<{ id: string; label: string; level: TableOfContentsLevel }>
) => {
  const rootItems: TableOfContentsItem[] = [];
  let currentParent: TableOfContentsItem | null = null;

  for (const item of items) {
    if (item.level === 1) {
      const nextItem = { children: [], id: item.id, label: item.label };

      rootItems.push(nextItem);
      currentParent = nextItem;

      continue;
    }

    if (currentParent) {
      currentParent.children.push({
        children: [],
        id: item.id,
        label: item.label,
      });

      continue;
    }

    rootItems.push({ children: [], id: item.id, label: item.label });
  }

  return rootItems;
};

const isItemActive = (item: TableOfContentsItem, activeId: string | null) => {
  if (item.id === activeId) {
    return true;
  }

  return item.children.some((child) => child.id === activeId);
};

const renderItems = (
  items: TableOfContentsItem[],
  activeId: string | null,
  nested = false
) => {
  return (
    <ul className={nested ? styles.nestedList : styles.list}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const isParentActive = !isActive && isItemActive(item, activeId);

        return (
          <li className={styles.item} key={item.id}>
            <ThemeShiftLink
              className={classNames(
                styles.link,
                nested && styles.nestedLink,
                isActive && styles.linkActive,
                isParentActive && styles.linkParentActive
              )}
              href={`#${item.id}`}
            >
              {item.label}
            </ThemeShiftLink>

            {item.children.length > 0 &&
              renderItems(item.children, activeId, true)}
          </li>
        );
      })}
    </ul>
  );
};

export const TableOfContentsRoot = ({
  children,
  offsetTop,
}: TableOfContentsRootProps) => {
  return (
    <TableOfContentsProvider offsetTop={offsetTop}>
      {children}
    </TableOfContentsProvider>
  );
};

export const TableOfContentsNav = ({
  className,
  emptyState = null,
  title = 'On this page',
}: TableOfContentsNavProps) => {
  const { activeId, items } = useTableOfContents();
  const tree = useMemo(() => buildItems(items), [items]);

  if (!tree.length) {
    return <>{emptyState}</>;
  }

  return (
    <nav className={classNames(styles.nav, className)}>
      <p className={styles.title}>{title}</p>
      {renderItems(tree, activeId)}
    </nav>
  );
};

export const TableOfContentsMarker = ({
  id,
  label,
  level = 1,
}: TableOfContentsMarkerProps) => {
  const { offsetTopStyle, registerMarker, unregisterMarker } =
    useTableOfContents();
  const markerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    registerMarker({ id, label, level }, markerRef.current);

    return () => {
      unregisterMarker(id);
    };
  }, [id, label, level, registerMarker, unregisterMarker]);

  return (
    <span
      aria-hidden="true"
      className={styles.marker}
      id={id}
      ref={markerRef}
      style={
        {
          '--table-of-contents-offset-top': offsetTopStyle,
        } as CSSProperties
      }
    />
  );
};
