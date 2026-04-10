import { useCallback, useEffect, useRef, useState } from 'react';

type CopyFn = (text: string) => Promise<boolean>;

type UseCopyToClipboardOptions = {
  /**
   * Specifies the amount of time, in milliseconds, before the
   * `wasCopied` flag returns to false after a successful copy.
   */
  clearDelay?: number;
};

export function useCopyToClipboard({
  clearDelay = 2000,
}: UseCopyToClipboardOptions = {}): [boolean, CopyFn] {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [wasCopied, setWasCopied] = useState<boolean>(false);

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
    },
    []
  );

  const copy: CopyFn = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        clearTimeout(timeoutRef.current);
        setWasCopied(true);
        timeoutRef.current = setTimeout(() => {
          setWasCopied(false);
        }, clearDelay);
        return true;
      } catch (error) {
        console.warn('Copy failed', error);
        return false;
      }
    },
    [clearDelay]
  );

  return [wasCopied, copy];
}
