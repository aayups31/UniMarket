-- Least-privilege API grants and row-level security.

alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.categories enable row level security;
alter table public.categories force row level security;
alter table public.pickup_areas enable row level security;
alter table public.pickup_areas force row level security;
alter table public.listings enable row level security;
alter table public.listings force row level security;
alter table public.listing_images enable row level security;
alter table public.listing_images force row level security;
alter table public.moderation_events enable row level security;
alter table public.moderation_events force row level security;

revoke all on table public.profiles from public, anon, authenticated;
revoke all on table public.categories from public, anon, authenticated;
revoke all on table public.pickup_areas from public, anon, authenticated;
revoke all on table public.listings from public, anon, authenticated;
revoke all on table public.listing_images from public, anon, authenticated;
revoke all on table public.moderation_events from public, anon, authenticated;
revoke all on table public.seller_profiles from public, anon, authenticated;
revoke all on table public.marketplace_listings from public, anon, authenticated;

grant select on table public.categories to anon, authenticated;
grant select on table public.pickup_areas to anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name, program, academic_year, residence_area)
  on table public.profiles to authenticated;

grant select on table public.listings to authenticated;
grant insert (
  id,
  seller_id,
  title,
  description,
  price_cents,
  category_id,
  condition,
  open_to_offers,
  pickup_area,
  status
) on table public.listings to authenticated;
grant update (
  title,
  description,
  price_cents,
  category_id,
  condition,
  open_to_offers,
  pickup_area,
  status
) on table public.listings to authenticated;
grant delete on table public.listings to authenticated;

grant select on table public.listing_images to authenticated;
grant insert (
  id,
  listing_id,
  storage_path,
  position,
  upload_status,
  mime_type,
  size_bytes,
  width,
  height
) on table public.listing_images to authenticated;
grant update (
  position,
  upload_status,
  mime_type,
  size_bytes,
  width,
  height
) on table public.listing_images to authenticated;
grant delete on table public.listing_images to authenticated;

grant select on table public.moderation_events to authenticated;
grant select on table public.seller_profiles to authenticated;
grant select on table public.marketplace_listings to authenticated;

-- The server-only secret key maps to service_role. RLS bypass alone does not
-- imply SQL privileges on projects using Supabase's newer revoked-by-default
-- API posture, so trusted server/admin workflows are granted explicitly.
grant select, update on table public.profiles to service_role;
grant all on table public.categories to service_role;
grant all on table public.pickup_areas to service_role;
grant all on table public.listings to service_role;
grant all on table public.listing_images to service_role;
grant select, insert on table public.moderation_events to service_role;
grant select on table public.seller_profiles to service_role;
grant select on table public.marketplace_listings to service_role;
grant usage, select on all sequences in schema public to service_role;

grant usage on schema private to authenticated, service_role;
grant execute on function private.current_user_role() to authenticated;
grant execute on function private.is_onboarded_student(uuid) to authenticated;
-- guard_listing_write is intentionally security-invoker so current_user still
-- distinguishes client writes from privileged workflows. Published edits call
-- these two validation helpers from that trigger.
grant execute on function private.assert_publishable_fields(public.listings) to authenticated, service_role;
grant execute on function private.assert_publishable_images(uuid) to authenticated, service_role;
grant execute on function private.listing_has_storage_objects(uuid, uuid) to authenticated, service_role;
grant execute on function private.role_for_auth_email(text) to service_role;
grant usage on schema extensions to anon, authenticated, service_role;

create policy categories_read
on public.categories
for select
to anon, authenticated
using (true);

create policy pickup_areas_read
on public.pickup_areas
for select
to anon, authenticated
using (true);

create policy profiles_read_self
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
  and role = 'student'
)
with check (
  id = (select auth.uid())
  and role = 'student'
);

create policy listings_read_visible
on public.listings
for select
to authenticated
using (
  seller_id = (select auth.uid())
  or (
    status = 'published'
    and private.is_onboarded_student(seller_id)
  )
  or (
    private.current_user_role() = 'moderator'
    and status = 'removed'
  )
);

create policy listings_insert_own_draft
on public.listings
for insert
to authenticated
with check (
  seller_id = (select auth.uid())
  and private.is_onboarded_student((select auth.uid()))
  and status = 'draft'
  and featured_at is null
  and published_at is null
  and removed_at is null
  and removed_by is null
  and removal_reason is null
  and version = 1
);

create policy listings_update_own
on public.listings
for update
to authenticated
using (
  seller_id = (select auth.uid())
  and private.is_onboarded_student((select auth.uid()))
  and status <> 'removed'
)
with check (
  seller_id = (select auth.uid())
  and private.is_onboarded_student((select auth.uid()))
  and status <> 'removed'
);

create policy listings_delete_own_nonpublic
on public.listings
for delete
to authenticated
using (
  seller_id = (select auth.uid())
  and private.is_onboarded_student((select auth.uid()))
  and status in ('draft', 'sold', 'archived')
);

create policy listing_images_read_visible
on public.listing_images
for select
to authenticated
using (
  exists (
    select 1
    from public.listings as listing
    where listing.id = listing_images.listing_id
  )
);

create policy listing_images_insert_own
on public.listing_images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.listings as listing
    where listing.id = listing_images.listing_id
      and listing.seller_id = (select auth.uid())
      and listing.status <> 'removed'
      and private.is_onboarded_student((select auth.uid()))
  )
);

create policy listing_images_update_own
on public.listing_images
for update
to authenticated
using (
  exists (
    select 1
    from public.listings as listing
    where listing.id = listing_images.listing_id
      and listing.seller_id = (select auth.uid())
      and listing.status <> 'removed'
      and private.is_onboarded_student((select auth.uid()))
  )
)
with check (
  exists (
    select 1
    from public.listings as listing
    where listing.id = listing_images.listing_id
      and listing.seller_id = (select auth.uid())
      and listing.status <> 'removed'
      and private.is_onboarded_student((select auth.uid()))
  )
);

create policy listing_images_delete_own
on public.listing_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.listings as listing
    where listing.id = listing_images.listing_id
      and listing.seller_id = (select auth.uid())
      and listing.status <> 'removed'
      and private.is_onboarded_student((select auth.uid()))
  )
);

create policy moderation_events_read_moderator
on public.moderation_events
for select
to authenticated
using (private.current_user_role() = 'moderator');
