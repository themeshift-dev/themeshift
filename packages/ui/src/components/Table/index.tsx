/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  type AriaAttributes,
  Children,
  createContext,
  forwardRef,
  isValidElement,
  type JSX,
  type RefAttributes,
  useContext,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';

import styles from './Table.module.scss';
import type {
  ResponsiveVisibility,
  TableAlign,
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableColumn,
  TableContainerProps,
  TableDataProps,
  TableDensity,
  TableEmptyProps,
  TableFootProps,
  TableHeadProps,
  TableHeaderProps,
  TableProps,
  TableResponsiveBreakpoint,
  TableRowProps,
  TableSize,
  TableSortDirection,
  TableSurface,
  TableVerticalAlign,
} from './types';

const TABLE_SLOT_SYMBOL = Symbol.for('themeshift.table.slot');

type TableSlotMarker = {
  [TABLE_SLOT_SYMBOL]?: true;
};

type TableContextValue = {
  columnCount?: number;
  mode: 'children' | 'data';
};

type TableBodyContextValue = {
  inferredColumnCount?: number;
};

const TableContext = createContext<TableContextValue | null>(null);
const TableBodyContext = createContext<TableBodyContextValue | null>(null);

const alignClassMap = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
} satisfies Record<'start' | 'center' | 'end', string>;

const verticalAlignClassMap = {
  top: styles.verticalTop,
  middle: styles.verticalMiddle,
  bottom: styles.verticalBottom,
} satisfies Record<TableVerticalAlign, string>;

const sizeClassMap = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
} satisfies Record<TableSize, string>;

const densityClassMap = {
  compact: styles.densityCompact,
  comfortable: styles.densityComfortable,
  spacious: styles.densitySpacious,
} satisfies Record<TableDensity, string>;

const surfaceClassMap = {
  default: styles.surfaceDefault,
  subtle: styles.surfaceSubtle,
} satisfies Record<TableSurface, string>;

const responsiveBreakpointClassMap = {
  mobile: styles.responsiveScrollMobile,
  tablet: styles.responsiveScrollTablet,
  desktop: styles.responsiveScrollDesktop,
} satisfies Record<TableResponsiveBreakpoint, string>;

const hideBelowClassMap = {
  mobile: undefined,
  tablet: styles.hideBelowTablet,
  desktop: styles.hideBelowDesktop,
} satisfies Record<ResponsiveVisibility, string | undefined>;

function markTableSlot<T extends object>(component: T): T {
  (component as TableSlotMarker)[TABLE_SLOT_SYMBOL] = true;

  return component;
}

function getTypeName(element: ReactElement) {
  if (typeof element.type === 'string') {
    return element.type;
  }

  return (
    (element.type as { displayName?: string; name?: string }).displayName ??
    (element.type as { displayName?: string; name?: string }).name ??
    ''
  );
}

function isSlotName(element: ReactElement, slotName: string) {
  const typeName = getTypeName(element);

  return typeName === slotName;
}

function resolveSortDirection(
  sortDirection: TableSortDirection | undefined
): AriaAttributes['aria-sort'] {
  if (!sortDirection) {
    return undefined;
  }

  return sortDirection;
}

function resolveAlign(
  value: TableAlign | undefined
): 'start' | 'center' | 'end' {
  if (value === 'left') {
    return 'start';
  }

  if (value === 'right') {
    return 'end';
  }

  return value ?? 'start';
}

function withCellSizingStyle(
  style: CSSProperties | undefined,
  width: string | number | undefined,
  minWidth: string | number | undefined,
  maxWidth: string | number | undefined
): CSSProperties | undefined {
  if (width === undefined && minWidth === undefined && maxWidth === undefined) {
    return style;
  }

  return {
    ...style,
    width,
    minWidth,
    maxWidth,
  };
}

function toArray(children: ReactNode) {
  return Children.toArray(children);
}

