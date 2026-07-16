begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;

select plan(15);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'listings', 'listings table exists');
select has_table('public', 'listing_images', 'listing_images table exists');
select has_table('public', 'moderation_events', 'moderation_events table exists');
select has_view('public', 'seller_profiles', 'seller_profiles view exists');
select has_function('public', 'get_listing_contact_email', array['uuid'], 'explicit seller contact RPC exists');

select is(
  (select count(*)::integer from public.categories where is_active),
  4,
  'the four MVP categories are active'
);

select is(
  (select count(*)::integer from public.pickup_areas where is_active),
  11,
  'the eleven broad Waterloo pickup choices are active'
);

select is(
  public.hook_restrict_signup(
    '{"user":{"email":"student@uwaterloo.ca"}}'::jsonb
  ),
  '{}'::jsonb,
  'the signup hook accepts the exact Waterloo domain'
);

select is(
  public.hook_restrict_signup(
    '{"user":{"email":"STUDENT@UWATERLOO.CA"}}'::jsonb
  ),
  '{}'::jsonb,
  'the signup domain comparison is case-insensitive'
);

select is(
  public.hook_restrict_signup(
    '{"user":{"email":"aayupsuw@gmail.com"}}'::jsonb
  ),
  '{}'::jsonb,
  'the explicitly allowlisted moderator email is accepted'
);

select is(
  public.hook_restrict_signup(
    '{"user":{"email":"student@notuwaterloo.ca"}}'::jsonb
  ) #>> '{error,http_code}',
  '403',
  'a lookalike domain is rejected'
);

select is(
  (select bucket.public from storage.buckets as bucket where bucket.id = 'listing-images'),
  false,
  'the listing image bucket is private'
);

select is(
  (select bucket.file_size_limit from storage.buckets as bucket where bucket.id = 'listing-images'),
  5242880::bigint,
  'the listing image bucket has a 5 MiB limit'
);

select is(
  (
    select relation.relrowsecurity
    from pg_class as relation
    join pg_namespace as namespace on namespace.oid = relation.relnamespace
    where namespace.nspname = 'public'
      and relation.relname = 'listings'
  ),
  true,
  'RLS is enabled on listings'
);

select * from finish();
rollback;
