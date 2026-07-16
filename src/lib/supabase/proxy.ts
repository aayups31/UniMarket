import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import type { Database } from './database.types';
import { getPublicSupabaseConfig } from './env';

const AUTH_ROUTES = new Set(['/forgot-password', '/login', '/signup', '/verify']);
const PROTECTED_ROUTE_PREFIXES = [
  '/marketplace',
  '/listings',
  '/my-listings',
  '/moderation',
  '/onboarding',
];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function copyCookies(source: NextResponse, destination: NextResponse) {
  source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
  return destination;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { publishableKey, url } = getPublicSupabaseConfig();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, options, value }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getClaims verifies the JWT signature. Never use getSession here for an
  // authorization decision because cookie-backed session data can be spoofed.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const { pathname, search } = request.nextUrl;

  if (!claims && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return copyCookies(response, NextResponse.redirect(loginUrl));
  }

  if (claims && AUTH_ROUTES.has(pathname)) {
    const onboardingUrl = request.nextUrl.clone();
    onboardingUrl.pathname = '/onboarding';
    onboardingUrl.search = '';

    const requestedNext = request.nextUrl.searchParams.get('next');
    if (requestedNext) onboardingUrl.searchParams.set('next', requestedNext);

    return copyCookies(response, NextResponse.redirect(onboardingUrl));
  }

  return response;
}