function inferColumnCountFromRowChildren(
  children: ReactNode
): number | undefined {
  const rowChildren = toArray(children);
  let count = 0;

  for (const child of rowChildren) {
    if (!isValidElement(child)) {
      continue;
    }

    const typeName = getTypeName(child);
    const isCell =
      typeName === 'td' ||
      typeName === 'th' ||
      typeName === 'Table.Data' ||
      typeName === 'Table.Header' ||
      typeName === 'Table.Cell' ||
      child.type === TableData ||
      child.type === TableHeader ||
      child.type === TableCell;

    if (!isCell) {
      continue;
    }

    const colSpanValue = Number((child.props as { colSpan?: number }).colSpan);
    count +=
      Number.isFinite(colSpanValue) && colSpanValue > 0 ? colSpanValue : 1;
  }

  return count > 0 ? count : undefined;
}

function inferColumnCountFromBodyChildren(
  children: ReactNode
): number | undefined {
  const bodyChildren = toArray(children);

  for (const child of bodyChildren) {
    if (!isValidElement(child)) {
      continue;
    }

    const typeName = getTypeName(child);
    const isRow =
      typeName === 'tr' || typeName === 'Table.Row' || child.type === TableRow;

    if (isRow) {
      const count = inferColumnCountFromRowChildren(
        (child.props as { children?: ReactNode }).children
      );

      if (count !== undefined) {
        return count;
      }

      continue;
    }

    const childChildren = (child.props as { children?: ReactNode }).children;

    if (childChildren !== undefined) {
      const count = inferColumnCountFromBodyChildren(childChildren);

      if (count !== undefined) {
        return count;
      }
    }
  }

  return undefined;
}

function hasDeclarativeCaption(children: ReactNode): boolean {
  const items = toArray(children);

  for (const item of items) {
    if (!isValidElement(item)) {
      continue;
    }

    if (isSlotName(item, 'Table.Caption') || getTypeName(item) === 'caption') {
      return true;
    }

    const nestedChildren = (item.props as { children?: ReactNode }).children;

    if (nestedChildren && hasDeclarativeCaption(nestedChildren)) {
      return true;
    }
  }

  return false;
}

function warnDev(message: string) {
  if (import.meta.env?.DEV) {
    console.warn(`[Table] ${message}`);
  }
}

function callEventHandler<EventType>(
  handler: ((event: EventType) => void) | undefined,
  event: EventType
) {
  handler?.(event);
}

const TableContainer = markTableSlot(
  forwardRef<HTMLDivElement, TableContainerProps>(
    (
      {
        children,
        className,
        focusable,
        label,
        maxHeight,
        scroll = 'none',
        style,
        ...containerProps
      },
      ref
    ) => {
      const scrollEnabled = scroll !== 'none';
      const resolvedFocusable = focusable ?? scrollEnabled;

      if (scrollEnabled && resolvedFocusable && !label) {
        warnDev(
          'When Table.Container is focusable and scroll is enabled, pass a `label` for aria-label.'
        );
      }

      const resolvedLabel =
        scrollEnabled && resolvedFocusable
          ? (label ?? 'Scrollable table')
          : label;

      return (
        <div
          {...containerProps}
          aria-label={scrollEnabled ? resolvedLabel : undefined}
          className={classNames(
            styles.container,
            scroll === 'horizontal' && styles.containerScrollHorizontal,
            scroll === 'vertical' && styles.containerScrollVertical,
            scroll === 'both' && styles.containerScrollBoth,
            className
          )}
          ref={ref}
          role={scrollEnabled ? 'region' : undefined}
          style={{
            ...style,
            maxHeight,
          }}
          tabIndex={resolvedFocusable ? 0 : undefined}
        >
          {children}
        </div>
      );
    }
  )
);

TableContainer.displayName = 'Table.Container';

