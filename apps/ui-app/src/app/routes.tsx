import { Heading } from '@themeshift/ui/components/Heading';
import { Routes, Route } from 'react-router';
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
  description: React.ReactNode;
  title: React.ReactNode;
};

const ButtonSubpagePlaceholder = ({
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
          { href: '/components/button', label: 'Button' },
          { current: true, label: String(title) },
        ]}
      />
    }
    description={description}
    eyebrow="Button"
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
            <ButtonSubpagePlaceholder
              description="Button customization guidance will live here."
              title="Customize"
            />
          }
        />
        <Route
          path="playground"
          element={
            <ButtonSubpagePlaceholder
              description="An interactive Button playground will live here."
              title="Playground"
            />
          }
        />
      </Route>
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
