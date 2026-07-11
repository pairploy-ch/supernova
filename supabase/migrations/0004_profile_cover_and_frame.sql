-- Adds a profile cover/banner image and a selectable decorative avatar frame,
-- both editable from /profile/edit and shown on the public profile page.
alter table profiles
  add column if not exists cover_image_url text,
  add column if not exists avatar_frame text not null default 'none';

alter table profiles
  add constraint profiles_avatar_frame_check check (avatar_frame in ('none', 'pink', 'purple', 'gold'));
