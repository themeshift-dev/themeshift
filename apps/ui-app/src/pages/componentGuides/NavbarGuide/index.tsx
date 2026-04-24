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
  GuideExampleText,
  GuideExamplesGrid,
  GuideExampleViewer,
  GuideIntro,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const navbarFallbackImport =
  "import { Navbar } from '@themeshift/ui/components/Navbar';";

export const NavbarGuide = () => {
  const { component } = useApiReference({ component: 'navbar' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? navbarFallbackImport,
    intro:
      'Start with semantic defaults, then add responsive content and menu behavior as needed.',
    useDescription:
      'Use `Navbar.Container` for alignment, `Navbar.Content` for inline nav, and `Navbar.Menu` for compact/mobile navigation.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.quickStart} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Navbar</code> is a compound primitive with explicit content and
          menu slots. Desktop and mobile navigation are authored separately for
          full control.
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
            id="examples-responsive-menu"
            label="Responsive menu"
            level={2}
          />
          <Heading level={4}>Responsive menu</Heading>
          <p>
            Pair <code>hideBelow</code> and <code>showBelow</code> with
            <code>Navbar.Toggle</code> and <code>Navbar.Menu</code>, and use
            dynamic toggle labels from <code>isOpen</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.responsiveMenu} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-floating-sticky"
            label="Floating + sticky"
            level={2}
          />
          <Heading level={4}>Floating + sticky</Heading>
          <p>
            Use token-driven surfaces, shadows, and containment presets to build
            elevated product headers.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.floatingSticky} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-drawer"
            label="Drawer placement"
            level={2}
          />
          <Heading level={4}>Drawer placement</Heading>
          <p>
            Use <code>placement="drawer"</code> for layered menus that trap
            focus and lock background scroll.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.drawerPlacement} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-outside-callback"
            label="Outside callback"
            level={2}
          />
          <Heading level={4}>Outside callback actions</Heading>
          <p>
            Use <code>Navbar.Menu onClickOutside</code> with action shorthands
            or a callback that receives <code>open</code>, <code>close</code>,
            and <code>toggle</code> helpers.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.onClickOutsideCallback} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-focus-lock-adapter"
            label="Focus lock adapter"
            level={2}
          />
          <Heading level={4}>Focus lock adapter override</Heading>
          <p>
            For drawer menus, use
            <code>Navbar.Menu focusLockComponent</code> to provide your own
            focus lock adapter when needed.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.customFocusLockAdapter} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-as-child"
            label="asChild"
            level={2}
          />
          <Heading level={4}>asChild</Heading>
          <p>
            Use <code>asChild</code> on <code>Navbar.Brand</code> and
            <code>Navbar.Toggle</code> to keep custom elements while preserving
            Navbar behavior.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.asChildExample} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Reference root and subcomponent props for responsive visibility, menu state, outside interactions, focus lock adapters, and semantic overrides.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Use these patterns for straightforward desktop nav, responsive menus, and drawer behavior.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro: 'Checklist for landmark naming, menu state, and keyboard support.',
    items: [
      {
        content: (
          <p>
            Label each <code>Navbar</code> landmark with <code>aria-label</code>{' '}
            or <code>aria-labelledby</code>, especially when multiple nav
            regions exist.
          </p>
        ),
        example: examples.quickStart,
        tocLabel: 'Landmark naming',
        title: 'Name navigation landmarks',
      },
      {
        content: (
          <p>
            Ensure each menu has a visible label, and keep toggle labels clear.
            <code>Navbar.Toggle</code> updates <code>aria-expanded</code> and
            <code>aria-controls</code> automatically when a menu is present.
            Prefer descriptive <code>aria-label</code> copy that reflects the
            current open state.
          </p>
        ),
        example: examples.responsiveMenu,
        tocLabel: 'Menu labels',
        title: 'Label toggles and menus',
      },
      {
        content: (
          <p>
            Keep focus order aligned with visual order. Drawer menus trap focus
            while open and close on <kbd>Escape</kbd>.
          </p>
        ),
        example: examples.drawerPlacement,
        tocLabel: 'Keyboard behavior',
        title: 'Verify keyboard flow',
      },
    ],
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/navbar',
            componentLabel: 'Navbar',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Navbar."
      eyebrow="Navbar"
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
