import { Button } from '@themeshift/ui/components/Button';
import { Tooltip } from '@themeshift/ui/components/Tooltip';
import classNames from 'classnames';
import { LuAlignEndVertical, LuAlignStartVertical } from 'react-icons/lu';
import {
  Children,
  useCallback,
  createContext,
  type FocusEvent,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { CopyButton, ScrollFade, SyntaxHighlighter } from '@/app/components';

import styles from './LayoutViewer.module.scss';
import type {
  LayoutViewerDir,
  LayoutViewerExample,
  LayoutViewerExampleProps,
  LayoutViewerFocusMode,
  LayoutViewerMode,
  LayoutViewerProps,
  LayoutViewerRegion,
  LayoutViewerRootProps,
  LayoutViewerState,
  LayoutViewerViewport,
} from './types';

const VIEWPORT_OPTIONS: LayoutViewerViewport[] = [
  'mobile',
  'tablet',
  'desktop',
  'wide',
];
const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isTabbableElementHidden(element: HTMLElement) {
  if (element.hasAttribute('hidden')) {
    return true;
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true;
  }

  if (element.hasAttribute('inert')) {
    return true;
  }

  if (element instanceof HTMLInputElement && element.type === 'hidden') {
    return true;
  }

  const computedStyle =
    element.ownerDocument.defaultView?.getComputedStyle(element);

  if (
    computedStyle?.display === 'none' ||
    computedStyle?.visibility === 'hidden'
  ) {
    return true;
  }

  return false;
}

function getFirstTabbableElement(root: ParentNode) {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)
  );

  return elements.find((element) => !isTabbableElementHidden(element));
}

function getTabbableElements(root: ParentNode) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)
  ).filter((element) => !isTabbableElementHidden(element));
}

function focusFirstTabbableElement(root: ParentNode) {
  const target = getFirstTabbableElement(root);

  if (!(target instanceof HTMLElement)) {
    return false;
  }

  target.focus({ preventScroll: true });
  return true;
}

function focusFirstTabbableWithRetries(
  root: ParentNode,
  win: Window | null | undefined,
  remainingAttempts = 8
) {
  const focused = focusFirstTabbableElement(root);

  if (focused || !win || remainingAttempts <= 1) {
    return;
  }

  win.requestAnimationFrame(() => {
    focusFirstTabbableWithRetries(root, win, remainingAttempts - 1);
  });
}

const defaultPlaceholder = (region: Exclude<LayoutViewerRegion, 'center'>) => (
  <div className={styles.placeholder} data-region={region}>
    {region}
  </div>
);

type ContextValue = {
  activeExample?: LayoutViewerExample;
  activeExampleId?: string;
  examples: LayoutViewerExample[];
  focusMode: LayoutViewerFocusMode;
  frameDescription: string;
  frameLabel: string;
  frameTitle: string;
  height: string;
  isCodeOpen: boolean;
  isInteracting: boolean;
  isolation: 'iframe' | 'inline';
  minHeight?: string;
  mode: LayoutViewerMode;
  openInNewTabHref?: string;
  region: LayoutViewerRegion;
  renderPlaceholder: (
    region: Exclude<LayoutViewerRegion, 'center'>
  ) => ReactNode;
  restoreFocusOnExit: boolean;
  setCodeOpen: (next: boolean) => void;
  setDir: (next: LayoutViewerDir) => void;
  setExampleId: (id: string) => void;
  setInteracting: (next: boolean) => void;
  setViewport: (next: LayoutViewerViewport) => void;
  showCode: boolean;
  title?: string;
  viewerId: string;
  viewport: LayoutViewerViewport;
  dir: LayoutViewerDir;
};

const LayoutViewerContext = createContext<ContextValue | null>(null);

function useLayoutViewerContext(componentName: string) {
  const context = useContext(LayoutViewerContext);

  if (!context) {
    throw new Error(`${componentName} must be used within LayoutViewer.Root.`);
  }

  return context;
}

