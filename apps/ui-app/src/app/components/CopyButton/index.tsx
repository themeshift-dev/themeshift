import { Button } from '@themeshift/ui/components/Button';
import classNames from 'classnames';
import { LuCheck, LuCopy } from 'react-icons/lu';

import { useCopyToClipboard } from '@/hooks';

import styles from './CopyButton.module.scss';

export type CopyButtonProps = {
  className?: string;
  text: string;
};

export const CopyButton = ({ className, text }: CopyButtonProps) => {
  const [wasCopied, copy] = useCopyToClipboard();

  return (
    <Button
      aria-label={wasCopied ? 'Copied' : 'Copy'}
      className={classNames(
        styles.container,
        className,
        wasCopied && styles.copySuccess
      )}
      icon={wasCopied ? <LuCheck size={20} /> : <LuCopy size={20} />}
      intent="tertiary"
      onClick={() => copy(text)}
      type="button"
    />
  );
};
