import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UniMarket Waterloo',
    short_name: 'UniMarket',
    description: 'A private student marketplace for the University of Waterloo community.',
    start_url: '/',
    display: 'standalone',
    background_color: '#06080c',
    theme_color: '#080c13',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
