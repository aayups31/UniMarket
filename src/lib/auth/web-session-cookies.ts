import { cookies } from 'next/headers';

import {
  WEB_ACTIVITY_COOKIE,
  WEB_SESSION_POLICY_COOKIE,
  WEB_SESSION_POLICY_VERSION,
} from './web-session';
import { getWebSessionCookieOptions } from './web-session-cookie-options';

export async function markWebSessionActivity(now = Date.now()) {
  const cookieStore = await cookies();
  const options = getWebSessionCookieOptions();

  cookieStore.set(WEB_SESSION_POLICY_COOKIE, WEB_SESSION_POLICY_VERSION, options);
  cookieStore.set(WEB_ACTIVITY_COOKIE, String(now), options);
}

export async function clearWebSessionActivity() {
  const cookieStore = await cookies();
  const expiredOptions = getWebSessionCookieOptions(0);

  cookieStore.set(WEB_SESSION_POLICY_COOKIE, '', expiredOptions);
  cookieStore.set(WEB_ACTIVITY_COOKIE, '', expiredOptions);
}
