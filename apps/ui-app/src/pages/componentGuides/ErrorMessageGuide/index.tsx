import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useApiReference } from '@/apiReference';
import {
  ExampleViewer,
  GuideExampleCard,
  GuideExampleText,
  GuideIntro,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideCallout,
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const errorMessageFallbackImport =
  "import { ErrorMessage } from '@themeshift/ui/components/ErrorMessage';";

export const ErrorMessageGuide = () => {
  const { component } = useApiReference({ component: 'errormessage' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? errorMessageFallbackImport,
    intro:
      'Get error text on screen quickly, then connect it to controls with robust semantics.',
    useDescription:
      'Start with a short inline error message, then connect it to controls with aria-describedby.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>ErrorMessage</code> is a lightweight text primitive for
          validation feedback. It defaults to <code>role="alert"</code> so
          updates are announced by assistive technology.
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
            id="examples-field"
            label="With Field"
            level={2}
          />
          <Heading level={4}>With Field</Heading>
          <p>
            Pair <code>ErrorMessage</code> with <code>aria-describedby</code> so
            input focus includes error text in screen reader output.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withField} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-roles" label="Roles" level={2} />
          <Heading level={4}>Alert and status roles</Heading>
          <p>
            Keep the default <code>alert</code> role for blocking errors, or use
            <code>role="status"</code> for less urgent validation updates.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.assertiveAndPolite} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-long-form"
            label="Long message"
            level={2}
          />
          <Heading level={4}>Long-form message</Heading>
          <p>
            Use clear, actionable copy when users need to correct multiple
            constraints in one field.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.longForm} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact native paragraph props and defaults.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common error-message patterns used in forms and validation workflows.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for error semantics and announcements.',
    items: [
      {
        content: (
          <p>
            Keep error text programmatically associated with the related
            control, typically using matching <code>id</code> and{' '}
            <code>aria-describedby</code>.
          </p>
        ),
        example: examples.withField,
        title: 'Associate errors with controls',
      },
      {
        content: (
          <p>
            <code>ErrorMessage</code> defaults to <code>role="alert"</code> for
            urgent announcements. Use <code>role="status"</code> when updates
            should be less interruptive.
          </p>
        ),
        example: examples.assertiveAndPolite,
        title: 'Choose live-region behavior intentionally',
      },
      {
        content: (
          <p>
            Use concise, actionable copy so users know what to fix. Keep the
            visual validation state in sync with what is announced.
          </p>
        ),
        example: examples.longForm,
        title: 'Write actionable, consistent messages',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/error-message',
            componentLabel: 'ErrorMessage',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with ErrorMessage."
      eyebrow="ErrorMessage"
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
