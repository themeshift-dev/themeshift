import classNames from 'classnames';

import {
  CopyButton,
  SyntaxHighlighter,
  type SyntaxHighlighterLanguage,
} from '@/app/components';

import styles from './StringCopier.module.scss';

type StringCopierProps = {
  className?: string;
  language?: SyntaxHighlighterLanguage;
  string: string;
};

export const StringCopier = ({
  className,
  language,
  string,
}: StringCopierProps) => {
  return (
    <div className={classNames(styles.container, className)}>
      {language ? (
        <SyntaxHighlighter
          code={string}
          disableScrollFocus
          language={language}
        />
      ) : (
        <div className={styles.string}>{string}</div>
      )}

      <CopyButton className={styles.copyButton} text={string} />
    </div>
  );
};
