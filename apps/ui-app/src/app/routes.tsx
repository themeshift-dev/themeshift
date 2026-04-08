import { Routes, Route } from 'react-router';
import { Heading } from '@themeshift/ui/components/Heading';

import { ComponentsPage } from '@/pages';

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

const AppRoutes = () => (
  <Routes>
    <Route index element={<Placeholder title="Home">Home page!</Placeholder>} />
    <Route path="/components" element={<ComponentsPage />} />
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
