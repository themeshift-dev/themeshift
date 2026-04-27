import { Heading } from '@themeshift/ui/components/Heading';

import { useApiReference } from '@/apiReference';
import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
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

const tableFallbackImport =
  "import { Table } from '@themeshift/ui/components/Table';";

export const TableGuide = () => {
  const { component } = useApiReference({ component: 'table' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? tableFallbackImport,
    intro:
      'Use Table for semantic tabular content first, then scale to data-driven rendering with the same primitives.',
    useDescription:
      'Start with native table structure, add alignment and density controls, then switch to `data` + `columns` when rendering dynamic datasets.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Table</code> is a semantic compound component with optional
          data-driven rendering. Prefer native structure and use
          <code> Table.Container</code> for focusable scroll regions.
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
            id="examples-semantic"
            label="Semantic composition"
            level={2}
          />
          <Heading level={4}>Semantic composition</Heading>
          <p>
            Compose table markup directly with <code>Table.Head</code>,
            <code>Table.Body</code>, and native semantic cells.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.basicUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-data"
            label="Data mode"
            level={2}
          />
          <Heading level={4}>Data and columns mode</Heading>
          <p>
            Use <code>data</code> and <code>columns</code> for predictable row
            rendering with value formatters.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.dataMode} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-scroll"
            label="Scrollable container"
            level={2}
          />
          <Heading level={4}>Scrollable container</Heading>
          <p>
            Use <code>Table.Container</code> with an accessible label for
            horizontal overflow on small screens.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.containerScroll} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-responsive-mobile"
            label="Responsive scroll (mobile)"
            level={2}
          />
          <Heading level={4}>Responsive scroll at mobile</Heading>
          <p>
            Use <code>responsive="scroll"</code> with
            <code> responsiveBreakpoint="mobile"</code> when wide tables should
            overflow from the smallest viewport.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.responsiveScrollMobile} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-responsive-tablet"
            label="Responsive scroll (tablet)"
            level={2}
          />
          <Heading level={4}>Responsive scroll at tablet</Heading>
          <p>
            Use <code>responsiveBreakpoint="tablet"</code> when desktop layouts
            can stay fixed-width while smaller breakpoints scroll.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.responsiveScrollTablet} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-responsive-columns"
            label="Responsive columns"
            level={2}
          />
          <Heading level={4}>Responsive column visibility</Heading>
          <p>
            Use per-column <code>hideBelow</code> rules to keep critical values
            visible while reducing lower-priority columns on small screens.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.responsiveColumnVisibility} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-sticky-first-column"
            label="Sticky first column"
            level={2}
          />
          <Heading level={4}>Sticky first column</Heading>
          <p>
            Use a sticky first column with a horizontal scroll container so row
            identity stays visible while scanning wide operational datasets.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.stickyFirstColumn} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-empty"
            label="Empty state"
            level={2}
          />
          <Heading level={4}>Empty state</Heading>
          <p>
            Render <code>Table.Empty</code> for empty datasets with title and
            supporting description.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.emptyState} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-empty-action"
            label="Empty state + action"
            level={2}
          />
          <Heading level={4}>Empty state with action</Heading>
          <p>
            Include a follow-up action when an empty table can be resolved by
            creating or importing data.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.emptyStateWithAction} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-density"
            label="Density"
            level={2}
          />
          <Heading level={4}>Density</Heading>
          <p>
            Use <code>density</code> to adjust row padding for compact,
            balanced, or spacious scanning patterns.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.density} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <Heading level={4}>Sizes</Heading>
          <p>
            Use <code>size</code> to scale table cell spacing and typography for
            dense or roomy layouts.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.sizes} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-alignment"
            label="Alignment + truncation"
            level={2}
          />
          <Heading level={4}>Alignment and truncation</Heading>
          <p>
            Use <code>align</code>, <code>truncate</code>, and{' '}
            <code>nowrap</code>
            to preserve readability across mixed-content columns.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.alignmentAndTruncation} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-row-appearance"
            label="Striped + hover"
            level={2}
          />
          <Heading level={4}>Striped rows and hover</Heading>
          <p>
            Use <code>striped</code> and <code>hover</code> together for
            scannable read-heavy tables.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.stripedAndHover} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-row-states"
            label="Row states"
            level={2}
          />
          <Heading level={4}>Row visual states</Heading>
          <p>
            Use <code>selected</code>, <code>interactive</code>, and
            <code> disabled</code> to communicate row status without changing
            table semantics.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.rowStates} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-footer-totals"
            label="Totals footer"
            level={2}
          />
          <Heading level={4}>Totals footer</Heading>
          <p>
            Use <code>Table.Foot</code> for summary rows such as totals without
            mixing aggregate information into body rows.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.totalsFooter} />
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
            Confirm alignment and sticky inline-start behavior in both text
            directions.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer examples={examples.directionExamples} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for exact prop signatures, default values, and compound part behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Start with semantic composition, then adopt data mode and responsive container patterns as datasets grow.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Table should preserve native semantics and only add ARIA where native semantics do not cover the intended behavior.',
    items: [
      {
        content: (
          <p>
            Keep native <code>table</code> semantics whenever possible. Use real
            header scopes and captions so assistive tech can announce context.
          </p>
        ),
        example: examples.basicUsage,
        title: 'Prefer native semantics first',
      },
      {
        content: (
          <p>
            When the table overflows, place it in <code>Table.Container</code>
            and provide a meaningful <code>label</code> so keyboard users can
            discover and navigate the region.
          </p>
        ),
        example: examples.containerScroll,
        title: 'Label scroll regions',
      },
      {
        content: (
          <p>
            Verify directional behavior in both LTR and RTL. Sticky inline-start
            columns and end-aligned numeric values should remain readable in
            both contexts.
          </p>
        ),
        example: examples.directionLTR,
        title: 'Validate direction-aware layout',
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
            componentHref: '/ui/component/table',
            componentLabel: 'Table',
          })}
        />
      }
      description="Implementation guidance, API details, and examples for semantic, composable table patterns."
      eyebrow="Table"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
