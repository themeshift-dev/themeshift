import classNames from 'classnames';
import type { ElementType } from 'react';

import styles from './Box.module.scss';
import type { BoxProps, SizeValue, SpacingValue } from './Box.types';
import {
  applyResponsiveStyleVar,
  type StyleVars,
  withSpacingTokens,
} from './style-utils';

const withSizeValue = (value: SizeValue) => value;

const withSpacingValue = (value: SpacingValue) => withSpacingTokens(value);

function createBoxStyleVars<T extends ElementType>(
  props: BoxProps<T>
): StyleVars {
  const styleVars: StyleVars = {};

  applyResponsiveStyleVar({
    cssProp: 'display',
    styleVars,
    value: props.display,
  });

  applyResponsiveStyleVar({
    cssProp: 'height',
    styleVars,
    transform: withSizeValue,
    value: props.height,
  });

  applyResponsiveStyleVar({
    cssProp: 'margin',
    styleVars,
    transform: withSpacingValue,
    value: props.margin,
  });

  applyResponsiveStyleVar({
    cssProp: 'margin-inline',
    styleVars,
    transform: withSpacingValue,
    value: props.marginX,
  });

  applyResponsiveStyleVar({
    cssProp: 'margin-block',
    styleVars,
    transform: withSpacingValue,
    value: props.marginY,
  });

  applyResponsiveStyleVar({
    cssProp: 'margin-top',
    styleVars,
    transform: withSpacingValue,
    value: props.marginTop,
  });

  applyResponsiveStyleVar({
    cssProp: 'margin-right',
    styleVars,
    transform: withSpacingValue,
    value: props.marginRight,
  });

  applyResponsiveStyleVar({
    cssProp: 'margin-bottom',
    styleVars,
    transform: withSpacingValue,
    value: props.marginBottom,
  });

  applyResponsiveStyleVar({
    cssProp: 'margin-left',
    styleVars,
    transform: withSpacingValue,
    value: props.marginLeft,
  });

  applyResponsiveStyleVar({
    cssProp: 'max-height',
    styleVars,
    transform: withSizeValue,
    value: props.maxHeight,
  });

  applyResponsiveStyleVar({
    cssProp: 'max-width',
    styleVars,
    transform: withSizeValue,
    value: props.maxWidth,
  });

  applyResponsiveStyleVar({
    cssProp: 'min-height',
    styleVars,
    transform: withSizeValue,
    value: props.minHeight,
  });

  applyResponsiveStyleVar({
    cssProp: 'min-width',
    styleVars,
    transform: withSizeValue,
    value: props.minWidth,
  });

  applyResponsiveStyleVar({
    cssProp: 'overflow',
    styleVars,
    value: props.overflow,
  });

  applyResponsiveStyleVar({
    cssProp: 'overflow-x',
    styleVars,
    value: props.overflowX,
  });

  applyResponsiveStyleVar({
    cssProp: 'overflow-y',
    styleVars,
    value: props.overflowY,
  });

  applyResponsiveStyleVar({
    cssProp: 'padding',
    styleVars,
    transform: withSpacingValue,
    value: props.padding,
  });

  applyResponsiveStyleVar({
    cssProp: 'padding-inline',
    styleVars,
    transform: withSpacingValue,
    value: props.paddingX,
  });

  applyResponsiveStyleVar({
    cssProp: 'padding-block',
    styleVars,
    transform: withSpacingValue,
    value: props.paddingY,
  });

  applyResponsiveStyleVar({
    cssProp: 'padding-top',
    styleVars,
    transform: withSpacingValue,
    value: props.paddingTop,
  });

  applyResponsiveStyleVar({
    cssProp: 'padding-right',
    styleVars,
    transform: withSpacingValue,
    value: props.paddingRight,
  });

  applyResponsiveStyleVar({
    cssProp: 'padding-bottom',
    styleVars,
    transform: withSpacingValue,
    value: props.paddingBottom,
  });

  applyResponsiveStyleVar({
    cssProp: 'padding-left',
    styleVars,
    transform: withSpacingValue,
    value: props.paddingLeft,
  });

  applyResponsiveStyleVar({
    cssProp: 'width',
    styleVars,
    transform: withSizeValue,
    value: props.width,
  });

  return styleVars;
}

export const Box = <T extends ElementType = 'div'>(props: BoxProps<T>) => {
  const {
    as,
    children,
    className,
    display,
    height,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginX,
    marginY,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    overflow,
    overflowX,
    overflowY,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingX,
    paddingY,
    style,
    width,
    ...restProps
  } = props;

  const Component = as ?? 'div';

  const styleVars = createBoxStyleVars({
    as,
    children,
    className,
    display,
    height,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginX,
    marginY,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    overflow,
    overflowX,
    overflowY,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingX,
    paddingY,
    width,
  } as BoxProps<T>);

  return (
    <Component
      {...restProps}
      className={classNames(styles.root, className)}
      style={{ ...styleVars, ...style }}
    >
      {children}
    </Component>
  );
};

export type {
  AlignItemsValue,
  AlignSelfValue,
  AsProp,
  BoxBreakpoint,
  BoxOwnProps,
  DisplayValue,
  JustifyContentValue,
  JustifySelfValue,
  OverflowValue,
  PolymorphicProps,
  ResponsiveValue,
  SizeValue,
  SpaceToken,
  SpacingValue,
} from './Box.types';
export type { BoxProps };
