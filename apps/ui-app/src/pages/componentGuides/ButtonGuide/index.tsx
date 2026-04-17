import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useApiReference } from '@/apiReference';
import {
  ExampleViewer,
  GuideIntro,
  GuideExampleCard,
  GuideExampleText,
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

const buttonFallbackImport =
  "import { Button } from '@themeshift/ui/components/Button';";

export const ButtonGuide = () => {
  const { component } = useApiReference({ component: 'button' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? buttonFallbackImport,
    importDescription: 'Pull in the component directly from the UI package.',
    intro:
      'Get a button onto the page fast, then branch out into the variants and patterns below.',
    useDescription:
      'Start with the default button, then layer on intent, size, and state props as needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Button</code> extends the native <code>button</code> element and
          adds extra props for appearance, icon support, loading states, and
          composition.
        </GuideCallout>
      }
      items={component?.apiReference ?? []}
    />
  );

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use the <code>size</code> prop to change the size of the button.
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
            Use the <code>intent</code> prop to render a variant appearance.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.intents} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-icon-only"
            label="Icon only"
            level={2}
          />
          <Heading level={4}>Icons</Heading>
          <p>
            Use the <code>icon</code> prop to render an icon-only button. Pair
            it with <code>aria-label</code> or <code>aria-labelledby</code> so
            screen readers still announce a useful name.
          </p>
          <p>
            Use <code>startIcon</code> or <code>endIcon</code> to place an icon
            next to button text.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.icons} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-busy" label="Busy" level={2} />
          <Heading level={4}>Busy</Heading>
          <p>
            Use the <code>isBusy</code> flag to render a spinner inside the
            button and communicate work in progress. This also applies{' '}
            <code>aria-busy</code> for assistive tech.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.busy} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-as-child"
            label="As Child"
            level={2}
          />
          <Heading level={4}>As Child</Heading>
          <p>
            Use the <code>asChild</code> prop to render a child element as a
            button. This works well when you need a link, badge or other
            primitive to inherit button styling and behavior.
          </p>
        </GuideExampleText>
        <GuideExampleViewer>
          <ExampleViewer example={examples.asChild} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-class-names"
            label="Class names"
            level={2}
          />
          <Heading level={4}>Class names</Heading>
          <p>
            Use the <code>className</code> prop to apply extra class names to
            the button element when you need local styling tweaks.
          </p>
        </GuideExampleText>
        <GuideExampleViewer>
          <ExampleViewer example={examples.extraClassName} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-disabled"
            label="Disabled"
            level={2}
          />
          <Heading level={4}>Disabled</Heading>
          <p>
            Use <code>disabled</code> to prevent clicks and remove the button
            from normal keyboard interaction.
          </p>
          <p>
            Use <code>visuallyDisabled</code> when the button should look
            unavailable but still needs to receive events so you can explain why
            the action is blocked.
          </p>
        </GuideExampleText>
        <GuideExampleViewer>
          <ExampleViewer example={examples.disabled} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference when you need exact prop names, supported values, and default behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse the common patterns developers usually need in production. Copy and paste what you need to get going quickly.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Best practices for naming and state feedback.',
    items: [
      {
        content: (
          <p>
            Icon-only buttons need an explicit accessible name. Use{' '}
            <code>aria-label</code> or <code>aria-labelledby</code>, and mark
            decorative icons as <code>aria-hidden</code>.
          </p>
        ),
        example: examples.icons,
        title: 'Name icon-only buttons',
      },
      {
        content: (
          <p>
            When using <code>isBusy</code>, keep the label stable so assistive
            tech still announces the action. Prefer <code>disabled</code> for
            actions that should not be triggered while busy.
          </p>
        ),
        example: examples.busy,
        title: 'Communicate loading state',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/button',
            componentLabel: 'Button',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Button."
      eyebrow="Button"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      accessibility={accessibilitySection}
      toc={<TableOfContents.Nav />}
      title="Docs"
    />
  );
};
