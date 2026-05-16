import type { KeyboardEvent } from 'react';

import type { TriggerRecord } from './context';

export function callHandler<EventType>(
  handler: ((event: EventType) => void) | undefined,
  event: EventType
) {
  handler?.(event);
}

export function sanitizeIdSegment(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return 'tab';
  }

  return normalized.replace(/[^a-z0-9_-]+/g, '-');
}

export function getEnabledTriggerValues(
  triggerOrder: string[],
  triggers: Map<string, TriggerRecord>
) {
  return triggerOrder.filter((value) => {
    const record = triggers.get(value);

    return Boolean(record && !record.disabled);
  });
}

export function getHorizontalDirectionKey(
  event: KeyboardEvent,
  node: HTMLElement | null
): 'next' | 'previous' | undefined {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return undefined;
  }

  const direction =
    node && typeof window !== 'undefined'
      ? window.getComputedStyle(node).direction
      : typeof document !== 'undefined'
        ? document.documentElement.dir
        : 'ltr';

  const isRtl = direction === 'rtl';

  if (event.key === 'ArrowRight') {
    return isRtl ? 'previous' : 'next';
  }

  return isRtl ? 'next' : 'previous';
}
