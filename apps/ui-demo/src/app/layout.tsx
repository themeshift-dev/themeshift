import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@themeshift/ui/css/base.css';
import '../css/tokens.css';

export const metadata: Metadata = {
  description: 'Live ThemeShift UI demos for developers.',
  title: 'ThemeShift UI Demo',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
