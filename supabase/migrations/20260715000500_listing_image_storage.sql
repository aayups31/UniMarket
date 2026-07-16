-- Private image bucket and object-level access policies.
--
-- Object names must be:
--   <seller uuid>/<listing uuid>/<random safe filename>.<jpg|jpeg|png|webp>
-- Reads require authentication. Buyers can read only objects attached to a
-- published listing; owners can also read their own draft objects.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'listing-images',
  'listing-images',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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

  -- Upload authorization is a reservation: the app must register this exact
  -- path as pending metadata before TUS creates the object. Uploaded/failed
  -- rows cannot be overwritten, and unregistered objects are rejected.
  if not exists (
    select 1
    from public.listing_images as image
    where image.listing_id = v_listing_id
      and image.storage_path = p_name
      and image.upload_status = 'pending'
  ) then
    return false;
  end if;

  -- The database supports at most eight images per listing. Counting every
  -- object, including staged objects, prevents private orphan accumulation in
  -- a listing folder.
  if 8 <= (
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

create or replace function private.can_delete_listing_storage_object(p_name text)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_listing_id uuid;
  v_listing_status public.listing_status;
begin
  if v_user_id is null then
    return false;
  end if;

  select listing.id, listing.status
  into v_listing_id, v_listing_status
  from public.listings as listing
  where listing.seller_id = v_user_id
    and listing.id::text = (storage.foldername(p_name))[2]
  for update;

  if not found then
    return false;
  end if;
  if v_listing_status = 'removed' then
    -- Preserve uploaded evidence on moderated listings, while still allowing
    -- the owner to clean up a TUS object whose pending metadata never became a
    -- visible listing image.
    return not exists (
      select 1
      from public.listing_images as attached
      where attached.listing_id = v_listing_id
        and attached.storage_path = p_name
        and attached.upload_status = 'uploaded'
    );
  end if;
  if v_listing_status <> 'published' then
    return true;
  end if;
  -- Never remove an object while a published listing still references it.
  -- Detach its metadata first; the metadata trigger independently guarantees
  -- that another uploaded image remains. This also prevents delete/reinsert at
  -- an attached immutable path and is safe for multi-object delete requests.
  return not exists (
    select 1
    from public.listing_images as attached
    where attached.listing_id = v_listing_id
      and attached.storage_path = p_name
  );
end;
$$;

revoke execute on function private.can_insert_listing_storage_object(text)
  from public, anon;
revoke execute on function private.can_delete_listing_storage_object(text)
  from public, anon;
grant execute on function private.can_insert_listing_storage_object(text)
  to authenticated;
grant execute on function private.can_delete_listing_storage_object(text)
  to authenticated;

create policy listing_images_storage_insert_owner
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and owner_id = (select auth.uid()::text)
  and cardinality(storage.foldername(name)) = 2
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  and private.can_insert_listing_storage_object(name)
);

create policy listing_images_storage_select_visible
on storage.objects
for select
to authenticated
using (
  bucket_id = 'listing-images'
  and (
    (
      owner_id = (select auth.uid()::text)
      and (storage.foldername(name))[1] = (select auth.uid()::text)
      and exists (
        select 1
        from public.listings as listing
        where listing.id::text = (storage.foldername(name))[2]
          and listing.seller_id = (select auth.uid())
      )
    )
    or exists (
      select 1
      from public.listing_images as image
      join public.listings as listing on listing.id = image.listing_id
      where image.storage_path = name
        and image.upload_status = 'uploaded'
        and listing.status = 'published'
    )
    or (
      private.current_user_role() = 'moderator'
      and exists (
        select 1
        from public.listing_images as image
        join public.listings as listing on listing.id = image.listing_id
        where image.storage_path = name
          and listing.status = 'removed'
      )
    )
  )
);

-- Replacements use a new immutable object path. No UPDATE policy is granted,
-- which prevents a move/overwrite from invalidating listing image metadata.
create policy listing_images_storage_delete_owner
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'listing-images'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and private.can_delete_listing_storage_object(name)
);
