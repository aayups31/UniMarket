-- Reserve listing-image metadata atomically and idempotently.
--
-- The browser chooses the image UUID before making a request. If a mobile or
-- desktop connection loses the response after this function commits, retrying
-- the same UUID returns the same row instead of creating an invisible orphan.

create or replace function public.reserve_listing_image(
  p_listing_id uuid,
  p_image_id uuid,
  p_mime_type text,
  p_size_bytes bigint,
  p_width integer default null,
  p_height integer default null
)
returns public.listing_images
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_mime_type text := lower(btrim(p_mime_type));
  v_extension text;
  v_storage_path text;
  v_existing public.listing_images;
  v_reserved public.listing_images;
  v_position integer;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication is required.';
  end if;

  if p_image_id is null then
    raise exception using errcode = '22023', message = 'An image identifier is required.';
  end if;

  v_extension := case v_mime_type
    when 'image/jpeg' then 'jpg'
    when 'image/png' then 'png'
    when 'image/webp' then 'webp'
    else null
  end;

  if v_extension is null then
    raise exception using errcode = '22023', message = 'That image type is not supported.';
  end if;

  if p_size_bytes is null or p_size_bytes not between 1 and 5242880 then
    raise exception using errcode = '22023', message = 'Images must be no larger than 5 MB.';
  end if;

  if (p_width is not null and p_width not between 1 and 20000)
    or (p_height is not null and p_height not between 1 and 20000)
  then
    raise exception using errcode = '22023', message = 'The image dimensions are invalid.';
  end if;

  -- Serialize both ownership validation and position allocation with every
  -- other image mutation for this listing.
  perform 1
  from public.listings as listing
  where listing.id = p_listing_id
    and listing.seller_id = v_user_id
    and listing.status in ('draft', 'published')
    and private.is_onboarded_student(v_user_id)
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'This listing is no longer editable.';
  end if;

  v_storage_path := v_user_id::text || '/' || p_listing_id::text || '/'
    || p_image_id::text || '.' || v_extension;

  select image.*
  into v_existing
  from public.listing_images as image
  where image.id = p_image_id;

  if found then
    if v_existing.listing_id <> p_listing_id
      or v_existing.storage_path <> v_storage_path
      or v_existing.upload_status <> 'pending'
      or v_existing.mime_type <> v_mime_type
      or v_existing.size_bytes <> p_size_bytes
      or v_existing.width is distinct from p_width
      or v_existing.height is distinct from p_height
    then
      raise exception using errcode = '22023', message = 'That image reservation cannot be reused.';
    end if;

    return v_existing;
  end if;

  select candidate.position
  into v_position
  from generate_series(0, 5) as candidate(position)
  where not exists (
    select 1
    from public.listing_images as image
    where image.listing_id = p_listing_id
      and image.position = candidate.position
  )
  order by candidate.position
  limit 1;

  if v_position is null then
    raise exception using errcode = '22023', message = 'A listing can include up to six images.';
  end if;

  insert into public.listing_images (
    id,
    listing_id,
    storage_path,
    position,
    upload_status,
    mime_type,
    size_bytes,
    width,
    height
  )
  values (
    p_image_id,
    p_listing_id,
    v_storage_path,
    v_position,
    'pending',
    v_mime_type,
    p_size_bytes,
    p_width,
    p_height
  )
  returning * into v_reserved;

  return v_reserved;
end;
$$;

revoke execute on function public.reserve_listing_image(uuid, uuid, text, bigint, integer, integer)
  from public, anon;
grant execute on function public.reserve_listing_image(uuid, uuid, text, bigint, integer, integer)
  to authenticated, service_role;

comment on function public.reserve_listing_image(uuid, uuid, text, bigint, integer, integer) is
  'Atomically reserves an owner-scoped pending image path. Reusing an identical client image UUID is idempotent.';
