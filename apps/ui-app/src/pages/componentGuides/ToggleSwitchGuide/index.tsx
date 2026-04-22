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

const toggleSwitchFallbackImport =
  "import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';";

export const ToggleSwitchGuide = () => {
  const { component } = useApiReference({ component: 'toggleswitch' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? toggleSwitchFallbackImport,
    intro:
      'Get a switch onto the page quickly, then expand into Field composition, validation, and icon/state patterns.',
    useDescription:
      'Start with an accessible switch, then compose labels, guidance, and errors with Field when needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      hideColumns={['defaultValue']}
      intro={
        <GuideCallout>
          <code>ToggleSwitch</code> wraps a native{' '}
          <code>input[type="checkbox"]</code> with <code>role="switch"</code>,
          supports intent/size/icon styling, and can inherit accessibility state
          from <code>Field</code>.
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
            id="examples-field-inline"
            label="Field inline"
            level={2}
          />
          <Heading level={4}>With Field inline-control</Heading>
          <p>
            Use <code>layout="inline-control"</code> to keep switch and label on
            one row.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withFieldInline} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-description-error"
            label="Description and error"
            level={2}
          />
          <Heading level={4}>Description and error</Heading>
          <p>
            Compose helper text and validation with{' '}
            <code>Field.Description</code> and <code>Field.Error</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withDescriptionAndError} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-validation"
            label="Validation"
            level={2}
          />
          <Heading level={4}>Validation states</Heading>
          <p>
            Use <code>validationState</code> for border feedback and derived
            <code>aria-invalid</code> semantics.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.validationStates} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-on-checked-change"
            label="onCheckedChange"
            level={2}
          />
          <Heading level={4}>onCheckedChange</Heading>
          <p>
            Use <code>onCheckedChange</code> with <code>checked</code> to keep
            switch state synced with external state.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.checkedChange} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-icons" label="Icons" level={2} />
          <Heading level={4}>Icons</Heading>
          <p>
            Use <code>trackIconOff</code>/<code>trackIconOn</code> or
            <code>thumbIconOff</code>/<code>thumbIconOn</code> for state-aware
            icon placement.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.icons} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-direction"
            label="Direction (LTR/RTL)"
            level={2}
          />
          <Heading level={4}>Direction (LTR/RTL)</Heading>
          <p>
            Start and end icon positions should mirror automatically across
            writing directions.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use <code>size</code> to scale track and thumb dimensions.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.sizes} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-intents"
            label="Intents"
            level={2}
          />
          <Heading level={4}>Intents</Heading>
          <p>
            Use <code>intent</code> to style the thumb while keeping a
            consistent track treatment.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.intents} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-states"
            label="States"
            level={2}
          />
          <Heading level={4}>States</Heading>
          <p>
            Use <code>checked</code>, <code>disabled</code>, and{' '}
            <code>readOnly</code> for interaction state handling.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.states} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop names, native passthrough behavior, and Field-aware accessibility defaults.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common switch patterns for production forms and settings screens.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Notes for labeling and state announcements.',
    items: [
      {
        content: (
          <p>
            Switches need a programmatic label. Pair <code>ToggleSwitch</code>{' '}
            with a native <code>label</code> or <code>Field</code> so screen
            readers announce what the switch controls.
          </p>
        ),
        example: examples.withFieldInline,
        title: 'Provide a label',
      },
      {
        content: (
          <p>
            Use descriptions and errors to explain what the setting does and
            what went wrong. Keep the help text and error text associated with
            the switch using <code>Field</code>.
          </p>
        ),
        example: examples.withDescriptionAndError,
        tocLabel: 'Guidance & errors',
        title: 'Associate guidance and errors',
      },
      {
        content: (
          <p>
            If the visible label changes based on state, make sure the announced
            label is updated too (for example, reflect the current on/off
            meaning in the label text).
          </p>
        ),
        example: examples.checkedChange,
        tocLabel: 'State labels',
        title: 'Keep state labels accurate',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/toggle-switch',
            componentLabel: 'ToggleSwitch',
          })}
        />
      }
      description="A theme-aware native switch with Field integration and state-aware icon support."
      eyebrow="ToggleSwitch"
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
