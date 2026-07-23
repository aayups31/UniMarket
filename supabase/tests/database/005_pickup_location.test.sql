begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;

select plan(10);

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
  '65000000-0000-4000-8000-000000000005',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'no-map@uwaterloo.ca',
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
  full_name = 'No Map Seller',
  program = 'Computer Science',
  academic_year = '3',
  residence_area = 'UWP',
  onboarding_completed_at = now()
where id = '65000000-0000-4000-8000-000000000005';

insert into public.listings (
  id,
  seller_id,
  title,
  description,
  price_cents,
  category_id,
  condition,
  pickup_area,
  pickup_latitude,
  pickup_longitude
)
values (
  '65100000-0000-4000-8000-000000000005',
  '65000000-0000-4000-8000-000000000005',
  'Address-only listing',
  'A complete listing that deliberately has no map coordinates.',
  2500,
  (select id from public.categories where slug = 'books'),
  'good',
  '200 University Ave W, Waterloo',
  null,
  null
);

select has_column('public', 'listings', 'pickup_latitude', 'listings has pickup latitude');
select has_column('public', 'listings', 'pickup_longitude', 'listings has pickup longitude');
select col_type_is(
  'public',
  'listings',
  'pickup_latitude',
  'double precision',
  'pickup latitude uses double precision'
);
select col_type_is(
  'public',
  'listings',
  'pickup_longitude',
  'double precision',
  'pickup longitude uses double precision'
);
select has_column(
  'public',
  'marketplace_listings',
  'pickup_latitude',
  'marketplace view exposes the public pickup latitude'
);
select has_column(
  'public',
  'marketplace_listings',
  'pickup_longitude',
  'marketplace view exposes the public pickup longitude'
);
select ok(
  to_regprocedure(
    'public.save_listing_draft(uuid,text,text,integer,smallint,public.listing_condition,boolean,text,double precision,double precision)'
  ) is not null,
  'the draft workflow accepts an optional pickup coordinate pair'
);
select ok(
  to_regprocedure(
    'public.save_listing_draft(uuid,text,text,integer,smallint,public.listing_condition,boolean,text)'
  ) is null,
  'the retired draft signature is not exposed alongside the current workflow'
);
select is(
  (
    select count(*)::integer
    from pg_constraint
    where conrelid = 'public.listings'::regclass
      and conname in (
        'listings_pickup_coordinates_paired',
        'listings_pickup_latitude_range',
        'listings_pickup_longitude_range'
      )
  ),
  3,
  'pickup coordinate integrity constraints are installed'
);

select lives_ok(
  $$
    select private.assert_publishable_fields(listing)
    from public.listings as listing
    where listing.id = '65100000-0000-4000-8000-000000000005'
  $$,
  'a complete address-only listing is publishable while the map is paused'
);

select * from finish();
rollback;
