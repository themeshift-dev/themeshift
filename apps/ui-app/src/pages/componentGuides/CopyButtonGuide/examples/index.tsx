import { Button } from '@themeshift/ui/components/Button';
import { CopyButton } from '@themeshift/ui/components/CopyButton';
import { LuCheck, LuCopy } from 'react-icons/lu';

export const basicUsage = {
  code: `<CopyButton confirmationMessage="Copied" value={csvSheet}>
  Copy CSV
</CopyButton>`,
  label: 'Basic usage',
  sample: (
    <CopyButton
      confirmationMessage="Copied"
      value={'name,email\nSam,sam@site.com'}
    >
      Copy CSV
    </CopyButton>
  ),
};

export const iconOnly = {
  code: `<CopyButton
  aria-label={(wasCopied) => (wasCopied ? 'Copied' : 'Copy to clipboard')}
  icon={(wasCopied) => (wasCopied ? <LuCheck aria-hidden /> : <LuCopy aria-hidden />)}
  value="Hello from ThemeShift!"
/>`,
  label: 'Icon only',
  sample: (
    <CopyButton
      aria-label={(wasCopied) => (wasCopied ? 'Copied' : 'Copy to clipboard')}
      icon={(wasCopied) =>
        wasCopied ? (
          <LuCheck aria-hidden size={16} />
        ) : (
          <LuCopy aria-hidden size={16} />
        )
      }
      value="Hello from ThemeShift!"
    />
  ),
};

export const renderPropChildren = {
  code: `<CopyButton value={verificationCode}>
  {(wasCopied) => (wasCopied ? 'Copied' : 'Copy verification code')}
</CopyButton>`,
  label: 'Render prop label',
  sample: (
    <CopyButton value="TX-2819">
      {(wasCopied) => (wasCopied ? 'Copied' : 'Copy verification code')}
    </CopyButton>
  ),
};

export const failureFeedback = {
  code: `<CopyButton
  confirmationMessage="Copied"
  errorMessage="Copy failed"
  onCopyError={(error) => {
    console.error(error);
  }}
  value={apiToken}
>
  Copy API token
</CopyButton>`,
  label: 'Failure fallback',
  sample: (
    <CopyButton
      confirmationMessage="Copied"
      errorMessage="Copy failed"
      onCopyError={(error) => {
        console.error(error);
      }}
      value="demo-token"
    >
      Copy API token
    </CopyButton>
  ),
};

export const titleAndIconSlots = {
  code: `<CopyButton
  endIcon={(wasCopied) => (wasCopied ? <LuCheck aria-hidden /> : <LuCopy aria-hidden />)}
  title={(wasCopied) => (wasCopied ? 'Copied to clipboard' : 'Copy code sample')}
  value={snippet}
>
  Copy snippet
</CopyButton>`,
  label: 'Dynamic icon slots',
  sample: (
    <CopyButton
      endIcon={(wasCopied) =>
        wasCopied ? (
          <LuCheck aria-hidden size={16} />
        ) : (
          <LuCopy aria-hidden size={16} />
        )
      }
      title={(wasCopied) =>
        wasCopied ? 'Copied to clipboard' : 'Copy code sample'
      }
      value="npm i @themeshift/ui"
    >
      Copy snippet
    </CopyButton>
  ),
};

export const inToolbar = {
  code: `<div style={{ display: 'flex', gap: '0.5rem' }}>
  <Button intent="secondary">Cancel</Button>
  <CopyButton confirmationMessage="Copied" value={generatedReport}>
    Copy report
  </CopyButton>
</div>`,
  label: 'In toolbars',
  sample: (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button intent="secondary">Cancel</Button>
      <CopyButton confirmationMessage="Copied" value="Quarterly report summary">
        Copy report
      </CopyButton>
    </div>
  ),
};

const directionCode = `<CopyButton
  endIcon={(wasCopied) => (wasCopied ? <LuCheck aria-hidden /> : <LuCopy aria-hidden />)}
  startIcon={<LuCopy aria-hidden />}
  value={shareCode}
>
  Copy share code
</CopyButton>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: (
    <CopyButton
      endIcon={(wasCopied) =>
        wasCopied ? (
          <LuCheck aria-hidden size={16} />
        ) : (
          <LuCopy aria-hidden size={16} />
        )
      }
      startIcon={<LuCopy aria-hidden size={16} />}
      value="TS-4821"
    >
      Copy share code
    </CopyButton>
  ),
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <CopyButton
        endIcon={(wasCopied) =>
          wasCopied ? (
            <LuCheck aria-hidden size={16} />
          ) : (
            <LuCopy aria-hidden size={16} />
          )
        }
        startIcon={<LuCopy aria-hidden size={16} />}
        value="TS-4821"
      >
        Copy share code
      </CopyButton>
    </div>
  ),
};

export const propHighlights = [basicUsage, iconOnly, renderPropChildren];

export const directionExamples = [directionLTR, directionRTL];
