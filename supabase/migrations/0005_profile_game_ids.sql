-- Lets a user mark which games they play and record their in-game ID for each,
-- shown on their profile and editable from /profile/edit.
alter table profiles
  add column if not exists game_ids jsonb not null default '{}'::jsonb;
