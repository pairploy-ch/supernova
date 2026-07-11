-- Re-applies the avatars bucket storage policies to guarantee they match the
-- {user_id}/{filename} path convention the app actually uploads to (the original
-- 0001 migration's comment said avatars/{user_id}.{ext} — a flat filename — but its
-- own policy checks storage.foldername(name)[1], which is only non-null for a nested
-- path. That mismatch meant no path ever satisfied the check. Idempotent: safe to
-- run even if the policies are already correct.
drop policy if exists avatars_write on storage.objects;
drop policy if exists avatars_update on storage.objects;
drop policy if exists avatars_delete on storage.objects;

create policy avatars_write on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_update on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_delete on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
