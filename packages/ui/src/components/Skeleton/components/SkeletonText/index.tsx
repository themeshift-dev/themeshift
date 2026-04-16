import classNames from 'classnames';
import { type CSSProperties, useMemo } from 'react';

import type { SkeletonTextProps } from '../../types';
import { SkeletonRoot } from '../SkeletonRoot';
import styles from './SkeletonText.module.scss';

export const SkeletonText = ({
  animation = 'pulse',
  className,
  gap = '.5rem',
  lineHeight = '1rem',
  lineRadius,
  lines = 3,
  lastLineWidth = '40%',
  lineProps,
  ...props
}: SkeletonTextProps) => {
  const linesMemo = useMemo(() => Array.from({ length: lines }), [lines]);
  const style = {
    gap,
    ...props.style,
  } satisfies CSSProperties;

  return (
    <div
      {...props}
      aria-hidden={true}
      className={classNames(styles.container, className)}
      style={style}
    >
      {linesMemo.map((_, lineNumber) => (
        <SkeletonRoot
          key={lineNumber}
          height={lineHeight}
          animation={animation}
          radius={lineRadius}
          width={lineNumber === lines - 1 ? lastLineWidth : '100%'}
          {...lineProps}
        />
      ))}
    </div>
  );
};
