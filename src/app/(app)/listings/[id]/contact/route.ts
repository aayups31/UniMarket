import { NextResponse } from 'next/server';

import { isWaterlooEmail } from '@/lib/auth/email';
import { createClient } from '@/lib/supabase/server';

type ContactRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: ContactRouteProps) {
  const { id } = await params;
  const fallback = new URL(`/listings/${id}?contact=unavailable`, request.url);

  if (!isUuid(id)) return NextResponse.redirect(fallback);

  const supabase = await createClient();
  const [{ data: email, error: contactError }, { data: listing, error: listingError }] =
    await Promise.all([
      supabase.rpc('get_listing_contact_email', { p_listing_id: id }),
      supabase
        .from('listings')
        .select('title,seller_id')
        .eq('id', id)
        .eq('status', 'published')
        .maybeSingle(),
    ]);

  if (listingError || !listing?.title) {
    return NextResponse.redirect(fallback);
  }

  let contactEmail = email;

  // Compatibility for a linked project that has not received migration 006
  // yet. It still resolves only the one explicitly requested seller and can be
  // removed after every environment is migrated.
  if (contactError && listing.seller_id) {
    const { data: claimsData } = await supabase.auth.getClaims();
    const viewerId = typeof claimsData?.claims?.sub === 'string' ? claimsData.claims.sub : null;

    if (!viewerId) return NextResponse.redirect(fallback);

    const { data: viewerProfile } = await supabase
      .from('profiles')
      .select('role,email,email_verified,onboarding_completed_at')
      .eq('id', viewerId)
      .maybeSingle();

    const isEligibleStudent =
      viewerProfile?.role === 'student' &&
      viewerProfile.email_verified &&
      Boolean(viewerProfile.onboarding_completed_at) &&
      isWaterlooEmail(viewerProfile.email);

    if (!isEligibleStudent) return NextResponse.redirect(fallback);

    const legacyResult = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('id', listing.seller_id)
      .maybeSingle();
    const legacySeller = legacyResult.data as { email?: string } | null;
    contactEmail = legacySeller?.email ?? null;
  }

  if (!contactEmail) return NextResponse.redirect(fallback);

  const subject = encodeURIComponent(`UniMarket: ${listing.title}`);
  const body = encodeURIComponent(
    `Hi! I saw your “${listing.title}” listing on UniMarket. Is it still available?`,
  );

  return new NextResponse(null, {
    status: 302,
    headers: { Location: `mailto:${contactEmail}?subject=${subject}&body=${body}` },
  });
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
