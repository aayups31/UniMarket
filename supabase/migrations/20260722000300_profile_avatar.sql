-- Private student profile photos. Initials remain the default; an avatar path
-- is exposed to authenticated marketplace members only and rendered through a
-- short-lived signed URL.

alter table public.profiles
  add column if not exists avatar_path text;

alter table public.profiles
  drop constraint if exists profiles_avatar_path_format;

alter table public.profiles
  add constraint profiles_avatar_path_format
  check (
    avatar_path is null
    or (
      char_length(avatar_path) between 42 and 220
      and avatar_path ~ (
        '^' || id::text || '/[0-9a-f-]{36}[.](jpg|jpeg|png|webp)$'
      )
    )
  );

grant update (avatar_path) on table public.profiles to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-images',
  'profile-images',
  false,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function private.can_read_profile_avatar(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is not null
    and (
      private.is_onboarded_student(auth.uid())
      or private.current_user_role() = 'moderator'
    )
    and exists (
      select 1
      from public.profiles as profile
      where profile.avatar_path = p_name
        and profile.role = 'student'
        and profile.email_verified
        and profile.onboarding_completed_at is not null
    );
$$;

revoke execute on function private.can_read_profile_avatar(text) from public, anon;
grant execute on function private.can_read_profile_avatar(text) to authenticated, service_role;

drop policy if exists profile_images_storage_insert_owner on storage.objects;
create policy profile_images_storage_insert_owner
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-images'
  and owner_id = (select auth.uid()::text)
  and cardinality(storage.foldername(name)) = 1
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  and private.is_onboarded_student((select auth.uid()))
);

drop policy if exists profile_images_storage_select_visible on storage.objects;
create policy profile_images_storage_select_visible
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-images'
  and (
    (
      owner_id = (select auth.uid()::text)
      and (storage.foldername(name))[1] = (select auth.uid()::text)
    )
    or private.can_read_profile_avatar(name)
  )
);

drop policy if exists profile_images_storage_delete_owner on storage.objects;
create policy profile_images_storage_delete_owner
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-images'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create or replace view public.seller_profiles
with (security_barrier = true)
as
select
  profile.id,
  private.public_display_name(profile.full_name) as display_name,
  profile.program,
  profile.academic_year,
  profile.university,
  profile.created_at,
  profile.avatar_path
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

comment on column public.profiles.avatar_path is
  'Optional owner-scoped path in the private profile-images bucket. Null means render initials.';

comment on view public.seller_profiles is
  'Authenticated marketplace-safe seller facts. Excludes email, residence, auth metadata, full legal name, and moderators; includes an optional private profile photo path.';

revoke all on table public.seller_profiles from public, anon, authenticated;
grant select on table public.seller_profiles to authenticated, service_role;
