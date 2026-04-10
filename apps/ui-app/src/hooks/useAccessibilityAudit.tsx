import type axe from 'axe-core';
import type {
  CSSProperties,
  DependencyList,
  ReactElement,
  ReactNode,
} from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type AxeModule = typeof axe;
type AxeWindow = Window & {
  axe?: AxeModule;
  eval: (source: string) => unknown;
};

export type UseAccessibilityAuditOptions = {
  children: ReactNode;
  debounceMs?: number;
  dependencies?: DependencyList;
  enabled?: boolean;
  options?: axe.RunOptions;
  title?: string;
};

export type UseAccessibilityAuditResult = {
  auditFrame: ReactElement;
  error: Error | null;
  isReady: boolean;
  isRunning: boolean;
  rerun: () => void;
  results: axe.AxeResults | null;
};

const defaultRunOptions = {
  resultTypes: ['violations', 'incomplete', 'passes'],
} satisfies axe.RunOptions;

const frameSource = '<!doctype html><html><head></head><body></body></html>';

const frameStyle = {
  border: 0,
  height: 768,
  left: -10000,
  position: 'absolute',
  top: 0,
  width: 1024,
} satisfies CSSProperties;

const styleMarkerAttribute = 'data-accessibility-audit-style';

function getAxeModule(module: AxeModule | { default: AxeModule }) {
  if ('default' in module) {
    return module.default;
  }

  return module;
}

function getFrameAxeModule(frameWindow: AxeWindow, axeModule: AxeModule) {
  if (!frameWindow.axe) {
    frameWindow.eval(axeModule.source);
  }

  if (!frameWindow.axe) {
    throw new Error(
      'Unable to load axe inside the accessibility audit iframe.'
    );
  }

  return frameWindow.axe;
}

function areDependenciesEqual(
  previousDependencies: DependencyList,
  nextDependencies: DependencyList
) {
  return (
    previousDependencies.length === nextDependencies.length &&
    previousDependencies.every((dependency, index) =>
      Object.is(dependency, nextDependencies[index])
    )
  );
}

function mirrorTheme(frameDocument: Document) {
  const frameDataset = frameDocument.documentElement.dataset;
  const sourceDataset = document.documentElement.dataset;

  Object.keys(frameDataset).forEach((key) => {
    delete frameDataset[key];
  });

  Object.entries(sourceDataset).forEach(([key, value]) => {
    if (value) {
      frameDataset[key] = value;
    }
  });
}

function mirrorStyles(frameDocument: Document) {
  frameDocument.head
    .querySelectorAll(`[${styleMarkerAttribute}]`)
    .forEach((node) => node.remove());

  document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
    const clonedNode = node.cloneNode(true);

    if (clonedNode instanceof HTMLElement) {
      clonedNode.setAttribute(styleMarkerAttribute, '');
      frameDocument.head.appendChild(clonedNode);
    }
  });

  const baseStyle = frameDocument.createElement('style');
  baseStyle.setAttribute(styleMarkerAttribute, '');
  baseStyle.textContent = 'body { margin: 0; }';
  frameDocument.head.appendChild(baseStyle);
}

export function useAccessibilityAudit({
  children,
  debounceMs = 250,
  dependencies = [],
  enabled = true,
  options,
  title = 'Accessibility audit target',
}: UseAccessibilityAuditOptions): UseAccessibilityAuditResult {
  const dependenciesRef = useRef<DependencyList>(dependencies);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const runIdRef = useRef(0);
  const [dependencyRevision, setDependencyRevision] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [frameDocument, setFrameDocument] = useState<Document | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<axe.AxeResults | null>(null);
  const [rerunCount, setRerunCount] = useState(0);
  const [themeRevision, setThemeRevision] = useState(0);

  const runOptions = useMemo(
    () => ({
      ...defaultRunOptions,
      ...options,
    }),
    [options]
  );

  const rerun = useCallback(() => {
    setRerunCount((current) => current + 1);
  }, []);

  const syncFrameDocument = useCallback(() => {
    const nextDocument = frameRef.current?.contentDocument ?? null;

    setFrameDocument(nextDocument);
  }, []);

  useEffect(() => {
    if (areDependenciesEqual(dependenciesRef.current, dependencies)) {
      return;
    }

    dependenciesRef.current = dependencies;
    setDependencyRevision((current) => current + 1);
  }, [dependencies]);

  useEffect(() => {
    if (!frameDocument) {
      return;
    }

    try {
      mirrorStyles(frameDocument);
      mirrorTheme(frameDocument);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('Unable to prepare the accessibility audit iframe.')
      );
    }
  }, [frameDocument]);

  useEffect(() => {
    if (!frameDocument) {
      return;
    }

    const observer = new MutationObserver(() => {
      mirrorTheme(frameDocument);
      setThemeRevision((current) => current + 1);
    });

    observer.observe(document.documentElement, {
      attributeFilter: ['data-theme'],
      attributes: true,
    });

    return () => observer.disconnect();
  }, [frameDocument]);

  useEffect(() => {
    if (!enabled || !frameDocument?.body) {
      setIsRunning(false);
      setResults(null);
      return;
    }

    let isCancelled = false;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    const timeoutId = window.setTimeout(() => {
      const frameWindow = frameDocument.defaultView as AxeWindow | null;

      frameWindow?.requestAnimationFrame(() => {
        void (async () => {
          try {
            setError(null);
            setIsRunning(true);
            mirrorTheme(frameDocument);

            const axeModule = getAxeModule(await import('axe-core'));
            const frameAxeModule = getFrameAxeModule(frameWindow, axeModule);
            const nextResults = await frameAxeModule.run(
              frameDocument.body,
              runOptions
            );

            if (!isCancelled && runId === runIdRef.current) {
              setResults(nextResults);
            }
          } catch (caughtError) {
            if (!isCancelled && runId === runIdRef.current) {
              setError(
                caughtError instanceof Error
                  ? caughtError
                  : new Error('Unable to run the accessibility audit.')
              );
              setResults(null);
            }
          } finally {
            if (!isCancelled && runId === runIdRef.current) {
              setIsRunning(false);
            }
          }
        })();
      });
    }, debounceMs);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    debounceMs,
    dependencyRevision,
    enabled,
    frameDocument,
    rerunCount,
    runOptions,
    themeRevision,
  ]);

  const auditFrame = (
    <iframe
      aria-hidden="true"
      onLoad={syncFrameDocument}
      ref={frameRef}
      sandbox="allow-same-origin allow-scripts"
      srcDoc={frameSource}
      style={frameStyle}
      tabIndex={-1}
      title={title}
    >
      {frameDocument?.body && createPortal(children, frameDocument.body)}
    </iframe>
  );

  return {
    auditFrame,
    error,
    isReady: Boolean(frameDocument?.body),
    isRunning,
    rerun,
    results,
  };
}
