import React from 'react';
import classNames from 'classnames';

import styles from './Heading.module.scss';

/** Supported heading levels. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Props for the ThemeShift heading component. */
export type HeadingProps = {
  /** Semantic heading level to render. */
  level?: HeadingLevel;

  /** Applies the muted heading color treatment. */
  muted?: boolean;
} & React.ComponentPropsWithoutRef<'h1'>;

const levelElementMap = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

const levelClassMap = {
  1: styles.h1,
  2: styles.h2,
  3: styles.h3,
  4: styles.h4,
  5: styles.h5,
  6: styles.h6,
} satisfies Record<HeadingLevel, string>;

/** A semantic heading with ThemeShift typography styles. */
export const Heading = ({
  children,
  className,
  level = 1,
  muted = false,
  ...headingProps
}: HeadingProps) => {
  return React.createElement(
    levelElementMap[level],
    {
      ...headingProps,
      className: classNames(
        className,
        styles.heading,
        muted && styles.muted,
        levelClassMap[level]
      ),
    },
    children
  );
};
