-- Private, listing-linked conversations for verified Waterloo students.
--
-- A conversation always starts from a published listing. The listing title and
-- cover path are snapshotted so the exchange still has context if the seller
-- later deletes the listing. Message writes are RPC-only: the caller never
-- supplies a buyer, seller, or sender identity.

-- Email addresses are no longer part of buyer/seller contact. The app keeps a
-- redirect at the old URL, while the database removes the email-returning RPC.
drop function if exists public.get_listing_contact_email(uuid);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete set null,
  listing_title_snapshot text not null,
  listing_cover_path_snapshot text,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  buyer_last_read_at timestamptz not null default now(),
  seller_last_read_at timestamptz not null default now(),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint conversations_distinct_participants
    check (buyer_id <> seller_id),
  constraint conversations_listing_title_length
    check (char_length(btrim(listing_title_snapshot)) between 1 and 100),
  constraint conversations_listing_cover_path_length
    check (
      listing_cover_path_snapshot is null
      or char_length(listing_cover_path_snapshot) between 10 and 500
    ),
  constraint conversations_listing_buyer_key
    unique (listing_id, buyer_id)
);

comment on table public.conversations is
  'Private buyer/seller thread for one listing. Listing fields are snapshotted for durable context.';

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),

  constraint messages_body_length
    check (char_length(body) between 1 and 2000),
  constraint messages_body_trimmed
    check (body = btrim(body))
);

comment on table public.messages is
  'Immutable text messages visible only to the two conversation participants.';

create index conversations_buyer_activity_idx
  on public.conversations (buyer_id, last_message_at desc nulls last, created_at desc);
create index conversations_seller_activity_idx
  on public.conversations (seller_id, last_message_at desc nulls last, created_at desc);
create index messages_conversation_timeline_idx
  on public.messages (conversation_id, created_at desc, id desc);
create index messages_sender_rate_idx
  on public.messages (sender_id, created_at desc);

create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function private.set_updated_at();

create or replace function private.prevent_message_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user not in ('postgres', 'service_role', 'supabase_auth_admin') then
    raise exception using
      errcode = '42501',
      message = 'Messages cannot be changed after they are sent.';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger messages_are_immutable
before update or delete on public.messages
for each row execute function private.prevent_message_changes();

alter table public.conversations enable row level security;
alter table public.conversations force row level security;
alter table public.messages enable row level security;
alter table public.messages force row level security;

revoke all on table public.conversations from public, anon, authenticated;
revoke all on table public.messages from public, anon, authenticated;
grant select on table public.conversations to authenticated;
grant select on table public.messages to authenticated;
grant all on table public.conversations to service_role;
grant all on table public.messages to service_role;

create policy conversations_read_participant
on public.conversations
for select
to authenticated
using (
  private.is_onboarded_student((select auth.uid()))
  and (
    buyer_id = (select auth.uid())
    or seller_id = (select auth.uid())
  )
);

create policy messages_read_participant
on public.messages
for select
to authenticated
using (
  private.is_onboarded_student((select auth.uid()))
  and exists (
    select 1
    from public.conversations as conversation
    where conversation.id = messages.conversation_id
      and (
        conversation.buyer_id = (select auth.uid())
        or conversation.seller_id = (select auth.uid())
      )
  )
);

create or replace function public.start_listing_conversation(p_listing_id uuid)
returns public.conversations
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_listing public.listings;
  v_cover_path text;
  v_conversation public.conversations;
begin
  if v_user_id is null or not private.is_onboarded_student(v_user_id) then
    raise exception using
      errcode = '42501',
      message = 'A verified Waterloo student account is required.';
  end if;

  select listing.*
  into v_listing
  from public.listings as listing
  where listing.id = p_listing_id
    and listing.status = 'published'
  for share;

  if not found then
    raise exception using errcode = 'P0002', message = 'That listing is unavailable.';
  end if;
  if v_listing.seller_id = v_user_id then
    raise exception using errcode = '22023', message = 'You cannot message your own listing.';
  end if;

  select conversation.*
  into v_conversation
  from public.conversations as conversation
  where conversation.listing_id = v_listing.id
    and conversation.buyer_id = v_user_id;

  if found then
    return v_conversation;
  end if;

  if (
    select count(*)
    from public.conversations as recent
    where recent.buyer_id = v_user_id
      and recent.created_at > clock_timestamp() - interval '1 hour'
  ) >= 20 then
    raise exception using
      errcode = 'P0001',
      message = 'Please wait before starting more conversations.';
  end if;

  select image.storage_path
  into v_cover_path
  from public.listing_images as image
  where image.listing_id = v_listing.id
    and image.upload_status = 'uploaded'
  order by image.position
  limit 1;

  insert into public.conversations (
    listing_id,
    listing_title_snapshot,
    listing_cover_path_snapshot,
    buyer_id,
    seller_id
  )
  values (
    v_listing.id,
    v_listing.title,
    v_cover_path,
    v_user_id,
    v_listing.seller_id
  )
  on conflict (listing_id, buyer_id) do nothing
  returning * into v_conversation;

  if v_conversation.id is null then
    select conversation.*
    into strict v_conversation
    from public.conversations as conversation
    where conversation.listing_id = v_listing.id
      and conversation.buyer_id = v_user_id;
  end if;

  return v_conversation;
