import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useApiReference } from '@/apiReference';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
  ExampleViewer,
  GuideCallout,
  GuideExampleCard,
  GuideExamplesGrid,
  GuideExampleText,
  GuideExampleViewer,
  GuideIntro,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const focusLockFallbackImport =
  "import { FocusLock } from '@themeshift/ui/components/FocusLock';";

export const FocusLockGuide = () => {
  const { component } = useApiReference({ component: 'focuslock' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? focusLockFallbackImport,
    intro:
      'Use FocusLock to keep keyboard navigation inside active overlays, menus, and temporary task flows.',
    useDescription:
      'Pass a container ref, activate the lock only while visible, and add shards when focusable portal content should stay inside the same scope.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>FocusLock</code> is a focused accessibility primitive. It traps
          focus while active, supports optional autofocus and return focus, and
          can include portaled shards in one focus scope.
        </GuideCallout>
      }
      items={component?.apiReference ?? []}
    />
  );

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-autofocus-return"
            label="Autofocus and return focus"
            level={2}
          />
          <Heading level={4}>Autofocus and return focus</Heading>
          <p>
            Enable autofocus when opening overlays and enable return focus when
            closing to keep keyboard context predictable.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.autoFocusAndReturnFocus} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-shards"
            label="Shards + portal"
            level={2}
          />
          <Heading level={4}>Shards with portal content</Heading>
          <p>
            Use <code>shards</code> when related actions render outside the main
            container, including fixed or portaled surfaces.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.shardsWithPortal} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-adapter"
            label="Adapter pattern"
            level={2}
          />
          <Heading level={4}>Adapter pattern</Heading>
          <p>
            Components like <code>Navbar.Menu</code> can accept custom focus
            lock adapters while preserving the same adapter prop contract.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.customAdapter} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Review the reference for activation, focus restore behavior, and shard composition.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Use these patterns for overlays, portaled actions, and adapter-based integration in compound components.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Use FocusLock with clear labeling and predictable focus movement to support keyboard and assistive technology users.',
    items: [
      {
        content: (
          <p>
            Pair focus locking with meaningful region semantics, such as
            <code>role="dialog"</code> and an accessible name.
          </p>
        ),
        example: examples.basicUsage,
        title: 'Label the focus scope',
      },
      {
        content: (
          <p>
            When opening and closing temporary overlays, combine
            <code>autoFocus</code> and <code>returnFocus</code> to avoid leaving
            keyboard users in an unexpected location.
          </p>
        ),
        example: examples.autoFocusAndReturnFocus,
        tocLabel: 'Open/close behavior',
        title: 'Keep focus transitions predictable',
      },
      {
        content: (
          <p>
            Include portaled controls in <code>shards</code> so keyboard users
            can still navigate the full interactive surface without escaping the
            active task.
          </p>
        ),
        example: examples.shardsWithPortal,
        title: 'Cover portal content with shards',
      },
    ],
  });

  return (
    <ComponentGuide
      accessibility={accessibilitySection}
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/focus-lock',
            componentLabel: 'FocusLock',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with FocusLock."
      eyebrow="FocusLock"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
