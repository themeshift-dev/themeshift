import { Button } from '@themeshift/ui/components/Button';
import { Card } from '@themeshift/ui/components/Card';
import { useOnClickOutside } from '@themeshift/ui/hooks/useOnClickOutside';
import { useRef, useState } from 'react';

const panelStyle = {
  border: '1px solid var(--themeshift-border-default)',
  borderRadius: 'var(--themeshift-radius-medium)',
  padding: '0.75rem',
};

export const BasicOutsideClickDemo = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  useOnClickOutside(panelRef, () => {
    setIsOpen(false);
  });

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 360 }}>
      <Button onClick={() => setIsOpen(true)} type="button">
        Open panel
      </Button>

      {isOpen ? (
        <div ref={panelRef} style={panelStyle}>
          Click anywhere outside this panel to close it.
        </div>
      ) : (
        <p style={{ margin: 0 }}>Panel closed</p>
      )}
    </div>
  );
};

export const CustomEventTypeDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastEvent, setLastEvent] = useState('None');

  useOnClickOutside(
    containerRef,
    () => {
      setLastEvent('focusin');
    },
    'focusin'
  );

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 420 }}>
      <div ref={containerRef}>
        <Card padding="small">
          <Card.Header>
            <Card.Title>Focus-aware container</Card.Title>
            <Card.Description>
              Tabbing to elements outside this card triggers the hook.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Button type="button">Inside action</Button>
          </Card.Body>
        </Card>
      </div>

      <Button intent="secondary" type="button">
        Outside action
      </Button>

      <p style={{ margin: 0 }}>
        Last outside event: <strong>{lastEvent}</strong>
      </p>
    </div>
  );
};

export const CallbackFreshStateDemo = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [outsideCount, setOutsideCount] = useState(0);

  useOnClickOutside(panelRef, () => {
    setOutsideCount((value) => value + 1);
  });

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: 360 }}>
      <div ref={panelRef} style={panelStyle}>
        Click outside repeatedly to increment the counter.
      </div>

      <p style={{ margin: 0 }}>
        Outside interactions: <strong>{outsideCount}</strong>
      </p>
    </div>
  );
};
