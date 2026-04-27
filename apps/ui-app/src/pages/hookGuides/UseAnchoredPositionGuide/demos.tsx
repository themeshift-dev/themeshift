import { Button } from '@themeshift/ui/components/Button';
import { useAnchoredPosition } from '@themeshift/ui/hooks/useAnchoredPosition';
import { useCallback, useState } from 'react';

const surfaceStyle = {
  alignItems: 'center',
  background: 'var(--themeshift-background-surface-raised)',
  border: '1px solid var(--themeshift-border-default)',
  borderRadius: 'var(--themeshift-radius-medium)',
  display: 'grid',
  minBlockSize: 60,
  padding: '0.5rem 0.75rem',
};

const compactTriggerStyle = {
  minBlockSize: 44,
  padding: '0.375rem 0.625rem',
};

const FloatingBox = ({
  anchorStyle,
  label,
  placement,
}: {
  anchorStyle?: Partial<typeof surfaceStyle>;
  label: string;
  placement: Parameters<typeof useAnchoredPosition>[0]['placement'];
}) => {
  const [open, setOpen] = useState(false);
  const { actualPlacement, anchorRef, floatingRef, style } =
    useAnchoredPosition({
      boundaryPadding: 8,
      flip: true,
      offset: 8,
      open,
      placement,
      shift: true,
      strategy: 'fixed',
    });
  const setAnchorButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      anchorRef.current = node;
    },
    [anchorRef]
  );
  const setFloatingDivRef = useCallback(
    (node: HTMLDivElement | null) => {
      floatingRef.current = node;
    },
    [floatingRef]
  );

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'inline-flex',
        position: 'relative',
      }}
    >
      <button
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        ref={setAnchorButtonRef}
        style={{ ...surfaceStyle, ...anchorStyle }}
        type="button"
      >
        {label}
      </button>

      {open ? (
        <div
          ref={setFloatingDivRef}
          style={{
            ...style,
            ...surfaceStyle,
            minBlockSize: 'auto',
            pointerEvents: 'none',
            position: style.position,
            zIndex: 100,
          }}
        >
          Actual placement: {actualPlacement}
        </div>
      ) : null}
    </div>
  );
};

export const BasicAnchoredDemo = () => {
  return (
    <div style={{ display: 'grid', gap: '0.75rem', inlineSize: '100%' }}>
      <p style={{ margin: 0, textAlign: 'center' }}>
        Hover or focus the button to position floating UI.
      </p>

      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          inlineSize: '100%',
          justifyItems: 'center',
          minBlockSize: 180,
          paddingBlockStart: '3rem',
        }}
      >
        <FloatingBox
          anchorStyle={compactTriggerStyle}
          label="Anchor"
          placement="top"
        />
      </div>
    </div>
  );
};

export const PlacementDemo = () => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
        inlineSize: '100%',
        paddingBlockStart: '3rem',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          justifyItems: 'center',
          minBlockSize: 140,
        }}
      >
        <FloatingBox
          anchorStyle={compactTriggerStyle}
          label="Top"
          placement="top"
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          justifyItems: 'center',
          minBlockSize: 140,
        }}
      >
        <FloatingBox
          anchorStyle={compactTriggerStyle}
          label="Right"
          placement="right"
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          justifyItems: 'center',
          minBlockSize: 140,
        }}
      >
        <FloatingBox
          anchorStyle={compactTriggerStyle}
          label="Bottom"
          placement="bottom"
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'grid',
          justifyItems: 'center',
          minBlockSize: 140,
        }}
      >
        <FloatingBox
          anchorStyle={compactTriggerStyle}
          label="Left"
          placement="left"
        />
      </div>
    </div>
  );
};

export const CollisionDemo = () => {
  const [open, setOpen] = useState(false);
  const { actualPlacement, anchorRef, floatingRef, style } =
    useAnchoredPosition({
      boundaryPadding: 8,
      flip: true,
      offset: 8,
      open,
      placement: 'top',
      shift: true,
      strategy: 'fixed',
    });
  const setAnchorButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      anchorRef.current = node;
    },
    [anchorRef]
  );
  const setFloatingDivRef = useCallback(
    (node: HTMLDivElement | null) => {
      floatingRef.current = node;
    },
    [floatingRef]
  );

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <p style={{ margin: 0 }}>
        Move near viewport edges and the floating element flips/shifts.
      </p>

      <div
        style={{
          border: '1px dashed var(--themeshift-border-default)',
          borderRadius: 'var(--themeshift-radius-small)',
          display: 'grid',
          justifyItems: 'start',
          minBlockSize: 180,
          padding: '0.75rem',
          paddingBlockStart: '3rem',
        }}
      >
        <button
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          ref={setAnchorButtonRef}
          style={{ ...surfaceStyle, ...compactTriggerStyle }}
          type="button"
        >
          Collision target
        </button>

        {open ? (
          <div
            ref={setFloatingDivRef}
            style={{
              ...style,
              ...surfaceStyle,
              pointerEvents: 'none',
              position: style.position,
            }}
          >
            Resolved placement: {actualPlacement}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const MatchWidthDemo = () => {
  const [open, setOpen] = useState(false);
  const { anchorRef, floatingRef, style } = useAnchoredPosition({
    matchTriggerWidth: true,
    offset: 8,
    open,
    placement: 'bottom-start',
  });
  const setAnchorButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      anchorRef.current = node;
    },
    [anchorRef]
  );
  const setFloatingDivRef = useCallback(
    (node: HTMLDivElement | null) => {
      floatingRef.current = node;
    },
    [floatingRef]
  );

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 320 }}>
      <Button
        asChild
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button ref={setAnchorButtonRef} type="button">
          Match trigger width
        </button>
      </Button>

      {open ? (
        <div
          ref={setFloatingDivRef}
          style={{
            ...style,
            ...surfaceStyle,
            minBlockSize: 40,
            position: style.position,
          }}
        >
          Width follows trigger
        </div>
      ) : null}
    </div>
  );
};
