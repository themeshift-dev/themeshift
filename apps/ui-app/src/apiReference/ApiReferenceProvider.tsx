import { ApiReferenceContext } from './ApiReferenceContext';
import { components } from './generated/components';
import { hooks } from './generated/hooks';

type ApiReferenceProviderProps = {
  children: React.ReactNode;
};

export const ApiReferenceProvider = ({
  children,
}: ApiReferenceProviderProps) => (
  <ApiReferenceContext.Provider value={{ components, hooks }}>
    {children}
  </ApiReferenceContext.Provider>
);
