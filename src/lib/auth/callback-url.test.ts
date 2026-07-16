import { describe, expect, it } from 'vitest';

import { buildAuthCallbackUrl } from './callback-url';

describe('buildAuthCallbackUrl', () => {
  it('uses the request origin for local and preview deployments', () => {
    expect(buildAuthCallbackUrl({ requestOrigin: 'http://127.0.0.1:3000' })).toBe(
      'http://127.0.0.1:3000/auth/callback',
    );
  });

  it('prefers an explicitly configured site origin', () => {
    expect(
      buildAuthCallbackUrl({
        configuredOrigin: 'https://unimarket.example/path',
        requestOrigin: 'https://preview.example',
      }),
    ).toBe('https://unimarket.example/auth/callback');
  });

  it('builds the dedicated password recovery callback', () => {
    expect(
      buildAuthCallbackUrl({
        path: '/auth/recovery-callback',
        requestOrigin: 'https://unimarket.example',
      }),
    ).toBe('https://unimarket.example/auth/recovery-callback');
  });

  it('falls back safely when supplied origins are invalid', () => {
    expect(
      buildAuthCallbackUrl({
        configuredOrigin: 'javascript:alert(1)',
        requestOrigin: 'not a URL',
      }),
    ).toBe('http://localhost:3000/auth/callback');
  });
});
