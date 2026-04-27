import {
  BasicAnchoredDemo,
  CollisionDemo,
  MatchWidthDemo,
  PlacementDemo,
} from './demos';

export const basicUsage = {
  code: `const { anchorRef, floatingRef, style } = useAnchoredPosition({
  open,
  placement: 'top',
  offset: 8,
  flip: true,
  shift: true,
  strategy: 'fixed',
});

<button ref={anchorRef}>Trigger</button>
<div ref={floatingRef} style={style}>Floating content</div>;`,
  label: 'Basic usage',
  sample: () => <BasicAnchoredDemo />,
};

export const placements = {
  code: `useAnchoredPosition({
  open,
  placement: 'right-start',
  offset: 8,
  flip: true,
  shift: true,
});`,
  label: 'Placement options',
  sample: () => <PlacementDemo />,
};

export const collisionHandling = {
  code: `useAnchoredPosition({
  open,
  placement: 'top',
  boundaryPadding: 8,
  flip: true,
  shift: true,
});`,
  label: 'Collision handling',
  sample: () => <CollisionDemo />,
};

export const matchTriggerWidth = {
  code: `useAnchoredPosition({
  open,
  placement: 'bottom-start',
  matchTriggerWidth: true,
});`,
  label: 'Match trigger width',
  sample: () => <MatchWidthDemo />,
};

export const commonUseCases = [
  basicUsage,
  placements,
  collisionHandling,
  matchTriggerWidth,
];
