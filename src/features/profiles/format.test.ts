import { describe, expect, it } from 'vitest';

import { formatProfileJoinedDate, getProfileInitials, getProfileStudyLine } from './format';

describe('profile presentation helpers', () => {
  it('formats a stable Waterloo member date', () => {
    expect(formatProfileJoinedDate('2025-09-15T12:00:00.000Z')).toBe('September 2025');
  });

  it('falls back safely when a date is invalid', () => {
    expect(formatProfileJoinedDate('not-a-date')).toBe('Recently');
  });

  it('builds compact initials and a study line', () => {
    expect(getProfileInitials('Avery Marie Chen')).toBe('AM');
    expect(getProfileStudyLine('Computer Science', '3B')).toBe('Computer Science · 3B');
    expect(getProfileStudyLine(null, null)).toBe('University of Waterloo');
  });
});
