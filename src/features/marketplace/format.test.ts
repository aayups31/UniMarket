import { describe, expect, it } from 'vitest';

import {
  formatCondition,
  formatPostedDate,
  formatPostedTime,
  formatPrice,
  getInitials,
  getTorontoGreeting,
} from './format';

describe('marketplace display formatting', () => {
  it('formats stored cents as Canadian dollars', () => {
    expect(formatPrice(12_000)).toContain('120');
  });

  it('uses friendly condition labels', () => {
    expect(formatCondition('like_new')).toBe('Like new');
    expect(formatCondition(null)).toBeNull();
  });

  it('handles invalid timestamps without rendering a broken date', () => {
    expect(formatPostedDate('not-a-date')).toBeNull();
  });

  it('formats recent listing times compactly', () => {
    const now = new Date('2026-07-15T16:00:00.000Z');

    expect(formatPostedTime('2026-07-15T15:42:00.000Z', now)).toBe('18m ago');
    expect(formatPostedTime('2026-07-13T16:00:00.000Z', now)).toBe('2d ago');
  });

  it('uses the Waterloo local time for greetings', () => {
    expect(getTorontoGreeting(new Date('2026-07-15T13:00:00.000Z'))).toBe('Good morning');
    expect(getTorontoGreeting(new Date('2026-07-15T18:00:00.000Z'))).toBe('Good afternoon');
  });

  it('builds compact seller initials', () => {
    expect(getInitials('Avery Waterloo Student')).toBe('AW');
  });
});
