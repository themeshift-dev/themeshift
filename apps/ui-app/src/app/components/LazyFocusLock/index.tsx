import { lazy, Suspense } from 'react';
import type { FocusLockProps } from '@themeshift/ui/components/FocusLock';

const FocusLockLazy = lazy(async () => {
  const module = await import('@themeshift/ui/components/FocusLock');

  return {
    default: module.FocusLock,
  };
});

export const LazyFocusLock = (props: FocusLockProps) => (
  <Suspense fallback={props.children}>
    <FocusLockLazy {...props} />
  </Suspense>
);
