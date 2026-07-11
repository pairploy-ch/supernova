'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';

export type CommentFormState = { error?: string } | undefined;

const commentSchema = z.object({
  articleId: z.string().uuid(),
  slug: z.string().min(1),
  body: z.string().min(1, 'กรุณากรอกข้อความ').max(2000, 'ข้อความยาวเกินไป'),
});

export async function postComment(_prevState: CommentFormState, formData: FormData): Promise<CommentFormState> {
  const user = await requireUser();

  const parsed = commentSchema.safeParse({
    articleId: formData.get('articleId'),
    slug: formData.get('slug'),
    body: formData.get('body'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('article_comments').insert({
    article_id: parsed.data.articleId,
    author_id: user.id,
    body: parsed.data.body,
  });

  if (error) return { error: 'ส่งความคิดเห็นไม่สำเร็จ: ' + error.message };

  revalidatePath(`/news/${parsed.data.slug}`);
}
