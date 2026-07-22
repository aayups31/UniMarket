begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;

select plan(6);

select has_column('public', 'profiles', 'avatar_path', 'profiles store an optional avatar path');

select has_column(
  'public',
  'seller_profiles',
  'avatar_path',
  'the privacy-safe seller view exposes only the avatar path'
);

select is(
  (select bucket.public from storage.buckets as bucket where bucket.id = 'profile-images'),
  false,
  'the profile image bucket is private'
);

select is(
  (select bucket.file_size_limit from storage.buckets as bucket where bucket.id = 'profile-images'),
  3145728::bigint,
  'profile photos are limited to 3 MiB'
);

select is(
  (
    select bucket.allowed_mime_types
    from storage.buckets as bucket
    where bucket.id = 'profile-images'
  ),
  array['image/jpeg', 'image/png', 'image/webp']::text[],
  'only the supported profile photo MIME types are accepted'
);

select has_function(
  'private',
  'can_read_profile_avatar',
  array['text'],
  'profile avatar visibility is decided by a dedicated private helper'
);

select * from finish();
rollback;
