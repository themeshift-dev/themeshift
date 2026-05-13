import { Heading } from '@themeshift/ui/components/Heading';
import { Status } from '@themeshift/ui/components/Status';

import { useApiReference } from '@/apiReference';
import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
  GuideExampleCard,
  GuideExampleText,
  GuideExamplesGrid,
  GuideExampleViewer,
  GuideIntro,
  LayoutViewer,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const statusFallbackImport =
  "import { Status } from '@themeshift/ui/components/Status';";

export const StatusGuide = () => {
  const { component } = useApiReference({ component: 'status' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <LayoutViewer
          allowOpenInNewTab={false}
          examples={examples.introExamples}
          frameDescription="Status presets for disconnected and permission-denied views."
          frameTitle="Status preset preview"
          mode="contained"
          showCode
        />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? statusFallbackImport,
    intro:
      'Use Status for empty, error, and no-results states with consistent icon, copy, and action layout.',
    useDescription:
      'Start with the composable slots, then use presets for common cases like 404 and disconnected pages.',
    useExample: (
      <LayoutViewer
        defaultCodeOpen
        examples={[
          {
            code: examples.quickStart.code,
            id: 'quick-start',
            label: examples.quickStart.label,
            render: (
              <div style={{ padding: '1rem' }}>
                {examples.quickStart.sample}
              </div>
            ),
          },
        ]}
        mode="contained"
      />
    ),
  });

  const propsSection = createPropsSection({
    content: <ApiReference items={component?.apiReference ?? []} />,
    intro:
      'Use root props for alignment, density, variant, intent, and announcement semantics. Use slot props for composition and asChild integration.',
  });

  const examplesSection = createExamplesSection({
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-composition"
              label="Composed primitives"
              level={2}
            />
            <Heading level={4}>Composed primitives</Heading>
            <p>
              Compose icon, title, description, and actions directly when you
              need complete layout control.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.compositionExample]}
              frameDescription="Composed status example with actions."
              mode="contained"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-actions-as-child"
              label="Actions asChild"
              level={2}
            />
            <Heading level={4}>Actions with asChild</Heading>
            <p>
              Use <code>asChild</code> when another layout primitive should own
              the action container element.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={[examples.actionsAsChildExample]}
              frameDescription="Status actions slot with asChild composition."
              mode="contained"
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-all-presets"
              label="Presets"
              level={2}
            />
            <Heading level={4}>All pre-built presets</Heading>
            <p>
              Preview every built-in preset together when choosing the closest
              starting point for your empty and error states.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <LayoutViewer
              defaultCodeOpen
              examples={examples.allPresetExamples}
              frameDescription="All built-in Status presets shown in one layout."
              mode="contained"
            />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'Browse composition and preset approaches, then use the built-in LayoutViewer direction toggle to validate RTL/LTR behavior.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Status blocks should provide clear hierarchy, actionable next steps, and optional announcements for async updates.',
    items: [
      {
        content: (
          <p>
            Use meaningful heading and description copy so screen reader users
            understand both the state and the next action.
          </p>
        ),
        example: {
          code: examples.quickStart.code,
          id: 'a11y-actionable-copy',
          label: examples.quickStart.label,
          render: (
            <div style={{ padding: '1rem' }}>{examples.quickStart.sample}</div>
          ),
        },
        title: 'Write actionable copy',
      },
      {
        content: (
          <p>
            Use <code>role="status"</code> and <code>aria-live="polite"</code>{' '}
            for asynchronous updates that should be announced without
            interrupting users.
          </p>
        ),
        example: {
          id: 'a11y-live-region',
          code: `<Status aria-live="polite" role="status">
  <Status.Content>
    <Status.Title>Sync complete</Status.Title>
    <Status.Description>
      Your latest data is now available.
    </Status.Description>
  </Status.Content>
</Status>`,
          label: 'Live region example',
          render: (
            <div style={{ padding: '1rem' }}>
              <Status aria-live="polite" role="status">
                <Status.Content>
                  <Status.Title>Sync complete</Status.Title>
                  <Status.Description>
                    Your latest data is now available.
                  </Status.Description>
                </Status.Content>
              </Status>
            </div>
          ),
        },
        title: 'Announce async state changes',
      },
      {
        content: (
          <p>
            Keep all keyboard-operable actions inside{' '}
            <code>Status.Actions</code> and avoid relying on icon-only messaging
            without text context.
          </p>
        ),
        example: examples.compositionExample,
        title: 'Preserve clear, keyboard-first actions',
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
            componentHref: '/ui/component/status',
            componentLabel: 'Status',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for empty, error, and no-results states with Status."
      eyebrow="Status"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
