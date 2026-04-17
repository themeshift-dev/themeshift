import '@fontsource-variable/sometype-mono/index.css';
import '@themeshift/ui/css/fonts.css';
import { ThemeProvider } from '@themeshift/ui/contexts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from '@/app';
import { ApiReferenceProvider } from '@/apiReference';
import '@/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ApiReferenceProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApiReferenceProvider>
    </ThemeProvider>
  </StrictMode>
);
