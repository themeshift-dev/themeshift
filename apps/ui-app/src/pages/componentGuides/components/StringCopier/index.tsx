import {
  CopyButton,
  SyntaxHighlighter,
  type SyntaxHighlighterLanguage,
} from '@/app/components';

import styles from './StringCopier.module.scss';

type StringCopierProps = {
  language?: SyntaxHighlighterLanguage;
  string: string;
};

export const StringCopier = ({ language, string }: StringCopierProps) => {
  return (
    <div className={styles.container}>
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
