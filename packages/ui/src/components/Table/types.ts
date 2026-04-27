import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

/** Size scale for table typography and baseline cell spacing. */
export type TableSize = 'small' | 'medium' | 'large';

/** Density scale for tightening or loosening row spacing. */
export type TableDensity = 'compact' | 'comfortable' | 'spacious';

/** Horizontal alignment options for header and data cells. */
export type TableAlign = 'start' | 'center' | 'end' | 'left' | 'right';

/** Vertical alignment options for header and data cells. */
export type TableVerticalAlign = 'top' | 'middle' | 'bottom';

/** Surface style for table backgrounds. */
export type TableSurface = 'default' | 'subtle';

/** Sort direction values mapped to `aria-sort` on header cells. */
export type TableSortDirection = 'ascending' | 'descending' | 'none' | 'other';

/** Responsive presentation mode for table layout behavior. */
export type TableResponsiveMode = 'none' | 'scroll' | 'stack';

/** Breakpoints used by responsive visibility controls. */
export type ResponsiveVisibility = 'mobile' | 'tablet' | 'desktop';

/** Shared responsive breakpoint options for table-level behaviors. */
export type TableResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop';

/** Base shared props for data/header/cell primitives. */
export type TableCellBaseProps = {
  /** Horizontal alignment for cell content. */
  align?: TableAlign;

  /** Additional class names to append to the cell. */
  className?: string;

  /** Column span value forwarded to native table cell elements. */
  colSpan?: number;

  /** Maximum inline size constraint for the cell. */
  maxWidth?: string | number;

  /** Minimum inline size constraint for the cell. */
  minWidth?: string | number;

  /** Prevents wrapping and keeps content on one line. */
  nowrap?: boolean;

  /** Row span value forwarded to native table cell elements. */
  rowSpan?: number;

  /** Inline style object forwarded to the cell element. */
  style?: CSSProperties;

  /** Pins the cell to inline-start with sticky positioning. */
  sticky?: boolean;

  /** Truncates overflowed content to a single line with ellipsis. */
  truncate?: boolean;

  /** Vertical alignment for cell content. */
  verticalAlign?: TableVerticalAlign;

  /** Width constraint for the cell. */
  width?: string | number;
};

/** Props for `<Table.Header>` primitive rendering a native `th`. */
export type TableHeaderProps = TableCellBaseProps & {
  /** Header cell contents. */
  children?: ReactNode;

  /** Header scope for table semantics. */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';

  /** Sort state mapped to native `aria-sort`. */
  sortDirection?: TableSortDirection;
} & Omit<
    ThHTMLAttributes<HTMLTableCellElement>,
    | 'align'
    | 'children'
    | 'className'
    | 'colSpan'
    | 'maxWidth'
    | 'minWidth'
    | 'rowSpan'
    | 'scope'
    | 'style'
    | 'width'
  >;

/** Props for `<Table.Data>` primitive rendering a native `td`. */
export type TableDataProps = TableCellBaseProps & {
  /** Data cell contents. */
  children?: ReactNode;
} & Omit<
    TdHTMLAttributes<HTMLTableCellElement>,
    | 'align'
    | 'children'
    | 'className'
    | 'colSpan'
    | 'maxWidth'
    | 'minWidth'
    | 'rowSpan'
    | 'style'
    | 'width'
  >;

/** Props for `<Table.Cell>` alias primitive. */
export type TableCellProps = TableCellBaseProps & {
  /** Data or header cell element to render. */
  as?: 'th' | 'td';

  /** Cell contents. */
  children?: ReactNode;
} & Omit<
    HTMLAttributes<HTMLTableCellElement>,
    'align' | 'children' | 'className' | 'colSpan' | 'rowSpan' | 'style'
  >;

/** Props for `<Table.Row>` primitive rendering a native `tr`. */
export type TableRowProps = {
  /** Row contents, typically header or data cells. */
  children?: ReactNode;

  /** Additional class names to append to the row element. */
  className?: string;

  /** Disables row interaction styling and event handling. */
  disabled?: boolean;

  /** Visual hover style toggle for the row. */
  hover?: boolean;

  /** Visual affordance for click-like row behavior. */
  interactive?: boolean;

  /** Click handler for row interactions. */
  onClick?: React.MouseEventHandler<HTMLTableRowElement>;

  /** Keyboard handler forwarded to native row events. */
  onKeyDown?: React.KeyboardEventHandler<HTMLTableRowElement>;

  /** Visual selected state with matching `aria-selected` semantics. */
  selected?: boolean;

  /** Inline styles for the row. */
  style?: CSSProperties;
} & Omit<
  HTMLAttributes<HTMLTableRowElement>,
  'children' | 'className' | 'disabled' | 'onClick' | 'onKeyDown' | 'style'
>;

/** Props for `<Table.Caption>` primitive rendering a native `caption`. */
export type TableCaptionProps = {
  /** Caption content. */
  children: ReactNode;

  /** Additional class names for the caption element. */
  className?: string;

  /** Renders the caption visually hidden while preserving semantics. */
  visuallyHidden?: boolean;

  /** Placement control for caption visual position. */
  placement?: 'top' | 'bottom';

  /** Inline styles for the caption element. */
  style?: CSSProperties;
} & Omit<
  HTMLAttributes<HTMLTableCaptionElement>,
  'children' | 'className' | 'style'
>;

/** Props for `<Table.Head>` primitive rendering a native `thead`. */
export type TableHeadProps = {
  /** Header row content. */
  children: ReactNode;

  /** Additional class names for the head section. */
  className?: string;

  /** Enables sticky header positioning. */
  sticky?: boolean;

  /** Inline styles for the head section. */
  style?: CSSProperties;
} & Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  'children' | 'className' | 'style'
>;

