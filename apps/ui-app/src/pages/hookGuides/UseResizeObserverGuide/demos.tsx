import { Button } from '@themeshift/ui/components/Button';
import { useResizeObserver } from '@themeshift/ui/hooks/useResizeObserver';
import { useState } from 'react';

const boxStyle = {
  alignItems: 'center',
  background: 'var(--themeshift-background-surface-raised)',
  border: '1px solid var(--themeshift-border-default)',
  borderRadius: 'var(--themeshift-radius-medium)',
  display: 'grid',
  minBlockSize: 72,
  padding: '0.75rem',
};

export const BasicObserverDemo = () => {
  const [expanded, setExpanded] = useState(false);
  const { rect, ref } = useResizeObserver();

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 360 }}>
      <Button
        onClick={() => setExpanded((value) => !value)}
        style={{ width: 'max-content' }}
        type="button"
      >
        Toggle width
      </Button>

      <div
        ref={ref}
        style={{
          ...boxStyle,
          inlineSize: expanded ? 340 : 220,
          transition: 'inline-size 180ms ease',
        }}
      >
        Observed container
      </div>

      <p style={{ margin: 0 }}>
        Size:{' '}
        {rect ? `${Math.round(rect.width)} x ${Math.round(rect.height)}` : '—'}
      </p>
    </div>
  );
};

export const DynamicTargetDemo = () => {
  const [target, setTarget] = useState<'left' | 'right'>('left');
  const { rect, ref } = useResizeObserver();

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 420 }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button onClick={() => setTarget('left')} type="button">
          Observe left
        </Button>
        <Button
          intent="secondary"
          onClick={() => setTarget('right')}
          type="button"
        >
          Observe right
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '0.5rem',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div
          ref={target === 'left' ? ref : undefined}
          style={{ ...boxStyle, inlineSize: 160 }}
        >
          Left target
        </div>
        <div
          ref={target === 'right' ? ref : undefined}
          style={{ ...boxStyle, inlineSize: 240 }}
        >
          Right target
        </div>
      </div>

      <p style={{ margin: 0 }}>
        Observing <strong>{target}</strong> target:{' '}
        {rect ? Math.round(rect.width) : '—'}px
      </p>
    </div>
  );
};

export const BoxOptionDemo = () => {
  const [box, setBox] = useState<'border-box' | 'content-box'>('content-box');
  const { rect, ref } = useResizeObserver({ box });
  const measurement = rect
    ? `${Math.round(rect.width)} x ${Math.round(rect.height)}`
    : '—';

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 360 }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button onClick={() => setBox('content-box')} type="button">
          content-box
        </Button>
        <Button
          intent="secondary"
          onClick={() => setBox('border-box')}
          type="button"
        >
          border-box
        </Button>
      </div>

      <div
        ref={ref}
        style={{
          ...boxStyle,
          borderWidth: '8px',
          inlineSize: 300,
          padding: '1rem',
        }}
      >
        Box mode: {box}
      </div>

      <p style={{ margin: 0 }}>Measured: {measurement}</p>
    </div>
  );
};

export const UnsupportedFallbackDemo = () => {
  const { isSupported, rect, ref } = useResizeObserver();

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 360 }}>
      <div ref={ref} style={{ ...boxStyle, inlineSize: 260 }}>
        ResizeObserver support status
      </div>

      <p style={{ margin: 0 }}>
        Supported: <strong>{`${isSupported}`}</strong>
      </p>

      <p style={{ margin: 0 }}>
        Current size:{' '}
        {rect
          ? `${Math.round(rect.width)} x ${Math.round(rect.height)}`
          : 'Unavailable'}
      </p>
    </div>
  );
};
