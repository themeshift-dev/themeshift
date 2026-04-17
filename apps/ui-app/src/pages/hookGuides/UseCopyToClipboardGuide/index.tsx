import { Heading } from '@themeshift/ui/components/Heading';

import {
  ApiReference,
  Breadcrumb,
  Link,
  TableOfContents,
} from '@/app/components';
import { useApiReference } from '@/apiReference';
import {
  ExampleViewer,
  GuideCallout,
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideIntro,
  QuickStartGuide,
  createHookBreadcrumbItems,
} from '@/pages/componentGuides/components';
import { HookGuide } from '@/templates/HookGuide';

import * as examples from './examples';

const copyToClipboardFallbackImport =
  "import { useCopyToClipboard } from '@themeshift/ui/hooks/useCopyToClipboard';";

export const UseCopyToClipboardGuide = () => {
  const { hook } = useApiReference({ hook: 'use-copy-to-clipboard' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.commonUseCases} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const optionsContent = (
    <>
      <GuideCallout>
        Control how long the “copied” state stays visible with{' '}
        <code>clearDelay</code>.
      </GuideCallout>
      <ApiReference
        emptyState={<p>No options documented yet.</p>}
        items={hook?.apiReference ?? []}
        nameColumnLabel="Option name"
      />
    </>
  );

  const returnsContent = (
    <ApiReference
      emptyState={<p>No return values documented yet.</p>}
      hideColumns={['defaultValue']}
      items={hook?.returnReference ?? []}
      nameColumnLabel="Return value"
    />
  );

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-basic"
            label="Basic usage"
            level={2}
          />
          <Heading level={4}>Basic usage</Heading>
          <p>Copy arbitrary text and show transient success feedback.</p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.basicUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-clear-delay"
            label="Custom clearDelay"
            level={2}
          />
          <Heading level={4}>Custom clearDelay</Heading>
          <p>
            Increase <code>clearDelay</code> to keep “Copied!” visible longer.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.customClearDelay} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  return (
    <HookGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createHookBreadcrumbItems({
            hookHref: '/ui/hook/use-copy-to-clipboard',
            hookLabel: hook?.name ?? 'useCopyToClipboard',
          })}
        />
      }
      description={
        hook?.meta?.description ??
        'Copies text to the clipboard and provides a transient `wasCopied` flag.'
      }
      eyebrow={hook?.name ?? 'useCopyToClipboard'}
      intro={intro}
      examples={{
        content: examplesContent,
        id: 'examples',
        title: 'Examples',
      }}
      notes={{
        content: (
          <>
            <GuideCallout>
              <code>useCopyToClipboard</code> relies on{' '}
              <code>navigator.clipboard</code>, which is not available in every
              environment (and may require a secure context).
            </GuideCallout>
            {hook?.sourceCodeUrl ? (
              <p>
                <Link to={hook.sourceCodeUrl}>View source</Link>
              </p>
            ) : null}
          </>
        ),
        id: 'notes',
        title: 'Notes & caveats',
      }}
      optionsSection={{
        content: optionsContent,
        id: 'options',
        title: 'Options',
      }}
      returnsSection={{
        content: returnsContent,
        id: 'returns',
        title: 'Returns',
      }}
      quickStart={{
        content: (
          <QuickStartGuide
            componentImport={
              hook?.importString ?? copyToClipboardFallbackImport
            }
            importDescription="Import the hook directly from the UI package."
            useDescription="Call the hook to get a `copy` function and a `wasCopied` flag for transient UI feedback."
            useExample={<ExampleViewer example={examples.basicUsage} />}
          />
        ),
        id: 'quick-start',
        title: 'Quick start',
      }}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
