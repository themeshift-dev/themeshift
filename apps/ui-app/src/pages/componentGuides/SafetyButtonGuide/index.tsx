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

const safetyButtonFallbackImport =
  "import { SafetyButton } from '@themeshift/ui/components/SafetyButton';";

export const SafetyButtonGuide = () => {
  const { component } = useApiReference({ component: 'safety-button' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? safetyButtonFallbackImport,
    intro:
      'Use SafetyButton for destructive actions that need an intentional hold before execution.',
    useDescription:
      'Start with a clear destructive label, then add dynamic resolver text or icon state for countdown and completion feedback.',
    useExample: (
      <ExampleViewer
        defaultCodeExpanded={true}
        example={examples.countdownLabel}
      />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>SafetyButton</code> composes <code>Button</code> with{' '}
          <code>useHoldToConfirm</code>. It owns click/press confirmation flow,
          so use <code>onConfirm</code> for final actions and{' '}
          <code>onAttemptStart</code> for start-of-attempt telemetry.
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
            id="examples-countdown"
            label="Countdown label"
            level={2}
          />
          <Heading level={4}>Countdown labels</Heading>
          <p>
            Use a resolver for <code>children</code> when the label should show
            remaining hold time.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.countdownLabel} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-visual-only"
            label="Visual only"
            level={2}
          />
          <Heading level={4}>Visual-only progress</Heading>
          <p>
            Keep the same label and rely on the progress fill when text updates
            are unnecessary.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.visualOnly} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-icon"
            label="Icon only"
            level={2}
          />
          <Heading level={4}>Icon-only destructive actions</Heading>
          <p>
            Pair icon resolver state with an <code>aria-label</code> resolver so
            screen readers get equivalent state context.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.iconOnly} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-direction"
            label="Direction (LTR and RTL)"
            level={2}
          />
          <Heading level={4}>Direction (LTR and RTL)</Heading>
          <p>
            Progress fill follows writing direction automatically, including RTL
            interfaces.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-keyboard"
            label="Keyboard"
            level={2}
          />
          <Heading level={4}>Keyboard hold support</Heading>
          <p>
            Hold <code>Space</code> or <code>Enter</code> to confirm. Enable{' '}
            <code>announceProgress</code> when countdown announcements are
            useful.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.keyboardHold} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop signatures, defaults, and resolver argument types.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Start with a basic destructive hold pattern, then layer in resolver-driven labels and icon states.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Hold-to-confirm actions should stay understandable for keyboard, screen reader, and pointer users.',
    items: [
      {
        content: (
          <p>
            Keep labels explicit about destructive impact. Icon-only usage needs
            an accessible name through <code>aria-label</code> or{' '}
            <code>aria-labelledby</code>, ideally with state-aware resolver
            text.
          </p>
        ),
        example: examples.iconOnly,
        title: 'Name destructive controls clearly',
      },
      {
        content: (
          <p>
            Do not rely on color alone to communicate state. Pair progress fill
            with text updates, announcement support, or both for critical flows.
          </p>
        ),
        example: examples.countdownLabel,
        title: 'Pair color with textual feedback',
      },
      {
        content: (
          <p>
            Verify keyboard hold behavior and focus visibility in both LTR and
            RTL layouts before release.
          </p>
        ),
        example: examples.keyboardHold,
        title: 'Validate keyboard and direction behavior',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/component/safety-button',
            componentLabel: 'SafetyButton',
          })}
        />
      }
      description="Implementation guidance, API details, and examples for destructive hold-to-confirm actions with SafetyButton."
      eyebrow="SafetyButton"
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
