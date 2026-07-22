-- Keep exact pickup addresses while the map experience is intentionally paused.
-- Coordinate columns remain available for existing records and a future map,
-- but new listings no longer need a pin in order to publish.

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
end;
$$;

comment on function private.assert_publishable_fields(public.listings) is
  'Validates publishable listing fields. Exact pickup address is required; map coordinates are optional while the map UI is paused.';
