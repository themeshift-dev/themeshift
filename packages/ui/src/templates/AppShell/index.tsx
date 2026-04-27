import classNames from 'classnames';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ElementType,
  type KeyboardEvent,
  type MutableRefObject,
} from 'react';

import { SkipLink } from '@/components';
import type {
  ShellAccessibilityProps,
  ShellSemanticProps,
  ShellStructuralSlots,
} from '@/templates';
import { resolveShellA11yProps } from '@/templates/utils';

import styles from './AppShell.module.scss';

export type AppShellRegionMode = 'fixed' | 'inline' | 'overlay';

export type AppShellBreakpoint = 'desktop' | 'mobile' | 'tablet';

export type AppShellRegionPosition = 'fixed' | 'static' | 'sticky';

type AppShellAreas = Pick<
  ShellStructuralSlots,
  'aside' | 'children' | 'footer' | 'header' | 'navigation' | 'sidebar'
>;

type AppShellSemanticProps = Pick<
  ShellSemanticProps,
  'as' | 'mainAs' | 'mainLabel' | 'navLabel' | 'sidebarLabel'
>;

type AppShellOwnProps = {
  className?: string;
  defaultNavigationOpen?: boolean;
  defaultSidebarOpen?: boolean;
  divider?: boolean;
  headerPosition?: AppShellRegionPosition;
  isNavigationOpen?: boolean;
  isSidebarOpen?: boolean;
  navigationMode?: AppShellRegionMode;
  navigationOverlayBelow?: AppShellBreakpoint;
  navigationPosition?: AppShellRegionPosition;
  onNavigationOpenChange?: (open: boolean) => void;
  onSidebarOpenChange?: (open: boolean) => void;
  sidebarMode?: AppShellRegionMode;
  sidebarOverlayBelow?: AppShellBreakpoint;
  sidebarPosition?: AppShellRegionPosition;
};

export type AppShellProps = ShellAccessibilityProps &
  AppShellSemanticProps &
  AppShellAreas &
  AppShellOwnProps;

const breakpointQueryMap = {
  desktop: '(max-width: 1023px)',
  mobile: '(max-width: 0px)',
  tablet: '(max-width: 767px)',
} satisfies Record<AppShellBreakpoint, string>;

const modeClassMap = {
  fixed: styles.regionModeFixed,
  inline: styles.regionModeInline,
  overlay: styles.regionModeOverlay,
} satisfies Record<AppShellRegionMode, string>;

const positionClassMap = {
  fixed: styles.regionPositionFixed,
  static: styles.regionPositionStatic,
  sticky: styles.regionPositionSticky,
} satisfies Record<AppShellRegionPosition, string>;

type UseControllableOpenArgs = {
  controlledOpen: boolean | undefined;
  defaultOpen: boolean;
  onOpenChange?: (open: boolean) => void;
};

type SetOpenCallback = (
  nextOpen: boolean | ((currentOpen: boolean) => boolean)
) => void;

function useControllableOpenState({
  controlledOpen,
  defaultOpen,
  onOpenChange,
}: UseControllableOpenArgs): [boolean, SetOpenCallback] {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const resolvedOpen = controlledOpen ?? uncontrolledOpen;
  const isControlled = controlledOpen !== undefined;

  const setOpen = useCallback<SetOpenCallback>(
    (nextOpen) => {
      const computedOpen =
        typeof nextOpen === 'function' ? nextOpen(resolvedOpen) : nextOpen;

      if (!isControlled) {
        setUncontrolledOpen(computedOpen);
      }

      if (computedOpen !== resolvedOpen) {
        onOpenChange?.(computedOpen);
      }
    },
    [isControlled, onOpenChange, resolvedOpen]
  );

  return [resolvedOpen, setOpen];
}

