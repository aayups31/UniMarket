'use server';

import { redirect } from 'next/navigation';

import { getSafeNextPath } from '@/lib/auth/navigation';
import { getCurrentIdentity } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';

import { onboardingSchema, type OnboardingInput } from './schemas';

export type OnboardingActionResult = { ok: true } | { ok: false; message: string };

export async function completeOnboardingAction(
  input: OnboardingInput,
): Promise<OnboardingActionResult> {
  const parsed = onboardingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Check your details and try again.',
    };
  }

  const identity = await getCurrentIdentity();
  if (!identity) redirect('/login');

  const supabase = await createClient();
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', identity.id)
    .single();

  if (profileError || !profile) {
    return {
      ok: false,
      message: "We couldn't load your account. Sign out and try again.",
    };
  }

  if (profile.role !== 'student') {
    redirect('/marketplace');
  }

  const { error } = await supabase.rpc('complete_onboarding', {
    p_academic_year: parsed.data.academicYear,
    p_full_name: parsed.data.fullName,
    p_program: parsed.data.program,
    p_residence_area: parsed.data.residenceArea || null,
  });

  if (error) {
    return {
      ok: false,
      message: "We couldn't save your profile. Please try again.",
    };
  }

  redirect(getSafeNextPath(parsed.data.next));
}
