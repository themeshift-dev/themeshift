import { SkeletonRoot } from '../SkeletonRoot';

import { type SkeletonAvatarProps } from '../../types';

export const SkeletonAvatar = ({
  animation = 'pulse',
  circle = true,
  size = 48,
  ...props
}: SkeletonAvatarProps) => (
  <SkeletonRoot size={size} animation={animation} circle={circle} {...props} />
);
