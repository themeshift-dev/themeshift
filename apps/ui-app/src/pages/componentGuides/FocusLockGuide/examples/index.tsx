import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@themeshift/ui/components/Button';
import {
  FocusLock,
  type FocusLockAdapterComponent,
} from '@themeshift/ui/components/FocusLock';
import { Navbar } from '@themeshift/ui/components/Navbar';

export const basicUsage = {
  code: `<div ref={containerRef} role="dialog" aria-modal="true" aria-label="Quick actions">
  <FocusLock active={open} containerRef={containerRef}>
    <button type="button">Save</button>
    <button type="button">Cancel</button>
  </FocusLock>
</div>`,
  label: 'Basic usage',
  sample: () => {
    const [open, setOpen] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <Button onClick={() => setOpen((value) => !value)}>
          {open ? 'Disable lock' : 'Enable lock'}
        </Button>

        <button type="button">Outside action</button>

        <div
          aria-label="Quick actions"
          aria-modal="true"
          ref={containerRef}
          role="dialog"
          style={{
            border: '1px solid currentColor',
            borderRadius: 8,
            padding: 12,
          }}
        >
          <FocusLock
            active={open}
            autoFocus={false}
            containerRef={containerRef}
          >
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <button type="button">Save</button>
              <button type="button">Cancel</button>
            </div>
          </FocusLock>
        </div>
      </div>
    );
  },
};

export const autoFocusAndReturnFocus = {
  code: `<FocusLock
  active={open}
  autoFocus
  containerRef={containerRef}
  returnFocus
>
  ...
</FocusLock>`,
  label: 'Autofocus + return focus',
  sample: () => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <Button onClick={() => setOpen((value) => !value)}>
          {open ? 'Close panel' : 'Open panel'}
        </Button>

        <div
          aria-label="Panel controls"
          aria-modal="true"
          ref={containerRef}
          role="dialog"
          style={{
            border: '1px solid currentColor',
            borderRadius: 8,
            padding: 12,
          }}
        >
          <FocusLock
            active={open}
            autoFocus
            containerRef={containerRef}
            returnFocus
          >
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <button type="button">Primary action</button>
              <button type="button">Secondary action</button>
            </div>
          </FocusLock>
        </div>
      </div>
    );
  },
};

export const shardsWithPortal = {
  code: `const shardRef = useRef<HTMLDivElement | null>(null);

<FocusLock active containerRef={containerRef} shards={[shardRef]}>
  <button type="button">Menu action</button>
</FocusLock>

{createPortal(
  <div ref={shardRef}>
    <button type="button">Portaled action</button>
  </div>,
  document.body
)}`,
  label: 'Shards + portal',
  sample: () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const shardRef = useRef<HTMLDivElement | null>(null);

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div
          ref={containerRef}
          style={{
            border: '1px solid currentColor',
            borderRadius: 8,
            padding: 12,
          }}
        >
          <FocusLock
            active
            autoFocus={false}
            containerRef={containerRef}
            shards={[shardRef]}
          >
            <button type="button">Menu action</button>
          </FocusLock>
        </div>

        <button type="button">Outside action</button>

        {createPortal(
          <div
            ref={shardRef}
            style={{
              border: '1px dashed currentColor',
              borderRadius: 8,
              left: 16,
              padding: 12,
              position: 'fixed',
              top: 16,
            }}
          >
            <button type="button">Portaled action</button>
          </div>,
          document.body
        )}
      </div>
    );
  },
};

const SoftFocusLockAdapter: FocusLockAdapterComponent = ({
  active,
  autoFocus,
  children,
  containerRef,
  returnFocus,
  shards,
}) => (
  <FocusLock
    active={active}
    autoFocus={autoFocus}
    containerRef={containerRef}
    returnFocus={returnFocus}
    shards={shards}
  >
    <div
      data-focus-lock-adapter="soft-outline"
      style={{
        outline: active ? '2px solid currentColor' : 'none',
        outlineOffset: 4,
      }}
    >
      {children}
    </div>
  </FocusLock>
);

export const customAdapter = {
  code: `const SoftFocusLockAdapter: FocusLockAdapterComponent = ({
  active,
  autoFocus,
  children,
  containerRef,
  returnFocus,
  shards,
}) => (
  <FocusLock
    active={active}
    autoFocus={autoFocus}
    containerRef={containerRef}
    returnFocus={returnFocus}
    shards={shards}
  >
    <div data-focus-lock-adapter="soft-outline">{children}</div>
  </FocusLock>
);

<Navbar.Menu
  focusLockComponent={SoftFocusLockAdapter}
  placement="drawer"
>
  ...
</Navbar.Menu>`,
  label: 'Custom adapter with Navbar',
  sample: (
    <Navbar aria-label="FocusLock adapter demo">
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
        <Navbar.Toggle aria-label="Toggle drawer menu">Menu</Navbar.Toggle>
      </Navbar.Container>

      <Navbar.Menu
        defaultOpen
        focusLockComponent={SoftFocusLockAdapter}
        placement="drawer"
      >
        <Navbar.List>
          <Navbar.Item>
            <Navbar.Link href="/docs">Docs</Navbar.Link>
          </Navbar.Item>
          <Navbar.Item>
            <Navbar.Link href="/components">Components</Navbar.Link>
          </Navbar.Item>
        </Navbar.List>
      </Navbar.Menu>
    </Navbar>
  ),
};

export const propHighlights = [
  basicUsage,
  autoFocusAndReturnFocus,
  customAdapter,
];
