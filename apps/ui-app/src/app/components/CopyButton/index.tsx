import { CopyButton as BaseCopyButton } from '@themeshift/ui/components/CopyButton';
import classNames from 'classnames';
import { LuCheck, LuCopy } from 'react-icons/lu';

import styles from './CopyButton.module.scss';

export type CopyButtonProps = {
  className?: string;
  text: string;
};

export const CopyButton = ({ className, text }: CopyButtonProps) => {
  return (
    <BaseCopyButton
      aria-label={(wasCopied) => (wasCopied ? 'Copied' : 'Copy')}
      className={classNames(styles.container, className)}
      icon={(wasCopied) =>
        wasCopied ? (
          <LuCheck aria-hidden className={styles.successIcon} size={20} />
        ) : (
          <LuCopy aria-hidden size={20} />
        )
      }
      variant="link"
      value={text}
    />
  );
};
