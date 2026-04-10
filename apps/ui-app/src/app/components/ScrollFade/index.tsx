import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './ScrollFade.module.scss';

export type ScrollFadeProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxHeight?: string;
  padding?: string;
};

const scrollEndThreshold = 1;

export const ScrollFade = ({
  ariaLabel = 'Scrollable content',
  children,
  className,
  contentClassName,
  maxHeight,
  padding,
}: ScrollFadeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const maxScrollTop = container.scrollHeight - container.clientHeight;

    setIsOverflowing(maxScrollTop > scrollEndThreshold);
    setIsAtBottom(container.scrollTop >= maxScrollTop - scrollEndThreshold);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [children, maxHeight, updateScrollState]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    if (container.firstElementChild) {
      resizeObserver.observe(container.firstElementChild);
    }

    window.addEventListener('resize', updateScrollState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  return (
    <div
      className={classNames(styles.container, className)}
      data-at-bottom={isAtBottom}
      data-overflowing={isOverflowing}
    >
      <div
        aria-label={ariaLabel}
        className={styles.scroller}
        onScroll={updateScrollState}
        ref={containerRef}
        style={
          {
            '--scroll-fade-max-height': maxHeight,
            '--scroll-fade-padding': padding,
          } as CSSProperties
        }
        tabIndex={0}
      >
        <div className={classNames(styles.content, contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};
