import { Heading } from '@themeshift/ui/components/Heading';

import { useApiReference } from '@/apiReference';
import {
  ApiReference,
  Breadcrumb,
  TableOfContents,
  TypesReference,
} from '@/app/components';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
  createTypesSection,
  ExampleViewer,
  GuideCallout,
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideIntro,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const boxFallbackImport =
  "import { Box } from '@themeshift/ui/components/Box';";

export const BoxGuide = () => {
  const { component } = useApiReference({ component: 'box' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? boxFallbackImport,
    intro:
      'Use Box as the low-level primitive for spacing, sizing, overflow, and semantic element control.',
    useDescription:
      'Start with spacing and sizing props, then add responsive object values when layout needs to adapt by breakpoint.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsSection = createPropsSection({
    content: (
      <ApiReference
        hideColumns={['values']}
        intro={
          <GuideCallout>
            <code>Box</code> is intentionally lightweight. It exposes the most
            common layout props and keeps raw CSS via native <code>style</code>{' '}
            and uncaptured DOM props.
          </GuideCallout>
        }
        items={component?.apiReference ?? []}
      />
    ),
    intro:
      'Review supported layout props and responsive value shapes. Spacing keys like `"4"` map to the space token scale.',
  });

  const typesSection = createTypesSection({
    content: (
      <TypesReference
        intro={
          <GuideCallout>
            Type aliases describe which token keys, keywords, or raw CSS values
            each responsive prop accepts.
          </GuideCallout>
        }
        items={component?.typesReference ?? []}
      />
    ),
    intro:
      'Use these type aliases to understand expected values for responsive layout props.',
  });

  const examplesSection = createExamplesSection({
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-responsive-spacing"
              label="Responsive spacing"
              level={2}
            />
            <Heading level={4}>Responsive spacing</Heading>
            <p>
              Use object values to adapt spacing and dimensions across
              breakpoints without writing custom media-query CSS.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.responsiveSpacing} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-polymorphic"
              label="Polymorphic"
              level={2}
            />
            <Heading level={4}>Polymorphic semantics</Heading>
            <p>
              Use <code>as</code> to keep semantic HTML while using the same
              layout prop API.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.asSemanticElement} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-escape-hatch"
              label="Escape hatch"
              level={2}
            />
            <Heading level={4}>Raw CSS escape hatch</Heading>
            <p>
              When token keys are not enough, pass any valid CSS value directly
              to spacing and size props.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.rawCssEscapeHatch} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'Start with token-friendly spacing, then use semantics and raw CSS escape hatches for advanced layouts.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Box is neutral by default, so accessibility quality depends on semantic element choice and content structure.',
    items: [
      {
        content: (
          <p>
            Choose semantic tags with <code>as</code> when structure matters,
            such as <code>section</code>, <code>nav</code>, or <code>main</code>
            , instead of defaulting to anonymous wrappers.
          </p>
        ),
        example: examples.asSemanticElement,
        title: 'Use semantic elements intentionally',
      },
      {
        content: (
          <p>
            Avoid using empty Box wrappers for visual spacing only. Prefer
            applying spacing on meaningful parent/child elements so reading
            order stays clear for assistive tech.
          </p>
        ),
        example: examples.meaningfulStructure,
        title: 'Keep structure meaningful',
      },
      {
        content: (
          <p>
            If Box becomes a landmark or region, provide a label via
            <code>aria-label</code> or heading association.
          </p>
        ),
        example: examples.labeledRegion,
        title: 'Label regions when needed',
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
            componentHref: '/ui/component/box',
            componentLabel: 'Box',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Box."
      eyebrow="Box"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      typesSection={typesSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
