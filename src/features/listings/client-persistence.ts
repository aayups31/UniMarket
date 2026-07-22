import { createClient } from '@/lib/supabase/client';

import { listingDraftSchema, listingPublishSchema, type ListingDraftInput } from './schemas';
import { publishErrorMessage } from './publish-error-message';

type SavedDraft = { id: string; version: number };

export type ClientListingResult<T> =
  { ok: true; data: T } | { ok: false; message: string; fieldErrors?: Record<string, string> };

type DatabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  return Object.fromEntries(
    issues.flatMap((issue) => {
      const key = issue.path[0];
      return typeof key === 'string' ? [[key, issue.message]] : [];
    }),
  );
}

function writeFailure(error?: DatabaseError) {
  if (error?.code === '42501' || error?.code === 'PGRST301') {
    return 'Your seller session could not be verified. Refresh the page, sign in again, and retry.';
  }

  return 'Your draft could not be saved. Check your connection and try again.';
}

/**
 * Authenticated RPC fallback for a failed Next Server Action request. The
 * browser carries the same Supabase session, while the database workflow
 * validates seller ownership and completed Waterloo onboarding.
 */
export async function saveListingDraftInBrowser(
  input: ListingDraftInput,
): Promise<ClientListingResult<SavedDraft>> {
  const parsed = listingDraftSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Check the highlighted listing details and try again.',
      fieldErrors: toFieldErrors(parsed.error.issues),
    };
  }

  const supabase = createClient();
  const { data: claimData, error: claimsError } = await supabase.auth.getClaims();
  const userId = typeof claimData?.claims?.sub === 'string' ? claimData.claims.sub : undefined;

  if (claimsError || !userId) {
    return {
      ok: false,
      message: 'Your session expired. Refresh the page and sign in again before saving.',
    };
  }

  const { data, error } = await supabase.rpc('save_listing_draft', {
    p_listing_id: parsed.data.listingId ?? null,
    p_title: parsed.data.title,
    p_description: parsed.data.description,
    p_price_cents: parsed.data.priceCents,
    p_category_id: parsed.data.categoryId,
    p_condition: parsed.data.condition,
    p_open_to_offers: parsed.data.openToOffers,
    p_pickup_area: parsed.data.pickupArea,
    p_pickup_latitude: parsed.data.pickupLatitude,
    p_pickup_longitude: parsed.data.pickupLongitude,
  });

  if (error || !data) {
    return { ok: false, message: writeFailure(error) };
  }

  return { ok: true, data: { id: data.id, version: data.version } };
}

export async function publishListingInBrowser(
  input: ListingDraftInput,
): Promise<ClientListingResult<{ id: string }>> {
  const parsed = listingPublishSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Your listing needs a few more details before it can be published.',
      fieldErrors: toFieldErrors(parsed.error.issues),
    };
  }

  const saved = await saveListingDraftInBrowser(parsed.data);
  if (!saved.ok) return saved;

  const supabase = createClient();
  const { error } = await supabase.rpc('publish_listing', {
    p_listing_id: saved.data.id,
  });

  if (error) {
    return { ok: false, message: publishErrorMessage(error) };
  }

  return { ok: true, data: { id: saved.data.id } };
}
