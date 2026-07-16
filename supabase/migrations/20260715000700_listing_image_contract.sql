-- Align listing images with the MVP product contract: one to six images,
-- no larger than 5 MiB each. This is a forward-only tightening of the
-- original eight-image / 10 MiB schema.

do $$
begin
  if exists (
    select 1
    from public.listing_images as image
    where image.size_bytes > 5242880
  ) then
    raise exception using
      errcode = '23514',
      message = 'Existing listing images larger than 5 MiB must be removed before applying the six-image contract.';
  end if;

  if exists (
    select 1
    from public.listing_images as image
    group by image.listing_id
    having count(*) > 6 or max(image.position) > 5
  ) then
    raise exception using
      errcode = '23514',
      message = 'Existing listings with more than six images must be reduced before applying the six-image contract.';
  end if;
end;
$$;

update storage.buckets
set file_size_limit = 5242880
where id = 'listing-images';

alter table public.listing_images
  drop constraint listing_images_position_range,
  add constraint listing_images_position_range
    check (position between 0 and 5),
  drop constraint listing_images_size_range,
  add constraint listing_images_size_range
    check (size_bytes between 1 and 5242880);

comment on table public.listing_images is
  'Ordered metadata for objects in the private listing-images Storage bucket. Positions 0-5 enforce the six-image limit.';

create or replace function private.assert_publishable_images(p_listing_id uuid)
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_total integer;
  v_uploaded integer;
  v_objects integer;
  v_min_position integer;
  v_max_position integer;
begin
  select
    count(*)::integer,
    count(*) filter (where image.upload_status = 'uploaded')::integer,
    count(object.id)::integer,
    min(image.position)::integer,
    max(image.position)::integer
  into v_total, v_uploaded, v_objects, v_min_position, v_max_position
  from public.listing_images as image
  left join storage.objects as object
    on object.bucket_id = 'listing-images'
   and object.name = image.storage_path
  where image.listing_id = p_listing_id;

  if v_total not between 1 and 6 then
    raise exception using errcode = '22023', message = 'Add between one and six images before publishing.';
  end if;
  if v_uploaded <> v_total or v_objects <> v_total then
    raise exception using errcode = '22023', message = 'Wait for every image upload to finish before publishing.';
  end if;
  if v_min_position <> 0 or v_max_position <> v_total - 1 then
    raise exception using errcode = '22023', message = 'Listing image positions must be contiguous and start at zero.';
  end if;
end;
$$;

create or replace function private.validate_listing_image()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_seller_id uuid;
  v_object_mime text;
  v_object_size bigint;
begin
  if tg_op = 'UPDATE' and (
    new.id is distinct from old.id
    or new.listing_id is distinct from old.listing_id
    or new.storage_path is distinct from old.storage_path
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using errcode = '42501', message = 'Image identity, listing, and storage path cannot be changed.';
  end if;

  select listing.seller_id
  into v_seller_id
  from public.listings as listing
  where listing.id = new.listing_id;

  if not found then
    raise exception using errcode = '23503', message = 'The image listing does not exist.';
  end if;

  if new.storage_path !~ (
    '^' || v_seller_id::text || '/' || new.listing_id::text
    || '/[A-Za-z0-9][A-Za-z0-9._-]{0,180}[.](jpg|jpeg|png|webp)$'
  ) then
    raise exception using
      errcode = '22023',
      message = 'Image paths must use seller-id/listing-id/file-name with an allowed extension.';
  end if;

  if new.upload_status = 'uploaded' then
    select
      lower(object.metadata ->> 'mimetype'),
      nullif(object.metadata ->> 'size', '')::bigint
    into v_object_mime, v_object_size
    from storage.objects as object
    where object.bucket_id = 'listing-images'
      and object.name = new.storage_path;

    if not found or v_object_mime not in ('image/jpeg', 'image/png', 'image/webp')
      or v_object_size is null or v_object_size not between 1 and 5242880
    then
      raise exception using errcode = '22023', message = 'The uploaded Storage object is missing or invalid.';
    end if;

    new.mime_type := v_object_mime;
    new.size_bytes := v_object_size;
  end if;

  if (new.mime_type = 'image/jpeg' and lower(new.storage_path) !~ '[.](jpg|jpeg)$')
    or (new.mime_type = 'image/png' and lower(new.storage_path) !~ '[.]png$')
    or (new.mime_type = 'image/webp' and lower(new.storage_path) !~ '[.]webp$')
  then
    raise exception using errcode = '22023', message = 'Image extension and MIME type do not match.';
  end if;

  return new;
end;
$$;

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

  set constraints listing_images_listing_position_key deferred;

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

create or replace function private.can_insert_listing_storage_object(p_name text)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_listing_id uuid;
begin
  if v_user_id is null then
    return false;
  end if;

  select listing.id
  into v_listing_id
  from public.listings as listing
  where listing.seller_id = v_user_id
    and listing.id::text = (storage.foldername(p_name))[2]
    and listing.status <> 'removed'
    and private.is_onboarded_student(v_user_id)
  for update;

  if not found then
    return false;
  end if;

  if p_name !~ (
    '^' || v_user_id::text || '/' || v_listing_id::text
    || '/[A-Za-z0-9][A-Za-z0-9._-]{0,180}[.](jpg|jpeg|png|webp)$'
  ) then
    return false;
  end if;

  if not exists (
    select 1
    from public.listing_images as image
    where image.listing_id = v_listing_id
      and image.storage_path = p_name
      and image.upload_status = 'pending'
  ) then
    return false;
  end if;

  if 6 <= (
    select count(*)
    from storage.objects as object
    where object.bucket_id = 'listing-images'
      and object.name like (
        v_user_id::text || '/' || v_listing_id::text || '/%'
      )
  ) then
    return false;
  end if;

  return true;
end;
$$;
