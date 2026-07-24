import { describe, expect, it } from 'vitest';

import { isAllowedAuthEmail, isWaterlooEmail, normalizeEmail } from './email';

describe('Waterloo email validation', () => {
  it.each(['student@uwaterloo.ca', 'STUDENT@UWATERLOO.CA', 'first.last+market@UWaterloo.Ca'])(
    'accepts the exact Waterloo domain: %s',
    (email) => {
      expect(isWaterlooEmail(email)).toBe(true);
    },
  );

  it.each([
    'student@edu.uwaterloo.ca',
    'student@uwaterloo.ca.example.com',
    'student@notuwaterloo.ca',
    'student@gmail.com',
    'student@other@uwaterloo.ca',
    'student name@uwaterloo.ca',
    '@uwaterloo.ca',
  ])('rejects any other domain: %s', (email) => {
    expect(isWaterlooEmail(email)).toBe(false);
  });

  it('normalizes whitespace and letter case', () => {
    expect(normalizeEmail('  STUDENT@UWATERLOO.CA ')).toBe('student@uwaterloo.ca');
  });

  it('allows only the exact Waterloo domain for authentication', () => {
    expect(isAllowedAuthEmail('student@uwaterloo.ca')).toBe(true);
    expect(isAllowedAuthEmail('aayupsuw@gmail.com')).toBe(false);
    expect(isAllowedAuthEmail('another@gmail.com')).toBe(false);
  });
});
