import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiReferenceProvider } from '@/apiReference';

import AppRoutes from './routes';

class ResizeObserverMock {
  disconnect() {}
  observe() {}
  unobserve() {}
}

class IntersectionObserverMock {
  disconnect() {}
  observe() {}
  unobserve() {}
}

function renderRoutes(path: string) {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

  return render(
    <ApiReferenceProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </ApiReferenceProvider>
  );
}

describe('AppRoutes', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the Status guide route', () => {
    renderRoutes('/ui/component/status');

    expect(screen.getByRole('heading', { name: 'Docs' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Implementation guidance, API details, and copy-paste examples for empty, error, and no-results states with Status.'
      )
    ).toBeInTheDocument();
  }, 15000);

  it('renders plugin placeholder route', () => {
    renderRoutes('/plugin');

    expect(
      screen.getByRole('heading', {
        name: 'Plugin',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Plugin info here')).toBeInTheDocument();
  });

  it('renders component customize placeholder routes', () => {
    renderRoutes('/ui/component/badge/customize');

    expect(
      screen.getByRole('heading', {
        name: 'Customize',
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('Badge customization guidance will live here.').length
    ).toBeGreaterThan(0);
  });

  it('renders hook placeholder for unknown hook ids', () => {
    renderRoutes('/ui/hook/non-existent-hook');

    expect(screen.getByRole('heading', { name: 'Docs' })).toBeInTheDocument();
    expect(
      screen.getByText('Hook guide content will live here.')
    ).toBeInTheDocument();
  });
});
