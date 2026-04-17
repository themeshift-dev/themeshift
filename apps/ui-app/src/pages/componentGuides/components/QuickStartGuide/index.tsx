import { Heading } from '@themeshift/ui/components/Heading';
import classNames from 'classnames';
import { cloneElement, type ReactElement, type ReactNode } from 'react';

import { StringCopier } from '../StringCopier';
import styles from './QuickStartGuide.module.scss';

type NamedImport = {
  from: string;
  names: string[];
  type: 'named';
};

type DefaultImport = {
  from: string;
  name: string;
  type: 'default';
};

type SideEffectImport = {
  from: string;
  type: 'sideEffect';
};

type RawImport = {
  code: string;
  type: 'raw';
};

export type QuickStartImport =
  | DefaultImport
  | NamedImport
  | RawImport
  | SideEffectImport
  | string;

const getImportString = (importStatement: QuickStartImport) => {
  if (typeof importStatement === 'string') {
    return importStatement;
  }

  switch (importStatement.type) {
    case 'raw':
      return importStatement.code;
    case 'sideEffect':
      return `import '${importStatement.from}';`;
    case 'default':
      return `import ${importStatement.name} from '${importStatement.from}';`;
    case 'named':
      return `import { ${importStatement.names.join(', ')} } from '${importStatement.from}';`;
    default:
      return '';
  }
};

type StepCardProps = {
  children: ReactNode;
  description: ReactNode;
  number: string;
  title: string;
};

const StepCard = ({ children, description, number, title }: StepCardProps) => (
  <div className={styles.stepCard}>
    <span aria-hidden="true" className={styles.stepNumber}>
      {number}
    </span>
    <Heading level={4}>{title}</Heading>
    <p className={styles.stepText}>{description}</p>
    {children}
  </div>
);

export type QuickStartGuideProps = {
  className?: string;
  componentImport: QuickStartImport;
  importDescription?: ReactNode;
  installCommand?: string;
  installDescription?: ReactNode;
  stylesImportNote?: ReactNode;
  stylesImportPath?: string;
  useDescription: ReactNode;
  useExample: ReactElement<{ className?: string }>;
};

export const QuickStartGuide = ({
  className,
  componentImport,
  importDescription = 'Import the component directly from the UI package.',
  installCommand = 'npm install @themeshift/ui',
  installDescription = 'Add the package to your project.',
  stylesImportNote = (
    <>
      Import base styles globally, usually inside <code>main.tsx</code>.
    </>
  ),
  stylesImportPath = '@themeshift/ui/css/base.css',
  useDescription,
  useExample,
}: QuickStartGuideProps) => {
  const usageExample = cloneElement(useExample, {
    className: classNames(styles.stepExample, useExample.props.className),
  });

  return (
    <div className={classNames(styles.layout, className)}>
      <div className={styles.column}>
        <StepCard description={installDescription} number="1." title="Install">
          <StringCopier string={installCommand} />
        </StepCard>

        <StepCard description={importDescription} number="2." title="Import">
          <StringCopier
            className={styles.importString}
            language="jsx"
            string={getImportString(componentImport)}
          />

          <p className={styles.stepText}>{stylesImportNote}</p>

          <StringCopier
            language="jsx"
            string={getImportString({
              from: stylesImportPath,
              type: 'sideEffect',
            })}
          />
        </StepCard>
      </div>

      <StepCard description={useDescription} number="3." title="Use">
        {usageExample}
      </StepCard>
    </div>
  );
};
