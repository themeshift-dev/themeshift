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

const anchoredPositionFallbackImport =
  "import { useAnchoredPosition } from '@themeshift/ui/hooks/useAnchoredPosition';";

export const UseAnchoredPositionGuide = () => {
  const { hook } = useApiReference({ hook: 'use-anchored-position' });

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
        Combine <code>placement</code>, <code>flip</code>, and{' '}
        <code>shift</code> to keep floating UI visible near viewport edges.
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
            id="examples-placement"
            label="Placement"
            level={2}
          />
          <Heading level={4}>Placement presets</Heading>
          <p>
            Start from a preferred placement and read{' '}
            <code>actualPlacement</code> when collision handling flips to
            another side.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.placements} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-collision"
            label="Collision"
            level={2}
          />
          <Heading level={4}>Flip and shift</Heading>
          <p>
            Use viewport collision settings to avoid clipped popovers and
            tooltips.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.collisionHandling} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-match-width"
            label="Match width"
            level={2}
          />
          <Heading level={4}>Match trigger width</Heading>
          <p>
            Useful for menus and dropdown surfaces that should align to trigger
            width.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.matchTriggerWidth} />
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
            hookHref: '/ui/hook/use-anchored-position',
            hookLabel: hook?.name ?? 'useAnchoredPosition',
          })}
        />
      }
      description={
        hook?.meta?.description ??
        'Positions floating UI relative to an anchor with collision-aware placement.'
      }
      eyebrow={hook?.name ?? 'useAnchoredPosition'}
      examples={{
        content: examplesContent,
        id: 'examples',
        title: 'Examples',
      }}
      intro={intro}
      notes={{
        content: (
          <GuideCallout>
            Use <code>fixed</code> strategy for most tooltip/popover surfaces
            and switch to <code>absolute</code> when integrating with custom
            scrolling containers.
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
            componentImport={
              hook?.importString ?? anchoredPositionFallbackImport
            }
            importDescription="Import the hook directly from the UI package."
            useDescription="Attach refs to anchor and floating nodes, then apply returned inline style to the floating element."
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
