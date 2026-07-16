begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;

select plan(25);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '50000000-0000-4000-8000-000000000005',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'workflow.student@uwaterloo.ca',
  '',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

update public.profiles
set
  full_name = 'Workflow Student',
  program = 'Computer Science',
  academic_year = '3',
  residence_area = 'UWP',
  onboarding_completed_at = now()
where id = '50000000-0000-4000-8000-000000000005';

insert into public.listings (
  id,
  seller_id,
  title,
  description,
  price_cents,
  category_id,
  condition,
  pickup_area
)
values
  (
    '51000000-0000-4000-8000-000000000005',
    '50000000-0000-4000-8000-000000000005',
    'Publish workflow book',
    'A complete listing used to validate the publishing workflow.',
    2500,
    (select id from public.categories where slug = 'books'),
    'good',
    'Waterloo Campus'
  ),
  (
    '53000000-0000-4000-8000-000000000005',
    '50000000-0000-4000-8000-000000000005',
    'Moderation race book',
    'A complete listing used to validate Storage cleanup after removal.',
    3000,
    (select id from public.categories where slug = 'books'),
    'good',
    'University Plaza'
  );

-- Reserve metadata paths before uploading, matching the application flow.
insert into public.listing_images (
  listing_id,
  storage_path,
  position,
  upload_status,
  mime_type,
  size_bytes
)
values
  (
    '51000000-0000-4000-8000-000000000005',
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg',
    0,
    'pending',
    'image/jpeg',
    1024
  ),
  (
    '51000000-0000-4000-8000-000000000005',
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/second.jpg',
    1,
    'pending',
    'image/jpeg',
    1024
  ),
  (
    '53000000-0000-4000-8000-000000000005',
    '50000000-0000-4000-8000-000000000005/53000000-0000-4000-8000-000000000005/base.jpg',
    0,
    'pending',
    'image/jpeg',
    1024
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-4000-8000-000000000005', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"50000000-0000-4000-8000-000000000005","role":"authenticated"}',
  true
);

select is(
  private.can_insert_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/unregistered.jpg'
  ),
  false,
  'Storage rejects a safe-looking path without pending metadata'
);

select throws_ok(
  $$
    insert into public.listing_images (
      listing_id,
      storage_path,
      position,
      upload_status,
      mime_type,
      size_bytes
    ) values (
      '51000000-0000-4000-8000-000000000005',
      '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/bad name.jpg',
      2,
      'pending',
      'image/jpeg',
      1024
    )
  $$,
  '22023',
  'Image paths must use seller-id/listing-id/file-name with an allowed extension.',
  'pending metadata enforces the safe filename contract'
);

select ok(
  private.can_insert_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg'
  ),
  'the first exact pending reservation can be uploaded'
);

select ok(
  private.can_insert_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/second.jpg'
  ),
  'multiple exact pending reservations support multi-file upload'
);

select lives_ok(
  $$
    insert into storage.objects (bucket_id, name, owner_id, metadata)
    values (
      'listing-images',
      '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg',
      '50000000-0000-4000-8000-000000000005',
      '{"mimetype":"image/jpeg","size":1024}'::jsonb
    )
  $$,
  'the actual Storage INSERT policy accepts a matching pending reservation'
);

reset role;
insert into storage.objects (bucket_id, name, owner_id, metadata)
values
  (
    'listing-images',
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/second.jpg',
    '50000000-0000-4000-8000-000000000005',
    '{"mimetype":"image/jpeg","size":1024}'::jsonb
  ),
  (
    'listing-images',
    '50000000-0000-4000-8000-000000000005/53000000-0000-4000-8000-000000000005/base.jpg',
    '50000000-0000-4000-8000-000000000005',
    '{"mimetype":"image/jpeg","size":1024}'::jsonb
  );

set local role authenticated;

select lives_ok(
  $$
    update public.listing_images
    set upload_status = 'uploaded'
    where listing_id = '51000000-0000-4000-8000-000000000005'
  $$,
  'finalizing metadata verifies both uploaded main-listing objects'
);

select lives_ok(
  $$
    update public.listing_images
    set upload_status = 'uploaded'
    where listing_id = '53000000-0000-4000-8000-000000000005'
  $$,
  'finalizing metadata verifies the moderation-race object'
);

insert into public.listing_images (
  listing_id,
  storage_path,
  position,
  upload_status,
  mime_type,
  size_bytes
)
values (
  '51000000-0000-4000-8000-000000000005',
  '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/mismatch.jpg',
  2,
  'pending',
  'image/jpeg',
  1024
);

