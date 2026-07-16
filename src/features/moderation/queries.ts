import 'server-only';

import { createClient } from '@/lib/supabase/server';

export const MODERATION_AUDIT_PAGE_SIZE = 25;

export type ModerationAuditEvent = {
  id: number;
  action: 'listing_removed';
  createdAt: string;
  listingId: string | null;
  listingTitle: string;
  moderatorId: string | null;
  reason: string;
};

export type ModerationWorkspaceData = {
  currentListingCount: number;
  events: ModerationAuditEvent[];
  page: number;
  pageSize: number;
  totalEvents: number;
  totalPages: number;
};

export class ModerationDataError extends Error {
  constructor(message = 'We could not load the moderation workspace right now.') {
    super(message);
    this.name = 'ModerationDataError';
  }
}

export async function getModerationWorkspace(requestedPage = 1): Promise<ModerationWorkspaceData> {
  const supabase = await createClient();
  const page = normalizePage(requestedPage);
  const from = (page - 1) * MODERATION_AUDIT_PAGE_SIZE;
  const to = from + MODERATION_AUDIT_PAGE_SIZE - 1;

  const [eventsResult, currentListingsResult] = await Promise.all([
    supabase
      .from('moderation_events')
      .select('id,moderator_id,listing_id,listing_title,action,reason,created_at', {
        count: 'exact',
      })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, to),
    supabase.from('marketplace_listings').select('id', { count: 'exact', head: true }),
  ]);

  if (eventsResult.error || currentListingsResult.error) {
    throw new ModerationDataError();
  }

  const totalEvents = eventsResult.count ?? 0;

  return {
    currentListingCount: currentListingsResult.count ?? 0,
    events: (eventsResult.data ?? []).map((event) => ({
      id: event.id,
      action: event.action,
      createdAt: event.created_at,
      listingId: event.listing_id,
      listingTitle: event.listing_title,
      moderatorId: event.moderator_id,
      reason: event.reason,
    })),
    page,
    pageSize: MODERATION_AUDIT_PAGE_SIZE,
    totalEvents,
    totalPages: Math.max(1, Math.ceil(totalEvents / MODERATION_AUDIT_PAGE_SIZE)),
  };
}

function normalizePage(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(1, Math.trunc(value)), 10_000);
}
