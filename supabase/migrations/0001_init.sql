-- Supernova initial schema: profiles, articles, comments, forum, storage.
-- Run this once against a fresh Supabase project (SQL editor or `supabase db push`).

-- ============================================================================
-- Enums
-- ============================================================================
create type game_code as enum ('aov', 'mol', 'val');
create type article_category as enum ('news', 'event', 'gaming_gear', 'aov', 'mol', 'val');
create type user_role as enum ('user', 'admin');

-- ============================================================================
-- profiles
-- ============================================================================
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  display_name text,
  avatar_url   text,
  bio          text,
  role         user_role not null default 'user',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index profiles_username_idx on profiles (username);

-- ============================================================================
-- articles (news)
-- ============================================================================
create table articles (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  excerpt          text,
  body             text not null,
  category         article_category not null,
  game_code        game_code,
  cover_image_path text,
  author_id        uuid references profiles(id) on delete set null,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index articles_status_published_idx on articles (status, published_at desc);
create index articles_category_idx on articles (category);
create index articles_game_idx on articles (game_code);

create table article_comments (
  id         uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  author_id  uuid references profiles(id) on delete set null,
  body       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index article_comments_article_idx on article_comments (article_id, created_at);

-- ============================================================================
-- forum
-- ============================================================================
create table forum_threads (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  body        text not null,
  game_code   game_code not null,
  author_id   uuid references profiles(id) on delete set null,
  image_path  text,
  is_pinned   boolean not null default false,
  is_locked   boolean not null default false,
  reply_count int not null default 0,
  view_count  int not null default 0,
  deleted_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index forum_threads_game_idx on forum_threads (game_code, is_pinned desc, created_at desc);

create table forum_replies (
  id              uuid primary key default gen_random_uuid(),
  thread_id       uuid not null references forum_threads(id) on delete cascade,
  parent_reply_id uuid references forum_replies(id) on delete cascade,
  author_id       uuid references profiles(id) on delete set null,
  body            text not null,
  image_path      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
create index forum_replies_thread_idx on forum_replies (thread_id, created_at);
create index forum_replies_parent_idx on forum_replies (parent_reply_id);

-- ============================================================================
-- Functions & triggers
-- ============================================================================

-- Auto-create a profile row when a new auth user signs up.
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'username', 'New User')
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Block a user from promoting their own role via the self-update RLS policy.
create function prevent_role_escalation() returns trigger
language plpgsql security definer as $$
begin
  -- auth.uid() is null outside a user request context (SQL editor, service_role key).
  -- Those are already trusted/privileged; only guard the self-update RLS path.
  if auth.uid() is null then
    return new;
  end if;

  if new.role is distinct from old.role
     and (select role from profiles where id = auth.uid()) is distinct from 'admin' then
    raise exception 'role change not permitted';
  end if;
  return new;
end;
$$;
create trigger trg_guard_role
  before update on profiles
  for each row execute function prevent_role_escalation();

-- Keep forum_threads.reply_count in sync.
create function bump_thread_reply_count() returns trigger
language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update forum_threads set reply_count = reply_count + 1, updated_at = now() where id = new.thread_id;
  elsif tg_op = 'DELETE' then
    update forum_threads set reply_count = greatest(reply_count - 1, 0) where id = old.thread_id;
  end if;
  return null;
end;
$$;
create trigger trg_reply_count
  after insert or delete on forum_replies
  for each row execute function bump_thread_reply_count();

-- View counter callable by anon/authenticated without a row-level UPDATE grant.
create function increment_thread_view(p_thread_id uuid) returns void
language sql security definer as $$
  update forum_threads set view_count = view_count + 1
  where id = p_thread_id and deleted_at is null;
$$;
grant execute on function increment_thread_view(uuid) to anon, authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table articles enable row level security;
alter table article_comments enable row level security;
alter table forum_threads enable row level security;
alter table forum_replies enable row level security;

-- profiles: public read, self-only write (role escalation blocked by trigger above)
create policy profiles_select_all on profiles for select using (true);
create policy profiles_insert_self on profiles for insert with check (auth.uid() = id);
create policy profiles_update_self on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- articles: public sees published only; admins see + write everything
create policy articles_select on articles for select
  using (status = 'published' or (select role from profiles where id = auth.uid()) = 'admin');
create policy articles_admin_write on articles for all
  using ((select role from profiles where id = auth.uid()) = 'admin')
  with check ((select role from profiles where id = auth.uid()) = 'admin');

-- article_comments: read public, write authenticated-own, delete own-or-admin
create policy comments_select on article_comments for select using (true);
create policy comments_insert on article_comments for insert with check (auth.uid() = author_id);
create policy comments_update_own on article_comments for update using (auth.uid() = author_id);
create policy comments_delete on article_comments for delete
  using (auth.uid() = author_id or (select role from profiles where id = auth.uid()) = 'admin');

-- forum_threads: read public (excl. soft-deleted unless admin); insert own; update = owner or admin
create policy threads_select on forum_threads for select
  using (deleted_at is null or (select role from profiles where id = auth.uid()) = 'admin');
create policy threads_insert on forum_threads for insert with check (auth.uid() = author_id);
create policy threads_update_owner on forum_threads for update using (auth.uid() = author_id);
create policy threads_update_admin on forum_threads for update
  using ((select role from profiles where id = auth.uid()) = 'admin');

-- forum_replies: same shape as threads
create policy replies_select on forum_replies for select
  using (deleted_at is null or (select role from profiles where id = auth.uid()) = 'admin');
create policy replies_insert on forum_replies for insert with check (auth.uid() = author_id);
create policy replies_update_owner on forum_replies for update using (auth.uid() = author_id);
create policy replies_update_admin on forum_replies for update
  using ((select role from profiles where id = auth.uid()) = 'admin');

-- ============================================================================
-- Storage buckets
-- ============================================================================
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('article-covers', 'article-covers', true),
  ('forum-attachments', 'forum-attachments', true)
on conflict (id) do nothing;

-- avatars/{user_id}.{ext} — owner-only write
create policy avatars_write on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_update on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_delete on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- article-covers/{article_id}/{filename} — admin-only write
create policy article_covers_write on storage.objects for insert to authenticated
  with check (bucket_id = 'article-covers' and (select role from profiles where id = auth.uid()) = 'admin');
create policy article_covers_update on storage.objects for update to authenticated
  using (bucket_id = 'article-covers' and (select role from profiles where id = auth.uid()) = 'admin');
create policy article_covers_delete on storage.objects for delete to authenticated
  using (bucket_id = 'article-covers' and (select role from profiles where id = auth.uid()) = 'admin');

-- forum-attachments/{user_id}/{uuid}-{filename} — owner-only write
create policy forum_attachments_write on storage.objects for insert to authenticated
  with check (bucket_id = 'forum-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy forum_attachments_update on storage.objects for update to authenticated
  using (bucket_id = 'forum-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy forum_attachments_delete on storage.objects for delete to authenticated
  using (bucket_id = 'forum-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
