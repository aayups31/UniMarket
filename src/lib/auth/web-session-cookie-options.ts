import { WEB_SESSION_COOKIE_MAX_AGE_SECONDS } from './web-session';

export function getWebSessionCookieOptions(maxAge = WEB_SESSION_COOKIE_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };
}
