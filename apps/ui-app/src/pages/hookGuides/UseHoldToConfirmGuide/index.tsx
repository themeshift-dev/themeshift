import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
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

const holdToConfirmFallbackImport =
  "import { useHoldToConfirm } from '@themeshift/ui/hooks/useHoldToConfirm';";

export const UseHoldToConfirmGuide = () => {
  const { hook } = useApiReference({ hook: 'use-hold-to-confirm' });

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
        Use <code>confirmationDelay</code> for hold duration and{' '}
        <code>confirmResetDelay</code> for how long confirmed state persists.
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
          <p>
            Wire <code>start</code> and <code>cancel</code> to your interaction
            events, then render progress and time remaining.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.basicUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-callbacks"
            label="Callbacks"
            level={2}
          />
          <Heading level={4}>Confirm and cancel callbacks</Heading>
          <p>
            Use <code>onConfirm</code> and <code>onCancel</code> to trigger side
            effects only when the hold succeeds or is interrupted.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.callbackHandling} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-progress"
            label="Progress"
            level={2}
          />
          <Heading level={4}>Progress reporting</Heading>
          <p>
            Use <code>onProgress</code> when parent components need telemetry,
            external indicators, or analytics from the hold lifecycle.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.progressReporting} />
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
            hookHref: '/ui/hook/use-hold-to-confirm',
            hookLabel: hook?.name ?? 'useHoldToConfirm',
          })}
        />
      }
      description={
        hook?.meta?.description ??
        'Tracks press-and-hold confirmation lifecycle with progress, cancel, and confirm callbacks.'
      }
      eyebrow={hook?.name ?? 'useHoldToConfirm'}
      intro={intro}
      examples={{
        content: examplesContent,
        id: 'examples',
        title: 'Examples',
      }}
      notes={{
        content: (
          <GuideCallout>
            <code>useHoldToConfirm</code> is interaction-agnostic. You choose
            which events call <code>start</code> and <code>cancel</code>{' '}
            (pointer, keyboard, focus/blur, or custom gestures).
          </GuideCallout>
        ),
        id: 'notes',
        title: 'Notes & caveats',
      }}
      optionsSection={{
        content: optionsContent,
        id: 'options',
        title: 'Options',
      }}
      quickStart={{
        content: (
          <QuickStartGuide
            componentImport={hook?.importString ?? holdToConfirmFallbackImport}
            importDescription="Import the hook directly from the UI package."
            useDescription="Call the hook to get lifecycle flags plus start/cancel/confirm/reset controls."
            useExample={<ExampleViewer example={examples.basicUsage} />}
          />
        ),
        id: 'quick-start',
        title: 'Quick start',
      }}
      returnsSection={{
        content: returnsContent,
        id: 'returns',
        title: 'Returns',
      }}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
