import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from './index';

const BasicTabs = () => (
  <Tabs>
    <Tabs.List aria-label="Sections">
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
    <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
    <Tabs.Panel value="settings">Settings panel</Tabs.Panel>
  </Tabs>
);

describe('Tabs', () => {
  it('exposes compound members', () => {
    expect(Tabs.List).toBeDefined();
    expect(Tabs.Trigger).toBeDefined();
    expect(Tabs.Panels).toBeDefined();
    expect(Tabs.Panel).toBeDefined();
    expect(Tabs.Indicator).toBeDefined();
  });

  it('selects first enabled trigger by default when no value is provided', () => {
    render(<BasicTabs />);

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });

  it('supports uncontrolled defaultValue', () => {
    render(
      <Tabs defaultValue="reports">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: 'Reports' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Reports panel');
  });

  it('supports controlled usage with onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs onValueChange={onValueChange} value="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    await user.click(screen.getByRole('tab', { name: 'Reports' }));

    expect(onValueChange).toHaveBeenCalledWith('reports');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });

  it('renders no active tab or panel for invalid controlled values', () => {
    render(
      <Tabs value="missing">
        <Tabs.List aria-label="Sections">
          <Tabs.Indicator data-testid="indicator" />
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    expect(screen.getByTestId('indicator')).toHaveAttribute(
      'data-state',
      'hidden'
    );
  });

  it('supports automatic activation with arrow keys', async () => {
    const user = userEvent.setup();

    render(<BasicTabs />);

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();

    await user.keyboard('[ArrowRight]');

    expect(screen.getByRole('tab', { name: 'Reports' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Reports' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Reports panel');
  });

  it('supports manual activation mode', async () => {
    const user = userEvent.setup();

    render(
      <Tabs activationMode="manual" defaultValue="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();

    await user.keyboard('[ArrowRight]');

    expect(screen.getByRole('tab', { name: 'Reports' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    await user.keyboard('[Enter]');

    expect(screen.getByRole('tab', { name: 'Reports' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('supports non-looping keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="reports" loop={false}>
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    const reports = screen.getByRole('tab', { name: 'Reports' });
    reports.focus();

    await user.keyboard('[ArrowRight]');

    expect(reports).toHaveFocus();
  });

  it('supports lazyMount, unmountOnExit, and forceMount panel overrides', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="overview" lazyMount unmountOnExit>
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
          <Tabs.Trigger value="history">History</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panels>
          <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
          <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
          <Tabs.Panel forceMount value="history">
            History panel
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );

    expect(screen.getByText('History panel')).toBeInTheDocument();
    expect(screen.queryByText('Reports panel')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Reports' }));

    expect(screen.getByText('Reports panel')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Overview' }));

    expect(screen.queryByText('Reports panel')).not.toBeInTheDocument();
  });

  it('supports polymorphic rendering and pass-through attributes', () => {
    render(
      <Tabs as="section" data-testid="tabs-root">
        <Tabs.List aria-label="Sections" as="nav" data-testid="tabs-list">
          <Tabs.Trigger
            as="a"
            className="custom-trigger"
            data-testid="tabs-trigger"
            href="#overview"
            value="overview"
          >
            Overview
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panels as="section" data-testid="tabs-panels">
          <Tabs.Panel as="article" data-testid="tabs-panel" value="overview">
            Overview panel
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );

    expect(screen.getByTestId('tabs-root')).toHaveProperty(
      'tagName',
      'SECTION'
    );
    expect(screen.getByTestId('tabs-list')).toHaveProperty('tagName', 'NAV');
    expect(screen.getByTestId('tabs-trigger')).toHaveProperty('tagName', 'A');
    expect(screen.getByTestId('tabs-trigger')).toHaveAttribute(
      'class',
      expect.stringContaining('custom-trigger')
    );
    expect(screen.getByTestId('tabs-panels')).toHaveProperty(
      'tagName',
      'SECTION'
    );
    expect(screen.getByTestId('tabs-panel')).toHaveProperty(
      'tagName',
      'ARTICLE'
    );
  });

  it('renders indicator with orientation and state data attributes', () => {
    render(
      <Tabs defaultValue="overview" orientation="vertical">
        <Tabs.List aria-label="Sections">
          <Tabs.Indicator data-testid="indicator" forceMount />
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    const indicator = screen.getByTestId('indicator');

    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    expect(indicator).toHaveAttribute('data-orientation', 'vertical');
    return waitFor(() => {
      expect(indicator).toHaveAttribute('data-state', 'visible');
    });
  });

  it('renders indicator in common usage without forceMount', async () => {
    render(
      <Tabs defaultValue="dashboard">
        <Tabs.List aria-label="Main sections">
          <Tabs.Indicator data-testid="indicator-default" />
          <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
          <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="dashboard">Dashboard content</Tabs.Panel>
        <Tabs.Panel value="teams">Teams content</Tabs.Panel>
        <Tabs.Panel value="reports">Reports content</Tabs.Panel>
      </Tabs>
    );

    await waitFor(() => {
      expect(screen.getByTestId('indicator-default')).toHaveAttribute(
        'data-state',
        'visible'
      );
    });
  });

  it('supports indicator size presets', async () => {
    render(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Indicator data-testid="indicator-medium" size="medium" />
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    await waitFor(() => {
      expect(screen.getByTestId('indicator-medium')).toHaveAttribute(
        'data-state',
        'visible'
      );
    });
    expect(screen.getByTestId('indicator-medium')).toHaveAttribute(
      'class',
      expect.stringContaining('indicatorSizeMedium')
    );
  });

  it('applies the fitted list class when fitted is enabled', () => {
    render(
      <Tabs fitted>
        <Tabs.List aria-label="Sections" data-testid="tabs-list">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    expect(screen.getByTestId('tabs-list')).toHaveAttribute(
      'class',
      expect.stringContaining('listFitted')
    );
  });

  it('does not render indicator when there is no selected value and forceMount is false', () => {
    render(
      <Tabs>
        <Tabs.List aria-label="Sections">
          <Tabs.Indicator data-testid="indicator-no-selection" />
          <Tabs.Trigger disabled value="overview">
            Overview
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
      </Tabs>
    );

    expect(
      screen.queryByTestId('indicator-no-selection')
    ).not.toBeInTheDocument();
  });

  it('uses trigger height to compute indicator size for vertical orientation', async () => {
    const getBoundingClientRectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function mockRect() {
        if (this.getAttribute('role') === 'tablist') {
          return {
            bottom: 280,
            height: 260,
            left: 20,
            right: 220,
            toJSON: () => ({}),
            top: 20,
            width: 200,
            x: 20,
            y: 20,
          } as DOMRect;
        }

        if (
          this.getAttribute('role') === 'tab' &&
          this.getAttribute('aria-selected') === 'true'
        ) {
          return {
            bottom: 150,
            height: 36,
            left: 30,
            right: 130,
            toJSON: () => ({}),
            top: 114,
            width: 100,
            x: 30,
            y: 114,
          } as DOMRect;
        }

        return {
          bottom: 0,
          height: 0,
          left: 0,
          right: 0,
          toJSON: () => ({}),
          top: 0,
          width: 0,
          x: 0,
          y: 0,
        } as DOMRect;
      });

    render(
      <Tabs defaultValue="overview" orientation="vertical">
        <Tabs.List aria-label="Sections">
          <Tabs.Indicator data-testid="indicator-vertical" forceMount />
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    await waitFor(() => {
      expect(screen.getByTestId('indicator-vertical')).toHaveStyle(
        '--tabs-indicator-size: 36px'
      );
    });

    getBoundingClientRectSpy.mockRestore();
  });

  it('ignores empty trigger values when clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs onValueChange={onValueChange}>
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="">Empty</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="">Empty panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    await user.click(screen.getByRole('tab', { name: 'Empty' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not activate a trigger when click default is prevented', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs defaultValue="overview" onValueChange={onValueChange}>
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger
            onClick={(event) => {
              event.preventDefault();
            }}
            value="reports"
          >
            Reports
          </Tabs.Trigger>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    await user.click(screen.getByRole('tab', { name: 'Reports' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('unregisters duplicate trigger values without crashing on unmount', () => {
    const { unmount } = render(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview primary</Tabs.Trigger>
          <Tabs.Trigger value="overview">Overview duplicate</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
      </Tabs>
    );

    expect(() => unmount()).not.toThrow();
  });

  it('supports medium inset and large indicator size presets', async () => {
    render(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Indicator
            data-testid="indicator-large-medium-inset"
            inset="medium"
            size="large"
          />
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('indicator-large-medium-inset')
      ).toHaveAttribute('data-state', 'visible');
    });

    expect(screen.getByTestId('indicator-large-medium-inset')).toHaveAttribute(
      'class',
      expect.stringContaining('indicatorInsetMedium')
    );
    expect(screen.getByTestId('indicator-large-medium-inset')).toHaveAttribute(
      'class',
      expect.stringContaining('indicatorSizeLarge')
    );
  });

  it('has no accessibility violations for representative usage', async () => {
    const ControlledTabs = () => {
      const [value, setValue] = useState('overview');

      return (
        <Tabs onValueChange={setValue} value={value}>
          <Tabs.List aria-label="Main sections">
            <Tabs.Indicator />
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
            <Tabs.Trigger disabled value="settings">
              Settings
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Panels>
            <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
            <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
            <Tabs.Panel value="settings">Settings panel</Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      );
    };

    const { container } = render(<ControlledTabs />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
