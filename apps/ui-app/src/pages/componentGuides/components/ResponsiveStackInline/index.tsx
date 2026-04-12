import { type Breakpoint } from '@themeshift/ui/components/Responsive';
import { useEffect, useState, type ReactNode } from 'react';

import {
  Inline,
  type InlineProps,
  Stack,
  type StackProps,
} from '@/app/components';

const breakpointQueries = {
  desktop: '(min-width: 1024px)',
  mobile: '(min-width: 0px)',
  tablet: '(min-width: 768px)',
} satisfies Record<Breakpoint, string>;

type LayoutBreakpoint = Breakpoint | `(${string})`;

export type ResponsiveStackInlineProps = {
  children?: ReactNode;
  from?: LayoutBreakpoint;
  inlineProps?: Omit<InlineProps, 'children'>;
  stackProps?: Omit<StackProps, 'children'>;
};

const getQuery = (from: LayoutBreakpoint) =>
  from in breakpointQueries ? breakpointQueries[from as Breakpoint] : from;

const getMatches = (query: string) =>
  typeof window !== 'undefined' && window.matchMedia(query).matches;

export const ResponsiveStackInline = ({
  children,
  from = 'tablet',
  inlineProps,
  stackProps,
}: ResponsiveStackInlineProps) => {
  const query = getQuery(from);
  const [isInline, setIsInline] = useState(() => getMatches(query));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setIsInline(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener('change', updateMatches);

    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return isInline ? (
    <Inline {...inlineProps}>{children}</Inline>
  ) : (
    <Stack {...stackProps}>{children}</Stack>
  );
};
