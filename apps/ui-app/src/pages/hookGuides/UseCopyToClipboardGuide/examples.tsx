import { CopyToClipboardDemo } from './CopyToClipboardDemo';

export const basicUsage = {
  code: `import { useCopyToClipboard } from '@themeshift/ui/hooks/useCopyToClipboard';

export const CopyExample = () => {
  const [wasCopied, copy] = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => {
        void copy('Hello');
      }}
    >
      {wasCopied ? 'Copied' : 'Copy'}
    </button>
  );
};`,
  label: 'Basic usage',
  sample: <CopyToClipboardDemo />,
};

export const customClearDelay = {
  code: `import { useCopyToClipboard } from '@themeshift/ui/hooks/useCopyToClipboard';

export const CopyExample = () => {
  const [wasCopied, copy] = useCopyToClipboard({ clearDelay: 5000 });

  return (
    <button
      type="button"
      onClick={() => {
        void copy('Hello');
      }}
    >
      {wasCopied ? 'Copied (5s)' : 'Copy'}
    </button>
  );
};`,
  label: 'Custom clearDelay',
  sample: <CopyToClipboardDemo clearDelay={5000} />,
};

export const commonUseCases = [basicUsage, customClearDelay];
