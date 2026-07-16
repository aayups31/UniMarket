import { redirect } from 'next/navigation';

import { isAllowedAuthEmail, normalizeEmail } from '@/lib/auth/email';
import { createClient } from '@/lib/supabase/server';

function recoveryErrorPath(error: string) {
  return `/forgot-password?error=${encodeURIComponent(error)}`;
}

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code');
  if (!code) redirect(recoveryErrorPath('invalid-link'));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) redirect(recoveryErrorPath('invalid-link'));

  const redirectType = (data as typeof data & { redirectType?: string | null }).redirectType;
  const email = normalizeEmail(data.user.email ?? '');

  if (redirectType !== 'recovery' || !data.user.email_confirmed_at || !isAllowedAuthEmail(email)) {
    await supabase.auth.signOut({ scope: 'local' });
    redirect(recoveryErrorPath('invalid-link'));
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email_verified')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !profile?.email_verified) {
    await supabase.auth.signOut({ scope: 'local' });
    redirect(recoveryErrorPath('invalid-link'));
  }

  redirect('/update-password');
}
