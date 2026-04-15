import { Heading } from '@themeshift/ui/components/Heading';
import { Navigate, Route, Routes } from 'react-router';
import { IoHomeSharp } from 'react-icons/io5';

import { Breadcrumb } from '@/app/components';
import { ComponentsPage } from '@/pages';
import * as ComponentGuides from '@/pages/componentGuides';
import { ComponentGuide } from '@/templates/ComponentGuide';

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
  title: React.ReactNode;
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
        items={[
          {
            ariaLabel: 'Home',
            href: '/',
            icon: <IoHomeSharp />,
          },
          { href: '/components', label: 'Components' },
          { href: componentPath, label: componentName },
          { current: true, label: String(title) },
        ]}
      />
    }
    description={description}
    eyebrow={componentName}
    title={title}
  >
    <p>{description}</p>
  </ComponentGuide>
);

const AppRoutes = () => (
  <Routes>
    <Route index element={<Placeholder title="Home">Home page!</Placeholder>} />

    <Route path="/components">
      <Route index element={<ComponentsPage />} />
      <Route path="button">
        <Route index element={<ComponentGuides.ButtonGuide />} />
        <Route
          path="customize"
          element={
            <ComponentSubpagePlaceholder
              componentName="Button"
              componentPath="/components/button"
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
              componentPath="/components/button"
              description="An interactive Button playground will live here."
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
              componentPath="/components/checkbox"
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
              componentPath="/components/checkbox"
              description="An interactive Checkbox playground will live here."
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
              componentPath="/components/error-message"
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
              componentPath="/components/error-message"
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
              componentPath="/components/field"
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
              componentPath="/components/field"
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
              componentPath="/components/heading"
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
              componentPath="/components/heading"
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
              componentPath="/components/input"
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
              componentPath="/components/input"
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
              componentPath="/components/label"
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
              componentPath="/components/label"
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
              componentPath="/components/link"
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
              componentPath="/components/link"
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
              componentPath="/components/navbar"
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
              componentPath="/components/navbar"
              description="An interactive Navbar playground will live here."
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
              componentPath="/components/responsive"
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
              componentPath="/components/responsive"
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
              componentPath="/components/select"
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
              componentPath="/components/select"
              description="An interactive Select playground will live here."
              title="Playground"
            />
          }
        />
      </Route>
      <Route path="skip-link">
        <Route index element={<ComponentGuides.SkipLinkGuide />} />
        <Route
          path="customize"
          element={
            <ComponentSubpagePlaceholder
              componentName="SkipLink"
              componentPath="/components/skip-link"
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
              componentPath="/components/skip-link"
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
              componentPath="/components/spinner"
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
              componentPath="/components/spinner"
              description="An interactive Spinner playground will live here."
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
              componentPath="/components/textarea"
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
              componentPath="/components/textarea"
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
              componentPath="/components/toggle-switch"
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
              componentPath="/components/toggle-switch"
              description="An interactive ToggleSwitch playground will live here."
              title="Playground"
            />
          }
        />
      </Route>
      <Route
        path="toggleswitch"
        element={<Navigate replace to="/components/toggle-switch" />}
      />
    </Route>

    <Route
      path="/plugin"
      element={<Placeholder title="Plugin">Plugin info here</Placeholder>}
    />
    <Route
      path="/tokens"
      element={<Placeholder title="Tokens">Tokens page here</Placeholder>}
    />
  </Routes>
);

export default AppRoutes;
