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
  QuickStartGuide,
  createHookBreadcrumbItems,
} from '@/pages/componentGuides/components';
import { HookGuide } from '@/templates/HookGuide';

import * as examples from './examples';

const formFallbackImport = {
  code: `import { useForm } from '@themeshift/ui/hooks/useForm';
import { Field } from '@themeshift/ui/components/Field';
import { Input } from '@themeshift/ui/components/Input';`,
  type: 'raw' as const,
};

export const UseFormGuide = () => {
  const { hook } = useApiReference({ hook: 'use-form' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.commonUseCases} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const optionsContent = (
    <>
      <GuideCallout>
        <code>useForm</code> supports per-field validators and configurable
        validation timing via <code>validateOn</code>.
      </GuideCallout>

      <ApiReference
        emptyState={<p>No options documented yet.</p>}
        items={hook?.apiReference ?? []}
        nameColumnLabel="Option name"
      />
    </>
  );

  const returnsContent = (
    <ApiReference
      emptyState={<p>No return values documented yet.</p>}
      hideColumns={['defaultValue']}
      items={hook?.returnReference ?? []}
      nameColumnLabel="Return value"
    />
  );

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-basic-usage"
            label="Basic usage"
            level={2}
          />
          <Heading level={4}>Basic usage</Heading>

          <p>
            Specify default values for the form by passing options to{' '}
            <code>useForm</code>.
          </p>
          <p>
            Then use <code>form.register</code> to hook up the correct handlers
            automatically.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.basicUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-basic-validation"
            label="Basic validation"
            level={2}
          />
          <Heading level={4}>Field integration</Heading>
          <p>
            Start with a single field and a validator. Field integration wires
            up <code>register</code>, validation state, and error messaging.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.fieldUsage} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-blur"
            label="Validate on blur"
            level={2}
          />
          <Heading level={4}>Validate on blur</Heading>
          <p>
            Switch <code>validateOn</code> to validate earlier in the
            interaction.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.validateOnBlur} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-controller"
            label="Controller adapter"
            level={2}
          />
          <Heading level={4}>Controller adapter</Heading>
          <p>
            Use <code>form.controller</code> to adapt non-standard inputs (or
            custom components) like <code>ToggleSwitch</code> to the form store.
          </p>
          <p>
            Field-aware controls such as <code>Input</code>,{' '}
            <code>Textarea</code>, <code>Select</code>, and{' '}
            <code>Checkbox</code> can auto-register through <code>Field</code>{' '}
            without this adapter.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.controllerPattern} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-register-options"
            label="Register options"
            level={2}
          />
          <Heading level={4}>Register options</Heading>
          <p>
            Override validation timing per field with{' '}
            <code>form.register(name, options)</code>. This is useful when most
            fields validate on submit, but one field should validate sooner.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.registerOptions} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-form-api-actions"
            label="Programmatic form API"
            level={2}
          />
          <Heading level={4}>Programmatic form API</Heading>
          <p>
            Use <code>setValue</code>, <code>reset</code>, and{' '}
            <code>getValues</code> for preset actions and workflows that update
            fields without direct input typing.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.formApiActions} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-targeted-validation"
            label="Targeted validation"
            level={2}
          />
          <Heading level={4}>Targeted validation</Heading>
          <p>
            Trigger validation for one field with <code>validate(name)</code>{' '}
            and inspect the current field status with <code>field(name)</code>{' '}
            when building guided or staged form flows.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.targetedValidation} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-submit-lifecycle"
            label="Submit lifecycle"
            level={2}
          />
          <Heading level={4}>Submit lifecycle</Heading>
          <p>
            Use <code>handleSubmit(onValid, onInvalid)</code> to separate valid
            and invalid submit behavior, then drive UX with{' '}
            <code>formState.submitCount</code>, <code>isSubmitted</code>,{' '}
            <code>isValid</code>, and <code>errors</code>.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.submitLifecycle} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  return (
    <HookGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createHookBreadcrumbItems({
            hookHref: '/ui/hook/use-form',
            hookLabel: hook?.name ?? 'useForm',
          })}
        />
      }
      description={
        hook?.meta?.description ??
        'A small uncontrolled-first form hook with Field integration and optional controlled adapters.'
      }
      eyebrow={hook?.name ?? 'useForm'}
      intro={intro}
      optionsSection={{
        content: optionsContent,
        id: 'options',
        title: 'Options',
      }}
      returnsSection={{
        content: returnsContent,
        id: 'returns',
        title: 'Returns',
      }}
      quickStart={{
        content: (
          <QuickStartGuide
            componentImport={hook?.importString ?? formFallbackImport}
            importDescription="Import the hook (and Field-aware controls) directly from the UI package."
            useDescription={
              <>
                Use <code>useForm</code>'s return values to hook into your form,
                input and <code>Field</code> elements.
              </>
            }
            useExample={<ExampleViewer example={examples.basicUsage} />}
          />
        ),
        id: 'quick-start',
        title: 'Quick start',
      }}
      examples={{
        content: examplesContent,
        id: 'examples',
        title: 'Examples',
      }}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};
