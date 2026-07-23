import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { getSafeNextPath } from '@/lib/auth/navigation';
import {
  getWebSessionState,
  WEB_ACTIVITY_COOKIE,
  WEB_SESSION_POLICY_COOKIE,
  WEB_SESSION_POLICY_VERSION,
} from '@/lib/auth/web-session';
import { getWebSessionCookieOptions } from '@/lib/auth/web-session-cookie-options';

import { SUPABASE_COOKIE_OPTIONS } from './cookie-options';
import type { Database } from './database.types';
import { getPublicSupabaseConfig } from './env';

const AUTH_ROUTES = new Set(['/forgot-password', '/login', '/signup', '/verify']);
const PROTECTED_ROUTE_PREFIXES = [
  '/marketplace',
  '/listings',
  '/my-listings',
  '/moderation',
  '/onboarding',
  '/messages',
  '/profile',
];

const PROTECTED_API_ROUTE_PREFIXES = ['/api/messages', '/api/auth/activity'];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isProtectedApiRoute(pathname: string) {
  return PROTECTED_API_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function copyCookies(source: NextResponse, destination: NextResponse) {
  source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
  for (const header of ['cache-control', 'expires', 'pragma']) {
    const value = source.headers.get(header);
    if (value) destination.headers.set(header, value);
  }
  return destination;
}

function setWebSessionActivity(response: NextResponse, now = Date.now()) {
  const options = getWebSessionCookieOptions();
  response.cookies.set(WEB_SESSION_POLICY_COOKIE, WEB_SESSION_POLICY_VERSION, options);
  response.cookies.set(WEB_ACTIVITY_COOKIE, String(now), options);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { publishableKey, url } = getPublicSupabaseConfig();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookieOptions: SUPABASE_COOKIE_OPTIONS,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headersToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, options, value }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headersToSet).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  // getClaims verifies the JWT signature. Never use getSession here for an
  // authorization decision because cookie-backed session data can be spoofed.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const { pathname, search } = request.nextUrl;
  const protectedApiRoute = isProtectedApiRoute(pathname);

  if (!claims && protectedApiRoute) {
    return copyCookies(
      response,
      NextResponse.json(
        { error: 'Authentication is required.' },
        { headers: { 'Cache-Control': 'private, no-store' }, status: 401 },
      ),
    );
  }

  if (!claims && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return copyCookies(response, NextResponse.redirect(loginUrl));
  }

  if (claims && (isProtectedRoute(pathname) || protectedApiRoute || AUTH_ROUTES.has(pathname))) {
    const webSessionState = getWebSessionState(
      request.cookies.get(WEB_SESSION_POLICY_COOKIE)?.value,
      request.cookies.get(WEB_ACTIVITY_COOKIE)?.value,
    );

    if (webSessionState === 'expired') {
      await supabase.auth.signOut({ scope: 'local' });
      const expiredCookieOptions = getWebSessionCookieOptions(0);
      response.cookies.set(WEB_SESSION_POLICY_COOKIE, '', expiredCookieOptions);
      response.cookies.set(WEB_ACTIVITY_COOKIE, '', expiredCookieOptions);

      if (protectedApiRoute) {
        return copyCookies(
          response,
          NextResponse.json(
            { error: 'Your web session expired after three days of inactivity.' },
            { headers: { 'Cache-Control': 'private, no-store' }, status: 401 },
          ),
        );
      }

      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.search = '';
      loginUrl.searchParams.set('error', 'session-expired');
      if (isProtectedRoute(pathname)) {
        loginUrl.searchParams.set('next', getSafeNextPath(`${pathname}${search}`));
      }
      return copyCookies(response, NextResponse.redirect(loginUrl));
    }

    if (webSessionState === 'legacy' && (isProtectedRoute(pathname) || AUTH_ROUTES.has(pathname))) {
      setWebSessionActivity(response);
    }
  }

  if (claims && AUTH_ROUTES.has(pathname)) {
    const destination = new URL(
      getSafeNextPath(request.nextUrl.searchParams.get('next')),
      request.nextUrl,
    );
    return copyCookies(response, NextResponse.redirect(destination));
  }

  return response;
}
