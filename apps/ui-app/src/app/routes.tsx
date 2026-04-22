import { Heading } from '@themeshift/ui/components/Heading';
import { Navigate, Route, Routes, useParams } from 'react-router';

import { useApiReference } from '@/apiReference';
import {
  ApiReference,
  Breadcrumb,
  Link,
  TableOfContents,
} from '@/app/components';
import { ComponentsPage, DocsHome, Landing } from '@/pages';
import * as ComponentGuides from '@/pages/componentGuides';
import * as HookGuides from '@/pages/hookGuides';
import {
  createComponentBreadcrumbItems,
  createHookBreadcrumbItems,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';
import { HookGuide } from '@/templates/HookGuide';

type PlaceholderProps = {
  title: React.ReactNode;
  children?: React.ReactNode;
};

const Placeholder = ({ children, title }: PlaceholderProps) => (
  <div>
    <Heading>{title}</Heading>
    <p>{children}</p>
  </div>
);

type ComponentPlaceholderProps = {
  componentName: string;
  componentPath: string;
  description: React.ReactNode;
  title: string;
};

const ComponentSubpagePlaceholder = ({
  componentName,
  componentPath,
  description,
  title,
}: ComponentPlaceholderProps) => (
  <ComponentGuide
    breadcrumb={
      <Breadcrumb
        showHome
        items={createComponentBreadcrumbItems({
          componentHref: componentPath,
          componentLabel: componentName,
          currentLabel: title,
        })}
      />
    }
    description={description}
    eyebrow={componentName}
    title={title}
  >
    <p>{description}</p>
  </ComponentGuide>
);

const HookPlaceholder = () => {
  const { hookId } = useParams();
  const { hook } = useApiReference({ hook: hookId });

  return (
    <HookGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createHookBreadcrumbItems({
            hookHref: `/ui/hook/${hook?.routeSlug ?? hookId ?? ''}`,
            hookLabel: hook?.name ?? hookId ?? 'Hook',
          })}
        />
      }
      description={
        <>
          {hook?.meta?.description ?? 'Hook guide content will live here.'}{' '}
          {hook?.sourceCodeUrl && (
            <Link to={hook.sourceCodeUrl}>View source</Link>
          )}
        </>
      }
      eyebrow={hook?.name ?? hookId ?? 'Hook'}
      optionsSection={{
        content: (
          <ApiReference
            emptyState={<p>No options documented yet.</p>}
            items={hook?.apiReference ?? []}
            nameColumnLabel="Option name"
          />
        ),
        id: 'options',
        title: 'Options',
      }}
      returnsSection={{
        content: (
          <ApiReference
            emptyState={<p>No return values documented yet.</p>}
            hideColumns={['defaultValue']}
            items={hook?.returnReference ?? []}
            nameColumnLabel="Return value"
          />
        ),
        id: 'returns',
        title: 'Returns',
      }}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};

