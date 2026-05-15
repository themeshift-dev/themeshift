import { Heading } from '@themeshift/ui/components/Heading';

import { useApiReference } from '@/apiReference';
import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
  ExampleViewer,
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideIntro,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const menuFallbackImport =
  "import { Menu } from '@themeshift/ui/components/Menu';";

export const MenuGuide = () => {
  const { component } = useApiReference({ component: 'menu' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.introExamples} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStart = createQuickStartSection({
    componentImport: component?.importString ?? menuFallbackImport,
    intro:
      'Use Menu primitives as an accessible interaction foundation for dropdown, navigation, and context-style menus.',
    useDescription:
      'Start with Root + Content + Item, then layer Sub/Checkbox/Radio primitives as behavior expands.',
    useExample: (
      <ExampleViewer
        defaultCodeExpanded={true}
        example={examples.basicComposition}
      />
    ),
  });

  const propsSection = createPropsSection({
    content: <ApiReference items={component?.apiReference ?? []} />,
    intro:
      'Menu exposes composable primitives with controllable state, keyboard navigation, typeahead, and floating positioning options.',
  });

  const examplesSection = createExamplesSection({
    intro:
      'Browse composition, rendering modes, selection primitives, nested submenu behavior, RTL usage, and typeahead-friendly item authoring.',
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-inline-floating"
              label="Inline and floating"
              level={2}
            />
            <Heading level={4}>Inline and floating modes</Heading>
            <p>
              Keep floating props optional. Use <code>mode="floating"</code>{' '}
              only when an anchored/overlay behavior is needed.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.inlineAndFloating} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-submenu"
              label="Submenu intent"
              level={2}
            />
            <Heading level={4}>Submenu intent</Heading>
            <p>
              Sub menus apply open/close delays and pointer-intent handling so
              diagonal pointer travel does not close nested content too eagerly.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.submenuIntent} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-selection"
              label="Selection primitives"
              level={2}
            />
            <Heading level={4}>Selection primitives</Heading>
            <p>
              Use <code>CheckboxItem</code>, <code>RadioGroup</code>, and{' '}
              <code>ItemIndicator</code>
              for explicit selection semantics instead of overloading standard
              menu items.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.checkboxRadioIndicator} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-typeahead"
              label="Typeahead textValue"
              level={2}
            />
            <Heading level={4}>Typeahead with textValue</Heading>
            <p>
              Provide <code>textValue</code> when item children are complex so
              keyboard typeahead always matches predictable command text.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.typeaheadTextValue} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-disabled"
              label="Disabled item behavior"
              level={2}
            />
            <Heading level={4}>Disabled item behavior</Heading>
            <p>
              Compare default disabled items (skipped in roving focus) with{' '}
              <code>disabledBehavior=&quot;focusable&quot;</code> items that can
              still receive focus for announcement and inspection.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.disabledItemBehavior} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-click-focus-submenu"
              label="Click/focus-only submenu"
              level={2}
            />
            <Heading level={4}>Click/focus-only submenu</Heading>
            <p>
              Disable hover-triggered opening with{' '}
              <code>openOnHover=&#123;false&#125;</code> when you want submenu
              content to appear only from click or keyboard focus flow.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.clickFocusSubmenu} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
  });

  const accessibility = createAccessibilityGuidelinesSection({
    intro:
      'Menu accessibility depends on explicit naming, predictable keyboard focus, and semantics that match intent.',
    items: [
      {
        title: 'Provide an accessible content name',
        content: (
          <p>
            Include <code>aria-label</code> or <code>aria-labelledby</code> when
            menu content is not named by nearby UI. This keeps menu purpose
            clear for screen readers.
          </p>
        ),
        example: {
          id: 'a11y-name',
          label: examples.basicComposition.label,
          code: examples.basicComposition.code,
          render: examples.basicComposition.sample,
        },
      },
      {
        title: 'Use keyboard-friendly item patterns',
        content: (
          <p>
            Menu uses roving tabindex and typeahead. Keep disabled behavior
            explicit, and avoid relying on color alone for destructive actions.
          </p>
        ),
        example: {
          id: 'a11y-selection',
          label: examples.checkboxRadioIndicator.label,
          code: examples.checkboxRadioIndicator.code,
          render: examples.checkboxRadioIndicator.sample,
        },
      },
      {
        title: 'Support directional and reduced-motion needs',
        content: (
          <p>
            Confirm submenu direction in RTL layouts and ensure users can
            navigate fully without depending on animation timing.
          </p>
        ),
        example: {
          id: 'a11y-rtl',
          label: examples.rtlBehavior.label,
          code: examples.rtlBehavior.code,
          render: examples.rtlBehavior.sample,
        },
      },
    ],
  });

  return (
    <ComponentGuide
      accessibility={accessibility}
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/component/menu',
            componentLabel: 'Menu',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for accessible, composable menu primitives."
      eyebrow="Menu"
      examples={examplesSection}
      howToUse={quickStart}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
