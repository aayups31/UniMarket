export const WEB_ACTIVITY_COOKIE = 'unimarket-web-activity';
export const WEB_SESSION_POLICY_COOKIE = 'unimarket-web-policy';
export const WEB_SESSION_POLICY_VERSION = 'v1';

export const WEB_SESSION_IDLE_TIMEOUT_MS = 3 * 24 * 60 * 60 * 1000;
export const WEB_SESSION_HEARTBEAT_MS = 5 * 60 * 1000;
export const WEB_SESSION_COOKIE_MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

const MAX_FUTURE_SKEW_MS = 60 * 1000;

export type WebSessionState = 'active' | 'expired' | 'legacy';

export function getWebSessionState(
  policyValue: string | undefined,
  activityValue: string | undefined,
  now = Date.now(),
): WebSessionState {
  if (policyValue === undefined) return 'legacy';
  if (policyValue !== WEB_SESSION_POLICY_VERSION) return 'expired';

  const lastActiveAt = parseWebActivityTimestamp(activityValue);
  if (lastActiveAt === null || lastActiveAt > now + MAX_FUTURE_SKEW_MS) return 'expired';

  return now - lastActiveAt >= WEB_SESSION_IDLE_TIMEOUT_MS ? 'expired' : 'active';
}

export function parseWebActivityTimestamp(value: string | undefined) {
  if (!value || !/^\d{13}$/.test(value)) return null;

  const timestamp = Number(value);
  return Number.isSafeInteger(timestamp) && timestamp > 0 ? timestamp : null;
}
