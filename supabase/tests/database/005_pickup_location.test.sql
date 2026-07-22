begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;

select plan(9);

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

select * from finish();
rollback;
