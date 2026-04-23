import classNames from 'classnames';
import type { CSSProperties, ElementType } from 'react';

import boxStyles from '@/components/Box/Box.module.scss';
import { Box, type BoxProps } from '@/components/Box';
import {
  applyResponsiveStyleVar,
  mapAlignAlias,
  mapJustifyAlias,
  mapResponsiveValue,
  withSpacingTokens,
} from '@/components/Box/style-utils';

import type {
  GridContentAlignmentValue,
  GridItemProps,
  GridProps,
  GridTrackValue,
} from './types';

const withGridTrackValue = (value: GridTrackValue) => {
  if (typeof value === 'number') {
    return `repeat(${value}, minmax(0, 1fr))`;
  }

  return value;
};

const withColumnSpanEndValue = (value: number | 'full') => {
  if (value === 'full') {
    return '-1';
  }

  return `span ${value}`;
};

const withColumnSpanStartValue = (value: number | 'full') => {
  if (value === 'full') {
    return '1';
  }

  return null;
};

const withRowsValue = (value: GridTrackValue) => {
  if (typeof value === 'number') {
    return `repeat(${value}, minmax(0, 1fr))`;
  }

  return value;
};

const withItemSpanValue = (value: number) => `span ${value}`;

const withGridContentAlias = (value: GridContentAlignmentValue) =>
  mapJustifyAlias(value);

export const GridRoot = <T extends ElementType = 'div'>(
  props: GridProps<T>
) => {
  const {
    alignContent,
    alignItems,
    autoColumns,
    autoFlow,
    autoRows,
    columnGap,
    columns,
    gap,
    inline,
    justifyContent,
    justifyItems,
    rowGap,
    rows,
    style,
    templateAreas,
    templateColumns,
    templateRows,
    ...restProps
  } = props;

  const styleVars: CSSProperties & Record<string, number | string> = {};

  applyResponsiveStyleVar({
    cssProp: 'align-content',
    styleVars,
    transform: withGridContentAlias,
    value: alignContent,
  });

  applyResponsiveStyleVar({
    cssProp: 'align-items',
    styleVars,
    transform: mapAlignAlias,
    value: alignItems,
  });

  applyResponsiveStyleVar({
    cssProp: 'column-gap',
    styleVars,
    transform: withSpacingTokens,
    value: columnGap,
  });

  applyResponsiveStyleVar({
    cssProp: 'gap',
    styleVars,
    transform: withSpacingTokens,
    value: gap,
  });

  applyResponsiveStyleVar({
    cssProp: 'grid-auto-columns',
    styleVars,
    value: autoColumns,
  });

  applyResponsiveStyleVar({
    cssProp: 'grid-auto-flow',
    styleVars,
    value: autoFlow,
  });

  applyResponsiveStyleVar({
    cssProp: 'grid-auto-rows',
    styleVars,
    value: autoRows,
  });

  if (templateColumns !== undefined) {
    applyResponsiveStyleVar({
      cssProp: 'grid-template-columns',
      styleVars,
      value: templateColumns,
    });
  } else {
    applyResponsiveStyleVar({
      cssProp: 'grid-template-columns',
      styleVars,
      transform: withGridTrackValue,
      value: columns,
    });
  }

  if (templateRows !== undefined) {
    applyResponsiveStyleVar({
      cssProp: 'grid-template-rows',
      styleVars,
      value: templateRows,
    });
  } else {
    applyResponsiveStyleVar({
      cssProp: 'grid-template-rows',
      styleVars,
      transform: withRowsValue,
      value: rows,
    });
  }

  applyResponsiveStyleVar({
    cssProp: 'grid-template-areas',
    styleVars,
    value: templateAreas,
  });

  applyResponsiveStyleVar({
    cssProp: 'justify-content',
    styleVars,
    transform: mapJustifyAlias,
    value: justifyContent,
  });

  applyResponsiveStyleVar({
    cssProp: 'justify-items',
    styleVars,
    transform: mapAlignAlias,
    value: justifyItems,
  });

  applyResponsiveStyleVar({
    cssProp: 'row-gap',
    styleVars,
    transform: withSpacingTokens,
    value: rowGap,
  });

  const display = mapResponsiveValue(inline, (nextInline) =>
    nextInline ? 'inline-grid' : 'grid'
  );

  return (
    <Box
      {...(restProps as BoxProps<T>)}
      display={display ?? 'grid'}
      style={{ ...styleVars, ...style }}
    />
  );
};

export const GridItem = <T extends ElementType = 'div'>(
  props: GridItemProps<T>
) => {
  const {
    alignSelf,
    area,
    as,
    children,
    className,
    column,
    columnEnd,
    columnSpan,
    columnStart,
    justifySelf,
    row,
    rowEnd,
    rowSpan,
    rowStart,
    style,
    ...restProps
  } = props;

  const Component = as ?? 'div';
  const styleVars: CSSProperties & Record<string, number | string> = {};

  applyResponsiveStyleVar({
    cssProp: 'align-self',
    styleVars,
    transform: mapAlignAlias,
    value: alignSelf,
  });

  applyResponsiveStyleVar({
    cssProp: 'grid-area',
    styleVars,
    value: area,
  });

  if (column !== undefined) {
    applyResponsiveStyleVar({
      cssProp: 'grid-column',
      styleVars,
      value: column,
    });
  } else if (columnSpan !== undefined) {
    applyResponsiveStyleVar({
      cssProp: 'grid-column-end',
      styleVars,
      transform: withColumnSpanEndValue,
      value: columnSpan,
    });

    applyResponsiveStyleVar({
      cssProp: 'grid-column-start',
      styleVars,
      transform: withColumnSpanStartValue,
      value: columnSpan,
    });
  }

  applyResponsiveStyleVar({
    cssProp: 'grid-column-end',
    styleVars,
    value: columnEnd,
  });

  applyResponsiveStyleVar({
    cssProp: 'grid-column-start',
    styleVars,
    value: columnStart,
  });

  if (rowSpan === undefined) {
    applyResponsiveStyleVar({
      cssProp: 'grid-row',
      styleVars,
      value: row,
    });
  }

  if (rowSpan !== undefined) {
    applyResponsiveStyleVar({
      cssProp: 'grid-row-end',
      styleVars,
      transform: withItemSpanValue,
      value: rowSpan,
    });
  }

  applyResponsiveStyleVar({
    cssProp: 'grid-row-end',
    styleVars,
    value: rowEnd,
  });

  applyResponsiveStyleVar({
    cssProp: 'grid-row-start',
    styleVars,
    value: rowStart,
  });

  applyResponsiveStyleVar({
    cssProp: 'justify-self',
    styleVars,
    transform: mapJustifyAlias,
    value: justifySelf,
  });

  return (
    <Component
      {...restProps}
      className={classNames(boxStyles.item, className)}
      style={{ ...styleVars, ...style }}
    >
      {children}
    </Component>
  );
};

type GridComponent = (<T extends ElementType = 'div'>(
  props: GridProps<T>
) => React.JSX.Element) & {
  Item: <T extends ElementType = 'div'>(
    props: GridItemProps<T>
  ) => React.JSX.Element;
};

const GridComponentImpl = GridRoot as GridComponent;

GridComponentImpl.Item = GridItem;

export const Grid = GridComponentImpl;

export type {
  GridAutoFlowValue,
  GridContentAlignmentValue,
  GridItemOwnProps,
  GridItemProps,
  GridItemsAlignmentValue,
  GridOwnProps,
  GridProps,
  GridTrackValue,
} from './types';
