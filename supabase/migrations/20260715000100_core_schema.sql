-- UniMarket core schema
--
-- Draft listings intentionally permit incomplete fields. The publish_listing RPC
-- in a later migration is the only supported draft -> published transition and
-- performs the stricter cross-table validation atomically.

create schema if not exists extensions;
create extension if not exists citext with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
alter default privileges in schema private revoke execute on functions from public;

create type public.user_role as enum (
  'student',
  'moderator'
);

create type public.listing_condition as enum (
  'new',
  'like_new',
  'good',
  'fair',
  'well_used'
);

create type public.listing_status as enum (
  'draft',
  'published',
  'sold',
  'archived',
  'removed'
);

create type public.image_upload_status as enum (
  'pending',
  'uploaded',
  'failed'
);

create type public.moderation_action as enum (
  'listing_removed'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email extensions.citext not null unique,
  program text,
  academic_year text,
  residence_area text,
  university text not null default 'University of Waterloo',
  email_verified boolean not null default false,
  role public.user_role not null default 'student',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_full_name_length
    check (full_name is null or char_length(btrim(full_name)) between 2 and 120),
  constraint profiles_program_length
    check (program is null or char_length(btrim(program)) between 2 and 120),
  constraint profiles_academic_year_length
    check (academic_year is null or char_length(btrim(academic_year)) between 1 and 40),
  constraint profiles_residence_area_length
    check (residence_area is null or char_length(btrim(residence_area)) between 2 and 120),
  constraint profiles_university_value
    check (university = 'University of Waterloo'),
  constraint profiles_onboarding_fields
    check (
      onboarding_completed_at is null
      or (
        full_name is not null
        and program is not null
        and academic_year is not null
        and email_verified
        and role = 'student'
      )
    )
);

comment on table public.profiles is
  'Private account profile. Marketplace-safe seller fields are exposed through seller_profiles.';
comment on column public.profiles.residence_area is
  'Private broad residence area collected during onboarding; never expose through marketplace views.';

create table public.categories (
  id smallint generated always as identity primary key,
  slug text not null unique,
  name text not null unique,
  icon text not null,
  sort_order smallint not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),

  constraint categories_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint categories_name_length
    check (char_length(btrim(name)) between 2 and 60),
  constraint categories_icon_length
    check (char_length(icon) between 1 and 16),
  constraint categories_sort_order_positive
    check (sort_order > 0)
);

