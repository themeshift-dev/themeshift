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

const gridFallbackImport =
  "import { Grid } from '@themeshift/ui/components/Grid';";

export const GridGuide = () => {
  const { component } = useApiReference({ component: 'grid' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? gridFallbackImport,
    intro:
      'Use Grid for token-aligned two-dimensional layouts with a fast numeric columns shorthand and compound Grid.Item placement.',
    useDescription:
      'Start with columns + gap for common card layouts, then move to template tracks and Grid.Item span/placement for advanced composition.',
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
            <code>Grid</code> supports both <code>columns={3}</code> shorthand
            and explicit <code>templateColumns</code>. When both are provided,
            explicit template props win.
          </GuideCallout>
        }
        items={component?.apiReference ?? []}
      />
    ),
    intro:
      'Use responsive object values for track and gap props. Use Grid.Item for placement and spanning without manual grid-line CSS.',
  });

  const typesSection = createTypesSection({
    content: (
      <TypesReference
        intro={
          <GuideCallout>
            Grid and Grid.Item share responsive wrapper types. Reference these
            aliases before using track, placement, and alignment props.
          </GuideCallout>
        }
        items={component?.typesReference ?? []}
      />
    ),
    intro:
      'These aliases define accepted values for responsive grid tracks, gaps, and item placement.',
  });

  const examplesSection = createExamplesSection({
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-responsive-columns"
              label="Responsive columns"
              level={2}
            />
            <Heading level={4}>Responsive columns</Heading>
            <p>
              Scale track count with object values to go from stacked mobile
              cards to wider desktop grids.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.responsiveColumns} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-custom-tracks"
              label="Custom tracks"
              level={2}
            />
            <Heading level={4}>Custom tracks</Heading>
            <p>
              Switch to explicit CSS track definitions when layout needs fixed,
              fluid, and auto columns together.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.customTracks} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-grid-item"
              label="Grid.Item spans"
              level={2}
            />
            <Heading level={4}>Grid.Item spans</Heading>
            <p>
              Use <code>columnSpan</code> for common multi-column layouts
              without writing line-based syntax manually.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.withGridItem} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-full-span"
              label="Full-span"
              level={2}
            />
            <Heading level={4}>Full-span shortcut</Heading>
            <p>
              Use <code>columnSpan="full"</code> for full-row content like
              banners, separators, or hero rows.
            </p>
          </GuideExampleText>

          <GuideExampleViewer>
            <ExampleViewer example={examples.fullBleedItem} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'These examples cover equal-track layouts, explicit templates, and common compound Grid.Item span patterns.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Grid changes layout visually, but semantic order should remain understandable for assistive technologies.',
    items: [
      {
        content: (
          <p>
            Keep DOM order aligned with reading and keyboard order. Avoid using
            placement props to create a visual order that conflicts with source
            order.
          </p>
        ),
        example: examples.preserveLogicalSourceOrder,
        title: 'Preserve logical source order',
      },
      {
        content: (
          <p>
            For dashboard-like layouts, ensure landmark regions and section
            headings are present so screen reader users can navigate quickly.
          </p>
        ),
        example: examples.labelMajorRegions,
        title: 'Label major regions',
      },
      {
        content: (
          <p>
            Re-check focus order and overflow behavior at each responsive
            breakpoint, especially when column spans change between breakpoints.
          </p>
        ),
        example: examples.testBreakpointTransitions,
        title: 'Test breakpoint transitions',
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
            componentHref: '/ui/component/grid',
            componentLabel: 'Grid',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Grid."
      eyebrow="Grid"
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
