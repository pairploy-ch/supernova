// article-covers, avatars, and forum-attachments are all public buckets (see
// supabase/migrations/0001_init.sql), so a public URL can be built without a network call.
export function publicStorageUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