create table public.pickup_areas (
  id smallint generated always as identity primary key,
  slug text not null unique,
  name text not null unique,
  sort_order smallint not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),

  constraint pickup_areas_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint pickup_areas_name_length
    check (char_length(btrim(name)) between 2 and 120),
  constraint pickup_areas_sort_order_positive
    check (sort_order > 0)
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default '',
  description text not null default '',
  price_cents integer,
  category_id smallint references public.categories (id) on delete restrict,
  condition public.listing_condition,
  open_to_offers boolean not null default false,
  pickup_area text not null default '',
  status public.listing_status not null default 'draft',
  featured_at timestamptz,
  published_at timestamptz,
  removed_at timestamptz,
  removed_by uuid references public.profiles (id) on delete set null,
  removal_reason text,
  version integer not null default 1,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A')
    || setweight(to_tsvector('english'::regconfig, coalesce(description, '')), 'B')
    || setweight(to_tsvector('simple'::regconfig, coalesce(pickup_area, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint listings_title_length
    check (char_length(title) <= 100),
  constraint listings_description_length
    check (char_length(description) <= 5000),
  constraint listings_price_range
    check (price_cents is null or price_cents between 0 and 100000000),
  constraint listings_pickup_area_length
    check (char_length(pickup_area) <= 120),
  constraint listings_version_positive
    check (version > 0),
  constraint listings_published_timestamp
    check (status <> 'published' or published_at is not null),
  constraint listings_removal_metadata
    check (
      (status = 'removed' and removed_at is not null and removal_reason is not null)
      or
      (status <> 'removed' and removed_at is null and removed_by is null and removal_reason is null)
    ),
  constraint listings_removal_reason_length
    check (removal_reason is null or char_length(btrim(removal_reason)) between 10 and 500)
);

comment on column public.listings.price_cents is
  'Integer CAD cents. Nullable while a listing is a draft.';
comment on column public.listings.pickup_area is
  'Broad pickup area only; exact addresses must never be stored on a listing.';
comment on column public.listings.featured_at is
  'Set only by privileged server-side/admin workflows.';

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null unique,
  position smallint not null,
  upload_status public.image_upload_status not null default 'pending',
  mime_type text not null,
  size_bytes bigint not null,
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint listing_images_listing_position_key
    unique (listing_id, position) deferrable initially deferred,
  constraint listing_images_position_range
    check (position between 0 and 7),
  constraint listing_images_storage_path_length
    check (char_length(storage_path) between 10 and 500),
  constraint listing_images_mime_type
    check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  constraint listing_images_size_range
    check (size_bytes between 1 and 10485760),
  constraint listing_images_width_range
    check (width is null or width between 1 and 20000),
  constraint listing_images_height_range
    check (height is null or height between 1 and 20000)
);

comment on table public.listing_images is
  'Ordered metadata for objects in the private listing-images Storage bucket. Positions 0-7 enforce the eight-image limit.';

create table public.moderation_events (
  id bigint generated always as identity primary key,
  moderator_id uuid references public.profiles (id) on delete set null,
  listing_id uuid references public.listings (id) on delete set null,
  seller_id uuid,
  listing_title text not null,
  action public.moderation_action not null,
  reason text not null,
  created_at timestamptz not null default now(),

  constraint moderation_events_title_length
    check (char_length(listing_title) between 1 and 100),
  constraint moderation_events_reason_length
    check (char_length(btrim(reason)) between 10 and 500)
);

comment on table public.moderation_events is
  'Append-only moderation audit. Snapshot fields survive later listing/account deletion.';

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.touch_listing()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.version := old.version + 1;
  return new;
end;
$$;

create or replace function private.prevent_moderation_event_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user <> 'postgres' then
    raise exception using
      errcode = '42501',
      message = 'Moderation audit events are append-only.';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger listings_touch
before update on public.listings
for each row execute function private.touch_listing();

create trigger listing_images_set_updated_at
before update on public.listing_images
for each row execute function private.set_updated_at();

create trigger moderation_events_append_only
before update or delete on public.moderation_events
for each row execute function private.prevent_moderation_event_changes();

create index profiles_role_onboarding_idx
  on public.profiles (role, onboarding_completed_at)
  where role = 'student';

create index listings_seller_status_updated_idx
  on public.listings (seller_id, status, updated_at desc);

create index listings_published_cursor_idx
  on public.listings (published_at desc, id desc)
  where status = 'published';

create index listings_category_published_idx
  on public.listings (category_id, published_at desc, id desc)
  where status = 'published';

create index listings_featured_idx
  on public.listings (featured_at desc, id desc)
  where status = 'published' and featured_at is not null;

create index listings_search_vector_idx
  on public.listings using gin (search_vector);

create index listings_title_trgm_idx
  on public.listings using gin (title extensions.gin_trgm_ops);

create index listings_description_trgm_idx
  on public.listings using gin (description extensions.gin_trgm_ops);

create index categories_name_trgm_idx
  on public.categories using gin (name extensions.gin_trgm_ops);

create index listing_images_listing_position_idx
  on public.listing_images (listing_id, position);

create index moderation_events_listing_created_idx
  on public.moderation_events (listing_id, created_at desc);

create index moderation_events_moderator_created_idx
  on public.moderation_events (moderator_id, created_at desc);

-- These rows are product configuration, so they are migrated to every
-- environment (seed.sql repeats them idempotently for local development).
insert into public.categories (slug, name, icon, sort_order)
values
  ('electronics', 'Electronics', '💻', 1),
  ('books', 'Books', '📚', 2),
  ('household-items', 'Household Items', '🏠', 3),
  ('clothing', 'Clothing', '👕', 4)
on conflict (slug) do update
set
  name = excluded.name,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.pickup_areas (slug, name, sort_order)
values
  ('icon', 'ICON', 1),
  ('uwp', 'UWP', 2),
  ('rev', 'REV', 3),
  ('cmh', 'CMH', 4),
  ('v1', 'V1', 5),
  ('lester-street', 'Lester Street', 6),
  ('university-plaza', 'University Plaza', 7),
  ('waterloo-campus', 'Waterloo Campus', 8)
on conflict (slug) do update
set
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_active = true;
