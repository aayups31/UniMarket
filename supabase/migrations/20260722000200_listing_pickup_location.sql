-- Exact public meetup addresses with privacy-preserving, seller-placed map pins.
-- Existing listings remain valid with null coordinates. New publications must
-- include an address and a complete coordinate pair.

alter table public.listings
  add column pickup_latitude double precision,
  add column pickup_longitude double precision;

alter table public.listings
  add constraint listings_pickup_coordinates_paired
    check ((pickup_latitude is null) = (pickup_longitude is null)),
  add constraint listings_pickup_latitude_range
    check (pickup_latitude is null or pickup_latitude between -90 and 90),
  add constraint listings_pickup_longitude_range
    check (pickup_longitude is null or pickup_longitude between -180 and 180);

comment on column public.listings.pickup_area is
  'Exact seller-provided public meetup address. Kept under the legacy pickup_area name for API compatibility.';
comment on column public.listings.pickup_latitude is
  'Seller-placed latitude for the public meetup point; null on legacy or incomplete drafts.';
comment on column public.listings.pickup_longitude is
  'Seller-placed longitude for the public meetup point; null on legacy or incomplete drafts.';

grant insert (pickup_latitude, pickup_longitude) on table public.listings to authenticated;
grant update (pickup_latitude, pickup_longitude) on table public.listings to authenticated;

-- Append coordinates to the existing privacy-safe read model. Keeping every
-- prior column in place lets CREATE OR REPLACE preserve dependent queries.
create or replace view public.marketplace_listings
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
  cover.storage_path as cover_image_path,
  listing.pickup_latitude,
  listing.pickup_longitude
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
  'Authenticated, privacy-safe, one-row-per-listing marketplace read model with seller-placed public pickup coordinates.';

grant select on table public.marketplace_listings to authenticated, service_role;

-- Publishing no longer checks a configured broad-area table. It requires an
-- exact public address and pin, but deliberately does not block distant pins;
-- the product warns sellers when the location is more than 3 km from campus.
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
  if char_length(btrim(p_listing.pickup_area)) not between 5 and 120 then
    raise exception using errcode = '22023', message = 'Add the exact public pickup address before publishing.';
  end if;
  if p_listing.pickup_latitude is null or p_listing.pickup_longitude is null then
    raise exception using errcode = '22023', message = 'Place the pickup pin before publishing.';
  end if;
end;
$$;

drop function public.save_listing_draft(
  uuid,
  text,
  text,
  integer,
  smallint,
  public.listing_condition,
  boolean,
  text
);

create function public.save_listing_draft(
  p_listing_id uuid default null,
  p_title text default '',
  p_description text default '',
  p_price_cents integer default null,
  p_category_id smallint default null,
  p_condition public.listing_condition default null,
  p_open_to_offers boolean default false,
  p_pickup_area text default '',
  p_pickup_latitude double precision default null,
  p_pickup_longitude double precision default null
)
returns public.listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_listing public.listings;
  v_title text := btrim(coalesce(p_title, ''));
  v_description text := btrim(coalesce(p_description, ''));
  v_pickup_area text := btrim(coalesce(p_pickup_area, ''));
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication is required.';
  end if;

  if not private.is_onboarded_student(v_user_id) then
    raise exception using
      errcode = '42501',
      message = 'A verified Waterloo student profile is required to save a listing.';
  end if;

  if char_length(v_title) > 100 then
    raise exception using errcode = '22023', message = 'Listing titles can be at most 100 characters.';
  end if;
  if char_length(v_description) > 5000 then
    raise exception using errcode = '22023', message = 'Listing descriptions can be at most 5000 characters.';
  end if;
  if char_length(v_pickup_area) > 120 then
    raise exception using errcode = '22023', message = 'Pickup addresses can be at most 120 characters.';
  end if;
  if p_price_cents is not null and p_price_cents not between 0 and 100000000 then
    raise exception using errcode = '22023', message = 'Choose a valid price in Canadian cents.';
  end if;
  if p_category_id is not null and p_category_id < 1 then
    raise exception using errcode = '22023', message = 'Choose a valid category.';
  end if;
  if p_open_to_offers is null then
    raise exception using errcode = '22023', message = 'Choose whether offers are welcome.';
  end if;
  if (p_pickup_latitude is null) <> (p_pickup_longitude is null) then
    raise exception using errcode = '22023', message = 'Place one complete pickup pin.';
  end if;
  if p_pickup_latitude is not null and p_pickup_latitude not between -90 and 90 then
    raise exception using errcode = '22023', message = 'Choose a valid pickup latitude.';
  end if;
  if p_pickup_longitude is not null and p_pickup_longitude not between -180 and 180 then
    raise exception using errcode = '22023', message = 'Choose a valid pickup longitude.';
  end if;

  if p_listing_id is not null then
    select listing.*
    into v_listing
    from public.listings as listing
    where listing.id = p_listing_id
    for update;

    if found then
      if v_listing.seller_id <> v_user_id then
        raise exception using errcode = '42501', message = 'You do not own this listing.';
      end if;
      if v_listing.status not in ('draft', 'published') then
        raise exception using errcode = '42501', message = 'This listing can no longer be edited.';
      end if;

      update public.listings as listing
      set
        title = v_title,
        description = v_description,
        price_cents = p_price_cents,
        category_id = p_category_id,
        condition = p_condition,
        open_to_offers = p_open_to_offers,
        pickup_area = v_pickup_area,
        pickup_latitude = p_pickup_latitude,
        pickup_longitude = p_pickup_longitude
      where listing.id = p_listing_id
      returning listing.* into v_listing;

      return v_listing;
    end if;
  end if;

  insert into public.listings (
    id,
    seller_id,
    title,
    description,
    price_cents,
    category_id,
    condition,
    open_to_offers,
    pickup_area,
    pickup_latitude,
    pickup_longitude
  )
  values (
    p_listing_id,
    v_user_id,
    v_title,
    v_description,
    p_price_cents,
    p_category_id,
    p_condition,
    p_open_to_offers,
    v_pickup_area,
    p_pickup_latitude,
    p_pickup_longitude
  )
  returning * into v_listing;

  return v_listing;
end;
$$;

comment on function public.save_listing_draft(
  uuid,
  text,
  text,
  integer,
  smallint,
  public.listing_condition,
  boolean,
  text,
  double precision,
  double precision
) is 'Creates or updates an authenticated student-owned draft using safe editable fields and an optional public pickup pin.';

revoke all on function public.save_listing_draft(
  uuid,
  text,
  text,
  integer,
  smallint,
  public.listing_condition,
  boolean,
  text,
  double precision,
  double precision
) from public, anon, authenticated;
grant execute on function public.save_listing_draft(
  uuid,
  text,
  text,
  integer,
  smallint,
  public.listing_condition,
  boolean,
  text,
  double precision,
  double precision
) to authenticated, service_role;