const TableCaption = markTableSlot(
  forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
    (
      {
        children,
        className,
        placement = 'top',
        style,
        visuallyHidden = false,
        ...captionProps
      },
      ref
    ) => {
      return (
        <caption
          {...captionProps}
          className={classNames(
            styles.caption,
            placement === 'bottom' && styles.captionBottom,
            visuallyHidden && styles.visuallyHidden,
            className
          )}
          ref={ref}
          style={style}
        >
          {children}
        </caption>
      );
    }
  )
);

TableCaption.displayName = 'Table.Caption';

const TableHead = markTableSlot(
  forwardRef<HTMLTableSectionElement, TableHeadProps>(
    ({ children, className, sticky = false, style, ...headProps }, ref) => {
      return (
        <thead
          {...headProps}
          className={classNames(
            styles.head,
            sticky && styles.headSticky,
            className
          )}
          ref={ref}
          style={style}
        >
          {children}
        </thead>
      );
    }
  )
);

TableHead.displayName = 'Table.Head';

const TableBody = markTableSlot(
  forwardRef<HTMLTableSectionElement, TableBodyProps>(
    ({ children, className, style, ...bodyProps }, ref) => {
      const inferredColumnCount = inferColumnCountFromBodyChildren(children);

      return (
        <TableBodyContext.Provider value={{ inferredColumnCount }}>
          <tbody
            {...bodyProps}
            className={classNames(styles.body, className)}
            ref={ref}
            style={style}
          >
            {children}
          </tbody>
        </TableBodyContext.Provider>
      );
    }
  )
);

TableBody.displayName = 'Table.Body';

const TableFoot = markTableSlot(
  forwardRef<HTMLTableSectionElement, TableFootProps>(
    ({ children, className, style, ...footProps }, ref) => {
      return (
        <tfoot
          {...footProps}
          className={classNames(styles.foot, className)}
          ref={ref}
          style={style}
        >
          {children}
        </tfoot>
      );
    }
  )
);

TableFoot.displayName = 'Table.Foot';

const TableRow = markTableSlot(
  forwardRef<HTMLTableRowElement, TableRowProps>(
    (
      {
        children,
        className,
        disabled = false,
        hover,
        interactive,
        onClick,
        onKeyDown,
        selected = false,
        style,
        ...rowProps
      },
      ref
    ) => {
      const resolvedInteractive = disabled
        ? false
        : (interactive ?? Boolean(onClick));

      return (
        <tr
          {...rowProps}
          aria-disabled={disabled || undefined}
          aria-selected={selected || undefined}
          className={classNames(
            styles.row,
            selected && styles.rowSelected,
            disabled && styles.rowDisabled,
            (hover ?? resolvedInteractive) && styles.rowHover,
            resolvedInteractive && styles.rowInteractive,
            className
          )}
          data-disabled={disabled ? '' : undefined}
          data-interactive={resolvedInteractive ? '' : undefined}
          ref={ref}
          style={style}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }

            callEventHandler(onClick, event);
          }}
          onKeyDown={(event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }

            callEventHandler(onKeyDown, event);
          }}
        >
          {children}
        </tr>
      );
    }
  )
);

TableRow.displayName = 'Table.Row';

const TableHeader = markTableSlot(
  forwardRef<HTMLTableCellElement, TableHeaderProps>(
    (
      {
        align,
        children,
        className,
        maxWidth,
        minWidth,
        nowrap,
        scope = 'col',
        sticky = false,
        sortDirection,
        style,
        truncate,
        verticalAlign = 'middle',
        width,
        ...headerProps
      },
      ref
    ) => {
      const resolvedAlign = resolveAlign(align);

      return (
        <th
          {...headerProps}
          aria-sort={resolveSortDirection(sortDirection)}
          className={classNames(
            styles.cell,
            styles.header,
            alignClassMap[resolvedAlign],
            verticalAlignClassMap[verticalAlign],
            sticky && styles.stickyCell,
            nowrap && styles.nowrap,
            truncate && styles.truncate,
            className
          )}
          data-align={resolvedAlign}
          ref={ref}
          scope={scope}
          style={withCellSizingStyle(style, width, minWidth, maxWidth)}
        >
          {children}
        </th>
      );
    }
  )
);

