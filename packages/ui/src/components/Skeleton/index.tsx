/* eslint-disable react-refresh/only-export-components */

import { SkeletonRoot } from './components/SkeletonRoot';
import { SkeletonText } from './components/SkeletonText';
import { SkeletonAvatar } from './components/SkeletonAvatar';
import type {
  SkeletonRootProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
} from './types';

type SkeletonComponent = ((props: SkeletonRootProps) => React.JSX.Element) & {
  Text: typeof SkeletonText;
  Avatar: typeof SkeletonAvatar;
};

export const Skeleton = Object.assign(SkeletonRoot, {
  Text: SkeletonText,
  Avatar: SkeletonAvatar,
}) as SkeletonComponent;

export { SkeletonRoot, SkeletonText, SkeletonAvatar };
export type { SkeletonRootProps, SkeletonTextProps, SkeletonAvatarProps };
