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
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const copyButtonFallbackImport =
  "import { CopyButton } from '@themeshift/ui/components/CopyButton';";

export const CopyButtonGuide = () => {
  const { component } = useApiReference({ component: 'copy-button' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? copyButtonFallbackImport,
    intro:
      'Use CopyButton when you need copy-to-clipboard behavior with built-in success and failure messaging.',
    useDescription:
      'Start with a value and label text, then layer in confirmation, error fallback, and state-driven icon/label resolvers.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>CopyButton</code> composes <code>Button</code> with{' '}
          <code>useCopyToClipboard</code>. It forwards all standard button props
          except <code>onClick</code>, which is internally managed so copy
          behavior stays consistent.
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
            id="examples-basic"
            label="Basic usage"
            level={2}
          />
          <Heading level={4}>Basic usage</Heading>
          <p>
            Pass a <code>value</code> and label text. Use{' '}
            <code>confirmationMessage</code> for temporary success feedback.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.basicUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-icon-only"
            label="Icon only"
            level={2}
          />
          <Heading level={4}>Icon-only actions</Heading>
          <p>
            Use resolver functions for <code>icon</code> and{' '}
            <code>aria-label</code> so the accessible name matches state.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.iconOnly} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-render-prop"
            label="Render prop"
            level={2}
          />
          <Heading level={4}>Render-prop labels</Heading>
          <p>
            Use a function for <code>children</code> when label text should
            update from the copied state directly.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.renderPropChildren} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-failure"
            label="Failure fallback"
            level={2}
          />
          <Heading level={4}>Failure fallback</Heading>
          <p>
            Provide <code>errorMessage</code> and <code>onCopyError</code> to
            keep feedback clear when clipboard APIs are unavailable.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.failureFeedback} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-dynamic-icons"
            label="Dynamic icon slots"
            level={2}
          />
          <Heading level={4}>Dynamic icon slots</Heading>
          <p>
            Apply resolver functions to <code>endIcon</code> and{' '}
            <code>title</code> when visual and hover hints should match copied
            state.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.titleAndIconSlots} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-toolbar"
            label="Toolbars"
            level={2}
          />
          <Heading level={4}>In toolbars</Heading>
          <p>
            CopyButton is still a Button variant, so it fits beside existing
            action controls.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.inToolbar} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop signatures, defaults, and dynamic resolver support.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Copy common patterns directly, then adapt labels, icons, and callbacks to your product context.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Copy interactions should always communicate both intent and result.',
    items: [
      {
        content: (
          <p>
            Icon-only CopyButtons must expose a clear accessible name via{' '}
            <code>aria-label</code> or <code>aria-labelledby</code>. Prefer a
            resolver so the name updates to “Copied” after success.
          </p>
        ),
        example: examples.iconOnly,
        title: 'Name icon-only controls',
      },
      {
        content: (
          <p>
            Include <code>confirmationMessage</code> and{' '}
            <code>errorMessage</code> so users get immediate state feedback
            without relying on color-only changes.
          </p>
        ),
        example: examples.failureFeedback,
        title: 'Communicate success and failure',
      },
      {
        content: (
          <p>
            Keep copy labels specific to the value being copied (for example,
            “Copy API token”) instead of generic text when multiple copy
            controls appear on a page.
          </p>
        ),
        example: examples.inToolbar,
        title: 'Use context-specific labels',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/component/copy-button',
            componentLabel: 'CopyButton',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with CopyButton."
      eyebrow="CopyButton"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      accessibility={accessibilitySection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
