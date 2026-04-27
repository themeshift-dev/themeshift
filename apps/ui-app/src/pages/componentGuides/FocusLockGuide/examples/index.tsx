import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@themeshift/ui/components/Button';
import type { FocusLockAdapterComponent } from '@themeshift/ui/components/FocusLock';
import { Navbar } from '@themeshift/ui/components/Navbar';

import { LazyFocusLock as FocusLock } from '@/app/components/LazyFocusLock';

export const basicUsage = {
  code: `<div ref={containerRef} role="dialog" aria-modal="true" aria-label="Quick actions">
  <FocusLock active={open} containerRef={containerRef}>
    <button type="button">Save</button>
    <button type="button">Cancel</button>
  </FocusLock>
  </div>`,
  label: 'Basic usage',
  sample: function useBasicUsageSample() {
    const [open, setOpen] = useState(false);
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
  sample: function useAutoFocusAndReturnFocusSample() {
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
  code: `const [open, setOpen] = useState(false);
const shardRef = useRef<HTMLDivElement | null>(null);

<FocusLock active={open} containerRef={containerRef} shards={[shardRef]}>
  <button type="button">Menu action</button>
</FocusLock>

{open && createPortal(
  <div ref={shardRef}>
    <button type="button">Portaled action</button>
  </div>,
  document.body
)}`,
  label: 'Shards + portal',
  sample: function useShardsWithPortalSample() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const shardRef = useRef<HTMLDivElement | null>(null);

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <Button onClick={() => setOpen((value) => !value)}>
          {open ? 'Disable lock' : 'Enable lock'}
        </Button>

        <div
          ref={containerRef}
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
            shards={[shardRef]}
          >
            <button type="button">Menu action</button>
          </FocusLock>
        </div>

        <button type="button">Outside action</button>

        {open &&
          createPortal(
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

const softFocusLockAdapter: FocusLockAdapterComponent = ({
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
  sample: function useCustomAdapterSample() {
    return (
      <Navbar aria-label="FocusLock adapter demo">
        <Navbar.Container>
          <Navbar.Brand as="span">ThemeShift</Navbar.Brand>
          <Navbar.Toggle aria-label="Toggle drawer menu">Menu</Navbar.Toggle>
        </Navbar.Container>

        <Navbar.Menu
          focusLockComponent={softFocusLockAdapter}
          onClickOutside="close"
          placement="drawer"
        >
          <Navbar.List>
            <Navbar.Item>
              <Navbar.Link
                href="#focus-lock-docs"
                onClick={(event) => event.preventDefault()}
              >
                Docs
              </Navbar.Link>
            </Navbar.Item>
            <Navbar.Item>
              <Navbar.Link
                href="#focus-lock-components"
                onClick={(event) => event.preventDefault()}
              >
                Components
              </Navbar.Link>
            </Navbar.Item>
          </Navbar.List>
        </Navbar.Menu>
      </Navbar>
    );
  },
};

export const propHighlights = [
  basicUsage,
  autoFocusAndReturnFocus,
  customAdapter,
];
