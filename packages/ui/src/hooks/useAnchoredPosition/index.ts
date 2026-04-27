import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';

import { useResizeObserver } from '../useResizeObserver';

export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

type PlacementSide = 'top' | 'right' | 'bottom' | 'left';

type PlacementAlign = 'center' | 'start' | 'end';

export type UseAnchoredPositionOptions = {
  /**
   * Enables measurements and updates while the floating element is visible.
   */
  open: boolean;

  /**
   * Preferred floating placement relative to the anchor.
   */
  placement?: Placement;

  /**
   * Distance between anchor and floating element.
   */
  offset?: number;

  /**
   * Minimum viewport padding when preventing collisions.
   */
  boundaryPadding?: number;

  /**
   * CSS positioning strategy used by the floating element.
   */
  strategy?: 'fixed' | 'absolute';

  /**
   * Matches the floating width to the anchor width.
   */
  matchTriggerWidth?: boolean;

  /**
   * Allows placement to switch to the opposite side on collision.
   */
  flip?: boolean;

  /**
   * Clamps floating coordinates inside viewport bounds.
   */
  shift?: boolean;

  /**
   * Optional arrow node ref used to calculate arrow offsets.
   */
  arrowRef?: RefObject<HTMLElement | null>;
};

export type UseAnchoredPositionReturn = {
  /**
   * Ref object for the anchor/trigger element.
   */
  anchorRef: RefObject<HTMLElement | null>;

  /**
   * Ref object for the floating/content element.
   */
  floatingRef: RefObject<HTMLElement | null>;

  /**
   * Inline style object to apply to the floating element.
   */
  style: CSSProperties;

  /**
   * Inline style object to apply to the arrow element.
   */
  arrowStyle: CSSProperties;

  /**
   * Final placement after collision handling.
   */
  actualPlacement: Placement;

  /**
   * Recomputes floating and arrow coordinates immediately.
   */
  updatePosition: () => void;
};

type Coordinates = {
  x: number;
  y: number;
};

type FloatingLayout = {
  height: number;
  width: number;
};

const DEFAULT_BOUNDARY_PADDING = 8;
const DEFAULT_OFFSET = 8;
const DEFAULT_PLACEMENT: Placement = 'top';

function parsePlacement(placement: Placement): {
  align: PlacementAlign;
  side: PlacementSide;
} {
  const [side, align] = placement.split('-') as [
    PlacementSide,
    PlacementAlign?,
  ];

  return {
    align: align ?? 'center',
    side,
  };
}

function getOppositeSide(side: PlacementSide): PlacementSide {
  if (side === 'top') {
    return 'bottom';
  }

  if (side === 'bottom') {
    return 'top';
  }

  if (side === 'left') {
    return 'right';
  }

  return 'left';
}

function formatPlacement(
  side: PlacementSide,
  align: PlacementAlign
): Placement {
  if (align === 'center') {
    return side;
  }

  return `${side}-${align}` as Placement;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getViewportBounds(boundaryPadding: number) {
  return {
    maxX: window.innerWidth - boundaryPadding,
    maxY: window.innerHeight - boundaryPadding,
    minX: boundaryPadding,
    minY: boundaryPadding,
  };
}

function resolveCoordinates({
  anchorRect,
  floatingLayout,
  offset,
  placement,
}: {
  anchorRect: DOMRect;
  floatingLayout: FloatingLayout;
  offset: number;
  placement: Placement;
}): Coordinates {
  const { align, side } = parsePlacement(placement);
  const { height, width } = floatingLayout;

  let x = anchorRect.left + anchorRect.width / 2 - width / 2;
  let y = anchorRect.top + anchorRect.height / 2 - height / 2;

  if (side === 'top') {
    y = anchorRect.top - height - offset;
  }

  if (side === 'bottom') {
    y = anchorRect.bottom + offset;
  }

  if (side === 'left') {
    x = anchorRect.left - width - offset;
  }

  if (side === 'right') {
    x = anchorRect.right + offset;
  }

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') {
      x = anchorRect.left;
    }

    if (align === 'end') {
      x = anchorRect.right - width;
    }
  }

  if (side === 'left' || side === 'right') {
    if (align === 'start') {
      y = anchorRect.top;
    }

    if (align === 'end') {
      y = anchorRect.bottom - height;
    }
  }

  return { x, y };
}

