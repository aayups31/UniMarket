-- Authentication boundary and private profile lifecycle.
--
-- Public student signups are restricted to the exact uwaterloo.ca domain. The
-- sole non-Waterloo path is an explicit, private allowlist intended for accounts
-- provisioned administratively (the initial moderator is seeded below).

create table private.admin_user_allowlist (
  email extensions.citext primary key,
  role public.user_role not null default 'moderator',
  is_active boolean not null default true,
  note text,
  created_at timestamptz not null default now(),

  constraint admin_user_allowlist_moderator_only
    check (role = 'moderator'),
  constraint admin_user_allowlist_email_format
    check (email::text ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  constraint admin_user_allowlist_note_length
    check (note is null or char_length(note) <= 500)
);

revoke all on table private.admin_user_allowlist from public, anon, authenticated;

insert into private.admin_user_allowlist (email, role, note)
values (
  'aayupsuw@gmail.com',
  'moderator',
  'Initial UniMarket moderator; create/invite this Auth user administratively.'
)
on conflict (email) do update
set
  role = excluded.role,
  is_active = true,
  note = excluded.note;

create or replace function private.is_allowed_auth_email(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    p_email is not null
    and p_email = btrim(p_email)
    and (
      p_email ~* '^[^[:space:]@]+@uwaterloo[.]ca$'
      or exists (
        select 1
        from private.admin_user_allowlist as allowlist
        where allowlist.email = p_email::extensions.citext
          and allowlist.is_active
      )
    );
$$;

create or replace function private.role_for_auth_email(p_email text)
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when exists (
      select 1
      from private.admin_user_allowlist as allowlist
      where allowlist.email = p_email::extensions.citext
        and allowlist.is_active
    ) then 'moderator'::public.user_role
    else 'student'::public.user_role
  end;
$$;

create or replace function private.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select profile.role
  from public.profiles as profile
  join auth.users as auth_user
    on auth_user.id = profile.id
  where profile.id = (select auth.uid())
    and profile.email_verified
    and auth_user.email_confirmed_at is not null
    and auth_user.email::extensions.citext = profile.email
    and (
      profile.role = 'student'
      or (
        profile.role = 'moderator'
        and exists (
          select 1
          from private.admin_user_allowlist as allowlist
          where allowlist.email = profile.email
            and allowlist.role = 'moderator'
            and allowlist.is_active
        )
      )
    );
$$;

create or replace function private.is_onboarded_student(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = p_user_id
      and profile.role = 'student'
      and profile.email_verified
      and profile.onboarding_completed_at is not null
      and profile.email::text ~* '^[^[:space:]@]+@uwaterloo[.]ca$'
  );
$$;

-- Configure this function as Authentication > Hooks > Before User Created on
-- hosted Supabase. Local development is wired in supabase/config.toml.
create or replace function public.hook_restrict_signup(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_email text := event -> 'user' ->> 'email';
begin
  if private.is_allowed_auth_email(v_email) then
    return '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'error',
    jsonb_build_object(
      'http_code', 403,
      'message', 'Use your @uwaterloo.ca email to join UniMarket.'
    )
  );
end;
$$;

revoke execute on function public.hook_restrict_signup(jsonb)
  from public, anon, authenticated;
grant execute on function public.hook_restrict_signup(jsonb)
  to supabase_auth_admin;

-- This trigger is defense in depth for admin/API paths that do not invoke the
-- Before User Created hook. Email is intentionally immutable after creation.
create or replace function private.enforce_auth_user_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.email is distinct from old.email then
    raise exception using
      errcode = '22023',
      message = 'UniMarket account email addresses cannot be changed.';
  end if;

  if not private.is_allowed_auth_email(new.email) then
    raise exception using
      errcode = '22023',
      message = 'UniMarket requires an @uwaterloo.ca email or an active administrative allowlist entry.';
  end if;

  return new;
end;
$$;

create trigger auth_users_enforce_email
before insert or update of email on auth.users
for each row execute function private.enforce_auth_user_email();

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_metadata_name text := nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '');
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    email_verified,
    role
  )
  values (
    new.id,
    case
      when char_length(v_metadata_name) between 2 and 120 then v_metadata_name
      else null
    end,
    new.email,
    new.email_confirmed_at is not null,
    private.role_for_auth_email(new.email)
  );

  return new;
