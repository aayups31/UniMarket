-- Close the temporary non-Waterloo authentication exception.
--
-- Every interactive account, including moderators, must now use the exact
-- @uwaterloo.ca domain. Moderator authorization can still be provisioned by a
-- trusted administrator through private.admin_user_allowlist, but that table
-- may contain Waterloo addresses only.

delete from private.admin_user_allowlist
where email::text !~* '^[^[:space:]@]+@uwaterloo[.]ca$';

alter table private.admin_user_allowlist
  drop constraint if exists admin_user_allowlist_email_format;

alter table private.admin_user_allowlist
  add constraint admin_user_allowlist_waterloo_email
    check (email::text ~* '^[^[:space:]@]+@uwaterloo[.]ca$');

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
    and p_email ~* '^[^[:space:]@]+@uwaterloo[.]ca$';
$$;

create or replace function private.role_for_auth_email(p_email text)
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when p_email ~* '^[^[:space:]@]+@uwaterloo[.]ca$'
      and exists (
        select 1
        from private.admin_user_allowlist as allowlist
        where allowlist.email = p_email::extensions.citext
          and allowlist.is_active
      )
    then 'moderator'::public.user_role
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
    and profile.email::text ~* '^[^[:space:]@]+@uwaterloo[.]ca$'
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
      message = 'UniMarket requires an @uwaterloo.ca email address.';
  end if;

  return new;
end;
$$;

-- Existing non-Waterloo profiles cannot receive application authorization even
-- if an old Auth session survives. The Auth user is left intact for a trusted
-- administrator to review or remove explicitly.
update public.profiles
set email_verified = false
where email::text !~* '^[^[:space:]@]+@uwaterloo[.]ca$';

comment on function public.hook_restrict_signup(jsonb) is
  'Before-user-created Auth hook. Allows only the exact @uwaterloo.ca domain.';