reset role;
insert into storage.objects (bucket_id, name, owner_id, metadata)
values (
  'listing-images',
  '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/mismatch.jpg',
  '50000000-0000-4000-8000-000000000005',
  '{"mimetype":"image/png","size":1024}'::jsonb
);
set local role authenticated;

select throws_ok(
  $$
    update public.listing_images
    set upload_status = 'uploaded'
    where storage_path = '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/mismatch.jpg'
  $$,
  '22023',
  'Image extension and MIME type do not match.',
  'finalization rejects an authoritative Storage MIME that conflicts with the extension'
);

reset role;
delete from storage.objects
where bucket_id = 'listing-images'
  and name = '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/mismatch.jpg';
delete from public.listing_images
where storage_path = '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/mismatch.jpg';
set local role authenticated;

select is(
  private.can_insert_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg'
  ),
  false,
  'an uploaded reservation cannot be overwritten at the same path'
);

select lives_ok(
  $$ select public.publish_listing('51000000-0000-4000-8000-000000000005') $$,
  'a complete draft publishes through the owner RPC'
);

select is(
  (
    select status
    from public.listings
    where id = '51000000-0000-4000-8000-000000000005'
  ),
  'published'::public.listing_status,
  'the publish RPC moves a draft to published'
);

select lives_ok(
  $$ select public.publish_listing('53000000-0000-4000-8000-000000000005') $$,
  'the moderation-race fixture publishes before its replacement upload'
);

select lives_ok(
  $$
    insert into public.listing_images (
      listing_id,
      storage_path,
      position,
      upload_status,
      mime_type,
      size_bytes
    ) values (
      '53000000-0000-4000-8000-000000000005',
      '50000000-0000-4000-8000-000000000005/53000000-0000-4000-8000-000000000005/replacement.jpg',
      1,
      'pending',
      'image/jpeg',
      1024
    )
  $$,
  'a published listing can reserve a replacement path'
);

select ok(
  private.can_insert_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/53000000-0000-4000-8000-000000000005/replacement.jpg'
  ),
  'the published replacement reservation can be uploaded'
);

reset role;
insert into storage.objects (bucket_id, name, owner_id, metadata)
values (
  'listing-images',
  '50000000-0000-4000-8000-000000000005/53000000-0000-4000-8000-000000000005/replacement.jpg',
  '50000000-0000-4000-8000-000000000005',
  '{"mimetype":"image/jpeg","size":1024}'::jsonb
);

-- Simulate moderation winning the race before the pending replacement is
-- finalized. The owner must be able to clean up only that non-visible object.
update public.listings
set
  status = 'removed',
  removed_at = now(),
  removal_reason = 'Removed during the pending upload regression test.'
where id = '53000000-0000-4000-8000-000000000005';

set local role authenticated;

select ok(
  private.can_delete_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/53000000-0000-4000-8000-000000000005/replacement.jpg'
  ),
  'a pending object remains cleanable after its listing is removed'
);

select is(
  private.can_delete_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/53000000-0000-4000-8000-000000000005/base.jpg'
  ),
  false,
  'an uploaded object on a removed listing remains protected as evidence'
);

select is(
  private.can_delete_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg'
  ),
  false,
  'an object cannot be deleted while published metadata references it'
);

select results_eq(
  $$
    delete from storage.objects
    where bucket_id = 'listing-images'
      and name = '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg'
    returning name
  $$,
  $$ select null::text where false $$,
  'the actual Storage DELETE policy hides a referenced published object'
);

select lives_ok(
  $$
    delete from public.listing_images
    where storage_path = '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg'
  $$,
  'published image metadata can be detached when another image remains'
);

select ok(
  private.can_delete_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg'
  ),
  'the detached object can then be deleted'
);

select results_eq(
  $$
    delete from storage.objects
    where bucket_id = 'listing-images'
      and name = '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg'
    returning name
  $$,
  $$
    select '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/first.jpg'::text
  $$,
  'metadata-first detachment lets the actual Storage DELETE policy remove the object'
);

select is(
  private.can_delete_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/second.jpg'
  ),
  false,
  'the last attached object remains protected on a published listing'
);

select lives_ok(
  $$
    update public.listings
    set status = 'archived'
    where id = '51000000-0000-4000-8000-000000000005'
  $$,
  'an owner can archive a published listing'
);

select throws_ok(
  $$ select public.publish_listing('51000000-0000-4000-8000-000000000005') $$,
  '42501',
  'Only draft listings can be published.',
  'an archived listing cannot be republished through the draft-only RPC'
);

select ok(
  private.can_delete_listing_storage_object(
    '50000000-0000-4000-8000-000000000005/51000000-0000-4000-8000-000000000005/second.jpg'
  ),
  'archiving permits Storage-first cleanup of attached objects'
);

select * from finish();
rollback;
