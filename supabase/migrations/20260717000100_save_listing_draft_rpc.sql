-- Draft writes use one authenticated, ownership-checked workflow. This keeps
-- incomplete drafts valid while avoiding fragile client-side table-write paths.

create or replace function public.save_listing_draft(
  p_listing_id uuid default null,
  p_title text default '',
  p_description text default '',
  p_price_cents integer default null,
  p_category_id smallint default null,
  p_condition public.listing_condition default null,
  p_open_to_offers boolean default false,
  p_pickup_area text default ''
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
    raise exception using errcode = '22023', message = 'Pickup areas can be at most 120 characters.';
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
        pickup_area = v_pickup_area
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
    pickup_area
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
    v_pickup_area
  )
  returning * into v_listing;

  return v_listing;
end;
$$;

comment on function public.save_listing_draft(uuid, text, text, integer, smallint, public.listing_condition, boolean, text)
is 'Creates or updates an authenticated student-owned draft using only safe editable listing fields.';

revoke execute on function public.save_listing_draft(uuid, text, text, integer, smallint, public.listing_condition, boolean, text)
  from public, anon;
grant execute on function public.save_listing_draft(uuid, text, text, integer, smallint, public.listing_condition, boolean, text)
  to authenticated;
