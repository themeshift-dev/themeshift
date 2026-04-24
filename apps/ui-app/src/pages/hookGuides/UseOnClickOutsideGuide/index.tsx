import { Heading } from '@themeshift/ui/components/Heading';

import { useApiReference } from '@/apiReference';
import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
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

const onClickOutsideFallbackImport =
  "import { useOnClickOutside } from '@themeshift/ui/hooks/useOnClickOutside';";

export const UseOnClickOutsideGuide = () => {
  const { hook } = useApiReference({ hook: 'use-on-click-outside' });

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
        Use <code>eventType</code> to switch from pointer interactions to focus
        events without changing your outside-handler logic.
      </GuideCallout>
      <ApiReference
        emptyState={<p>No options documented yet.</p>}
        items={hook?.apiReference ?? []}
        nameColumnLabel="Option name"
      />
    </>
  );

  const returnsContent = (
    <GuideCallout>
      <code>useOnClickOutside</code> does not return values. Pass a stable ref
      object and handle side effects directly inside the callback.
    </GuideCallout>
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
          <Heading level={4}>Basic panel dismissal</Heading>
          <p>
            Pass an element ref and close the panel when users interact
            elsewhere on the page.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.basicUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-event-type"
            label="Event type"
            level={2}
          />
          <Heading level={4}>Custom event type</Heading>
          <p>
            Configure focus-based outside detection with
            <code> eventType="focusin"</code> for keyboard-driven workflows.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.customEventType} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-callback-state"
            label="Callback freshness"
            level={2}
          />
          <Heading level={4}>Fresh callback state</Heading>
          <p>
            Callback handlers receive the latest state on outside interactions,
            so updates remain reliable after rerenders.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.callbackFreshState} />
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
            hookHref: '/ui/hook/use-on-click-outside',
            hookLabel: hook?.name ?? 'useOnClickOutside',
          })}
        />
      }
      description={
        hook?.meta?.description ??
        'Calls a handler when pointer or focus events happen outside a target element.'
      }
      eyebrow={hook?.name ?? 'useOnClickOutside'}
      examples={{
        content: examplesContent,
        id: 'examples',
        title: 'Examples',
      }}
      intro={intro}
      notes={{
        content: (
          <GuideCallout>
            Use refs created with <code>useRef</code>. Passing unstable ref-like
            objects can cause missed outside events or unnecessary listener
            churn.
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
            componentImport={hook?.importString ?? onClickOutsideFallbackImport}
            importDescription="Import the hook directly from the UI package."
            useDescription="Pass an element ref, a callback handler, and optionally an event type."
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
