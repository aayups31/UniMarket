-- Listing invariants and transactional workflows.

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
  if char_length(btrim(p_listing.pickup_area)) not between 2 and 120 then
    raise exception using errcode = '22023', message = 'Add a broad pickup area before publishing.';
  end if;
end;
$$;

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

  if v_total not between 1 and 8 then
    raise exception using errcode = '22023', message = 'Add between one and eight images before publishing.';
  end if;
  if v_uploaded <> v_total or v_objects <> v_total then
    raise exception using errcode = '22023', message = 'Wait for every image upload to finish before publishing.';
  end if;
  if v_min_position <> 0 or v_max_position <> v_total - 1 then
    raise exception using errcode = '22023', message = 'Listing image positions must be contiguous and start at zero.';
  end if;
end;
$$;

create or replace function private.listing_has_storage_objects(
  p_seller_id uuid,
  p_listing_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from storage.objects as object
    where object.bucket_id = 'listing-images'
      and object.name like (p_seller_id::text || '/' || p_listing_id::text || '/%')
  );
$$;

create or replace function private.guard_listing_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if current_user not in ('postgres', 'service_role')
      and (
        exists (
          select 1
          from public.listing_images as image
          where image.listing_id = old.id
        )
        or private.listing_has_storage_objects(old.seller_id, old.id)
      )
    then
      raise exception using
        errcode = '23503',
        message = 'Remove listing images before deleting the listing.';
    end if;
    return old;
  end if;

  if tg_op = 'INSERT' then
    if current_user not in ('postgres', 'service_role')
      and (
        new.seller_id is distinct from auth.uid()
        or not private.is_onboarded_student(auth.uid())
      )
    then
      raise exception using errcode = '42501', message = 'Only onboarded Waterloo students can create their own listings.';
    end if;
    if new.status = 'published' then
      perform private.assert_publishable_fields(new);
      perform private.assert_publishable_images(new.id);
    end if;
    return new;
  end if;

  if new.id is distinct from old.id
    or new.seller_id is distinct from old.seller_id
    or new.created_at is distinct from old.created_at
  then
    raise exception using errcode = '42501', message = 'Listing identity and ownership cannot be changed.';
  end if;

  if current_user not in ('postgres', 'service_role') then
    if new.featured_at is distinct from old.featured_at
      or new.published_at is distinct from old.published_at
      or new.removed_at is distinct from old.removed_at
      or new.removed_by is distinct from old.removed_by
      or new.removal_reason is distinct from old.removal_reason
    then
      raise exception using errcode = '42501', message = 'System-managed listing fields cannot be changed.';
    end if;

    if (old.status = 'draft' and new.status <> 'draft')
      or (old.status = 'published' and new.status not in ('published', 'sold', 'archived'))
      or (old.status = 'sold' and new.status not in ('sold', 'archived'))
      or (old.status = 'archived' and new.status <> 'archived')
      or (old.status = 'removed' and new.status <> 'removed')
    then
      raise exception using
        errcode = '42501',
        message = 'Use the publish or moderation workflow for this listing status transition.';
    end if;
  end if;

  if new.status = 'published' then
    perform private.assert_publishable_fields(new);
    perform private.assert_publishable_images(new.id);
  end if;

  return new;
end;
$$;

create trigger listings_guard_write
before insert or update or delete on public.listings
for each row execute function private.guard_listing_write();

create or replace function private.lock_listing_for_image_mutation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_listing_id uuid := case
    when tg_op = 'DELETE' then old.listing_id
    else new.listing_id
  end;
begin
  -- Serialize image metadata changes with publish_listing, which takes the same
  -- parent-row lock before validating the complete image set.
  perform 1
  from public.listings as listing
  where listing.id = v_listing_id
  for update;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger listing_images_lock_listing
before insert or update or delete on public.listing_images
for each row execute function private.lock_listing_for_image_mutation();

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
      or v_object_size is null or v_object_size not between 1 and 10485760
    then
      raise exception using errcode = '22023', message = 'The uploaded Storage object is missing or invalid.';
    end if;

    new.mime_type := v_object_mime;
    new.size_bytes := v_object_size;
  end if;

  -- For pending rows this checks the registration MIME. During finalization it
  -- deliberately runs after Storage metadata becomes authoritative.
  if (new.mime_type = 'image/jpeg' and lower(new.storage_path) !~ '[.](jpg|jpeg)$')
    or (new.mime_type = 'image/png' and lower(new.storage_path) !~ '[.]png$')
    or (new.mime_type = 'image/webp' and lower(new.storage_path) !~ '[.]webp$')
  then
    raise exception using errcode = '22023', message = 'Image extension and MIME type do not match.';
  end if;

  return new;
end;
$$;

create trigger listing_images_validate
before insert or update on public.listing_images
for each row execute function private.validate_listing_image();

create or replace function private.ensure_published_listing_has_image()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_listing_id uuid;
begin
  v_listing_id := case
    when tg_op = 'DELETE' then old.listing_id
    else new.listing_id
  end;

  if exists (
    select 1
    from public.listings as listing
    where listing.id = v_listing_id
      and listing.status = 'published'
  ) and not exists (
    select 1
    from public.listing_images as image
    where image.listing_id = v_listing_id
      and image.upload_status = 'uploaded'
  ) then
    raise exception using
      errcode = '23514',
      message = 'A published listing must retain at least one uploaded image.';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger listing_images_keep_published_cover