/** Props for `<Table.Body>` primitive rendering a native `tbody`. */
export type TableBodyProps = {
  /** Body row content. */
  children: ReactNode;

  /** Additional class names for the body section. */
  className?: string;

  /** Inline styles for the body section. */
  style?: CSSProperties;
} & Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  'children' | 'className' | 'style'
>;

/** Props for `<Table.Foot>` primitive rendering a native `tfoot`. */
export type TableFootProps = {
  /** Footer row content. */
  children: ReactNode;

  /** Additional class names for the foot section. */
  className?: string;

  /** Inline styles for the foot section. */
  style?: CSSProperties;
} & Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  'children' | 'className' | 'style'
>;

/** Props for `<Table.Empty>` empty-state helper row. */
export type TableEmptyProps = {
  /** Optional custom empty-state content. */
  children?: ReactNode;

  /** Optional empty-state action content rendered below description. */
  action?: ReactNode;

  /** Additional class names for the empty-state row. */
  className?: string;

  /** Overrides inferred table column span for the empty-state cell. */
  colSpan?: number;

  /** Optional descriptive content rendered below the title. */
  description?: ReactNode;

  /** Inline styles for the empty-state row. */
  style?: CSSProperties;

  /** Optional title content for the built-in empty-state layout. */
  title?: ReactNode;
} & Omit<
  HTMLAttributes<HTMLTableRowElement>,
  'children' | 'className' | 'style'
>;

/** Props for `<Table.Container>` scroll helper wrapper. */
export type TableContainerProps = {
  /** Wrapped table element or table-related content. */
  children: ReactNode;

  /** Makes the scroll region keyboard focusable. */
  focusable?: boolean;

  /** Accessible label required for focusable scroll regions. */
  label?: string;

  /** Max block size constraint for vertical scrolling contexts. */
  maxHeight?: string | number;

  /** Scroll direction behavior for the container. */
  scroll?: 'none' | 'horizontal' | 'vertical' | 'both';
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** Column definition used by data-driven table rendering mode. */
export type TableColumn<TData> = {
  /** Extracts raw cell value from row data when needed. */
  accessor?: keyof TData | ((row: TData) => unknown);

  /** Default alignment for header and data cells in this column. */
  align?: TableAlign;

  /** Per-row extra props for data cells in this column. */
  dataProps?: TableDataProps | ((row: TData, index: number) => TableDataProps);

  /** Hides this column below the selected responsive breakpoint. */
  hideBelow?: ResponsiveVisibility;

  /** Header content for this column. */
  header: ReactNode;

  /** Additional props for header cells in this column. */
  headerProps?: TableHeaderProps;

  /** Stable key used for rendering and fallback value lookup. */
  key: string;

  /** Maximum inline size for this column. */
  maxWidth?: string | number;

  /** Minimum inline size for this column. */
  minWidth?: string | number;

  /** Optional renderer for custom cell presentation. */
  render?: (value: unknown, row: TData, index: number) => ReactNode;

  /** Pins the column to inline-start using sticky positioning. */
  sticky?: boolean;

  /** Vertical alignment for header and data cells in this column. */
  verticalAlign?: TableVerticalAlign;

  /** Preferred width for this column. */
  width?: string | number;
};

/** Shared visual and behavioral props for table root rendering. */
export type TableSharedProps<TData> = {
  /** Shows a border around the table shell. */
  border?: boolean;

  /** Optional caption rendered when no `Table.Caption` child is provided. */
  caption?: ReactNode;

  /** Additional class names appended to the table element. */
  className?: string;

  /** Density preset applied to row spacing. */
  density?: TableDensity;

  /** Optional empty-state content used in data mode when no rows exist. */
  emptyState?: ReactNode;

  /** Makes the table span the full available inline size. */
  fullWidth?: boolean;

  /** Computes row keys in data mode. */
  getRowKey?: (row: TData, index: number) => React.Key;

  /** Computes additional row props in data mode. */
  getRowProps?: (row: TData, index: number) => TableRowProps;

  /** Enables hover background styles for rows. */
  hover?: boolean;

  /** Responsive table behavior mode. */
  responsive?: TableResponsiveMode;

  /** Breakpoint used by table-level responsive mode. */
  responsiveBreakpoint?: TableResponsiveBreakpoint;

  /** Size preset applied to typography and spacing scale. */
  size?: TableSize;

  /** Enables striped row backgrounds. */
  striped?: boolean;

  /** Surface style for table background treatments. */
  surface?: TableSurface;

  /** Inline styles passed to the table element. */
  style?: CSSProperties;
};

/** Declarative composition mode using native children markup. */
export type TableChildrenModeProps = {
  /** Declarative table content built from primitives or native children. */
  children: ReactNode;

  /** Data-mode columns are unavailable in children mode. */
  columns?: never;

  /** Data-mode rows are unavailable in children mode. */
  data?: never;
};

/** Data-driven mode using column definitions and row data arrays. */
export type TableDataModeProps<TData> = {
  /** Column definitions used to render header and data cells. */
  columns: TableColumn<TData>[];

  /** Children are unavailable in data mode. */
  children?: never;

  /** Row data source for data-driven rendering. */
  data: TData[];
};

/** Root props for the ThemeShift table component. */
export type TableProps<TData = unknown> =
  | (TableChildrenModeProps &
      TableSharedProps<TData> &
      Omit<HTMLAttributes<HTMLTableElement>, 'children' | 'style'>)
  | (TableDataModeProps<TData> &
      TableSharedProps<TData> &
      Omit<HTMLAttributes<HTMLTableElement>, 'children' | 'style'>);