end;
$$;

create trigger auth_users_create_profile
after insert on auth.users
for each row execute function private.handle_new_auth_user();

create or replace function private.sync_auth_verification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email_verified = new.email_confirmed_at is not null
  where id = new.id;

  return new;
end;
$$;

create trigger auth_users_sync_verification
after update of email_confirmed_at on auth.users
for each row
when (new.email_confirmed_at is distinct from old.email_confirmed_at)
execute function private.sync_auth_verification();

create or replace function private.protect_profile_system_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.email is distinct from old.email
    or new.created_at is distinct from old.created_at
  then
    raise exception using
      errcode = '42501',
      message = 'Profile identity and verified email cannot be changed.';
  end if;

  if new.role is distinct from old.role
    and new.role = 'moderator'
    and private.role_for_auth_email(new.email::text) <> 'moderator'
  then
    raise exception using
      errcode = '42501',
      message = 'Moderator roles require an active administrative allowlist entry.';
  end if;

  if current_user not in ('postgres', 'service_role', 'supabase_auth_admin') then
    if new.email_verified is distinct from old.email_verified
      or new.role is distinct from old.role
      or new.university is distinct from old.university
      or new.onboarding_completed_at is distinct from old.onboarding_completed_at
    then
      raise exception using
        errcode = '42501',
        message = 'System-managed profile fields cannot be changed.';
    end if;
  end if;

  return new;
end;
$$;

create trigger profiles_protect_system_fields
before update on public.profiles
for each row execute function private.protect_profile_system_fields();

create or replace function public.complete_onboarding(
  p_full_name text,
  p_program text,
  p_academic_year text,
  p_residence_area text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_auth_email text;
  v_confirmed_at timestamptz;
  v_profile public.profiles;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication is required.';
  end if;

  p_full_name := nullif(btrim(p_full_name), '');
  p_program := nullif(btrim(p_program), '');
  p_academic_year := nullif(btrim(p_academic_year), '');
  p_residence_area := nullif(btrim(p_residence_area), '');

  if p_full_name is null or char_length(p_full_name) not between 2 and 120 then
    raise exception using errcode = '22023', message = 'Full name must be between 2 and 120 characters.';
  end if;
  if p_program is null or char_length(p_program) not between 2 and 120 then
    raise exception using errcode = '22023', message = 'Program must be between 2 and 120 characters.';
  end if;
  if p_academic_year is null or char_length(p_academic_year) not between 1 and 40 then
    raise exception using errcode = '22023', message = 'Academic year is required.';
  end if;
  if p_residence_area is not null and char_length(p_residence_area) not between 2 and 120 then
    raise exception using errcode = '22023', message = 'Residence area must be between 2 and 120 characters.';
  end if;

  select auth_user.email, auth_user.email_confirmed_at
  into v_auth_email, v_confirmed_at
  from auth.users as auth_user
  where auth_user.id = v_user_id;

  if v_confirmed_at is null then
    raise exception using errcode = '42501', message = 'Verify your Waterloo email before onboarding.';
  end if;
  if v_auth_email !~* '^[^[:space:]@]+@uwaterloo[.]ca$' then
    raise exception using errcode = '42501', message = 'Only Waterloo student accounts can complete seller onboarding.';
  end if;

  select profile.*
  into v_profile
  from public.profiles as profile
  where profile.id = v_user_id
  for update;

  if not found or v_profile.role <> 'student' then
    raise exception using errcode = '42501', message = 'This account cannot complete student onboarding.';
  end if;

  update public.profiles
  set
    full_name = p_full_name,
    program = p_program,
    academic_year = p_academic_year,
    residence_area = p_residence_area,
    email_verified = true,
    onboarding_completed_at = coalesce(onboarding_completed_at, now())
  where id = v_user_id
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke execute on function public.complete_onboarding(text, text, text, text)
  from public, anon;
grant execute on function public.complete_onboarding(text, text, text, text)
  to authenticated;