after update or delete on public.listing_images
for each row execute function private.ensure_published_listing_has_image();

create or replace function public.publish_listing(p_listing_id uuid)
returns public.listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_listing public.listings;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication is required.';
  end if;

  select listing.*
  into v_listing
  from public.listings as listing
  where listing.id = p_listing_id
  for update;

  if not found or v_listing.seller_id <> v_user_id then
    raise exception using errcode = '42501', message = 'You do not own this listing.';
  end if;
  if v_listing.status = 'published' then
    return v_listing;
  end if;
  if v_listing.status <> 'draft' then
    raise exception using errcode = '42501', message = 'Only draft listings can be published.';
  end if;

  perform private.assert_publishable_fields(v_listing);
  perform private.assert_publishable_images(v_listing.id);

  update public.listings
  set
    title = btrim(title),
    description = btrim(description),
    pickup_area = btrim(pickup_area),
    status = 'published',
    published_at = now(),
    removed_at = null,
    removed_by = null,
    removal_reason = null
  where id = v_listing.id
  returning * into v_listing;

  return v_listing;
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
    or cardinality(p_image_ids) not between 1 and 8
    or array_position(p_image_ids, null) is not null
  then
    raise exception using errcode = '22023', message = 'Provide between one and eight image IDs.';
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

create or replace function public.remove_listing(
  p_listing_id uuid,
  p_reason text
)
returns public.listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_moderator_id uuid := auth.uid();
  v_listing public.listings;
begin
  p_reason := nullif(btrim(p_reason), '');

  if v_moderator_id is null
    or private.current_user_role() is distinct from 'moderator'::public.user_role
  then
    raise exception using errcode = '42501', message = 'Moderator access is required.';
  end if;
  if p_reason is null or char_length(p_reason) not between 10 and 500 then
    raise exception using errcode = '22023', message = 'A moderation reason between 10 and 500 characters is required.';
  end if;

  select listing.*
  into v_listing
  from public.listings as listing
  where listing.id = p_listing_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Listing not found.';
  end if;
  if v_listing.status = 'removed' then
    return v_listing;
  end if;
  if v_listing.status not in ('published', 'sold', 'archived') then
    raise exception using errcode = '42501', message = 'Moderators cannot remove private drafts.';
  end if;

  update public.listings
  set
    status = 'removed',
    removed_at = now(),
    removed_by = v_moderator_id,
    removal_reason = p_reason
  where id = v_listing.id
  returning * into v_listing;

  insert into public.moderation_events (
    moderator_id,
    listing_id,
    seller_id,
    listing_title,
    action,
    reason
  )
  values (
    v_moderator_id,
    v_listing.id,
    v_listing.seller_id,
    v_listing.title,
    'listing_removed',
    p_reason
  );

  return v_listing;
end;
$$;

create or replace function public.search_listings(
  p_query text default null,
  p_category_slug text default null,
  p_limit integer default 24,
  p_before_published_at timestamptz default null,
  p_before_id uuid default null
)
returns setof public.listings
language sql
stable
set search_path = ''
as $$
  select listing.*
  from public.listings as listing
  join public.categories as category on category.id = listing.category_id
  where listing.status = 'published'
    and category.is_active
    and (
      nullif(btrim(p_category_slug), '') is null
      or category.slug = lower(btrim(p_category_slug))
    )
    and (
      nullif(btrim(p_query), '') is null
      or listing.search_vector @@ websearch_to_tsquery('english'::regconfig, btrim(p_query))
      or listing.title operator(extensions.%) btrim(p_query)
      or listing.description operator(extensions.%) btrim(p_query)
      or category.name ilike ('%' || btrim(p_query) || '%')
    )
    and (
      p_before_published_at is null
      or (listing.published_at, listing.id) < (
        p_before_published_at,
        coalesce(p_before_id, 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid)
      )
    )
  order by listing.published_at desc, listing.id desc
  limit least(greatest(coalesce(p_limit, 24), 1), 50);
$$;

create view public.seller_profiles
with (security_barrier = true)
as
select
  profile.id,
  profile.full_name,
  profile.email,
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
  'Authenticated-only contact view for active published sellers. Excludes private residence/program data and all moderator accounts.';

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
  seller.full_name as seller_name,
  seller.email as seller_email,
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
  'Authenticated-only, one-row-per-listing marketplace read model with safe seller contact and cover path.';

revoke execute on function public.publish_listing(uuid) from public, anon;
revoke execute on function public.reorder_listing_images(uuid, uuid[]) from public, anon;
revoke execute on function public.remove_listing(uuid, text) from public, anon;
revoke execute on function public.search_listings(text, text, integer, timestamptz, uuid) from public, anon;

grant execute on function public.publish_listing(uuid) to authenticated;
grant execute on function public.reorder_listing_images(uuid, uuid[]) to authenticated;
grant execute on function public.remove_listing(uuid, text) to authenticated;
grant execute on function public.search_listings(text, text, integer, timestamptz, uuid) to authenticated;