function useControllableState<Value>(
  controlledValue: Value | undefined,
  defaultValue: Value,
  onChange?: (value: Value) => void
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = (next: Value) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
  };

  return [value, setValue] as const;
}

function formatSize(value: number | string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

function getOpenHref(
  openInNewTabHref: LayoutViewerProps['openInNewTabHref'] | undefined,
  state: LayoutViewerState
) {
  if (!openInNewTabHref) {
    return undefined;
  }

  if (typeof openInNewTabHref === 'function') {
    return openInNewTabHref(state);
  }

  return openInNewTabHref;
}

function LayoutViewerExample(props: LayoutViewerExampleProps) {
  void props;
  return null;
}

function resolveExamples(
  examples: LayoutViewerExample[] | undefined,
  children: ReactNode
) {
  if (examples?.length) {
    return examples;
  }

  const nextExamples: LayoutViewerExample[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== LayoutViewerExample) {
      return;
    }

    const props = child.props as LayoutViewerExampleProps;

    nextExamples.push({
      code: props.code,
      id: props.id,
      label: props.label,
      render: props.children,
    });
  });

  return nextExamples;
}

function getLayoutViewerCode(example?: LayoutViewerExample) {
  return example?.code ?? '// Add code to this example.';
}

function LayoutViewerRoot({
  activeExample,
  children,
  className,
  defaultCodeOpen = false,
  defaultDir = 'ltr',
  defaultExample,
  defaultViewport = 'desktop',
  dir,
  examples,
  focusMode = 'enter-to-interact',
  frameDescription = 'Preview canvas for layout example.',
  frameLabel = 'Layout example preview',
  frameTitle,
  height = 420,
  isolation = 'iframe',
  minHeight,
  mode = 'contained',
  onDirChange,
  onExampleChange,
  onViewportChange,
  openInNewTabHref,
  region = 'center',
  renderPlaceholder = defaultPlaceholder,
  restoreFocusOnExit = true,
  showCode = true,
  title,
  viewport,
}: LayoutViewerRootProps) {
  const normalizedExamples = useMemo(
    () => resolveExamples(examples, children),
    [children, examples]
  );
  const firstExample = normalizedExamples[0];
  const viewerId = useId();

  const [activeExampleId, setActiveExampleId] = useControllableState(
    activeExample,
    defaultExample ?? firstExample?.id ?? '',
    onExampleChange
  );

  const [activeDir, setActiveDir] = useControllableState(
    dir,
    defaultDir,
    onDirChange
  );

  const [activeViewport, setActiveViewport] = useControllableState(
    viewport,
    defaultViewport,
    onViewportChange
  );

  const [isCodeOpen, setCodeOpen] = useState(defaultCodeOpen);
  const [isInteractingState, setInteractingState] = useState(
    focusMode === 'direct'
  );
  const isInteracting = focusMode === 'direct' ? true : isInteractingState;
  const setInteracting = useCallback(
    (next: boolean) => {
      if (focusMode === 'direct') {
        return;
      }

      setInteractingState(next);
    },
    [focusMode]
  );

  const currentExample = useMemo(() => {
    if (!normalizedExamples.length) {
      return undefined;
    }

    return (
      normalizedExamples.find((item) => item.id === activeExampleId) ??
      normalizedExamples[0]
    );
  }, [activeExampleId, normalizedExamples]);

  const currentState: LayoutViewerState | undefined = currentExample
    ? {
        dir: activeDir,
        exampleId: currentExample.id,
        mode,
        viewport: activeViewport,
      }
    : undefined;

  const contextValue = useMemo<ContextValue>(
    () => ({
      activeExample: currentExample,
      activeExampleId: currentExample?.id,
      dir: activeDir,
      examples: normalizedExamples,
      focusMode,
      frameDescription,
      frameLabel,
      frameTitle: frameTitle ?? title ?? 'Layout example',
      height: formatSize(height) ?? '420px',
      isCodeOpen,
      isInteracting,
      isolation,
      minHeight: formatSize(minHeight),
      mode,
      openInNewTabHref: currentState
        ? getOpenHref(openInNewTabHref, currentState)
        : undefined,
      region,
      renderPlaceholder,
      restoreFocusOnExit,
      setCodeOpen,
      setDir: setActiveDir,
      setExampleId: setActiveExampleId,
      setInteracting,
      setViewport: setActiveViewport,
      showCode,
      title,
      viewerId,
      viewport: activeViewport,
    }),
    [
      activeDir,
      activeViewport,
      currentExample,
      currentState,
      focusMode,
      frameDescription,
      frameLabel,
      frameTitle,
      height,
      isCodeOpen,
      isInteracting,
      isolation,
      minHeight,
      mode,
      normalizedExamples,
      openInNewTabHref,
      region,
      renderPlaceholder,
      restoreFocusOnExit,
      setActiveDir,
      setActiveExampleId,
      setInteracting,
      setActiveViewport,
      showCode,
      title,
      viewerId,
    ]
  );

  const style = {
    '--viewer-height': contextValue.height,
    '--viewer-min-height': contextValue.minHeight,
  } as CSSProperties;

  return (
    <LayoutViewerContext.Provider value={contextValue}>
      <div
        className={classNames(styles.root, className)}
        data-layout-viewer=""
        data-layout-viewer-mode={mode}
        data-layout-viewer-viewport={activeViewport}
        style={style}
      >
        {title && <h3 className={styles.title}>{title}</h3>}
        {children}
      </div>
    </LayoutViewerContext.Provider>
  );
}

