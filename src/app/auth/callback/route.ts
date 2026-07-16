import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { isAllowedAuthEmail, normalizeEmail } from '@/lib/auth/email';
import { getSafeNextPath } from '@/lib/auth/navigation';
import { AUTH_NEXT_COOKIE } from '@/lib/auth/pending-sign-in';
import { createClient } from '@/lib/supabase/server';

function loginPath(params: Record<string, string>, next: string) {
  const search = new URLSearchParams(params);
  if (next !== '/marketplace') search.set('next', next);
  return `/login?${search.toString()}`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const cookieStore = await cookies();
  const next = getSafeNextPath(cookieStore.get(AUTH_NEXT_COOKIE)?.value);

  cookieStore.delete(AUTH_NEXT_COOKIE);

  if (!code) redirect(loginPath({ error: 'invalid-link' }, next));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) redirect(loginPath({ error: 'invalid-link' }, next));

  const email = normalizeEmail(data.user.email ?? '');

  if (!data.user.email_confirmed_at || !isAllowedAuthEmail(email)) {
    await supabase.auth.signOut({ scope: 'local' });
    redirect(loginPath({ error: 'ineligible-account' }, next));
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email_verified')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !profile?.email_verified) {
    await supabase.auth.signOut({ scope: 'local' });
    redirect(loginPath({ error: 'profile-unavailable' }, next));
  }

  // The confirmation link creates a temporary PKCE session. End it so future
  // access always uses the password the student selected during signup.
  await supabase.auth.signOut({ scope: 'local' });
  redirect(loginPath({ notice: 'email-verified' }, next));
}
