import type { CSSProperties, ElementType } from 'react';

import '@/components/Box/Box.module.scss';
import { Box, type BoxProps } from '@/components/Box';
import {
  applyResponsiveStyleVar,
  mapAlignAlias,
  mapJustifyAlias,
  mapResponsiveValue,
  withSpacingTokens,
} from '@/components/Box/style-utils';

import type { FlexProps } from './types';

export const Flex = <T extends ElementType = 'div'>(props: FlexProps<T>) => {
  const {
    align,
    alignContent,
    columnGap,
    direction,
    gap,
    inline,
    justify,
    rowGap,
    style,
    wrap,
    ...restProps
  } = props;

  const styleVars: CSSProperties & Record<string, number | string> = {};

  applyResponsiveStyleVar({
    cssProp: 'align-content',
    styleVars,
    transform: mapJustifyAlias,
    value: alignContent,
  });

  applyResponsiveStyleVar({
    cssProp: 'align-items',
    styleVars,
    transform: mapAlignAlias,
    value: align,
  });

  applyResponsiveStyleVar({
    cssProp: 'column-gap',
    styleVars,
    transform: withSpacingTokens,
    value: columnGap,
  });

  applyResponsiveStyleVar({
    cssProp: 'flex-direction',
    styleVars,
    value: direction,
  });

  applyResponsiveStyleVar({
    cssProp: 'flex-wrap',
    styleVars,
    value: wrap,
  });

  applyResponsiveStyleVar({
    cssProp: 'gap',
    styleVars,
    transform: withSpacingTokens,
    value: gap,
  });

  applyResponsiveStyleVar({
    cssProp: 'justify-content',
    styleVars,
    transform: mapJustifyAlias,
    value: justify,
  });

  applyResponsiveStyleVar({
    cssProp: 'row-gap',
    styleVars,
    transform: withSpacingTokens,
    value: rowGap,
  });

  const display = mapResponsiveValue(inline, (nextInline) =>
    nextInline ? 'inline-flex' : 'flex'
  );

  return (
    <Box
      {...(restProps as BoxProps<T>)}
      display={display ?? 'flex'}
      style={{ ...styleVars, ...style }}
    />
  );
};

export type {
  FlexAlignContentValue,
  FlexDirectionValue,
  FlexOwnProps,
  FlexProps,
  FlexWrapValue,
} from './types';
