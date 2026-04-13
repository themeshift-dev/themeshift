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
