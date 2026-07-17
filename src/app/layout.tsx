import type { Metadata, Viewport } from 'next';
import { Barlow, Source_Serif_4 } from 'next/font/google';

import { waterlooTheme } from '@/lib/university-theme';

import './globals.css';

const barlow = Barlow({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['400', '500', '600', '700', '900'],
});

const sourceSerif = Source_Serif_4({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: '400',
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
  themeColor: waterlooTheme.colors.ink,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-university={waterlooTheme.id} lang="en">
      <body className={`${barlow.variable} ${sourceSerif.variable}`}>{children}</body>
    </html>
  );
}