type ToolbarProps = {
  children: ReactNode;
  className?: string;
};

function LayoutViewerToolbar({ children, className }: ToolbarProps) {
  return (
    <div className={classNames(styles.toolbar, className)}>{children}</div>
  );
}

function LayoutViewerTabs() {
  const { activeExampleId, examples, setExampleId } =
    useLayoutViewerContext('LayoutViewer.Tabs');

  if (examples.length < 2) {
    return null;
  }

  return (
    <div className={styles.tabs} role="tablist" aria-label="Layout examples">
      {examples.map((example) => (
        <button
          aria-selected={activeExampleId === example.id}
          className={styles.tab}
          key={example.id}
          onClick={() => setExampleId(example.id)}
          role="tab"
          type="button"
        >
          {example.label}
        </button>
      ))}
    </div>
  );
}

function LayoutViewerControls({ children, className }: ToolbarProps) {
  return (
    <div className={classNames(styles.controls, className)}>{children}</div>
  );
}

function DirectionToggle() {
  const { dir, setDir } = useLayoutViewerContext(
    'LayoutViewer.DirectionToggle'
  );
  const nextDir = dir === 'ltr' ? 'rtl' : 'ltr';
  const actionLabel = nextDir === 'rtl' ? 'Switch to RTL' : 'Switch to LTR';

  return (
    <Tooltip content={actionLabel} placement="top">
      <Button
        aria-label={actionLabel}
        icon={
          nextDir === 'rtl' ? (
            <LuAlignEndVertical aria-hidden />
          ) : (
            <LuAlignStartVertical aria-hidden />
          )
        }
        intent="secondary"
        onClick={() => setDir(nextDir)}
        size="small"
        type="button"
        variant="link"
      />
    </Tooltip>
  );
}

