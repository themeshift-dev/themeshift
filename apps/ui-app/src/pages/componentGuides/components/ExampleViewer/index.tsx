import { Button } from '@themeshift/ui/components/Button';
import classNames from 'classnames';
import { useMemo, useState } from 'react';

import { CopyButton, ScrollFade, SyntaxHighlighter } from '@/app/components';

import styles from './ExampleViewer.module.scss';

type SerializablePropValue =
  | boolean
  | null
  | number
  | React.ReactNode
  | string
  | undefined;

type ExampleArgs = Record<string, SerializablePropValue>;

export type ExampleViewerExample<Props extends ExampleArgs = ExampleArgs> = {
  args?: Props;
  code?: string;
  component?: string;
  label: string;
  sample: React.ReactNode | ((args: Props) => React.ReactNode);
};

export type ExampleViewerProps<Props extends ExampleArgs = ExampleArgs> = {
  className?: string;
  defaultCodeExpanded?: boolean;
  example?: ExampleViewerExample<Props>;
  examples?: ExampleViewerExample<Props>[];
};

function renderExample<Props extends ExampleArgs>(
  example: ExampleViewerExample<Props>
) {
  if (typeof example.sample === 'function') {
    return example.sample(example.args ?? ({} as Props));
  }

  return example.sample;
}

function serializePropValue(value: SerializablePropValue) {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'number') {
    return `{${value}}`;
  }

  if (typeof value === 'boolean') {
    return value ? '' : null;
  }

  return null;
}

function serializeArgs(args: ExampleArgs = {}) {
  return Object.entries(args)
    .filter(([propName]) => propName !== 'children')
    .map(([propName, value]) => {
      const serializedValue = serializePropValue(value);

      if (serializedValue === '') {
        return propName;
      }

      if (!serializedValue) {
        return null;
      }

      return `${propName}=${serializedValue}`;
    })
    .filter(Boolean)
    .join(' ');
}

function serializeChildren(children: SerializablePropValue) {
  if (typeof children === 'string' || typeof children === 'number') {
    return children;
  }

  return null;
}

function getExampleCode<Props extends ExampleArgs>(
  example: ExampleViewerExample<Props>
) {
  if (example.code) {
    return example.code;
  }

  if (!example.component) {
    return '// Add code to this example.';
  }

  const props = serializeArgs(example.args);
  const children = serializeChildren(example.args?.children);
  const openTag = props
    ? `<${example.component} ${props}>`
    : `<${example.component}>`;

  if (children === null) {
    return props
      ? `<${example.component} ${props} />`
      : `<${example.component} />`;
  }

  return `${openTag}${children}</${example.component}>`;
}

function normalizeExamples<Props extends ExampleArgs>({
  example,
  examples,
}: ExampleViewerProps<Props>) {
  return examples ?? (example ? [example] : []);
}

export const ExampleViewer = <Props extends ExampleArgs = ExampleArgs>({
  className,
  defaultCodeExpanded = false,
  example,
  examples,
}: ExampleViewerProps<Props>) => {
  const normalizedExamples = useMemo(
    () => normalizeExamples({ example, examples }),
    [example, examples]
  );
  const [activeExample, setActiveExample] = useState(
    normalizedExamples[0]?.label
  );
  const [isCodeExpanded, setIsCodeExpanded] = useState(defaultCodeExpanded);

  const currentExample = useMemo(
    () =>
      normalizedExamples.find(({ label }) => label === activeExample) ??
      normalizedExamples[0],
    [activeExample, normalizedExamples]
  );

  if (!currentExample) {
    return null;
  }

  const sample = renderExample(currentExample);
  const code = getExampleCode(currentExample);
  const codeContentAttributes = isCodeExpanded ? {} : { inert: true };
  const hasMultipleExamples = normalizedExamples.length > 1;
  const expandCode = () => setIsCodeExpanded(true);

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.preview}>
        {hasMultipleExamples && (
          <div className={styles.examples}>
            {normalizedExamples.map(({ label }) => (
              <button
                aria-pressed={currentExample.label === label}
                className={styles.exampleButton}
                key={label}
                onClick={() => setActiveExample(label)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div
          className={classNames(
            styles.content,
            hasMultipleExamples && styles.multipleExamples
          )}
        >
          {sample}
        </div>
      </div>

      <div className={styles.code} data-expanded={isCodeExpanded}>
        <div
          aria-hidden={!isCodeExpanded}
          className={styles.codeContent}
          {...codeContentAttributes}
        >
          {isCodeExpanded ? (
            <ScrollFade
              ariaLabel="Code example. Scroll for more code."
              maxHeight="28rem"
              padding="1rem"
            >
              <SyntaxHighlighter
                code={code}
                language="jsx"
                className={styles.syntaxHighlighter}
              />
            </ScrollFade>
          ) : (
            <SyntaxHighlighter
              code={code}
              language="jsx"
              className={styles.syntaxHighlighter}
            />
          )}
        </div>

        {isCodeExpanded ? (
          <CopyButton className={styles.copyButton} text={code} />
        ) : (
          <div className={styles.codeOverlay} onClick={expandCode}>
            <Button intent="tertiary" onClick={expandCode} type="button">
              Show code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ExamplePane = ExampleViewer;
