-- Security-definer functions intentionally use an empty search path. Qualify
-- the deferrable constraint as well, otherwise PostgreSQL cannot resolve it
-- during a reorder even though the constraint exists on public.listing_images.

create or replace function public.reorder_listing_images(
  p_listing_id uuid,
  p_image_ids uuid[]
)
returns setof public.listing_images
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_expected integer;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication is required.';
  end if;
  if p_image_ids is null
    or cardinality(p_image_ids) not between 1 and 6
    or array_position(p_image_ids, null) is not null
  then
    raise exception using errcode = '22023', message = 'Provide between one and six image IDs.';
  end if;
  if (
    select count(distinct supplied.image_id)
    from unnest(p_image_ids) as supplied(image_id)
  ) <> cardinality(p_image_ids) then
    raise exception using errcode = '22023', message = 'Image IDs must be unique.';
  end if;

  perform 1
  from public.listings as listing
  where listing.id = p_listing_id
    and listing.seller_id = v_user_id
    and listing.status <> 'removed'
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'You cannot reorder images for this listing.';
  end if;

  select count(*)::integer
  into v_expected
  from public.listing_images as image
  where image.listing_id = p_listing_id
    and image.id = any (p_image_ids);

  if v_expected <> cardinality(p_image_ids)
    or v_expected <> (
      select count(*)::integer
      from public.listing_images as image
      where image.listing_id = p_listing_id
    )
  then
    raise exception using errcode = '22023', message = 'Provide every image in this listing exactly once.';
  end if;

  set constraints public.listing_images_listing_position_key deferred;

  update public.listing_images as image
  set position = ordering.ordinality - 1
  from unnest(p_image_ids) with ordinality as ordering(image_id, ordinality)
  where image.id = ordering.image_id
    and image.listing_id = p_listing_id;

  return query
  select image.*
  from public.listing_images as image
  where image.listing_id = p_listing_id
  order by image.position;
end;
$$;
