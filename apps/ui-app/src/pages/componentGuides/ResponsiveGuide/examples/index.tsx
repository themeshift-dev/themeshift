import { Responsive } from '@themeshift/ui/components/Responsive';

export const basicUsage = {
  code: `<Responsive when={{ below: 'tablet' }}>
  Mobile only content
</Responsive>`,
  label: 'Basic usage',
  sample: (
    <Responsive when={{ below: 'tablet' }}>
      <div>Mobile only content</div>
    </Responsive>
  ),
};

export const tabletAndUp = {
  code: `<Responsive when={{ from: 'tablet' }}>
  Tablet and desktop content
</Responsive>`,
  label: 'Tablet and up',
  sample: (
    <Responsive when={{ from: 'tablet' }}>
      <div>Tablet and desktop content</div>
    </Responsive>
  ),
};

export const ranges = {
  code: `<Responsive when={{ to: 'tablet' }}>Up to tablet</Responsive>
<Responsive when={{ from: 'tablet', to: 'desktop' }}>
  Tablet through desktop
</Responsive>
<Responsive when={{ above: 'tablet' }}>Above tablet</Responsive>`,
  label: 'Breakpoint ranges',
  sample: (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Responsive when={{ to: 'tablet' }}>
        <div>Up to tablet</div>
      </Responsive>

      <Responsive when={{ from: 'tablet', to: 'desktop' }}>
        <div>Tablet through desktop</div>
      </Responsive>

      <Responsive when={{ above: 'tablet' }}>
        <div>Above tablet</div>
      </Responsive>
    </div>
  ),
};

export const asElement = {
  code: `<Responsive as="section" when={{ from: 'desktop' }}>
  <h3>Desktop panel</h3>
</Responsive>`,
  label: 'Polymorphic as',
  sample: (
    <Responsive as="section" when={{ from: 'desktop' }}>
      <h3>Desktop panel</h3>
    </Responsive>
  ),
};

export const propHighlights = [basicUsage, tabletAndUp, ranges];