function measureOverflow({
  boundaryPadding,
  coordinates,
  floatingLayout,
}: {
  boundaryPadding: number;
  coordinates: Coordinates;
  floatingLayout: FloatingLayout;
}) {
  const { maxX, maxY, minX, minY } = getViewportBounds(boundaryPadding);
  const right = coordinates.x + floatingLayout.width;
  const bottom = coordinates.y + floatingLayout.height;

  return {
    bottom: Math.max(0, bottom - maxY),
    left: Math.max(0, minX - coordinates.x),
    right: Math.max(0, right - maxX),
    top: Math.max(0, minY - coordinates.y),
  };
}

function getOverflowScore(overflows: ReturnType<typeof measureOverflow>) {
  return overflows.top + overflows.right + overflows.bottom + overflows.left;
}

function getArrowStyle({
  actualPlacement,
  arrowRect,
  anchorRect,
  floatingCoordinates,
  floatingLayout,
}: {
  actualPlacement: Placement;
  arrowRect: DOMRect | null;
  anchorRect: DOMRect;
  floatingCoordinates: Coordinates;
  floatingLayout: FloatingLayout;
}): CSSProperties {
  const arrowSize = arrowRect?.width || 10;
  const halfArrow = arrowSize / 2;
  const { side } = parsePlacement(actualPlacement);

  const style: CSSProperties = {
    position: 'absolute',
  };

  if (side === 'top') {
    const centerX =
      anchorRect.left + anchorRect.width / 2 - floatingCoordinates.x;
    style.left = `${clamp(centerX - halfArrow, 4, floatingLayout.width - arrowSize - 4)}px`;
    style.top = 'auto';
    style.bottom = `${-halfArrow}px`;
    return style;
  }

  if (side === 'bottom') {
    const centerX =
      anchorRect.left + anchorRect.width / 2 - floatingCoordinates.x;
    style.left = `${clamp(centerX - halfArrow, 4, floatingLayout.width - arrowSize - 4)}px`;
    style.top = `${-halfArrow}px`;
    style.bottom = 'auto';
    return style;
  }

  if (side === 'left') {
    const centerY =
      anchorRect.top + anchorRect.height / 2 - floatingCoordinates.y;
    style.top = `${clamp(centerY - halfArrow, 4, floatingLayout.height - arrowSize - 4)}px`;
    style.right = `${-halfArrow}px`;
    style.left = 'auto';
    return style;
  }

  const centerY =
    anchorRect.top + anchorRect.height / 2 - floatingCoordinates.y;
  style.top = `${clamp(centerY - halfArrow, 4, floatingLayout.height - arrowSize - 4)}px`;
  style.left = `${-halfArrow}px`;
  style.right = 'auto';

  return style;
}

/**
 * Positions a floating element relative to an anchor with collision handling.
 */