function useBreakpointMatch(breakpoint: AppShellBreakpoint | undefined) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!breakpoint || typeof window === 'undefined' || !window.matchMedia) {
        return () => undefined;
      }

      const mediaQueryList = window.matchMedia(breakpointQueryMap[breakpoint]);
      mediaQueryList.addEventListener('change', onStoreChange);

      return () => {
        mediaQueryList.removeEventListener('change', onStoreChange);
      };
    },
    [breakpoint]
  );

  const getSnapshot = useCallback(() => {
    if (!breakpoint || typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }

    return window.matchMedia(breakpointQueryMap[breakpoint]).matches;
  }, [breakpoint]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function restoreFocus(targetRef: MutableRefObject<HTMLElement | null>) {
  if (!targetRef.current?.isConnected) {
    return;
  }

  targetRef.current.focus();
}

function useOverlayFocusRestore({
  isOpen,
  mode,
  triggerRef,
}: {
  isOpen: boolean;
  mode: AppShellRegionMode;
  triggerRef: MutableRefObject<HTMLElement | null>;
}) {
  const previousOpenRef = useRef(isOpen);

  useEffect(() => {
    const wasOpen = previousOpenRef.current;
    const isOverlay = mode === 'overlay';

    if (isOverlay && !wasOpen && isOpen) {
      triggerRef.current = document.activeElement as HTMLElement | null;
    }

    if (isOverlay && wasOpen && !isOpen) {
      restoreFocus(triggerRef);
    }

    previousOpenRef.current = isOpen;
  }, [isOpen, mode, triggerRef]);
}

export const AppShell = ({
  as,
  aside,
  children,
  className,
  defaultNavigationOpen = false,
  defaultSidebarOpen = false,
  divider = false,
  footer,
  header,
  headerPosition = 'static',
  isNavigationOpen,
  isSidebarOpen,
  mainAs,
  mainId,
  mainLabel,
  navLabel,
  navigation,
  navigationMode = 'inline',
  navigationOverlayBelow,
  navigationPosition = 'static',
  onNavigationOpenChange,
  onSidebarOpenChange,
  sidebar,
  sidebarLabel,
  sidebarMode = 'inline',
  sidebarOverlayBelow,
  sidebarPosition = 'static',
  skipLinkLabel,
}: AppShellProps) => {
  const Component = (as ?? 'div') as ElementType;
  const MainComponent = (mainAs ?? 'main') as ElementType;
  const resolvedA11y = resolveShellA11yProps({ mainId, skipLinkLabel });
  const shouldNavigationOverlayByBreakpoint = useBreakpointMatch(
    navigationOverlayBelow
  );
  const shouldSidebarOverlayByBreakpoint =
    useBreakpointMatch(sidebarOverlayBelow);

  const resolvedNavigationMode = shouldNavigationOverlayByBreakpoint
    ? 'overlay'
    : navigationMode;
  const resolvedSidebarMode = shouldSidebarOverlayByBreakpoint
    ? 'overlay'
    : sidebarMode;
  const [navigationOpen, setNavigationOpen] = useControllableOpenState({
    controlledOpen: isNavigationOpen,
    defaultOpen: defaultNavigationOpen,
    onOpenChange: onNavigationOpenChange,
  });
  const [sidebarOpen, setSidebarOpen] = useControllableOpenState({
    controlledOpen: isSidebarOpen,
    defaultOpen: defaultSidebarOpen,
    onOpenChange: onSidebarOpenChange,
  });
  const navigationTriggerRef = useRef<HTMLElement | null>(null);
  const sidebarTriggerRef = useRef<HTMLElement | null>(null);
  const hasAside = Boolean(aside);
  const hasNavigation = Boolean(navigation);
  const hasSidebar = Boolean(sidebar);
  const navigationClosedOverlay =
    hasNavigation && resolvedNavigationMode === 'overlay' && !navigationOpen;
  const sidebarClosedOverlay =
    hasSidebar && resolvedSidebarMode === 'overlay' && !sidebarOpen;
  const navigationInertProps = useMemo(
    () =>
      navigationClosedOverlay
        ? ({ inert: true } as Record<string, boolean>)
        : undefined,
    [navigationClosedOverlay]
  );
  const sidebarInertProps = useMemo(
    () =>
      sidebarClosedOverlay
        ? ({ inert: true } as Record<string, boolean>)
        : undefined,
    [sidebarClosedOverlay]
  );

  useOverlayFocusRestore({
    isOpen: navigationOpen,
    mode: resolvedNavigationMode,
    triggerRef: navigationTriggerRef,
  });
  useOverlayFocusRestore({
    isOpen: sidebarOpen,
    mode: resolvedSidebarMode,
    triggerRef: sidebarTriggerRef,
  });

  const handleShellKeyDownCapture = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Escape') {
        return;
      }

      let handled = false;

      if (resolvedSidebarMode === 'overlay' && sidebarOpen) {
        handled = true;
        setSidebarOpen(false);
      }

      if (resolvedNavigationMode === 'overlay' && navigationOpen) {
        handled = true;
        setNavigationOpen(false);
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [
      navigationOpen,
      resolvedNavigationMode,
      resolvedSidebarMode,
      setNavigationOpen,
      setSidebarOpen,
      sidebarOpen,
    ]
  );

  return (
    <Component className={classNames(styles.container, className)}>
      <SkipLink
        href={resolvedA11y.skipLinkHref}
        label={resolvedA11y.skipLinkLabel}
      />

      <div
        className={classNames(styles.shell, divider && styles.withDivider)}
        onKeyDownCapture={handleShellKeyDownCapture}
      >
        {header ? (
          <header
            className={classNames(
              styles.header,
              positionClassMap[headerPosition],
              divider && styles.headerDivider
            )}
          >
            <div className={styles.regionInner}>{header}</div>
          </header>
        ) : null}

        <div
          className={classNames(
            styles.layout,
            hasAside && styles.withAside,
            hasNavigation && styles.withNavigation,
            hasSidebar && styles.withSidebar
          )}
        >
          {navigation ? (
            <nav
              aria-hidden={navigationClosedOverlay || undefined}
              aria-label={navLabel}
              className={classNames(
                styles.navigation,
                modeClassMap[resolvedNavigationMode],
                positionClassMap[navigationPosition],
                navigationOpen && styles.overlayOpen,
                navigationClosedOverlay && styles.overlayClosed,
                divider && styles.navigationDivider
              )}
              hidden={navigationClosedOverlay}
              {...navigationInertProps}
            >
              <div className={styles.regionInner}>{navigation}</div>
            </nav>
          ) : null}

          {sidebar ? (
            <section
              aria-hidden={sidebarClosedOverlay || undefined}
              aria-label={sidebarLabel ?? 'Sidebar'}
              className={classNames(
                styles.sidebar,
                modeClassMap[resolvedSidebarMode],
                positionClassMap[sidebarPosition],
                sidebarOpen && styles.overlayOpen,
                sidebarClosedOverlay && styles.overlayClosed,
                divider && styles.sidebarDivider
              )}
              hidden={sidebarClosedOverlay}
              {...sidebarInertProps}
            >
              <div className={styles.regionInner}>{sidebar}</div>
            </section>
          ) : null}

          <MainComponent
            id={resolvedA11y.mainId}
            aria-label={mainLabel}
            className={styles.main}
          >
            <div className={styles.regionInner}>{children}</div>
          </MainComponent>

          {aside ? (
            <aside
              className={classNames(
                styles.aside,
                divider && styles.asideDivider
              )}
            >
              <div className={styles.regionInner}>{aside}</div>
            </aside>
          ) : null}
        </div>

        {footer ? (
          <footer
            className={classNames(
              styles.footer,
              divider && styles.footerDivider
            )}
          >
            <div className={styles.regionInner}>{footer}</div>
          </footer>
        ) : null}
      </div>
    </Component>
  );
};
