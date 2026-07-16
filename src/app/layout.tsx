import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Geist } from 'next/font/google';

import { waterlooTheme } from '@/lib/university-theme';

import './globals.css';

const geist = Geist({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-geist',
});

const barlowCondensed = Barlow_Condensed({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'UniMarket — Marketplace for Waterloo',
    template: '%s · UniMarket',
  },
  description: 'Buy and sell with verified University of Waterloo students.',
  applicationName: 'UniMarket',
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: waterlooTheme.colors.canvas,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-university={waterlooTheme.id} lang="en">
      <body className={`${geist.variable} ${barlowCondensed.variable}`}>{children}</body>
    </html>
  );
}
