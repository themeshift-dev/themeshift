import { type ElementType, type ReactNode, useCallback, useState } from 'react';

import { Button } from '@/components/Button';
import type { ButtonProps } from '@/components/Button/types';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

import type { CopyButtonProps } from './types';

function resolveDynamicValue<T>(
  value: T | ((wasCopied: boolean) => T | void) | undefined,
  wasCopied: boolean
): T | undefined {
  if (typeof value === 'function') {
    const resolvedValue = (value as (wasCopied: boolean) => T | void)(
      wasCopied
    );
    return resolvedValue === undefined ? undefined : resolvedValue;
  }

  return value;
}

function hasResolvedContent(content: ReactNode) {
  return content !== null && content !== undefined;
}

export const CopyButton = <T extends ElementType = 'button'>({
  'aria-label': ariaLabel,
  children,
  clearDelay = 2000,
  confirmationMessage,
  endIcon,
  errorMessage,
  icon,
  onCopyError,
  onCopySuccess,
  startIcon,
  title,
  value,
  ...buttonProps
}: CopyButtonProps<T>) => {
  const [hasCopyError, setHasCopyError] = useState(false);
  const [wasCopied, copy] = useCopyToClipboard({ clearDelay });

  const resolvedAriaLabel = resolveDynamicValue(ariaLabel, wasCopied);
  const resolvedIcon = resolveDynamicValue(icon, wasCopied);
  const resolvedStartIcon = resolveDynamicValue(startIcon, wasCopied);
  const resolvedEndIcon = resolveDynamicValue(endIcon, wasCopied);
  const resolvedTitle = resolveDynamicValue(title, wasCopied);
  const resolvedChildren = resolveDynamicValue(children, wasCopied);
  const hasChildrenResolver = typeof children === 'function';

  let buttonChildren: ReactNode;

  if (hasChildrenResolver && hasResolvedContent(resolvedChildren)) {
    buttonChildren = resolvedChildren;
  } else if (wasCopied && hasResolvedContent(confirmationMessage)) {
    buttonChildren = confirmationMessage;
  } else if (hasCopyError && hasResolvedContent(errorMessage)) {
    buttonChildren = errorMessage;
  } else {
    buttonChildren = hasChildrenResolver ? resolvedChildren : children;
  }

  const handleClick = useCallback(async () => {
    setHasCopyError(false);

    const didCopy = await copy(value);

    if (didCopy) {
      onCopySuccess?.(value);
      return;
    }

    setHasCopyError(true);

    const copyError = new Error('Copy failed.');
    onCopyError?.(copyError, value);
  }, [copy, onCopyError, onCopySuccess, value]);
  const shouldDefaultType =
    !('as' in buttonProps) &&
    !('asChild' in buttonProps) &&
    !('type' in buttonProps);

  const resolvedButtonProps = {
    ...buttonProps,
    'aria-label': resolvedAriaLabel,
    children: buttonChildren,
    endIcon: resolvedEndIcon,
    icon: resolvedIcon,
    onClick: handleClick,
    startIcon: resolvedStartIcon,
    title: resolvedTitle,
    ...(shouldDefaultType ? { type: 'button' } : {}),
  } as ButtonProps<T>;

  return <Button<T> {...resolvedButtonProps} />;
};

export type { CopyButtonProps } from './types';
