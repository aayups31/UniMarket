-- Privacy-safe public seller identity and Waterloo marketplace configuration.

create or replace function private.public_display_name(p_full_name text)
returns text
language sql
immutable
set search_path = ''
as $$
  with normalized as (
    select regexp_split_to_array(
      regexp_replace(btrim(coalesce(p_full_name, '')), '\s+', ' ', 'g'),
      '\s+'
    ) as parts
  )
  select case
    when cardinality(parts) = 0 or coalesce(parts[1], '') = '' then 'Waterloo student'
    when cardinality(parts) = 1 then parts[1]
    else parts[1] || ' ' || left(parts[cardinality(parts)], 1) || '.'
  end
  from normalized;
$$;

comment on function private.public_display_name(text) is
  'Returns the marketplace-safe first-name and last-initial representation of a profile name.';

-- Rebuild the read models without bulk contact details. Contact email is
-- available only through the explicit, authenticated RPC below.
drop view if exists public.marketplace_listings;
drop view if exists public.seller_profiles;

create view public.seller_profiles
with (security_barrier = true)
as
select
  profile.id,
  private.public_display_name(profile.full_name) as display_name,
  profile.program,
  profile.academic_year,
  profile.university,
  profile.created_at
from public.profiles as profile
where profile.role = 'student'
  and profile.email_verified
  and profile.onboarding_completed_at is not null
  and exists (
    select 1
    from public.listings as listing
    where listing.seller_id = profile.id
      and listing.status = 'published'
  );

comment on view public.seller_profiles is
  'Authenticated marketplace-safe seller facts. Excludes email, residence, auth metadata, full legal name, and moderators.';

create view public.marketplace_listings
with (security_barrier = true)
as
select
  listing.id,
  listing.title,
  listing.description,
  listing.price_cents,
  listing.condition,
  listing.open_to_offers,
  listing.pickup_area,
  listing.featured_at,
  listing.published_at,
  listing.created_at,
  listing.updated_at,
  category.id as category_id,
  category.slug as category_slug,
  category.name as category_name,
  category.icon as category_icon,
  seller.id as seller_id,
  private.public_display_name(seller.full_name) as seller_name,
  seller.program as seller_program,
  seller.academic_year as seller_academic_year,
  seller.created_at as seller_joined_at,
  seller.university as seller_university,
  cover.storage_path as cover_image_path
from public.listings as listing
join public.categories as category
  on category.id = listing.category_id
 and category.is_active
join public.profiles as seller
  on seller.id = listing.seller_id
 and seller.role = 'student'
 and seller.email_verified
 and seller.onboarding_completed_at is not null
left join lateral (
  select image.storage_path
  from public.listing_images as image
  where image.listing_id = listing.id
    and image.upload_status = 'uploaded'
  order by image.position
  limit 1
) as cover on true
where listing.status = 'published';

comment on view public.marketplace_listings is
  'Authenticated, privacy-safe, one-row-per-listing marketplace read model.';

create or replace function public.get_listing_contact_email(p_listing_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
begin
  if v_user_id is null or not private.is_onboarded_student(v_user_id) then
    raise exception using errcode = '42501', message = 'A verified Waterloo student account is required.';
  end if;

  select seller.email::text
  into v_email
  from public.listings as listing
  join public.profiles as seller
    on seller.id = listing.seller_id
   and seller.role = 'student'
   and seller.email_verified
   and seller.onboarding_completed_at is not null
  where listing.id = p_listing_id
    and listing.status = 'published';

  if v_email is null then
    raise exception using errcode = 'P0002', message = 'That seller is not available.';
  end if;

  return v_email;
end;
$$;

comment on function public.get_listing_contact_email(uuid) is
  'Returns one published listing seller email only after an explicit request by an onboarded Waterloo student.';

revoke all on table public.seller_profiles from public, anon, authenticated;
revoke all on table public.marketplace_listings from public, anon, authenticated;
grant select on table public.seller_profiles to authenticated, service_role;
grant select on table public.marketplace_listings to authenticated, service_role;

revoke execute on function public.get_listing_contact_email(uuid) from public, anon;
grant execute on function public.get_listing_contact_email(uuid) to authenticated;

-- Published listings may only use a configured broad area. Drafts stay
-- permissive so unfinished work can always be saved.
create or replace function private.assert_publishable_fields(p_listing public.listings)
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_onboarded_student(p_listing.seller_id) then
    raise exception using errcode = '42501', message = 'Complete a verified Waterloo student profile before publishing.';
  end if;
  if char_length(btrim(p_listing.title)) not between 3 and 100 then
    raise exception using errcode = '22023', message = 'Listing title must be between 3 and 100 characters.';
  end if;
  if char_length(btrim(p_listing.description)) not between 10 and 5000 then
    raise exception using errcode = '22023', message = 'Listing description must be between 10 and 5000 characters.';
  end if;
  if p_listing.price_cents is null or p_listing.price_cents not between 0 and 100000000 then
    raise exception using errcode = '22023', message = 'Add a valid price before publishing.';
  end if;
  if p_listing.category_id is null or not exists (
    select 1
    from public.categories as category
    where category.id = p_listing.category_id
      and category.is_active
  ) then
    raise exception using errcode = '22023', message = 'Choose an active category before publishing.';
  end if;
  if p_listing.condition is null then
    raise exception using errcode = '22023', message = 'Choose the item condition before publishing.';
  end if;
  if not exists (
    select 1
    from public.pickup_areas as area
    where area.is_active
      and lower(area.name) = lower(btrim(p_listing.pickup_area))
  ) then
    raise exception using errcode = '22023', message = 'Choose one of the approved broad Waterloo pickup areas.';
  end if;
end;
$$;

-- Replace decorative emoji with stable semantic icon keys.
update public.categories
set icon = case slug
  when 'electronics' then 'laptop'
  when 'books' then 'book-open'
  when 'household-items' then 'armchair'
  when 'clothing' then 'shirt'
  else icon
end
where slug in ('electronics', 'books', 'household-items', 'clothing');

insert into public.pickup_areas (slug, name, sort_order, is_active)
values
  ('columbia-street', 'Columbia Street', 9, true),
  ('phillip-street', 'Phillip Street', 10, true)
on conflict (slug) do update
set
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
