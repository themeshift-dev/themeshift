import { ComponentDataContext } from './ComponentDataContext';
import { componentData } from './generated';

type ComponentDataProviderProps = {
  children: React.ReactNode;
};

export const ComponentDataProvider = ({
  children,
}: ComponentDataProviderProps) => (
  <ComponentDataContext.Provider value={{ components: componentData }}>
    {children}
  </ComponentDataContext.Provider>
);