function ViewportSelect() {
  const { setViewport, viewport } = useLayoutViewerContext(
    'LayoutViewer.ViewportSelect'
  );

  return (
    <label className={styles.selectLabel}>
      <span className={styles.visuallyHidden}>Viewport</span>
      <select
        className={styles.select}
        onChange={(event) =>
          setViewport(event.target.value as LayoutViewerViewport)
        }
        value={viewport}
      >
        {VIEWPORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CodeToggle() {
  const { isCodeOpen, setCodeOpen } = useLayoutViewerContext(
    'LayoutViewer.CodeToggle'
  );

  return (
    <Button
      onClick={() => setCodeOpen(!isCodeOpen)}
      size="small"
      type="button"
      variant="link"
    >
      {isCodeOpen ? 'Hide code' : 'Code'}
    </Button>
  );
}

function OpenInNewTab() {
  const { openInNewTabHref } = useLayoutViewerContext(
    'LayoutViewer.OpenInNewTab'
  );

  if (!openInNewTabHref) {
    return null;
  }

  return (
    <Button asChild size="small" variant="link">
      <a href={openInNewTabHref} rel="noreferrer" target="_blank">
        Open
      </a>
    </Button>
  );
}

type ViewportProps = {
  children: ReactNode;
};

function LayoutViewerViewport({ children }: ViewportProps) {
  return <div className={styles.viewport}>{children}</div>;
}

function RegionLayout({ children }: { children: ReactNode }) {
  const { region, renderPlaceholder } =
    useLayoutViewerContext('LayoutViewer.Frame');
  const regions: LayoutViewerRegion[] = [
    'top',
    'start',
    'center',
    'end',
    'bottom',
  ];

  return (
    <div className={styles.regionGrid}>
      {regions.map((gridRegion) => {
        const content =
          gridRegion === region
            ? children
            : renderPlaceholder(
                gridRegion as Exclude<LayoutViewerRegion, 'center'>
              );

        return (
          <div
            className={styles.regionCell}
            data-region={gridRegion}
            key={gridRegion}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

function usePreviewFocusBehavior() {
  const {
    focusMode,
    frameDescription,
    frameLabel,
    isolation,
    isInteracting,
    restoreFocusOnExit,
    setInteracting,
    viewerId,
  } = useLayoutViewerContext('LayoutViewer.Frame');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isKeyboardFocusVisible, setKeyboardFocusVisible] = useState(false);
  const [isIframeFocusWithin, setIframeFocusWithin] = useState(false);

  useEffect(() => {
    if (!isInteracting || isolation !== 'iframe') {
      return;
    }

    const doc = wrapperRef.current?.ownerDocument;

    if (!doc) {
      return;
    }

    const exitInteractionIfIframeLostFocus = () => {
      const wrapper = wrapperRef.current;
      const iframe = wrapper?.querySelector('iframe');
      const activeElement = doc.activeElement;

      if (!wrapper) {
        return;
      }

      if (iframe && activeElement === iframe) {
        return;
      }

      if (!wrapper.contains(activeElement)) {
        setInteracting(false);
        setKeyboardFocusVisible(false);
        return;
      }

      if (!iframe) {
        return;
      }

      setInteracting(false);
      setKeyboardFocusVisible(false);
    };

    const onFocusIn = () => {
      exitInteractionIfIframeLostFocus();
    };

    const onPointerDownCapture = (event: PointerEvent | MouseEvent) => {
      const wrapper = wrapperRef.current;
      const iframe = wrapper?.querySelector('iframe');
      const target = event.target as Node | null;

      if (!wrapper || !iframe || !target) {
        return;
      }

      if (target === iframe) {
        return;
      }

      if (!wrapper.contains(target)) {
        exitInteractionIfIframeLostFocus();
        return;
      }

      // Any click within frame chrome (outside iframe) should leave interact mode.
      setInteracting(false);
      setKeyboardFocusVisible(false);
    };

    doc.addEventListener('focusin', onFocusIn);
    doc.addEventListener('pointerdown', onPointerDownCapture, true);
    doc.addEventListener('mousedown', onPointerDownCapture, true);

    return () => {
      doc.removeEventListener('focusin', onFocusIn);
      doc.removeEventListener('pointerdown', onPointerDownCapture, true);
      doc.removeEventListener('mousedown', onPointerDownCapture, true);
    };
  }, [isInteracting, isolation, setInteracting]);

  useEffect(() => {
    if (isolation !== 'iframe') {
      return;
    }

    const doc = wrapperRef.current?.ownerDocument;

    if (!doc) {
      return;
    }

    const syncIframeFocusState = () => {
      const iframe = wrapperRef.current?.querySelector('iframe');
      setIframeFocusWithin(Boolean(iframe && doc.activeElement === iframe));
    };

    syncIframeFocusState();
    doc.addEventListener('focusin', syncIframeFocusState);
    doc.addEventListener('focusout', syncIframeFocusState);
    doc.addEventListener('mousedown', syncIframeFocusState, true);

    return () => {
      doc.removeEventListener('focusin', syncIframeFocusState);
      doc.removeEventListener('focusout', syncIframeFocusState);
      doc.removeEventListener('mousedown', syncIframeFocusState, true);
    };
  }, [isolation]);

  useEffect(() => {
    if (isolation !== 'iframe') {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (
        !event.data ||
        event.data.type !== 'layout-viewer:focus-within' ||
        event.data.id !== viewerId
      ) {
        return;
      }

      setIframeFocusWithin(Boolean(event.data.focusWithin));
    };

    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, [isolation, viewerId]);

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (isInteracting) {
      return;
    }

    setKeyboardFocusVisible(event.currentTarget.matches(':focus-visible'));
  };

  const onBlur = () => {
    if (!isInteracting) {
      setKeyboardFocusVisible(false);
    }
  };

  const onPointerDown = () => {
    if (!isInteracting) {
      setKeyboardFocusVisible(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && !isInteracting) {
      event.preventDefault();
      setKeyboardFocusVisible(true);
      setInteracting(true);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setInteracting(false);

      if (restoreFocusOnExit) {
        wrapperRef.current?.focus();
      }
    }
  };

  return {
    ariaLabel: `${frameLabel}. ${frameDescription} Press Enter to interact. Press Escape to return.`,
    focusMode,
    isInteracting,
    isIframeFocusWithin: isolation === 'iframe' && isIframeFocusWithin,
    isKeyboardFocusVisible,
    onBlur,
    onFocus,
    onKeyDown,
    onPointerDown,
    wrapperRef,
  };
}

function InlineFrameContent() {
  const { activeExample, dir, mode } =
    useLayoutViewerContext('LayoutViewer.Frame');

  if (!activeExample) {
    return null;
  }

  return (
    <div
      className={styles.frameSurface}
      data-layout-viewer-mode={mode}
      dir={dir}
      key={activeExample.id}
    >
      {mode === 'region' ? (
        <RegionLayout>{activeExample.render}</RegionLayout>
      ) : (
        activeExample.render
      )}
    </div>
  );
}

function IframeFrameContent() {
  const { activeExample, dir, isInteracting, mode, setInteracting, viewerId } =
    useLayoutViewerContext('LayoutViewer.Frame');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastAppliedHeightRef = useRef<number>(0);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [fallbackInline, setFallbackInline] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }

    let rootObserver: MutationObserver | null = null;
    let bodyObserver: MutationObserver | null = null;

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument;

        if (!doc) {
          setFallbackInline(true);
          return;
        }

        const container = doc.getElementById('layout-viewer-root');

        if (!container) {
          setFallbackInline(true);
          return;
        }

        const sourceHead = document.head;
        const targetHead = doc.head;
        const sourceRoot = document.documentElement;
        const targetRoot = doc.documentElement;
        const sourceBody = document.body;
        const targetBody = doc.body;

        // Mirror parent stylesheets so the iframe has the same base/ui styles.
        sourceHead
          .querySelectorAll<
            HTMLLinkElement | HTMLStyleElement
          >('link[rel="stylesheet"], style')
          .forEach((styleNode) => {
            targetHead.appendChild(styleNode.cloneNode(true));
          });

        const syncDataAttributes = ({
          source,
          target,
        }: {
          source: HTMLElement;
          target: HTMLElement;
        }) => {
          Array.from(target.attributes).forEach((attribute) => {
            if (
              attribute.name.startsWith('data-') &&
              !source.hasAttribute(attribute.name)
            ) {
              target.removeAttribute(attribute.name);
            }
          });

          Array.from(source.attributes).forEach((attribute) => {
            if (attribute.name.startsWith('data-')) {
              target.setAttribute(attribute.name, attribute.value);
            }
          });
        };

        const syncThemeContext = () => {
          // Keep root/body classes and theme attrs in sync with the host app.
          targetRoot.className = sourceRoot.className;
          targetBody.className = sourceBody.className;
          syncDataAttributes({ source: sourceRoot, target: targetRoot });
          syncDataAttributes({ source: sourceBody, target: targetBody });
          targetRoot.setAttribute(
            'style',
            sourceRoot.getAttribute('style') ?? ''
          );
        };

        syncThemeContext();

        targetRoot.setAttribute('dir', dir);
        setMountNode(container);

        rootObserver = new MutationObserver(() => {
          syncThemeContext();
        });
        rootObserver.observe(sourceRoot, {
          attributes: true,
        });

        bodyObserver = new MutationObserver(() => {
          syncThemeContext();
        });
        bodyObserver.observe(sourceBody, {
          attributes: true,
        });
      } catch {
        setFallbackInline(true);
      }
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      rootObserver?.disconnect();
      bodyObserver?.disconnect();
      iframe.removeEventListener('load', handleLoad);
    };
  }, [dir]);

  useEffect(() => {
    if (!isInteracting) {
      return;
    }

    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;

    if (!iframe || !doc) {
      return;
    }

    const win = doc.defaultView;
    const focusInside = () => {
      const focused =
        focusFirstTabbableElement(mountNode ?? doc.body) ||
        focusFirstTabbableElement(doc.body);

      if (!focused) {
        focusFirstTabbableWithRetries(mountNode ?? doc.body, win);
        iframe.focus();
      }
    };

    focusInside();

    const raf = win?.requestAnimationFrame(focusInside);
    const timeout = win?.setTimeout(focusInside, 0);

    return () => {
      if (raf) {
        win?.cancelAnimationFrame(raf);
      }
      if (timeout) {
        win?.clearTimeout(timeout);
      }
    };
  }, [isInteracting, mountNode]);

  useEffect(() => {
    if (!isInteracting) {
      return;
    }

    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;

    if (!iframe || !doc) {
      return;
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const focusRoot = mountNode ?? doc.body;
      const tabbable = getTabbableElements(focusRoot);

      if (tabbable.length === 0) {
        event.preventDefault();
        iframe.focus();
        return;
      }

      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];
      const active = doc.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    doc.addEventListener('keydown', onKeyDown);

    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [isInteracting, mountNode]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        !event.data ||
        event.data.type !== 'layout-viewer:exit-preview' ||
        event.data.id !== viewerId
      ) {
        return;
      }

      setInteracting(false);
      iframeRef.current?.focus();
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [setInteracting, viewerId]);

  useEffect(() => {
    if (!mountNode) {
      return;
    }

    const applyHeight = () => {
      const height = mountNode.scrollHeight;

      if (!iframeRef.current || height <= 0) {
        return;
      }

      if (lastAppliedHeightRef.current === height) {
        return;
      }

      iframeRef.current.style.height = `${height}px`;
      lastAppliedHeightRef.current = height;
    };

    const doc = mountNode.ownerDocument;
    let rafOne = 0;
    let rafTwo = 0;
    rafOne =
      doc.defaultView?.requestAnimationFrame(() => {
        applyHeight();
        rafTwo = doc.defaultView?.requestAnimationFrame(applyHeight) ?? 0;
      }) ?? 0;

    return () => {
      if (rafOne) {
        doc.defaultView?.cancelAnimationFrame(rafOne);
      }
      if (rafTwo) {
        doc.defaultView?.cancelAnimationFrame(rafTwo);
      }
    };
  }, [activeExample?.id, dir, mode, mountNode]);

  if (fallbackInline || !activeExample) {
    return <InlineFrameContent />;
  }

  const srcDoc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: transparent; }
      #layout-viewer-root { min-height: 0; }
    </style>
    <script>
      window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          window.parent.postMessage({ type: 'layout-viewer:exit-preview', id: '${viewerId}' }, '*');
        }
      });

      document.addEventListener('focusin', function() {
        window.parent.postMessage({
          type: 'layout-viewer:focus-within',
          id: '${viewerId}',
          focusWithin: true
        }, '*');
      });

      document.addEventListener('focusout', function() {
        window.parent.postMessage({
          type: 'layout-viewer:focus-within',
          id: '${viewerId}',
          focusWithin: false
        }, '*');
      });
    </script>
  </head>
  <body>
    <div id="layout-viewer-root"></div>
  </body>
</html>`;

  return (
    <>
      <iframe
        className={styles.iframe}
        ref={iframeRef}
        srcDoc={srcDoc}
        tabIndex={-1}
        title="Layout viewer iframe"
      />
      {mountNode
        ? createPortal(
            <div
              className={styles.frameSurface}
              data-layout-viewer-mode={mode}
              dir={dir}
              key={activeExample.id}
            >
              {mode === 'region' ? (
                <RegionLayout>{activeExample.render}</RegionLayout>
              ) : (
                activeExample.render
              )}
            </div>,
            mountNode
          )
        : null}
    </>
  );
}

function LayoutViewerFrame() {
  const { focusMode, isInteracting, isolation, mode, restoreFocusOnExit } =
    useLayoutViewerContext('LayoutViewer.Frame');
  const {
    ariaLabel,
    isIframeFocusWithin,
    isKeyboardFocusVisible,
    onBlur,
    onFocus,
    onKeyDown,
    onPointerDown,
    wrapperRef,
  } = usePreviewFocusBehavior();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInteracting || isolation !== 'inline') {
      return;
    }

    const contentRoot = contentRef.current;

    if (!contentRoot) {
      return;
    }

    const win = contentRoot.ownerDocument.defaultView;
    const raf = win?.requestAnimationFrame(() => {
      focusFirstTabbableWithRetries(contentRoot, win);
    });
    const timeout = win?.setTimeout(() => {
      focusFirstTabbableWithRetries(contentRoot, win);
    }, 0);

    return () => {
      if (raf) {
        win?.cancelAnimationFrame(raf);
      }
      if (timeout) {
        win?.clearTimeout(timeout);
      }
    };
  }, [isInteracting, isolation, wrapperRef]);

  return (
    <div
      aria-label={ariaLabel}
      className={styles.frame}
      data-interacting={isInteracting}
      data-keyboard-focus-visible={isKeyboardFocusVisible}
      data-layout-viewer-focus-mode={focusMode}
      data-layout-viewer-mode={mode}
      data-restore-focus-on-exit={restoreFocusOnExit}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      ref={wrapperRef}
      role="group"
      tabIndex={0}
    >
      {focusMode === 'enter-to-interact' && !isInteracting ? (
        <div className={styles.enterHint}>
          Press Enter to interact. Press Escape to return.
        </div>
      ) : null}
      {focusMode === 'enter-to-interact' &&
      isInteracting &&
      (isolation !== 'iframe' || isIframeFocusWithin) &&
      isKeyboardFocusVisible ? (
        <div aria-hidden className={styles.escapeHint}>
          Press Escape to return
        </div>
      ) : null}
      <div
        aria-hidden={
          focusMode === 'enter-to-interact' &&
          !isInteracting &&
          isKeyboardFocusVisible
        }
        className={styles.frameContent}
        inert={
          focusMode === 'enter-to-interact' &&
          !isInteracting &&
          isKeyboardFocusVisible
        }
        ref={contentRef}
      >
        {isolation === 'iframe' ? (
          <IframeFrameContent />
        ) : (
          <InlineFrameContent />
        )}
      </div>
    </div>
  );
}

function LayoutViewerCode() {
  const { activeExample, isCodeOpen, setCodeOpen, showCode } =
    useLayoutViewerContext('LayoutViewer.Code');

  if (!showCode || !activeExample) {
    return null;
  }

  const code = getLayoutViewerCode(activeExample);

  return (
    <div className={styles.code} data-expanded={isCodeOpen}>
      <div
        aria-hidden={!isCodeOpen}
        className={styles.codeContent}
        inert={!isCodeOpen}
      >
        {isCodeOpen ? (
          <ScrollFade
            ariaLabel="Code example. Scroll for more code."
            maxHeight="28rem"
            padding="1rem"
          >
            <SyntaxHighlighter
              className={styles.syntaxHighlighter}
              code={code}
              language="jsx"
            />
          </ScrollFade>
        ) : (
          <div className={styles.codeCollapsedContent}>
            <SyntaxHighlighter
              className={styles.syntaxHighlighter}
              code={code}
              language="jsx"
            />
          </div>
        )}
      </div>
      {isCodeOpen ? (
        <CopyButton className={styles.copyButton} text={code} />
      ) : (
        <div className={styles.codeOverlay} onClick={() => setCodeOpen(true)}>
          <Button
            onClick={() => setCodeOpen(true)}
            type="button"
            variant="link"
          >
            Show code
          </Button>
        </div>
      )}
    </div>
  );
}

(LayoutViewerExample as { displayName?: string }).displayName =
  'LayoutViewer.Example';

export const LayoutViewer = ({
  allowDirectionToggle = true,
  allowOpenInNewTab = false,
  allowViewportToggle = true,
  examples,
  mode,
  ...props
}: LayoutViewerProps) => {
  const shouldShowViewportToggle = allowViewportToggle && mode !== 'shell';

  return (
    <LayoutViewerRoot
      allowDirectionToggle={allowDirectionToggle}
      allowOpenInNewTab={allowOpenInNewTab}
      allowViewportToggle={allowViewportToggle}
      examples={examples}
      mode={mode}
      {...props}
    >
      <LayoutViewerToolbar>
        <LayoutViewerTabs />
        <LayoutViewerControls>
          {allowDirectionToggle && <DirectionToggle />}
          {shouldShowViewportToggle && <ViewportSelect />}
          {allowOpenInNewTab && <OpenInNewTab />}
        </LayoutViewerControls>
      </LayoutViewerToolbar>
      <LayoutViewerViewport>
        <LayoutViewerFrame />
      </LayoutViewerViewport>
      <LayoutViewerCode />
    </LayoutViewerRoot>
  );
};

LayoutViewer.Root = LayoutViewerRoot;
LayoutViewer.Toolbar = LayoutViewerToolbar;
LayoutViewer.Tabs = LayoutViewerTabs;
LayoutViewer.Controls = LayoutViewerControls;
LayoutViewer.Viewport = LayoutViewerViewport;
LayoutViewer.Frame = LayoutViewerFrame;
LayoutViewer.Code = LayoutViewerCode;
LayoutViewer.Example = LayoutViewerExample;
LayoutViewer.DirectionToggle = DirectionToggle;
LayoutViewer.ViewportSelect = ViewportSelect;
LayoutViewer.CodeToggle = CodeToggle;
LayoutViewer.OpenInNewTab = OpenInNewTab;

export type {
  LayoutViewerDir,
  LayoutViewerExample,
  LayoutViewerExampleProps,
  LayoutViewerFocusMode,
  LayoutViewerIsolation,
  LayoutViewerMode,
  LayoutViewerProps,
  LayoutViewerRegion,
  LayoutViewerRootProps,
  LayoutViewerState,
  LayoutViewerViewport,
} from './types';