export function useAnchoredPosition({
  open,
  placement = DEFAULT_PLACEMENT,
  offset = DEFAULT_OFFSET,
  boundaryPadding = DEFAULT_BOUNDARY_PADDING,
  strategy = 'fixed',
  matchTriggerWidth = false,
  flip = true,
  shift = true,
  arrowRef,
}: UseAnchoredPositionOptions): UseAnchoredPositionReturn {
  const anchorRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [actualPlacement, setActualPlacement] = useState<Placement>(placement);
  const [style, setStyle] = useState<CSSProperties>(() => ({
    left: '-9999px',
    position: strategy,
    top: '-9999px',
  }));
  const [arrowStyle, setArrowStyle] = useState<CSSProperties>(() => ({
    position: 'absolute',
  }));

  const anchorObserver = useResizeObserver();
  const floatingObserver = useResizeObserver();

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const anchor = anchorRef.current;
    const floating = floatingRef.current;

    if (!open || !anchor || !floating) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const floatingRect = floating.getBoundingClientRect();
    const floatingLayout: FloatingLayout = {
      height: floatingRect.height,
      width: matchTriggerWidth ? anchorRect.width : floatingRect.width,
    };

    let nextPlacement = placement;
    let coordinates = resolveCoordinates({
      anchorRect,
      floatingLayout,
      offset,
      placement: nextPlacement,
    });

    if (flip) {
      const side = parsePlacement(nextPlacement).side;
      const oppositeSide = getOppositeSide(side);
      const oppositePlacement = formatPlacement(
        oppositeSide,
        parsePlacement(nextPlacement).align
      );
      const currentOverflow = measureOverflow({
        boundaryPadding,
        coordinates,
        floatingLayout,
      });
      const oppositeCoordinates = resolveCoordinates({
        anchorRect,
        floatingLayout,
        offset,
        placement: oppositePlacement,
      });
      const oppositeOverflow = measureOverflow({
        boundaryPadding,
        coordinates: oppositeCoordinates,
        floatingLayout,
      });

      if (
        getOverflowScore(oppositeOverflow) < getOverflowScore(currentOverflow)
      ) {
        nextPlacement = oppositePlacement;
        coordinates = oppositeCoordinates;
      }
    }

    if (shift) {
      const { maxX, maxY, minX, minY } = getViewportBounds(boundaryPadding);

      coordinates = {
        x: clamp(coordinates.x, minX, maxX - floatingLayout.width),
        y: clamp(coordinates.y, minY, maxY - floatingLayout.height),
      };
    }

    const positionStyle: CSSProperties = {
      left:
        strategy === 'absolute'
          ? `${coordinates.x + window.scrollX}px`
          : `${coordinates.x}px`,
      position: strategy,
      top:
        strategy === 'absolute'
          ? `${coordinates.y + window.scrollY}px`
          : `${coordinates.y}px`,
    };

    if (matchTriggerWidth) {
      positionStyle.width = `${anchorRect.width}px`;
    }

    setActualPlacement(nextPlacement);
    setStyle(positionStyle);

    if (arrowRef?.current) {
      setArrowStyle(
        getArrowStyle({
          actualPlacement: nextPlacement,
          anchorRect,
          arrowRect: arrowRef.current.getBoundingClientRect(),
          floatingCoordinates: coordinates,
          floatingLayout,
        })
      );
    }
  }, [
    arrowRef,
    boundaryPadding,
    flip,
    matchTriggerWidth,
    offset,
    open,
    placement,
    shift,
    strategy,
  ]);

  const requestAnimationUpdate = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updatePosition();
    });
  }, [updatePosition]);

  useLayoutEffect(() => {
    requestAnimationUpdate();
  }, [open, placement, requestAnimationUpdate]);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !floatingRef.current) {
      return;
    }

    anchorObserver.ref(anchorRef.current);
    floatingObserver.ref(floatingRef.current);
  }, [anchorObserver, floatingObserver, open]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') {
      return;
    }

    const listener = () => {
      requestAnimationUpdate();
    };

    window.addEventListener('resize', listener);
    window.addEventListener('scroll', listener, true);

    return () => {
      window.removeEventListener('resize', listener);
      window.removeEventListener('scroll', listener, true);
    };
  }, [open, requestAnimationUpdate]);

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationUpdate();
  }, [
    anchorObserver.rect,
    floatingObserver.rect,
    open,
    placement,
    requestAnimationUpdate,
  ]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    anchorRef,
    arrowStyle,
    actualPlacement,
    floatingRef,
    style,
    updatePosition,
  };
}