TableHeader.displayName = 'Table.Header';

const TableData = markTableSlot(
  forwardRef<HTMLTableCellElement, TableDataProps>(
    (
      {
        align,
        children,
        className,
        maxWidth,
        minWidth,
        nowrap,
        sticky = false,
        style,
        truncate,
        verticalAlign = 'middle',
        width,
        ...dataProps
      },
      ref
    ) => {
      const resolvedAlign = resolveAlign(align);

      return (
        <td
          {...dataProps}
          className={classNames(
            styles.cell,
            alignClassMap[resolvedAlign],
            verticalAlignClassMap[verticalAlign],
            sticky && styles.stickyCell,
            nowrap && styles.nowrap,
            truncate && styles.truncate,
            className
          )}
          data-align={resolvedAlign}
          ref={ref}
          style={withCellSizingStyle(style, width, minWidth, maxWidth)}
        >
          {children}
        </td>
      );
    }
  )
);

TableData.displayName = 'Table.Data';

const TableCell = markTableSlot(
  forwardRef<HTMLTableCellElement, TableCellProps>(
    (
      {
        align,
        as = 'td',
        children,
        className,
        maxWidth,
        minWidth,
        nowrap,
        sticky = false,
        style,
        truncate,
        verticalAlign = 'middle',
        width,
        ...cellProps
      },
      ref
    ) => {
      const resolvedAlign = resolveAlign(align);
      const Component = as;

      return (
        <Component
          {...cellProps}
          className={classNames(
            styles.cell,
            as === 'th' && styles.header,
            alignClassMap[resolvedAlign],
            verticalAlignClassMap[verticalAlign],
            sticky && styles.stickyCell,
            nowrap && styles.nowrap,
            truncate && styles.truncate,
            className
          )}
          data-align={resolvedAlign}
          ref={ref}
          style={withCellSizingStyle(style, width, minWidth, maxWidth)}
        >
          {children}
        </Component>
      );
    }
  )
);

TableCell.displayName = 'Table.Cell';

const TableEmpty = markTableSlot(
  forwardRef<HTMLTableRowElement, TableEmptyProps>(
    (
      {
        action,
        children,
        className,
        colSpan,
        description,
        style,
        title = 'No data available',
        ...emptyProps
      },
      ref
    ) => {
      const tableContext = useContext(TableContext);
      const bodyContext = useContext(TableBodyContext);
      const inferredColumnCount = bodyContext?.inferredColumnCount;
      const contextColumnCount = tableContext?.columnCount;

      let resolvedColSpan =
        colSpan ?? contextColumnCount ?? inferredColumnCount;

      if (!resolvedColSpan) {
        warnDev(
          'Unable to infer Table.Empty colSpan. Pass `colSpan` explicitly when using custom children composition.'
        );
        resolvedColSpan = 1;
      }

      return (
        <tr
          {...emptyProps}
          className={classNames(styles.emptyRow, className)}
          ref={ref}
          style={style}
        >
          <td
            className={classNames(styles.cell, styles.emptyCell)}
            colSpan={resolvedColSpan}
          >
            {children ?? (
              <div className={styles.emptyContent}>
                {title ? <p className={styles.emptyTitle}>{title}</p> : null}
                {description ? (
                  <p className={styles.emptyDescription}>{description}</p>
                ) : null}
                {action ? (
                  <div className={styles.emptyAction}>{action}</div>
                ) : null}
              </div>
            )}
          </td>
        </tr>
      );
    }
  )
);

TableEmpty.displayName = 'Table.Empty';

function getColumnValue<TData>(row: TData, column: TableColumn<TData>) {
  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }

  if (typeof column.accessor === 'string') {
    return row[column.accessor];
  }

  return (row as Record<string, unknown>)[column.key];
}

