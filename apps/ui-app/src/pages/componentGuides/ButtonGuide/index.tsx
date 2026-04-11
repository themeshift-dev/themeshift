import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, TableOfContents } from '@/app/components';
import { useComponentData } from '@/component-data';
import {
  ExampleViewer,
  StringCopier,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import { AccessibilitySection } from './AccessibilitySection';
import styles from './ButtonGuide.module.scss';
import * as examples from './examples';

const buttonFallbackImport =
  "import { Button } from '@themeshift/ui/components/Button';";

export const ButtonGuide = () => {
  const { component } = useComponentData('button');

  return (
    <TableOfContents.Root>
      <TableOfContents.Marker id="intro" label="Intro" />

      <ComponentGuide
        aside={<TableOfContents.Nav />}
        asideLabel="On this page"
        description="A button that's jam-packed with all the bells and whistles you could need"
        title="Button"
      >
        <section>
          <ExampleViewer
            examples={examples.propHighlights}
            className={styles.exampleViewer}
          />
        </section>

        <TableOfContents.Marker id="how-to-use" label="How to use" />
        <section>
          <Heading level={3}>How to use</Heading>

          <TableOfContents.Marker id="install" label="Install" level={2} />
          <div className={styles.group}>
            <Heading level={4}>Install</Heading>
            <StringCopier string="npm install @themeshift/ui" />
          </div>

          <TableOfContents.Marker id="import" label="Import" level={2} />
          <div className={styles.group}>
            <Heading level={4}>Import</Heading>
            <StringCopier
              language="jsx"
              string={component?.importString ?? buttonFallbackImport}
            />
          </div>

          <TableOfContents.Marker id="use" label="Use" level={2} />
          <div className={styles.group}>
            <Heading level={4}>Use</Heading>
            <ExampleViewer
              example={examples.basicUsage}
              className={styles.exampleViewer}
            />
          </div>
        </section>

        <TableOfContents.Marker id="props" label="Props" />
        <section>
          <Heading level={3}>Props</Heading>
          <ApiReference
            intro={
              <p className={styles.apiReferenceIntro}>
                <code>Button</code> extends the native <code>button</code>{' '}
                element, and adds these props to add extra functionality and
                styling.
              </p>
            }
            items={component?.apiReference ?? []}
          />
        </section>

        <TableOfContents.Marker id="examples" label="Examples" />
        <section>
          <Heading level={3}>Examples</Heading>

          <TableOfContents.Marker id="examples-sizes" label="Sizes" level={2} />
          <div className={styles.example}>
            <Heading level={4}>Sizes</Heading>
            <p>
              Use the <code>size</code> prop to change the size of the button.
            </p>

            <ExampleViewer
              example={examples.sizes}
              className={styles.exampleViewer}
            />
          </div>

          <TableOfContents.Marker
            id="examples-intents"
            label="Intents"
            level={2}
          />
          <div className={styles.example}>
            <Heading level={4}>Intents</Heading>
            <p>
              Use the <code>intent</code> prop to render a variant appearance.
            </p>

            <ExampleViewer
              example={examples.intents}
              className={styles.exampleViewer}
            />
          </div>

          <TableOfContents.Marker
            id="examples-icon-only"
            label="Icon only"
            level={2}
          />
          <div className={styles.example}>
            <Heading level={4}>Icons</Heading>
            <p>
              Use the <code>icon</code> prop to render an icon-only button. When
              using this prop you should also use <code>aria-label</code> or
              <code>aria-labelledby</code> to support screen readers;
            </p>

            <ExampleViewer
              example={examples.icons}
              className={styles.exampleViewer}
            />
          </div>

          <TableOfContents.Marker id="examples-busy" label="Busy" level={2} />
          <div className={styles.example}>
            <Heading level={4}>Busy</Heading>
            <p>
              Use the <code>isBusy</code> flag to render a spinner inside the
              button to indicate the button is working. This prop also applies{' '}
              <code>aria-busy</code> for screen readers.
            </p>

            <ExampleViewer
              example={examples.busy}
              className={styles.exampleViewer}
            />
          </div>

          <TableOfContents.Marker
            id="examples-as-child"
            label="As Child"
            level={2}
          />
          <div className={styles.example}>
            <Heading level={4}>As Child</Heading>
            <p>
              Use the <code>asChild</code> prop to a child element as a button.
              This is useful for disguising links, badges and other elements as
              a button.
            </p>
            <ExampleViewer
              example={examples.asChild}
              className={styles.exampleViewer}
            />
          </div>

          <TableOfContents.Marker
            id="examples-class-names"
            label="Class names"
            level={2}
          />
          <div className={styles.example}>
            <Heading level={4}>Class names</Heading>
            <p>
              Use the <code>className</code> prop to a apply extra class names
              to the button element. This is useful for applying extra styles.
            </p>
            <ExampleViewer
              example={examples.extraClassName}
              className={styles.exampleViewer}
            />
          </div>

          <TableOfContents.Marker
            id="examples-disabled"
            label="Disabled"
            level={2}
          />
          <div className={styles.example}>
            <Heading level={4}>Disabled</Heading>
            <p>
              Use <code>disabled</code> to disable a button, which prevents
              clicks and focus states.
            </p>
            <p>
              Use <code>visuallyDisabled</code> when you want a button to appear
              disabled, but still be able to receive click/focus events in order
              to provide feedback to the user.
            </p>
            <ExampleViewer
              example={examples.disabled}
              className={styles.exampleViewer}
            />
          </div>
        </section>

        <TableOfContents.Marker id="accessibility" label="Accessibility" />
        <section>
          <AccessibilitySection />
        </section>
      </ComponentGuide>
    </TableOfContents.Root>
  );
};
