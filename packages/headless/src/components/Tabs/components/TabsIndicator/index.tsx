import {
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ElementType,
} from 'react';

import { useResizeObserver } from '../../../../hooks/useResizeObserver';
import { useTabsContext } from '../../internal/context';
import type { TabsIndicatorProps } from '../../types';

type IndicatorStyle = CSSProperties & {
  '--tabs-indicator-offset'?: string;
  '--tabs-indicator-size'?: string;
};

/** Decorative active-tab indicator that follows selected trigger bounds. */
export const TabsIndicator = <T extends ElementType = 'div'>({
  as,
  className,
  forceMount = false,
  inset = 'none',
  size = 'small',
  transition = true,
  ...indicatorProps
}: TabsIndicatorProps<T>) => {
  const context = useTabsContext('Tabs.Indicator');
  const Component = as ?? 'div';
  const [style, setStyle] = useState<IndicatorStyle>({});
  const {
    getSelectedTrigger,
    listElement,
    orientation,
    registrationVersion,
    selectedValue,
  } = context;

  const listObserver = useResizeObserver();
  const triggerObserver = useResizeObserver();

  const selectedTrigger = getSelectedTrigger();
  const visible = Boolean(listElement && selectedTrigger);

  useEffect(() => {
    listObserver.ref(listElement);

    return () => {
      listObserver.ref(null);
    };
  }, [listElement, listObserver]);

  useEffect(() => {
    triggerObserver.ref(selectedTrigger);

    return () => {
      triggerObserver.ref(null);
    };
  }, [selectedTrigger, triggerObserver]);

  useLayoutEffect(() => {
    if (!listElement || !selectedTrigger) {
      setStyle((currentStyle) => {
        if (
          currentStyle['--tabs-indicator-offset'] === '0px' &&
          currentStyle['--tabs-indicator-size'] === '0px'
        ) {
          return currentStyle;
        }

        return {
          '--tabs-indicator-offset': '0px',
          '--tabs-indicator-size': '0px',
        };
      });

      return;
    }

    const frame = requestAnimationFrame(() => {
      if (!listElement || !selectedTrigger) {
        return;
      }

      if (orientation === 'horizontal') {
        const listRect = listElement.getBoundingClientRect();
        const triggerRect = selectedTrigger.getBoundingClientRect();
        const offset = triggerRect.left - listRect.left;
        const nextSize = triggerRect.width;

        setStyle({
          '--tabs-indicator-offset': `${Math.max(offset, 0)}px`,
          '--tabs-indicator-size': `${Math.max(nextSize, 0)}px`,
        });
      } else {
        const listRect = listElement.getBoundingClientRect();
        const triggerRect = selectedTrigger.getBoundingClientRect();
        const offset = triggerRect.top - listRect.top;
        const nextSize = triggerRect.height;

        setStyle({
          '--tabs-indicator-offset': `${Math.max(offset, 0)}px`,
          '--tabs-indicator-size': `${Math.max(nextSize, 0)}px`,
        });
      }
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [
    listElement,
    listObserver.rect,
    orientation,
    registrationVersion,
    selectedTrigger,
    triggerObserver.rect,
  ]);

  if (!forceMount && selectedValue === undefined) {
    return null;
  }

  const debugIndicatorData =
    import.meta.env.DEV && selectedValue !== undefined
      ? {
          'data-debug-indicator-offset': style['--tabs-indicator-offset'] ?? '',
          'data-debug-indicator-size': style['--tabs-indicator-size'] ?? '',
          'data-debug-selected-trigger': selectedTrigger
            ? 'present'
            : 'missing',
          'data-debug-selected-value': selectedValue,
          'data-debug-visible': visible ? 'true' : 'false',
        }
      : {};

  return (
    <Component
      {...indicatorProps}
      aria-hidden="true"
      className={className}
      data-inset={inset}
      data-orientation={orientation}
      data-size={size}
      data-slot="indicator"
      data-state={visible ? 'visible' : 'hidden'}
      data-transition={transition ? '' : undefined}
      style={style}
      {...debugIndicatorData}
    />
  );
};
