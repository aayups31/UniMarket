import { describe, expect, it } from 'vitest';

import {
  getWebSessionState,
  parseWebActivityTimestamp,
  WEB_SESSION_IDLE_TIMEOUT_MS,
  WEB_SESSION_POLICY_VERSION,
} from './web-session';

describe('web session inactivity policy', () => {
  const now = Date.UTC(2026, 6, 22, 16, 0, 0);

  it('allows one legacy bootstrap when the policy cookie is absent', () => {
    expect(getWebSessionState(undefined, undefined, now)).toBe('legacy');
  });

  it.each(['', 'v0', 'future-policy'])('fails closed for an unknown policy: %s', (policy) => {
    expect(getWebSessionState(policy, String(now), now)).toBe('expired');
  });

  it('keeps a recently active web session', () => {
    expect(getWebSessionState(WEB_SESSION_POLICY_VERSION, String(now - 60_000), now)).toBe(
      'active',
    );
  });

  it('expires a web session after three idle days', () => {
    expect(
      getWebSessionState(
        WEB_SESSION_POLICY_VERSION,
        String(now - WEB_SESSION_IDLE_TIMEOUT_MS),
        now,
      ),
    ).toBe('expired');
  });

  it.each([undefined, '', 'abc', '123', String(now + 120_000)])(
    'rejects an invalid protected activity timestamp: %s',
    (value) => {
      expect(getWebSessionState(WEB_SESSION_POLICY_VERSION, value, now)).toBe('expired');
    },
  );

  it('parses only millisecond timestamps', () => {
    expect(parseWebActivityTimestamp(String(now))).toBe(now);
    expect(parseWebActivityTimestamp('1721664000')).toBeNull();
  });
});
