import classNames from 'classnames';
import type { CSSProperties, SVGProps } from 'react';

import styles from './Icon.module.scss';

export interface IconProps extends Omit<
  SVGProps<SVGSVGElement>,
  'color' | 'style'
> {
  className?: string;
  color?: string;
  fillOpacity?: number;
  size?: number | string;
  style?: CSSProperties;
}

interface IconComponentProps extends IconProps {
  children: React.ReactNode;
  viewBox: string;
}

export const Icon = ({
  children,
  className,
  color = 'currentColor',
  fillOpacity,
  size = 16,
  viewBox,
  style,
  ...spreadProps
}: IconComponentProps) => (
  <svg
    {...spreadProps}
    className={classNames(styles.icon, className)}
    width={size}
    height={size}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    style={{
      color,
      fillOpacity,
      ...style,
    }}
  >
    {children}
  </svg>
);
