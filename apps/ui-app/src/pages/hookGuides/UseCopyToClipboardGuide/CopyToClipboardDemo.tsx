import { Button } from '@themeshift/ui/components/Button';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';
import { useCopyToClipboard } from '@themeshift/ui/hooks/useCopyToClipboard';
import { useState } from 'react';

export const CopyToClipboardDemo = ({
  clearDelay,
}: {
  clearDelay?: number;
}) => {
  const [text, setText] = useState('Hello from ThemeShift');
  const [wasCopied, copy] = useCopyToClipboard(
    clearDelay === undefined ? undefined : { clearDelay }
  );

  return (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '28rem' }}>
      <Field>
        <Field.Label>Text to copy</Field.Label>
        <Input
          aria-label="Text to copy"
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
      </Field>

      <div style={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
        <Button
          onClick={() => {
            void copy(text);
          }}
          type="button"
        >
          Copy
        </Button>
        <span>{wasCopied ? 'Copied!' : 'Click to copy'}</span>
      </div>
    </div>
  );
};
