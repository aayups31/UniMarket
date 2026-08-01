begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;

select plan(11);

select has_function(
  'public',
  'reserve_listing_image',
  array['uuid', 'uuid', 'text', 'bigint', 'integer', 'integer'],
  'the atomic image reservation RPC exists'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.reserve_listing_image(uuid,uuid,text,bigint,integer,integer)',
    'execute'
  ),
  'authenticated students can reserve listing images'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.reserve_listing_image(uuid,uuid,text,bigint,integer,integer)',
    'execute'
  ),
  'anonymous visitors cannot reserve listing images'
);

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
  '70000000-0000-4000-8000-000000000007',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'reservation.student@uwaterloo.ca',
  '',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  ''
);

update public.profiles
set
  full_name = 'Reservation Student',
  program = 'Systems Design Engineering',
  academic_year = '3',
  residence_area = 'UWP',
  onboarding_completed_at = now()
where id = '70000000-0000-4000-8000-000000000007';

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
values (
  '71000000-0000-4000-8000-000000000007',
  '70000000-0000-4000-8000-000000000007',
  'Reservation test listing',
  'A draft used to verify reliable and idempotent image reservations.',
  2500,
  (select id from public.categories where slug = 'electronics'),
  'good',
  'University of Waterloo'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '70000000-0000-4000-8000-000000000007', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"70000000-0000-4000-8000-000000000007","role":"authenticated"}',
  true
);

select is(
  (
    public.reserve_listing_image(
      '71000000-0000-4000-8000-000000000007',
      '72000000-0000-4000-8000-000000000001',
      'image/jpeg',
      1024
    )
  ).position,
  0,
  'the first image receives the first position'
);

select is(
  (
    public.reserve_listing_image(
      '71000000-0000-4000-8000-000000000007',
      '72000000-0000-4000-8000-000000000001',
      'image/jpeg',
      1024
    )
  ).id,
  '72000000-0000-4000-8000-000000000001'::uuid,
  'retrying a lost first response returns the same reservation'
);

select is(
  (
    select count(*)::integer
    from public.listing_images
    where listing_id = '71000000-0000-4000-8000-000000000007'
  ),
  1,
  'an idempotent retry does not create an orphan row'
);

select is(
  (
    public.reserve_listing_image(
      '71000000-0000-4000-8000-000000000007',
      '72000000-0000-4000-8000-000000000002',
      'image/jpeg',
      2048
    )
  ).position,
  1,
  'the next distinct image receives the next free position'
);

select throws_ok(
  $$
    select public.reserve_listing_image(
      '71000000-0000-4000-8000-000000000007',
      '72000000-0000-4000-8000-000000000001',
      'image/jpeg',
      2048
    )
  $$,
  '22023',
  'That image reservation cannot be reused.',
  'an image UUID cannot be rebound to different metadata'
);

select lives_ok(
  $$
    do $block$
    begin
      perform public.reserve_listing_image(
        '71000000-0000-4000-8000-000000000007',
        '72000000-0000-4000-8000-000000000003',
        'image/jpeg',
        1024
      );
      perform public.reserve_listing_image(
        '71000000-0000-4000-8000-000000000007',
        '72000000-0000-4000-8000-000000000004',
        'image/jpeg',
        1024
      );
      perform public.reserve_listing_image(
        '71000000-0000-4000-8000-000000000007',
        '72000000-0000-4000-8000-000000000005',
        'image/jpeg',
        1024
      );
      perform public.reserve_listing_image(
        '71000000-0000-4000-8000-000000000007',
        '72000000-0000-4000-8000-000000000006',
        'image/jpeg',
        1024
      );
    end
    $block$
  $$,
  'the listing can reserve all six image slots'
);

select throws_ok(
  $$
    select public.reserve_listing_image(
      '71000000-0000-4000-8000-000000000007',
      '72000000-0000-4000-8000-000000000007',
      'image/jpeg',
      1024
    )
  $$,
  '22023',
  'A listing can include up to six images.',
  'a seventh reservation is rejected atomically'
);

select set_config('request.jwt.claim.sub', '79999999-9999-4999-8999-999999999999', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"79999999-9999-4999-8999-999999999999","role":"authenticated"}',
  true
);

select throws_ok(
  $$
    select public.reserve_listing_image(
      '71000000-0000-4000-8000-000000000007',
      '72999999-9999-4999-8999-999999999999',
      'image/jpeg',
      1024
    )
  $$,
  '42501',
  'This listing is no longer editable.',
  'another student cannot reserve an owner image path'
);

select * from finish();
rollback;