const AppRoutes = () => (
  <Routes>
    <Route index element={<Landing />} />
    <Route path="/docs" element={<DocsHome />} />

    <Route path="/ui">
      <Route index element={<ComponentsPage />} />
      <Route path="hook">
        <Route
          path="use-copy-to-clipboard"
          element={<HookGuides.UseCopyToClipboardGuide />}
        />
        <Route
          path="use-hold-to-confirm"
          element={<HookGuides.UseHoldToConfirmGuide />}
        />
        <Route path="use-form" element={<HookGuides.UseFormGuide />} />
        <Route
          path="use-resize-observer"
          element={<HookGuides.UseResizeObserverGuide />}
        />
        <Route path=":hookId" element={<HookPlaceholder />} />
      </Route>

      <Route path="/ui/component">
        <Route path="badge">
          <Route index element={<ComponentGuides.BadgeGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Badge"
                componentPath="/ui/component/badge"
                description="Badge customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Badge"
                componentPath="/ui/component/badge"
                description="An interactive Badge playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="button">
          <Route index element={<ComponentGuides.ButtonGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Button"
                componentPath="/ui/component/button"
                description="Button customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Button"
                componentPath="/ui/component/button"
                description="An interactive Button playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="copy-button">
          <Route index element={<ComponentGuides.CopyButtonGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="CopyButton"
                componentPath="/ui/component/copy-button"
                description="CopyButton customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="CopyButton"
                componentPath="/ui/component/copy-button"
                description="An interactive CopyButton playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="safety-button">
          <Route index element={<ComponentGuides.SafetyButtonGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="SafetyButton"
                componentPath="/ui/component/safety-button"
                description="SafetyButton customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="SafetyButton"
                componentPath="/ui/component/safety-button"
                description="An interactive SafetyButton playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="card">
          <Route index element={<ComponentGuides.CardGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Card"
                componentPath="/ui/component/card"
                description="Card customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Card"
                componentPath="/ui/component/card"
                description="An interactive Card playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="checkbox">
          <Route index element={<ComponentGuides.CheckboxGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Checkbox"
                componentPath="/ui/component/checkbox"
                description="Checkbox customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Checkbox"
                componentPath="/ui/component/checkbox"
                description="An interactive Checkbox playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="radio">
          <Route index element={<ComponentGuides.RadiosGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Radio"
                componentPath="/ui/component/radio"
                description="Radio customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Radio"
                componentPath="/ui/component/radio"
                description="An interactive Radio playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="error-message">
          <Route index element={<ComponentGuides.ErrorMessageGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="ErrorMessage"
                componentPath="/ui/component/error-message"
                description="ErrorMessage customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="ErrorMessage"
                componentPath="/ui/component/error-message"
                description="An interactive ErrorMessage playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="field">
          <Route index element={<ComponentGuides.FieldGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Field"
                componentPath="/ui/component/field"
                description="Field customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Field"
                componentPath="/ui/component/field"
                description="An interactive Field playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="heading">
          <Route index element={<ComponentGuides.HeadingGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Heading"
                componentPath="/ui/component/heading"
                description="Heading customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Heading"
                componentPath="/ui/component/heading"
                description="An interactive Heading playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="input">
          <Route index element={<ComponentGuides.InputGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Input"
                componentPath="/ui/component/input"
                description="Input customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Input"
                componentPath="/ui/component/input"
                description="An interactive Input playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="label">
          <Route index element={<ComponentGuides.LabelGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Label"
                componentPath="/ui/component/label"
                description="Label customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Label"
                componentPath="/ui/component/label"
                description="An interactive Label playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="link">
          <Route index element={<ComponentGuides.LinkGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Link"
                componentPath="/ui/component/link"
                description="Link customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Link"
                componentPath="/ui/component/link"
                description="An interactive Link playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="navbar">
          <Route index element={<ComponentGuides.NavbarGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Navbar"
                componentPath="/ui/component/navbar"
                description="Navbar customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Navbar"
                componentPath="/ui/component/navbar"
                description="An interactive Navbar playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="progress-bar">
          <Route index element={<ComponentGuides.ProgressBarGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="ProgressBar"
                componentPath="/ui/component/progress-bar"
                description="ProgressBar customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="ProgressBar"
                componentPath="/ui/component/progress-bar"
                description="An interactive ProgressBar playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="responsive">
          <Route index element={<ComponentGuides.ResponsiveGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Responsive"
                componentPath="/ui/component/responsive"
                description="Responsive customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Responsive"
                componentPath="/ui/component/responsive"
                description="An interactive Responsive playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="select">
          <Route index element={<ComponentGuides.SelectGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Select"
                componentPath="/ui/component/select"
                description="Select customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Select"
                componentPath="/ui/component/select"
                description="An interactive Select playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="skeleton">
          <Route index element={<ComponentGuides.SkeletonGuide />} />
        </Route>

        <Route path="skip-link">
          <Route index element={<ComponentGuides.SkipLinkGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="SkipLink"
                componentPath="/ui/component/skip-link"
                description="SkipLink customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="SkipLink"
                componentPath="/ui/component/skip-link"
                description="An interactive SkipLink playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="spinner">
          <Route index element={<ComponentGuides.SpinnerGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Spinner"
                componentPath="/ui/component/spinner"
                description="Spinner customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Spinner"
                componentPath="/ui/component/spinner"
                description="An interactive Spinner playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="tabs">
          <Route index element={<ComponentGuides.TabsGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Tabs"
                componentPath="/ui/component/tabs"
                description="Tabs customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Tabs"
                componentPath="/ui/component/tabs"
                description="An interactive Tabs playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="textarea">
          <Route index element={<ComponentGuides.TextareaGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="Textarea"
                componentPath="/ui/component/textarea"
                description="Textarea customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="Textarea"
                componentPath="/ui/component/textarea"
                description="An interactive Textarea playground will live here."
                title="Playground"
              />
            }
          />
        </Route>

        <Route path="toggle-switch">
          <Route index element={<ComponentGuides.ToggleSwitchGuide />} />
          <Route
            path="customize"
            element={
              <ComponentSubpagePlaceholder
                componentName="ToggleSwitch"
                componentPath="/ui/component/toggle-switch"
                description="ToggleSwitch customization guidance will live here."
                title="Customize"
              />
            }
          />
          <Route
            path="playground"
            element={
              <ComponentSubpagePlaceholder
                componentName="ToggleSwitch"
                componentPath="/ui/component/toggle-switch"
                description="An interactive ToggleSwitch playground will live here."
                title="Playground"
              />
            }
          />
        </Route>
        <Route
          path="toggleswitch"
          element={<Navigate replace to="/ui/component/toggle-switch" />}
        />
      </Route>
    </Route>

    <Route
      path="/plugin"
      element={<Placeholder title="Plugin">Plugin info here</Placeholder>}
    />

    <Route
      path="/design-tokens"
      element={<Placeholder title="Tokens">Tokens page here</Placeholder>}
    />
  </Routes>
);

export default AppRoutes;
