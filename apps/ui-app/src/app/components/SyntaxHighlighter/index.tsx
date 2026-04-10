import classNames from 'classnames';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-typescript';
import type { CSSProperties } from 'react';

import styles from './SyntaxHighlighter.module.scss';

export type SyntaxHighlighterLanguage =
  | 'bash'
  | 'css'
  | 'javascript'
  | 'jsx'
  | 'markdown'
  | 'sass'
  | 'typescript';

export type SyntaxHighlighterProps = {
  children?: string;
  className?: string;
  code?: string;
  disableScrollFocus?: boolean;
  language: SyntaxHighlighterLanguage;
  showLineCount?: boolean;
};

const token = (name: string) =>
  `var(--themeshift-components-syntax-highlighter-${name})`;

const syntaxHighlighterTheme = {
  plain: {
    color: token('fg'),
    fontFamily: token('font'),
  },
  styles: [
    {
      style: { color: token('comment'), fontStyle: 'italic' },
      types: ['cdata', 'comment', 'doctype', 'prolog'],
    },
    {
      style: { color: token('punctuation') },
      types: ['punctuation'],
    },
    {
      style: { color: token('keyword') },
      types: ['atrule', 'important', 'keyword'],
    },
    {
      style: { color: token('operator') },
      types: ['entity', 'operator', 'url'],
    },
    {
      style: { color: token('function') },
      types: ['class-name', 'function', 'title'],
    },
    {
      style: { color: token('string') },
      types: ['builtin', 'char', 'string'],
    },
    {
      style: { color: token('number') },
      types: ['number'],
    },
    {
      style: { color: token('boolean') },
      types: ['boolean', 'constant', 'symbol'],
    },
    {
      style: { color: token('property') },
      types: ['property', 'variable'],
    },
    {
      style: { color: token('tag') },
      types: ['selector', 'tag'],
    },
    {
      style: { color: token('attr-name') },
      types: ['attr-name'],
    },
    {
      style: { color: token('attr-value') },
      types: ['attr-value'],
    },
    {
      style: { color: token('deleted') },
      types: ['deleted'],
    },
    {
      style: { color: token('inserted') },
      types: ['inserted'],
    },
  ],
} satisfies PrismTheme & {
  plain: PrismTheme['plain'] & Pick<CSSProperties, 'fontFamily'>;
};

export const SyntaxHighlighter = ({
  children,
  className,
  code,
  disableScrollFocus = false,
  language,
  showLineCount = false,
}: SyntaxHighlighterProps) => {
  const source = code ?? children ?? '';

  return (
    <Highlight
      code={source}
      language={language}
      prism={Prism}
      theme={syntaxHighlighterTheme}
    >
      {({
        className: prismClassName,
        getLineProps,
        getTokenProps,
        style,
        tokens,
      }) => (
        <div className={classNames(styles.container, className)}>
          <pre
            className={classNames(styles.pre, prismClassName)}
            style={style}
            tabIndex={disableScrollFocus ? -1 : undefined}
          >
            <code className={styles.code}>
              {tokens.map((line, lineIndex) => {
                const lineProps = getLineProps({ line });

                return (
                  <span
                    {...lineProps}
                    className={classNames(styles.line, lineProps.className)}
                    key={lineIndex}
                  >
                    {showLineCount && (
                      <span aria-hidden="true" className={styles.lineNumber}>
                        {lineIndex + 1}
                      </span>
                    )}

                    {line.map((item, tokenIndex) => (
                      <span
                        {...getTokenProps({ token: item })}
                        key={tokenIndex}
                      />
                    ))}
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      )}
    </Highlight>
  );
};
