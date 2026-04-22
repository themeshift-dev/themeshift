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

const resizeObserverFallbackImport =
  "import { useResizeObserver } from '@themeshift/ui/hooks/useResizeObserver';";

export const UseResizeObserverGuide = () => {
  const { hook } = useApiReference({ hook: 'use-resize-observer' });

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
        Use <code>box</code> to select the ResizeObserver measurement mode and
        <code> disabled</code> to opt out temporarily while preserving hook
        wiring.
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
          <Heading level={4}>Basic measurement</Heading>
          <p>
            Attach the provided <code>ref</code> to an element and render
            reactive dimensions from <code>rect</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.basicUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-target-swap"
            label="Dynamic target"
            level={2}
          />
          <Heading level={4}>Dynamic target switching</Heading>
          <p>
            Reuse the same observer ref callback across different target
            elements as UI context changes.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.dynamicTarget} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-box"
            label="Box option"
            level={2}
          />
          <Heading level={4}>Box mode</Heading>
          <p>
            Switch between <code>content-box</code> and
            <code> border-box</code> depending on the layout metric you need.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.boxOption} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-fallback"
            label="Unsupported environments"
            level={2}
          />
          <Heading level={4}>Unsupported fallback</Heading>
          <p>
            Use <code>isSupported</code> to branch behavior in environments that
            do not provide <code>ResizeObserver</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.unsupportedFallback} />
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
            hookHref: '/ui/hook/use-resize-observer',
            hookLabel: hook?.name ?? 'useResizeObserver',
          })}
        />
      }
      description={
        hook?.meta?.description ??
        'Observes element resize changes and returns reactive ResizeObserver state.'
      }
      eyebrow={hook?.name ?? 'useResizeObserver'}
      examples={{
        content: examplesContent,
        id: 'examples',
        title: 'Examples',
      }}
      intro={intro}
      notes={{
        content: (
          <GuideCallout>
            <code>useResizeObserver</code> is safe in SSR and unsupported
            environments. Check <code>isSupported</code> before depending on
            live measurements.
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
            componentImport={hook?.importString ?? resizeObserverFallbackImport}
            importDescription="Import the hook directly from the UI package."
            useDescription="Attach the returned `ref` to an element and read `rect` for reactive size updates."
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
