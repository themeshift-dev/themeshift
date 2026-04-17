import { useCallback, useEffect, useRef, useState } from 'react';

type CopyFn = (text: string) => Promise<boolean>;

type UseCopyToClipboardOptions = {
  /**
   * Specifies the amount of time, in milliseconds, before the
   * `wasCopied` flag returns to false after a successful copy.
   */
  clearDelay?: number;
};

type UseCopyToClipboardReturn = [
  /**
   * `true` after a successful copy, then resets to `false` after `clearDelay`.
   *
   * Use this flag to render transient success feedback.
   */
  wasCopied: boolean,
  /**
   * Copies text to the clipboard.
   *
   * Resolves to `true` when the copy succeeds and `false` when it fails or
   * clipboard APIs are unavailable.
   */
  copy: CopyFn,
];

export function useCopyToClipboard({
  clearDelay = 2000,
}: UseCopyToClipboardOptions = {}): UseCopyToClipboardReturn {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const [wasCopied, setWasCopied] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy: CopyFn = useCallback(
    async (text) => {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

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
