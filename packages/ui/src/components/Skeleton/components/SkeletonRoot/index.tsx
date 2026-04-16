import classNames from 'classnames';
import { type CSSProperties } from 'react';

import styles from './SkeletonRoot.module.scss';
import type { SkeletonAnimation, SkeletonRootProps } from '../../types';

const animationClassMap = {
  pulse: styles.pulse,
  shimmer: styles.shimmer,
  none: null,
} satisfies Record<SkeletonAnimation, string | null>;

export const SkeletonRoot = ({
  animation = 'pulse',
  className,
  size,
  height = '1rem',
  width = '100%',
  radius = '.5rem',
  circle,
  ...props
}: SkeletonRootProps) => {
  const style = {
    ...props.style,
    height,
    width,
    borderRadius: radius,
  } as CSSProperties;

  if (size) {
    style.height = size;
    style.width = size;
  }

  if (circle) {
    style.borderRadius = '9999px';
  }

  return (
    <div
      {...props}
      aria-hidden={true}
      className={classNames(
        styles.container,
        animationClassMap[animation],
        className
      )}
      style={style}
    />
  );
};