function normalizeCellProps(
  value:
    | TableDataProps
    | ((row: unknown, index: number) => TableDataProps)
    | undefined,
  row: unknown,
  index: number
): TableDataProps | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'function') {
    return value(row, index);
  }

  return value;
}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      border = false,
      caption,
      className,
      columns,
      data,
      density = 'comfortable',
      emptyState,
      fullWidth = true,
      getRowKey,
      getRowProps,
      hover = false,
      responsive = 'none',
      responsiveBreakpoint = 'tablet',
      size = 'medium',
      striped = false,
      style,
      surface = 'default',
      children,
      ...tableProps
    },
    ref
  ) => {
    const hasChildren = children !== undefined;
    const hasData = data !== undefined;
    const hasColumns = columns !== undefined;

    if (hasChildren && (hasData || hasColumns)) {
      warnDev(
        'Received both `children` and `data`/`columns`. Using `children` mode.'
      );
    }

    if (!hasChildren && hasData && !hasColumns) {
      warnDev('When `data` is provided, `columns` is required.');
    }

    const mode: 'children' | 'data' = hasChildren ? 'children' : 'data';
    const resolvedColumns = hasColumns ? columns : [];
    const resolvedData = hasData ? data : [];
    const columnCount =
      mode === 'data' ? (resolvedColumns?.length ?? undefined) : undefined;
    const hasDeclarativeCaptionContent = hasChildren
      ? hasDeclarativeCaption(children)
      : false;

    const table = (
      <TableContext.Provider
        value={{
          columnCount,
          mode,
        }}
      >
        <table
          {...tableProps}
          className={classNames(
            styles.root,
            sizeClassMap[size],
            densityClassMap[density],
            surfaceClassMap[surface],
            fullWidth && styles.fullWidth,
            border && styles.withBorder,
            striped && styles.striped,
            hover && styles.hoverRows,
            className
          )}
          data-mode={mode}
          data-responsive={responsive}
          ref={ref}
          style={style}
        >
          {!hasDeclarativeCaptionContent && caption ? (
            <TableCaption>{caption}</TableCaption>
          ) : null}

          {mode === 'children' ? (
            children
          ) : (
            <>
              <TableHead>
                <TableRow>
                  {resolvedColumns?.map((column) => {
                    const columnHeaderProps = column.headerProps ?? {};
                    const {
                      align,
                      className: headerClassName,
                      maxWidth,
                      minWidth,
                      style: headerStyle,
                      verticalAlign,
                      width,
                      ...restHeaderProps
                    } = columnHeaderProps;

                    return (
                      <TableHeader
                        {...restHeaderProps}
                        key={column.key}
                        align={align ?? column.align}
                        className={classNames(
                          column.sticky && styles.stickyCell,
                          hideBelowClassMap[column.hideBelow ?? 'mobile'],
                          headerClassName
                        )}
                        maxWidth={maxWidth ?? column.maxWidth}
                        minWidth={minWidth ?? column.minWidth}
                        style={withCellSizingStyle(
                          headerStyle,
                          width ?? column.width,
                          minWidth ?? column.minWidth,
                          maxWidth ?? column.maxWidth
                        )}
                        verticalAlign={verticalAlign ?? column.verticalAlign}
                        width={width ?? column.width}
                      >
                        {column.header}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {resolvedData && resolvedData.length > 0 ? (
                  resolvedData.map((row, rowIndex) => {
                    const derivedRowProps =
                      (getRowProps?.(row, rowIndex) as
                        | TableRowProps
                        | undefined) ?? {};
                    const {
                      className: rowClassName,
                      hover: rowHover,
                      style: rowStyle,
                      ...restRowProps
                    } = derivedRowProps;

                    return (
                      <TableRow
                        {...restRowProps}
                        key={
                          getRowKey
                            ? getRowKey(row, rowIndex)
                            : `${rowIndex}-${String(
                                (row as Record<string, unknown>).id ?? rowIndex
                              )}`
                        }
                        className={rowClassName}
                        hover={rowHover ?? hover}
                        style={rowStyle}
                      >
                        {resolvedColumns?.map((column) => {
                          const value = getColumnValue(row, column);
                          const renderedValue = column.render
                            ? column.render(value, row, rowIndex)
                            : (value as ReactNode);
                          const columnDataProps = normalizeCellProps(
                            column.dataProps as
                              | TableDataProps
                              | ((
                                  row: unknown,
                                  index: number
                                ) => TableDataProps)
                              | undefined,
                            row,
                            rowIndex
                          );
                          const {
                            align,
                            className: dataClassName,
                            maxWidth,
                            minWidth,
                            style: dataStyle,
                            verticalAlign,
                            width,
                            ...restDataProps
                          } = columnDataProps ?? {};

                          return (
                            <TableData
                              {...restDataProps}
                              key={column.key}
                              align={align ?? column.align}
                              className={classNames(
                                column.sticky && styles.stickyCell,
                                hideBelowClassMap[column.hideBelow ?? 'mobile'],
                                dataClassName
                              )}
                              maxWidth={maxWidth ?? column.maxWidth}
                              minWidth={minWidth ?? column.minWidth}
                              style={withCellSizingStyle(
                                dataStyle,
                                width ?? column.width,
                                minWidth ?? column.minWidth,
                                maxWidth ?? column.maxWidth
                              )}
                              verticalAlign={
                                verticalAlign ?? column.verticalAlign
                              }
                              width={width ?? column.width}
                            >
                              {renderedValue}
                            </TableData>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : isValidElement(emptyState) &&
                  isSlotName(emptyState, 'Table.Empty') ? (
                  emptyState
                ) : (
                  <TableEmpty colSpan={resolvedColumns?.length}>
                    {emptyState}
                  </TableEmpty>
                )}
              </TableBody>
            </>
          )}
        </table>
      </TableContext.Provider>
    );

    if (responsive === 'scroll') {
      return (
        <div
          className={classNames(
            styles.responsiveScroll,
            responsiveBreakpointClassMap[responsiveBreakpoint]
          )}
        >
          {table}
        </div>
      );
    }

    return table;
  }
);

TableRoot.displayName = 'Table';

type TableComponent = (<TData = unknown>(
  props: TableProps<TData> & RefAttributes<HTMLTableElement>
) => JSX.Element) & {
  Body: typeof TableBody;
  Caption: typeof TableCaption;
  Cell: typeof TableCell;
  Container: typeof TableContainer;
  Data: typeof TableData;
  Empty: typeof TableEmpty;
  Foot: typeof TableFoot;
  Head: typeof TableHead;
  Header: typeof TableHeader;
  Row: typeof TableRow;
};

/** Compound table component for semantic and data-driven rendering modes. */
export const Table = Object.assign(TableRoot, {
  Body: TableBody,
  Caption: TableCaption,
  Cell: TableCell,
  Container: TableContainer,
  Data: TableData,
  Empty: TableEmpty,
  Foot: TableFoot,
  Head: TableHead,
  Header: TableHeader,
  Row: TableRow,
}) as TableComponent;

export type {
  ResponsiveVisibility,
  TableAlign,
  TableBodyProps,
  TableCaptionProps,
  TableCellBaseProps,
  TableCellProps,
  TableColumn,
  TableContainerProps,
  TableDataProps,
  TableDensity,
  TableEmptyProps,
  TableFootProps,
  TableHeadProps,
  TableHeaderProps,
  TableProps,
  TableResponsiveBreakpoint,
  TableResponsiveMode,
  TableRowProps,
  TableSize,
  TableSortDirection,
  TableSurface,
  TableVerticalAlign,
} from './types';