end;
$$;

create or replace function public.send_conversation_message(
  p_conversation_id uuid,
  p_body text
)
returns public.messages
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_conversation public.conversations;
  v_message public.messages;
begin
  if v_user_id is null or not private.is_onboarded_student(v_user_id) then
    raise exception using
      errcode = '42501',
      message = 'A verified Waterloo student account is required.';
  end if;

  p_body := btrim(coalesce(p_body, ''));
  if char_length(p_body) not between 1 and 2000 then
    raise exception using
      errcode = '22023',
      message = 'Messages must be between 1 and 2,000 characters.';
  end if;

  select conversation.*
  into v_conversation
  from public.conversations as conversation
  where conversation.id = p_conversation_id
    and v_user_id in (conversation.buyer_id, conversation.seller_id)
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'That conversation is unavailable.';
  end if;

  if v_conversation.listing_id is not null and exists (
    select 1
    from public.listings as listing
    where listing.id = v_conversation.listing_id
      and listing.status = 'removed'
  ) then
    raise exception using
      errcode = '42501',
      message = 'Messaging is unavailable for this listing.';
  end if;

  -- A short database-side guard limits accidental double submits and basic
  -- automated flooding without affecting ordinary conversation cadence.
  if exists (
    select 1
    from public.messages as recent
    where recent.sender_id = v_user_id
      and recent.created_at > clock_timestamp() - interval '500 milliseconds'
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'Please wait a moment before sending another message.';
  end if;

  if (
    select count(*)
    from public.messages as recent
    where recent.sender_id = v_user_id
      and recent.created_at > clock_timestamp() - interval '1 minute'
  ) >= 60 then
    raise exception using
      errcode = 'P0001',
      message = 'Please wait before sending more messages.';
  end if;

  insert into public.messages (conversation_id, sender_id, body)
  values (v_conversation.id, v_user_id, p_body)
  returning * into v_message;

  update public.conversations
  set
    last_message_at = v_message.created_at,
    buyer_last_read_at = case
      when buyer_id = v_user_id then v_message.created_at
      else buyer_last_read_at
    end,
    seller_last_read_at = case
      when seller_id = v_user_id then v_message.created_at
      else seller_last_read_at
    end
  where id = v_conversation.id;

  return v_message;
end;
$$;

create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_read_at timestamptz := clock_timestamp();
begin
  if v_user_id is null or not private.is_onboarded_student(v_user_id) then
    raise exception using
      errcode = '42501',
      message = 'A verified Waterloo student account is required.';
  end if;

  update public.conversations
  set
    buyer_last_read_at = case
      when buyer_id = v_user_id then v_read_at
      else buyer_last_read_at
    end,
    seller_last_read_at = case
      when seller_id = v_user_id then v_read_at
      else seller_last_read_at
    end
  where id = p_conversation_id
    and v_user_id in (buyer_id, seller_id);

  if not found then
    raise exception using errcode = '42501', message = 'That conversation is unavailable.';
  end if;

  return v_read_at;
end;
$$;

create or replace function public.get_unread_message_count()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(count(message.id), 0)::integer
  from public.conversations as conversation
  join public.messages as message
    on message.conversation_id = conversation.id
  where private.is_onboarded_student((select auth.uid()))
    and (
      conversation.buyer_id = (select auth.uid())
      or conversation.seller_id = (select auth.uid())
    )
    and message.sender_id <> (select auth.uid())
    and message.created_at > case
      when conversation.buyer_id = (select auth.uid())
        then conversation.buyer_last_read_at
      else conversation.seller_last_read_at
    end;
$$;

revoke execute on function public.start_listing_conversation(uuid)
  from public, anon;
revoke execute on function public.send_conversation_message(uuid, text)
  from public, anon;
revoke execute on function public.mark_conversation_read(uuid)
  from public, anon;
revoke execute on function public.get_unread_message_count()
  from public, anon;
grant execute on function public.start_listing_conversation(uuid)
  to authenticated;
grant execute on function public.send_conversation_message(uuid, text)
  to authenticated;
grant execute on function public.mark_conversation_read(uuid)
  to authenticated;
grant execute on function public.get_unread_message_count()
  to authenticated;

-- The view exposes only participant-safe identity and listing context. It uses
-- an explicit auth.uid() predicate because views execute with their owner's
-- base-table privileges unless configured otherwise.
create view public.inbox_conversations
with (security_barrier = true)
as
select
  conversation.id,
  listing.id as listing_id,
  coalesce(listing.title, conversation.listing_title_snapshot) as listing_title,
  coalesce(current_cover.storage_path, conversation.listing_cover_path_snapshot)
    as cover_image_path,
  listing.status as listing_status,
  conversation.buyer_id,
  conversation.seller_id,
  case
    when conversation.buyer_id = auth.uid() then conversation.seller_id
    else conversation.buyer_id
  end as counterpart_id,
  private.public_display_name(
    case
      when conversation.buyer_id = auth.uid() then seller.full_name
      else buyer.full_name
    end
  ) as counterpart_name,
  latest.id as last_message_id,
  latest.sender_id as last_message_sender_id,
  latest.body as last_message_body,
  latest.created_at as last_message_created_at,
  unread.unread_count,
  conversation.last_message_at,
  conversation.created_at,
  conversation.updated_at
from public.conversations as conversation
join public.profiles as buyer on buyer.id = conversation.buyer_id
join public.profiles as seller on seller.id = conversation.seller_id
left join public.listings as listing on listing.id = conversation.listing_id
left join lateral (
  select image.storage_path
  from public.listing_images as image
  where image.listing_id = listing.id
    and image.upload_status = 'uploaded'
  order by image.position
  limit 1
) as current_cover on true
left join lateral (
  select message.id, message.sender_id, message.body, message.created_at
  from public.messages as message
  where message.conversation_id = conversation.id
  order by message.created_at desc, message.id desc
  limit 1
) as latest on true
cross join lateral (
  select count(*)::bigint as unread_count
  from public.messages as unread_message
  where unread_message.conversation_id = conversation.id
    and unread_message.sender_id <> auth.uid()
    and unread_message.created_at > case
      when conversation.buyer_id = auth.uid() then conversation.buyer_last_read_at
      else conversation.seller_last_read_at
    end
) as unread
where private.is_onboarded_student((select auth.uid()))
  and (
    conversation.buyer_id = (select auth.uid())
    or conversation.seller_id = (select auth.uid())
  );

comment on view public.inbox_conversations is
  'Participant-only inbox summaries with safe counterpart identity and no email or private profile fields.';

revoke all on table public.inbox_conversations from public, anon, authenticated;
grant select on table public.inbox_conversations to authenticated, service_role;

-- Participants retain access to the listing thumbnail in an existing chat
-- after it becomes sold or archived. Moderation-removed images remain hidden.
create or replace function private.can_read_conversation_listing_object(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_onboarded_student((select auth.uid()))
    and exists (
      select 1
      from public.conversations as conversation
      left join public.listings as listing on listing.id = conversation.listing_id
      where conversation.listing_cover_path_snapshot = p_name
        and (listing.id is null or listing.status in ('published', 'sold', 'archived'))
        and (
          conversation.buyer_id = (select auth.uid())
          or conversation.seller_id = (select auth.uid())
        )
    );
$$;

revoke execute on function private.can_read_conversation_listing_object(text)
  from public, anon;
grant execute on function private.can_read_conversation_listing_object(text)
  to authenticated;

create policy listing_images_storage_select_conversation_participant
on storage.objects
for select
to authenticated
using (
  bucket_id = 'listing-images'
  and private.can_read_conversation_listing_object(name)
);

-- Postgres Changes powers the active thread and unread badge. The block is
-- safe in local/test environments where the publication may not exist yet.
do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'conversations'
    ) then
      alter publication supabase_realtime add table public.conversations;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'messages'
    ) then
      alter publication supabase_realtime add table public.messages;
    end if;
  end if;
end;
$$;
