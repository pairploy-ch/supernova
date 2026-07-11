'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/slugify';

export type ArticleFormState = { error?: string } | undefined;

const MAX_COVER_BYTES = 4 * 1024 * 1024;
const ALLOWED_COVER_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const articleSchema = z.object({
  title: z.string().min(4, 'หัวข้อต้องมีอย่างน้อย 4 ตัวอักษร').max(200),
  excerpt: z.string().max(300).optional(),
  body: z.string().min(1, 'กรุณากรอกเนื้อหา'),
  category: z.enum(['news', 'event', 'gaming_gear', 'aov', 'mol', 'val']),
  status: z.enum(['draft', 'published']),
});

function deriveGameCode(category: string) {
  return category === 'aov' || category === 'mol' || category === 'val' ? category : null;
}

async function uploadCoverIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleId: string,
  formData: FormData
): Promise<{ path?: string; error?: string }> {
  const file = formData.get('cover');
  if (!(file instanceof File) || file.size === 0) return {};

  if (!ALLOWED_COVER_TYPES.includes(file.type)) {
    return { error: 'รองรับเฉพาะไฟล์ PNG, JPEG หรือ WEBP' };
  }
  if (file.size > MAX_COVER_BYTES) {
    return { error: 'ไฟล์ปกต้องมีขนาดไม่เกิน 4MB' };
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${articleId}/cover.${ext}`;

  const { error } = await supabase.storage.from('article-covers').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) return { error: 'อัปโหลดรูปปกไม่สำเร็จ: ' + error.message };
  return { path };
}

export async function createArticle(_prevState: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
  const admin = await requireAdmin();

  const parsed = articleSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt')?.toString() || undefined,
    body: formData.get('body'),
    category: formData.get('category'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();
  const slug = slugify(parsed.data.title) || 'article';

  const { data: inserted, error } = await supabase
    .from('articles')
    .insert({
      slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt ?? null,
      body: parsed.data.body,
      category: parsed.data.category,
      game_code: deriveGameCode(parsed.data.category),
      author_id: admin.id,
      status: parsed.data.status,
      published_at: parsed.data.status === 'published' ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (error || !inserted) return { error: 'สร้างข่าวไม่สำเร็จ: ' + (error?.message ?? 'unknown error') };

  // The article row already exists at this point (slug is claimed and can't be retried
  // via this form), so a cover-upload failure here must not block the redirect — surfacing
  // an error would push the admin to resubmit and hit a duplicate-slug conflict. They can
  // add a cover afterward from the edit page instead.
  const { path } = await uploadCoverIfPresent(supabase, inserted.id, formData);
  if (path) {
    await supabase.from('articles').update({ cover_image_path: path }).eq('id', inserted.id);
  }

  revalidatePath('/admin/articles');
  revalidatePath('/news');
  redirect('/admin/articles');
}

export async function updateArticle(
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdmin();

  const id = formData.get('id')?.toString();
  if (!id) return { error: 'ไม่พบข่าวนี้' };

  const parsed = articleSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt')?.toString() || undefined,
    body: formData.get('body'),
    category: formData.get('category'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();

  const { path, error: coverError } = await uploadCoverIfPresent(supabase, id, formData);
  if (coverError) return { error: coverError };

  const { data: existing } = await supabase.from('articles').select('published_at').eq('id', id).maybeSingle();

  const { error } = await supabase
    .from('articles')
    .update({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt ?? null,
      body: parsed.data.body,
      category: parsed.data.category,
      game_code: deriveGameCode(parsed.data.category),
      status: parsed.data.status,
      published_at:
        parsed.data.status === 'published' ? existing?.published_at ?? new Date().toISOString() : existing?.published_at ?? null,
      ...(path ? { cover_image_path: path } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: 'บันทึกไม่สำเร็จ: ' + error.message };

  revalidatePath('/admin/articles');
  revalidatePath('/news');
  redirect('/admin/articles');
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from('articles').delete().eq('id', id);
  revalidatePath('/admin/articles');
  revalidatePath('/news');
}
